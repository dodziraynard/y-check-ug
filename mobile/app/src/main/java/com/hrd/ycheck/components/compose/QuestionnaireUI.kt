package com.hrd.ycheck.components.compose


import android.graphics.drawable.ColorDrawable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bumptech.glide.integration.compose.ExperimentalGlideComposeApi
import com.bumptech.glide.integration.compose.GlideImage
import com.bumptech.glide.integration.compose.placeholder
import com.hrd.ycheck.R
import com.hrd.ycheck.models.*

@OptIn(ExperimentalGlideComposeApi::class)
@Composable
fun QuestionnaireUI(
    currentQuestion: Question,
    newResponse: NewAdolescentResponse,
    submittedResponse: SubmittedAdolescentResponse? = null,
    currentSectionNumber: Int = 1,
    totalSectionCount: Int = 8,
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp
    val screenHeight = configuration.screenHeightDp

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
    ) {
        Text(
            text = "Session $currentSectionNumber/$totalSectionCount",
            fontSize = 20.sp,
            color = colorResource(R.color.text_color),
            modifier = Modifier.fillMaxWidth(),
        )

        LinearProgressIndicator(
            progress = (currentSectionNumber).toFloat() / totalSectionCount.toFloat(),
            color = accentAmber,
            modifier = Modifier
                .height(8.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp)),
            backgroundColor = lightGrey
        )
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
                QuestionType.TEXT_INPUT -> SimpleInputResponse(
                    submittedResponse, newResponse
                )
                QuestionType.NUMBER_FIELD -> SimpleInputResponse(
                    submittedResponse, newResponse, isNumber = true
                )
                QuestionType.CHECKBOXES -> currentQuestion.options?.let {
                    MultiSelectionResponse(
                        submittedResponse, it, newResponse
                    )
                }
                QuestionType.RADIO_BUTTON -> currentQuestion.options?.let {
                    SingleSelectionResponse(
                        submittedResponse, it, newResponse
                    )
                }
                QuestionType.RANGE_SLIDER -> currentQuestion.minNumericValue?.let {
                    currentQuestion.maxNumericValue?.let { it1 ->
                        RangeSliderSelectionResponse(
                            submittedResponse, newResponse, it, it1
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SimpleInputResponse(
    currentResponse: SubmittedAdolescentResponse?,
    newResponse: NewAdolescentResponse,
    isNumber: Boolean = false
) {
    val currentValue: String = currentResponse?.value ?: ""
    val textState = remember { mutableStateOf(TextFieldValue(currentValue)) }

    // Update response
    newResponse.value = textState.value.text

    TextField(value = textState.value,
        modifier = Modifier.fillMaxWidth(),
        keyboardOptions = KeyboardOptions(keyboardType = if (isNumber) KeyboardType.Number else KeyboardType.Text),
        onValueChange = { textState.value = it })
}


@Composable
fun SingleSelectionResponse(
    currentResponse: SubmittedAdolescentResponse?,
    options: List<Option>,
    newResponse: NewAdolescentResponse
) {
    val chosenOptions = currentResponse?.chosenOptions
    val currentValue = if ((chosenOptions?.size ?: 0) > 0) chosenOptions?.get(0) else null

    val (selectedOption, onOptionSelected) = remember(currentValue) {
        mutableStateOf(currentValue)
    }
    // Update response
    newResponse.chosenOptions = listOf(selectedOption)

    Column {
        options.forEach { option ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .selectable(selected = (option.value == selectedOption?.value), onClick = {
                        onOptionSelected(option)
                    })
            ) {
                RadioButton(selected = (option.value == selectedOption?.value),
                    onClick = {
                        onOptionSelected(option)
                    })
                Text(
                    text = option.value,
                    color = colorResource(R.color.text_color),
                    style = MaterialTheme.typography.body1.merge(),
                )
            }
        }
    }
}

@Composable
fun MultiSelectionResponse(
    currentResponse: SubmittedAdolescentResponse?,
    options: List<Option>,
    newResponse: NewAdolescentResponse
) {
    val currentValue = currentResponse?.chosenOptions ?: mutableListOf()
    val selectedOptions = remember(currentValue) { currentValue.toMutableStateList() }

    // Update responses
    newResponse.chosenOptions = selectedOptions.toList()

    Column {
        options.forEach { option ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Checkbox(checked = option.value in selectedOptions.map { opt -> opt.value },
                    onCheckedChange = { isChecked ->
                        if (isChecked) selectedOptions.add(option) else selectedOptions.remove(
                            option
                        )
                    })
                Text(option.value, color = colorResource(R.color.text_color))
            }
        }
    }
}


@Composable
fun RangeSliderSelectionResponse(
    currentResponse: SubmittedAdolescentResponse?,
    newResponse: NewAdolescentResponse,
    minValue: Int = 0,
    maxValue: Int = 10
) {
    val currentValue: Float = (currentResponse?.value?.toInt() ?: minValue).toFloat()

    var sliderPosition by remember { mutableFloatStateOf(currentValue) }

    // Update response
    newResponse.value = sliderPosition.toInt().toString()

    Column {
        Slider(value = sliderPosition,
            steps = 1,
            valueRange = (minValue.toFloat())..(maxValue.toFloat()),
            onValueChange = { sliderPosition = it })
        Text(text = sliderPosition.toString())
    }

}
