package com.hrd.ycheck.models

import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

data class SubmittedAdolescentResponse(
    @PrimaryKey val id: String = "0",
    @SerializedName("text") var text: String = "",
    @SerializedName("chosen_options") val chosenOptions: List<Option>?,
)
