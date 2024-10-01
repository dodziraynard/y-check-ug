import sys
import logging
from django.db import models
from django.db.utils import NotSupportedError
from dashboard.models.types import StudyPhase
from dashboard.models.constant import STUDY_PHASE_CHOICES
from dashboard.models.conditions_util_functions import (
    compute_bmi_sd_function,
    compute_grip_test,
    compute_anaemia_status,
    compute_time_difference,
    compute_vision_status,
)
from ycheck.utils.functions import isnumber
from ycheck.utils.constants import COLOR_CHOICES, Colors
from django.db.models import Q
from dashboard.models.adolescent import Adolescent
from dashboard.models.questions import Question, QuestionGroup, AdolescentResponse
from dashboard.models.mixin import UpstreamSyncBaseModel

logger = logging.getLogger(__name__)


class SummaryFlag(UpstreamSyncBaseModel):
    adolescent = models.ForeignKey(Adolescent,
                                   on_delete=models.CASCADE,
                                   db_index=True)
    label = models.ForeignKey("dashboard.FlagLabel",
                              on_delete=models.CASCADE,
                              db_index=True)
    comment = models.CharField(max_length=200,
                               default="This value was inferred/computed.")
    computed_color_code = models.CharField(choices=COLOR_CHOICES,
                                           max_length=10)
    updated_color_code = models.CharField(choices=COLOR_CHOICES,
                                          max_length=10,
                                          null=True,
                                          blank=True)
    # For report generation only.
    final_color_code = models.CharField(choices=COLOR_CHOICES,
                                        max_length=10,
                                        default=Colors.GREY.value,
                                        null=True,
                                        blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey("accounts.User",
                                   null=True,
                                   blank=True,
                                   on_delete=models.CASCADE)
    context = models.TextField(null=True, blank=True)
    study_phase = models.CharField(max_length=50,
                                   choices=STUDY_PHASE_CHOICES,
                                   blank=True,
                                   null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['adolescent', 'label', 'study_phase'],
                name='unique_summary_flag_per_study_phase')
        ]

    @classmethod
    def compute_flag_color(cls, adolescent: Adolescent,
                           study_phase: StudyPhase):
        flag_labels = FlagLabel.objects.exclude(
            exclude_study_phase=study_phase)
        for label in flag_labels:
            color = label.get_flag_color(adolescent, study_phase)
            if not color:
                # This flag is no longer applicable, delete.
                SummaryFlag.objects.filter(adolescent=adolescent,
                                           study_phase=str(study_phase),
                                           label=label).delete()
                continue

            flag = SummaryFlag.objects.filter(adolescent=adolescent,
                                              study_phase=str(study_phase),
                                              label=label).first()
            if not flag:
                flag = SummaryFlag.objects.create(adolescent=adolescent,
                                                  study_phase=str(study_phase),
                                                  label=label,
                                                  computed_color_code=color)
            elif flag.computed_color_code != color:
                flag.computed_color_code = color
                flag.save()

    def get_final_colour(self):
        return self.updated_color_code if self.updated_color_code else self.computed_color_code

    def __str__(self) -> str:
        name = f"{self.adolescent.get_name()}: {self.label.name}-{self.computed_color_code}"
        if self.updated_color_code:
            name += f"->{self.updated_color_code}"
        return name

    def get_questions(self):
        colors = self.label.colors.all()
        flag_conditions = FlagCondition.objects.filter(flag_color__in=colors)
        question_ids = []

        for condition in flag_conditions:
            if condition.operator == "range_sum_between" and condition.question1 and condition.question2:
                ids = Question.objects.filter(
                    number__gte=condition.question1.number,
                    number__lte=condition.question2.number).values_list(
                        "question_id", flat=True)
                question_ids.extend(ids)
            elif condition.question1:
                question_ids.append(condition.question1.question_id)
            if condition.question2:
                question_ids.append(condition.question2.question_id)

        return Question.objects.filter(
            Q(question_id__in=question_ids) | Q(related_labels=self.label))

    def get_responses(self, study_phase: StudyPhase):
        result = []
        adolescent = self.adolescent

        questions = self.get_questions().filter(
            (Q(gender=None) | Q(gender__iexact=adolescent.gender))
            & ((Q(adolescent_type=None) |
                (Q(adolescent_type__iexact=adolescent.type)
                 & Q(invert_adolescent_attribute_requirements=False)))
               | (Q(adolescent_type=None) |
                  (~Q(adolescent_type__iexact=adolescent.type)
                   & Q(invert_adolescent_attribute_requirements=True))))
            & (Q(study_phase=None)
               | Q(study_phase__iexact=adolescent.study_phase))).exclude(
                   Q(section__exclude_study_phase=study_phase)
                   | Q(exclude_study_phase=study_phase))

        try:
            questions = questions.distinct("question_id")
            questions.exists()  # Try evaluate query.
        except NotSupportedError as e:
            # Do not select distinct on field if DB doesn't support.
            questions = questions.distinct()

        for question in questions:
            response = question.get_response(adolescent, study_phase)
            data = {
                "question": question.text,
                "question_id": question.question_id,
                "answers": response
            }
            result.append(data)

        # If no responses have been provided yet,
        # make final color dark-blue else if no questions make
        # final color grey.
        if self.updated_color_code:
            self.final_color_code = self.updated_color_code
        elif not result:
            self.final_color_code = Colors.GREY.value
        elif not any([len(item.get("answers", [])) > 0 for item in result]):
            self.final_color_code = Colors.DARK_BLUE.value
        else:
            self.final_color_code = self.get_final_colour()

        self.save()
        return result

    def save(self, *args, **kwargs) -> None:
        if self.study_phase == None:
            self.study_phase = self.adolescent.study_phase
        return super().save(*args, **kwargs)


