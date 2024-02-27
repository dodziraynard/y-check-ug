package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName

class PostSurveyResponseResponse {
    @SerializedName("error_message")
    val errorMessage: String? = null

    @SerializedName("message")
    val message: String? = null

    @SerializedName("success")
    val success: Boolean? = null

    @SerializedName("last_answered_question_id")
    val lastAnsweredQuestionID: String? = null

}
