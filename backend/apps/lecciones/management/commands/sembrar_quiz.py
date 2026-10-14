from django.core.management.base import BaseCommand
from apps.lecciones.models import Modulo, QuizPregunta, QuizOpcion


def pregunta(orden, enunciado, correcta, incorrectas, explicacion, xp=5):
    opciones = list(incorrectas)
    opciones.insert(orden % 4, correcta)
    return {
        'orden': orden, 'enunciado': enunciado, 'explicacion': explicacion, 'xp': xp,
        'opciones': [{'texto': t, 'es_correcta': t == correcta} for t in opciones],
    }


QUIZ = [
    {
        'modulo': 'Phishing e Ingeniería Social',
        'preguntas': [
            pregunta(1, "¿Qué es el phishing?",
                "Engañar a alguien haciéndose pasar por una entidad de confianza para robar sus datos",
                ["Un virus que daña el computador por sí solo", "Una técnica para acelerar tu internet", "Un programa que borra archivos viejos"],
                "El phishing es ingeniería social: el atacante lanza un anzuelo (un mensaje falso) y espera que caigas."),
            pregunta(2, "Te llega un correo de «netfIix.com» que dice: «Tu cuenta será bloqueada en 24 horas». ¿Qué haces?",
                "No hago clic: entro yo mismo escribiendo la dirección oficial en el navegador",
                ["Hago clic rápido para no perder la cuenta", "Respondo el correo con mi contraseña", "Reenvío el correo a todos mis contactos"],
                "Dos señales de alerta: el dominio parecido pero distinto y la urgencia. Siempre entra por la dirección oficial."),
            pregunta(3, "¿Cómo compruebas a dónde lleva realmente un enlace sin abrirlo?",
                "Pasando el mouse por encima y leyendo la dirección real que aparece",
                ["Confiando en lo que dice el texto del enlace", "Abriéndolo en una ventana privada", "Revisando si tiene muchas mayúsculas"],
                "El texto del enlace puede mentir, pero la dirección real aparece al pasar el mouse."),
            pregunta(4, "¿Qué hace un atacante que usa ingeniería social?",
                "Manipula a las personas con confianza, miedo o urgencia para que hagan lo que él quiere",
                ["Rompe contraseñas usando programas muy potentes", "Cifra tus mensajes para protegerlos", "Instala antivirus en tus redes sociales"],
                "La ingeniería social no ataca a las máquinas sino a las personas."),
        ],
    },
    {
        'modulo': 'Contraseñas Seguras',
        'preguntas': [
            pregunta(1, "¿Por qué «123456» es una contraseña tan mala?",
                "Está en las listas que los atacantes prueban primero y cae en menos de un segundo",
                ["Porque los números no se pueden guardar en un sitio web", "Porque es muy difícil de recordar", "Porque todos los sitios la bloquean siempre"],
                "Los bots prueban primero las contraseñas más comunes. «123456» lidera esas listas."),
            pregunta(2, "¿Cuál de estas contraseñas es la más fuerte?",
                "MiGatoCome3Peces!",
                ["gato2024", "Carlos123", "qwerty"],
                "Una frase larga y única resiste mucho más que una palabra corta con un número."),
            pregunta(3, "¿Por qué es peligroso usar la misma contraseña en varias cuentas?",
                "Si filtran una, el atacante la prueba en todas tus otras cuentas (credential stuffing)",
                ["Porque el celular se llena de memoria", "Porque los sitios cobran por repetir contraseñas", "Porque se olvidan más rápido"],
                "Una sola filtración puede abrirte muchas puertas si reutilizas la clave."),
            pregunta(4, "¿Qué es la verificación en dos pasos (2FA)?",
                "Un segundo código además de la contraseña, para que la contraseña sola no baste",
                ["Escribir la contraseña dos veces", "Tener dos cuentas con la misma clave", "Cambiar la contraseña cada dos días"],
                "Aunque roben tu contraseña, sin el segundo código no pueden entrar."),
        ],
    },
    {
        'modulo': 'Ataques de Red',
        'preguntas': [
            pregunta(1, "¿Qué es un ataque de fuerza bruta?",
                "Probar combinaciones de usuario y contraseña, una tras otra, hasta acertar",
                ["Romper físicamente un servidor", "Enviar correos falsos masivos", "Apagar un sitio con millones de visitas falsas"],
                "No hay magia: es insistencia automatizada, probando miles de combinaciones."),
            pregunta(2, "¿Qué significa que el puerto 22 esté abierto?",
                "Que hay un servicio escuchando ahí (SSH) y los atacantes pueden intentar entrar por esa puerta",
                ["Que el computador está apagado", "Que el router está roto", "Que la contraseña ya fue robada"],
                "Un puerto abierto es una puerta disponible. Por eso conviene cerrar los que no se usan."),
            pregunta(3, "¿Para qué sirve un honeypot como Cowrie?",
                "Es un señuelo que parece vulnerable para observar y registrar ataques sin arriesgar sistemas reales",
                ["Para bloquear todos los ataques automáticamente", "Para guardar copias de seguridad", "Para acelerar la conexión SSH"],
                "El honeypot no evita ataques: los observa y los graba para aprender de ellos."),
            pregunta(4, "Cowrie registra cientos de intentos fallidos en segundos desde la misma IP. ¿Qué es lo más probable?",
                "Un bot automatizado haciendo fuerza bruta",
                ["Una persona escribiendo muy rápido", "Un error de la red", "Una actualización del sistema"],
                "Ninguna persona puede escribir cientos de contraseñas por segundo: es un bot."),
        ],
    },
    {
        'modulo': 'Protección de Datos',
        'preguntas': [
            pregunta(1, "¿Qué te indica el candado (HTTPS) en la barra del navegador?",
                "Que la conexión con esa página va cifrada, así que otros no pueden leer lo que envías",
                ["Que la página es totalmente confiable y nunca puede ser falsa", "Que la página no tiene anuncios", "Que es una página del gobierno"],
                "El candado protege el camino de tus datos, pero no garantiza que la página sea honesta."),
            pregunta(2, "¿Qué es tu huella digital?",
                "El rastro de información que dejas con lo que publicas, comentas y buscas en internet",
                ["La huella de tu dedo guardada en el celular", "Un virus que copia tus fotos", "El historial de llamadas"],
                "Todo lo que publicas deja un rastro que otros pueden usar, incluso los atacantes."),
            pregunta(3, "¿Qué haces para proteger tu privacidad en redes sociales?",
                "Perfil en privado, aceptar solo a quienes conozco y no compartir mi ubicación en tiempo real",
                ["Aceptar a todos para tener más seguidores", "Publicar dónde estudio y a qué hora salgo", "Usar el mismo nombre de usuario en todas partes"],
                "Menos información pública significa menos material para quien quiera engañarte."),
            pregunta(4, "Una app de linterna te pide permiso para tus contactos y tu ubicación. ¿Qué haces?",
                "Niego esos permisos: una linterna no los necesita",
                ["Acepto todo sin leer", "Acepto porque todas las apps lo piden", "Acepto y luego la desinstalo"],
                "Da solo los permisos que la app realmente necesita para funcionar."),
        ],
    },
]


class Command(BaseCommand):
    help = 'Siembra las preguntas del Quiz (seguro de correr varias veces; no pisa las opciones ya cargadas)'

    def handle(self, *args, **options):
        total = 0
        for datos in QUIZ:
            try:
                modulo = Modulo.objects.get(nombre=datos['modulo'])
            except Modulo.DoesNotExist:
                self.stderr.write(self.style.WARNING(
                    f"No existe el módulo «{datos['modulo']}». Corre antes sembrar_tarjetas_basico."
                ))
                continue
            for p in datos['preguntas']:
                pre, creada = QuizPregunta.objects.update_or_create(
                    modulo=modulo, orden=p['orden'],
                    defaults={'enunciado': p['enunciado'], 'explicacion': p['explicacion'], 'xp': p['xp']},
                )
                if creada or not pre.opciones.exists():
                    for o in p['opciones']:
                        QuizOpcion.objects.create(pregunta=pre, texto=o['texto'], es_correcta=o['es_correcta'])
                total += 1
        self.stdout.write(self.style.SUCCESS(f'Listo: {total} preguntas de Quiz cargadas.'))
