from django.contrib import admin
from .models import Modulo, Leccion, LeccionCompletada


class LeccionInline(admin.TabularInline):
    model = Leccion
    extra = 1


@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'icono', 'nivel', 'orden')
    list_filter = ('nivel',)

admin.site.register(LeccionCompletada)
