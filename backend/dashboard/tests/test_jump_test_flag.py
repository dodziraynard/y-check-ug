from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class JumpTestFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_jump_test_questions_exists(self):
        questions_ids = ["12.3", "12.4"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_jump_test_red_flag1(self):
        """Test that JUMP TEST is flagged red if Best (longest) of 2 jump test measurement < 80"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.3", "12.4"]
        responses = ["77", "11"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="JUMP TEST").first().get_final_colour() == Colors.RED.value

    def test_jump_test_green_flag1(self):
        """Test that JUMP TEST is flagged green if Best (longest) of 2 jump test measurement >= 80"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.3", "12.4"]
        responses = ["80", "11"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="JUMP TEST").first().get_final_colour() == Colors.GREEN.value

    def test_jump_test_green_flag2(self):
        """Test that JUMP TEST is flagged green if Best (longest) of 2 jump test measurement >= 80"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.3", "12.4"]
        responses = ["33", "88"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="JUMP TEST").first().get_final_colour() == Colors.GREEN.value
