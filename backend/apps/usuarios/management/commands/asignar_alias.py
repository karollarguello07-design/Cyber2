from django.core.management.base import BaseCommand

from apps.usuarios.models import Usuario


class Command(BaseCommand):
    help = 'Asigna un alias automático a los usuarios que no tienen uno todavía'

    def handle(self, *args, **options):
        usuarios_sin_alias = Usuario.objects.filter(alias='')
        total = usuarios_sin_alias.count()

        for usuario in usuarios_sin_alias:
            usuario.save()

        self.stdout.write(self.style.SUCCESS(f'{total} usuarios recibieron un alias nuevo.'))
        self.stdout.write('')
        for usuario in Usuario.objects.all().order_by('username'):
            self.stdout.write(f'{usuario.username} ({usuario.rol}) -> {usuario.alias}')
