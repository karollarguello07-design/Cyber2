from rest_framework import generics, permissions
from .models import Usuario
from .serializers import UsuarioRegistroSerializer
from .permissions import EsAdministrador
from .serializers import UsuarioListaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .telegram_service import generar_codigo_vinculacion, desvincular_telegram


class RegistroUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioRegistroSerializer
    permission_classes = (permissions.AllowAny,)

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import TokenObtainPairConRolSerializer


class TokenObtainPairConRolView(TokenObtainPairView):
    serializer_class = TokenObtainPairConRolSerializer

class UsuariosListaView(generics.ListAPIView):
    queryset = Usuario.objects.all().order_by('-date_joined')
    serializer_class = UsuarioListaSerializer
    permission_classes = [EsAdministrador]


class GenerarCodigoTelegramView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        codigo = generar_codigo_vinculacion(request.user)
        return Response({
            'codigo': codigo,
            'instrucciones': f'Envía el código {codigo} a nuestro bot de Telegram para vincular tu cuenta.',
        })


class DesvincularTelegramView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        desvincular_telegram(request.user)
        return Response({'mensaje': 'Cuenta de Telegram desvinculada correctamente.'})


class EstadoTelegramView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'vinculado': request.user.telegram_vinculado,
        })
