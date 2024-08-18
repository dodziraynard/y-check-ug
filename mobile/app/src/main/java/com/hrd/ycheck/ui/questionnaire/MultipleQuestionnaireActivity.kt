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
import com.google.gson.Gson
import com.hrd.ycheck.R
import com.hrd.ycheck.components.compose.MultipleQuestionnaireUI
import com.hrd.ycheck.components.compose.YCheckTheme
import com.hrd.ycheck.databinding.ActivityQuestionnaireBinding
import com.hrd.ycheck.databinding.SearchQuestionsBottomSheetLayoutBinding
import com.hrd.ycheck.databinding.SectionInstructionBottomSheetLayoutBinding
import com.hrd.ycheck.game.GameActivity
import com.hrd.ycheck.models.Adolescent
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
import com.hrd.ycheck.utils.StudyPhase


class MultipleQuestionnaireActivity : AppCompatActivity() {
    private lateinit var viewModel: QuestionnaireActivityViewModel
    private lateinit var binding: ActivityQuestionnaireBinding
    private var newAdolescentResponses: MutableMap<String, NewAdolescentResponse>? = null
    private var currentQuestions: List<Question>? = null
    private var currentSessionNumber = 0
    private var totalSessions = 0
    private var submittedAdolescentResponses: MutableMap<String, SubmittedAdolescentResponse> =
        mutableMapOf()
    private var adolescent: Adolescent? = null
    private var questionnaireType: String = QuestionnaireType.SURVEY
    private var currentQuestionId: String = "-1"
    private var stack = ArrayDeque<String>()
    private lateinit var audioPlayer: AudioPlayer
    private lateinit var studyPhase: String

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
        val isFollowup = intent.getBooleanExtra("isFollowup", false)
        studyPhase = if (isFollowup)
            StudyPhase.FOLLOWUP
        else {
            adolescent?.studyPhase ?: StudyPhase.IMPLEMENTATION
        }

        val congratulatedFor = intent.getLongExtra("congratulated_for_session_number", -1L)
        val serialisedStack = intent.getStringExtra("serialisedStack") ?: ""
        stack = ArrayDeque(serialisedStack.split(","))

        if (questionnaireType == SURVEY_PRACTICE) {
            showPracticeTourText()
        }

        // Record the time adolescent arrives at a station.
        var activityTag: String = ""
        when (questionnaireType.lowercase()) {
            QuestionnaireType.PHYSICAL_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_PHYSICAL_ASSESSMENT_START

            QuestionnaireType.LAB_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_LAB_ASSESSMENT_START

            QuestionnaireType.CLINICAL_ASSESSMENT -> activityTag =
                ActivityTags.ADOLESCENT_CLINICAL_ASSESSMENT_START
        }

        if (activityTag.isNotEmpty() && adolescent?.id != null && congratulatedFor == -1L) {
            val dialogFragment = TimeInputDialogFragment(
                activityTag, adolescent!!.id
            )
            dialogFragment.isCancelable = false
            dialogFragment.show(supportFragmentManager, "TimeInputDialogFragment")
        }

        val adolescentId = adolescent!!.id
        // Auto load first questions
        viewModel.getMultipleQuestion(
            adolescentId,
            currentQuestionId,
            "next",
            questionnaireType,
            studyPhase = studyPhase
        )
        binding.nextButton.setOnClickListener {
            viewModel.action.value = "next"
            validateAndSubmit(adolescentId)
        }

        viewModel.postMultipleResponseResult.observe(this) { response ->
            if (response?.success == true && response.lastAnsweredQuestionID != null) {
                stack.addLast(currentQuestionId)
                currentQuestionId = response.lastAnsweredQuestionID

                // Load next questions
                viewModel.getMultipleQuestion(
                    adolescentId,
                    currentQuestionId,
                    viewModel.action.value,
                    questionnaireType,
                    studyPhase = studyPhase
                )
            }
        }

        binding.nextUnansweredQuestionButton.setOnClickListener {
            viewModel.action.value = "next_unanswered"
            validateAndSubmit(adolescentId)
        }

