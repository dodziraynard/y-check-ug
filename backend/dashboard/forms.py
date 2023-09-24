from django import forms

from dashboard.models import Facility


class FacilityForm(forms.ModelForm):

    class Meta:
        model = Facility
        exclude = [
            "id",
        ]
