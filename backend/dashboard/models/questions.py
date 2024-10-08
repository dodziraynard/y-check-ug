from django.db import models

from dashboard.models.types import StudyPhase
from ycheck.utils.storage import OverwriteStorage
from ycheck.utils.functions import isnumber
from .section import Section
from ycheck.utils.constants import ResponseInputType
from .adolescent import Adolescent
from .mixin import UpstreamSyncBaseModel
from .constant import QUESTION_TYPE, STUDY_PHASE_CHOICES


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
    util_function_tag = models.CharField(max_length=100,
                                         choices=UNTIL_FUNCTION_TAG_CHOICES,
                                         null=True,
                                         blank=True)
    group_effect = models.CharField(max_length=100,
                                    choices=GROUP_EFFECT_CHOICES)

    def __str__(self) -> str:
        return self.name

    def get_group_value(self, adolescent: Adolescent,
                        study_phase: StudyPhase) -> int | None:
        if not hasattr(self, "questions"):
            return

        questions = self.questions.all()

        responses = AdolescentResponse.objects.filter(
            study_phase=str(study_phase),
            question__in=questions,
            adolescent=adolescent,
        )
        values = [
            value for response in responses
            for value in response.get_values_as_list(numeric=True)
        ]

        if self.group_effect == "highest_value":
            return max(values, default=-1)
        if self.group_effect == "lowest_value":
            return min(values, default=-1)


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
        ('anaemia', 'anaemia'),
    ]
    admins_comment = models.TextField(null=True, blank=True)
    variable_name = models.CharField(max_length=100, null=True, blank=True)
    group = models.ForeignKey(QuestionGroup,
                              related_name="questions",
                              on_delete=models.SET_NULL,
                              null=True,
                              blank=True)
    caption = models.CharField(max_length=100,
                               default="",
                               null=True,
                               blank=True)
    question_type = models.TextField(choices=QUESTION_TYPE)
    question_id = models.CharField(max_length=50, unique=True, db_index=True)
    section = models.ForeignKey(Section,
                                related_name="questions",
                                on_delete=models.PROTECT,
                                db_index=True)
    number = models.IntegerField(unique=True, db_index=True)
    text = models.TextField()
    input_type = models.CharField(max_length=100, choices=INPUT_TYPES)
    answer_preamble = models.CharField(max_length=100, blank=True, null=True)
    apk_id = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='image/',
                              storage=OverwriteStorage(),
                              blank=True,
                              null=True)
    audio_file = models.FileField(upload_to='audios/',
                                  storage=OverwriteStorage(),
                                  blank=True,
                                  null=True)
    audio_file_fat = models.FileField(upload_to='audios/',
                                      storage=OverwriteStorage(),
                                      blank=True,
                                      null=True)
    to_be_confirmed = models.BooleanField(default=False)

    # Useful if input_type is range slider
    min_numeric_value = models.IntegerField(null=True, blank=True)
    max_numeric_value = models.IntegerField(null=True, blank=True)

    # Required adolescent attributes
    study_phase = models.CharField(max_length=100, null=True, blank=True)
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    adolescent_type = models.CharField(max_length=100,
                                       choices=TYPE_CHOICES,
                                       null=True,
                                       blank=True)

    # This is useful for situations like "This questions is for adolescent_type=basic and secondary"
    # In that case, we just use the dependencies adoeslcent_type=communit + invert_adolescent_attribute_requirements=True
    invert_adolescent_attribute_requirements = models.BooleanField(
        default=False, null=True, blank=True)

    # Other conditions
    previous_question_group = models.ForeignKey(
        QuestionGroup,
        related_name="dependent_questions",
        on_delete=models.CASCADE,
        null=True,
        blank=True)
    min_group_value = models.IntegerField(null=True, blank=True)
    max_group_value = models.IntegerField(null=True, blank=True)

    util_function_tag = models.CharField(max_length=100,
                                         choices=UNTIL_FUNCTION_TAG_CHOICES,
                                         null=True,
                                         blank=True)
    show_response_for = models.ForeignKey("Question",
                                          on_delete=models.SET_NULL,
                                          null=True,
                                          blank=True)
    response_regex = models.CharField(max_length=200, blank=True, null=True)
    regex_error_message = models.CharField(max_length=200,
                                           blank=True,
                                           null=True)
    exclude_study_phase = models.CharField(max_length=50,
                                           choices=STUDY_PHASE_CHOICES,
                                           blank=True,
                                           null=True)
    exclude_if_not_flagged = models.BooleanField(default=None,
                                                 blank=True,
                                                 null=True)
    related_labels = models.ManyToManyField("FlagLabel",
                                            related_name="questions",
                                            blank=True)

    def has_previous_question_requirement(self, current_question):
        if not current_question:
            return False
        return (self.previous_question_group
                and self.previous_question_group.filter(dependent_questions__number__gt=current_question.number)) or \
            self.previous_response_requirements.filter(
                question__number__gt=current_question.number).exists()

    def are_previous_response_conditions_met(self, adolescent: Adolescent,
                                             study_phase: StudyPhase):
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
                response.is_previous_response_condition_met(
                    adolescent, study_phase))

        # Ensure at least one of the conditions is met.
        return any(conditions_met) or len(conditions_met) == 0

    def __str__(self):
        return f"{self.question_id} ({self.number}). {self.text}"

    def get_response(self,
                     adolescent: Adolescent,
                     study_phase: StudyPhase,
                     numeric=False) -> list:
        response = AdolescentResponse.objects.filter(
            study_phase=str(study_phase), question=self,
            adolescent=adolescent).first()
        return response.get_values_as_list(numeric) if response else []


