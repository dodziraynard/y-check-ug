package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityAdolescentIntroductionBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.questionnaire.QuestionnaireActivity
import com.hrd.ycheck.utils.QuestionnaireType

class AdolescentIntroductionActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAdolescentIntroductionBinding
    private var adolescent: Adolescent? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdolescentIntroductionBinding.inflate(layoutInflater)
        setContentView(binding.root)
        adolescent = intent.getParcelableExtra("adolescent")

        if (adolescent == null) {
            Toast.makeText(this, getString(R.string.no_adolescent_found), Toast.LENGTH_LONG).show()
            finish()
        }

        binding.helloText.text = getString(R.string.hello_person, adolescent!!.otherNames)
        binding.helloText.text = getString(R.string.hello_person, adolescent!!.otherNames)

        binding.continueButton.setOnClickListener {
            val intent = Intent(this, QuestionnaireActivity::class.java)
            intent.putExtra("question_type", QuestionnaireType.SURVEY_PRACTICE)
            intent.putExtra("adolescent", adolescent)
            startActivity(intent)
            finish()
        }
    }
}