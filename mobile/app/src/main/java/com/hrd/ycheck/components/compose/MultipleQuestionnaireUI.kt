package com.hrd.ycheck.components.compose


import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.LinearProgressIndicator
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.hrd.ycheck.R
import com.hrd.ycheck.models.NewAdolescentResponse
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.SubmittedAdolescentResponse
import com.hrd.ycheck.utils.AudioPlayer

@Composable
fun MultipleQuestionnaireUI(
    currentQuestions: List<Question>?,
    newResponses: MutableMap<String, NewAdolescentResponse>,
    submittedResponse: MutableMap<String, SubmittedAdolescentResponse>?,
    currentSectionNumber: Int = 1,
    totalSectionCount: Int = 8,
    audioPlayer: AudioPlayer? = null,
    showError: Boolean = true,
    pid: String = "",
    studyPhase: String = ""
) {
    val context = LocalContext.current
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
            .background(Color(255, 255, 255, 50))
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(
                text = "(${pid}) Section $currentSectionNumber of $totalSectionCount",
                color = colorResource(R.color.text_color),
                fontWeight = FontWeight.Bold,
            )
            Text(
                text = "   [${studyPhase.uppercase()}]",
                color = colorResource(R.color.secondary_200),
                fontWeight = FontWeight.Bold,
            )
        }
        LinearProgressIndicator(
            progress = (currentSectionNumber).toFloat() / totalSectionCount.toFloat(),
            color = accentAmber,
            modifier = Modifier
                .height(dimensionResource(id = R.dimen._5sdp))
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp)),
            backgroundColor = lightGrey
        )

        val state = remember(currentQuestions?.get(0)?.id ?: "0") {
            ScrollState(0)
        }
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(state)
        ) {
            currentQuestions?.map { question ->
                newResponses[question.id]?.let { newResponse ->
                    RenderQuestion(
                        question,
                        audioPlayer,
                        context,
                        question.relatedResponse,
                        submittedResponse?.get(question.id),
                        newResponse,
                        showError
                    )
                }
                Spacer(Modifier.height(30.dp))
            }
        }
    }
}
