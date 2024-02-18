package com.hrd.ycheck.ui.questionnaire

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.TextView
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
import com.hrd.ycheck.game.GameActivity
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.models.InputType
import com.hrd.ycheck.models.NewAdolescentResponse
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.Section
import com.hrd.ycheck.models.SubmittedAdolescentResponse
import com.hrd.ycheck.ui.adolescent_enrollment.SurveyFeedbackActivity
import com.hrd.ycheck.ui.common.TimeInputDialogFragment
import com.hrd.ycheck.ui.session_end.SessionEndActivity
import com.hrd.ycheck.utils.ActivityTags
import com.hrd.ycheck.utils.AudioPlayer
import com.hrd.ycheck.utils.QuestionnaireType
import com.hrd.ycheck.utils.QuestionnaireType.SURVEY_PRACTICE


class QuestionnaireActivity : AppCompatActivity() {
    private lateinit var viewModel: QuestionnaireActivityViewModel
    private lateinit var binding: ActivityQuestionnaireBinding
    private var newAdolescentResponse: NewAdolescentResponse? = null
    private var adolescent: Adolescent? = null
    private var questionnaireType: String = QuestionnaireType.SURVEY
    private var currentQuestionId: String = "-1"
    private var currentQuestion: Question? = null
    private lateinit var audioPlayer: AudioPlayer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQuestionnaireBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel = ViewModelProvider(this)[QuestionnaireActivityViewModel::class.java]

        adolescent = intent.getParcelableExtra("adolescent")

        audioPlayer = AudioPlayer()

        if (adolescent == null) {
            Toast.makeText(this, getString(R.string.adolescent_not_found), Toast.LENGTH_LONG).show()
            finish()
        }

        questionnaireType = intent.getStringExtra("question_type") ?: QuestionnaireType.SURVEY
        currentQuestionId = intent.getStringExtra("current_question_id") ?: "-1"
        val congratulatedFor = intent.getLongExtra("congratulated_for_session_number", -1L)

        if (questionnaireType == SURVEY_PRACTICE) {
            showPracticeTourText()
        }

        // Record the time adolescent arrives at a station.
        var activityTag: String = ""
        when (questionnaireType.lowercase()) {
            SURVEY_PRACTICE -> activityTag = ActivityTags.ADOLESCENT_SURVEY_START
            QuestionnaireType.PHYSICAL_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_PHYSICAL_ASSESSMENT_START
            QuestionnaireType.LAB_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_LAB_ASSESSMENT_START

            QuestionnaireType.CLINICAL_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_CLINICAL_ASSESSMENT_START
        }

        if (activityTag.isNotEmpty() && adolescent?.id != null && congratulatedFor == -1L) {
            val dialogFragment =
                TimeInputDialogFragment(
                    activityTag,
                    adolescent!!.id
                )
            dialogFragment.isCancelable = false
            dialogFragment.show(supportFragmentManager, "TimeInputDialogFragment")
        }

        val adolescentId = adolescent!!.id
        // Auto load first questions
        viewModel.getQuestion(adolescentId, currentQuestionId, "next", questionnaireType)

        binding.nextButton.setOnClickListener {
            validateResponseAndProceed(adolescentId, "next")
        }

