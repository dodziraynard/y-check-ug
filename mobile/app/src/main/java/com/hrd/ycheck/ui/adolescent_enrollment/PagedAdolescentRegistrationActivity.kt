package com.hrd.ycheck.ui.adolescent_enrollment

import FormField
import JsonFileReader
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.ui.platform.ViewCompositionStrategy
import androidx.lifecycle.ViewModelProvider
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.hrd.ycheck.R
import com.hrd.ycheck.components.compose.ModelDataInputView
import com.hrd.ycheck.components.compose.YCheckTheme
import com.hrd.ycheck.databinding.ActivityPagedAdolescentRegistrationBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.utils.AdolescentTypes
import com.hrd.ycheck.utils.Functions.Companion.getAttr
import com.hrd.ycheck.utils.ModelDataInputValidatorFunctions.Companion.validateConsent
import com.hrd.ycheck.utils.ModelDataInputValidatorFunctions.Companion.validateDob
import com.hrd.ycheck.utils.ModelDataInputValidatorFunctions.Companion.validatePid
import java.util.UUID

class PagedAdolescentRegistrationActivity : AppCompatActivity() {
    private lateinit var adolescent: Adolescent
    private lateinit var binding: ActivityPagedAdolescentRegistrationBinding
    private var currentFieldIndex = 0
    private lateinit var formFieldsList: List<FormField>
    private lateinit var viewModel: AdolescentActivityViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPagedAdolescentRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        viewModel = ViewModelProvider(this)[AdolescentActivityViewModel::class.java]

        viewModel.updatedAdolescent.observe(this) { adolescent ->
            // Choose to update profile photo screen
            Toast.makeText(
                this,
                getString(R.string.adolescent_added_successfully), Toast.LENGTH_LONG
            ).show()
            val intent = Intent(this, PhotoActivity::class.java)
            intent.putExtra("adolescent", adolescent)
            startActivity(intent)
            finish()
        }

        val uuid = UUID.randomUUID().toString()
        val newAdolescent = Adolescent(
            "",
            "",
            "",
            1694350811258,
            "",
            null, "", "", "", "", "", "", "", uuid = uuid
        )
        adolescent = intent.getParcelableExtra("adolescent") ?: newAdolescent
        title = if (adolescent.pid.isEmpty()) "New Adolescent" else "Update Adolescent"

        // Read data from json file.
        val jsonReader = JsonFileReader(this)
        val jsonString = jsonReader.readJsonFile("adolescent_registration_data.json")

        val formFieldsType = object : TypeToken<List<FormField>>() {}.type
        formFieldsList = Gson().fromJson(jsonString, formFieldsType)

        renderFieldInput(formFieldsList[0], adolescent)

        binding.nextButton.setOnClickListener {
            handleOnSubmitInput(formFieldsList[currentFieldIndex], adolescent)
        }

        binding.previousButton.setOnClickListener {
            currentFieldIndex =
                if (currentFieldIndex > 0) currentFieldIndex - 1 else currentFieldIndex
            renderFieldInput(formFieldsList[currentFieldIndex], adolescent)

            binding.answeringProgress.progress =
                (currentFieldIndex.toFloat() / formFieldsList.size * 100).toInt()
        }
    }


    private fun handleOnSubmitInput(formField: FormField, adolescent: Adolescent): String? {
        var errorMessage: String? = null;

        // Ensure value is provided.
        val value = getAttr(adolescent, formField.field)
        if (formField.required && (value == null || value.toString().isEmpty())) errorMessage =
            "${formField.label} is required."
        else {
            when (formField.validator_function_name?.lowercase()) {
                "validate_pid" -> {
                    errorMessage = validatePid(adolescent)
                }

                "validate_dob" -> {
                    errorMessage = validateDob(adolescent)
                }

                "validate_consent" -> {
                    errorMessage = validateConsent(adolescent, this)
                }
            }
        }

        if (errorMessage != null) {
            // Render same field with error message.
            renderFieldInput(
                formFieldsList[currentFieldIndex], adolescent, errorMessage
            )
        } else {
            nextField(adolescent)
        }
        return null
    }

    private fun nextField(adolescent: Adolescent) {
        for (i in (currentFieldIndex + 1) until formFieldsList.size) {
            val formField: FormField = formFieldsList[i]

            // Treating all dependency conditions as AND.
            var allConditionsMet = formField.dependencies?.isEmpty() != false
            formField.dependencies?.let { dependencies ->
                for (dependency in dependencies) {
                    val trueValue = getAttr(adolescent, dependency.field)
                    allConditionsMet =
                        (trueValue.toString()
                            .lowercase() == dependency.value.lowercase() && dependency.reversed != true) || (trueValue.toString()
                            .lowercase() != dependency.value.lowercase() && dependency.reversed == true)
                    if (!allConditionsMet) break
                }
            }
            if (allConditionsMet) {
                currentFieldIndex = i
                break
            }
        }

        // Handle util function data source.
        when (formFieldsList[currentFieldIndex].data_source_util_function_name) {
            "get_adolescent_schools" -> {
                viewModel.getSchool(adolescent.type)
                viewModel.schools.observe(this) { schools ->

                }
            }

            "get_checkup_location" -> {
                viewModel.getCheckupLocations("type:${AdolescentTypes.BASIC}")

                viewModel.checkupLocations.observe(this) { locs ->
                    val locations = listOf("Choose location") + locs.map { it.name }
                }
            }
        }

        renderFieldInput(formFieldsList[currentFieldIndex], adolescent)
        val progress = (currentFieldIndex.toFloat() / formFieldsList.size * 100).toInt()
        binding.answeringProgress.progress = progress

    }

    private fun renderFieldInput(
        formData: FormField, adolescent: Adolescent? = null, errorMessage: String? = null
    ) {
        binding.questionnaireUi.apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
            setContent {
                YCheckTheme {
                    ModelDataInputView(
                        formData, adolescent, errorMessage
                    )
                }
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.page_adolescent_registration_activity_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        when (item.itemId) {
            R.id.action_single_view_registration -> {
                val intent = Intent(
                    this@PagedAdolescentRegistrationActivity, NewAdolescentActivity::class.java
                )
                intent.putExtra("adolescent", adolescent)
                startActivity(intent)
                finish()
            }
        }
        return super.onOptionsItemSelected(item)
    }
}