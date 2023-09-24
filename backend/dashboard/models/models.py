from collections.abc import Iterable
from datetime import datetime
from django.db import models
from accounts.models import User
from django.conf import settings
from ycheck.utils.constants import ResponseInputType

QUESTION_TYPE = [
    ('survey', 'survey'),
    ('assessment', 'assessment'),
    ('survey_feedback', 'survey_feedback'),
]


class Adolescent(models.Model):
    ADOLESCENT_TYPE_CHOICES = [
        ("primary", 'primary'),
        ("secondary", 'secondary'),
        ("community", 'community'),
    ]
    ADOLESCENT_SEX_TYPE = [
        ("male", 'male'),
        ("female", 'female'),
    ]
    uuid = models.UUIDField(null=True, blank=True, db_index=True)
    pid = models.CharField(unique=True, max_length=20, db_index=True)
    surname = models.CharField(max_length=50, db_index=True)
    other_names = models.CharField(max_length=50, db_index=True)
    visit_type = models.CharField(max_length=50, blank=True, null=True)
    consent = models.CharField(max_length=50, blank=True, null=True)
    picture = models.ImageField(upload_to='images/', blank=True, null=True)
    dob = models.DateTimeField(null=True, blank=True)
    check_up_location = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=ADOLESCENT_TYPE_CHOICES)
    gender = models.CharField(max_length=50, blank=True, null=True)
    questionnaire_completed = models.BooleanField(default=False)
    completed_question = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='adolescent_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.surname} {self.other_names}'

    def get_age(self):
        return int((datetime.today()-self.dob).days / 365.25)

    def get_name(self):
        return f"{self.surname} {self.other_names}"


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
    name = models.CharField(max_length=100, db_index=True)
    instruction = models.TextField()
    question_type = models.CharField(
        max_length=100, default="survey",
        choices=QUESTION_TYPE, db_index=True)
    number = models.IntegerField(unique=True)
    requires_game = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class PreviousResponseRequirement(models.Model):
    requirement_for = models.ForeignKey(
        "Question", related_name="previous_response_requirements", on_delete=models.CASCADE, db_index=True)
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
    question_id = models.CharField(max_length=50, unique=True, db_index=True)
    section = models.ForeignKey(
        Section, related_name="questions", on_delete=models.PROTECT, db_index=True)
    number = models.IntegerField(unique=True, db_index=True)
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

    def are_previous_response_conditions_met(self, adolescent):
        conditions_met = []
        for response in self.previous_response_requirements.all():
            conditions_met.append(
                response.is_previous_response_condition_met(adolescent))
        return all(conditions_met)

    def __str__(self):
        return f"{self.question_id}. {self.text}"

    def get_response(self, adolescent):
        response = AdolescentResponse.objects.filter(
            question=self, adolescent=adolescent).first()
        return response.get_values_as_list() if response else []


class Option(models.Model):
    question = models.ForeignKey(
        Question, related_name="options", on_delete=models.CASCADE, db_index=True)
    value = models.CharField(max_length=200)
    image = models.ImageField(upload_to='image/', blank=True, null=True)
    numeric_value = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.question.text} ({self.value})"


class AdolescentResponse(models.Model):
    adolescent = models.ForeignKey(
        Adolescent, on_delete=models.CASCADE, db_index=True)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, db_index=True)
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
                    value = option.numeric_value if option.numeric_value != None else int(
                        self.text)
                else:
                    value = option.value.lower() if option.value != None else ""
                responses.append(value)
        return responses


class SummaryFlag(models.Model):
    adolescent = models.ForeignKey(
        Adolescent, on_delete=models.CASCADE, db_index=True)
    name = models.CharField(max_length=50, db_index=True)
    comment = models.CharField(max_length=200, default="This value was inffered.")
    computed_color_code = models.CharField(max_length=10)
    updated_color_code = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['adolescent', 'name'], name='Adolescent flag')
        ]

    def __str__(self) -> str:
        return f"{self.adolescent.get_name()}: {self.name}-{self.updated_color_code}"


