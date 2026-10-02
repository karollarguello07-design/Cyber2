from django.core.management.base import BaseCommand
from apps.lecciones.models import Modulo, Leccion

MODULOS = [
    {
        'nombre': 'Phishing e Ingeniería Social',
        'icono': '🎧',
        'orden': 1,
        'descripcion': 'Identifica correos maliciosos, URLs falsas y técnicas de manipulación psicológica usadas por atacantes reales.',
        'lecciones': [
            {
                'titulo': '¿Qué es el phishing?',
                'contenido': (
                    'El phishing es una técnica de ingeniería social donde un atacante se hace pasar '
                    'por una entidad confiable (un banco, una red social, tu propio colegio) para '
                    'engañarte y hacer que entregues información sensible: contraseñas, números de '
                    'tarjeta, datos personales.\n\n'
                    'No se trata de "hackear" una computadora con código complicado — se trata de '
                    'hackear la confianza de una persona. Por eso es una de las formas de ataque más '
                    'efectivas: no importa qué tan segura sea tu contraseña si tú mismo se la entregas '
                    'al atacante sin darte cuenta.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? La palabra "phishing" viene de "fishing" (pescar) — el atacante lanza el anzuelo (un correo falso) y espera a que alguien "muerda".',
                'orden': 1,
            },
            {
                'titulo': 'Cómo identificar un correo falso',
                'contenido': (
                    'Hay señales que casi siempre delatan un correo de phishing: el remitente usa un '
                    'dominio parecido pero no idéntico al real (ej: "netfIix.com" con una "I" mayúscula '
                    'en vez de una "l"), el mensaje crea urgencia ("¡tu cuenta será bloqueada en 24 '
                    'horas!"), y el enlace, al pasar el mouse por encima (sin hacer clic), muestra una '
                    'dirección distinta a la que dice el texto.\n\n'
                    'La regla de oro: ante cualquier mensaje que te pida una acción urgente con tus '
                    'datos, nunca hagas clic directo en el enlace del correo — entra tú mismo escribiendo '
                    'la dirección oficial en el navegador.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? Más del 90% de los ciberataques exitosos comienzan con un correo de phishing, según estudios de seguridad informática.',
                'orden': 2,
            },
        ],
    },
    {
        'nombre': 'Contraseñas Seguras',
        'icono': '🔒',
        'orden': 2,
        'descripcion': 'Aprende a crear contraseñas robustas, usar gestores y entender por qué "123456" es el sueño de un atacante.',
        'lecciones': [
            {
                'titulo': 'Por qué "123456" es un desastre',
                'contenido': (
                    'Las contraseñas simples no son débiles porque "se vean fáciles" — son débiles '
                    'porque los atacantes usan diccionarios: listas con millones de contraseñas '
                    'comunes, probadas automáticamente en segundos contra cualquier cuenta.\n\n'
                    'Una contraseña como "123456" o "contraseña" no tarda ni un segundo en ser '
                    'adivinada por un script. En cambio, una contraseña larga, con mayúsculas, '
                    'números y símbolos, puede tardar literalmente siglos en romperse por fuerza '
                    'bruta.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? "123456" ha sido la contraseña más usada del mundo por años consecutivos, a pesar de aparecer en todas las listas de "peores contraseñas".',
                'orden': 1,
            },
            {
                'titulo': 'Gestores de contraseñas',
                'contenido': (
                    'Nadie puede memorizar 30 contraseñas distintas y seguras — por eso existen los '
                    'gestores de contraseñas: aplicaciones que generan y guardan contraseñas únicas '
                    'y complejas para cada cuenta, protegidas detrás de una sola contraseña maestra '
                    'que sí memorizas.\n\n'
                    'Reutilizar la misma contraseña en varios sitios es un riesgo enorme: si uno de '
                    'esos sitios sufre una filtración de datos, el atacante prueba esa misma '
                    'contraseña en todas tus demás cuentas (esto se llama "credential stuffing", y lo '
                    'vamos a ver más a fondo en el módulo avanzado).'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? Reutilizar contraseñas es tan común que basta con filtrar UNA base de datos para que un atacante pueda entrar a cuentas tuyas en sitios completamente distintos.',
                'orden': 2,
            },
        ],
    },
    {
        'nombre': 'Ataques de Red',
        'icono': '🧠',
        'orden': 3,
        'descripcion': 'Explora cómo funcionan los ataques SSH, fuerza bruta y escaneos de puertos con datos reales de Cowrie.',
        'lecciones': [
            {
                'titulo': '¿Qué es un ataque de fuerza bruta?',
                'contenido': (
                    'Un ataque de fuerza bruta consiste en probar, una tras otra, miles o millones de '
                    'combinaciones de usuario y contraseña, hasta encontrar una que funcione. No hay '
                    'magia ni inteligencia detrás: es pura persistencia automatizada.\n\n'
                    'Nuestro honeypot Cowrie captura este tipo de ataques en tiempo real — cada vez que '
                    'alguien intenta entrar por SSH probando credenciales, queda registrado, y tú puedes '
                    'verlo reflejado en el Panel de Ataques de esta plataforma.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? Un bot puede probar cientos de combinaciones de usuario/contraseña por segundo — algo humanamente imposible de hacer a mano.',
                'orden': 1,
            },
            {
                'titulo': 'SSH y por qué es un blanco común',
                'contenido': (
                    'SSH (Secure Shell) es el protocolo que usan los administradores para controlar '
                    'servidores de forma remota, de manera cifrada y segura. Precisamente por eso es '
                    'tan atacado: si un atacante logra entrar por SSH, tiene control total del sistema.\n\n'
                    'Un honeypot como Cowrie "finge" ser un servidor SSH real y vulnerable, dejando que '
                    'los atacantes crean que lograron entrar — mientras en realidad todo lo que hacen '
                    'queda grabado para fines de investigación y educación, sin poner en riesgo ningún '
                    'sistema real.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? El puerto estándar de SSH es el 22 — por eso es uno de los puertos más escaneados y atacados de internet.',
                'orden': 2,
            },
        ],
    },
    {
        'nombre': 'Protección de Datos',
        'icono': '🛡️',
        'orden': 4,
        'descripcion': 'Cifrado, privacidad, RGPD y cómo proteger tu información personal en redes sociales y servicios digitales.',
        'lecciones': [
            {
                'titulo': '¿Qué es el cifrado?',
                'contenido': (
                    'El cifrado convierte información legible en un código ilegible, que solo puede '
                    'volver a su forma original con una "llave" específica. Es la razón por la que, '
                    'aunque alguien intercepte tus mensajes de WhatsApp en el camino, no puede leerlos '
                    'sin esa llave.\n\n'
                    'Cuando ves el candado 🔒 en la barra de direcciones de tu navegador, significa que '
                    'la conexión entre tú y esa página está cifrada (HTTPS) — tus datos viajan protegidos, '
                    'no en texto plano que cualquiera podría leer.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? Sin HTTPS, cualquier persona conectada a la misma red WiFi pública que tú podría leer literalmente todo lo que escribes en una página.',
                'orden': 1,
            },
            {
                'titulo': 'Cuida tu huella digital',
                'contenido': (
                    'Cada publicación, comentario o foto que subes a internet queda formando parte de tu '
                    '"huella digital" — un rastro de información sobre ti que puede ser usado, con o sin '
                    'mala intención, por otras personas (o empresas).\n\n'
                    'Revisar la configuración de privacidad de tus redes sociales, pensar antes de '
                    'publicar datos como tu ubicación en tiempo real, y no aceptar solicitudes de '
                    'desconocidos son hábitos simples que reducen muchísimo tu exposición a riesgos '
                    'como el acoso, el robo de identidad o el phishing dirigido.'
                ),
                'dato_curioso': '💡 ¿Sabías qué...? Muchos ataques de phishing "personalizado" (spear phishing) se arman usando información que la propia víctima publicó en redes sociales.',
                'orden': 2,
            },
        ],
    },
]


class Command(BaseCommand):
    help = 'Siembra el contenido básico de Módulos y Lecciones (idempotente, seguro de correr varias veces)'

    def handle(self, *args, **options):
        modulos_creados = 0
        lecciones_creadas = 0

        for datos_modulo in MODULOS:
            modulo, creado = Modulo.objects.get_or_create(
                nombre=datos_modulo['nombre'],
                defaults={
                    'descripcion': datos_modulo['descripcion'],
                    'icono': datos_modulo['icono'],
                    'orden': datos_modulo['orden'],
                    'nivel': Modulo.Nivel.BASICO,
                },
            )
            if creado:
                modulos_creados += 1
            else:
                modulo.descripcion = datos_modulo['descripcion']
                modulo.icono = datos_modulo['icono']
                modulo.orden = datos_modulo['orden']
                modulo.nivel = Modulo.Nivel.BASICO
                modulo.save()

            for datos_leccion in datos_modulo['lecciones']:
                _, creada = Leccion.objects.update_or_create(
                    modulo=modulo,
                    orden=datos_leccion['orden'],
                    defaults={
                        'titulo': datos_leccion['titulo'],
                        'contenido': datos_leccion['contenido'],
                        'dato_curioso': datos_leccion['dato_curioso'],
                    },
                )
                if creada:
                    lecciones_creadas += 1

        self.stdout.write(self.style.SUCCESS(
            f'Listo: {modulos_creados} módulos nuevos, {lecciones_creadas} lecciones nuevas '
            f'(el resto ya existía y fue actualizado).'
        ))
