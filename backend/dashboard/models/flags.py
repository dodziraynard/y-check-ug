from django.db import models
from accounts.models import User
from ycheck.utils.constants import Colors
from .adolescent import *
from .questions import *

color_code_choices = [
    (Colors.RED.value, "RED"),
    (Colors.ORANGE.value, "ORANGE"),
    (Colors.GREEN.value, "GREEN"),
]


class SummaryFlag(models.Model):
    adolescent = models.ForeignKey(
        Adolescent, on_delete=models.CASCADE, db_index=True)
    label = models.ForeignKey(
        "dashboard.FlagLabel", null=True, on_delete=models.CASCADE, db_index=True)
    comment = models.CharField(
        max_length=200, default="This value was inffered.")
    computed_color_code = models.CharField(
        choices=color_code_choices, max_length=10)
    updated_color_code = models.CharField(
        choices=color_code_choices, max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['adolescent', 'label'], name='Adolescent flag')
        ]

    def __str__(self) -> str:
        name = f"{self.adolescent.get_name()}: {self.label.name}-{self.computed_color_code}"
        if self.updated_color_code:
            name += f"->{self.updated_color_code}"
        return name


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
    color_name_choices = [
        ("RED", "RED"),
        ("ORANGE", "ORANGE"),
        ("GREEN", "GREEN"),
    ]
    flag_label = models.ForeignKey(
        FlagLabel, related_name="colors", on_delete=models.CASCADE, db_index=True)
    color_name = models.CharField(
        max_length=20, choices=color_name_choices, null=True, blank=True)
    color_code = models.CharField(max_length=10, choices=color_code_choices)
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
