package com.hrd.ycheck.ui.questionnaire

import android.content.Intent
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
import com.hrd.ycheck.game.GameActivity
import com.hrd.ycheck.models.*
import com.hrd.ycheck.ui.adolescent_enrollment.SurveyFeedbackActivity
import com.hrd.ycheck.ui.session_end.SessionEndActivity
import com.hrd.ycheck.utils.AudioPlayer
import com.hrd.ycheck.utils.QuestionnaireType
import com.hrd.ycheck.utils.QuestionnaireType.SURVEY_PRACTICE


class QuestionnaireActivity : AppCompatActivity() {
    private lateinit var viewModel: QuestionnaireActivityViewModel
    private lateinit var binding: ActivityQuestionnaireBinding
    private var newAdolescentResponse: NewAdolescentResponse? = null
    private var adolescent: Adolescent? = null
    private var questionnaireType: String = QuestionnaireType.SURVEY
    private var currentQuestionId: Long = 0
    lateinit var audioPlayer: AudioPlayer

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
        currentQuestionId = intent.getLongExtra("current_question_id", 0L)
        val congratulatedFor = intent.getLongExtra("congratulated_for_session_id", -1L)

        if (questionnaireType == SURVEY_PRACTICE) {
            showPracticeTourText()
        }

        val adolescentId = adolescent!!.id
        // Auto load first questions.
        viewModel.getQuestion(adolescentId, currentQuestionId, "next", questionnaireType)

        binding.nextButton.setOnClickListener {
            if (newAdolescentResponse != null) {
                currentQuestionId = newAdolescentResponse!!.questionId
                val value = newAdolescentResponse!!.value
                val options =
                    newAdolescentResponse!!.chosenOptions.map { option -> option?.id ?: -1 }
                viewModel.postSurveyResponse(adolescentId, currentQuestionId, value, options)
            }
            viewModel.getQuestion(adolescentId, currentQuestionId, "next", questionnaireType)
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
            val questionId = newAdolescentResponse?.questionId ?: 0
            viewModel.getQuestion(adolescentId, questionId, "previous", questionnaireType)
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

                if (section != null && question != null && adolescent != null) {
                    if (section.requiresGame) {
                        confirmGamePlay(
                            adolescent!!,
                            question,
                            submittedResponse,
                            currentSessionNumber,
                            totalSessions,
                            section
                        )
                    }
                    // else if not first section and congratulation not
                    // shown for previous section, show congratulation screen.
                    else if (currentSessionNumber > 1 && congratulatedFor != section.id) {
                        val message =
                            "Session ${currentSessionNumber - 1} of ${totalSessions} completed. Continue to unlock and play the fun games we mentioned earlier."
                        showSessionEndScreen(message, questionnaireType, section.id)
                    } else {
                        renderNewSectionInstructionAndQuestion(
                            adolescent!!,
                            question,
                            submittedResponse,
                            currentSessionNumber,
                            totalSessions,
                            section
                        )
                    }
                } else if (question != null && adolescent != null) {
                    renderQuestion(
                        adolescent!!,
                        question,
                        submittedResponse,
                        currentSessionNumber,
                        totalSessions
                    )
                } else if (questionnaireType == SURVEY_PRACTICE) {
                    val message =
                        "Excellent, ${adolescent?.otherNames}! You've completed the practice questions. Now let's start the actual survey."
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

    private fun confirmGamePlay(
        adolescent: Adolescent,
        question: Question,
        submittedResponse: SubmittedAdolescentResponse?,
        currentSessionNumber: Int,
        totalSessions: Int,
        section: Section
    ) {
        val dialog = AlertDialog.Builder(this).setTitle("Game Available").setCancelable(false)
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
        val dialog = AlertDialog.Builder(this).setTitle("Thank you.").setCancelable(false)
            .setPositiveButton(getString(R.string.ok)) { _, _ ->
                when (questionnaireType) {
                    QuestionnaireType.SURVEY -> {
                        val intent =
                            Intent(this@QuestionnaireActivity, SurveyFeedbackActivity::class.java)
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
        val dialog = AlertDialog.Builder(this).setTitle("Exit").setCancelable(false)
            .setNegativeButton(getString(R.string.no)) { _, _ -> }
            .setPositiveButton(getString(R.string.yes)) { _, _ ->
                finish()
            }.setMessage(getString(R.string.end_survey))
        dialog.create()
        dialog.show()
    }

    private fun showSessionEndScreen(
        message: String, question_type: String, currentSessionNumber: Long
    ) {
        val intent = Intent(this, SessionEndActivity::class.java)
        intent.putExtra("current_question_id", currentQuestionId)
        intent.putExtra("question_type", question_type)
        intent.putExtra("congratulated_for_session_id", currentSessionNumber)
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

    override fun onDestroy() {
        super.onDestroy()
        audioPlayer?.release()
    }
}