class FlagLabel(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    def __str__(self) -> str:
        return self.name

    def get_flag_color(self, adolescent):
        colors = self.colors.all()
        fallback_color = None
        for color in colors:
            if color.is_fallback:
                fallback_color = color  # There should be only one fallback per color group

            required_conditions = color.conditions.filter(
                is_required=True).order_by("-priority")
            optional_conditions = color.conditions.filter(
                is_required=False).order_by("-priority")
            for condition in required_conditions:
                matched = condition.check_condition(adolescent)
                if matched != True:
                    break  # To go different color.
            else:  # All required conditions are satisfied.
                # At lest one optional condition must be met
                if not optional_conditions:
                    return color.color_code
                for condition in optional_conditions:
                    matched = condition.check_condition(adolescent)
                    if matched:
                        return color.color_code
        if fallback_color:
            return fallback_color.color_code


class FlagColor(models.Model):
    flag_label = models.ForeignKey(
        FlagLabel, related_name="colors", on_delete=models.CASCADE, db_index=True)
    color_name = models.CharField(max_length=20, null=True, blank=True)
    color_code = models.CharField(max_length=10)
    is_fallback = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.flag_label.name}-{self.color_code} ({self.color_name})"

    def save(self, *args, **kwars) -> None:
        self.color_code = self.color_code.lower()
        return super().save(*args, **kwars)


class FlagCondition(models.Model):

    OPERATORS = [
        ("equal_expected_value", "equal_expected_value"),
        ("less_than_expected_integer_value", "less_than_expected_integer_value"),
        ("q1_q2_difference_is_equal_to_expected_integer_value",
         "q1_q2_difference_is_equal_to_expected_integer_value"),
        ("q1_q2_difference_is_less_than_expected_integer_value",
         "q1_q2_difference_is_less_than_expected_integer_value"),
        ("min_age", "min_age"),
        ("gender_is", "gender_is"),
    ]

    flag_color = models.ForeignKey(
        FlagColor, related_name="conditions", on_delete=models.CASCADE, db_index=True)
    question1 = models.ForeignKey(
        Question, related_name="flag1s", on_delete=models.CASCADE)
    # For only difference.
    question2 = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="flag2s", null=True, blank=True)

    expected_value = models.CharField(max_length=100, null=True, blank=True)
    expected_integer_value = models.IntegerField(null=True, blank=True)

    operator = models.CharField(max_length=100, choices=OPERATORS)

    invert_operator_evaluation = models.BooleanField(default=False)
    # similar to AND operator and not required is similar to OR operator.
    is_required = models.BooleanField(default=False, db_index=True)

    priority = models.IntegerField(default=1)

    def __str__(self) -> str:
        expected_value = self.expected_value or self.expected_integer_value
        return f"{str(self.flag_color)}-{expected_value}"

    def check_condition(self, adolescent: Adolescent):
        response1 = AdolescentResponse.objects.filter(
            question=self.question1, adolescent=adolescent).first()
        response2 = AdolescentResponse.objects.filter(
            question=self.question2, adolescent=adolescent).first() if self.question2 else None
        if not response1:
            return None

        matched = None
        if self.operator == "equal_expected_value":
            matched = self.expected_value.lower() in list(
                map(str, response1.get_values_as_list()))
        elif self.operator == "less_than_expected_integer_value":
            matched = all([int(self.expected_integer_value) > int(res)
                          for res in response1.get_values_as_list(numeric=True)])
        elif self.operator == "min_age":
            matched = self.expected_integer_value <= adolescent.get_age()
        elif self.operator == "gender_is":
            matched = self.expected_value == adolescent.gender
        elif response2 != None:
            values1_as_list = response1.get_values_as_list(numeric=True)
            values2_as_list = response2.get_values_as_list(numeric=True)
            if values1_as_list and values2_as_list:
                value_1 = values1_as_list[0]
                value_2 = values2_as_list[0]
                diff = value_1 - value_2
                if self.operator == "q1_q2_difference_is_equal_to_expected_integer_value":
                    matched = diff == self.expected_integer_value
                elif self.operator == "q1_q2_difference_is_less_than_expected_integer_value":
                    matched = diff < self.expected_integer_value
        if matched != None:
            return matched if not self.invert_operator_evaluation else not matched
        return matched
