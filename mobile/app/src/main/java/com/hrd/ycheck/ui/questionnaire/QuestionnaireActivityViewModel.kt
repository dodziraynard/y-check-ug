package com.hrd.ycheck.ui.questionnaire

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.hrd.ycheck.DataRepository
import com.hrd.ycheck.models.User
import com.hrd.ycheck.network.RestApiFactory

class QuestionnaireActivityViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: DataRepository = DataRepository(application)
    val isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    private val apiService = RestApiFactory.create(application);
    val isLoggedIn = MutableLiveData<Boolean>()
    private val context: Application = application
    val errorMessage = MutableLiveData<String>()

    val user: LiveData<User?>?
        get() = repository.user
}