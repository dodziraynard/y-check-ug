from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class SuicideFlaggingTestCase(TestCase):
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

        self.questions_ids = ["Q736", "Q737", "Q746"]
        return super().setUp()

    def test_suicide_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_suicide_red_flag1(self):
        """Test that if Q736 is Yes, suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q736"]
        responses = ["Yes"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_red_flag2(self):
        """Test that if Q737 is Yes, suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q737"]
        responses = ["Yes"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_red_flag3(self):
        """Test that if Q736 and Q737 is Yes, suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q736", "Q737"]
        responses = ["Yes"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_green_flag1(self):
        """Test that if Q736 and Q737 is No, suicide is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q736", "Q737"]
        responses = ["No"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.GREEN.value

    def test_suicide_red_flag4(self):
        """Test that if Q746 Yes, some of the time; suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q746"]
        responses = ["Yes, some of the time"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_red_flag5(self):
        """Test that if Q746 Yes, most of the time; suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q746"]
        responses = ["Yes, most of the time"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_red_flag6(self):
        """Test that if Q746 Yes, all the time; suicide is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q746"]
        responses = ["Yes, all the time"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.RED.value

    def test_suicide_green_flag2(self):
        """Test that if Q746 Not at all; suicide is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q746"]
        responses = ["Not at all"] * len(questions_ids)

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
            label__name="SUICIDE RISK").first().get_final_colour() == Colors.GREEN.value
