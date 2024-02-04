from django import forms
from django.contrib.auth.models import Group
from accounts.models import User
from dashboard.models import Facility,Service


class FacilityForm(forms.ModelForm):

    class Meta:
        model = Facility
        exclude = [
            "id",
            "uuid",
        ]



class GroupForm(forms.ModelForm):

    class Meta:
        model = Group
        fields = [
            'name',
        ]
        

class UserForm(forms.ModelForm):

    class Meta:
        model = User
        fields = [
            'username',
            'surname',
            'other_names',
            "phone",
            'facility'
        ]
        
class UserBioDataForm(forms.ModelForm):

    class Meta:
        model = User
        fields = [
            'surname',
            'other_names',
            "phone",
            'gender'
        ]

class ServiceForm(forms.ModelForm):

    class Meta:
        model = Service
        fields = [
            'name',
            'related_flag_labels',
        ]