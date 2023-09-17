package com.hrd.ycheck.ui.questionnaire

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.hrd.ycheck.R
import com.hrd.ycheck.components.compose.QuestionnaireUI
import com.hrd.ycheck.components.compose.YCheckTheme
import com.hrd.ycheck.databinding.ActivityQuestionnaireBinding
import com.hrd.ycheck.databinding.SectionInstructionBottomSheetLayoutBinding
import com.hrd.ycheck.models.*

class QuestionnaireActivity : AppCompatActivity() {
    private lateinit var viewModel: QuestionnaireActivityViewModel
    private lateinit var binding: ActivityQuestionnaireBinding
    private var newAdolescentResponse: NewAdolescentResponse? = null
    private val TAG = "Someradome"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQuestionnaireBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel = ViewModelProvider(this)[QuestionnaireActivityViewModel::class.java]

        val adolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        val adolescentId = 1L
        // Auto load first questions.
        viewModel.getQuestion(adolescentId, 0, "next")


        binding.nextButton.setOnClickListener {
            var questionId = 0L
            if (newAdolescentResponse != null) {
                questionId = newAdolescentResponse!!.questionId
                val value = newAdolescentResponse!!.value
                val options =
                    newAdolescentResponse!!.chosenOptions.map { option -> option?.id ?: -1 }
                viewModel.postSurveyResponse(adolescentId, questionId, value, options)
            }
            viewModel.getQuestion(adolescentId, questionId, "next")
        }

        viewModel.isLoading.observe(this) { value ->
            if (value) {
                binding.nextButton.isEnabled = false
                binding.previousButton.isEnabled = false
                binding.loginLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.nextButton.isEnabled = true
                binding.previousButton.isEnabled = true
                binding.loginLoadingProcessBar.visibility = View.GONE
            }
        }

//        viewModel.errorMessage.observe(this) { value ->
//            if (value != null && value.isNotEmpty()) {
//                binding.errorMessageLabel.visibility = View.VISIBLE
//                binding.errorMessageLabel.text = value
//            } else {
//                binding.errorMessageLabel.visibility = View.GONE
//            }
//        }

        binding.previousButton.setOnClickListener {
            val questionId = newAdolescentResponse?.questionId ?: 0
            viewModel.getQuestion(adolescentId, questionId, "previous")
        }

        viewModel.errorMessage.observe(this) { message ->
            if (message?.isNotEmpty() == true) {
                Toast.makeText(this, message, Toast.LENGTH_LONG).show()
            }
        }

        viewModel.nextQuestionResponse.observe(this) { response ->
            if (response != null) {
                val question = response.question
                val section = response.newSection
                val submittedResponse = response.currentResponse
                val currentSessionNumber = response.currentSessionNumber
                val totalSessions = response.totalSessions

                // Dummy
                val adolescent: Adolescent? = Adolescent(
                    id = 1,
                    otherNames = "r",
                    surname = "df",
                    checkupLocation = "hi",
                    dob = 22,
                    visitType = "dfad",
                    type = "primary",
                    gender = "male"
                )

                if (section != null && question != null && adolescent != null) {
                    renderNewSectionInstructionAndQuestion(
                        adolescent,
                        question,
                        submittedResponse,
                        currentSessionNumber,
                        totalSessions,
                        section
                    )
                } else if (question != null && adolescent != null) {
                    renderQuestion(
                        adolescent, question, submittedResponse, currentSessionNumber, totalSessions
                    )
                } else {
                    showCompletionDialog()
                }
            }
        }

    }

    private fun renderQuestion(
        adolescent: Adolescent,
        question: Question,
        submittedAdolescentResponse: SubmittedAdolescentResponse?,
        currentSessionNumber: Int,
        totalSessions: Int
    ) {
        newAdolescentResponse = NewAdolescentResponse(question.id, adolescent.id)
        binding.questionnaireUi.apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
            setContent {
                YCheckTheme {
                    QuestionnaireUI(
                        currentQuestion = question,
                        newResponse = newAdolescentResponse!!,
                        submittedResponse = submittedAdolescentResponse,
                        currentSectionNumber = currentSessionNumber,
                        totalSectionCount = totalSessions
                    )
                }
            }
        }
    }

    private fun renderNewSectionInstructionAndQuestion(
        adolescent: Adolescent,
        question: Question,
        submittedResponse: SubmittedAdolescentResponse?,
        currentSessionNumber: Int,
        totalSessions: Int,
        section: Section
    ) {
        val bottomSheetDialog = BottomSheetDialog(this@QuestionnaireActivity)
        val dialogBinding = SectionInstructionBottomSheetLayoutBinding.inflate(layoutInflater)
        bottomSheetDialog.setContentView(dialogBinding.root)
        bottomSheetDialog.setCancelable(false)
        bottomSheetDialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED

        dialogBinding.sectionNameLabel.text = "Section ${section.number}: ${section.name}"
        dialogBinding.sectionInstructionLabel.text = section.instruction

        dialogBinding.continueButton.setOnClickListener {
            renderQuestion(
                adolescent, question, submittedResponse, currentSessionNumber, totalSessions
            )
            bottomSheetDialog.dismiss()
        }
        bottomSheetDialog.show()
    }

    private fun showCompletionDialog() {
        val dialog = AlertDialog.Builder(this)
            .setTitle("No more questions")
            .setCancelable(false)
            .setPositiveButton(getString(R.string.done)) { _, _ ->
                finish()
            }.setMessage(
                "There are no more questions available for this survey. \nThank you for your time."
            )
        dialog.create()
        dialog.show()
    }
}