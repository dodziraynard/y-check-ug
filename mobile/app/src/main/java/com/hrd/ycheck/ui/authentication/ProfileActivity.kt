package com.hrd.ycheck.ui.authentication

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.google.gson.Gson
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityProfileBinding
import com.hrd.ycheck.models.User
import com.hrd.ycheck.ui.MainActivity
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding
    private lateinit var viewModel: AuthenticationActivityViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = getString(R.string.my_profile)

        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]

        viewModel.user?.observe(this) {
            if (it != null) {
                populateFields(it)
            }
        }

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
            val surname = binding.surnameInput.text.toString()
            val otherNames = binding.otherNamesInput.text.toString()

            if (surname.isEmpty()) {
                binding.surnameErrorMessage.visibility = View.VISIBLE
            } else {
                binding.surnameErrorMessage.visibility = View.GONE
            }
            if (otherNames.isEmpty()) {
                binding.otherNamesErrorMessage.visibility = View.VISIBLE
            } else {
                binding.otherNamesErrorMessage.visibility = View.GONE
            }

            if (surname.isNotEmpty() && otherNames.isNotEmpty()) {
                val updateData = mapOf(
                    "surname" to surname, "other_names" to otherNames
                )
                val gson = Gson()
                val updateDataString: String = gson.toJson(updateData)
                val userDataRequest =
                    RequestBody.create(MediaType.parse("text/plain"), updateDataString)
                val userDataBody =
                    MultipartBody.Part.createFormData("user_data", null, userDataRequest)
                viewModel.updateProfile(userDataBody)
            }
        }
    }

    private fun populateFields(user: User) {
        binding.usernameInput.text = user.username
        binding.surnameInput.setText(user.surname)
        binding.otherNamesInput.setText(user.otherNames)
    }


    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.profile_activity_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.action_change_password -> {
                val intent = Intent(this, ChangePasswordActivity::class.java)
                startActivity(intent)
            }
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}