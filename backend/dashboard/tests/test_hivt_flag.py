from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class HIVTFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_hivt_questions_exists(self):
        questions_ids = ["Q13.16"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_hivt_red_flag(self):
        """Test that HIV Tis flagged red"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q13.16"]
        responses = ["Positive"]

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
            label__name="HIV T").first().get_final_colour() == Colors.RED.value

    # def test_hivt_red_flag2(self):
    #     """Test that HIV Tis flagged red"""

    #     # GIVEN:
    #     adolescent = self.adolescent
    #     questions_ids = ["Q13.13"]
    #     responses = ["Reports positive, Not on ART"]

    #     # WHEN:
    #     # Respond
    #     for index, response_value in enumerate(responses):
    #         question = Question.objects.filter(
    #             question_id=questions_ids[index]).first()
    #         response = AdolescentResponse.objects.create(
    #             adolescent=adolescent,
    #             question=question,
    #         )
    #         response.chosen_options.set(
    #             question.options.filter(value=response_value))

    #     SummaryFlag.compute_flag_color(adolescent)

    #     # THEN:
    #     assert SummaryFlag.objects.filter(
    #         adolescent=self.adolescent,
    #         label__name="HIV T").first().get_final_colour() == Colors.RED.value

    # def test_hivt_green_flag2(self):
    #     """Test that HIV Tis flagged green"""

    #     # GIVEN:
    #     adolescent = self.adolescent
    #     questions_ids = ["Q13.13"]
    #     responses = ["Yes"]

    #     # WHEN:
    #     # Respond
    #     for index, response_value in enumerate(responses):
    #         question = Question.objects.filter(
    #             question_id=questions_ids[index]).first()
    #         response = AdolescentResponse.objects.create(
    #             adolescent=adolescent,
    #             question=question,
    #         )
    #         response.chosen_options.set(
    #             question.options.filter(value=response_value))

    #     SummaryFlag.compute_flag_color(adolescent)

    #     # THEN:
    #     assert SummaryFlag.objects.filter(
    #         adolescent=self.adolescent,
    #         label__name="HIV T").first().get_final_colour() == Colors.GREEN.value
