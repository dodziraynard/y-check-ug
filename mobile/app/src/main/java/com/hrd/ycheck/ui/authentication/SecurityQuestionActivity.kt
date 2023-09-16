package com.hrd.ycheck.ui.authentication

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.google.gson.Gson
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivitySecurityQuestionBinding
import com.hrd.ycheck.ui.MainActivity
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody

class SecurityQuestionActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySecurityQuestionBinding
    private lateinit var viewModel: AuthenticationActivityViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySecurityQuestionBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "Security Questions"

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]

        viewModel.profileUpdate.observe(this) { value ->
            if (value) {
                val intent = Intent(this, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                Toast.makeText(
                    this, getString(R.string.profile_updated_successfully), Toast.LENGTH_SHORT
                ).show()
                startActivity(intent)
                finish()
            }
        }

        viewModel.isLoading.observe(this) { value ->
            if (value) {
                binding.saveButton.isEnabled = false
                binding.loginLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.saveButton.isEnabled = true
                binding.loginLoadingProcessBar.visibility = View.GONE
            }
        }

        viewModel.errorMessage.observe(this) { value ->
            if (value != null && value.isNotEmpty()) {
                binding.errorMessageLabel.visibility = View.VISIBLE
                binding.errorMessageLabel.text = value
            } else {
                binding.errorMessageLabel.visibility = View.GONE
            }
        }

        binding.saveButton.setOnClickListener {
            binding.errorMessageLabel.visibility = View.GONE
            val securityAnswer1 = binding.securityAnswer1.text.toString()
            val securityAnswer2 = binding.securityAnswer2.text.toString()
            if (securityAnswer1.isEmpty() || securityAnswer2.isEmpty()) {
                viewModel.errorMessage.value = getString(R.string.security_answers_required)
            } else {
                val updateData = mapOf(
                    "security_answer_1" to securityAnswer1, "security_answer_2" to securityAnswer2
                )
                val gson = Gson()
                val updateDataString: String = gson.toJson(updateData)
                val audioDataRequest =
                    RequestBody.create(MediaType.parse("text/plain"), updateDataString)
                val userDataBody =
                    MultipartBody.Part.createFormData("user_data", null, audioDataRequest)
                viewModel.updateProfile(userDataBody)
            }
        }
    }
}