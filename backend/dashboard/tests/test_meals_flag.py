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
        questions_ids = ["Q303"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_meals_red_flag(self):
        """Test that correct responses to meals questions yield red flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'More than once to q303'
        question_q303 = Question.objects.filter(question_id="Q303").first()
        response_q303 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q303,
        )
        response_q303.chosen_options.set(
            question_q303.options.filter(value__icontains="More than once"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="MEALS").first().get_final_colour() == Colors.RED.value

    def test_meals_green_flag(self):
        """Test that correct responses to meals questions yield green flag."""

        # GIVEN:
        adolescent = self.adolescent

        # WHEN:
        # Respond 'once to q303'
        question_q303 = Question.objects.filter(question_id="Q303").first()
        response_q303 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q303,
        )
        response_q303.chosen_options.set(
            question_q303.options.filter(value="Once"))

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="MEALS").first().get_final_colour() == Colors.GREEN.value
