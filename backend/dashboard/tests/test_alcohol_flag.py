from datetime import timedelta
from django.test import TestCase
from model_mommy import mommy
from dashboard.models import *


class AlcoholFlaggingTestCase(TestCase):
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

    def test_alcohol_questions_exists(self):
        question_ids = ["Q501", "Q502", "Q503", "Q504",
                        "Q505", "Q506", "Q507", "Q508", "Q509"]
        questions = Question.objects.filter(question_id__in=question_ids)
        assert questions.count() == len(question_ids)

    def test_flag_red_crafft_q501(self):
        """Test that, given a crafft score >= 2 and Q501>0, alcohol is flagged red.
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="3"
        )

        # Answers Q502 as yes
        question_q502 = Question.objects.filter(question_id="Q502").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q502,
            text="3"
        )

        # Answers Q503 as yes
        question_q503 = Question.objects.filter(question_id="Q503").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q503,
            text="3"
        )

        # Answers Q504 as yes
        question_q504 = Question.objects.filter(question_id="Q504").first()
        response_q504 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q504,
        )
        response_q504.chosen_options.set(
            question_q504.options.filter(value__icontains="yes"))

        # Answers Q505 as yes
        question_q505 = Question.objects.filter(question_id="Q505").first()
        response_q505 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q505,
        )
        response_q505.chosen_options.set(
            question_q505.options.filter(value__icontains="yes"))

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#ff0000"

    def test_flag_orange_crafft_q501(self):
        """Test that, given a crafft score < 2 and Q501>0, alcohol is flagged red.
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="3"
        )

        # Answers Q502 as yes
        question_q502 = Question.objects.filter(question_id="Q502").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q502,
            text="3"
        )

        # Answers Q503 as yes
        question_q503 = Question.objects.filter(question_id="Q503").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q503,
            text="3"
        )

        # Answers Q504 as yes
        question_q504 = Question.objects.filter(question_id="Q504").first()
        response_q504 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q504,
        )
        response_q504.chosen_options.set(
            question_q504.options.filter(value__icontains="no"))

        # Answers Q505 as yes
        question_q505 = Question.objects.filter(question_id="Q505").first()
        response_q505 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q505,
        )
        response_q505.chosen_options.set(
            question_q505.options.filter(value__icontains="no"))

        # Answers Q506 as yes
        question_q506 = Question.objects.filter(question_id="Q506").first()
        response_q506 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q506,
        )
        response_q506.chosen_options.set(
            question_q506.options.filter(value__icontains="yes"))

        # Answers Q507 as yes
        question_q507 = Question.objects.filter(question_id="Q507").first()
        response_q507 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q507,
        )
        response_q507.chosen_options.set(
            question_q507.options.filter(value__icontains="no"))

        # Answers Q508 as yes
        question_q508 = Question.objects.filter(question_id="Q508").first()
        response_q508 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q508,
        )
        response_q508.chosen_options.set(
            question_q508.options.filter(value__icontains="no"))

        # Answers Q509 as yes
        question_q509 = Question.objects.filter(question_id="Q509").first()
        response_q509 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q509,
        )
        response_q509.chosen_options.set(
            question_q509.options.filter(value__icontains="no"))

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#ffa500"

    def test_flag_green_crafft_all_zeroes(self):
        """Test that, given a crafft score < 2 and Q501>0, alcohol is flagged green.
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="0"
        )

        # Answers Q502 as yes
        question_q502 = Question.objects.filter(question_id="Q502").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q502,
            text="0"
        )

        # Answers Q503 as yes
        question_q503 = Question.objects.filter(question_id="Q503").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q503,
            text="0"
        )

        # Answers Q504 as yes
        question_q504 = Question.objects.filter(question_id="Q504").first()
        response_q504 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q504,
        )
        response_q504.chosen_options.set(
            question_q504.options.filter(value__icontains="no"))

        # Answers Q505 as yes
        question_q505 = Question.objects.filter(question_id="Q505").first()
        response_q505 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q505,
        )
        response_q505.chosen_options.set(
            question_q505.options.filter(value__icontains="no"))

        # Answers Q506 as yes
        question_q506 = Question.objects.filter(question_id="Q506").first()
        response_q506 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q506,
        )
        response_q506.chosen_options.set(
            question_q506.options.filter(value__icontains="no"))

        # Answers Q507 as yes
        question_q507 = Question.objects.filter(question_id="Q507").first()
        response_q507 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q507,
        )
        response_q507.chosen_options.set(
            question_q507.options.filter(value__icontains="no"))

        # Answers Q508 as yes
        question_q508 = Question.objects.filter(question_id="Q508").first()
        response_q508 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q508,
        )
        response_q508.chosen_options.set(
            question_q508.options.filter(value__icontains="no"))

        # Answers Q509 as yes
        question_q509 = Question.objects.filter(question_id="Q509").first()
        response_q509 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q509,
        )
        response_q509.chosen_options.set(
            question_q509.options.filter(value__icontains="no"))

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#00ff00"

    def test_flag_green_crafft_one_yes(self):
        """Test that, given a crafft score < 2 and Q501>0, alcohol is flagged green.
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="0"
        )

        # Answers Q502 as yes
        question_q502 = Question.objects.filter(question_id="Q502").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q502,
            text="0"
        )

        # Answers Q503 as yes
        question_q503 = Question.objects.filter(question_id="Q503").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q503,
            text="0"
        )

        # Answers Q504 as yes
        question_q504 = Question.objects.filter(question_id="Q504").first()
        response_q504 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q504,
        )
        response_q504.chosen_options.set(
            question_q504.options.filter(value__icontains="no"))

        # Answers Q505 as yes
        question_q505 = Question.objects.filter(question_id="Q505").first()
        response_q505 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q505,
        )
        response_q505.chosen_options.set(
            question_q505.options.filter(value__icontains="no"))

        # Answers Q506 as yes
        question_q506 = Question.objects.filter(question_id="Q506").first()
        response_q506 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q506,
        )
        response_q506.chosen_options.set(
            question_q506.options.filter(value__icontains="yes"))

        # Answers Q507 as yes
        question_q507 = Question.objects.filter(question_id="Q507").first()
        response_q507 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q507,
        )
        response_q507.chosen_options.set(
            question_q507.options.filter(value__icontains="no"))

        # Answers Q508 as yes
        question_q508 = Question.objects.filter(question_id="Q508").first()
        response_q508 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q508,
        )
        response_q508.chosen_options.set(
            question_q508.options.filter(value__icontains="no"))

        # Answers Q509 as yes
        question_q509 = Question.objects.filter(question_id="Q509").first()
        response_q509 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q509,
        )
        response_q509.chosen_options.set(
            question_q509.options.filter(value__icontains="no"))

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#00ff00"

    def test_flag_green_crafft_one_yes_and_some_empty_responses(self):
        """Test that, given a crafft score < 2 and Q501=0, alcohol is flagged green even if some of the 
            responses are empty
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="0"
        )

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#00ff00"

    def test_flag_orange_crafft_some_empty_responses(self):
        """Test that, given a crafft score < 2 and Q501>0, alcohol is flagged orange even if some of the 
            responses are empty
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="4"
        )

        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#ffa500"


    def test_flag_red_crafft_some_empty_responses(self):
        """Test that, given a crafft score >= 2 and Q501>0, alcohol is flagged red even if some of the 
            responses are empty
            Note: CRAFFT score is sum of Q504, Q505, Q506, Q506, Q508, Q509.
        """
        # GIVEN:
        self.adolescent

        # WHEN:
        # Answers Q501 as yes
        question_q501 = Question.objects.filter(question_id="Q501").first()
        AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q501,
            text="4"
        )
        
        # Answers Q509 as yes
        question_q509 = Question.objects.filter(question_id="Q509").first()
        response_q509 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q509,
        )
        response_q509.chosen_options.set(
            question_q509.options.filter(value__icontains="yes"))
        

        # Answers Q506 as yes
        question_q506 = Question.objects.filter(question_id="Q506").first()
        response_q506 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            question=question_q506,
        )
        response_q506.chosen_options.set(
            question_q506.options.filter(value__icontains="yes"))
        
        # Compute flags
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        # THEN:
        assert SummaryFlag.objects.filter(
            adolescent=self.adolescent,
            label__name__icontains="DRUGS & ALCOHOL").first().get_final_colour() == "#ff0000"
