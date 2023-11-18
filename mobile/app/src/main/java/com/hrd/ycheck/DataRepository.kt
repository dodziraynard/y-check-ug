package com.hrd.ycheck

import android.app.Application
import androidx.lifecycle.LiveData
import com.hrd.ycheck.dao.ConfigurationDao
import com.hrd.ycheck.dao.UserDao
import com.hrd.ycheck.models.Configuration
import com.hrd.ycheck.models.User

class DataRepository(application: Application) {
    private var application: Application
    private var db: AppRoomDatabase?
    val user: LiveData<User?>?
    val configuration: LiveData<Configuration?>?

    private val userDao: UserDao?
    val configurationDao: ConfigurationDao?

    init {
        db = AppRoomDatabase.getDatabase(application)
        this.application = application
        userDao = db?.UserDao()
        configurationDao = db?.ConfigurationDao()

        user = userDao?.getUserAsync()
        configuration = configurationDao?.getConfigurationAsync()
    }
}