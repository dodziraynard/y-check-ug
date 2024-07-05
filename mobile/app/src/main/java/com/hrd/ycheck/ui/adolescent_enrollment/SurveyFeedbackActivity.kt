package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivitySurveyFeedbackBinding
import com.hrd.ycheck.databinding.UsernameAuthenticationBottomSheetLayoutBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.models.User
import com.hrd.ycheck.ui.authentication.AuthenticationActivityViewModel
import com.hrd.ycheck.ui.questionnaire.MultipleQuestionnaireActivity
import com.hrd.ycheck.ui.questionnaire.QuestionnaireActivity
import com.hrd.ycheck.utils.QuestionnaireType

class SurveyFeedbackActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySurveyFeedbackBinding
    private lateinit var viewModel: AuthenticationActivityViewModel
    private var currentUser: User? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySurveyFeedbackBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val adolescent: Adolescent? = intent.getParcelableExtra("adolescent")

        viewModel = ViewModelProvider(this)[AuthenticationActivityViewModel::class.java]

        viewModel.user?.observe(this) {
            currentUser = it
        }

        binding.feedbackButton.setOnClickListener {
            val bottomSheetDialog = BottomSheetDialog(this)
            val dialogBinding =
                UsernameAuthenticationBottomSheetLayoutBinding.inflate(layoutInflater)
            bottomSheetDialog.setContentView(dialogBinding.root)

            dialogBinding.accessFormButton.setOnClickListener {
                val username = dialogBinding.usernameInput.text.toString()
                if (currentUser?.username?.equals(username) == true) {
                    dialogBinding.errorMessageLabel.visibility = View.GONE
                    val intent = Intent(this, MultipleQuestionnaireActivity::class.java)
                    intent.putExtra("adolescent", adolescent)
                    intent.putExtra("question_type", QuestionnaireType.SURVEY_FEEDBACK)
                    startActivity(intent)
                    finish()
                } else {
                    dialogBinding.errorMessageLabel.visibility = View.VISIBLE
                    dialogBinding.errorMessageLabel.text = getString(R.string.invalid_username)
                }
            }
            bottomSheetDialog.show()
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }

}