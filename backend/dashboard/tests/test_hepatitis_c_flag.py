from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class HepatitisCFlaggingTestCase(TestCase):
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

    def test_hepatitis_c_questions_exists(self):
        questions_ids = ["HepatitisC"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_hepatitis_c_red_flag1(self):
        """Test that HEPATITIS C is flagged red if HepatitisC is Positive"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["HepatitisC"]
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

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HEPATITIS C").first().get_final_colour() == Colors.RED.value

    def test_hepatitis_c_orange_flag1(self):
        """Test that HEPATITIS C is flagged orange if HepatitisC is Indeterminate"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["HepatitisC"]
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

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HEPATITIS C").first().get_final_colour() == Colors.ORANGE.value

    def test_hepatitis_c_green_flag1(self):
        """Test that HEPATITIS C is flagged green if HepatitisC is Negative"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["HepatitisC"]
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

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HEPATITIS C").first().get_final_colour() == Colors.GREEN.value
