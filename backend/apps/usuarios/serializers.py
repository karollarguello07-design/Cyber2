from rest_framework import serializers
from .models import Usuario


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'password', 'rol')

    def validate_rol(self, valor):
        if valor == Usuario.Rol.ADMINISTRADOR:
            raise serializers.ValidationError(
                'No está permitido registrarse directamente como administrador.'
            )
        return valor

    def create(self, validated_data):
        usuario = Usuario(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            rol=validated_data.get('rol', Usuario.Rol.ESTUDIANTE),
        )
        usuario.set_password(validated_data['password'])
        usuario.save()
        return usuario

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TokenObtainPairConRolSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, usuario):
        token = super().get_token(usuario)
        token['rol'] = usuario.rol
        token['username'] = usuario.username
        return token

class UsuarioListaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'rol', 'is_active', 'date_joined')

