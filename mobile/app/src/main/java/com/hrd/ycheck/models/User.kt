package com.hrd.ycheck.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.utils.Constants
import com.hrd.ycheck.utils.StringListConvector

@Entity(tableName = Constants.USER_TABLE)
data class User(
    @PrimaryKey val id: Long,
    val photo_url: String?,
    val uuid: String?,
    var username: String?,
    var phone: String?,

    @SerializedName("security_answer_1") var securityAnswer1: String?,
    @SerializedName("security_answer_2") var securityAnswer2: String?,

    @SerializedName("surname") var surname: String?,
    @SerializedName("other_names") var otherNames: String?,
    @SerializedName("changed_password") var changedPassword: Boolean = false,
    @TypeConverters(StringListConvector::class) @SerializedName("user_permissions") val permissions: List<String>?
)