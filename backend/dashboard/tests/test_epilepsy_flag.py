from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class EpilepsyFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_epilepsy_questions_exists(self):
        questions_ids = [f"Q{i}" for i in range(905, 911)]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_epilepsy_red_flag1(self):
        """Test that EPILEPSY is flagged red if Q905 is Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q905"]
        responses = ["Yes"]

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
            label__name="EPILEPSY").first().get_final_colour() == Colors.RED.value

    def test_epilepsy_red_flag2(self):
        """Test that EPILEPSY is flagged red if Q906 is Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q906"]
        responses = ["Yes"]

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
            label__name="EPILEPSY").first().get_final_colour() == Colors.RED.value

    def test_epilepsy_orange_flag1(self):
        """Test that EPILEPSY is flagged orange if Q907-Q910 is Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(907, 911)]
        responses = ["Yes"] * len(questions_ids)

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
            label__name="EPILEPSY").first().get_final_colour() == Colors.ORANGE.value

    def test_epilepsy_green_flag1(self):
        """Test that EPILEPSY is flagged green if Q907-Q910 is not all Yes"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(907, 911)]
        responses = ["Yes"] * len(questions_ids)
        responses[2] = "No"

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
            label__name="EPILEPSY").first().get_final_colour() == Colors.GREEN.value

    def test_epilepsy_green_flag2(self):
        """Test that EPILEPSY is flagged green if Q906 is No"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q906"]
        responses = ["No"]

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
            label__name="EPILEPSY").first().get_final_colour() == Colors.GREEN.value
