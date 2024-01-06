from django.db import models
from ycheck.utils.constants import COLOR_CHOICES
from .section import Section
from ycheck.utils.constants import ResponseInputType
from .adolescent import Adolescent
from .flags import SummaryFlag
from .mixin import UpstreamSyncBaseModel

QUESTION_TYPE = [
    ('pre_screening', 'pre_screening'),
    ('practice', 'practice'),
    ('survey', 'survey'),
    ('survey_feedback', 'survey_feedback'),
    ('physical_assessment', 'physical_assessment'),
    ('lab_assessment', 'lab_assessment'),
    ('clinical_assessment', 'clinical_assessment'),
]


class PreviousResponseRequirement(UpstreamSyncBaseModel):
    requirement_for = models.ForeignKey(
        "Question", related_name="previous_response_requirements", on_delete=models.CASCADE, db_index=True)
    question = models.ForeignKey("Question", on_delete=models.CASCADE)
    response_is = models.CharField(max_length=100, null=True, blank=True)
    min_integer_value = models.IntegerField(null=True, blank=True)
    dependent_on_flag = models.ForeignKey(
        "dashboard.FlagLabel", on_delete=models.SET_NULL, null=True, blank=True)
    expected_flag_color = models.CharField(
        choices=COLOR_CHOICES, max_length=10, null=True, blank=True)

    # Can be used to establish 'skip' dependencies.
    is_inverted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"'{self.question.text}' must be '{self.response_is}'"

    def is_previous_response_condition_met(self, adolescent):

        summary = SummaryFlag.objects.filter(
            label=self.expected_flag_color, adolescent=adolescent).first()

        if (summary
            and self.expected_flag_color
                and summary.get_final_colour() != self.expected_flag_color):
            return False

        response = AdolescentResponse.objects.filter(
            question=self.question, adolescent=adolescent).first()
        if not response:
            return False
        matched = False

        if self.min_integer_value == None and self.response_is:
            matched = self.response_is.lower() in response.get_values_as_list()

        elif self.response_is and self.response_is.isdigit() and self.min_integer_value:
            matched = all([int(self.min_integer_value) > int(res)
                          for res in response.get_values_as_list(numeric=True)])
        return matched if not self.is_inverted else not matched


class QuestionGroup(UpstreamSyncBaseModel):
    GROUP_EFFECT_CHOICES = [
        ('highest_value', 'highest_value'),
        ('lowest_value', 'lowest_value'),
    ]
    UNTIL_FUNCTION_TAG_CHOICES = [
        ('right_grip_test', 'right_grip_test'),
        ('left_grip_test', 'left_grip_test'),
    ]
    name = models.CharField(max_length=100)
    util_function_tag = models.CharField(
        max_length=100, choices=UNTIL_FUNCTION_TAG_CHOICES, null=True, blank=True)
    group_effect = models.CharField(
        max_length=100, choices=GROUP_EFFECT_CHOICES)

    def __str__(self) -> str:
        return self.name

    def get_group_value(self, adolescent: Adolescent) -> int | None:
        if not hasattr(self, "questions"):
            return

        questions = self.questions.all()

        responses = AdolescentResponse.objects.filter(
            question__in=questions, adolescent=adolescent)
        values = [value for response in responses for value in response.get_values_as_list(
            numeric=True)]

        if self.group_effect == "highest_value":
            return max(values)
        if self.group_effect == "lowest_value":
            return min(values)


