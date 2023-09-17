package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.Section
import com.hrd.ycheck.models.SubmittedAdolescentResponse


class GetSurveyQuestionResponse {
    @SerializedName("question")
    val question: Question? = null

    @SerializedName("current_response")
    val currentResponse: SubmittedAdolescentResponse? = null

    @SerializedName("new_section")
    val newSection: Section? = null

    @SerializedName("error_message")
    val errorMessage: String? = null

    @SerializedName("current_session_number")
    val currentSessionNumber: Int = 0

    @SerializedName("total_sessions")
    val totalSessions: Int = 10
}
