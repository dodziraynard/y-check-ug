package com.hrd.ycheck.models

import com.google.gson.annotations.SerializedName

data class SubmittedAdolescentResponse(
    val id: Int,
    @SerializedName("text") var text: String = "",
    @SerializedName("chosen_options") val chosenOptions: List<Option>?,
)
