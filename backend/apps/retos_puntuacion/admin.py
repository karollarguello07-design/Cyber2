from django.contrib import admin
from .models import (
    TipoAtaque, Nivel, PlantillaReto, PlantillaOpcionRespuesta, Reto,
    PreguntaQuiz, OpcionRespuesta, IntentoReto,
    PerfilEstudiante, Insignia, UsuarioInsignia,
)


class OpcionInline(admin.TabularInline):
    model = OpcionRespuesta
    extra = 2


@admin.register(PreguntaQuiz)
class PreguntaQuizAdmin(admin.ModelAdmin):
    list_display = ('enunciado', 'reto', 'orden')
    inlines = [OpcionInline]


@admin.register(Reto)
class RetoAdmin(admin.ModelAdmin):
    list_display = ('plantilla', 'curso', 'activo', 'fecha_generacion')
    list_filter = ('activo', 'curso')



class PlantillaOpcionInline(admin.TabularInline):
    model = PlantillaOpcionRespuesta
    extra = 4


@admin.register(PlantillaReto)
class PlantillaRetoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'tipo_ataque', 'xp_recompensa')
    inlines = [PlantillaOpcionInline]


@admin.register(PerfilEstudiante)
class PerfilEstudianteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'xp_total', 'nivel')


admin.site.register(TipoAtaque)
admin.site.register(Nivel)
admin.site.register(IntentoReto)
admin.site.register(Insignia)
admin.site.register(UsuarioInsignia)