class Option(UpstreamSyncBaseModel):
    question = models.ForeignKey(Question,
                                 related_name="options",
                                 on_delete=models.CASCADE,
                                 db_index=True)
    value = models.CharField(max_length=200)
    audio_file = models.FileField(upload_to='audios/',
                                  storage=OverwriteStorage(),
                                  blank=True,
                                  null=True)
    audio_file_fat = models.FileField(upload_to='audios/',
                                      storage=OverwriteStorage(),
                                      blank=True,
                                      null=True)
    context = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='image/',
                              storage=OverwriteStorage(),
                              blank=True,
                              null=True)
    numeric_value = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.question.text} ({self.value})"

    def has_image(self):
        return bool(self.image and self.image.file and True or False)


class AdolescentResponse(UpstreamSyncBaseModel):
    adolescent = models.ForeignKey(Adolescent,
                                   related_name="responses",
                                   on_delete=models.CASCADE,
                                   db_index=True)
    question = models.ForeignKey(Question,
                                 related_name="responses",
                                 on_delete=models.CASCADE,
                                 db_index=True)
    chosen_options = models.ManyToManyField(Option, blank=True)
    text = models.CharField(max_length=200, null=True, blank=True, default="")
    study_phase = models.CharField(max_length=50,
                                   choices=STUDY_PHASE_CHOICES,
                                   blank=True,
                                   null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['adolescent', 'question', "study_phase"],
                name='unique_response_per_question_per_study_phase.',
            )
        ]

    def __str__(self) -> str:
        return str(self.question)

    def save(self, *args, **kwargs) -> None:
        if self.text == None:
            self.text = ""
        if self.study_phase == None:
            self.study_phase = self.adolescent.study_phase
        return super().save(*args, **kwargs)

    def get_values_as_list(self, numeric=False):
        self.text = self.text or ""
        responses = []
        if self.question.input_type in [
                ResponseInputType.NUMBER_FIELD.value,
                ResponseInputType.TEXT_FIELD.value,
                ResponseInputType.RANGER_SLIDER.value
        ]:
            if numeric and isnumber(self.text.strip()):
                responses.append(float(self.text.strip()))
            elif not numeric:
                responses.append(self.text.strip().lower())

        elif self.question.input_type in [
                ResponseInputType.RADIO_BUTTON.value,
                ResponseInputType.CHECKBOXES.value
        ]:
            for option in self.chosen_options.all():
                if numeric and (option.numeric_value != None
                                or isnumber(self.text.strip())):
                    value = option.numeric_value if option.numeric_value != None else float(
                        self.text.strip())
                    responses.append(value)
                elif not numeric:
                    value = option.value.strip().lower(
                    ) if option.value != None else ""
                    responses.append(value)
        return responses
