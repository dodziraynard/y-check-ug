package com.hrd.ycheck.ui.session_end

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.hrd.ycheck.databinding.ActivitySessionEndBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.questionnaire.QuestionnaireActivity
import com.hrd.ycheck.utils.QuestionnaireType
import kotlin.random.Random

class SessionEndActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySessionEndBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySessionEndBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val superlatives = listOf("Congratulations!", "Perfect!", "Wonderful!", "Keep it up!", "Good Job!")


        val currentQuestionId = intent.getLongExtra("current_question_id", 0L)
        val questionnaireType = intent.getStringExtra("question_type") ?: QuestionnaireType.SURVEY
        val adolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        val congratulatedFor = intent.getLongExtra("congratulated_for_session_id", -1L)

        val message = intent.getStringExtra("message") ?: "You have successfully completed the session."

        binding.sessionMessage.text = message
        binding.congratulationLabel.text = superlatives[Random.nextInt(0, superlatives.size)]

        binding.continueButton.setOnClickListener {
            val intent = Intent(this@SessionEndActivity, QuestionnaireActivity::class.java)
            intent.putExtra("current_question_id", currentQuestionId)
            intent.putExtra("question_type", questionnaireType)
            intent.putExtra("congratulated_for_session_id", congratulatedFor)
            intent.putExtra("adolescent", adolescent)
            startActivity(intent)
            finish()
        }
    }
}