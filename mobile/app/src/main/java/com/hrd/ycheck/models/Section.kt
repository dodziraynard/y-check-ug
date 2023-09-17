package com.hrd.ycheck.models

import com.google.gson.annotations.SerializedName


data class Section(
    val id: Long,
    @SerializedName("name") val name: String,
    @SerializedName("number") val number: String,
    @SerializedName("instruction") val instruction: String,
    @SerializedName("requires_game") val requiresGame: Boolean
)