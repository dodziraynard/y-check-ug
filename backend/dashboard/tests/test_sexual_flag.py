from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class SexualFlaggingTestCase(TestCase):
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

    def test_sexual_questions_exists(self):
        questions_ids = ["Q604", "Q605", "Q601"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_sexual_green_flag(self):
        """Test that SEXUAL RISK is flagged red if Q604 > 2"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q604"]
        responses = ["Two people"]

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
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.GREEN.value

    def test_sexual_red_flag2(self):
        """Test that SEXUAL RISK is flagged red if Q604 >= 2"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q604"]
        responses = ["More than two people"]

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
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.RED.value

    def test_sexual_red_flag3(self):
        """Test that SEXUAL RISK is flagged red if Q605 is 'sometimes’, ‘rarely’ or ‘never’"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q605"]
        responses = ["Sometimes’"]

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
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.RED.value

    def test_sexual_red_flag4(self):
        """Test that SEXUAL RISK is flagged red if Q605 is 'sometimes’, ‘rarely’ or ‘never’"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q605"]
        responses = ["Rarely"]

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
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.RED.value

    def test_sexual_red_flag5(self):
        """Test that SEXUAL RISK is flagged red if Q605 is 'sometimes’, ‘rarely’ or ‘never’"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q605"]
        responses = ["Never"]

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
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.RED.value

    def test_sexual_red_flag6(self):
        """Test that SEXUAL RISK is flagged red if Sex is ‘Male’ and Q601 is ‘Boys/men’"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.gender = "male"
        adolescent.save()
        questions_ids = ["Q601"]
        responses = ["Boys/men"]

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
                question.options.filter(value__icontains=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.RED.value

    def test_sexual_green_flag1(self):
        """Test that SEXUAL RISK is flagged green if Sex is Female and Q601 is ‘Boys/men’"""

        # GIVEN:
        adolescent = self.adolescent
        adolescent.gender = "Female"
        questions_ids = ["Q601"]
        responses = ["Boys/men"]

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
                question.options.filter(value__icontains=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.GREEN.value

    def test_sexual_green_flag1(self):
        """Test that SEXUAL RISK is flagged green if Sex is Female and Q601 is ‘Boys/men’"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q604"]
        responses = ["No one"]

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
                question.options.filter(value__icontains=response_value))

        SummaryFlag.compute_flag_color(adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="SEXUAL RISK").first().get_final_colour() == Colors.GREEN.value
