from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class PhysicalDisabilityFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_physical_disability_questions_exists(self):
        questions_ids = ["Q901", "Q902", "Q903", "Q904"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_physical_disability_red_flag1(self):
        """Test that PHYSICAL DISABILITY is flagged red 
        if responds ‘Yes, a lot of difficulty’, ‘Cannot do it at all’,
        or ‘Don’t know’ to Q901, Q902, Q903 OR Q904
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q901"]
        responses = ["Yes, a lot of difficulty"]

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
            label__name="PHYSICAL DISABILITY").first().get_final_colour() == Colors.RED.value

    def test_physical_disability_red_flag2(self):
        """Test that PHYSICAL DISABILITY is flagged red 
        if responds ‘Yes, a lot of difficulty’, ‘Cannot do it at all’,
        or ‘Don’t know’ to Q901, Q902, Q903 OR Q904
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q902"]
        responses = ["Cannot do it at all"]

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
            label__name="PHYSICAL DISABILITY").first().get_final_colour() == Colors.RED.value

    def test_physical_disability_red_flag3(self):
        """Test that PHYSICAL DISABILITY is flagged red 
        if responds ‘Yes, a lot of difficulty’, ‘Cannot do it at all’,
        or ‘Don’t know’ to Q901, Q902, Q903 OR Q904
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q903"]
        responses = ["Don’t know"]

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
            label__name="PHYSICAL DISABILITY").first().get_final_colour() == Colors.RED.value

    def test_physical_disability_green_flag1(self):
        """Test that PHYSICAL DISABILITY is flagged green 
        if not respond ‘Yes, a lot of difficulty’, ‘Cannot do it at all’,
        or ‘Don’t know’ to Q901, Q902, Q903 OR Q904
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q903"]
        responses = ["No, no difficulty"]

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
            label__name="PHYSICAL DISABILITY").first().get_final_colour() == Colors.GREEN.value

    def test_physical_disability_green_flag2(self):
        """Test that PHYSICAL DISABILITY is flagged green 
        if not respond ‘Yes, a lot of difficulty’, ‘Cannot do it at all’,
        or ‘Don’t know’ to Q901, Q902, Q903 OR Q904
        """

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q903"]
        responses = ["Yes, some difficulty"]

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
            label__name="PHYSICAL DISABILITY").first().get_final_colour() == Colors.GREEN.value
