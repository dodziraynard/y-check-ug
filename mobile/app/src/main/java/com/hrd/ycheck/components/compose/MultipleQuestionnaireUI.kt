package com.hrd.ycheck.components.compose


import android.util.Log
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.LinearProgressIndicator
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.dimensionResource
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
) {
    val configuration = LocalConfiguration.current
    val screenHeight = configuration.screenHeightDp
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
    ) {
        Text(
            text = "Section $currentSectionNumber of $totalSectionCount",
            color = colorResource(R.color.text_color),
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth()
        )
        LinearProgressIndicator(
            progress = (currentSectionNumber).toFloat() / totalSectionCount.toFloat(),
            color = accentAmber,
            modifier = Modifier
                .height(dimensionResource(id = R.dimen._5sdp))
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp)),
            backgroundColor = lightGrey
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
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

