from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from dashboard.models import *
from ycheck.utils.constants import Colors


class BMIFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        return super().setUp()

    def test_bmi_questions_exists(self):
        assert Question.objects.filter(
            util_function_tag__in=["bmi_height", "bmi_weight"]).count() == 2

    def test_female_bmi_red_flag(self):
        """Test that a 13 year old female adolescent, with height 175cm and weight 100kg
        should flag BMI red
        e.g., sd < -2 and sd > 2
        """

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to bmi
        height_question = Question.objects.filter(
            util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(
            util_function_tag="bmi_weight").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=height_question,
            text="175"
        )
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=weight_question,
            text="100"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == Colors.RED.value

    def test_female_bmi_orange_flag(self):
        """Test that a 13 year old female adolescent, with height 200cm and weight 100kg
        should flag BMI orange
        e.g., 1 < sd < 2
        """

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to bmi
        height_question = Question.objects.filter(
            util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(
            util_function_tag="bmi_weight").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=height_question,
            text="200"
        )
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=weight_question,
            text="100"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == Colors.ORANGE.value

    def test_female_bmi_green_flag1(self):
        """Test that an 18 year old female adolescent, with height 169cm and weight 55kg
        should flag BMI green
        e.g., -2 <= sd <= 1
        """

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(18 * 365.25))

        # WHEN:
        # A response to bmi
        height_question = Question.objects.filter(
            util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(
            util_function_tag="bmi_weight").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=height_question,
            text="169"
        )
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=weight_question,
            text="55"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == Colors.GREEN.value


    def test_male_bmi_green_flag2(self):
        """Test that a 15 year old male adolescent, with height 169cm and weight 55kg
        should flag BMI green
        e.g., -2 <= sd <= 1
        """

        # GIVEN:
        self.adolescent.gender = "male"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(15 * 365.25))

        # WHEN:
        # A response to bmi
        height_question = Question.objects.filter(
            util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(
            util_function_tag="bmi_weight").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=height_question,
            text="160"
        )
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=weight_question,
            text="47"
        )
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == Colors.GREEN.value
