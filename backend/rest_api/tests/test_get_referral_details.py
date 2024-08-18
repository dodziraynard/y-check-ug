from django.urls import reverse
import json
from rest_framework import status
from accounts.models import User
from knox.models import AuthToken
from model_mommy import mommy
from rest_framework.test import APITestCase
from dashboard.models import *
from datetime import timedelta


class GetReferralDetailTests(APITestCase):
    fixtures = ['dashboard/fixtures/initial_data.json']

    def setUp(self) -> None:
        # Authentication
        user = mommy.make(User, is_superuser=True)
        token = AuthToken.objects.create(user)[1]
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        self.url_name = 'rest_api:referral-details'

        # GIVEN
        self.study_phase = str(StudyPhase.PILOT)
        self.adolescent = mommy.make(
            Adolescent,
            study_phase=self.study_phase,
        )
        self.adolescent.dob = self.adolescent.created_at - \
            timedelta(days=round(17 * 365.25))

        service = Service.objects.create(name="Dummny Services")
        service.related_flag_labels.set(FlagLabel.objects.filter(name__contains="HOME"))
        return super().setUp()

    def test_get_referral_details(self):
        """
        Test that get referral detail endpoint returns valid response.
        """
        # GIVEN

        # WHEN
        # Respond 'Not fine at all' to q102
        question_q102 = Question.objects.filter(
            text__icontains="I am fine with people I stay with").first()
        response_q102 = AdolescentResponse.objects.create(
            adolescent=self.adolescent,
            study_phase=self.study_phase,
            question=question_q102,
        )
        response_q102.chosen_options.set(
            question_q102.options.filter(value__icontains="Not fine at all"))
        SummaryFlag.compute_flag_color(self.adolescent, self.study_phase)

        referral = mommy.make(Referral, adolescent=self.adolescent)
        referral.services.set(Service.objects.all())

        url = reverse(self.url_name, args=[str(referral.id)])

        response = self.client.get(url)

        # THEN
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data["relevant_adolescent_responses"]),
                           0)
