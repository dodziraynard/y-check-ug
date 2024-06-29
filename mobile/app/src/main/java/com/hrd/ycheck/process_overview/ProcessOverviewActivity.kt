package com.hrd.ycheck.process_overview

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
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.hrd.ycheck.BuildConfig
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ActivityProcessOverviewBinding
import com.hrd.ycheck.models.Adolescent

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
            //            override fun onPageFinished(view: WebView?, url: String?) {
//                binding.progressBar.visibility = WebView.GONE
//            }
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

//            override fun shouldInterceptRequest(
//                view: WebView?,
//                url: String?
//            ): WebResourceResponse? {
//                return try {
//                    val headerInterceptor = WebViewHeaderInterceptor()
//                    val client: OkHttpClient = OkHttpClient().newBuilder()
//                        .addInterceptor(headerInterceptor)
//                        .build()
//
//                    val request: Request =
//                        Request.Builder().url(url ?: "https://ycheckgh.com").build()
//                    val response = client.newCall(request).execute()
//
//                    val contentType = response.body()?.contentType().toString()
//                    val encoding = "utf-8"
//                    val responseInputStream: InputStream? = response.body()?.byteStream()
//
////                  val client = DefaultHttpClient()
////                  val httpGet = HttpGet(url)
////                  httpGet.setHeader("MY-CUSTOM-HEADER", "header value")
////                  httpGet.setHeader("User-Agent", "custom user-agent")
////                  val httpResponse = client.execute(httpGet)
////                  val contentType = httpResponse.entity.contentType?.value
////                  val encoding = httpResponse.entity.contentEncoding?.value
////                  val responseInputStream: InputStream = httpResponse.entity.content
//
//                    WebResourceResponse(contentType, encoding, responseInputStream)
//                } catch (e: IOException) {
//                    // Return null to indicate to WebView to retry the request
//                    null
//                }
//            }
        }
        binding.webView.settings.javaScriptEnabled = true
        binding.webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        binding.webView.settings.loadsImagesAutomatically = true
        binding.webView.webViewClient = webViewClient
        binding.webView.settings.domStorageEnabled = true
        var url = getString(R.string.test_base_api_url)
        if (!BuildConfig.DEBUG) {
            url = getString(R.string.live_base_api_url)
        }
        url = url.replace("api/", "")
        binding.webView.loadUrl("https://ycheckgh.com")
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()
        }
        return super.onOptionsItemSelected(item)
    }
}