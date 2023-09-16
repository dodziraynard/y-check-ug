package com.hrd.ycheck.ui.authentication

import android.content.Intent
import android.os.Bundle
import android.text.method.PasswordTransformationMethod
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityRegisterBinding
import com.hrd.ycheck.ui.MainActivity

class RegistrationActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var viewModel: AuthenticationActivityViewModel
    private var showPassword = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        title = "Register"

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]

        viewModel.configuration?.observe(this) {
            if (it == null) {
                startActivity(Intent(this, ConfigurationActivity::class.java))
                finish()
            }
        }

        binding.loginLabel.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
            startActivity(intent)
            finish()
        }

        binding.settingsButton.setOnClickListener {
            val intent = Intent(this, ConfigurationActivity::class.java)
            startActivity(intent)
        }

        viewModel.isLoading.observe(this) { value ->
            if (value) {
                binding.registerButton.isEnabled = false
                binding.loginLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.registerButton.isEnabled = true
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

        viewModel.isLoggedIn.observe(this) { value ->
            if (value) {
                startActivity(Intent(this@RegistrationActivity, MainActivity::class.java))
                finish()
            }
        }

        binding.togglePasswordVisibilityButton.setOnClickListener {
            binding.passwordInput.transformationMethod =
                if (showPassword) PasswordTransformationMethod() else null
            binding.passwordInput.setSelection(binding.passwordInput.length());
            showPassword = !showPassword

            if (showPassword) it.setBackgroundResource(R.drawable.baseline_visibility_off_24)
            else {
                it.setBackgroundResource(com.google.android.material.R.drawable.design_ic_visibility)
            }
        }

        binding.registerButton.setOnClickListener {
            binding.errorMessageLabel.visibility = View.GONE
            val password = binding.passwordInput.text.toString()
            val username = binding.usernameInput.text.toString()
            if (password.isEmpty() || username.isEmpty()) {
                viewModel.errorMessage.value = getString(R.string.username_required)
            } else {
                viewModel.register(username, password)
            }
        }
    }
}