from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class HearingFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_hearing_questions_exists(self):
        questions_ids = ["12.13a", "12.14a"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_hearing_hearing_right_red_flag1(self):
        """Test that HEARING (RIGHT EAR) is flagged red if 12.13a is less than 40"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.13a"]
        responses = ["40"]

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
            label__name="HEARING (RIGHT EAR)").first().get_final_colour() == Colors.RED.value

    def test_hearing_hearing_right_orange_flag1(self):
        """Test that HEARING (RIGHT EAR) is flagged orange if 12.13a is between 50 and 75"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.13a"]
        responses = ["55"]

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
            label__name="HEARING (RIGHT EAR)").first().get_final_colour() == Colors.ORANGE.value

    def test_hearing_hearing_right_green_flag1(self):
        """Test that HEARING (RIGHT EAR) is flagged green if 12.13a is more than 75"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.13a"]
        responses = ["80"]

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
            label__name="HEARING (RIGHT EAR)").first().get_final_colour() == Colors.GREEN.value

    def test_hearing_hearing_left_red_flag1(self):
        """Test that HEARING (LEFT EAR) is flagged red if 12.13a is less than 40"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.14a"]
        responses = ["40"]

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
            label__name="HEARING (LEFT EAR)").first().get_final_colour() == Colors.RED.value

    def test_hearing_hearing_left_orange_flag1(self):
        """Test that HEARING (LEFT EAR) is flagged orange if 12.14a is between 50 and 75"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.14a"]
        responses = ["55"]

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
            label__name="HEARING (LEFT EAR)").first().get_final_colour() == Colors.ORANGE.value

    def test_hearing_hearing_left_green_flag1(self):
        """Test that HEARING (LEFT EAR) is flagged green if 12.14a is more than 75"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.14a"]
        responses = ["80"]

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
            label__name="HEARING (LEFT EAR)").first().get_final_colour() == Colors.GREEN.value
