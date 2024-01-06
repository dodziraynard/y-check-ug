package com.hrd.ycheck.models

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.utils.Constants
import kotlinx.parcelize.Parcelize


@Entity(tableName = Constants.ADOLESCENT_TABLE)
@Parcelize
data class Adolescent(
    var surname: String,
    @SerializedName("other_names") var otherNames: String,
    @SerializedName("study_phase") var studyPhase: String,
    var dob: Long,
    @SerializedName("check_up_location") var checkupLocation: String,
    @SerializedName("check_up_reason") var checkupReason: String?,
    @SerializedName("school") var school: String? = null,
    @SerializedName("consent") var consent: String? = null,
    @SerializedName("grade") var grade: String? = null,
    @SerializedName("leaves_in_catchment") var livesInCatchment: String? = null,
    @SerializedName("residential_status") var residentialStatus: String? = null,
    var type: String,
    var gender: String,
    @SerializedName("photo_url") val photoUrl: String? = "",
    var createdByUserUuid: Long? = null,
    @PrimaryKey val id: String = "0",

    val uuid: String? = "",
    var pid: String = "",
) : Parcelable