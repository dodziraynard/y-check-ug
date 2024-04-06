package com.hrd.ycheck.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.utils.Constants


@Entity(tableName = Constants.CONFIGURATIONS_TABLE)
data class Configuration(
    @PrimaryKey val id: Long,
    var host: String = "",
    @SerializedName("show_create_account") var showCreateAccount: Boolean? = false,
    @SerializedName("apk_version")  var apkVersion: String? = null,
    @SerializedName("apk_url")  var apkUrl: String? = null
)
