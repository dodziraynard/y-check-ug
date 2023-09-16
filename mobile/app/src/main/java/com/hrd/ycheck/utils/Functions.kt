package com.hrd.ycheck.utils

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.hrd.ycheck.models.User
import com.hrd.ycheck.utils.Constants.SHARED_PREFS_FILE
import com.hrd.ycheck.utils.Constants.USER_ID
import com.hrd.ycheck.utils.Constants.USER_OBJECT
import com.hrd.ycheck.utils.Constants.USER_TOKEN


class Functions {
    companion object {
        fun removeUserToken(context: Context) {
            val prefs: SharedPreferences =
                context.getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE)
            prefs.edit().remove(USER_TOKEN).apply()
            prefs.edit().remove(USER_ID).apply()
        }

        fun getUserToken(context: Context): String? {
            val prefs: SharedPreferences =
                context.getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE)
            return prefs.getString(USER_TOKEN, "")
        }

        fun getUserId(context: Context): Long {
            val prefs: SharedPreferences =
                context.getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE)
            return prefs.getLong(USER_ID, -1L)
        }

        fun getLoggedInUser(context: Context): User? {
            val prefs: SharedPreferences =
                context.getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE)
            val userString = prefs.getString(USER_OBJECT, "")
            val gson = Gson()
            return if (userString?.isNotEmpty() == true) gson.fromJson(
                userString, User::class.java
            ) else null;
        }
    }

}