from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class WorkFlaggingTestCase(TestCase):
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

        self.questions_ids = ["Q203b", "Q204b", "Q205w"]
        return super().setUp()

    def test_work_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_work_green_flag1(self):
        """Test that if Q203b is "Often dangerous", work is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203b"]
        responses = ["Often dangerous"]

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
            label__name="WORK").first().get_final_colour() == Colors.GREEN.value

    def test_work_red_flag2(self):
        """Test that if Q203b is "Always dangerous", work is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203b"]
        responses = ["Always dangerous"]

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
            label__name="WORK").first().get_final_colour() == Colors.RED.value

    def test_work_orange_flag1(self):
        """Test that if Q203b is "Sometimes dangerous", work is flagged orange."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203b"]
        responses = ["Sometimes dangerous"]

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
            label__name="WORK").first().get_final_colour() == Colors.ORANGE.value

    def test_work_green_flag1(self):
        """Test that if Q203b is "Not dangerous", work is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q203b"]
        responses = ["Not dangerous"]

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
            label__name="WORK").first().get_final_colour() == Colors.GREEN.value

    def test_work_red_flag2(self):
        """Test that if Q204b is "No", work is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q204b"]
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

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="WORK").first().get_final_colour() == Colors.RED.value

    def test_school_red_flag4(self):
        """Test that if Q205w is > 7, school is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q205w"]
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
        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="WORK").first().get_final_colour() == Colors.RED.value
