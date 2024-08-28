from django.core.management.base import BaseCommand
from dashboard.tasks import download_adoplescents


class Command(BaseCommand):
    help = "Download all adolescent data (Adolescent, AdolescentResponse, SummaryFlag, Referral, Treatment, ConditionTreatment) from the server"

    def handle(self, *args, **options):
        try:
            download_adoplescents()
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'An error occured while downloading adolescent data: error={str(e)}'
                ))
        else:
            self.stdout.write(
                self.style.SUCCESS('Adolescent data downloaded successfully.'))
