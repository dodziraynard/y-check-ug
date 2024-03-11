from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class GripFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.gender = "male"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(10 * 365.25))
        return super().setUp()

    def test_grip_questions_exists(self):
        questions_ids = ["12.5", "12.6", "12.5b", "12.6b"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_grip_right_red_flag1(self):
        """Test that GRIP RIGHT is flagged red according to the given table:

            Age	Males less than (kgs)
            10	10.8
            11	12.9
            12	15.8
            13	19.1
            14	22.7
            15	26.0
            16	28.7
            17	30.7
            18	34.1
            19	35.7
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.5", "12.6"]
        responses = ["8", "8"]

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
            label__name="GRIP RIGHT").first().get_final_colour() == Colors.RED.value

    def test_grip_right_green_flag1(self):
        """Test that GRIP RIGHT is flagged green according to the given table:

            Age	Males less than (kgs)
            10	10.8
            11	12.9
            12	15.8
            13	19.1
            14	22.7
            15	26.0
            16	28.7
            17	30.7
            18	34.1
            19	35.7
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.5", "12.6"]
        responses = ["8", "11"]

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
            label__name="GRIP RIGHT").first().get_final_colour() == Colors.GREEN.value

    def test_grip_right_green_flag2(self):
        """Test that GRIP RIGHT is flagged green according to the given table:

            Age	Males less than (kgs)
            10	10.8
            11	12.9
            12	15.8
            13	19.1
            14	22.7
            15	26.0
            16	28.7
            17	30.7
            18	34.1
            19	35.7
        """

        # GIVEN:
        adolescent = self.adolescent
        adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(12 * 365.25))
        questions_ids = ["12.5", "12.6"]
        responses = ["16", "11"]

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
            label__name="GRIP RIGHT").first().get_final_colour() == Colors.GREEN.value

    def test_grip_left_red_flag1(self):
        """Test that GRIP LEFT is flagged red according to the given table:

            Age	Males less than (kgs)
            10	9.1
            11	11.2
            12	14.1
            13	17.9
            14	22.1
            15	26.1
            16	29.2
            17	31.2
            18	34.1
            19	35.7
        """
        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.5b", "12.6b"]
        responses = ["8", "8"]

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
            label__name="GRIP LEFT").first().get_final_colour() == Colors.RED.value

    def test_grip_left_red_flag1(self):
        """Test that GRIP LEFT is flagged red according to the given table:

            Age	Males less than (kgs)
            10	9.1
            11	11.2
            12	14.1
            13	17.9
            14	22.1
            15	26.1
            16	29.2
            17	31.2
            18	34.1
            19	35.7
        """
        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["12.5b", "12.6b"]
        responses = ["10", "8"]

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
            label__name="GRIP LEFT").first().get_final_colour() == Colors.GREEN.value
