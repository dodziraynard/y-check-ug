from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class SchoolFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        self.questions_ids = ["Q203a", "Q204", "Q205s", "Q205a"]
        return super().setUp()

    def test_school_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_school_green_flag1(self):
        """Test that if Q203a is "Often not dangerous", school is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203a"]
        responses = ["Often not dangerous"]

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
            label__name="SCHOOL").first().get_final_colour() == Colors.GREEN.value

    def test_school_green_flag2(self):
        """Test that if Q203a is "Always not dangerous", school is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203a"]
        responses = ["Always not dangerous"]

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
            label__name="SCHOOL").first().get_final_colour() == Colors.GREEN.value

    def test_school_orange_flag1(self):
        """Test that if Q203a is "Sometimes not dangerous", school is flagged orange."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203a"]
        responses = ["Sometimes not dangerous"]

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
            label__name="SCHOOL").first().get_final_colour() == Colors.ORANGE.value

    def test_school_red_flag1(self):
        """Test that if Q203a is "Never", school is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203a"]
        responses = ["Never"]

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
            label__name="SCHOOL").first().get_final_colour() == Colors.RED.value

    def test_school_red_flag2(self):
        """Test that if Q204 is "No", school is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q204"]
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
            label__name="SCHOOL").first().get_final_colour() == Colors.RED.value

    def test_school_red_flag3(self):
        """Test that if Q206 is "Poor", school is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q206"]
        responses = ["Poor"]

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
            label__name="SCHOOL").first().get_final_colour() == Colors.RED.value

    def test_school_red_flag4(self):
        """Test that if Q205s is > 7, school is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q205s"]
        responses = ["8"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value
            )
        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SCHOOL").first().get_final_colour() == Colors.RED.value
