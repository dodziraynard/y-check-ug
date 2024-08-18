import urllib.parse
from django.urls import reverse
from rest_framework import status
from accounts.models import User
from knox.models import AuthToken
from model_mommy import mommy
from rest_framework.test import APITestCase
from dashboard.models import *
from datetime import timedelta


class GetSurveyQuestionsTests(APITestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Authentication
        user = mommy.make(User)
        token = AuthToken.objects.create(user)[1]
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.url_name = 'rest_api:get-multiple-questions'

        # GIVEN
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        return super().setUp()

    def test_get_survey_questions_returns_a_response(self):
        """
        Test that an authorised user get a response for get-multiple-questions request.
        """
        params = {
            "adolescent_id": self.adolescent.id,
            "question_type": "survey",
        }
        url = "?".join(
            [reverse(self.url_name),
             urllib.parse.urlencode(params)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get("questions")), 0)
        self.assertEqual(response.data["questions"][0]["number"], 101)

    def test_get_next_unanswered_questions(self):
        """
        Test that 'get-multiple-questions' returns non answered questions per study phase.
        i.e., responses are per study phase.
        """
        # GIVEN
        adolescent = self.adolescent
        action = "next_unanswered"
        question_type = "survey"
        study_phase = self.study_phase

        # WHEN
        # Adolescent answers a question (i.e., Q101)
        question_q101 = Question.objects.filter(
            text__icontains="I stay with").first()
        response_q101 = AdolescentResponse.objects.create(
            adolescent=adolescent,
            question=question_q101,
            study_phase=self.study_phase,
        )
        response_q101.chosen_options.set(
            question_q101.options.filter(value__icontains="mother"))

        # THEN
        # Next request shouldn't contain same question (i.e., Q101)
        params = {
            "adolescent_id": self.adolescent.id,
            "question_type": question_type,
            "action": action,
            "study_phase": study_phase,
        }
        url = "?".join(
            [reverse(self.url_name),
             urllib.parse.urlencode(params)])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get("questions")), 0)
        self.assertEqual(response.data["questions"][0]["number"], 102)

        # BUT THEN
        # Requests to get questions for a different study phase should restart.
        params["study_phase"] = str(StudyPhase.FOLLOWUP)
        url = "?".join(
            [reverse(self.url_name),
             urllib.parse.urlencode(params)])
        response = self.client.get(url)
        self.assertEqual(response.data["questions"][0]["number"], 101)

    def test_get_next_questions(self):
        """
        Test that next question returns a question ahead of current questions.
        """
        # GIVEN
        question_q101 = Question.objects.filter(
            text__icontains="I stay with").first()
        adolescent = self.adolescent

        # WHEN
        params = {
            "adolescent_id": adolescent.id,
            "question_type": "survey",
            "action": "next",
            "current_question_id": question_q101.id,
        }
        url = "?".join(
            [reverse(self.url_name),
             urllib.parse.urlencode(params)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get("questions")), 0)
        self.assertEqual(response.data["questions"][0]["number"], 102)

    def test_get_previous_questions(self):
        """
        Test that we can go to previous questions.
        """
        # GIVEN
        question_q103 = Question.objects.filter(
            text__icontains="I have someone at").first()
        adolescent = self.adolescent

        # WHEN
        params = {
            "adolescent_id": adolescent.id,
            "question_type": "survey",
            "action": "previous",
            "current_question_id": question_q103.id,
        }
        url = "?".join(
            [reverse(self.url_name),
             urllib.parse.urlencode(params)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data.get("questions")), 0)
        self.assertEqual(response.data["questions"][0]["number"], 101)
