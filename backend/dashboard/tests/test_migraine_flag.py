from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class MigraineFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_migraine_questions_exists(self):
        questions_ids = ["QM1", "QM2"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_migraine_red_flag1(self):
        """Test that MIGRAINE is flagged red if QM1 and QM2 are both Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QM1", "QM2"]
        responses = ["Yes", "Yes"]

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
            label__name="MIGRAINE").first().get_final_colour() == Colors.RED.value

    def test_migraine_green_flag1(self):
        """Test that MIGRAINE is flagged green if QM1 and QM2 are both not Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QM1", "QM2"]
        responses = ["Yes", "No"]

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
            label__name="MIGRAINE").first().get_final_colour() == Colors.GREEN.value

    def test_migraine_green_flag2(self):
        """Test that MIGRAINE is flagged green if QM1 and QM2 are both not Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["QM1", "QM2"]
        responses = ["No", "No"]

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
            label__name="MIGRAINE").first().get_final_colour() == Colors.GREEN.value
