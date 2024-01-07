package com.hrd.ycheck.utils

import android.content.Context
import com.hrd.ycheck.R
import com.hrd.ycheck.models.Adolescent
import java.util.Calendar


class ModelDataInputValidatorFunctions {
    companion object {

        fun validateDob(adolescent: Adolescent): String? {
            val calendar = Calendar.getInstance()
            calendar.timeInMillis = adolescent.dob
            val age = ((System.currentTimeMillis() - calendar.timeInMillis) / 31556952000).toInt()

            if (age >= 20 || age < 10) {
                return "$age-year-olds are not eligible for this exercise."
            }
            return null;
        }

        fun validatePid(adolescent: Adolescent): String? {
            when (adolescent.type.uppercase()) {
                AdolescentTypes.BASIC.uppercase() -> {
                    if (!adolescent.pid.startsWith("YC1")) {
                        return "PID for adolescent type '${adolescent.type}' must start with YC1"
                    }
                }

                AdolescentTypes.SECONDARY.uppercase() -> {
                    if (!adolescent.pid.startsWith("YC2")) {
                        return "PID for adolescent type '${adolescent.type}' must start with YC2"
                    }
                }

                AdolescentTypes.COMMUNITY.uppercase() -> {
                    if (!adolescent.pid.startsWith("YC3")) {
                        return "PID for adolescent type '${adolescent.type}' must start with YC3"
                    }
                }
            }
            return null;
        }

        fun validateConsent(adolescent: Adolescent, context: Context): String? {
            val age = ((System.currentTimeMillis() - adolescent.dob) / 31556952000).toInt()
            val consents =
                listOf(IAFConsents.ADOLESCENT, IAFConsents.PARENT, IAFConsents.ADOLESCENT_PARENT)

            if (!((consents.contains(adolescent.consent) && age > 18) || (adolescent.consent == IAFConsents.ADOLESCENT_PARENT && age < 18))) {
                if (age < 18) {
                    return context.getString(R.string.parental_adolescent_assent_error_message)
                }
            }
            return null
        }
    }
}