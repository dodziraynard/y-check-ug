package com.hrd.ycheck.game

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.*
import android.os.Handler
import android.view.Display
import android.view.MotionEvent
import android.view.View
import com.hrd.ycheck.R

class GameView(context: Context) : View(context) {
    companion object {
        var width: Int = 0
        var height = 0;

    }

    private var updateMills = 100L
    private var acceleration = 1F
    private val textPaint = Paint()
    private val healthPaint = Paint()
    private val textSize = 120;
    private var rabbitX = 0F;
    private var rabbitY = 0F;
    private var oldRabbitX = 0F;
    private var oldX = 0F;

    private var rectBackground: Rect
    private var rectGround: Rect
    private var gameUpdateHandler: Handler
    private var runnable: Runnable

    private val background = BitmapFactory.decodeResource(context.resources, R.drawable.background)
    private val ground = BitmapFactory.decodeResource(context.resources, R.drawable.ground)
    private val rabbit = BitmapFactory.decodeResource(context.resources, R.drawable.rabbit)

    private val spikes: ArrayList<Spike> = arrayListOf()
    private val explosions: ArrayList<Explosion> = arrayListOf()
    private val intent = Intent(context, GameOverActivity::class.java)

    private var life = 3;
    private var points = 0;

    init {
        val point = Point()
        val gameDisplay: Display? = (getContext() as Activity).windowManager.defaultDisplay
        gameDisplay?.getSize(point)
        GameView.width = point.x
        GameView.height = point.y
        rectBackground = Rect(0, 0, GameView.width, GameView.height)
        rectGround = Rect(0, GameView.height - ground.height, GameView.width, GameView.height)

        gameUpdateHandler = Handler()
        runnable = Runnable {
            invalidate()
        }
        textPaint.color = Color.rgb(250, 168, 0)
        textPaint.textSize = textSize.toFloat();
        textPaint.textAlign = Paint.Align.LEFT
        textPaint.typeface = resources.getFont(R.font.kenpixel_blocks)

        healthPaint.color = Color.GREEN
        rabbitX = GameView.width / 2F - rabbit.width / 2F
        rabbitY = (GameView.height - ground.height - rabbit.height).toFloat()

        for (i in 0..3) {
            spikes.add(Spike(context))
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawBitmap(background, null, rectBackground, null)
        canvas.drawBitmap(ground, null, rectGround, null)
        canvas.drawBitmap(rabbit, rabbitX, rabbitY, null)

        for (i in 0 until spikes.size) {
            val spike = spikes[i]
            canvas.drawBitmap(
                spike.getSpike(spike.spikeFrame),
                spike.spikeX.toFloat(),
                spike.spikeY.toFloat(),
                null
            )

            spike.spikeFrame++
            if (spike.spikeFrame > 2) {
                spike.spikeFrame = 0
            }

            spike.spikeY += spike.spikeVelocity

            if (spike.spikeY + spike.getSpikeHeight() >= GameView.height - ground.height) {
                points += 10
                val explosion = Explosion(context)
                explosion.explosionX = spike.spikeX.toFloat()
                explosion.explosionY = spike.spikeY.toFloat()

                explosions.add(explosion)
                spike.resetPosition()
            }
        }

        for (i in 0 until spikes.size) {
            val spike = spikes[i]

            if (spike.spikeX + spike.getSpikeWidth() > rabbitX && spike.spikeX < rabbitX + rabbit.width && spike.spikeY + spike.getSpikeWidth() >= rabbitY && spike.spikeY + spike.getSpikeWidth() <= rabbitY + rabbit.height) {
                life--
                spike.resetPosition()
                if (left == 0) {
                    intent.putExtra("points", points)
                    context.startActivity(intent)
                    (context as Activity).finish()
                }
            }
        }

        for (i in 0 until explosions.size) {
            if (i >= explosions.size) continue

            val explosion = explosions[i]
            canvas.drawBitmap(
                explosion.getExplosion(explosion.explosionFrame),
                explosion.explosionX,
                explosion.explosionY,
                null
            )
            explosion.explosionFrame++
            if (explosion.explosionFrame > 3) {
                explosions.remove(explosion)
            }
        }

        if (life == 2) {
            healthPaint.color = Color.YELLOW
        } else if (life == 1) {
            healthPaint.color = Color.RED
        }
        canvas.drawRect(
            (GameView.width - 200).toFloat(),
            30F,
            (GameView.width - 200 + 60 * life).toFloat(),
            80F,
            healthPaint
        )
        canvas.drawText("$points", 20F, textSize.toFloat(), textPaint)
        updateMills = (updateMills * acceleration).toLong()
        gameUpdateHandler.postDelayed(runnable, updateMills)
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        if (event != null) {
            val touchX = event.x
            val touchY = event.y

            if (touchY >= rabbitY) {
                val action = event.action
                if (action == MotionEvent.ACTION_DOWN) {
                    oldX = event.x
                    oldRabbitX = rabbitX
                }

                if (action == MotionEvent.ACTION_MOVE) {
                    val shift = oldX - touchX
                    val newRabbitX = oldRabbitX - shift

                    rabbitX = if (newRabbitX < 0) {
                        0F
                    } else if (newRabbitX > GameView.width - rabbit.width) {
                        (GameView.width - rabbit.width).toFloat()
                    } else {
                        newRabbitX
                    }

                }
            }
        }
        return true;
    }
}