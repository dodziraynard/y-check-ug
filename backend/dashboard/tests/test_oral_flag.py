from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class OralFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        self.questions_ids = ["Q1315"]
        return super().setUp()

    def test_oral_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_oral_red_flag1(self):
        """Test that if Q1315 is "Fail", oral is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q1315"]
        responses = ["Fail"]

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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="ORAL").first().get_final_colour() == Colors.RED.value