        binding.nextAnsweredQuestionButton.setOnClickListener {
            validateResponseAndProceed(adolescentId, "next_answered")
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

        binding.previousButton.setOnClickListener {
            val questionId = newAdolescentResponse?.questionId ?: "0"
            viewModel.getQuestion(adolescentId, questionId, "previous", questionnaireType)
        }

        viewModel.errorMessage.observe(this) { message ->
            if (message?.isNotEmpty() == true) {
                Toast.makeText(this, message, Toast.LENGTH_LONG).show()
            }
        }

        viewModel.nextQuestionResponse.observe(this) { response ->
            if (response != null) {
                currentQuestion = response.question
                val section = response.newSection
                val submittedResponse = response.currentResponse
                val currentSessionNumber = response.currentSessionNumber
                val totalSessions = response.totalSessions

                if (section != null && currentQuestion != null && adolescent != null) {
                    if (section.requiresGame) {
                        confirmGamePlay(
                            adolescent!!,
                            currentQuestion!!,
                            submittedResponse,
                            currentSessionNumber,
                            totalSessions,
                            section
                        )
                    }
                    // else if not first section and congratulation not
                    // shown for previous section, show congratulation screen.
                    else if (currentSessionNumber > 1 && congratulatedFor != section.number) {
                        val message =
                            "Session ${currentSessionNumber - 1} of $totalSessions completed. Continue to unlock and play the fun games we mentioned earlier."
                        showSessionEndScreen(message, questionnaireType, section.number)
                    } else {
                        renderNewSectionInstructionAndQuestion(
                            adolescent!!,
                            currentQuestion!!,
                            submittedResponse,
                            currentSessionNumber,
                            totalSessions,
                            section
                        )
                    }
                } else if (currentQuestion != null && adolescent != null) {
                    renderQuestion(
                        adolescent!!,
                        currentQuestion!!,
                        submittedResponse,
                        currentSessionNumber,
                        totalSessions
                    )
                } else if (questionnaireType == SURVEY_PRACTICE) {
                    val message =
                        "Well done, ${adolescent?.otherNames}! You've completed the practice questions. Now let's start the actual survey."
                    showSessionEndScreen(message, QuestionnaireType.SURVEY, -1L)
                } else {
                    showCompletionDialog()
                }
            }
        }

        binding.closeQuizButton.setOnClickListener {
            showExitDialog()
        }
    }

    private fun validateResponseAndProceed(adolescentId: String, action: String = "next") {
        val currentQuestionAnswered =
            newAdolescentResponse?.value?.isNotEmpty() == true
                    || newAdolescentResponse?.chosenOptions?.isNotEmpty() == true
        viewModel.currentQuestionAnswered.value = currentQuestionAnswered

        if (newAdolescentResponse?.value?.isNotEmpty() == true && !isNumericResponseValid(
                currentQuestion!!,
                newAdolescentResponse!!.value
            )
        ) {
            showInvalidValueDialog(newAdolescentResponse!!.value, currentQuestion!!);
        } else if (currentQuestion?.toBeConfirmed == true && newAdolescentResponse?.value?.isNotEmpty() == true) {
            confirmResponseValue(newAdolescentResponse!!.value, adolescentId);
        } else if (currentQuestionAnswered) {
            saveAndLoadNextQuestion(adolescentId, action)
        } else {
            Toast.makeText(this, getString(R.string.please_respond_to_continue), Toast.LENGTH_LONG)
                .show();
        }
    }

    private fun saveAndLoadNextQuestion(adolescentId: String, action: String = "next") {
        if (newAdolescentResponse != null) {
            currentQuestionId = newAdolescentResponse!!.questionId
            val value = newAdolescentResponse!!.value
            val options = newAdolescentResponse!!.chosenOptions.map { option ->
                option?.id ?: -1
            } as List<Long>?
            viewModel.postSurveyResponse(adolescentId, currentQuestionId, value, options)
        }
        viewModel.getQuestion(adolescentId, currentQuestionId, action, questionnaireType)
    }

