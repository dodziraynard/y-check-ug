from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class HomeFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_home_questions_exists(self):
        questions_ids = ["Q102", "Q103"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_home_green_flag(self):
        """Test that correct responses to home questions yield green flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'well’ to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="well"))

        # Respond 'Yes, about most things' to q103
        question_q103 = Question.objects.filter(
            text__icontains="I have someone at").first()
        response_q103 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q103,
        )
        response_q103.chosen_options.set(
            question_q103.options.filter(value__icontains="Yes, about most things"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HOME").first().get_final_colour() == Colors.GREEN.value

    def test_home_orange_flag(self):
        """Test that correct responses to home questions yield orange flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'somehow to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="somehow"))

        # Respond 'Yes, about most things' to q103
        question_q103 = Question.objects.filter(
            text__icontains="I have someone at").first()
        response_q103 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q103,
        )
        response_q103.chosen_options.set(
            question_q103.options.filter(value__icontains="Yes, about most things"))

        SummaryFlag.compute_flag_color(self.adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HOME").first().get_final_colour() == Colors.ORANGE.value

    def test_home_orange_sometimes_flag(self):
        """Test that correct responses to home questions yield orange flag."""

         # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'we don’t get along to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="sometimes"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HOME").first().get_final_colour() == Colors.ORANGE.value

    def test_home_red_flag(self):
        """Test that correct responses to home questions yield red flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'we don’t get along to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="we don’t get along"))

        # Respond 'Yes, about most things' to q103
        question_q103 = Question.objects.filter(
            text__icontains="I have someone at").first()
        response_q103 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q103,
        )
        response_q103.chosen_options.set(
            question_q103.options.filter(value__icontains="No one"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HOME").first().get_final_colour() == Colors.RED.value

    def test_home_one_question_red_flag(self):
        """Test that only response to Q102 is able to field red flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'we don’t get along to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="we don’t get along"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="HOME").first().get_final_colour() == Colors.RED.value
