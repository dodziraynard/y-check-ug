from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class ExcerciseFlaggingTestCase(TestCase):
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

    def test_exercise_questions_exists(self):
        questions_ids = ["Q405"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_exercise_red_flag1(self):
        """Test that EXERCISE is flagged red if Q405 is 'Once'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q405"]
        responses = ["Once"]

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
            label__name="EXERCISE").first().get_final_colour() == Colors.RED.value

    def test_exercise_red_flag2(self):
        """Test that EXERCISE is flagged red if Q405 is 'Never'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q405"]
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

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="EXERCISE").first().get_final_colour() == Colors.RED.value

    def test_exercise_green_flag1(self):
        """Test that EXERCISE is flagged green if Q405 is 'Almost everyday'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q405"]
        responses = ["Almost everyday"]

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
            label__name="EXERCISE").first().get_final_colour() == Colors.GREEN.value

    def test_exercise_green_flag2(self):
        """Test that EXERCISE is flagged green if Q405 is 'Everyday'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q405"]
        responses = ["Everyday"]

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
            label__name="EXERCISE").first().get_final_colour() == Colors.GREEN.value
