package com.hrd.ycheck.network

import android.app.Application
import android.content.Context
import android.util.Log
import android.webkit.URLUtil
import com.hrd.ycheck.AppRoomDatabase
import com.hrd.ycheck.BuildConfig
import com.hrd.ycheck.R
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit


class RestApiFactory {
    companion object {
        fun create(context: Context): ApiService? {
            val database =
                AppRoomDatabase.getSyncDatabase(context.applicationContext as Application)
            val host = database?.ConfigurationDao()?.getConfiguration()?.host

            var baseUrl: String = context.getString(R.string.test_base_api_url)
            if (host != null && URLUtil.isValidUrl(host)) {
                baseUrl = host
            } else {
                if (!BuildConfig.DEBUG) {
                    baseUrl = context.getString(R.string.live_base_api_url)
                }
            }

            // Setting up request interceptor.
            val headerInterceptor = HeaderInterceptor(context)
            val okHttpClient = OkHttpClient().newBuilder().addInterceptor(headerInterceptor)
                .readTimeout(600, TimeUnit.SECONDS).writeTimeout(600, TimeUnit.SECONDS).build()

            val retrofit = Retrofit.Builder().client(okHttpClient).baseUrl(baseUrl)
                .addConverterFactory(GsonConverterFactory.create()).build()
            return retrofit.create(ApiService::class.java)
        }
    }
}