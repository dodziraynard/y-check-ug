from django.core.management.base import BaseCommand, CommandError
from dashboard.tasks import download_entities_from_upstream
from dashboard.models import *
from accounts.models import SyncGroup, User


class Command(BaseCommand):
    help = "Donwload all setup data ()"

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
            FlagLabel.__name__.lower(): FlagLabel,
            FlagColor.__name__.lower(): FlagColor,
            FlagCondition.__name__.lower(): FlagCondition,
            Service.__name__.lower(): Service,
            CheckupLocation.__name__.lower(): CheckupLocation,
            Facility.__name__.lower(): Facility,
            SyncGroup.__name__.lower(): SyncGroup,
            User.__name__.lower(): User,
            QuestionGroup.__name__.lower(): QuestionGroup,
            Section.__name__.lower(): Section,
            Question.__name__.lower(): Question,
            Option.__name__.lower(): Option,
            PreviousResponseRequirement.__name__.lower(): PreviousResponseRequirement,
        } # yapf: disable

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
                    f'An error occured while downloading setup data: error={str(e)}'
                ))
        else:
            self.stdout.write(
                self.style.SUCCESS('Set-up data downloaded successfully.'))
