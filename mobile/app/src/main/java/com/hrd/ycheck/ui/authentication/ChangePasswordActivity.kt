package com.hrd.ycheck.ui.authentication

import android.content.Intent
import android.os.Bundle
import android.text.method.PasswordTransformationMethod
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityChangePasswordBinding

class ChangePasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityChangePasswordBinding
    private lateinit var viewModel: AuthenticationActivityViewModel
    private var showOldPassword = false
    private var showNewPassword = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChangePasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "Change Password"
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]

        binding.settingsButton.setOnClickListener {
            val intent = Intent(this, ConfigurationActivity::class.java)
            startActivity(intent)
        }

        binding.toggleOldPasswordVisibilityButton.setOnClickListener {
            binding.oldPasswordInput.transformationMethod =
                if (showOldPassword) PasswordTransformationMethod() else null
            binding.oldPasswordInput.setSelection(binding.oldPasswordInput.length());
            showOldPassword = !showOldPassword

            if (showOldPassword) it.setBackgroundResource(R.drawable.baseline_visibility_off_24)
            else {
                it.setBackgroundResource(com.google.android.material.R.drawable.design_ic_visibility)
            }
        }

        binding.toggleNewPasswordVisibilityButton.setOnClickListener {
            binding.newPasswordInput.transformationMethod =
                if (showNewPassword) PasswordTransformationMethod() else null
            binding.newPasswordInput.setSelection(binding.newPasswordInput.length());
            showNewPassword = !showNewPassword

            if (showNewPassword) it.setBackgroundResource(R.drawable.baseline_visibility_off_24)
            else {
                it.setBackgroundResource(com.google.android.material.R.drawable.design_ic_visibility)
            }
        }

        viewModel.isLoggedIn.observe(this) { value ->
            if (value) {
                finish()
            }
        }

        viewModel.isLoading.observe(this) { value ->
            if (value) {
                binding.submitButton.isEnabled = false
                binding.loadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.submitButton.isEnabled = true
                binding.loadingProcessBar.visibility = View.GONE
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

        binding.submitButton.setOnClickListener {
            binding.errorMessageLabel.visibility = View.GONE
            val oldPassword = binding.oldPasswordInput.text.toString()
            val newPassword = binding.newPasswordInput.text.toString()
            if (oldPassword.isEmpty() || newPassword.isEmpty()) {
                viewModel.errorMessage.value =
                    getString(R.string.old_new_password_required_intruction)
            } else {
                viewModel.changePassword(oldPassword, newPassword)
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}