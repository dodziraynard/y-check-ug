from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from dashboard.models import *


class AnaemiaFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        return super().setUp()

    def test_anaemia_question_exists(self):
        assert Question.objects.filter(util_function_tag="anaemia").exists()

    def test_female_anaemia_red_flag(self):
        """Test that a 13 year old female adolescent, with Haemoglobin 11 be flagged red."""

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to anaemia
        question = Question.objects.filter(util_function_tag="anaemia").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question,
            text="11"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="ANAEMIA").first().get_final_colour() == "#ff0000"

    def test_female_anaemia_green_flag(self):
        """Test that a 13 year old female adolescent, with Haemoglobin 12 be flagged green."""

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to anaemia
        question = Question.objects.filter(util_function_tag="anaemia").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question,
            text="12"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="ANAEMIA").first().get_final_colour() == "#00ff00"

    def test_male_anaemia_red_flag(self):
        # Test that an 18 year old male adolescent, with Haemoglobin 7 be flagged red.

        # GIVEN:
        self.adolescent.gender = "male"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(18 * 365.25))

        # WHEN:
        # A response to anaemia
        question = Question.objects.filter(util_function_tag="anaemia").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question,
            text="7"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="ANAEMIA").first().get_final_colour() == "#ff0000"

    def test_male_anaemia_green_flag(self):
        """Test that a 18 year old male adolescent, with Haemoglobin 13 be flagged green."""

        # GIVEN:
        self.adolescent.gender = "male"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(18 * 365.25))

        # WHEN:
        # A response to anaemia
        question = Question.objects.filter(util_function_tag="anaemia").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question,
            text="13"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="ANAEMIA").first().get_final_colour() == "#00ff00"
