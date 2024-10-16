package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.hrd.ycheck.R
import com.hrd.ycheck.adapters.AdolescentAdapter
import com.hrd.ycheck.databinding.ActivitySearchAdolescentBinding
import com.hrd.ycheck.databinding.AdolescentSearchResultOptionLayoutBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.process_overview.ProcessOverviewActivity
import com.hrd.ycheck.ui.questionnaire.MultipleQuestionnaireActivity
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
                binding.searchInfo.visibility = View.GONE
                binding.resultsAnimation.visibility = View.GONE
            } else {
                binding.searchButton.isEnabled = true
                binding.searchAdolescentLoadingProcessBar.visibility = View.GONE
            }
        }

        viewModel.searchErrorMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.errorMessageLabel.text = message
                binding.errorMessageLabel.visibility = View.VISIBLE
                binding.searchInfo.visibility = View.VISIBLE
            } else {
                binding.errorMessageLabel.visibility = View.GONE
                binding.searchInfo.visibility = View.GONE
            }
        }

        val adapter = AdolescentAdapter(this)
        binding.recyclerView.adapter = adapter
        binding.recyclerView.layoutManager = LinearLayoutManager(this)

        viewModel.adolescents.observe(this) { adolescents ->
            if (adolescents.isEmpty()) {
                binding.searchInfo.visibility = View.VISIBLE
                binding.errorMessageLabel.visibility = View.VISIBLE
                binding.resultsAnimation.visibility = View.VISIBLE
                binding.errorMessageLabel.text = getString(R.string.no_results_found)
            } else {
                binding.resultsAnimation.visibility = View.GONE
                binding.searchInfo.visibility = View.GONE
            }
            adapter.setData(adolescents)
        }

        binding.searchButton.setOnClickListener {
            val query = binding.queryInput.text.toString()
            viewModel.searchAdolescents(query)
        }

        // On search result item click
        adapter.setOnItemClickListener(object : AdolescentAdapter.OnItemClickListener {
            override fun itemClickListener(adolescent: Adolescent, isFollowup: Boolean) {
                val bottomSheetDialog = BottomSheetDialog(this@SearchAdolescentActivity)
                val dialogBinding =
                    AdolescentSearchResultOptionLayoutBinding.inflate(layoutInflater)
                bottomSheetDialog.setContentView(dialogBinding.root)

                if (isFollowup) {
                    dialogBinding.textFollowup.visibility = View.VISIBLE
                } else {
                    dialogBinding.textFollowup.visibility = View.GONE
                }

                dialogBinding.preScreeningOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("question_type", QuestionnaireType.PRE_SCREENING)
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    startActivity(intent)
                }
                dialogBinding.screeningOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            AdolescentIntroductionActivity::class.java
                        )
                    intent.putExtra("question_type", QuestionnaireType.SURVEY)
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    startActivity(intent)
                }
                dialogBinding.physicalAssessmentOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.PHYSICAL_ASSESSMENT)
                    startActivity(intent)
                }
                dialogBinding.labAssessmentOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.LAB_ASSESSMENT)
                    startActivity(intent)
                }
                dialogBinding.clinicalAssessmentOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.CLINICAL_ASSESSMENT)
                    startActivity(intent)
                }
                dialogBinding.counsellorAssessmentOption.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.COUNSELLOR_ASSESSMENT)
                    startActivity(intent)
                }
                dialogBinding.evaluation.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.EVALUATION)
                    startActivity(intent)
                }
                dialogBinding.processOverview.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            ProcessOverviewActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    startActivity(intent)
                }
                dialogBinding.exitInterview.setOnClickListener {
                    val intent =
                        Intent(
                            this@SearchAdolescentActivity,
                            MultipleQuestionnaireActivity::class.java
                        )
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("isFollowup", isFollowup)
                    intent.putExtra("question_type", QuestionnaireType.EXIT_INTERVIEW)
                    startActivity(intent)
                }
                dialogBinding.editOption.setOnClickListener {
                    val intent =
                        Intent(this@SearchAdolescentActivity, NewAdolescentActivity::class.java)
                    intent.putExtra("adolescent", adolescent)
                    startActivity(intent)
                }
                bottomSheetDialog.show()
            }
        })
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.search_activity_menu, menu)

        val menuItem = menu?.findItem(R.id.action_search)
        val searchView = menuItem?.actionView as SearchView?
        searchView?.let {
            it.queryHint = "Search PID, name ..."
        }

        searchView?.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                query?.let {
                    viewModel.searchAdolescents(it)
                }
                return true
            }

            override fun onQueryTextChange(p0: String?): Boolean {
                return true;
            }
        })
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}