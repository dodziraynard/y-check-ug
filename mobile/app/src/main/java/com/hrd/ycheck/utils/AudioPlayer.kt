package com.hrd.ycheck.utils

import android.media.AudioAttributes
import android.media.MediaPlayer
import android.util.Log
import java.io.IOException


class AudioPlayer {
    val TAG = "AudioPlayer"
    private var mediaPlayer: MediaPlayer? = MediaPlayer()

    fun playAudio(uri: String) {
        if (uri.startsWith("http")) {
            mediaPlayer?.setAudioAttributes(
                AudioAttributes
                    .Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build()
            )
        }
        if (mediaPlayer == null) {
            mediaPlayer = MediaPlayer()
        }
        try {
            mediaPlayer?.reset()
            mediaPlayer?.setDataSource(uri)
            mediaPlayer?.setOnPreparedListener { mp: MediaPlayer ->
                mp.start()
            }
            mediaPlayer?.prepareAsync()
        } catch (e: IOException) {
            Log.d(TAG, "AudioPlayer: Can't open file: $uri")
        }
    }

    fun release() {
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null
    }
}