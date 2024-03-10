from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class OralHygieneFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        self.questions_ids = ["Q801", "Q802", "Q803"]
        return super().setUp()

    def test_oral_hygiene_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_oral_hygiene_red_flag1(self):
        """Test that if Q801 is "I did not clean or brush my teeth during the past 30 days", oral_hygiene is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q801"]
        responses = [
            "I did not clean or brush my teeth during the past 30 days"]

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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.RED.value

    def test_oral_hygiene_red_flag2(self):
        """Test that if Q801 is "Less than 1 time per day", oral_hygiene is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q801"]
        responses = ["Less than 1 time per day"]

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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.RED.value

    def test_oral_hygiene_red_flag3(self):
        """Test that if Q802 is "No", oral_hygiene is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q802"]
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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.RED.value

    def test_oral_hygiene_red_flag4(self):
        """Test that if Q803 is "Yes", oral_hygiene is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q803"]
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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.RED.value

    def test_oral_hygiene_green_flag1(self):
        """Test that if Q803 is "No", oral_hygiene is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q803"]
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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.GREEN.value

    def test_oral_hygiene_green_flag2(self):
        """Test that if Q802 is "Yes", oral_hygiene is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q802"]
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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.GREEN.value

    def test_oral_hygiene_green_flag3(self):
        """Test that if Q801 is "1 time per day", oral_hygiene is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q801"]
        responses = ["1 time per day"]

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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.GREEN.value

    def test_oral_hygiene_green_flag4(self):
        """Test that if Q801 is "2 times per day", oral_hygiene is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q801"]
        responses = ["2 times per day"]

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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.GREEN.value

    def test_oral_hygiene_green_flag4(self):
        """Test that if Q801 is "3 or more times per day", oral_hygiene is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q801"]
        responses = ["3 or more times per day"]

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
            label__name="ORAL HYGIENE").first().get_final_colour() == Colors.GREEN.value
