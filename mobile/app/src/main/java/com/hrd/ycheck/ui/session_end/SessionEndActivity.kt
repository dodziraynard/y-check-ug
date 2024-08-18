package com.hrd.ycheck.ui.session_end

import android.content.Intent
import android.media.MediaPlayer
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.hrd.ycheck.databinding.ActivitySessionEndBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.questionnaire.MultipleQuestionnaireActivity
import com.hrd.ycheck.utils.QuestionnaireType
import kotlin.random.Random


class SessionEndActivity : AppCompatActivity() {
    private var mediaPlayer: MediaPlayer? = null
    private lateinit var binding: ActivitySessionEndBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySessionEndBinding.inflate(layoutInflater)
        setContentView(binding.root)
        mediaPlayer = MediaPlayer()

        playSoundEffect()
        val superlatives =
            listOf("Congratulations!", "Perfect!", "Well done!", "Keep it up!", "Good Job!")

        val currentQuestionId = intent.getStringExtra("current_question_id") ?: "-1"
        val questionnaireType = intent.getStringExtra("question_type") ?: QuestionnaireType.SURVEY
        val adolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        val congratulatedFor = intent.getLongExtra("congratulated_for_session_number", -1L)
        val serialisedStack = intent.getStringExtra("serialisedStack") ?: ""
        val isFollowup = intent.getBooleanExtra("isFollowup", false)

        val message =
            intent.getStringExtra("message") ?: "You have successfully completed the session."

        binding.sessionMessage.text = message
        binding.congratulationLabel.text = superlatives[Random.nextInt(0, superlatives.size)]

        binding.continueButton.setOnClickListener {
            val intent = Intent(this@SessionEndActivity, MultipleQuestionnaireActivity::class.java)
            intent.putExtra("current_question_id", currentQuestionId)
            intent.putExtra("question_type", questionnaireType)
            intent.putExtra("congratulated_for_session_number", congratulatedFor)
            intent.putExtra("adolescent", adolescent)
            intent.putExtra("isFollowup", isFollowup)
            intent.putExtra("serialisedStack", serialisedStack)
            startActivity(intent)
            finish()
        }
    }

    private fun playSoundEffect() {
        mediaPlayer?.reset()
        val effects = listOf("congratulations.mp3", "effect1.mp3", "effect2.mp3")

        val descriptor = assets.openFd(effects[Random.nextInt(0, effects.size)])
        mediaPlayer?.setDataSource(
            descriptor.fileDescriptor,
            descriptor.startOffset,
            descriptor.length
        )
        descriptor.close()
        mediaPlayer?.setOnPreparedListener { mp: MediaPlayer ->
            mp.start()
        }
        mediaPlayer?.setVolume(0.7f, 0.7f);
        mediaPlayer?.prepareAsync()
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null
    }
}