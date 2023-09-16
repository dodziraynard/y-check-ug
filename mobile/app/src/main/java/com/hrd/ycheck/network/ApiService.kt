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

}