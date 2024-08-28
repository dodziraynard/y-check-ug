from django.core.management.base import BaseCommand
from dashboard.tasks import download_all_setup_data


class Command(BaseCommand):
    help = "Donwload all setup data ()"

    def handle(self, *args, **options):
        try:
            download_all_setup_data()
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'An error occured while downloading setup data. error={str(e)}'
                ))
        else:
            self.stdout.write(self.style.SUCCESS('Successfully downloaded setup data.'))
