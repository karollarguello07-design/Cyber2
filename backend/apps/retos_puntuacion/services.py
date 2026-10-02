from .models import PerfilEstudiante, Nivel, Insignia, UsuarioInsignia, IntentoReto
from apps.usuarios.telegram_service import notificar_usuario


def obtener_o_crear_perfil(usuario):
    perfil, creado = PerfilEstudiante.objects.get_or_create(usuario=usuario)
    if creado:
        perfil.nivel = Nivel.objects.order_by('numero_nivel').first()
        perfil.save()
    return perfil


def registrar_intento(estudiante, reto, opcion_seleccionada):
    es_correcto = opcion_seleccionada.es_correcta
    xp_otorgado = reto.plantilla.xp_recompensa if es_correcto else 0

    intento = IntentoReto.objects.create(
        estudiante=estudiante,
        reto=reto,
        respuesta_seleccionada=opcion_seleccionada,
        es_correcto=es_correcto,
        xp_otorgado=xp_otorgado,
    )

    if es_correcto:
        actualizar_xp_y_nivel(estudiante, xp_otorgado)
        evaluar_insignias(estudiante)

    return intento


def actualizar_xp_y_nivel(estudiante, xp_ganado):
    perfil = obtener_o_crear_perfil(estudiante)
    nivel_anterior = perfil.nivel
    perfil.xp_total += xp_ganado

    nuevo_nivel = (
        Nivel.objects.filter(xp_minimo__lte=perfil.xp_total)
        .order_by('-numero_nivel')
        .first()
    )
    if nuevo_nivel:
        perfil.nivel = nuevo_nivel

    perfil.save()

    if nuevo_nivel and nivel_anterior != nuevo_nivel:
        notificar_usuario(
            estudiante,
            f' ¡Subiste de nivel! Ahora eres {nuevo_nivel.nombre_nivel} '
            f'(Nivel {nuevo_nivel.numero_nivel}) con {perfil.xp_total} XP.'
        )

    return perfil


def evaluar_insignias(estudiante):
    total_correctos = IntentoReto.objects.filter(
    estudiante=estudiante, es_correcto=True).count()

    if total_correctos >= 1:
        _otorgar_insignia_si_no_existe(estudiante, 'Primer paso')

    if total_correctos >= 5:
        _otorgar_insignia_si_no_existe(estudiante, 'Guardián')


def _otorgar_insignia_si_no_existe(estudiante, nombre_insignia):
    try:
        insignia = Insignia.objects.get(nombre=nombre_insignia)
    except Insignia.DoesNotExist:
        return
    _, creada = UsuarioInsignia.objects.get_or_create(usuario=estudiante, insignia=insignia)
    if creada:
        notificar_usuario(
            estudiante,
            f'¡Nueva insignia desbloqueada: "{insignia.nombre}"! {insignia.descripcion}'
        )



def generar_retos_desde_ataques():
    from apps.cursos.models import Curso
    from apps.honeypot.models import AtaqueHoneypot
    from .models import PlantillaReto, Reto, PreguntaQuiz, OpcionRespuesta

    ataques_pendientes = AtaqueHoneypot.objects.filter(procesado=False)
    cursos_activos = Curso.objects.filter(activo=True)

    retos_creados = 0

    for ataque in ataques_pendientes:
        if not ataque.tipo_ataque:
            ataque.procesado = True
            ataque.save()
            continue

        plantilla = PlantillaReto.objects.filter(tipo_ataque=ataque.tipo_ataque).first()
        if not plantilla or not plantilla.enunciado_pregunta:
            ataque.procesado = True
            ataque.save()
            continue

        for curso in cursos_activos:
            reto, creado = Reto.objects.get_or_create(
                plantilla=plantilla,
                curso=curso,
                defaults={'ataque_origen': ataque, 'activo': True},
            )
            if not creado:
                continue

            pregunta = PreguntaQuiz.objects.create(
                reto=reto,
                enunciado=plantilla.enunciado_pregunta,
                orden=1,
            )
            for opcion_molde in plantilla.opciones_molde.all():
                OpcionRespuesta.objects.create(
                    pregunta=pregunta,
                    texto_opcion=opcion_molde.texto_opcion,
                    es_correcta=opcion_molde.es_correcta,
                )
            retos_creados += 1

            for inscripcion in curso.inscripciones.select_related('estudiante').all():
                notificar_usuario(
                    inscripcion.estudiante,
                    f' Nuevo reto disponible en "{curso.nombre}": {plantilla.titulo} (+{plantilla.xp_recompensa} XP)'
                )
        ataque.procesado = True
        ataque.save()

    return retos_creados

def generar_retos_desde_plantillas():
    from apps.cursos.models import Curso
    from .models import PlantillaReto, Reto, PreguntaQuiz, OpcionRespuesta

    cursos_activos = Curso.objects.filter(activo=True)
    retos_creados = 0

    for plantilla in PlantillaReto.objects.all():
        if not plantilla.enunciado_pregunta:
            continue

        for curso in cursos_activos:
            reto, creado = Reto.objects.get_or_create(
                plantilla=plantilla,
                curso=curso,
                defaults={'activo': True},
            )
            if not creado:
                continue

            retos_creados += 1
            pregunta = PreguntaQuiz.objects.create(
                reto=reto,
                enunciado=plantilla.enunciado_pregunta,
                orden=1,
            )
            for opcion_molde in plantilla.opciones_molde.all():
                OpcionRespuesta.objects.create(
                    pregunta=pregunta,
                    texto_opcion=opcion_molde.texto_opcion,
                    es_correcta=opcion_molde.es_correcta,
                )

    return retos_creados
