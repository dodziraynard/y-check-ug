from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, SecurityQuestion, SecurityQuestionAnswer


class CustomUserCreationForm(UserCreationForm):
    security_question_1 = forms.ModelChoiceField(
        queryset=SecurityQuestion.objects.all(),
        required=True,
        widget=forms.Select,
        label='Security Question 1',
        help_text='Choose a security question'
    )
    security_answer_1 = forms.CharField(
        required=True,
        widget=forms.TextInput,
        label='Answer to Question 1',
        help_text='Provide an answer to your selected security question'
    )

    security_question_2 = forms.ModelChoiceField(
        queryset=SecurityQuestion.objects.all(),
        required=True,
        widget=forms.Select,
        label='Security Question 2',
        help_text='Choose a second security question'
    )
    security_answer_2 = forms.CharField(
        required=True,
        widget=forms.TextInput,
        label='Answer to Question 2',
        help_text='Provide an answer to your second selected security question'
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 
                  'phone', 'password1', 'password2', 
                  'security_question_1', 'security_answer_1', 
                  'security_question_2', 'security_answer_2']

    def save(self, commit=True):
        user = super().save(commit=False)

        if commit:
            user.save()
            SecurityQuestionAnswer.objects.create(
                user=user, 
                security_question=self.cleaned_data['security_question_1'],
                answer=self.cleaned_data['security_answer_1']
            )
            SecurityQuestionAnswer.objects.create(
                user=user, 
                security_question=self.cleaned_data['security_question_2'],
                answer=self.cleaned_data['security_answer_2']
            )

        return user