class FlagLabel(UpstreamSyncBaseModel):
    name = models.CharField(max_length=50, unique=True, db_index=True)
    exclude_study_phase = models.CharField(max_length=50,
                                           choices=STUDY_PHASE_CHOICES,
                                           blank=True,
                                           null=True)
    exclude_if_not_flagged = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name

    def get_flag_color(self, adolescent, study_phase):
        colors = self.colors.all().order_by("-priority", "is_fallback",
                                            "-color_name")
        fallback_color = None
        for color in colors:
            if color.is_fallback:
                fallback_color = color  # There should be only one fallback per color group

            conditions = color.conditions.filter(
                (Q(min_age=None) | Q(min_age__gte=adolescent.get_age()))
                & (Q(max_age=None) | Q(max_age__lte=adolescent.get_age())))
            required_conditions = conditions.filter(
                is_required=True).order_by("-priority")
            optional_conditions = conditions.filter(
                is_required=False).order_by("-priority")
            for condition in required_conditions:
                matched = condition.check_condition(adolescent, study_phase)
                if matched != True:
                    break  # To go different color.
            else:  # All required conditions are satisfied.
                # At least one optional condition must be met
                if not optional_conditions:
                    return color.color_code
                for condition in optional_conditions:
                    matched = condition.check_condition(
                        adolescent, study_phase)
                    if matched:
                        return color.color_code
        if fallback_color:
            return fallback_color.color_code


class FlagColor(UpstreamSyncBaseModel):
    color_name_choices = [
        ("RED", "RED"),
        ("ORANGE", "ORANGE"),
        ("GREEN", "GREEN"),
    ]
    flag_label = models.ForeignKey(FlagLabel,
                                   related_name="colors",
                                   on_delete=models.CASCADE,
                                   db_index=True)
    color_name = models.CharField(max_length=20,
                                  choices=color_name_choices,
                                  null=True,
                                  blank=True)
    color_code = models.CharField(max_length=10, choices=COLOR_CHOICES)
    is_fallback = models.BooleanField(default=False)
    priority = models.IntegerField(default=1)

    def __str__(self) -> str:
        return f"{self.flag_label.name}-{self.color_code} ({self.color_name})"

    def save(self, *args, **kwars) -> None:
        self.color_code = self.color_code.lower()
        return super().save(*args, **kwars)


