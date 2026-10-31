from rest_framework import serializers
from .models import Usuario
import re

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

class UsuarioAdminCrearSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'password', 'rol', 'is_active')

    def create(self, validated_data):
        usuario = Usuario(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            rol=validated_data.get('rol', Usuario.Rol.ESTUDIANTE),
            is_active=validated_data.get('is_active', True),
        )
        usuario.set_password(validated_data['password'])
        usuario.save()
        return usuario


class UsuarioAdminActualizarSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = ('id', 'username', 'email', 'rol', 'is_active', 'password')
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for campo, valor in validated_data.items():
            setattr(instance, campo, valor)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


import re


class MiCuentaSerializer(serializers.ModelSerializer):
    nombre_real = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Usuario
        fields = ('username', 'nombre_real', 'alias', 'visible_en_ranking')
        read_only_fields = ('username', 'nombre_real')

    def get_nombre_real(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()

    def validate_alias(self, valor):
        valor = valor.strip()

        if len(valor) < 3 or len(valor) > 20:
            raise serializers.ValidationError('El alias debe tener entre 3 y 20 caracteres.')

        if not re.match(r'^[A-Za-z0-9-]+$', valor):
            raise serializers.ValidationError('El alias solo puede tener letras, números y guiones.')

        usuario = self.instance

        if valor.lower() == usuario.username.lower():
            raise serializers.ValidationError('El alias no puede ser igual a tu nombre de usuario.')

        nombre_real = f'{usuario.first_name} {usuario.last_name}'.strip()
        if nombre_real and valor.lower() == nombre_real.lower():
            raise serializers.ValidationError('El alias no puede ser igual a tu nombre real.')

        if Usuario.objects.filter(alias__iexact=valor).exclude(pk=usuario.pk).exists():
            raise serializers.ValidationError('Ese alias ya está en uso. Elige otro.')

        return valor


class SolicitarResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class RestablecerContrasenaSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    nueva_contrasena = serializers.CharField(min_length=8)
