from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'email', 'rol', 'telegram_vinculado', 'is_active')
    list_filter = ('rol', 'telegram_vinculado', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Información de CyberEdu', {
            'fields': ('rol', 'telegram_chat_id', 'telegram_vinculado'),
        }),
    )


admin.site.register(Usuario, UsuarioAdmin)
