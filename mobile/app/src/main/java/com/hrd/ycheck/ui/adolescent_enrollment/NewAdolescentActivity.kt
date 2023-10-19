package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
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
import com.hrd.ycheck.ui.questionnaire.QuestionnaireActivity
import com.hrd.ycheck.utils.AdolescentTypes
import com.hrd.ycheck.utils.Genders
import com.hrd.ycheck.utils.VisitTypes
import java.util.*


class NewAdolescentActivity : AppCompatActivity() {
    private lateinit var binding: ActivityNewAdolescentBinding
    private lateinit var viewModel: AdolescentActivityViewModel
    private val TAG = "NewAdolescentActivity"
    private lateinit var adolescent: Adolescent

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNewAdolescentBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "New Adolescent"
        viewModel = ViewModelProvider(this)[AdolescentActivityViewModel::class.java]
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val postedAdolescent: Adolescent? = intent.getParcelableExtra("adolescent")
        if (postedAdolescent == null) {
            binding.editPhotoButton.visibility = View.GONE
            val uuid = UUID.randomUUID().toString()
            adolescent = Adolescent(
                "", "", "", 1694350811258, "", "", "", uuid = uuid
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
            // Choose to update profile photo screen
            Toast.makeText(this, "Adolescent added successfully.", Toast.LENGTH_LONG).show()
            val intent = Intent(this@NewAdolescentActivity, PhotoActivity::class.java)
            intent.putExtra("adolescent", adolescent)
            startActivity(intent)
            finish()
        }

        val dialog = AlertDialog.Builder(this).setMessage("Saving...").setCancelable(false).create()
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
            val locations = locs.map { it.name }
            // Update location spinner
            binding.checkupLocationSpinner.setSelection(locations.indexOf(adolescent.checkupLocation))

            val adapter: ArrayAdapter<*> = ArrayAdapter<Any?>(
                applicationContext, android.R.layout.simple_dropdown_item_1line, locations
            )
            binding.checkupLocationSpinner.adapter = adapter
            binding.checkupLocationSpinner.onItemSelectedListener =
                object : AdapterView.OnItemSelectedListener {
                    override fun onNothingSelected(parent: AdapterView<*>?) {
                    }

                    override fun onItemSelected(
                        parent: AdapterView<*>?, view: View?, position: Int, id: Long
                    ) {
                        adolescent.checkupLocation = locations[position]
                    }
                }
        }

        viewModel.locationLoadingErrorMessage.observe(this) { message ->
            if (message.isNotEmpty()) {
                binding.errorLoadingLocation.text = message
                binding.errorLoadingLocation.visibility = View.VISIBLE
            } else {
                binding.errorLoadingLocation.visibility = View.GONE
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


        binding.pidInput.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable) {}
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                adolescent.pid = s.toString()
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
                R.id.adolescent_type_primary -> {
                    adolescent.type = AdolescentTypes.PRIMARY
                    viewModel.getCheckupLocations("type:${AdolescentTypes.PRIMARY}")
                }
                R.id.adolescent_type_secondary -> {
                    adolescent.type = AdolescentTypes.SECONDARY
                    viewModel.getCheckupLocations("type:${AdolescentTypes.SECONDARY}")
                }
                R.id.adolescent_type_community -> {
                    adolescent.type = AdolescentTypes.COMMUNITY
                    viewModel.getCheckupLocations("type:${AdolescentTypes.COMMUNITY}")
                }
            }
        }

        binding.visitTypeGroup.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.visit_type_initial -> {
                    adolescent.visitType = VisitTypes.INITIAL
                }
                R.id.visit_type_follow_up -> {
                    adolescent.visitType = VisitTypes.FOLLOW_UP
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

        binding.dobPicker.setOnDateChangedListener { _, year, month, dayOfMonth ->
            val calendar = Calendar.getInstance()
            calendar.set(Calendar.YEAR, year)
            calendar.set(Calendar.MONTH, month)
            calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth)

            val age = ((System.currentTimeMillis() - calendar.timeInMillis) / 31556952000).toInt()
            if (age > 20 || age < 10) {
                binding.dobError.setTextColor(getColor(R.color.color_warning))
                binding.dobError.text = "$age-year-olds are not eligible for this exercise."
                binding.dobError.visibility = View.VISIBLE
            } else {
                binding.dobError.text = "$age-year-olds are eligible for this exercise."
                binding.dobError.setTextColor(getColor(R.color.color_success))
                binding.dobError.visibility = View.VISIBLE
                adolescent.dob = calendar.timeInMillis
            }
        }

        binding.saveButton.setOnClickListener {
            Log.d("DADFHJADF", "adolescent: $adolescent")
            if (validateForm(adolescent)) {
                viewModel.postAdolescent(adolescent)
            } else {
                Toast.makeText(this, "Please check form for errors.", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun populateFields(adolescent: Adolescent) {
        binding.pidLabel.text = adolescent.pid
        binding.surnameInput.setText(adolescent.surname)
        binding.pidInput.setText(adolescent.pid)
        binding.otherNamesInput.setText(adolescent.otherNames)
        viewModel.getCheckupLocations("type:${adolescent.type}")

        // Adolescent type
        when (adolescent.type.uppercase()) {
            "PRIMARY" -> binding.adolescentTypeGroup.check(R.id.adolescent_type_primary)
            "SECONDARY" -> binding.adolescentTypeGroup.check(R.id.adolescent_type_secondary)
            "COMMUNITY" -> binding.adolescentTypeGroup.check(R.id.adolescent_type_community)
        }

        // Type of visit
        when (adolescent.visitType.uppercase()) {
            "INITIAL" -> binding.visitTypeGroup.check(R.id.visit_type_initial)
            "FOLLOW-UP" -> binding.visitTypeGroup.check(R.id.visit_type_follow_up)
        }

        // Gender
        when (adolescent.gender.uppercase()) {
            "MALE" -> binding.sexGroup.check(R.id.sex_male)
            "FEMALE" -> binding.sexGroup.check(R.id.sex_female)
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
        // Surname
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
        if (adolescent.visitType.isEmpty()) {
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

        // Age
        val age = ((System.currentTimeMillis() - adolescent.dob) / 31556952000).toInt()
        return age in 10..19
    }


    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        if (adolescent.photoUrl?.isNotEmpty() == true && validateForm(adolescent)) {
            menuInflater.inflate(R.menu.new_adolescent_activity_menu, menu)
        }
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.action_questionnaire -> {
                val intent = Intent(this@NewAdolescentActivity, QuestionnaireActivity::class.java)
                intent.putExtra("adolescent", adolescent)
                startActivity(intent)
                finish()
            }
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}