import sys
from bisect import bisect_left
from collections import namedtuple
from .adolescent import Adolescent
from .questions import Question, QuestionGroup


def compute_grip_test(adolescent: Adolescent, for_right_arm=False) -> int:
    """Determine the status of the adolescent grip test.
        Returns:
        - 0: No valid computation available.
        - (-1): Below the recommended value.
        - (+1): Above the recommended value.
    """
    GripTestValue = namedtuple("GripTestValue", "left_arm, right_arm")
    males_age_min_value = {
        10: GripTestValue(9.1, 10.8),
        11: GripTestValue(11.2, 12.9),
        12: GripTestValue(14.1, 15.8),
        13: GripTestValue(17.9, 19.1),
        14: GripTestValue(22.1, 22.7),
        15: GripTestValue(26.1, 26.0),
        16: GripTestValue(29.2, 28.7),
        17: GripTestValue(31.2, 30.7),
        18: GripTestValue(34.1, 34.1),
        19: GripTestValue(35.7, 35.7),
    }
    females_age_min_value = {
        10: GripTestValue(9.4, 10.4),
        11: GripTestValue(11.2, 12.5),
        12: GripTestValue(13.0, 14.6),
        13: GripTestValue(14.6, 16.5),
        14: GripTestValue(15.8, 18.0),
        15: GripTestValue(16.7, 18.9),
        16: GripTestValue(17.3, 19.3),
        17: GripTestValue(17.8, 19.3),
        18: GripTestValue(18.2, 19.3),
        19: GripTestValue(19.2, 19.3),
    }

    util_function_tag = "right_grip_test" if for_right_arm else "left_grip_test"
    group = QuestionGroup.objects.filter(
        util_function_tag=util_function_tag).first()
    if not (group and adolescent and adolescent.gender):
        return 0
    grip_test_result = group.get_group_value(adolescent)
    if not grip_test_result:
        return 0

    age = adolescent.get_age()
    recommended_value = None
    match adolescent.gender.lower():
        case "male":
            recommended_value = males_age_min_value.get(age)
        case "female":
            recommended_value = females_age_min_value.get(age)
    if recommended_value and recommended_value[for_right_arm] > grip_test_result:
        return 1
    return -1


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
    sd_index = [-3, -2, 1, 2, 3][bisect_left(sds, bmi)]
    return sd_index
