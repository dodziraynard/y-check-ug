from django import forms
from django.contrib.auth.models import Group

from dashboard.models import Facility


class FacilityForm(forms.ModelForm):

    class Meta:
        model = Facility
        exclude = [
            "id",
        ]



class GroupForm(forms.ModelForm):

    class Meta:
        model = Group
        fields = [
            'name',
        ]