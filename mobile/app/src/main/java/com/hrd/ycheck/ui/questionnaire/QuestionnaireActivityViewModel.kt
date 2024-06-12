package com.hrd.ycheck.ui.questionnaire

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.hrd.ycheck.R
import com.hrd.ycheck.network.RestApiFactory
import com.hrd.ycheck.network.response_models.GetMultipleQuestionsResponse
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
    val nextQuestionsResponse: MutableLiveData<GetMultipleQuestionsResponse?> =
        MutableLiveData(null)
    val surveyResponseResult: MutableLiveData<PostSurveyResponseResponse?> = MutableLiveData(null)
    val postMultipleResponseResult: MutableLiveData<PostSurveyResponseResponse?> =
        MutableLiveData(null)

    val currentQuestionAnswered: MutableLiveData<Boolean> = MutableLiveData(false)
    val currentQuestionConfirmed: MutableLiveData<Boolean> = MutableLiveData(false)

    val action: MutableLiveData<String> = MutableLiveData("next")

    fun getQuestion(
        adolescentId: String,
        currentQuestionId: String,
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

    fun getMultipleQuestion(
        adolescentId: String,
        currentQuestionId: String,
        action: String?,
        questionType: String,
        query: String? = null,
    ) {
        isLoading.value = true
        apiService?.getMultipleQuestion(
            adolescentId,
            currentQuestionId,
            action,
            questionType,
            query,
        )?.enqueue(object : Callback<GetMultipleQuestionsResponse?> {
            override fun onResponse(
                call: Call<GetMultipleQuestionsResponse?>,
                response: Response<GetMultipleQuestionsResponse?>
            ) {
                if (response.code() != 200) {
                    errorMessage.value = response.code().toString() + ": " + response.message()
                    if (response.code() == 401) {
                        Functions.removeUserToken(context)
                    }
                } else {
                    errorMessage.value = response.body()?.errorMessage
                    nextQuestionsResponse.value = response.body()
                }
                isLoading.value = false
            }

            override fun onFailure(call: Call<GetMultipleQuestionsResponse?>, t: Throwable) {
                Log.e(TAG, "onFailure: ${t.message}")
                errorMessage.value = context.getString(R.string.couldnt_connect_to_server)
                isLoading.value = false
            }
        })
    }

    fun postSurveyResponse(
        adolescentId: String,
        questionId: String,
        value: String?,
        chosenOptions: List<String>?
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

    fun postMultipleResponses(
        adolescentId: String,
        questionResponsesJson: String
    ) {
        isLoading.value = true
        apiService?.postMultipleResponses(
            adolescentId, questionResponsesJson
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
                    postMultipleResponseResult.value = response.body()
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