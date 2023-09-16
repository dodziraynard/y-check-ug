package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.CheckupLocation


class CheckupLocationResponse {
    @SerializedName("checkup_locations")
    val checkupLocations: List<CheckupLocation>? = null

    @SerializedName("error_message")
    val errorMessage: String? = null
}
