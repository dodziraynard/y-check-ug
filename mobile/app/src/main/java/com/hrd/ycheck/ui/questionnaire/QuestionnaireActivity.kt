package com.hrd.ycheck.ui.questionnaire

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.components.compose.QuestionnaireUI
import com.hrd.ycheck.components.compose.YCheckTheme
import com.hrd.ycheck.databinding.ActivityQuestionnaireBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.utils.DataUtils.getDummyQuestions

class QuestionnaireActivity : AppCompatActivity() {
    private lateinit var viewModel: QuestionnaireActivityViewModel
    private lateinit var binding: ActivityQuestionnaireBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQuestionnaireBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel = ViewModelProvider(this)[QuestionnaireActivityViewModel::class.java]

        val adolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        val questions = getDummyQuestions()
//        val responses = HashMap<Question, NewAdolescentResponse>()

        binding.questionnaireUi.apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
            setContent {
                YCheckTheme {
                    QuestionnaireUI(questions) {
                        Toast.makeText(this@QuestionnaireActivity, "Thank you", Toast.LENGTH_LONG)
                            .show()
                    }
                }
            }
        }

    }
}