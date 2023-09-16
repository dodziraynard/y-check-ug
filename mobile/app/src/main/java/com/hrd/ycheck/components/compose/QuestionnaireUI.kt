package com.hrd.ycheck.components.compose


import android.graphics.drawable.ColorDrawable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bumptech.glide.integration.compose.ExperimentalGlideComposeApi
import com.bumptech.glide.integration.compose.GlideImage
import com.bumptech.glide.integration.compose.placeholder
import com.hrd.ycheck.R
import com.hrd.ycheck.models.NewAdolescentResponse
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.QuestionType

@OptIn(ExperimentalGlideComposeApi::class)
@Preview(showBackground = true)
@Composable
fun QuestionnaireUI(
    questions: List<Question> = listOf(),
    responses: HashMap<Question, NewAdolescentResponse>? = null,
    onSubmit: () -> Unit = {},
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp
    val screenHeight = configuration.screenHeightDp
    val currentQuestionIndex = remember { mutableStateOf(0) }

    val answeredAllQuestions = questions.size - 1 <= responses?.size!!

    val currentQuestion: Question = questions[currentQuestionIndex.value]

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
    ) {
        Text(
            text = "Session ${currentQuestionIndex.value + 1}/${questions.size}",
            fontSize = 20.sp,
            color = colorResource(R.color.text_color),
            modifier = Modifier.fillMaxWidth(),
        )
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            LinearProgressIndicator(
                progress = (currentQuestionIndex.value + 1).toFloat() / questions.size.toFloat(),
                color = accentAmber,
                modifier = Modifier
                    .height(8.dp)
                    .clip(RoundedCornerShape(16.dp)),
                backgroundColor = lightGrey
            )
            if (answeredAllQuestions)
                Button(modifier = Modifier.padding(horizontal = 5.dp), onClick = onSubmit) {
                    Text(
                        text = stringResource(R.string.submit),
                        color = colorResource(R.color.text_color),
                        style = MaterialTheme.typography.body1.merge(),
                    )
                }
        }
        Column(
            modifier = Modifier
                .verticalScroll(rememberScrollState())
                .weight(weight = 1f, fill = false)
        ) {
            Text(
                text = currentQuestion.text,
                fontSize = 30.sp,
                color = colorResource(R.color.text_color),
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 10.dp),
                textAlign = TextAlign.Center
            )
            if (currentQuestion.imageUrl?.isNotEmpty() == true) {
                GlideImage(
                    model = currentQuestion.imageUrl,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height((screenHeight / 2).dp)
                        .padding(10.dp),
                    alignment = Alignment.Center,
                    failure = placeholder(ColorDrawable(R.drawable.placeholder)),
                    loading = placeholder(ColorDrawable(R.drawable.placeholder))
                )
            }
            if (currentQuestion.answerPreamble?.isNotEmpty() == true) {
                Text(
                    text = currentQuestion.answerPreamble,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 10.dp),
                    fontSize = 20.sp,
                    color = colorResource(R.color.text_color),
                    textAlign = TextAlign.Center
                )
            }
            when (currentQuestion.inputType) {
                QuestionType.TEXT_INPUT -> SimpleInputResponse(currentQuestion, responses)
                QuestionType.NUMBER_FIELD -> SingleSelectionResponse(currentQuestion, responses)
                QuestionType.CHECKBOXES -> MultiSelectionResponse(currentQuestion, responses)
            }
        }
        Row(
            horizontalArrangement = Arrangement.SpaceEvenly,
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .padding(vertical = 20.dp)
        ) {
            Button(enabled = currentQuestionIndex.value > 0, onClick = {
                currentQuestionIndex.value =
                    (currentQuestionIndex.value - 1).coerceIn(questions.indices)
            }) {
                Text(
                    text = stringResource(R.string.previous),
                    color = colorResource(R.color.text_color),
                    style = MaterialTheme.typography.body1.merge(),
                )
            }
            Button(enabled = currentQuestionIndex.value < questions.size - 1, onClick = {
                currentQuestionIndex.value =
                    (currentQuestionIndex.value + 1).coerceIn(questions.indices)
            }) {
                Text(
                    text = stringResource(R.string.next),
                    color = colorResource(R.color.text_color),
                    style = MaterialTheme.typography.body1.merge(),
                )
            }
        }
    }
}

@Composable
fun SimpleInputResponse(
    currentQuestion: Question, responses: HashMap<Question, NewAdolescentResponse>?
) {
    val currentResponse = responses?.let { it[currentQuestion] }
    val currentValue: String = currentResponse?.value ?: ""

    val textState = remember { mutableStateOf(TextFieldValue(currentValue)) }

    // Update responses
//    responses?.let {
//        it[currentQuestion] = NewAdolescentResponse(currentQuestion, textState.value.text)
//    }

    TextField(value = textState.value,
        modifier = Modifier.fillMaxWidth(),
        onValueChange = { textState.value = it })
}


@Composable
fun SingleSelectionResponse(
    currentQuestion: Question, responses: HashMap<Question, NewAdolescentResponse>?
) {
//    val currentResponse = responses?.let { it[currentQuestion] }
//    val currentValue = currentResponse?.options?.get(0)
//    val (selectedOption, onOptionSelected) = remember {
//        if (currentValue != null) mutableStateOf(currentValue) else mutableStateOf(
//            currentQuestion.options!![0]
//        )
//    }
//
//    // Update responses
//    responses?.let {
//        it[currentQuestion] = NewAdolescentResponse(
//            currentQuestion, options = mutableStateListOf(selectedOption)
//        )
//    }

    Column {
        currentQuestion.options?.forEach { option ->
//            Row(
//                verticalAlignment = Alignment.CenterVertically,
//                modifier = Modifier
//                    .fillMaxWidth()
//                    .selectable(selected = (option == selectedOption), onClick = {
//                        onOptionSelected(option)
//                    })
//            ) {
//                RadioButton(
//                    selected = (option == selectedOption),
//                    onClick = { onOptionSelected(option) })
//                Text(
//                    text = option.value,
//                    color = colorResource(R.color.text_color),
//                    style = MaterialTheme.typography.body1.merge(),
//                )
//            }
        }
    }
}

@Composable
fun MultiSelectionResponse(
    currentQuestion: Question, responses: HashMap<Question, NewAdolescentResponse>?
) {
//    val currentResponse = responses?.let { it[currentQuestion] }
//    val currentValue = currentResponse?.options ?: mutableListOf()
//    val selectedOptions = remember { currentValue.toMutableStateList() }

    // Update responses
//    responses?.let {
//        it[currentQuestion] = NewAdolescentResponse(
//            currentQuestion, options = selectedOptions
//        )
//    }

    Column {
        currentQuestion.options?.forEach { option ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
//                Checkbox(checked = option in selectedOptions, onCheckedChange = { isChecked ->
//                    if (isChecked) selectedOptions.add(option) else selectedOptions.remove(
//                        option
//                    )
//                })
                Text(option.value, color = colorResource(R.color.text_color))
            }
        }
    }
}
