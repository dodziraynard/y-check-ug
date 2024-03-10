from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class BPFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_bp_questions_exists(self):
        questions_ids = ["BP5", "BP6", "BP1203", "BP1204", "Q1303", "Q1304"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_bp1_red_flag(self):
        """Test that BLOOD PRESSURE 1 is flagged red for invalid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["BP5", "BP6"]
        responses = ["130", "124"]

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
            label__name="BLOOD PRESSURE 1").first().get_final_colour() == Colors.RED.value

    def test_bp1_green_flag(self):
        """Test that BLOOD PRESSURE 1 is flagged green for valid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["BP5", "BP6"]
        responses = ["110", "70"]

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
            label__name="BLOOD PRESSURE 1").first().get_final_colour() == Colors.GREEN.value

    def test_bp2_red_flag(self):
        """Test that BLOOD PRESSURE 2 is flagged red for invalid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["BP1203", "BP1204"]
        responses = ["130", "124"]

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
            label__name="BLOOD PRESSURE 2").first().get_final_colour() == Colors.RED.value

    def test_bp2_green_flag(self):
        """Test that BLOOD PRESSURE 2 is flagged green for valid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["BP1203", "BP1204"]
        responses = ["110", "78"]

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
            label__name="BLOOD PRESSURE 2").first().get_final_colour() == Colors.GREEN.value

    def test_bp3_red_flag(self):
        """Test that BLOOD PRESSURE 3 is flagged red for invalid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1303", "Q1304"]
        responses = ["130", "124"]

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
            label__name="BLOOD PRESSURE 3").first().get_final_colour() == Colors.RED.value

    def test_bp3_green_flag(self):
        """Test that BLOOD PRESSURE 3 is flagged green for valid response"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1303", "Q1304"]
        responses = ["110", "78"]

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
            label__name="BLOOD PRESSURE 3").first().get_final_colour() == Colors.GREEN.value
