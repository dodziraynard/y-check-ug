package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.hrd.ycheck.R
import com.hrd.ycheck.adapters.AdolescentAdapter
import com.hrd.ycheck.databinding.ActivitySearchAdolescentBinding
import com.hrd.ycheck.databinding.AdolescentSearchResultOptionLayoutBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.questionnaire.QuestionnaireActivity
import com.hrd.ycheck.utils.QuestionnaireType

class SearchAdolescentActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySearchAdolescentBinding
    private lateinit var viewModel: AdolescentActivityViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySearchAdolescentBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "Search..."

        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        viewModel = ViewModelProvider(this)[AdolescentActivityViewModel::class.java]

        viewModel.isSearchingAdolescent.observe(this) { searching ->
            if (searching) {
                binding.searchButton.isEnabled = false
                binding.searchAdolescentLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.searchButton.isEnabled = true
                binding.searchAdolescentLoadingProcessBar.visibility = View.GONE
            }
        }

        viewModel.searchErrorMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.errorMessageLabel.text = message
                binding.errorMessageLabel.visibility = View.VISIBLE
            } else {
                binding.errorMessageLabel.visibility = View.GONE
            }
        }

        val adapter = AdolescentAdapter(this)
        binding.recyclerView.adapter = adapter
        binding.recyclerView.layoutManager = LinearLayoutManager(this)

        viewModel.adolescents.observe(this) { adolescents ->
            if (adolescents.isEmpty()) {
                binding.errorMessageLabel.visibility = View.VISIBLE
                binding.errorMessageLabel.text = getString(R.string.no_results_found)
            }
            adapter.setData(adolescents)
            Toast.makeText(this, "${adolescents.size}", Toast.LENGTH_SHORT).show()
        }

        binding.searchButton.setOnClickListener {
            val query = binding.queryInput.text.toString()
            viewModel.searchAdolescents(query)
        }

        // On search result item click
        adapter.setOnItemClickListener(object : AdolescentAdapter.OnItemClickListener {
            override fun itemClickListener(adolescent: Adolescent) {
                val bottomSheetDialog = BottomSheetDialog(this@SearchAdolescentActivity)
                val dialogBinding =
                    AdolescentSearchResultOptionLayoutBinding.inflate(layoutInflater)
                bottomSheetDialog.setContentView(dialogBinding.root)

                dialogBinding.editOptionContainer.setOnClickListener {
                    val intent =
                        Intent(this@SearchAdolescentActivity, NewAdolescentActivity::class.java)
                    intent.putExtra("adolescent", adolescent)
                    startActivity(intent)
                }
                dialogBinding.enterOptionContainer.setOnClickListener {
                    val intent =
                        Intent(this@SearchAdolescentActivity, QuestionnaireActivity::class.java)
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("question_type", QuestionnaireType.ASSESSMENT)
                    startActivity(intent)
                }
                bottomSheetDialog.show()
            }
        })
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}