class Question(UpstreamSyncBaseModel):
    TYPE_CHOICES = [
        ('basic', 'basic'),
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
    UNTIL_FUNCTION_TAG_CHOICES = [
        ('bmi_height', 'bmi_height'),
        ('bmi_weight', 'bmi_weight'),
    ]
    admins_comment = models.TextField(null=True, blank=True)
    group = models.ForeignKey(QuestionGroup, related_name="questions",
                              on_delete=models.SET_NULL, null=True, blank=True)
    caption = models.CharField(
        max_length=100, default="", null=True, blank=True)
    question_type = models.TextField(choices=QUESTION_TYPE)
    question_id = models.CharField(max_length=50, unique=True, db_index=True)
    section = models.ForeignKey(
        Section, related_name="questions", on_delete=models.PROTECT, db_index=True)
    number = models.IntegerField(unique=True, db_index=True)
    text = models.TextField()
    input_type = models.CharField(max_length=100, choices=INPUT_TYPES)
    answer_preamble = models.CharField(max_length=100, blank=True, null=True)
    apk_id = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='image/', blank=True, null=True)
    audio_file = models.FileField(upload_to='audios/', blank=True, null=True)
    to_be_confirmed = models.BooleanField(default=False)

    # Useful if input_type is range slider
    min_numeric_value = models.IntegerField(null=True, blank=True)
    max_numeric_value = models.IntegerField(null=True, blank=True)

    # Required adolescent attributes
    type_of_visit = models.CharField(max_length=100, null=True, blank=True)
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    adolescent_type = models.CharField(
        max_length=100, choices=TYPE_CHOICES, null=True, blank=True)

    # This is useful for situations like "This questions is for adolescent_type=basic and secondary"
    # In that case, we just use the dependencies adoeslcent_type=communit + invert_adolescent_attribute_requirements=True
    invert_adolescent_attribute_requirements = models.BooleanField(
        default=False, null=True, blank=True)

    # Other conditions
    previous_question_group = models.ForeignKey(QuestionGroup, related_name="dependent_questions",
                                                on_delete=models.CASCADE, null=True, blank=True)
    min_group_value = models.IntegerField(null=True, blank=True)
    max_group_value = models.IntegerField(null=True, blank=True)

    util_function_tag = models.CharField(
        max_length=100, choices=UNTIL_FUNCTION_TAG_CHOICES, null=True, blank=True)

    def are_previous_response_conditions_met(self, adolescent):
        if self.previous_question_group:
            group_value = self.previous_question_group.get_group_value(
                adolescent)
            if group_value and self.min_group_value and group_value < self.min_group_value:
                return False
            if group_value and self.max_group_value and group_value > self.max_group_value:
                return False

        conditions_met = []
        for response in self.previous_response_requirements.all():
            conditions_met.append(
                response.is_previous_response_condition_met(adolescent))
        return all(conditions_met)

    def __str__(self):
        return f"{self.question_id} ({self.number}). {self.text}"

    def get_response(self, adolescent: Adolescent, numeric=False) -> list:
        response = AdolescentResponse.objects.filter(
            question=self, adolescent=adolescent).first()
        return response.get_values_as_list(numeric) if response else []


class Option(UpstreamSyncBaseModel):
    question = models.ForeignKey(
        Question, related_name="options", on_delete=models.CASCADE, db_index=True)
    value = models.CharField(max_length=200)
    audio_file = models.FileField(upload_to='audios/', blank=True, null=True)
    context = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='image/', blank=True, null=True)
    numeric_value = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.question.text} ({self.value})"

    def has_image(self):
        return bool(self.image and self.image.file and True or False)


class AdolescentResponse(UpstreamSyncBaseModel):
    adolescent = models.ForeignKey(
        Adolescent, on_delete=models.CASCADE, db_index=True)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, db_index=True)
    chosen_options = models.ManyToManyField(Option, blank=True)
    text = models.CharField(max_length=200, blank=True, default="")

    def __str__(self) -> str:
        return str(self.question)

    def get_values_as_list(self, numeric=False):
        responses = []
        if self.question.input_type in [ResponseInputType.NUMBER_FIELD.value,
                                        ResponseInputType.TEXT_FIELD.value,
                                        ResponseInputType.RANGER_SLIDER.value]:
            if numeric and self.text.isdigit():
                responses.append(int(self.text.strip()))
            elif not numeric:
                responses.append(self.text.strip().lower())

        elif self.question.input_type in [ResponseInputType.RADIO_BUTTON.value,
                                          ResponseInputType.CHECKBOXES.value]:
            for option in self.chosen_options.all():
                if numeric and (option.numeric_value != None or self.text.strip().isdigit()):
                    value = option.numeric_value if option.numeric_value != None else int(
                        self.text.strip())
                    responses.append(value)
                elif not numeric:
                    value = option.value.strip().lower() if option.value != None else ""
                    responses.append(value)
        return responses
