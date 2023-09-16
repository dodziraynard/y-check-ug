package com.hrd.ycheck.models

import com.google.gson.annotations.SerializedName

data class NewAdolescentResponse(
    @SerializedName("question_i") val questionId: Int,
    @SerializedName("adolescent_id") val adolescentId: Int,
    @SerializedName("value") var value: String = "",
    @SerializedName("chosen_options") val chosenOptions: MutableList<Option> = mutableListOf(),
)