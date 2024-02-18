package com.hrd.ycheck.ui.common

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.hrd.ycheck.R
import com.hrd.ycheck.network.RestApiFactory
import com.hrd.ycheck.network.response_models.PostAdolescentActivityTimeResponse
import com.hrd.ycheck.utils.Functions
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class TimeInputFragmentViewModel(application: Application) : AndroidViewModel(application) {
    val isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    val isSuccess: MutableLiveData<Boolean> = MutableLiveData(false)
    private val apiService = RestApiFactory.create(application);
    private val context: Application = application
    val errorMessage = MutableLiveData<String>()


    fun postAdolescentActivityTime(
        adolescentId: String,
        activityTag: String,
        timestamp: Long,
    ) {
        isLoading.value = true
        apiService?.postAdolescentActivityTime(
            adolescentId,
            activityTag,
            timestamp
        )?.enqueue(object : Callback<PostAdolescentActivityTimeResponse?> {
            override fun onResponse(
                call: Call<PostAdolescentActivityTimeResponse?>,
                response: Response<PostAdolescentActivityTimeResponse?>
            ) {

                if (response.body() != null) {
                    if (response.body()!!.errorMessage != null) {
                        errorMessage.value = response.body()!!.errorMessage
                    } else {
                        isSuccess.value = true
                    }
                } else {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                }

                isLoading.value = false
            }

            override fun onFailure(call: Call<PostAdolescentActivityTimeResponse?>, t: Throwable) {
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
            }
        })
    }
}