package com.hrd.ycheck.network

import com.hrd.ycheck.network.response_models.AdolescentResponse
import com.hrd.ycheck.network.response_models.AuthenticationResponse
import com.hrd.ycheck.network.response_models.CheckupLocationResponse
import com.hrd.ycheck.network.response_models.GetMultipleQuestionsResponse
import com.hrd.ycheck.network.response_models.GetSurveyQuestionResponse
import com.hrd.ycheck.network.response_models.MobileConfigResponse
import com.hrd.ycheck.network.response_models.PostAdolescentActivityTimeResponse
import com.hrd.ycheck.network.response_models.PostSurveyResponseResponse
import com.hrd.ycheck.network.response_models.SchoolResponse
import com.hrd.ycheck.network.response_models.SearchAdolescentResponse
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Query


interface ApiService {
    @FormUrlEncoded
    @POST("auth/login/")
    fun login(
        @Field("username") username: String?,
        @Field("password") password: String?,
    ): Call<AuthenticationResponse?>?

    @FormUrlEncoded
    @POST("auth/change-password/")
    fun changePassword(
        @Field("old_password") oldPassword: String?, @Field("new_password") newPassword: String?
    ): Call<AuthenticationResponse?>?

    @FormUrlEncoded
    @POST("auth/register/")
    fun register(
        @Field("username") username: String?,
        @Field("password") password: String?,
    ): Call<AuthenticationResponse?>?

    @Multipart
    @POST("auth/update-user/")
    fun updateProfile(
        @Part userDataBody: MultipartBody.Part?,
        @Part photo: MultipartBody.Part? = null,
    ): Call<AuthenticationResponse?>?

    @GET("mobile-config/")
    fun getMobileConfig(): Call<MobileConfigResponse?>?

    @GET("checkup-location/")
    fun getCheckupLocations(
        @Query("filters") filters: String? = ""
    ): Call<CheckupLocationResponse?>?

    @Multipart
    @POST("adolescents/")
    fun postAdolescent(
        @Part adolescentDataBody: MultipartBody.Part?,
        @Part photo: MultipartBody.Part? = null,
    ): Call<AdolescentResponse?>?

    @GET("adolescents/")
    fun searchAdolescent(
        @Query("query") query: String,
    ): Call<SearchAdolescentResponse?>?

    @Multipart
    @POST("upload-adolescent-photo/")
    fun uploadAdolescentPhoto(
        @Part file: MultipartBody.Part?,
        @Part uuid: MultipartBody.Part?,
    ): Call<AdolescentResponse?>?

    @GET("get-survey-questions/")
    fun getQuestion(
        @Query("adolescent_id") adolescentId: String,
        @Query("current_question_id") currentQuestionId: String,
        @Query("action") action: String? = "next",
        @Query("question_type") questionType: String? = "survey",
    ): Call<GetSurveyQuestionResponse?>?

    @GET("get-multiple-questions/")
    fun getMultipleQuestion(
        @Query("adolescent_id") adolescentId: String,
        @Query("current_question_id") currentQuestionId: String,
        @Query("action") action: String? = "next",
        @Query("question_type") questionType: String? = "survey",
        @Query("query") query: String? = "",
        @Query("study_phase") studyPhase: String = "",
    ): Call<GetMultipleQuestionsResponse?>?

    @FormUrlEncoded
    @POST("post-survey-response/")
    fun postSurveyResponse(
        @Field("adolescent_id") adolescentId: String,
        @Field("question_id") questionId: String,
        @Field("value") value: String? = null,
        @Field("option_ids") optionIds: List<String>? = null,
    ): Call<PostSurveyResponseResponse?>?

    @FormUrlEncoded
    @POST("post-multiple-responses/")
    fun postMultipleResponses(
        @Field("adolescent_id") adolescentId: String,
        @Field("question_responses_json") questionResponsesJson: String,
        @Field("study_phase") studyPhase: String
    ): Call<PostSurveyResponseResponse?>?

    @GET("get-schools/")
    fun getSchools(
        @Query("type") filters: String? = ""
    ): Call<SchoolResponse?>?

    @FormUrlEncoded
    @POST("record-activity-time/")
    fun postAdolescentActivityTime(
        @Field("adolescent_id") adolescentId: String,
        @Field("activity_tag") activityTag: String,
        @Field("timestamp") timestamp: Long,
    ): Call<PostAdolescentActivityTimeResponse?>?

}