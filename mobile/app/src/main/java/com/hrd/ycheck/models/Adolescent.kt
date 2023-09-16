package com.hrd.ycheck.models

import android.os.Parcelable
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName
import com.hrd.ycheck.utils.Constants
import kotlinx.parcelize.Parcelize
import java.io.Serializable


@Entity(tableName = Constants.ADOLESCENT_TABLE)
@Parcelize
data class Adolescent(
    var surname: String,
    @SerializedName("other_names") var otherNames: String,
    @SerializedName("visit_type") var visitType: String,
    var dob: Long,
    @SerializedName("check_up_location") var checkupLocation: String,
    var type: String,
    var gender: String,
    @SerializedName("photo_url") val photoUrl: String? = "",
    var createdByUserUuid: Long? = null,
    @PrimaryKey val id: Long = 0,

    val uuid: String? = "",
    val pid: String? = "",
) : Parcelable