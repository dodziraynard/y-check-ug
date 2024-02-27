package com.hrd.ycheck.network.response_models

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.Section
import com.hrd.ycheck.models.SubmittedAdolescentResponse
import kotlinx.parcelize.Parcelize

@Parcelize
class GetSurveyQuestionResponse : Parcelable {
    @SerializedName("question")
    val question: Question? = null

    @SerializedName("current_response")
    val currentResponse: SubmittedAdolescentResponse? = null

    @SerializedName("new_section")
    val newSection: Section? = null

    @SerializedName("error_message")
    val errorMessage: String? = null

    @SerializedName("current_section_number")
    val currentSectionNumber: Int = 0

    @SerializedName("total_sessions")
    val totalSessions: Int = 10
}

@Parcelize
class GetMultipleQuestionsResponse : Parcelable {
    @SerializedName("questions")
    val questions: List<Question>? = null

    @SerializedName("current_responses")
    val currentResponses: List<SubmittedAdolescentResponse>? = null

    @SerializedName("new_section")
    val newSection: Section? = null

    @SerializedName("error_message")
    val errorMessage: String? = null

    @SerializedName("current_section_number")
    val currentSectionNumber: Int = 0

    @SerializedName("total_sessions")
    val totalSessions: Int = 10
}
