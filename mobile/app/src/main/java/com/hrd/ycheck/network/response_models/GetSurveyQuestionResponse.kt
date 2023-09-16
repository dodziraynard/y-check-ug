package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.SubmittedAdolescentResponse


class GetSurveyQuestionResponse {
    @SerializedName("question")
    val question: Question? = null

    @SerializedName("current_response")
    val currentResponse: SubmittedAdolescentResponse? = null

    @SerializedName("new_section")
    val newSection: List<Adolescent>? = null

    @SerializedName("error_message")
    val errorMessage: String? = null

}
