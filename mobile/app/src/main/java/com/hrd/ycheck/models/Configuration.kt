package com.hrd.ycheck.models

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.hrd.ycheck.utils.Constants


@Entity(tableName = Constants.CONFIGURATIONS_TABLE)
data class Configuration(
    @PrimaryKey val id: Long,
    var host: String = "",
)
