from django.core.management.base import BaseCommand
from apps.lecciones.models import Modulo, TarjetaEstudio


def tarjeta(orden, icono, titulo, analogia, peligro, que_es, como_se_ve, como_defenderse, solo_teoria=False):
    return {
        'orden': orden, 'icono': icono, 'titulo': titulo, 'analogia': analogia,
        'peligro': peligro, 'que_es': que_es, 'como_se_ve': como_se_ve,
        'como_defenderse': como_defenderse, 'solo_teoria': solo_teoria,
    }


MODULOS = [
    {
        'nombre': 'Ataques que captura Cowrie',
        'icono': '🐝',
        'orden': 1,
        'descripcion': 'Los 9 ataques reales que puedes practicar y ver capturados en vivo por el honeypot.',
        'tarjetas': [
            tarjeta(1, '🔨', 'Fuerza bruta SSH',
                "Es como probar todas las llaves de un llavero gigante, una por una, hasta que alguna abra la puerta.",
                2,
                "Un bot prueba combinaciones de usuario y contraseña contra el puerto SSH (22) a gran velocidad. No piensa: solo insiste.",
                "Cientos de eventos 'login failed' en pocos segundos, casi siempre desde la misma IP y con usuarios típicos como root o admin.",
                "Contraseñas largas y únicas, bloquear IPs tras varios fallos (fail2ban) y no permitir el acceso de root por SSH."),
            tarjeta(2, '📖', 'Ataque de diccionario',
                "En vez de probar todas las llaves, el atacante usa solo las que más gente usa.",
                2,
                "Es una fuerza bruta más inteligente: prueba contraseñas de una lista con las claves más comunes, como 123456, password o qwerty.",
                "Intentos con contraseñas reales y predecibles, no combinaciones al azar. Las mismas palabras se repiten en ataques distintos.",
                "Evita palabras comunes y fechas. Una frase larga como 'MiGatoCome3Peces!' resiste mucho más que 'gato2024'."),
            tarjeta(3, '📡', 'Escaneo de puertos (Nmap)',
                "Es como caminar por un edificio tocando cada puerta para ver cuáles quedaron sin seguro.",
                1,
                "El atacante revisa qué puertos están abiertos en un servidor y qué servicios corren detrás, para elegir por dónde entrar.",
                "Muchas conexiones muy cortas a puertos distintos desde la misma IP, casi sin intentar iniciar sesión.",
                "Cierra los puertos que no uses, activa un firewall y vigila los escaneos: suelen ser el primer paso de un ataque mayor."),
            tarjeta(4, '🚪', 'Post-explotación tras acceso exitoso',
                "El ladrón ya entró a la casa… ahora recorre las habitaciones buscando qué llevarse.",
                3,
                "Es lo que hace el atacante una vez que logra entrar: ejecuta comandos para explorar el sistema, robar datos o prepararse para quedarse.",
                "Después de un 'login success' aparecen comandos escritos dentro de la sesión (whoami, ls, cat…). En Cowrie todo queda grabado.",
                "Da a cada usuario solo los permisos que necesita (mínimo privilegio) y monitorea sesiones con comportamiento extraño."),
            tarjeta(5, '⬇️', 'Descarga de malware',
                "El intruso llega con una caja de herramientas escondida y la descarga dentro de tu casa.",
                3,
                "El atacante usa comandos como wget o curl para bajar un archivo malicioso al sistema comprometido y ejecutarlo.",
                "Un evento de descarga con la URL de origen y el archivo guardado. Cowrie lo captura sin dejar que haga daño real.",
                "Limita las conexiones salientes del servidor, mantén el sistema actualizado y usa antivirus en equipos reales."),
            tarjeta(6, '🔑', 'Credential Stuffing',
                "Si te robaron la llave de tu casa, el ladrón prueba esa misma llave en tu colegio, tu bici y tu casillero.",
                2,
                "Se usan usuarios y contraseñas filtrados de otros sitios para entrar a cuentas nuevas, apostando a que reutilizas la misma clave.",
                "Pares usuario/contraseña reales y consistentes, no combinaciones al azar, con pocos intentos por cada cuenta.",
                "Una contraseña distinta para cada servicio, un gestor de contraseñas y verificación en dos pasos (2FA)."),
            tarjeta(7, '🕵️', 'Reconocimiento del sistema',
                "Antes de robar, el intruso mira el plano: ¿qué sistema es? ¿quién vive aquí? ¿qué hay de valor?",
                2,
                "Tras entrar, el atacante recopila información: versión del sistema, usuarios, red y programas instalados.",
                "Comandos de 'preguntar' (uname, whoami, id…) uno detrás de otro, en cuestión de segundos.",
                "Registra y alerta sobre comandos de exploración inusuales: un servidor normal casi nunca los ejecuta en ráfaga."),
            tarjeta(8, '👥', 'Enumeración de usuarios',
                "Es como leer la lista de nombres del timbre de un edificio para saber a quién llamar.",
                2,
                "El atacante descubre qué cuentas existen en el sistema para luego atacarlas con contraseñas.",
                "Lectura de archivos de usuarios (como /etc/passwd) o intentos con muchos nombres de usuario distintos.",
                "No reveles si un usuario existe al fallar el login, desactiva cuentas que no uses y evita nombres predecibles."),
            tarjeta(9, '💣', 'Ejecución de scripts maliciosos',
                "Es dejar una máquina trampa programada para que haga el trabajo sucio sola.",
                3,
                "El atacante corre un script, un programa automatizado, que ejecuta muchas acciones: instalar cosas, borrar huellas, abrir puertas traseras.",
                "Una secuencia larga de comandos casi simultáneos, demasiado rápida para ser una persona escribiendo.",
                "Restringe qué se puede ejecutar, revisa los scripts antes de correrlos y desconfía de lo que descargas."),
        ],
    },
    {
        'nombre': 'Técnicas avanzadas de intrusión',
        'icono': '🧬',
        'orden': 2,
        'descripcion': 'Qué hacen los atacantes cuando ya están dentro. Solo teoría: se estudian, no se practican en vivo.',
        'tarjetas': [
            tarjeta(1, '🤖', 'Instalación de botnets',
                "Convertir miles de computadores en un ejército de zombis que obedecen a un mismo jefe.",
                3,
                "Una botnet es una red de dispositivos infectados y controlados a distancia. Sirve para ataques masivos, spam o robo de datos, y el dueño ni se entera.",
                "Un equipo infectado contacta cada cierto tiempo a un servidor de comando y control (C2) esperando órdenes.",
                "Mantén todo actualizado, cambia las contraseñas por defecto de routers y cámaras, y vigila conexiones salientes sospechosas.",
                True),
            tarjeta(2, '🧷', 'Persistencia',
                "Es copiar la llave de tu casa para volver a entrar cuando quieras, aunque cambies la cerradura.",
                3,
                "Técnicas para mantener el acceso aunque el sistema se reinicie o cambies la contraseña: tareas programadas, cuentas ocultas, llaves SSH añadidas.",
                "Cambios en las tareas programadas (cron), llaves autorizadas nuevas o usuarios que nadie creó.",
                "Audita con regularidad tareas programadas, usuarios y llaves SSH autorizadas.",
                True),
            tarjeta(3, '🧭', 'Movimiento lateral',
                "Entró por la ventana del baño y ahora va de cuarto en cuarto hasta llegar a la caja fuerte.",
                3,
                "Desde un equipo ya comprometido, el atacante salta a otros equipos de la misma red buscando uno más valioso.",
                "Conexiones internas inesperadas entre máquinas que normalmente no se comunican entre sí.",
                "Segmenta la red en zonas, usa credenciales distintas por equipo y monitorea el tráfico interno.",
                True),
            tarjeta(4, '⛏️', 'Minería de criptomonedas',
                "Alguien usa tu electricidad y tu computador para fabricar dinero para él, y tú pagas la cuenta.",
                2,
                "El atacante instala un programa que usa tu CPU para minar criptomonedas sin permiso. No busca robar datos, sino aprovechar tu poder de cómputo.",
                "Un proceso que mantiene la CPU casi al 100% todo el tiempo y conexiones hacia 'pools' de minería.",
                "Vigila el consumo anormal de CPU, restringe qué se puede instalar y mantén el software al día.",
                True),
        ],
    },
]


class Command(BaseCommand):
    help = 'Siembra los módulos avanzados y sus tarjetas de estudio (seguro de correr varias veces)'

    def handle(self, *args, **options):
        total = 0
        for datos in MODULOS:
            modulo, _ = Modulo.objects.get_or_create(
                nombre=datos['nombre'],
                defaults={'descripcion': datos['descripcion'], 'icono': datos['icono'],
                          'orden': datos['orden'], 'nivel': Modulo.Nivel.AVANZADO},
            )
            modulo.descripcion = datos['descripcion']
            modulo.icono = datos['icono']
            modulo.orden = datos['orden']
            modulo.nivel = Modulo.Nivel.AVANZADO
            modulo.save()

            for t in datos['tarjetas']:
                TarjetaEstudio.objects.update_or_create(
                    modulo=modulo, orden=t['orden'],
                    defaults={k: v for k, v in t.items() if k != 'orden'},
                )
                total += 1

        self.stdout.write(self.style.SUCCESS(f'Listo: {total} tarjetas de estudio cargadas en {len(MODULOS)} módulos avanzados.'))
