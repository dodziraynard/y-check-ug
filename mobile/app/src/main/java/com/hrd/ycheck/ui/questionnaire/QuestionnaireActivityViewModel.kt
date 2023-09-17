package com.hrd.ycheck.ui.questionnaire

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.hrd.ycheck.R
import com.hrd.ycheck.network.RestApiFactory
import com.hrd.ycheck.network.response_models.GetSurveyQuestionResponse
import com.hrd.ycheck.network.response_models.PostSurveyResponseResponse
import com.hrd.ycheck.utils.Functions
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class QuestionnaireActivityViewModel(application: Application) : AndroidViewModel(application) {
    private val TAG = "QuestionnaireActivityViewModel"
    val isLoading: MutableLiveData<Boolean> = MutableLiveData(false)
    private val apiService = RestApiFactory.create(application);
    private val context: Application = application
    val errorMessage = MutableLiveData<String?>()

    val nextQuestionResponse: MutableLiveData<GetSurveyQuestionResponse?> = MutableLiveData(null)
    val surveyResponseResult: MutableLiveData<PostSurveyResponseResponse?> = MutableLiveData(null)

    fun getQuestion(
        adolescentId: Long,
        currentQuestionId: Long,
        action: String?,
        questionType: String
    ) {
        isLoading.value = true
        apiService?.getQuestion(
            adolescentId,
            currentQuestionId,
            action,
            questionType,
        )?.enqueue(object : Callback<GetSurveyQuestionResponse?> {
            override fun onResponse(
                call: Call<GetSurveyQuestionResponse?>,
                response: Response<GetSurveyQuestionResponse?>
            ) {
                if (response.code() != 200) {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                } else {
                    errorMessage.value = response.body()?.errorMessage
                    nextQuestionResponse.value = response.body()
                }
                isLoading.value = false
            }

            override fun onFailure(call: Call<GetSurveyQuestionResponse?>, t: Throwable) {
                Log.e(TAG, "onFailure: ${t.message}")
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
            }
        })
    }

    fun postSurveyResponse(
        adolescentId: Long,
        questionId: Long,
        value: String?,
        chosenOptions: List<Long>?
    ) {
        isLoading.value = true
        apiService?.postSurveyResponse(
            adolescentId, questionId, value, chosenOptions
        )?.enqueue(object : Callback<PostSurveyResponseResponse?> {
            override fun onResponse(
                call: Call<PostSurveyResponseResponse?>,
                response: Response<PostSurveyResponseResponse?>
            ) {
                if (response.code() != 200) {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                } else {
                    errorMessage.value = response.body()?.errorMessage
                    surveyResponseResult.value = response.body()
                }
                isLoading.value = false
            }

            override fun onFailure(call: Call<PostSurveyResponseResponse?>, t: Throwable) {
                Log.e(TAG, "onFailure: ${t.message}")
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
            }
        })
    }
}