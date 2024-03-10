from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class HPVVaccineFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_hpv_vaccine_questions_exists(self):
        questions_ids = ["Q1006", "Q1007"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_hpv_vaccine_red_flag1(self):
        """Test that hpv_vaccine is flagged red if Q1006 is I do not know"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1006"]
        responses = ["I do not know"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.RED.value

    def test_hpv_vaccine_red_flag2(self):
        """Test that hpv_vaccine is flagged red if Q1006 is 0 shots"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1006"]
        responses = ["0 shots"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.RED.value

    def test_hpv_vaccine_red_flag3(self):
        """Test that hpv_vaccine is flagged red if Q1007 is 1 year or more ago"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1007"]
        responses = ["1 year or more ago"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.RED.value

    def test_hpv_vaccine_green_flag1(self):
        """Test that hpv_vaccine is flagged green if Q1007 is Less than a month ago"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1007"]
        responses = ["Less than a month ago"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.GREEN.value

    def test_hpv_vaccine_green_flag2(self):
        """Test that hpv_vaccine is flagged green if Q1007 is One month or more ago, but less than 6 months ago"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1007"]
        responses = ["One month or more ago, but less than 6 months ago"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.GREEN.value

    def test_hpv_vaccine_green_flag3(self):
        """Test that hpv_vaccine is flagged green if Q1007 is 6 months or more ago but less than 1 year ago"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1007"]
        responses = ["6 months or more ago but less than 1 year ago"]

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
            label__name="HPV VACCINE").first().get_final_colour() == Colors.GREEN.value
