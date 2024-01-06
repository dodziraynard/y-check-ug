from django.db import models
from .questions import AdolescentResponse
from ycheck.utils.constants import COLOR_CHOICES
from .mixin import UpstreamSyncBaseModel
from .flags import SummaryFlag


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
            label=self.dependent_on_flag, adolescent=adolescent).first()

        if (summary
            and self.dependent_on_flag
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
