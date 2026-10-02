from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import AtaqueHoneypot
from .serializers import AtaqueHoneypotSerializer

from django.core.management import call_command


class AtaquesListaView(generics.ListAPIView):
    serializer_class = AtaqueHoneypotSerializer
    permission_classes = [permissions.IsAuthenticated]

    queryset = AtaqueHoneypot.objects.all().order_by('-timestamp_evento')[:5]


class EstadisticasAtaquesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        ahora = timezone.localtime(timezone.now())
        hoy = ahora.date()

        # -----------------------------------------
        # ESTADÍSTICAS GENERALES
        # -----------------------------------------

        total_ataques = AtaqueHoneypot.objects.count()

        ataques_hoy = AtaqueHoneypot.objects.filter(
            timestamp_evento__date=hoy
        ).count()

        ips_unicas = AtaqueHoneypot.objects.values(
            'ip_origen'
        ).distinct().count()

        usuarios_unicos = (
            AtaqueHoneypot.objects
            .exclude(usuario_probado='')
            .values('usuario_probado')
            .distinct()
            .count()
        )

        contrasenas_unicas = (
            AtaqueHoneypot.objects
            .exclude(contrasena_probada='')
            .values('contrasena_probada')
            .distinct()
            .count()
        )

        comandos = (
            AtaqueHoneypot.objects
            .exclude(detalle='')
            .count()
        )

        # -----------------------------------------
        # USUARIOS MÁS UTILIZADOS
        # -----------------------------------------

        usuarios_top = (
            AtaqueHoneypot.objects
            .exclude(usuario_probado='')
            .values('usuario_probado')
            .annotate(total=Count('id'))
            .order_by('-total')[:5]
        )

        # -----------------------------------------
        # CONTRASEÑAS MÁS UTILIZADAS
        # -----------------------------------------

        contrasenas_top = (
            AtaqueHoneypot.objects
            .exclude(contrasena_probada='')
            .values('contrasena_probada')
            .annotate(total=Count('id'))
            .order_by('-total')[:5]
        )

        # -----------------------------------------
        # TIPOS DE ATAQUE
        # -----------------------------------------

        tipos_ataque = (
            AtaqueHoneypot.objects
            .filter(tipo_ataque__isnull=False)
            .values('tipo_ataque__nombre')
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        tipos_ataque = [
            {
                'nombre': item['tipo_ataque__nombre'],
                'total': item['total']
            }
            for item in tipos_ataque
        ]

        # -----------------------------------------
        # PROTOCOLOS
        # -----------------------------------------

        protocolos = (
            AtaqueHoneypot.objects
            .exclude(protocolo='')
            .values('protocolo')
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        # -----------------------------------------
        # ÚLTIMO ATAQUE
        # -----------------------------------------

        ultimo_ataque = (
            AtaqueHoneypot.objects
            .order_by('-timestamp_evento')
            .first()
        )

        ultimo_ataque_data = None

        if ultimo_ataque:
            ultimo_ataque_data = {
                'id': ultimo_ataque.id,
                'ip_origen': ultimo_ataque.ip_origen,
                'tipo_ataque': (
                    ultimo_ataque.tipo_ataque.nombre
                    if ultimo_ataque.tipo_ataque
                    else None
                ),
                'usuario_probado': ultimo_ataque.usuario_probado,
                'protocolo': ultimo_ataque.protocolo,
                'detalle': ultimo_ataque.detalle,
                'timestamp_evento': ultimo_ataque.timestamp_evento,
            }

        # -----------------------------------------
        # ATAQUES DE LAS ÚLTIMAS 24 HORAS
        # -----------------------------------------

        hace_24_horas = ahora - timedelta(hours=24)

        ataques_24h = (
            AtaqueHoneypot.objects
            .filter(timestamp_evento__gte=hace_24_horas)
            .count()
        )

        # -----------------------------------------
        # RESPUESTA PARA EL DASHBOARD
        # -----------------------------------------

        return Response({
            'ataques_hoy': ataques_hoy,
            'total_ataques': total_ataques,
            'ips_unicas': ips_unicas,
            'usuarios_unicos': usuarios_unicos,
            'contrasenas_unicas': contrasenas_unicas,
            'comandos': comandos,
            'ataques_24h': ataques_24h,

            'usuarios_top': list(usuarios_top),
            'contrasenas_top': list(contrasenas_top),

            'tipos_ataque': tipos_ataque,
            'protocolos': list(protocolos),

            'ultimo_ataque': ultimo_ataque_data,
        })


class ActualizarAtaquesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        call_command('ingerir_cowrie')

        return Response({
            'mensaje': 'Ataques actualizados correctamente.'
        })