    private fun confirmGamePlay(
        adolescent: Adolescent,
        question: Question,
        submittedResponse: SubmittedAdolescentResponse?,
        currentSessionNumber: Int,
        totalSessions: Int,
        section: Section
    ) {
        val dialog = AlertDialog.Builder(this).setTitle(getString(R.string.game_available))
            .setCancelable(false)
            .setNegativeButton(getString(R.string.no)) { _, _ ->
                renderNewSectionInstructionAndQuestion(
                    adolescent,
                    question,
                    submittedResponse,
                    currentSessionNumber,
                    totalSessions,
                    section
                )
            }.setPositiveButton(getString(R.string.yes)) { _, _ ->
                val intent = Intent(this@QuestionnaireActivity, GameActivity::class.java)
                intent.putExtra("adolescent", this.adolescent)
                startActivity(intent)
            }.setMessage(getString(R.string.play_game_confirmation))
        dialog.create()
        dialog.show()
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
                    viewModel.currentQuestionAnswered.postValue(false)
                    viewModel.currentQuestionConfirmed.postValue(false)
                    QuestionnaireUI(
                        currentQuestion = question,
                        newResponse = newAdolescentResponse!!,
                        submittedResponse = submittedAdolescentResponse,
                        currentSectionNumber = currentSessionNumber,
                        totalSectionCount = totalSessions,
                        audioPlayer = audioPlayer
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
        val dialog =
            AlertDialog.Builder(this).setTitle(getString(R.string.thank_you)).setCancelable(false)
                .setPositiveButton(getString(R.string.ok)) { _, _ ->
                    when (questionnaireType) {
                        QuestionnaireType.SURVEY -> {
                            val intent =
                                Intent(
                                    this@QuestionnaireActivity,
                                    SurveyFeedbackActivity::class.java
                                )
                            intent.putExtra("adolescent", adolescent)
                            startActivity(intent)
                            finish()
                        }
                    }
                    finish()
                }.setMessage(
                    getString(R.string.no_more_questions)
                )
        dialog.create()
        dialog.show()
    }

    private fun showExitDialog() {
        val dialog =
            AlertDialog.Builder(this).setTitle(getString(R.string.exit)).setCancelable(false)
                .setNegativeButton(getString(R.string.no)) { _, _ -> }
                .setPositiveButton(getString(R.string.yes)) { _, _ ->
                    finish()
                }.setMessage(getString(R.string.end_survey))
        dialog.create()
        dialog.show()
    }

    private fun showInvalidValueDialog(value: String, question: Question) {
        var message = "$value is not a valid number"
        if (question.minNumericValue != null || question.maxNumericValue != null) {
            message += " between ${question.minNumericValue} and ${question.maxNumericValue}."
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle(getString(R.string.invalid_input)).setCancelable(false)
            .setPositiveButton(getString(R.string.ok)) { _, _ -> }
            .setMessage(message)
        dialog.create()
        dialog.show()
    }

    private fun isNumericResponseValid(
        question: Question,
        value: String
    ): Boolean {
        val minNumericValue = question.minNumericValue
        val maxNumericValue = question.maxNumericValue
        if (question.inputType == InputType.NUMBER_FIELD && !value.matches(Regex("\\d+(\\.\\d+)?"))) return false
        if (minNumericValue != null && value.toInt() < minNumericValue) return false
        if (maxNumericValue != null && value.toInt() > maxNumericValue) return false
        return true
    }

    private fun showSessionEndScreen(
        message: String, questionType: String, currentSessionNumber: Long
    ) {
        val intent = Intent(this, SessionEndActivity::class.java)
        intent.putExtra("current_question_id", currentQuestionId)
        intent.putExtra("question_type", questionType)
        intent.putExtra("congratulated_for_session_number", currentSessionNumber)
        intent.putExtra("adolescent", adolescent)
        intent.putExtra("message", message)
        startActivity(intent)
        finish()
    }

    private fun showPracticeTourText() {
        val dialogBuilder = AlertDialog.Builder(this)
        val inflater = this.layoutInflater
        val dialogView: View = inflater.inflate(R.layout.dialog_practice_tour_note, null)
        dialogBuilder.setView(dialogView).setCancelable(false)
            .setPositiveButton(R.string.ok) { _, _ -> }
        val alertDialog = dialogBuilder.create()
        alertDialog.show()
    }

    private fun confirmResponseValue(value: String, adolescentId: String) {
        val dialogBuilder = AlertDialog.Builder(this)
        val inflater = this.layoutInflater
        val dialogView: View = inflater.inflate(R.layout.dialog_confirm_response, null)
        val valueView = dialogView.findViewById<TextView>(R.id.value_view)
        valueView.text = value

        dialogBuilder.setView(dialogView).setCancelable(false)
            .setNegativeButton(R.string.no) { _, _ -> }
            .setPositiveButton(R.string.yes) { _, _ ->
                saveAndLoadNextQuestion(adolescentId)
            }
        val alertDialog = dialogBuilder.create()
        alertDialog.show()
    }


    override fun onDestroy() {
        super.onDestroy()
        audioPlayer.release()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        super.onBackPressed()
        showExitDialog()
    }
}