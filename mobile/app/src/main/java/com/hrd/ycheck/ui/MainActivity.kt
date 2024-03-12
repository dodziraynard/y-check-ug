package com.hrd.ycheck.ui

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityMainBinding
import com.hrd.ycheck.game.GameActivity
import com.hrd.ycheck.models.User
import com.hrd.ycheck.ui.adolescent_enrollment.NewAdolescentActivity
import com.hrd.ycheck.ui.adolescent_enrollment.SearchAdolescentActivity
import com.hrd.ycheck.ui.authentication.AuthenticationActivityViewModel
import com.hrd.ycheck.ui.authentication.ConfigurationActivity
import com.hrd.ycheck.ui.authentication.LoginActivity
import com.hrd.ycheck.ui.authentication.ProfileActivity
import com.hrd.ycheck.ui.authentication.SecurityQuestionActivity
import com.hrd.ycheck.utils.Constants
import com.hrd.ycheck.utils.Constants.SHARED_PREFS_FILE
import java.util.Calendar

class MainActivity : AppCompatActivity() {
    private lateinit var viewModel: AuthenticationActivityViewModel
    private var user: User? = null
    private lateinit var binding: ActivityMainBinding
    private lateinit var preferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]
        preferences = getSharedPreferences(SHARED_PREFS_FILE, MODE_PRIVATE)

        // If new user, redirect to login

        viewModel.user?.observe(this) {
            user = it
            if (user != null) {
                // Ensure the user has answered the security questions.
                if (user?.securityAnswer1?.isEmpty() != false || user?.securityAnswer2?.isEmpty() != false) {
                    startActivity(Intent(this, SecurityQuestionActivity::class.java))
                    finish()
                }

                // Ensure the user has updated their profile.
                if (user?.surname?.isEmpty() != false || user?.otherNames?.isEmpty() != false) {
                    Toast.makeText(
                        this,
                        getString(R.string.update_profile_instruction),
                        Toast.LENGTH_SHORT
                    ).show()
                    startActivity(Intent(this, ProfileActivity::class.java))
                    finish()
                }

                val cal: Calendar = Calendar.getInstance()
                val hour: Int = cal.get(Calendar.HOUR_OF_DAY)
                val greeting = if (hour < 12) {
                    getString(R.string.good_morning)
                } else if (hour < 18) {
                    getString(R.string.good_afternoon)
                } else {
                    getString(R.string.good_evening)
                }
                title = "$greeting, ${user?.otherNames ?: user?.username}";
            } else {
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            }
        }

        // Button clicks
        binding.newAdolescentCard.setOnClickListener {
            startActivity(Intent(this, NewAdolescentActivity::class.java))
        }
        binding.searchAdolescentCard.setOnClickListener {
            startActivity(Intent(this, SearchAdolescentActivity::class.java))
        }
        binding.playGameLabel.setOnClickListener {
            startActivity(Intent(this, GameActivity::class.java))
        }
    }


    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main_activity_menu, menu)
        return true
    }

    override fun onResume() {
        super.onResume()

        val input1 = "6/4"
        val pat = "\\d+(\\.\\d+)?/\\d+(\\.\\d+)?"
        val regex = Regex(pat)
        Log.d("REGEX", "Input 1 matches: ${regex.matches(input1)}")



        val prefs = getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE)
        val isNew = prefs.getBoolean(Constants.IS_NEW_USER, true)
        val token = prefs.getString(Constants.USER_TOKEN, "")
        if (isNew || token.isNullOrEmpty()) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == R.id.action_logout) {
            val prefs = getSharedPreferences(SHARED_PREFS_FILE, Context.MODE_PRIVATE).edit()
            prefs.remove(Constants.IS_NEW_USER)
            prefs.remove(Constants.USER_TOKEN)
            prefs.apply()
            val intent = Intent(this, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish()
        }
        if (item.itemId == R.id.action_setting) {
            startActivity(Intent(this, ConfigurationActivity::class.java))
        }
        if (item.itemId == R.id.action_profile) {
            startActivity(Intent(this, ProfileActivity::class.java))
        }
        return super.onOptionsItemSelected(item)
    }
}