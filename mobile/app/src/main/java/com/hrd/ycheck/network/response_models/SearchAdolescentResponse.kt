package com.hrd.ycheck.network.response_models

import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.models.Adolescent


class SearchAdolescentResponse {
    @SerializedName("adolescents")
    val adolescents: List<Adolescent>? = null
}
