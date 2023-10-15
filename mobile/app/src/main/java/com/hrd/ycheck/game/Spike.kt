package com.hrd.ycheck.game

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.hrd.ycheck.R
import kotlin.random.Random

class Spike(context: Context) {
    var spikeFrame = 0;
    var spikeX: Int = 0
    var spikeY: Int = 0
    var spikeVelocity: Int = 0

    val spikes: List<Bitmap> = listOf(
        BitmapFactory.decodeResource(context.resources, R.drawable.spike),
        BitmapFactory.decodeResource(context.resources, R.drawable.spike),
        BitmapFactory.decodeResource(context.resources, R.drawable.spike)
    )

    init {
        resetPosition()
    }

    fun getSpike(spikeFrame: Int): Bitmap {
        return spikes[spikeFrame]
    }

    fun resetPosition() {
        spikeX = Random.nextInt(0, GameView.width - getSpikeWidth())
        spikeY = -200 + Random.nextInt(0, 600) * -1
        spikeVelocity = 35 + Random.nextInt(0, 16)
    }

    fun getSpikeWidth(): Int {
        return spikes[0].width
    }

    fun getSpikeHeight(): Int {
        return spikes[0].height
    }
}