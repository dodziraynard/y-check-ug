package com.hrd.ycheck.network

import com.hrd.ycheck.network.response_models.*
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.*


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
        @Query("current_question_id") currentQuestionId: Long,
        @Query("action") action: String? = "next",
        @Query("question_type") questionType: String? = "survey",
    ): Call<GetSurveyQuestionResponse?>?

    @FormUrlEncoded
    @POST("post-survey-response/")
    fun postSurveyResponse(
        @Field("adolescent_id") adolescentId: String,
        @Field("question_id") questionId: Long,
        @Field("value") value: String? = null,
        @Field("option_ids") optionIds: List<Long>? = null,
    ): Call<PostSurveyResponseResponse?>?

    @GET("get-schools/")
    fun getSchools(
        @Query("type") filters: String? = ""
    ): Call<SchoolResponse?>?

}