from django.urls import reverse
import json
from rest_framework import status
from accounts.models import User
from knox.models import AuthToken
from model_mommy import mommy
from rest_framework.test import APITestCase
from dashboard.models import *
from datetime import timedelta


class PostMultipleResponsesTests(APITestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Authentication
        user = mommy.make(User)
        token = AuthToken.objects.create(user)[1]
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.url_name = 'rest_api:post-multiple-responses'

        # GIVEN
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        return super().setUp()

    def test_submit_multitple_respones(self):
        """
        Test that responses can be submitted successfully.
        """
        # GIVEN
        question_q101 = Question.objects.filter(
            text__icontains="I stay with").first()
        selected_option_ids = list(question_q101.options.all()[:2].values_list(
            "id", flat=True))
        study_phase = str(StudyPhase.FOLLOWUP)

        # WHEN
        data = {
            "adolescent_id":
            self.adolescent.id,
            "study_phase":
            study_phase,
            "question_responses_json":
            json.dumps({
                question_q101.id: {
                    "first": None,  # Simple value
                    "second": selected_option_ids,  # Option ids,
                }
            })
        }
        url = reverse(self.url_name)
        response = self.client.post(url, data)

        # THEN
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["last_answered_question_id"],
                         question_q101.id)
        self.assertEqual(
            question_q101.responses.filter(adolescent=self.adolescent).count(),
            1,
        )
        self.assertEqual(
            question_q101.responses.filter(
                adolescent=self.adolescent).first().study_phase,
            study_phase,
        )
