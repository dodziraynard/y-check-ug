package com.hrd.ycheck.ui.process_overview

import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.motion.widget.Debug
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.hrd.ycheck.BuildConfig
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityProcessOverviewBinding
import com.hrd.ycheck.models.Adolescent
import java.net.URL


class ProcessOverviewActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProcessOverviewBinding
    private var adolescent: Adolescent? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityProcessOverviewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        title = "Process Overview"

        // Show back button
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        adolescent = intent.getParcelableExtra("adolescent")

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                Log.d("HRDTEST", "onReceivedError: $error")
            }

            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url != null) {
                    view?.loadUrl(url)
                }
                return true
            }
        }
        binding.webView.settings.javaScriptEnabled = true
        binding.webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        binding.webView.settings.loadsImagesAutomatically = true
        binding.webView.webViewClient = webViewClient
        binding.webView.settings.domStorageEnabled = true

        val path = "/dashboard/patients/${adolescent?.pid}/review"
        val host = URL(if (BuildConfig.DEBUG) getString(R.string.test_frontend_url) else getString(R.string.live_frontend_url))
        val protocol = host.protocol
        val authority = host.authority
        val url = String.format("%s://%s%s", protocol, authority, path);

        binding.webView.loadUrl(url)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}