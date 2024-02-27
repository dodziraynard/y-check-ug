package com.hrd.ycheck.models

import com.google.gson.annotations.SerializedName

data class NewAdolescentResponse(
    @SerializedName("question_id") val questionId: String,
    @SerializedName("adolescent_id") val adolescentId: String,
    @SerializedName("value") var value: String = "",
    @SerializedName("chosen_options") var chosenOptions: List<Option> = listOf(),
)