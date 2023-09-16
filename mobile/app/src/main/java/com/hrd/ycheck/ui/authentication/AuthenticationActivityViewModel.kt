package com.hrd.ycheck.ui.authentication

import android.app.Application
import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.hrd.ycheck.AppRoomDatabase
import com.hrd.ycheck.DataRepository
import com.hrd.ycheck.R
import com.hrd.ycheck.models.Configuration
import com.hrd.ycheck.models.User
import com.hrd.ycheck.network.RestApiFactory
import com.hrd.ycheck.network.response_models.AuthenticationResponse
import com.hrd.ycheck.utils.Constants.IS_NEW_USER
import com.hrd.ycheck.utils.Constants.SHARED_PREFS_FILE
import com.hrd.ycheck.utils.Constants.USER_TOKEN
import com.hrd.ycheck.utils.Functions.Companion.removeUserToken
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AuthenticationActivityViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: DataRepository = DataRepository(application)
    val isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    val profileUpdate: MutableLiveData<Boolean> = MutableLiveData(false)
    private val apiService = RestApiFactory.create(application);
    val isLoggedIn = MutableLiveData<Boolean>()
    private val context: Application = application
    val errorMessage = MutableLiveData<String>()

    val user: LiveData<User?>?
        get() = repository.user

    val configuration: LiveData<Configuration?>?
        get() = repository.configuration

    fun login(username: String, password: String) {
        isLoading.value = true
        apiService?.login(username, password)?.enqueue(object : Callback<AuthenticationResponse?> {
            override fun onResponse(
                call: Call<AuthenticationResponse?>, response: Response<AuthenticationResponse?>
            ) {
                val prefsEditor: SharedPreferences.Editor =
                    context.getSharedPreferences(SHARED_PREFS_FILE, MODE_PRIVATE).edit()

                if (response.body() != null) {
                    if (response.body()!!.errorMessage != null) {
                        errorMessage.value = response.body()!!.errorMessage
                    }
                    if (response.body()!!.token != null) {
                        prefsEditor.putBoolean(IS_NEW_USER, false)
                        prefsEditor.putString(USER_TOKEN, response.body()!!.token)
                        prefsEditor.apply()
                    }
                    if (response.body()!!.user != null) {
                        isLoggedIn.value = true

                        // Store user in the database
                        if (response.body()?.user != null) {
                            AppRoomDatabase.databaseWriteExecutor.execute {
                                AppRoomDatabase.getDatabase(context)?.UserDao()?.deleteAll()
                                AppRoomDatabase.getDatabase(context)?.UserDao()
                                    ?.insertUser(response.body()!!.user!!)
                            }
                        }
                    }
                } else {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        removeUserToken(context)
                    }
                }
                isLoading.value = false
            }

            override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
            }
        })
    }

    fun register(
        username: String, password: String
    ) {
        isLoading.value = true
        apiService?.register(username, password)
            ?.enqueue(object : Callback<AuthenticationResponse?> {
                override fun onResponse(
                    call: Call<AuthenticationResponse?>, response: Response<AuthenticationResponse?>
                ) {
                    val prefsEditor: SharedPreferences.Editor =
                        context.getSharedPreferences(SHARED_PREFS_FILE, MODE_PRIVATE).edit()

                    if (response.body() != null) {
                        if (response.body()!!.errorMessage != null) {
                            errorMessage.value = response.body()!!.errorMessage
                        }
                        if (response.body()!!.token != null) {
                            prefsEditor.putBoolean(IS_NEW_USER, false)
                            prefsEditor.putString(USER_TOKEN, response.body()!!.token)
                            prefsEditor.apply()
                        }
                        if (response.body()!!.user != null) {
                            isLoggedIn.value = true

                            // Store user in the database
                            if (response.body()?.user != null) {
                                AppRoomDatabase.databaseWriteExecutor.execute {
                                    AppRoomDatabase.getDatabase(context)?.UserDao()?.deleteAll()
                                    AppRoomDatabase.getDatabase(context)?.UserDao()
                                        ?.insertUser(response.body()!!.user!!)
                                }
                            }
                        }
                    } else {
                        errorMessage.value = response.code().toString() + ": " + response.message()
                        if (response.code() == 401) {
                            removeUserToken(context)
                        }
                    }
                    isLoading.value = false
                }

                override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {
                    errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                    isLoading.value = false
                }
            })
    }

    fun updateProfile(
        userDataBody: MultipartBody.Part,
    ) {
        isLoading.value = true
        apiService?.updateProfile(
            userDataBody
        )?.enqueue(object : Callback<AuthenticationResponse?> {
            override fun onResponse(
                call: Call<AuthenticationResponse?>, response: Response<AuthenticationResponse?>
            ) {
                // Store user in the database
                if (response.body()?.user != null) {
                    AppRoomDatabase.databaseWriteExecutor.execute {
                        AppRoomDatabase.getDatabase(context)?.UserDao()
                            ?.insertUser(response.body()!!.user!!)
                    }
                    profileUpdate.value = true
                } else {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        removeUserToken(context)
                    }
                }
                isLoading.value = false
            }

            override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
                profileUpdate.value = false
            }
        })
    }

    fun changePassword(oldPassword: String, newPassword: String) {
        isLoading.value = true
        apiService?.changePassword(oldPassword, newPassword)
            ?.enqueue(object : Callback<AuthenticationResponse?> {
                override fun onResponse(
                    call: Call<AuthenticationResponse?>, response: Response<AuthenticationResponse?>
                ) {
                    val prefsEditor: SharedPreferences.Editor =
                        context.getSharedPreferences(SHARED_PREFS_FILE, MODE_PRIVATE).edit()

                    if (response.body() != null) {
                        if (response.body()!!.errorMessage != null) {
                            errorMessage.value = response.body()!!.errorMessage
                        }
                        if (response.body()!!.token != null) {
                            prefsEditor.putString(USER_TOKEN, response.body()!!.token)
                            prefsEditor.apply()
                        }
                        if (response.body()!!.user != null) {
                            isLoggedIn.value = true
                            // Store user in the database
                            if (response.body()?.user != null) {
                                AppRoomDatabase.databaseWriteExecutor.execute {
                                    AppRoomDatabase.getDatabase(context)?.UserDao()?.deleteAll()
                                    AppRoomDatabase.getDatabase(context)?.UserDao()
                                        ?.insertUser(response.body()!!.user!!)
                                }
                            }
                        }
                    } else {
                        errorMessage.value = response.code().toString() + ": " + response.message()
                        if (response.code() == 401) {
                            removeUserToken(context)
                        }
                    }
                    isLoading.value = false
                }

                override fun onFailure(call: Call<AuthenticationResponse?>, t: Throwable) {
                    errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                    isLoading.value = false
                }
            })
    }
}