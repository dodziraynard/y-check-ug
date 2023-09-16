package com.hrd.ycheck.models

import androidx.room.PrimaryKey


data class CheckupLocation(
    @PrimaryKey val id: Long,
    var uuid: String = "",
    var name: String = "",
    var type: String = "",
)