class FlagCondition(UpstreamSyncBaseModel):

    OPERATORS = [
        ("equal_expected_value", "equal_expected_value"),
        ("less_than_expected_integer_value",
         "less_than_expected_integer_value"),
        ("q1_q2_difference_is_equal_to_expected_integer_value",
         "q1_q2_difference_is_equal_to_expected_integer_value"),
        ("q1_q2_difference_is_less_than_expected_integer_value",
         "q1_q2_difference_is_less_than_expected_integer_value"),
        ("min_age", "min_age"),
        ("range_sum_between", "range_sum_between"),
        ("time_difference_between", "time_difference_between"),
        ("gender_is", "gender_is"),
        ("invoke_bmi_sd_function", "invoke_bmi_sd_function"),
        ("group_value_between", "group_value_between"),
        ("compute_right_grip_test", "compute_right_grip_test"),
        ("compute_left_grip_test", "compute_left_grip_test"),
        ("compute_anaemia_status", "compute_anaemia_status"),
        ("compute_vision_status", "compute_vision_status"),
    ]
    name = models.CharField(max_length=100, null=True, blank=True)

    flag_color = models.ForeignKey(FlagColor,
                                   related_name="conditions",
                                   on_delete=models.CASCADE,
                                   db_index=True)
    question1 = models.ForeignKey(Question,
                                  related_name="flag1s",
                                  on_delete=models.CASCADE,
                                  null=True,
                                  blank=True)
    # For only difference.
    question2 = models.ForeignKey(Question,
                                  on_delete=models.CASCADE,
                                  related_name="flag2s",
                                  null=True,
                                  blank=True)
    question_group = models.ForeignKey(QuestionGroup,
                                       related_name="flag_conditions",
                                       on_delete=models.CASCADE,
                                       null=True,
                                       blank=True)

    expected_value = models.CharField(max_length=100, null=True, blank=True)
    expected_integer_value = models.DecimalField(null=True,
                                                 blank=True,
                                                 decimal_places=2,
                                                 max_digits=20)
    operator = models.CharField(max_length=100, choices=OPERATORS)

    invert_operator_evaluation = models.BooleanField(default=False)
    # similar to AND operator and not required is similar to OR operator.
    is_required = models.BooleanField(default=False, db_index=True)

    priority = models.IntegerField(default=1)
    adolescent_type = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)

    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)

    range_min = models.IntegerField(null=True, blank=True)
    range_max = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        expected_value = self.expected_value or self.expected_integer_value
        return f"{str(self.flag_color)}-{expected_value}"

    def save(self, *arg, **kwargs) -> None:
        self.name = str(self)
        if not isnumber(str(self.expected_integer_value)):
            self.expected_integer_value = None
        if not isnumber(str(self.min_age)):
            self.min_age = None
        if not isnumber(str(self.max_age)):
            self.max_age = None
        if not isnumber(str(self.range_min)):
            self.range_min = None
        if not isnumber(str(self.range_max)):
            self.range_max = None
        return super().save(*arg, **kwargs)

    def _handle_range_sum_operator(self, adolescent, study_phase: StudyPhase):
        if not (self.range_min != None and self.range_max != None
                and self.question1 and self.question2):
            return True
        responses = AdolescentResponse.objects.filter(
            question__number__gte=self.question1.number,
            question__number__lte=self.question2.number,
            study_phase=str(study_phase),
            adolescent=adolescent)
        all_values = [
            value for response in responses
            for value in response.get_values_as_list(numeric=True)
        ]
        total = sum(all_values)
        matched = self.range_min <= total <= self.range_max
        return matched if not self.invert_operator_evaluation else not matched

    def _process_diff_value(self, response1, response2) -> int | None:
        diff = None
        if response2 and response1:
            values1_as_list = response1.get_values_as_list(numeric=True)
            values2_as_list = response2.get_values_as_list(numeric=True)
            if values1_as_list and values2_as_list:
                value_1 = values1_as_list[0]
                value_2 = values2_as_list[0]
                diff = value_1 - value_2
        return diff

    def check_condition(self, adolescent: Adolescent, study_phase: StudyPhase):
        response1 = AdolescentResponse.objects.filter(
            study_phase=str(study_phase),
            question=self.question1,
            adolescent=adolescent,
        ).first()
        response2 = AdolescentResponse.objects.filter(
            study_phase=str(study_phase),
            question=self.question2,
            adolescent=adolescent).first() if self.question2 else None

        if self.adolescent_type and self.adolescent_type != adolescent.type:
            return False

        if self.gender and adolescent.gender and self.gender.lower(
        ) != adolescent.gender.lower():
            return False

        matched = None
        match self.operator:
            case "group_value_between":
                question_group = self.question_group
                group_value = question_group.get_group_value(
                    adolescent, study_phase) if question_group else sys.maxsize
                matched = bool(self.range_min) and bool(
                    self.range_max) and bool(
                        group_value
                    ) and self.range_min <= group_value <= self.range_max
            case "invoke_bmi_sd_function":
                adolescent_bmi_sd = compute_bmi_sd_function(
                    adolescent, study_phase)
                if not (self.range_min and self.range_max):
                    return True
                matched = self.range_min <= adolescent_bmi_sd <= self.range_max
            case "equal_expected_value":
                # Use "0" as default value for no-response.
                response_values = list(map(str, response1.get_values_as_list())
                                       ) if bool(response1) else ["0"]
                matched = bool(
                    self.expected_value) and self.expected_value.strip().lower(
                    ) in response_values
            case "less_than_expected_integer_value":
                # Use 0 as default value for no-response
                response_values = response1.get_values_as_list(
                    numeric=True) if bool(response1) else [0]
                matched = self.expected_integer_value != None and all([
                    float(self.expected_integer_value) > round(float(res), 2)
                    for res in response_values
                ])
            case "min_age":
                matched = self.expected_integer_value != None and self.expected_integer_value <= adolescent.get_age(
                )
            case "gender_is":
                matched = bool(
                    self.expected_value) and self.expected_value.strip(
                    ) == adolescent.gender
            case "range_sum_between":
                matched = self._handle_range_sum_operator(
                    adolescent, study_phase)
            case "q1_q2_difference_is_equal_to_expected_integer_value":
                diff = self._process_diff_value(response1, response2)
                matched = diff == self.expected_integer_value
            case "q1_q2_difference_is_less_than_expected_integer_value":
                diff = self._process_diff_value(response1, response2)
                matched = diff != None and self.expected_integer_value != None and diff < self.expected_integer_value
            case "compute_right_grip_test":
                test_result = round(
                    compute_grip_test(adolescent,
                                      study_phase,
                                      for_right_arm=True), 2)
                matched = self.expected_integer_value == test_result
            case "compute_left_grip_test":
                test_result = round(
                    compute_grip_test(adolescent,
                                      study_phase,
                                      for_right_arm=False), 2)
                matched = self.expected_integer_value == test_result
            case "compute_anaemia_status":
                anaemia_status = compute_anaemia_status(
                    adolescent, study_phase)
                matched = bool(
                    self.expected_value
                ) and anaemia_status and self.expected_value.lower().strip(
                ) == str(anaemia_status.value).lower()

                # Add anaemia context
                summary_flag = SummaryFlag.objects.filter(
                    study_phase=str(study_phase),
                    adolescent=adolescent,
                    label__name="ANAEMIA").first()
                if summary_flag:
                    summary_flag.context = f"Status: {anaemia_status.value}"
                    summary_flag.save()

            case "time_difference_between":
                hours_spent = compute_time_difference(adolescent,
                                                      self.question1,
                                                      self.question2,
                                                      study_phase)
                matched = self.range_min <= hours_spent <= self.range_max
            case "compute_vision_status":
                vision_status = compute_vision_status(adolescent,
                                                      self.question1,
                                                      study_phase)
                matched = bool(
                    self.expected_value
                ) and vision_status and self.expected_value.lower().strip(
                ) == vision_status.lower()
        if matched != None:
            return matched if not self.invert_operator_evaluation else not matched
        return matched
