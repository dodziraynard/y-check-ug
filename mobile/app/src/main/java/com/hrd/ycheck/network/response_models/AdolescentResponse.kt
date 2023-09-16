package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Adolescent


class AdolescentResponse {
    @SerializedName("adolescent")
    val adolescent: Adolescent? = null

    @SerializedName("error_message")
    val errorMessage: String? = null

    @SerializedName("message")
    val message: String? = null
}
