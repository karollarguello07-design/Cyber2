from django.contrib import admin
from .models import Curso, Inscripcion


class InscripcionInline(admin.TabularInline):
    model = Inscripcion
    extra = 0


@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'profesor', 'cupo_maximo', 'activo', 'fecha_creacion')
    list_filter = ('activo',)
    search_fields = ('nombre',)
    inlines = [InscripcionInline]


@admin.register(Inscripcion)
class InscripcionAdmin(admin.ModelAdmin):
    list_display = ('estudiante', 'curso', 'fecha_inscripcion')
    list_filter = ('curso',)
