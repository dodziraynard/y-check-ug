package com.hrd.ycheck.utils


object Constants {
    const val USER_TABLE = "users"
    const val CONFIGURATIONS_TABLE = "configurations"
    const val ADOLESCENT_TABLE = "adolescents"
    const val USER_TOKEN = "com.hrd.ycheck.USER_TOKEN"
    const val SHARED_PREFS_FILE = "ycheck-pf"
    const val USER_ID = "com.hrd.ycheck.USER_ID"
    const val IS_NEW_USER = "com.hrd.ycheck.IS_NEW_USER"
    const val USER_OBJECT = "com.hrd.ycheck.USER_OBJECT"
}

object AdolescentTypes {
    const val BASIC = "basic"
    const val SECONDARY = "secondary"
    const val COMMUNITY = "community"
}

object QuestionnaireType {
    const val SURVEY_PRACTICE = "practice"
    const val SURVEY = "survey"
    const val ASSESSMENT = "assessment"
    const val SURVEY_FEEDBACK = "survey_feedback"
}

object Genders {
    const val MALE = "male"
    const val FEMALE = "female"
}

object VisitTypes {
    const val PILOT_TESTING = "pilot"
    const val INITIAL = "initial"
    const val FOLLOW_UP = "follow-up"
}

object ResidentialStatus {
    const val DAY = "day"
    const val BOARDING = "boarding"
}

object Grade {
    const val YEAR_ONE = "1"
    const val YEAR_TWO = "2"
}

object LivesInCatchment {
    const val YES = "yes"
    const val NO = "no"
    const val NA = "n/a"
}

object IAFConsents {
    const val PARENT = "Yes parent consent"
    const val ADOLESCENT = "Yes adolescent consent"
    const val ADOLESCENT_PARENT = "Yes adolescent and parent consent"
    const val NO = "No"
}