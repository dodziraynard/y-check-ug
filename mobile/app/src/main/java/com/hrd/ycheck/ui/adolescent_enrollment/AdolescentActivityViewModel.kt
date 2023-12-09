package com.hrd.ycheck.ui.adolescent_enrollment

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import com.hrd.ycheck.R
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.models.CheckupLocation
import com.hrd.ycheck.network.RestApiFactory
import com.hrd.ycheck.network.response_models.AdolescentResponse
import com.hrd.ycheck.network.response_models.CheckupLocationResponse
import com.hrd.ycheck.network.response_models.SchoolResponse
import com.hrd.ycheck.network.response_models.SearchAdolescentResponse
import com.hrd.ycheck.utils.Functions
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File

class AdolescentActivityViewModel(application: Application) : AndroidViewModel(application) {
    val isLoadingLocations: MutableLiveData<Boolean> = MutableLiveData(false)
    val isLoadingAdolescent: MutableLiveData<Boolean> = MutableLiveData(false)
    val isSearchingAdolescent: MutableLiveData<Boolean> = MutableLiveData(false)
    val isLoadingSchools: MutableLiveData<Boolean> = MutableLiveData(false)
    val isUploadingPhoto: MutableLiveData<Boolean> = MutableLiveData(false)

    val postErrorMessage = MutableLiveData<String>()
    val searchErrorMessage = MutableLiveData<String>()
    val locationLoadingErrorMessage = MutableLiveData<String>()
    val photoUploadErrorMessage = MutableLiveData<String>()
    val schoolsErrorMessage = MutableLiveData<String>()

    private val apiService = RestApiFactory.create(application);
    private val context: Application = application

    val checkupLocations = MutableLiveData<List<CheckupLocation>>()

    val updatedAdolescent = MutableLiveData<Adolescent>()
    val adolescents = MutableLiveData<List<Adolescent>>()
    val schools = MutableLiveData<List<String>>()

    val isFormValid: MutableLiveData<Boolean> = MutableLiveData(false)

    fun getCheckupLocations(filters: String) {
        isLoadingLocations.value = true
        checkupLocations.value = listOf()
        apiService?.getCheckupLocations(filters)
            ?.enqueue(object : Callback<CheckupLocationResponse?> {
                override fun onResponse(
                    call: Call<CheckupLocationResponse?>,
                    response: Response<CheckupLocationResponse?>
                ) {
                    if (response.body()?.checkupLocations != null) {
                        checkupLocations.value = response.body()?.checkupLocations
                    } else {
                        locationLoadingErrorMessage.value =
                            response.code().toString() + ": " + response.message()
                        if (response.code() == 401) {
                            Functions.removeUserToken(context)
                        }
                    }
                    isLoadingLocations.value = false
                }

                override fun onFailure(call: Call<CheckupLocationResponse?>, t: Throwable) {
                    Log.d("AdolescentActivityViewModel", "onFailure: ${t.message}")
                    locationLoadingErrorMessage.value =
                        context.getString(R.string.couldnt_connect_to_server)
                    isLoadingLocations.value = false
                }
            })
    }

    fun postAdolescent(adolescent: Adolescent) {
        isLoadingAdolescent.value = true

        val gson = Gson()
        val updateDataString: String = gson.toJson(adolescent)
        val adolescentDataRequest =
            RequestBody.create(MediaType.parse("text/plain"), updateDataString)
        val adolescentDataBody =
            MultipartBody.Part.createFormData("adolescent_data", null, adolescentDataRequest)

        apiService?.postAdolescent(adolescentDataBody)
            ?.enqueue(object : Callback<AdolescentResponse?> {
                override fun onResponse(
                    call: Call<AdolescentResponse?>, response: Response<AdolescentResponse?>
                ) {
                    if (response.body()?.adolescent != null) {
                        updatedAdolescent.value = response.body()?.adolescent
                    } else if (response.body()?.errorMessage?.isNotEmpty() == true) {
                        postErrorMessage.value = response.body()?.errorMessage
                    } else {
                        postErrorMessage.value =
                            response.code().toString() + ": " + response.message()
                        if (response.code() == 401) {
                            Functions.removeUserToken(context)
                        }
                    }
                    isLoadingAdolescent.value = false
                }

                override fun onFailure(call: Call<AdolescentResponse?>, t: Throwable) {
                    Log.e("AdolescentActivityViewModel", "onFailure: ${t.message}")
                    postErrorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                    isLoadingAdolescent.value = false
                }
            })
    }

    fun searchAdolescents(query: String) {
        isSearchingAdolescent.value = true
        searchErrorMessage.value = ""

        apiService?.searchAdolescent(query)?.enqueue(object : Callback<SearchAdolescentResponse?> {
            override fun onResponse(
                call: Call<SearchAdolescentResponse?>, response: Response<SearchAdolescentResponse?>
            ) {
                if (response.body()?.adolescents != null) {
                    adolescents.value = response.body()?.adolescents
                } else {
                    searchErrorMessage.value =
                        response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                }
                isSearchingAdolescent.value = false
            }

            override fun onFailure(call: Call<SearchAdolescentResponse?>, t: Throwable) {
                Log.e("AdolescentActivityViewModel", "onFailure: ${t.message}")
                searchErrorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isSearchingAdolescent.value = false
            }
        })
    }

    fun uploadAdolescentPhoto(adolescentUUID: String?, file: File) {
        isUploadingPhoto.value = true
        photoUploadErrorMessage.value = ""
        val requestFile: RequestBody = RequestBody.create(MediaType.parse("image/*"), file)
        val photoFile = MultipartBody.Part.createFormData("file", file.name, requestFile)

        var uuid = adolescentUUID
        if (uuid == null) {
            uuid = ""
        }
        val uuidParam = MultipartBody.Part.createFormData(
            "uuid", null, RequestBody.create(MediaType.parse("text/plain"), uuid)
        )

        apiService?.uploadAdolescentPhoto(uuidParam, photoFile)
            ?.enqueue(object : Callback<AdolescentResponse?> {
                override fun onResponse(
                    call: Call<AdolescentResponse?>, response: Response<AdolescentResponse?>
                ) {
                    if (response.body()?.adolescent != null) {
                        updatedAdolescent.value = response.body()?.adolescent
                    } else {
                        photoUploadErrorMessage.value =
                            response.code().toString() + ": " + response.message()
                        if (response.code() == 401) {
                            Functions.removeUserToken(context)
                        }
                    }
                    isUploadingPhoto.value = false
                }

                override fun onFailure(call: Call<AdolescentResponse?>, t: Throwable) {
                    Log.e("AdolescentActivityViewModel", "onFailure: ${t.message}")
                    photoUploadErrorMessage.value =
                        context.getString(R.string.couldnt_connect_to_server)
                    isUploadingPhoto.value = false
                }
            })
    }

    fun getSchool(type: String? = null) {
        isLoadingSchools.value = true
        schoolsErrorMessage.value = ""

        apiService?.getSchools(type)?.enqueue(object : Callback<SchoolResponse?> {
            override fun onResponse(
                call: Call<SchoolResponse?>, response: Response<SchoolResponse?>
            ) {
                if (response.body()?.schools != null) {
                    schools.value = response.body()?.schools
                } else {
                    schoolsErrorMessage.value =
                        response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                }
                isLoadingSchools.value = false
            }

            override fun onFailure(call: Call<SchoolResponse?>, t: Throwable) {
                Log.e("AdolescentActivityViewModel", "onFailure: ${t.message}")
                schoolsErrorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoadingSchools.value = false
            }
        })
    }
}