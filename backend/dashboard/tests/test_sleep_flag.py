from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class SleepFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_sleep_questions_exists(self):
        questions_ids = ["Q402a", "Q403"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_sleep_red_flag1(self):
        """Test that if sleeping for less than 8; sleep is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q402a", "Q403"]
        responses = ["9", "4"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            response = AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
            )
            response.chosen_options.set(
                question.options.filter(value=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SLEEP").first().get_final_colour() == Colors.RED.value

    def test_sleep_red_flag2(self):
        """Test that if sleeping for less than 8; sleep is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q402a", "Q403"]
        responses = ["11", "5"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            response = AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
            )
            response.chosen_options.set(
                question.options.filter(value=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SLEEP").first().get_final_colour() == Colors.RED.value

    def test_sleep_green_flag1(self):
        """Test that if sleeping for more than 8; sleep is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q402a", "Q403"]
        responses = ["8", "5"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            response = AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
            )
            response.chosen_options.set(
                question.options.filter(value=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SLEEP").first().get_final_colour() == Colors.GREEN.value

    def test_sleep_green_flag2(self):
        """Test that if sleeping for more than 8; sleep is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q402a", "Q403"]
        responses = ["11", "7"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            response = AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
            )
            response.chosen_options.set(
                question.options.filter(value=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SLEEP").first().get_final_colour() == Colors.GREEN.value
