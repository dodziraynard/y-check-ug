from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class VisionFlaggingTestCase(TestCase):
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

    def test_vision_questions_exists(self):
        questions_ids = ["12.11", "12.11c"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_vision_right_green_flag1(self):
        """Test that VISION (RIGHT EYE) is flagged green if 12.11 is [6/3 OR 6/3.8 OR 6/4.8 OR 6/6 OR 6/7.5 OR 6/9.5]"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.11"]
        responses = ["6/3"]

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
            adolescent=self.adolescent, label__name="VISION (RIGHT EYE)"
        ).first().get_final_colour() == Colors.GREEN.value

    def test_vision_right_red_flag1(self):
        """Test that VISION (RIGHT EYE) is flagged red if 12.11 not [6/3 OR 6/3.8 OR 6/4.8 OR 6/6 OR 6/7.5 OR 6/9.5]"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.11"]
        responses = ["8/7.5"]

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
            adolescent=self.adolescent, label__name="VISION (RIGHT EYE)"
        ).first().get_final_colour() == Colors.RED.value

    def test_vision_left_green_flag1(self):
        """Test that VISION (LEFT EYE) is flagged green if 12.11c is [6/3 OR 6/3.8 OR 6/4.8 OR 6/6 OR 6/7.5 OR 6/9.5]"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.11c"]
        responses = ["6/3"]

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
            adolescent=self.adolescent, label__name="VISION (LEFT EYE)").first(
            ).get_final_colour() == Colors.GREEN.value

    def test_vision_left_red_flag1(self):
        """Test that VISION (LEFT EYE) is flagged red if 12.11c not [6/3 OR 6/3.8 OR 6/4.8 OR 6/6 OR 6/7.5 OR 6/9.5]"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.11c"]
        responses = ["8/7.5"]

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
            adolescent=self.adolescent, label__name="VISION (LEFT EYE)").first(
            ).get_final_colour() == Colors.RED.value
