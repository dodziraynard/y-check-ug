package com.hrd.ycheck.ui.authentication

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.AppRoomDatabase
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityConfigurationBinding
import com.hrd.ycheck.models.Configuration
import com.hrd.ycheck.ui.MainActivity

class ConfigurationActivity : AppCompatActivity() {
    private lateinit var binding: ActivityConfigurationBinding
    private lateinit var viewModel: AuthenticationActivityViewModel
    private var configuration: Configuration = Configuration(1, "")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConfigurationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = getString(R.string.network_access_configuration)
        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]
        viewModel.configuration?.observe(this) {
            if (it != null) {
                configuration = it
                binding.hostText.setText(it.host)
            }
        }

        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        // Handle save button click
        binding.saveButton.setOnClickListener {
            val host = binding.hostText.text.toString()
            if (host.isEmpty()) {
                binding.hostErrorMessage.visibility = View.VISIBLE
            } else {
                binding.hostErrorMessage.visibility = View.GONE
                configuration.host = host
                AppRoomDatabase.databaseWriteExecutor.execute {
                    AppRoomDatabase.INSTANCE?.ConfigurationDao()?.insertConfiguration(configuration)
                    startActivity(Intent(this, MainActivity::class.java))
                }
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