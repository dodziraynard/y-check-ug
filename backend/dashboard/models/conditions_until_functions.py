from bisect import bisect_left
import sys
from .adolescent import Adolescent
from .questions import Question


def compute_bmi_sd_function(adolescent: Adolescent) -> int:
    ages_in_months_array = [10*12 + 6, 11*12 + 6, 12*12 + 6, 13 *
                            12 + 6, 14*12 + 6, 15*12 + 6, 16*12 + 6, 17*12 + 6, 18*12 + 6]
    female_bmi_matrix = [
        [12.5, 13.7, 19.4, 23.1],
        [12.9, 14.1, 20.3, 24.3],
        [13.4, 14.7, 21.3, 25.6],
        [13.8, 15.2, 22.3, 26.8],
        [14.2, 15.7, 23.1, 27.8],
        [14.5, 16.0, 23.8, 28.6],
        [14.7, 16.3, 24.3, 29.1],
        [14.7, 16.4, 24.6, 29.4],
        [14.7, 16.5, 24.9, 29.6]
    ]

    male_bmi_matrix = [
        [12.9, 13.9, 18.8, 21.9],
        [13.2, 14.2, 19.5, 23.0],
        [13.6, 14.7, 20.4, 24.2],
        [14.0, 15.2, 21.3, 25.3],
        [14.5, 15.7, 22.2, 26.5],
        [14.9, 16.3, 23.1, 27.4],
        [15.3, 16.7, 23.9, 28.3],
        [15.6, 17.1, 24.6, 29.0],
        [15.8, 17.4, 25.2, 29.5]
    ]

    # Get BMI height and weight questions.
    height_question = Question.objects.filter(
        util_function_tag="bmi_height").first()
    weight_question = Question.objects.filter(
        util_function_tag="bmi_weight").first()
    bmi = None
    if height_question and weight_question:
        height_value = height_question.get_response(adolescent, numeric=True)
        weight_value = weight_question.get_response(adolescent, numeric=True)
        if height_value and weight_value:
            height = height_value[0]  # Height is recorded in cm.
            weight = weight_value[0]  # Weight is recorded in kg.
            bmi = weight / (height/100)**2

    if not bmi:
        return sys.maxsize

    adolescent_age = adolescent.registration_age_in_months()
    index = bisect_left(ages_in_months_array, adolescent_age)
    sds = female_bmi_matrix[index] if adolescent.gender == "female" else male_bmi_matrix[index]
    sd_index = [-3, -2, 1, 2][bisect_left(sds, bmi)]
    return sd_index
