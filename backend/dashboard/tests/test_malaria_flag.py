from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class MalariaFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_malaria_questions_exists(self):
        questions_ids = ["QMalaria"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_malaria_red_flag1(self):
        """Test that MALARIA is flagged red if QMalaria is Positive"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QMalaria"]
        responses = ["Positive"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="MALARIA").first().get_final_colour() == Colors.RED.value

    def test_malaria_orange_flag1(self):
        """Test that MALARIA is flagged orange if QMalaria is Indeterminate"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QMalaria"]
        responses = ["Indeterminate"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="MALARIA").first().get_final_colour() == Colors.ORANGE.value


    def test_malaria_green_flag1(self):
        """Test that MALARIA is flagged green if QMalaria is Negative"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QMalaria"]
        responses = ["Negative"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="MALARIA").first().get_final_colour() == Colors.GREEN.value
