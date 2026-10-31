from rest_framework import generics, permissions
from .models import Usuario
from .serializers import UsuarioRegistroSerializer
from .permissions import EsAdministrador
from .serializers import UsuarioListaSerializer, UsuarioAdminCrearSerializer, UsuarioAdminActualizarSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .telegram_service import generar_codigo_vinculacion, desvincular_telegram
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .serializers import SolicitarResetSerializer, RestablecerContrasenaSerializer


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

class UsuarioCrearView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioAdminCrearSerializer
    permission_classes = [EsAdministrador]


class UsuarioDetalleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioAdminActualizarSerializer
    permission_classes = [EsAdministrador]


from .serializers import MiCuentaSerializer


class MiCuentaView(generics.RetrieveUpdateAPIView):
    serializer_class = MiCuentaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class SolicitarResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SolicitarResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        usuario = Usuario.objects.filter(email__iexact=email).exclude(email='').first()

        if usuario:
            uid = urlsafe_base64_encode(force_bytes(usuario.pk))
            token = default_token_generator.make_token(usuario)
            enlace = f'{settings.FRONTEND_URL}/restablecer-contrasena?uid={uid}&token={token}'

            send_mail(
                'Restablece tu contraseña — CyberEdu',
                (
                    f'Hola {usuario.username},\n\n'
                    'Recibimos una solicitud para restablecer tu contraseña en CyberEdu.\n\n'
                    f'Haz clic en este enlace para crear una nueva contraseña:\n{enlace}\n\n'
                    'Si tú no pediste este cambio, puedes ignorar este correo.\n\n'
                    'Este enlace deja de funcionar en cuanto se use una vez, o si cambias tu '
                    'contraseña por otro medio.'
                ),
                settings.DEFAULT_FROM_EMAIL,
                [usuario.email],
                fail_silently=False,
            )

        return Response({
            'mensaje': 'Si ese correo está registrado, te enviamos un enlace para restablecer tu contraseña.'
        })


class RestablecerContrasenaView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RestablecerContrasenaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        datos = serializer.validated_data

        try:
            uid = force_str(urlsafe_base64_decode(datos['uid']))
            usuario = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            usuario = None

        if usuario is None or not default_token_generator.check_token(usuario, datos['token']):
            return Response(
                {'error': 'El enlace no es válido o ya expiró. Solicita uno nuevo.'},
                status=400,
            )

        usuario.set_password(datos['nueva_contrasena'])
        usuario.save()

        return Response({'mensaje': 'Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión.'})
