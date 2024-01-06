package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityNewAdolescentBinding
import com.hrd.ycheck.databinding.ActivityPagedAdolescentRegistrationBinding
import com.hrd.ycheck.models.Adolescent

class PagedAdolescentRegistrationActivity : AppCompatActivity() {
    private var adolescent: Adolescent? = null
    private lateinit var binding: ActivityPagedAdolescentRegistrationBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPagedAdolescentRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        adolescent = intent.getParcelableExtra("adolescent")
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.page_adolescent_registration_activity_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        when (item.itemId) {
            R.id.action_single_view_registration -> {
                val intent = Intent(
                    this@PagedAdolescentRegistrationActivity,
                    NewAdolescentActivity::class.java
                )
                intent.putExtra("adolescent", adolescent)
                startActivity(intent)
                finish()
            }
        }
        return super.onOptionsItemSelected(item)
    }
}