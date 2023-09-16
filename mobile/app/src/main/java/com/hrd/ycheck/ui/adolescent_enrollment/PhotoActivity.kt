package com.hrd.ycheck.ui.adolescent_enrollment

import android.content.ContentValues
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityPhotoBinding
import com.hrd.ycheck.models.Adolescent
import java.io.File


class PhotoActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPhotoBinding
    private lateinit var viewModel: AdolescentActivityViewModel
    private val TAG = "SOMDFADFAD"
    private lateinit var cameraLauncher: ActivityResultLauncher<Intent>
    private var cameraUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPhotoBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "Update Photo"
        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        viewModel = ViewModelProvider(this)[AdolescentActivityViewModel::class.java]

        val adolescent = intent.getParcelableExtra<Adolescent>("adolescent")

        if (adolescent?.photoUrl?.isNotEmpty() == true) {
            val imageUrl = adolescent.photoUrl
            val options: RequestOptions =
                RequestOptions().fitCenter().placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
            Glide.with(this).load(imageUrl).apply(options)
                .diskCacheStrategy(DiskCacheStrategy.AUTOMATIC).into(binding.imageView)
        }

        cameraLauncher =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
                if (result.resultCode == RESULT_OK) {
                    // There are no request codes
                    binding.imageView.setImageURI(cameraUri)
                    binding.uploadButton.visibility = View.VISIBLE
                }
            }

        binding.openCameraButton.setOnClickListener {
            pickCamera()
        }

        binding.uploadButton.setOnClickListener {
            postImageToServer(adolescent, cameraUri)
        }

        viewModel.updatedAdolescent.observe(this) { adoles ->
            if (adoles != null) {
                val dialog =
                    AlertDialog.Builder(this).setTitle(getString(R.string.profile_complete))
                        .setCancelable(true)
                        .setNegativeButton(getString(R.string.no)) { _, _ ->
                            finish()
                        }.setPositiveButton(getString(R.string.yes)) { _, _ ->

                        }
                        .setMessage(
                            "Adolescent's profile setup is complete. Would you like to continue to the questionaire?"
                        )
                dialog.create()
                dialog.show()
            }
        }

        viewModel.isUploadingPhoto.observe(this) { uploading ->
            if (uploading) {
                binding.uploadButton.isEnabled = false
                binding.loginLoadingProcessBar.visibility = View.VISIBLE
            } else {
                binding.uploadButton.isEnabled = true
                binding.loginLoadingProcessBar.visibility = View.GONE
            }
        }
    }

    private fun pickCamera() {
        val values = ContentValues()
        values.put(MediaStore.Images.Media.TITLE, "New Picture")
        values.put(MediaStore.Images.Media.DESCRIPTION, "From Camera")
        cameraUri =
            this.contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values)

        val cameraIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri)
        cameraLauncher.launch(cameraIntent)
    }

    private fun postImageToServer(adolescent: Adolescent?, selectedImage: Uri?) {
        val filePath = getPath(selectedImage)
        val fileExtension = filePath?.substring(filePath.lastIndexOf(".") + 1)

        if (fileExtension == "img" || fileExtension == "jpg" || fileExtension == "jpeg" || fileExtension == "gif" || fileExtension == "png") {
            val file = File(filePath)
            viewModel.uploadAdolescentPhoto(adolescent?.uuid, file)
        } else {
            Toast.makeText(this@PhotoActivity, "Invalid image", Toast.LENGTH_LONG).show()
        }
    }


    private fun getPath(uri: Uri?): String? {
        Log.d(TAG, "getPath: $uri")

        val projection = arrayOf(MediaStore.MediaColumns.DATA)
        val cursor: Cursor = managedQuery(uri, projection, null, null, null)
        val column_index = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA)
        cursor.moveToFirst()
        val imagePath = cursor.getString(column_index)
        return cursor.getString(column_index)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}