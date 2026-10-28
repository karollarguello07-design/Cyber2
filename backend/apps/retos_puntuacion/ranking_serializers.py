from rest_framework import serializers


class RankingFilaSerializer(serializers.Serializer):
    alias = serializers.CharField()
    nivel_nombre = serializers.CharField(allow_null=True)
    xp_total = serializers.IntegerField()
    insignias_count = serializers.IntegerField()


class MiPosicionSerializer(RankingFilaSerializer):
    puesto = serializers.IntegerField()
    total_estudiantes = serializers.IntegerField()
