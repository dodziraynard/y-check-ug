package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityNewAdolescentBinding
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.ui.common.TimeInputDialogFragment
import com.hrd.ycheck.utils.ActivityTags
import com.hrd.ycheck.utils.AdolescentTypes
import com.hrd.ycheck.utils.CheckUpReason
import com.hrd.ycheck.utils.Genders
import com.hrd.ycheck.utils.Grade
import com.hrd.ycheck.utils.IAFConsents
import com.hrd.ycheck.utils.LivesInCatchment
import com.hrd.ycheck.utils.ResidentialStatus
import com.hrd.ycheck.utils.StudyPhase
import java.util.Calendar
import java.util.UUID


class NewAdolescentActivity : AppCompatActivity() {
    private lateinit var binding: ActivityNewAdolescentBinding
    private lateinit var viewModel: AdolescentActivityViewModel
    private lateinit var adolescent: Adolescent
    private var pidPrefix: String = "YG-"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNewAdolescentBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = getString(R.string.new_adolescent)
        viewModel = ViewModelProvider(this)[AdolescentActivityViewModel::class.java]
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val postedAdolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        if (postedAdolescent == null) {
            binding.editPhotoButton.visibility = View.GONE
            val uuid = UUID.randomUUID().toString()
            adolescent = Adolescent(
                "",
                "",
                StudyPhase.IMPLEMENTATION,
                1694350811258,
                "",
                null,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                uuid = uuid
            )
        } else {
            adolescent = postedAdolescent
        }
        populateFields(adolescent)

        viewModel.postErrorMessage.observe(this) { message ->
            Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        }

        binding.editPhotoButton.setOnClickListener {
            val intent = Intent(this@NewAdolescentActivity, PhotoActivity::class.java)
            intent.putExtra("adolescent", adolescent)
            startActivity(intent)
            finish()
        }

        viewModel.updatedAdolescent.observe(this) { adolescent ->
            // Record time of registration.
            val dialogFragment =
                TimeInputDialogFragment(ActivityTags.ADOLESCENT_REGISTRATION_START, adolescent.id)
            dialogFragment.isCancelable = false
            dialogFragment.show(supportFragmentManager, "TimeInputDialogFragment")

            dialogFragment.setOnDismissListener(object : TimeInputDialogFragment.OnDismissListener {
                override fun dismissListener() {
                    // Choose to update profile photo screen
                    Toast.makeText(
                        this@NewAdolescentActivity,
                        getString(R.string.adolescent_added_successfully),
                        Toast.LENGTH_LONG
                    ).show()
                    val intent = Intent(this@NewAdolescentActivity, PhotoActivity::class.java)
                    intent.putExtra("adolescent", adolescent)
                    startActivity(intent)
                    this@NewAdolescentActivity.finish()
                }
            })
        }

        val dialog =
            AlertDialog.Builder(this).setMessage(getString(R.string.saving)).setCancelable(false)
                .create()
        viewModel.isLoadingAdolescent.observe(this) { value ->
            if (value) {
                binding.saveButton.isEnabled = false
                binding.submitAdolescentLoadingProcessBar.visibility = View.VISIBLE
                dialog.show()
            } else {
                binding.saveButton.isEnabled = true
                binding.submitAdolescentLoadingProcessBar.visibility = View.GONE
                dialog.dismiss()
            }
        }

        viewModel.checkupLocations.observe(this) { locs ->
            val locations = listOf(getString(R.string.choose_location)) + locs.map { it.name }
            val adapter: ArrayAdapter<*> = ArrayAdapter<Any?>(
                applicationContext, android.R.layout.simple_dropdown_item_1line, locations
            )
            binding.checkupLocationSpinner.adapter = adapter
            binding.checkupLocationSpinner.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onNothingSelected(parent: AdapterView<*>?) {}
                    override fun onItemSelected(
                        parent: AdapterView<*>?, view: View?, position: Int, id: Long
                    ) {
                        adolescent.checkupLocation = locations[position]
                        if (binding.schoolContainer.visibility == View.GONE) {
                            adolescent.school = locations[position]
                        }
                    }
                }

