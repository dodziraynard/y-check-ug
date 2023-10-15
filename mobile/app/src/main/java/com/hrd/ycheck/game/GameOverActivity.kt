package com.hrd.ycheck.game

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.hrd.ycheck.databinding.ActivityGameOverBinding

class GameOverActivity : AppCompatActivity() {
    private lateinit var binding: ActivityGameOverBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGameOverBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val points = intent.getIntExtra("points", 0)
        binding.pointLabel.text = "$points"

        binding.restartButton.setOnClickListener {
            restartGame()
        }
        binding.exitButton.setOnClickListener {
            exitGame()
        }
    }

    private fun restartGame() {
        val intent = Intent(this, GameActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun exitGame() {
        finish()
    }
}