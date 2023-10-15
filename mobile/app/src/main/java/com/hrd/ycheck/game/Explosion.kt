package com.hrd.ycheck.game

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.hrd.ycheck.R

class Explosion(context: Context) {
    var explosionFrame = 0;
    var explosionX: Float = 0f
    var explosionY: Float = 0f

    val explosion: List<Bitmap> = listOf(
        BitmapFactory.decodeResource(context.resources, R.drawable.explode),
        BitmapFactory.decodeResource(context.resources, R.drawable.explode),
        BitmapFactory.decodeResource(context.resources, R.drawable.explode),
        BitmapFactory.decodeResource(context.resources, R.drawable.explode)
    )

    fun getExplosion(explosionFrame: Int): Bitmap {
        return explosion[explosionFrame]
    }
}