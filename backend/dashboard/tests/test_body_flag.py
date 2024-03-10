from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class BodyFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        self.questions_ids = ["Q301", "Q303"]
        return super().setUp()

    def test_body_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_body_red_flag1(self):
        """Test that if Q301 is "Angry", body is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q301"]
        responses = ["Angry"]

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
            label__name="BODY").first().get_final_colour() == Colors.RED.value

    def test_body_red_flag2(self):
        """Test that if Q301 is "Bad", body is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q301"]
        responses = ["Bad"]

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
            label__name="BODY").first().get_final_colour() == Colors.RED.value

    def test_body_red_flag3(self):
        """Test that if Q302 is "No", body is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q302"]
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
            label__name="BODY").first().get_final_colour() == Colors.RED.value

    def test_body_green_flag1(self):
        """Test that if Q302 is "Yes", body is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q302"]
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
            label__name="BODY").first().get_final_colour() == Colors.GREEN.value

    def test_body_green_flag2(self):
        """Test that if Q301 is "Great", body is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q301"]
        responses = ["Great"]

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
            label__name="BODY").first().get_final_colour() == Colors.GREEN.value
