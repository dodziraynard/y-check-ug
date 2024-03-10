from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from dashboard.models import *


class BMIFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        return super().setUp()

    def test_bmi_questions_exists(self):
        assert Question.objects.filter(util_function_tag__in=["bmi_height", "bmi_weight"]).count() == 2

    def test_female_anaemia_red_flag(self):
        """Test that a 13 year old female adolescent, with height 175kg and weight 100kg
        should flag BMI red
        """

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to anaemia
        height_question = Question.objects.filter(util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(util_function_tag="bmi_weight").first()
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
        SummaryFlag.compute_flag_color(self.adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == "#ff0000"

    
    def test_female_anaemia_orange_flag(self):
        """Test that a 13 year old female adolescent, with height 175kg and weight 100kg
        should flag BMI orange
        """

        # GIVEN:
        self.adolescent.gender = "female"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(13 * 365.25))

        # WHEN:
        # A response to anaemia
        height_question = Question.objects.filter(util_function_tag="bmi_height").first()
        weight_question = Question.objects.filter(util_function_tag="bmi_weight").first()
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
        SummaryFlag.compute_flag_color(self.adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="BMI").first().get_final_colour() == "#ffa500"

    