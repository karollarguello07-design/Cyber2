from django.core.management.base import BaseCommand
from apps.lecciones.models import Modulo, TarjetaEstudio


def tarjeta(orden, icono, titulo, analogia, peligro, que_es, como_se_ve, como_defenderse):
    return {
        'orden': orden, 'icono': icono, 'titulo': titulo, 'analogia': analogia,
        'peligro': peligro, 'que_es': que_es, 'como_se_ve': como_se_ve,
        'como_defenderse': como_defenderse, 'solo_teoria': False,
    }


MODULOS = [
    {
        'nombre': 'Phishing e Ingeniería Social',
        'icono': '🎧',
        'orden': 1,
        'descripcion': 'Identifica correos maliciosos, URLs falsas y técnicas de manipulación psicológica usadas por atacantes reales.',
        'tarjetas': [
            tarjeta(1, '🎣', '¿Qué es el phishing?',
                "El pescador lanza un anzuelo con carnada falsa y espera a que alguien muerda.",
                3,
                "Un atacante se hace pasar por alguien de confianza (un banco, una red social, tu colegio) para que le entregues contraseñas o datos personales.",
                "Un mensaje que parece oficial, con logos reales, pero que te presiona a actuar rápido: «¡Tu cuenta será bloqueada hoy!».",
                "Nunca entregues datos por mensaje. Si dudas, entra tú mismo al sitio oficial escribiendo la dirección en el navegador."),
            tarjeta(2, '📧', 'Correo falso: las señales',
                "Un billete falso se ve casi igual, pero si lo miras a contraluz, hay detalles que fallan.",
                2,
                "Los correos de phishing se disfrazan de mensajes reales, pero casi siempre dejan pistas si sabes dónde mirar.",
                "Remitente con dominio parecido pero distinto (netfIix.com), errores de ortografía, saludo genérico («Estimado cliente») y adjuntos que no esperabas.",
                "Pasa el mouse sobre el enlace sin hacer clic y mira la dirección real. Si no coincide con lo que dice el texto, es falso."),
            tarjeta(3, '🔗', 'Enlaces y páginas falsas',
                "Es como una tienda idéntica a la real, pero montada en otra calle para robarte la billetera.",
                3,
                "El atacante copia el diseño de una página conocida (banco, red social) para que escribas ahí tu usuario y contraseña, y así quedarse con ellos.",
                "La dirección tiene letras cambiadas o terminaciones raras (.xyz, .top), o te pide iniciar sesión sin que lo hayas pedido. Ojo: hoy también hay páginas falsas con candado.",
                "Guarda en favoritos los sitios importantes, revisa la dirección completa antes de escribir tus datos y activa la verificación en dos pasos."),
            tarjeta(4, '🎭', 'Ingeniería social',
                "No rompe la puerta: te convence de que se la abras tú.",
                3,
                "Es manipular a las personas, no a las máquinas. El atacante usa la confianza, la urgencia o el miedo para que hagas lo que él quiere, por correo, mensaje de texto o llamada.",
                "Alguien que dice ser del banco o de soporte técnico, te presiona para actuar ya y te pide códigos, claves o instalar un programa.",
                "Desconfía de la urgencia. Nunca compartas códigos de verificación y cuelga para llamar tú al número oficial."),
        ],
    },
    {
        'nombre': 'Contraseñas Seguras',
        'icono': '🔒',
        'orden': 2,
        'descripcion': 'Aprende a crear contraseñas robustas, usar gestores y entender por qué "123456" es el sueño de un atacante.',
        'tarjetas': [
            tarjeta(1, '🔢', '¿Por qué «123456» es un desastre?',
                "Es como poner «1234» de candado en tu bicicleta: cualquiera la abre en un segundo.",
                3,
                "Los atacantes usan listas con millones de contraseñas comunes y las prueban automáticamente. «123456» o «contraseña» caen en menos de un segundo.",
                "En los registros de Cowrie, las contraseñas más probadas son siempre las mismas: 123456, password, admin, root.",
                "Evita claves cortas, con tu nombre o con fechas. Mientras más larga, mejor."),
            tarjeta(2, '🧱', 'Cómo crear una contraseña fuerte',
                "Una frase larga es como un muro alto: cuesta mucho más escalarla.",
                2,
                "Una contraseña fuerte es larga, única y difícil de adivinar. La longitud pesa más que los símbolos raros.",
                "Débil: «gato2024». Fuerte: «MiGatoCome3Peces!» (una frase fácil de recordar para ti, pero muy difícil para un bot).",
                "Usa frases de 12 o más caracteres, mezcla mayúsculas, números y símbolos, y nunca uses datos personales."),
            tarjeta(3, '♻️', 'Reutilizar contraseñas',
                "Es usar la misma llave para tu casa, tu casillero y tu bicicleta: si pierdes una, pierdes todo.",
                3,
                "Si usas la misma clave en varios sitios y uno sufre una filtración, el atacante la prueba en todas tus demás cuentas (credential stuffing).",
                "Alguien entra a una cuenta tuya con la contraseña correcta, aunque nunca se la diste: la sacó de otro sitio filtrado.",
                "Una contraseña distinta para cada cuenta. Revisa si tu correo apareció en alguna filtración (por ejemplo, en Have I Been Pwned)."),
            tarjeta(4, '🔐', 'Gestores y verificación en dos pasos',
                "El gestor es una caja fuerte con una sola llave; el 2FA es un segundo candado en la puerta.",
                2,
                "Un gestor de contraseñas crea y guarda claves únicas por ti. La verificación en dos pasos (2FA) pide un segundo código, además de la contraseña.",
                "Alguien tiene tu contraseña pero no puede entrar, porque le falta el código que llega a tu celular.",
                "Activa el 2FA en tus cuentas más importantes (correo, redes, banco) y usa un gestor con una contraseña maestra larga."),
        ],
    },
    {
        'nombre': 'Ataques de Red',
        'icono': '🧠',
        'orden': 3,
        'descripcion': 'Explora cómo funcionan los ataques SSH, fuerza bruta y escaneos de puertos con datos reales de Cowrie.',
        'tarjetas': [
            tarjeta(1, '🌐', 'Puertos: las puertas de internet',
                "Un computador tiene miles de puertas numeradas, y cada servicio atiende en una.",
                1,
                "Los puertos son canales numerados por donde un equipo recibe conexiones: el 80 y el 443 para la web, el 22 para SSH.",
                "Los atacantes revisan qué puertos están abiertos para saber por dónde intentar entrar.",
                "Mientras menos puertos abiertos tengas, menos puertas hay que vigilar. Cierra lo que no uses."),
            tarjeta(2, '🖥️', 'SSH y por qué lo atacan',
                "Es la puerta de servicio por donde los administradores entran a controlar un servidor a distancia.",
                2,
                "SSH es el protocolo para manejar servidores de forma remota y cifrada. Si un atacante entra por ahí, controla todo el sistema.",
                "El puerto 22 es de los más escaneados de internet. Un honeypot como Cowrie finge ser un servidor SSH real para atraer a los atacantes.",
                "Cambia las claves por defecto, usa llaves SSH en vez de contraseñas y limita quién puede conectarse."),
            tarjeta(3, '🔨', 'Fuerza bruta',
                "Es probar todas las llaves de un llavero gigante hasta que una abra la puerta.",
                2,
                "Un bot prueba miles de combinaciones de usuario y contraseña, una tras otra, hasta acertar. No es inteligencia: es insistencia automatizada.",
                "Cowrie registra cientos de intentos fallidos en segundos desde la misma IP. Lo puedes ver en el Panel de Ataques.",
                "Contraseñas largas, bloqueo tras varios fallos y no dejar el acceso remoto abierto sin necesidad."),
            tarjeta(4, '🍯', '¿Qué es un honeypot?',
                "Es un frasco de miel puesto a propósito para ver quién se acerca, sin que pierdas nada real.",
                1,
                "Un honeypot es un sistema señuelo que parece vulnerable. No evita los ataques: los observa y los graba para aprender de ellos.",
                "Cowrie deja que el atacante crea que entró, mientras registra cada contraseña probada y cada comando escrito.",
                "Sirven para estudiar amenazas y detectar ataques a tiempo. Nunca los pongas en la misma red que sistemas reales sin aislarlos."),
        ],
    },
    {
        'nombre': 'Protección de Datos',
        'icono': '🛡️',
        'orden': 4,
        'descripcion': 'Cifrado, privacidad, RGPD y cómo proteger tu información personal en redes sociales y servicios digitales.',
        'tarjetas': [
            tarjeta(1, '🔒', '¿Qué es el cifrado?',
                "Es escribir tu mensaje en un código secreto que solo se entiende con la llave correcta.",
                2,
                "El cifrado convierte información legible en un código ilegible. Solo quien tiene la llave puede volver a leerla.",
                "El candado del navegador (HTTPS) indica que la conexión va cifrada. Sin HTTPS, en una WiFi pública otros podrían leer lo que escribes.",
                "Usa sitios con HTTPS, evita iniciar sesión en WiFi públicas y prefiere apps de mensajes con cifrado."),
            tarjeta(2, '👣', 'Tu huella digital',
                "Todo lo que publicas es como caminar sobre cemento fresco: deja una huella difícil de borrar.",
                2,
                "Cada foto, comentario o ubicación que subes forma tu huella digital: un rastro que otras personas y empresas pueden usar.",
                "Con lo que publicas, alguien puede saber dónde estudias, a qué hora sales y quiénes son tus amigos. Los atacantes usan eso para engañarte mejor.",
                "Piensa antes de publicar, no compartas tu ubicación en tiempo real y revisa la privacidad de tus redes."),
            tarjeta(3, '🕵️', 'Privacidad en redes sociales',
                "Es decidir quién entra a tu casa: cualquiera, solo tus amigos o nadie.",
                2,
                "Las redes sociales tienen opciones para controlar quién ve tus publicaciones, quién te escribe y qué datos de tu perfil son públicos.",
                "Un perfil público muestra tu nombre, tu colegio, tus fotos y tus amigos a cualquier desconocido.",
                "Pon tu perfil en privado, acepta solo a quienes conoces y desactiva la ubicación en tus fotos."),
            tarjeta(4, '⚖️', 'Tus datos son tuyos',
                "Tu información personal es como tu casa: nadie debería entrar ni usarla sin tu permiso.",
                1,
                "Las leyes de protección de datos (en Colombia, la Ley 1581 de 2012; en Europa, el RGPD) te dan derechos: saber qué datos tienen de ti, corregirlos y pedir que los borren.",
                "Cuando una app te pide permisos o que aceptes términos, te está pidiendo permiso para usar tus datos.",
                "Lee qué permisos vas a dar, entrega solo los datos necesarios y usa tu derecho a pedir que borren tu información."),
        ],
    },
]


class Command(BaseCommand):
    help = 'Siembra las tarjetas de estudio de los módulos básicos (seguro de correr varias veces)'

    def handle(self, *args, **options):
        total = 0
        for datos in MODULOS:
            modulo, _ = Modulo.objects.get_or_create(
                nombre=datos['nombre'],
                defaults={'descripcion': datos['descripcion'], 'icono': datos['icono'],
                          'orden': datos['orden'], 'nivel': Modulo.Nivel.BASICO},
            )
            for t in datos['tarjetas']:
                TarjetaEstudio.objects.update_or_create(
                    modulo=modulo, orden=t['orden'],
                    defaults={k: v for k, v in t.items() if k != 'orden'},
                )
                total += 1

        self.stdout.write(self.style.SUCCESS(f'Listo: {total} tarjetas cargadas en {len(MODULOS)} módulos básicos.'))
