package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Configuration


class MobileConfigResponse {
    @SerializedName("config")
    val config: Configuration? = null
}
