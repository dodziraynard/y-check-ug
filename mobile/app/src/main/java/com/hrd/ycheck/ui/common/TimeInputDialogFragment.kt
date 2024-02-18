package com.hrd.ycheck.ui.common

import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.ViewModelProvider
import com.hrd.ycheck.databinding.FragmentTimeInputDialogBinding
import java.util.Calendar

class TimeInputDialogFragment(private val activityTag: String, private val adolescentId: String) :
    DialogFragment() {
    lateinit var binding: FragmentTimeInputDialogBinding
    private lateinit var viewModel: TimeInputFragmentViewModel
    private var listener: OnDismissListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        super.onCreateView(inflater, container, savedInstanceState)
        binding = FragmentTimeInputDialogBinding.inflate(inflater, container, false)
        viewModel = ViewModelProvider(this)[TimeInputFragmentViewModel::class.java]

        viewModel.isLoading.observe(this) { value ->
            if (value) {
                binding.saveButton.isEnabled = false
                binding.saveTimeLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.saveButton.isEnabled = true
                binding.saveTimeLoadingProcessBar.visibility = View.GONE
            }
        }

        viewModel.isSuccess.observe(this) { value ->
            if (value) {
                dismiss()
            }
        }

        viewModel.errorMessage.observe(this) { value ->
            if (value != null && value.isNotEmpty()) {
                binding.errorMessageLabel.visibility = View.VISIBLE
                binding.errorMessageLabel.text = value
            } else {
                binding.errorMessageLabel.visibility = View.GONE
            }
        }

        binding.saveButton.setOnClickListener {
            val hour = binding.timePicker.hour
            val minute = binding.timePicker.minute
            val calendar = Calendar.getInstance()
            calendar.set(Calendar.HOUR, hour)
            calendar.set(Calendar.MINUTE, minute)

            val timestamp = calendar.timeInMillis

            viewModel.postAdolescentActivityTime(
                adolescentId,
                activityTag,
                timestamp
            )
        }

        binding.cancelButton.setOnClickListener {
            dismiss()
        }

        return binding.root
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        listener?.dismissListener()
    }

    interface OnDismissListener {
        fun dismissListener()
    }

    fun setOnDismissListener(listener: OnDismissListener) {
        this.listener = listener
    }

}