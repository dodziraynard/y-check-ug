package com.hrd.ycheck.utils


object Constants {
    const val USER_TABLE = "users"
    const val CONFIGURATIONS_TABLE = "configurations"
    const val ADOLESCENT_TABLE = "adolescents"
    const val USER_TOKEN = "com.hrd.ycheck.USER_TOKEN"
    const val HOST_URL = "com.hrd.ycheck.HOST_URL"
    const val SHARED_PREFS_FILE = "ycheck-pf"
    const val USER_ID = "com.hrd.ycheck.USER_ID"
    const val IS_NEW_USER = "com.hrd.ycheck.IS_NEW_USER"
    const val UPDATE_IGNORED_VERSION = "com.hrd.ycheck.UPDATE_IGNORED_VERSION"
}

object AdolescentTypes {
    const val BASIC = "basic"
    const val SECONDARY = "secondary"
    const val COMMUNITY = "community"
}

object QuestionnaireType {
    const val PRE_SCREENING = "pre_screening"
    const val SURVEY_PRACTICE = "practice"
    const val SURVEY = "survey"
    const val SURVEY_FEEDBACK = "survey_feedback"
    const val PHYSICAL_ASSESSMENT = "physical_assessment"
    const val LAB_ASSESSMENT = "lab_assessment"
    const val CLINICAL_ASSESSMENT = "clinical_assessment"
    const val COUNSELLOR_ASSESSMENT = "counsellor_assessment"
    const val EVALUATION = "evaluation"
    const val EXIT_INTERVIEW = "exit_interview"
}

object Genders {
    const val MALE = "male"
    const val FEMALE = "female"
}

object StudyPhase {
    const val PILOT = "pilot"
    const val IMPLEMENTATION = "initial"
}

object ResidentialStatus {
    const val DAY = "day"
    const val BOARDING = "boarding"
}

object Grade {
    const val YEAR_ONE = "YEAR 1"
    const val YEAR_TWO = "YEAR 2"
}

object CheckUpReason {
    const val Y_CHECK_SERVICES_AND_RESEARCH = "Y-Check Services & Research"
    const val Y_CHECK_SERVICES_ONLY = "Y-Check Services Only"
}

object LivesInCatchment {
    const val YES = "yes"
    const val NO = "no"
    const val NA = "n/a"
}

object IAFConsents {
    const val PARENT = "Yes parent consent"
    const val ADOLESCENT = "Yes adolescent consent/assent"
    const val ADOLESCENT_PARENT = "Yes adolescent and parent consent"
    const val NO = "No"
}

object ModelFieldType {
    const val RADIO_BUTTON = "radio"
    const val TEXT_INPUT = "text_field"
    const val NUMBER_FIELD = "number_field"
    const val DATE = "date"
}

object ActivityTags {
    const val ADOLESCENT_SURVEY_START = "adolescent_survey_start"
    const val ADOLESCENT_REGISTRATION_START = "adolescent_registration_start"
    const val ADOLESCENT_PHYSICAL_ASSESSMENT_START = "adolescent_physical_assessment_start"
    const val ADOLESCENT_LAB_ASSESSMENT_START = "adolescent_lab_assessment_start"
    const val ADOLESCENT_CLINICAL_ASSESSMENT_START = "adolescent_clinical_assessment_start"
}