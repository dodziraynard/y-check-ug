from django.core.management.base import BaseCommand, CommandError
from dashboard.tasks import download_entities_from_upstream
from dashboard.models import *


class Command(BaseCommand):
    help = "Download all adolescent data (Adolescent, AdolescentResponse, SummaryFlag, Referral, Treatment, ConditionTreatment) from the server"

    def add_arguments(self, parser):
        parser.add_argument("-e",
                            "--entity",
                            type=str,
                            help="Entities to be downloaded.")
        parser.add_argument("-p",
                            "--page",
                            type=int,
                            help="The first page to download.")

    def handle(self, *args, **options):
        entity = options["entity"] if options["entity"] else "all"
        page = options["page"] if options["page"] else 1

        entities = {
            Adolescent.__name__.lower(): Adolescent,
            AdolescentResponse.__name__.lower(): AdolescentResponse,
            SummaryFlag.__name__.lower(): SummaryFlag,
            Referral.__name__.lower(): Referral,
            Treatment.__name__.lower(): Treatment,
            ConditionTreatment.__name__.lower(): ConditionTreatment,
        }

        if entity not in entities and entity != "all":
            raise CommandError('Entity "%s" is not valid.' % entity)

        try:
            for entity_name, Model in entities.items():
                if entity != "all" and entity != entity_name: continue

                self.stdout.write(
                    self.style.SUCCESS(f"Downloading {entity_name}"))
                if not download_entities_from_upstream(
                        entity_name, Model, start_page=page):
                    self.stdout.write(
                        self.style.ERROR(
                            f"Couldn't finish downloading {entity_name}"))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'An error occured while downloading adolescent data: error={str(e)}'
                ))
        else:
            self.stdout.write(
                self.style.SUCCESS('Adolescent data downloaded successfully.'))
