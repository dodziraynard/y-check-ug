from django.db import models
from accounts.models import Adolescent
from ycheck.utils.constants import ResponseInputType

QUESTION_TYPE = [
    ('survey', 'survey'),
    ('assessment', 'assessment'),
    ('survey_feedback', 'survey_feedback'),
]


class CheckupLocation(models.Model):
    TYPE_CHOICES = [
        ('primary', 'primary'),
        ('secondary', 'secondary'),
        ('community', 'community'),
    ]
    uuid = models.UUIDField(null=True, blank=True)
    name = models.CharField(max_length=200, unique=True)
    type = models.CharField(max_length=100, choices=TYPE_CHOICES)

    def __str__(self) -> str:
        return self.name


class Section(models.Model):
    name = models.CharField(max_length=100)
    instruction = models.TextField()
    question_type = models.CharField(
        max_length=100, default="survey",
        choices=QUESTION_TYPE)
    number = models.IntegerField(unique=True)
    requires_game = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class PreviousResponseRequirement(models.Model):
    question = models.ForeignKey("Question", on_delete=models.CASCADE)
    response_is = models.CharField(max_length=100, null=True, blank=True)
    min_integer_value = models.IntegerField(null=True, blank=True)

    # Can be used to establish 'skip' dependencies.
    is_inverted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"'{self.question.text}' must be '{self.response_is}'"

    def is_previous_response_condition_met(self, adolescent):
        response = AdolescentResponse.objects.filter(
            question=self.question, adolescent=adolescent).first()
        
        if self.min_integer_value == None and self.response_is:
            matched = self.response_is.lower() in response.get_values_as_list()
            
        elif self.response_is.isdigit() and self.min_integer_value:
            matched = all([int(self.min_integer_value) > int(res)
                          for res in response.get_values_as_list(numeric=True)])
        return matched if not self.is_inverted else not matched


class Question(models.Model):
    TYPE_CHOICES = [
        ('primary', 'primary'),
        ('secondary', 'secondary'),
        ('community', 'community'),
    ]
    INPUT_TYPES = [
        ('text_field', 'text_field'),
        ('number_field', 'number_field'),
        ('radio_button', 'radio_button'),
        ('checkboxes', 'checkboxes'),
        ('range_slider', 'range_slider'),
    ]
    admins_comment = models.TextField(null=True, blank=True)
    caption = models.CharField(max_length=100, default="", blank=True)
    question_type = models.TextField(choices=QUESTION_TYPE)
    question_id = models.CharField(max_length=50)
    section = models.ForeignKey(
        Section, related_name="questions", on_delete=models.PROTECT)
    number = models.IntegerField(unique=True)
    text = models.CharField(max_length=200)
    input_type = models.CharField(max_length=100, choices=INPUT_TYPES)
    answer_preamble = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='image/', blank=True, null=True)

    # Useful if input_type is range slider
    min_numeric_value = models.IntegerField(null=True, blank=True)
    max_numeric_value = models.IntegerField(null=True, blank=True)

    # Required adolescent attributes
    type_of_visit = models.CharField(max_length=100, null=True, blank=True)
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    gender = models.IntegerField(null=True, blank=True)
    adolescent_type = models.CharField(
        max_length=100, choices=TYPE_CHOICES, null=True, blank=True)

    # This is useful for situations like "This questions is for adolescent_type=primary and secondary"
    # In that case, we just use the dependencies adoeslcent_type=communit + invert_adolescent_attribute_requirements=True
    invert_adolescent_attribute_requirements = models.BooleanField(
        default=False, null=True, blank=True)

    # Required for conditional rendering
    previous_response_requirements = models.ManyToManyField(
        PreviousResponseRequirement, related_name="required_question", blank=True)

    def are_previous_response_conditions_met(self, adolescent):
        conditions_met = []
        for response in self.previous_response_requirements.all():
            conditions_met.append(
                response.is_previous_response_condition_met(adolescent))
        return all(conditions_met)

    def __str__(self):
        return self.text


class Option(models.Model):
    question = models.ForeignKey(
        Question, related_name="options", on_delete=models.CASCADE)
    value = models.CharField(max_length=200)
    image = models.ImageField(upload_to='image/', blank=True, null=True)
    numeric_value = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.question.text} ({self.value})"


class AdolescentResponse(models.Model):
    adolescent = models.ForeignKey(Adolescent, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    chosen_options = models.ManyToManyField(Option)
    text = models.CharField(max_length=200)

    def __str__(self) -> str:
        return str(self.question)

    def get_values_as_list(self, numeric=False):
        responses = []
        if self.question.input_type in [ResponseInputType.NUMBER_FIELD.value,
                                        ResponseInputType.TEXT_FIELD.value,
                                        ResponseInputType.RANGER_SLIDER.value]:
            if numeric and self.text.isdigit():
                responses.append(int(self.text))
            else:
                responses.append(self.text.lower())

        elif self.question.input_type in [ResponseInputType.RADIO_BUTTON.value,
                                          ResponseInputType.CHECKBOXES.value]:
            for option in self.chosen_options.all():
                if numeric and (option.numeric_value != None or self.text.isdigit()):
                    value = option.numeric_value if option.numeric_value != None else int(self.text)
                else:
                    value = option.value.lower() if option.value != None else ""
                responses.append(value)
        return responses


class SummaryFlag(models.Model):
    label = models.CharField(max_length=100)

    def get_flag_color(self, adolescent):
        conditions = self.conditions.all()
        for condition in conditions:
            if condition.check_condition():
                return condition.color


class FlagCondition(models.Model):
    flag = models.ForeignKey(
        SummaryFlag, related_name="conditions", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    text_value = models.CharField(max_length=100, null=True, blank=True)
    min_integer_value = models.IntegerField(null=True, blank=True)

    is_inverted = models.IntegerField(default=False)

    color = models.CharField(max_length=10)

    def check_condition(self, adolescent):
        response = AdolescentResponse.objects.filter(
            question=self.question, adolescent=adolescent).first()

        matched = False
        if self.text_value:
            matched = self.text_value.lower() in list(
                map(str, response.get_values_as_list()))
        elif self.min_integer_value:
            matched = all([int(self.min_integer_value) > int(res)
                          for res in response.get_values_as_list()])

        return matched if not self.is_inverted else not matched
