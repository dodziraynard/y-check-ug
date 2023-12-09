package com.hrd.ycheck.models

import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName


data class Section(
    @PrimaryKey val id: String = "0",
    @SerializedName("name") val name: String,
    @SerializedName("number") val number: Long,
    @SerializedName("instruction") val instruction: String,
    @SerializedName("requires_game") val requiresGame: Boolean
)