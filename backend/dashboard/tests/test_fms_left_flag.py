from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class FMSFlaggingTestCase(TestCase):
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

    def test_fms_questions_exists(self):
        questions_ids = ["12.7", "12.8", "12.7b", "12.8b"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_fms_left_basic_red_flag1(self):
        """Test that FMS LEFT HAND is can be flagged red for basic"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "basic"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["37", "25"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.RED.value

    def test_fms_left_basic_green_flag1(self):
        """Test that FMS LEFT HAND is can be flagged green for basic"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "basic"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["45", "25"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.GREEN.value

    def test_fms_left_secondary_red_flag1(self):
        """Test that FMS LEFT HAND is can be flagged red for secondary"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "secondary"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["33", "0"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.RED.value

    def test_fms_left_secondary_green_flag1(self):
        """Test that FMS LEFT HAND is can be flagged green for secondary"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "secondary"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["45", "55"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.GREEN.value

    def test_fms_left_community_red_flag1(self):
        """Test that FMS LEFT HAND is can be flagged red for community"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "community"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["0", "25"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.RED.value

    def test_fms_left_community_green_flag1(self):
        """Test that FMS LEFT HAND is can be flagged green for community"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.type = "community"
        questions_ids = ["12.7b", "12.8b"]
        responses = ["78", "55"]

        # WHEN:
        # Respond
        for index, response_value in enumerate(responses):
            question = Question.objects.filter(
                question_id=questions_ids[index]).first()
            AdolescentResponse.objects.create(
                adolescent=adolescent,
                question=question,
                text=response_value,
            )

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FMS LEFT HAND").first().get_final_colour() == Colors.GREEN.value
