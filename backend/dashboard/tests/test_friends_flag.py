from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class FriendsFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.adolescent = mommy.make(Adolescent)
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))
        return super().setUp()

    def test_friends_questions_exists(self):
        questions_ids = ["Q407", "Q408"]
        assert Question.objects.filter(
            question_id__in=questions_ids).count() == len(questions_ids)

    def test_friends_red_flag1(self):
        """Test that FRIENDS is flagged red if Q407 is 'Bad'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q407"]
        responses = ["Bad"]

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
            label__name="FRIENDS").first().get_final_colour() == Colors.RED.value

    def test_friends_red_flag2(self):
        """Test that FRIENDS is flagged red if Q408 is 'Often'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q408"]
        responses = ["Often"]

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
            label__name="FRIENDS").first().get_final_colour() == Colors.RED.value

    def test_friends_red_flag3(self):
        """Test that FRIENDS is flagged red if Q408 is 'Always'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q408"]
        responses = ["Always"]

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
            label__name="FRIENDS").first().get_final_colour() == Colors.RED.value

    def test_friends_green_flag3(self):
        """Test that FRIENDS is flagged green if Q408 is 'Never'"""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = ["Q408"]
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

        SummaryFlag.compute_flag_color(adolescent)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name="FRIENDS").first().get_final_colour() == Colors.GREEN.value
