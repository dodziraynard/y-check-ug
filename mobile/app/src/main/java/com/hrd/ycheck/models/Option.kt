package com.hrd.ycheck.models

import com.google.gson.annotations.SerializedName


data class Option(
    val id: Long,
    val value: String,
    @SerializedName("numeric_value") val numericValue: String,
    @SerializedName("audio_url") val audioUrl: String? = null
)
