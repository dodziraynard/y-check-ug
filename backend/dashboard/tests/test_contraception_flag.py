from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class ContraceptionFlaggingTestCase(TestCase):
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

    def test_contraception_questions_exists(self):
        questions_ids = ["Q606", "Q607", "Q608"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_contraception_red_flag1(self):
        """Test that CONTRACEPTION is flagged red if Q606 is no"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q606"]
        responses = ["No"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag2(self):
        """Test that CONTRACEPTION is flagged red if Q607 is Rhythm method/Safe days (avoiding sex on days I am fertile)"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q607"]
        responses = [
            "Rhythm method/Safe days (avoiding sex on days I am fertile)"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag3(self):
        """Test that CONTRACEPTION is flagged red if Q607 is Withdrawal method (partner withdraws before ejaculation)"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q607"]
        responses = [
            "Withdrawal method (partner withdraws before ejaculation)"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag4(self):
        """Test that CONTRACEPTION is flagged red if Q607 is Emergency contraception (or “morning after pill”)"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q607"]
        responses = [
            "Emergency contraception (or “morning after pill”)"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag5(self):
        """Test that CONTRACEPTION is flagged red if Q607 is Herbal/traditional products"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q607"]
        responses = ["Herbal/traditional products"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag6(self):
        """Test that CONTRACEPTION is flagged red if Q608 >= 1"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q608"]
        responses = ["2"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value

    def test_contraception_red_flag7(self):
        """Test that CONTRACEPTION is flagged red if Q608 >= 1"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q608"]
        responses = ["1"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.RED.value


    def test_contraception_red_flag8(self):
        """Test that CONTRACEPTION is flagged red if Q608 >= 1"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q608"]
        responses = ["0"]

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
            label__name="CONTRACEPTION").first().get_final_colour() == Colors.GREEN.value
