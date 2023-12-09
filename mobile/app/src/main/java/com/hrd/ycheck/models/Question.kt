package com.hrd.ycheck.models

import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName


data class Question(
    @PrimaryKey val id: String = "0",
    @SerializedName("question_id") val questionID: String? = null,
    val number: Int,
    val caption: String,
    val text: String,
    @SerializedName("input_type") val inputType: String,
    @SerializedName("answer_preamble") val answerPreamble: String? = "",
    @SerializedName("adolescent_type") val adolescentType: String? = "",
    @SerializedName("min_numeric_value") val minNumericValue: Int? = 0,
    @SerializedName("max_numeric_value") val maxNumericValue: Int? = 10,
    val options: List<Option>? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    @SerializedName("audio_url") val audioUrl: String? = null,
    @SerializedName("has_image_options") val hasImageOptions: Boolean? = false,
    @SerializedName("apk_id") val apkId: String? = null,
    @SerializedName("to_be_confirmed") val toBeConfirmed: Boolean? = false
)

object InputType {
    const val TEXT_INPUT = "text_input"
    const val NUMBER_FIELD = "number_field"
    const val CHECKBOXES = "checkboxes"
    const val RADIO_BUTTON = "radio_button"
    const val RANGE_SLIDER = "range_slider"
}
