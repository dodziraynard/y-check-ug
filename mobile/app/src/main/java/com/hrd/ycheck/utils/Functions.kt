package com.hrd.ycheck.utils

import android.content.Context
import android.content.SharedPreferences
import com.hrd.ycheck.utils.Constants.SHARED_PREFS_FILE
import com.hrd.ycheck.utils.Constants.USER_ID
import com.hrd.ycheck.utils.Constants.USER_TOKEN
import kotlin.reflect.KMutableProperty
import kotlin.reflect.KProperty1


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

        fun <T : Any> getAttr(obj: T, propertyName: String): Any? {
            return obj::class.members
                .filterIsInstance<KProperty1<T, *>>()
                .find { it.name == propertyName }
                ?.get(obj)
        }

        fun <T : Any> setAttr(obj: T, propertyName: String, value: Any?) {
            obj::class.members
                .filterIsInstance<KMutableProperty<*>>()
                .find { it.name == propertyName }
                ?.let { property ->
                    (property as KMutableProperty<T>).setter.call(obj, value)
                }
        }

    }

}