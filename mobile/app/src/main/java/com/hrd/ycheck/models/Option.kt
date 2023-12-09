package com.hrd.ycheck.models

import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName


data class Option(
    @PrimaryKey val id: String = "0",
    val value: String,
    @SerializedName("numeric_value") val numericValue: String,
    @SerializedName("audio_url") val audioUrl: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null
)
