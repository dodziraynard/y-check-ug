from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from ycheck.utils.constants import Colors
from dashboard.models import *


class MentalHealthFlaggingTestCase(TestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Given
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        self.adolescent.type = "secondary"
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        self.questions_ids = [f"Q{i}" for i in range(701, 754, 1) if i != 707]
        return super().setUp()

    def test_mental_health_questions_exists(self):
        assert Question.objects.filter(
            question_id__in=self.questions_ids).count() == len(self.questions_ids)

    def test_mental_health_red_flag1(self):
        """Test that if the sum of responses between Q701 and Q735 > 30, mental_health flag is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(701, 736, 1) if i != 707]
        responses = ["Sometimes"] * len(questions_ids)

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.RED.value

    def test_mental_health_red_flag2(self):
        """Test that if the sum of responses between Q701 and Q735 > 30, mental_health flag is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(701, 736, 1) if i != 707]
        responses = ["Often"] * len(questions_ids)

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.RED.value

    def test_mental_health_green_flag1(self):
        """Test that if the sum of responses between Q701 and Q735 < 30 and Q736 and Q737 are 'No' then mental_health flag is flagged green."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(701, 738, 1) if i != 707]
        responses = ["Never"] * len(questions_ids)
        responses[2] = "Sometimes"
        responses[3] = "Often"
        responses[4] = "Often"
        responses[5] = "Sometimes"
        responses[-2:] = ["No"] * 2

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.GREEN.value

    def test_mental_health_orange_flag1(self):
        """Test that if the sum of responses between Q738 and Q746 = 10-14 then mental_health flag is flagged orange."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(738, 747, 1)]
        responses = ["Yes, some of the time"] * \
            len(questions_ids)  # i.e., 1 point each
        responses[3] = "Yes, all the time"  # 3 points

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.ORANGE.value

    def test_mental_health_red_flag3(self):
        """Test that if the sum of responses between Q738 and Q746 = 15-27 then mental_health flag is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(738, 747, 1)]
        responses = ["Yes, all the time"] * \
            len(questions_ids)  # i.e., 3 points each
        responses[3] = "Yes, most of the time"  # 1 point

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.RED.value

    def test_mental_health_orange_flag2(self):
        """Test that if the sum of responses between Q747 and Q753 is 10-15 then mental_health flag is flagged orange."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(747, 754, 1)]
        responses = ["Yes, most of the time"] * \
            len(questions_ids)  # i.e., 2 points each

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.ORANGE.value

    def test_mental_health_red_flag4(self):
        """Test that if the sum of responses between Q747 and Q753 is 10-15 then mental_health flag is flagged red."""

        # GIVEN:
        adolescent = self.adolescent
        questions_ids = [f"Q{i}" for i in range(747, 754, 1)]
        responses = ["Yes, all the time"] * \
            len(questions_ids)  # i.e., 3 points each
        responses[3] = "Yes, most of the time"  # 1 point

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
            label__name="MENTAL HEALTH").first().get_final_colour() == Colors.RED.value