            // Update location spinner
            binding.checkupLocationSpinner.setSelection(locations.indexOf(adolescent.checkupLocation))
        }

        viewModel.schools.observe(this) { schools ->
            val allSchoolOptions: List<String> = listOf("Not a student") + schools

            val adapter: ArrayAdapter<*> = ArrayAdapter<Any?>(
                applicationContext, android.R.layout.simple_dropdown_item_1line, allSchoolOptions
            )
            binding.schoolSpinner.adapter = adapter
            binding.schoolSpinner.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onNothingSelected(parent: AdapterView<*>?) {}
                    override fun onItemSelected(
                        parent: AdapterView<*>?, view: View?, position: Int, id: Long
                    ) {
                        adolescent.school = allSchoolOptions[position]
                    }
                }
            // Update school spinner
            binding.schoolSpinner.setSelection(allSchoolOptions.indexOf(adolescent.school))
        }

        viewModel.locationLoadingErrorMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.errorLoadingLocation.text = message
                binding.errorLoadingLocation.visibility = View.VISIBLE
            } else {
                binding.errorLoadingLocation.visibility = View.GONE
            }
        }

        viewModel.schoolsErrorMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.errorLoadingSchool.text = message
                binding.errorLoadingSchool.visibility = View.VISIBLE
            } else {
                binding.errorLoadingSchool.visibility = View.GONE
            }
        }

        viewModel.isLoadingLocations.observe(this) { isLoading ->
            if (isLoading) {
                binding.locationLoadingProcessBar.visibility = View.VISIBLE
                binding.errorLoadingLocation.visibility = View.GONE
            } else {
                binding.locationLoadingProcessBar.visibility = View.GONE
            }
        }

        viewModel.isLoadingSchools.observe(this) { isLoading ->
            if (isLoading) {
                binding.schoolLoadingProcessBar.visibility = View.VISIBLE
                binding.errorLoadingSchool.visibility = View.GONE
            } else {
                binding.schoolLoadingProcessBar.visibility = View.GONE
            }
        }

        binding.pidInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable) {}
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                adolescent.pid = pidPrefix + s.toString()
            }
        })

        binding.ageInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable) {}
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                val age = if (count > 0) s.toString().toInt() else 0

                val calendar = Calendar.getInstance()
                calendar.add(Calendar.YEAR, -age)
                binding.dobPicker.updateDate(
                    calendar.get(Calendar.YEAR),
                    calendar.get(Calendar.MONTH),
                    calendar.get(Calendar.DAY_OF_MONTH)
                )
            }
        })

        binding.surnameInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable) {}
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                adolescent.surname = s.toString()
            }
        })

        binding.otherNamesInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable) {}
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                adolescent.otherNames = s.toString()
            }
        })

        binding.adolescentTypeGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.adolescent_type_basic -> {
                    pidPrefix = "YG1"
                    adolescent.type = AdolescentTypes.BASIC
                    viewModel.getCheckupLocations("type:${AdolescentTypes.BASIC}")
                    binding.residentialStatusContainer.visibility = View.GONE
                    binding.livesInCatchmentContainer.visibility = View.GONE
                    binding.schoolContainer.visibility = View.GONE
                    binding.gradeContainer.visibility = View.VISIBLE
                    binding.checkUpLocationContainer.visibility = View.VISIBLE
                    viewModel.getSchool(adolescent.type)
                }

                R.id.adolescent_type_secondary -> {
                    pidPrefix = "YG2"

                    adolescent.type = AdolescentTypes.SECONDARY
                    viewModel.getCheckupLocations("type:${AdolescentTypes.SECONDARY}")
                    binding.residentialStatusContainer.visibility = View.VISIBLE
                    binding.livesInCatchmentContainer.visibility = View.GONE
                    binding.schoolContainer.visibility = View.GONE
                    binding.gradeContainer.visibility = View.VISIBLE
                    binding.checkUpLocationContainer.visibility = View.VISIBLE
                    viewModel.getSchool(adolescent.type)
                }

                R.id.adolescent_type_community -> {
                    pidPrefix = "YG3"

                    adolescent.type = AdolescentTypes.COMMUNITY
                    viewModel.getCheckupLocations("type:${AdolescentTypes.COMMUNITY}")
                    binding.residentialStatusContainer.visibility = View.GONE
                    binding.livesInCatchmentContainer.visibility = View.VISIBLE
                    binding.schoolContainer.visibility = View.VISIBLE
                    binding.gradeContainer.visibility = View.GONE
                    binding.checkUpLocationContainer.visibility = View.VISIBLE
                }
            }
            adolescent.pid = pidPrefix + binding.pidInput.text.toString()
            binding.idPrefix.text = pidPrefix

        }

        binding.studyPhaseGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.study_phase_pilot -> {
                    adolescent.studyPhase = StudyPhase.PILOT
                }

                R.id.study_phase_implementation -> {
                    adolescent.studyPhase = StudyPhase.IMPLEMENTATION
                }
            }
        }

        binding.sexGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.sex_male -> {
                    adolescent.gender = Genders.MALE
                }

                R.id.sex_female -> {
                    adolescent.gender = Genders.FEMALE
                }
            }
        }

        binding.livesInCatchmentGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.lives_in_catchment_yes -> {
                    adolescent.livesInCatchment = LivesInCatchment.YES
                }

                R.id.lives_in_catchment_no -> {
                    adolescent.livesInCatchment = LivesInCatchment.NO
                }
            }
        }

        binding.icfConfGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.icf_conf_adolescent -> {
                    adolescent.consent = IAFConsents.ADOLESCENT
                }

                R.id.icf_conf_parent -> {
                    adolescent.consent = IAFConsents.PARENT
                }

                R.id.icf_conf_adolescent_parent -> {
                    adolescent.consent = IAFConsents.ADOLESCENT_PARENT
                }

                R.id.icf_conf_no -> {
                    adolescent.consent = IAFConsents.NO
                }
            }
        }

        binding.residentialStatusGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.residential_status_day -> {
                    adolescent.residentialStatus = ResidentialStatus.DAY
                }

                R.id.residential_status_boarding -> {
                    adolescent.residentialStatus = ResidentialStatus.BOARDING
                }
            }
        }

        binding.gradeGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.grade_1 -> {
                    adolescent.grade = Grade.YEAR_ONE
                }

                R.id.grade_2 -> {
                    adolescent.grade = Grade.YEAR_TWO
                }
            }
        }

        binding.checkUpReasonGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.check_up_reason_services_research -> {
                    adolescent.checkupReason = CheckUpReason.Y_CHECK_SERVICES_AND_RESEARCH
                }

                R.id.check_up_reason_services_only -> {
                    adolescent.checkupReason = CheckUpReason.Y_CHECK_SERVICES_ONLY
                }
            }
        }

        binding.dobPicker.setOnDateChangedListener { _, year, month, dayOfMonth ->
            val calendar = Calendar.getInstance()
            calendar.set(Calendar.YEAR, year)
            calendar.set(Calendar.MONTH, month)
            calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth)

            val age = ((System.currentTimeMillis() - calendar.timeInMillis) / 31556952000).toInt()
            binding.ageInput.hint = age.toString()

            var minAge = 0
            var maxAge = 0

            when (adolescent.type.lowercase()) {
                AdolescentTypes.BASIC.lowercase() -> {
                    minAge = 10
                    maxAge = 14
                }

                AdolescentTypes.SECONDARY.lowercase() -> {
                    minAge = 15
                    maxAge = 17
                }

                AdolescentTypes.COMMUNITY.lowercase() -> {
                    minAge = 15
                    maxAge = 19
                }
            }

            if (age > maxAge || age < minAge) {
                binding.dobError.setTextColor(getColor(R.color.color_warning))
                binding.dobError.text =
                    getString(
                        R.string.year_old_adolescents_are_not_eligible_for_this_exercise,
                        age,
                        adolescent.type
                    )
                binding.dobError.visibility = View.VISIBLE
            } else {
                binding.dobError.text =
                    getString(R.string.year_olds_are_eligible_for_this_exercise, age)
                binding.dobError.setTextColor(getColor(R.color.color_success))
                binding.dobError.visibility = View.VISIBLE
                adolescent.dob = calendar.timeInMillis
            }
        }

        binding.saveButton.setOnClickListener {
            if (validateForm(adolescent)) {
                viewModel.postAdolescent(adolescent)
            } else {
                Toast.makeText(
                    this, getString(R.string.please_check_form_for_errors), Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    private fun populateFields(adolescent: Adolescent) {
        if (adolescent.pid.isNotEmpty()) {
            binding.idPrefix.text = adolescent.pid.substring(0, 3)
            binding.pidLabel.text = adolescent.pid
            binding.pidInput.setText(adolescent.pid.substring(3))
        }
        binding.surnameInput.setText(adolescent.surname)
        binding.otherNamesInput.setText(adolescent.otherNames)
        viewModel.getCheckupLocations("type:${adolescent.type}")
        viewModel.getSchool(adolescent.type)

        // Adolescent type
        when (adolescent.type.uppercase()) {
            AdolescentTypes.BASIC.uppercase() -> binding.adolescentTypeGroup.check(R.id.adolescent_type_basic)
            AdolescentTypes.SECONDARY.uppercase() -> binding.adolescentTypeGroup.check(R.id.adolescent_type_secondary)
            AdolescentTypes.COMMUNITY.uppercase() -> binding.adolescentTypeGroup.check(R.id.adolescent_type_community)
        }

        // Study phase
        when (adolescent.studyPhase.uppercase()) {
            StudyPhase.PILOT.uppercase() -> binding.studyPhaseGroup.check(R.id.study_phase_pilot)
            StudyPhase.IMPLEMENTATION.uppercase() -> binding.studyPhaseGroup.check(R.id.study_phase_implementation)
        }

        // Check-up reason
        when (adolescent.checkupReason?.uppercase()) {
            CheckUpReason.Y_CHECK_SERVICES_AND_RESEARCH.uppercase() -> binding.checkUpReasonGroup.check(
                R.id.check_up_reason_services_research
            )

            CheckUpReason.Y_CHECK_SERVICES_ONLY.uppercase() -> binding.checkUpReasonGroup.check(R.id.check_up_reason_services_only)
        }

        // Gender
        when (adolescent.gender.uppercase()) {
            Genders.MALE.uppercase() -> binding.sexGroup.check(R.id.sex_male)
            Genders.FEMALE.uppercase() -> binding.sexGroup.check(R.id.sex_female)
        }

        // Residential status
        when (adolescent.residentialStatus?.uppercase()) {
            ResidentialStatus.DAY.uppercase() -> binding.residentialStatusGroup.check(R.id.residential_status_day)
            ResidentialStatus.BOARDING.uppercase() -> binding.residentialStatusGroup.check(R.id.residential_status_boarding)
        }

        // Grade
        when (adolescent.grade?.uppercase()) {
            Grade.YEAR_ONE.uppercase() -> binding.gradeGroup.check(R.id.grade_1)
            Grade.YEAR_TWO.uppercase() -> binding.gradeGroup.check(R.id.grade_2)
        }

        // Leaves in catchment
        when (adolescent.livesInCatchment?.uppercase()) {
            LivesInCatchment.YES.uppercase() -> binding.livesInCatchmentGroup.check(R.id.lives_in_catchment_yes)
            LivesInCatchment.NO.uppercase() -> binding.livesInCatchmentGroup.check(R.id.lives_in_catchment_no)
        }

        // Consent
        when (adolescent.consent?.uppercase()) {
            IAFConsents.PARENT.uppercase() -> binding.icfConfGroup.check(R.id.icf_conf_parent)
            IAFConsents.ADOLESCENT_PARENT.uppercase() -> binding.icfConfGroup.check(R.id.icf_conf_adolescent_parent)
            IAFConsents.ADOLESCENT.uppercase() -> binding.icfConfGroup.check(R.id.icf_conf_adolescent)
            IAFConsents.NO.uppercase() -> binding.icfConfGroup.check(R.id.icf_conf_no)
        }

        // DoB
        val calendar: Calendar = Calendar.getInstance()
        calendar.timeInMillis = adolescent.dob
        binding.dobPicker.updateDate(
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )

        if (adolescent.photoUrl?.isNotEmpty() == true) {
            val imageUrl = adolescent.photoUrl
            val options: RequestOptions =
                RequestOptions().fitCenter().placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
            Glide.with(this).load(imageUrl).apply(options)
                .diskCacheStrategy(DiskCacheStrategy.AUTOMATIC).into(binding.imageView)
        }
    }

    private fun validateForm(adolescent: Adolescent): Boolean {
        val age = ((System.currentTimeMillis() - adolescent.dob) / 31556952000).toInt()

        // PID
        if (adolescent.pid.isEmpty()) {
            binding.pidErrorMessage.visibility = View.VISIBLE
            return false
        } else {
            binding.pidErrorMessage.visibility = View.GONE
        }

        // Surname
        if (adolescent.surname.isEmpty()) {
            binding.surnameErrorMessage.visibility = View.VISIBLE
            return false
        } else {
            binding.surnameErrorMessage.visibility = View.GONE
        }

        // Other names
        if (adolescent.otherNames.isEmpty()) {
            binding.otherNamesErrorMessage.visibility = View.VISIBLE
            return false
        } else {
            binding.otherNamesErrorMessage.visibility = View.GONE
        }

        // Adolescent types
        if (adolescent.type.isEmpty()) {
            binding.adolescentTypeErrorMessageLabel.visibility = View.VISIBLE
            return false
        } else {
            binding.adolescentTypeErrorMessageLabel.visibility = View.GONE
        }

        // Visit type
        if (adolescent.studyPhase.isEmpty()) {
            binding.visitTypeErrorMessageLabel.visibility = View.VISIBLE
            return false
        } else {
            binding.visitTypeErrorMessageLabel.visibility = View.GONE
        }

        // Gender
        if (adolescent.gender.isEmpty()) {
            binding.sexErrorMessageLabel.visibility = View.VISIBLE
            return false
        } else {
            binding.sexErrorMessageLabel.visibility = View.GONE
        }

        // Checkup location
        if (adolescent.checkupLocation.isEmpty()) {
            binding.checkupLocationErrorMessageLabel.visibility = View.VISIBLE
            return false
        } else {
            binding.checkupLocationErrorMessageLabel.visibility = View.GONE
        }

        // Consent location
        val consents =
            listOf(IAFConsents.ADOLESCENT, IAFConsents.PARENT, IAFConsents.ADOLESCENT_PARENT)

        if (!((consents.contains(adolescent.consent) && age >= 18) || (adolescent.consent == IAFConsents.ADOLESCENT_PARENT && age < 18))) {
            binding.icfConfErrorMessageLabel.visibility = View.VISIBLE
            if (age < 18) {
                binding.icfConfErrorMessageLabel.text =
                    getString(R.string.parental_adolescent_assent_error_message)
            }
            return false
        } else {
            binding.icfConfErrorMessageLabel.visibility = View.GONE
        }

        // Age
        return age in 10..19
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.new_adolescent_activity_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        when (item.itemId) {
            R.id.action_page_registration -> {
                val intent = Intent(
                    this@NewAdolescentActivity, PagedAdolescentRegistrationActivity::class.java
                )
                intent.putExtra("adolescent", adolescent)
                startActivity(intent)
                finish()
            }
        }
        return super.onOptionsItemSelected(item)
    }
}