        binding.searchQuestions.setOnClickListener {
            val bottomSheetDialog = BottomSheetDialog(this@MultipleQuestionnaireActivity)
            val dialogBinding =
                SearchQuestionsBottomSheetLayoutBinding.inflate(layoutInflater)
            bottomSheetDialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
            bottomSheetDialog.setContentView(dialogBinding.root)

            dialogBinding.searchButton.setOnClickListener {
                val query = dialogBinding.searchInput.text.toString()
                viewModel.getMultipleQuestion(
                    adolescentId, "", "next", questionnaireType, query, studyPhase = studyPhase
                )
                bottomSheetDialog.dismiss()
            }
            bottomSheetDialog.show()
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
            currentQuestionId = if (stack.isNotEmpty()) stack.removeLast() else "0"
            viewModel.getMultipleQuestion(
                adolescentId, currentQuestionId, "next", questionnaireType, studyPhase = studyPhase
            )
        }

        viewModel.errorMessage.observe(this) { message ->
            if (message?.isNotEmpty() == true) {
                Toast.makeText(this, message, Toast.LENGTH_LONG).show()
            }
        }

        viewModel.nextQuestionsResponse.observe(this) { response ->
            if (response != null) {
                currentQuestions = response.questions
                val section = response.newSection
                val submittedResponses = response.currentResponses
                currentSessionNumber = response.currentSectionNumber
                totalSessions = response.totalSessions

                // Create a map of question id to NewAdolescentResponse
                newAdolescentResponses = mutableMapOf()
                response.questions?.forEach { ques ->
                    newAdolescentResponses!![ques.id] =
                        NewAdolescentResponse(ques.id, adolescent!!.id)
                }

                // Create a map of question id to SubmittedResponses
                submittedAdolescentResponses = mutableMapOf()
                submittedResponses?.forEach { submittedResponse ->
                    submittedAdolescentResponses[submittedResponse.questionId] = submittedResponse
                }

                if (section != null && currentQuestions != null && adolescent != null) {
                    if (section.requiresGame) {
                        confirmGamePlay(
                            adolescent!!,
                            currentQuestions!!,
                            submittedAdolescentResponses,
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
                            currentQuestions!!,
                            submittedAdolescentResponses,
                            currentSessionNumber,
                            totalSessions,
                            section
                        )
                    }
                } else if (currentQuestions != null && adolescent != null) {
                    renderQuestion(
                        currentQuestions,
                        submittedAdolescentResponses,
                        currentSessionNumber,
                        totalSessions
                    )
                } else if (questionnaireType == SURVEY_PRACTICE) {
                    val message = getString(
                        R.string.well_done_you_ve_completed_the_practice_questions_now_let_s_start_the_actual_survey,
                        adolescent?.otherNames
                    )
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

    private fun validateAndSubmit(adolescentId: String) {
        // Get responses
        val questionResponsesMap = mutableMapOf<String, Pair<String?, List<String>?>>()
        var formIsValid = true
        newAdolescentResponses?.map { item ->
            newAdolescentResponses?.let { responses ->
                val response = responses[item.key]!!
                val options = response.chosenOptions
                val value = response.value

                val currentQuestionAnswered = value.isNotEmpty() || options.isNotEmpty()
                if (!currentQuestionAnswered) {
                    Toast.makeText(
                        this, getString(R.string.please_check_your_responses), Toast.LENGTH_LONG
                    ).show()
                    currentQuestions?.let { questions ->
                        renderQuestion(
                            questions,
                            submittedAdolescentResponses,
                            currentSessionNumber,
                            totalSessions,
                            showError = true
                        )
                    }
                    formIsValid = false
                    return@map
                }
                questionResponsesMap[response.questionId] = Pair(value, options.map { it.id })
            }
        }

        if (formIsValid) {
            // Convert questionResponsesMap to json JSon string
            val jsonString = Gson().toJson(questionResponsesMap)
            viewModel.postMultipleResponses(adolescentId, jsonString)
        }
    }

    private fun confirmGamePlay(
        adolescent: Adolescent,
        question: List<Question>,
        submittedResponse: MutableMap<String, SubmittedAdolescentResponse>,
        currentSessionNumber: Int,
        totalSessions: Int,
        section: Section
    ) {
        val dialog = AlertDialog.Builder(this).setTitle(getString(R.string.game_available))
            .setCancelable(false).setNegativeButton(getString(R.string.no)) { _, _ ->
                renderNewSectionInstructionAndQuestion(
                    adolescent,
                    question,
                    submittedResponse,
                    currentSessionNumber,
                    totalSessions,
                    section
                )
            }.setPositiveButton(getString(R.string.yes)) { _, _ ->
                val intent = Intent(this@MultipleQuestionnaireActivity, GameActivity::class.java)
                intent.putExtra("adolescent", this.adolescent)
                startActivity(intent)
            }.setMessage(getString(R.string.play_game_confirmation))
        dialog.create()
        dialog.show()
    }

    private fun renderQuestion(
        questions: List<Question>?,
        submittedAdolescentResponse: MutableMap<String, SubmittedAdolescentResponse>,
        currentSessionNumber: Int,
        totalSessions: Int,
        showError: Boolean = false,
    ) {
        binding.questionnaireUi.apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
            setContent {
                YCheckTheme {
                    newAdolescentResponses?.let {
                        MultipleQuestionnaireUI(
                            currentQuestions = questions,
                            newResponses = it,
                            submittedResponse = submittedAdolescentResponse,
                            currentSectionNumber = currentSessionNumber,
                            totalSectionCount = totalSessions,
                            audioPlayer = audioPlayer,
                            pid = adolescent?.pid ?: "",
                            showError = showError
                        )
                    }
                }
            }
        }
    }

    private fun renderNewSectionInstructionAndQuestion(
        adolescent: Adolescent,
        question: List<Question>,
        submittedResponse: MutableMap<String, SubmittedAdolescentResponse>,
        currentSessionNumber: Int,
        totalSessions: Int,
        section: Section
    ) {
        val bottomSheetDialog = BottomSheetDialog(this@MultipleQuestionnaireActivity)
        val dialogBinding = SectionInstructionBottomSheetLayoutBinding.inflate(layoutInflater)
        bottomSheetDialog.setContentView(dialogBinding.root)
        bottomSheetDialog.setCancelable(false)
        bottomSheetDialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED

        dialogBinding.sectionNameLabel.text =
            getString(R.string.section, section.number, section.name)
        dialogBinding.sectionInstructionLabel.text = section.instruction

        dialogBinding.continueButton.setOnClickListener {
            renderQuestion(
                question, submittedResponse, currentSessionNumber, totalSessions
            )
            bottomSheetDialog.dismiss()
        }
        bottomSheetDialog.show()
    }

    private fun showCompletionDialog() {
        val message =
            if (currentQuestionId == "-1") getString(R.string.no_revelant_question) else getString(
                R.string.no_more_questions
            )
        val dialog =
            AlertDialog.Builder(this).setTitle(getString(R.string.thank_you)).setCancelable(false)
                .setPositiveButton(getString(R.string.ok)) { _, _ ->
                    when (questionnaireType) {
                        QuestionnaireType.SURVEY -> {
                            val intent = Intent(
                                this@MultipleQuestionnaireActivity,
                                SurveyFeedbackActivity::class.java
                            )
                            intent.putExtra("adolescent", adolescent)
                            startActivity(intent)
                            finish()
                        }
                    }
                    finish()
                }.setMessage(message)
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

    private fun showSessionEndScreen(
        message: String, questionType: String, currentSessionNumber: Long
    ) {
        val intent = Intent(this, SessionEndActivity::class.java)
        intent.putExtra("current_question_id", currentQuestionId)
        intent.putExtra("question_type", questionType)
        intent.putExtra("congratulated_for_session_number", currentSessionNumber)
        intent.putExtra("adolescent", adolescent)
        intent.putExtra("message", message)
        intent.putExtra("serialisedStack", stack.joinToString(","))
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
        audioPlayer.release()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        super.onBackPressed()
        showExitDialog()
    }
}