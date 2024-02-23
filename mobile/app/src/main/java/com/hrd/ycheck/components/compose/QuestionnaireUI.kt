package com.hrd.ycheck.components.compose


import android.content.Context
import android.content.Intent
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.requiredSize
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Checkbox
import androidx.compose.material.Divider
import androidx.compose.material.IconButton
import androidx.compose.material.LinearProgressIndicator
import androidx.compose.material.MaterialTheme
import androidx.compose.material.RadioButton
import androidx.compose.material.Slider
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.material.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.toMutableStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
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
import com.hrd.ycheck.models.InputType
import com.hrd.ycheck.models.NewAdolescentResponse
import com.hrd.ycheck.models.Option
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.RelatedResponse
import com.hrd.ycheck.models.SubmittedAdolescentResponse
import com.hrd.ycheck.utils.AudioPlayer


@Composable
fun QuestionnaireUI(
    currentQuestion: Question,
    newResponse: NewAdolescentResponse,
    submittedResponse: SubmittedAdolescentResponse? = null,
    currentSectionNumber: Int = 1,
    totalSectionCount: Int = 8,
    audioPlayer: AudioPlayer? = null
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

        RenderQuestion(
            currentQuestion,
            audioPlayer,
            context,
            currentQuestion.relatedResponse,
            submittedResponse,
            newResponse
        )
    }
}

@Composable
@OptIn(ExperimentalGlideComposeApi::class)
private fun RenderQuestion(
    currentQuestion: Question,
    audioPlayer: AudioPlayer?,
    context: Context,
    relatedResponse: RelatedResponse?,
    submittedResponse: SubmittedAdolescentResponse?,
    newResponse: NewAdolescentResponse
) {
    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
            .fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .padding(vertical = dimensionResource(id = R.dimen._5sdp).value.dp)
        ) {
            Row(
                modifier = Modifier
                    .background(colorResource(R.color.color_500))
                    .padding(
                        all = dimensionResource(id = R.dimen._2sdp).value.dp
                    )
                    .fillMaxWidth()
            ) {
                Text(
                    text = currentQuestion.questionID!!,
                    color = colorResource(R.color.white),
                )
            }
            Text(
                text = currentQuestion.text,
                fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                color = colorResource(R.color.text_color),
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Justify,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colorResource(R.color.white))
                    .padding(
                        vertical = dimensionResource(id = R.dimen._5sdp).value.dp,
                        horizontal = dimensionResource(id = R.dimen._5sdp).value.dp
                    )
            )
            Row(modifier = Modifier.align(Alignment.End)) {
                if (currentQuestion.audioUrl?.isNotEmpty() == true) IconButton(
                    onClick = {
                        audioPlayer?.playAudio(currentQuestion.audioUrl)
                    },
                    modifier = Modifier
                        .background(colorResource(R.color.white))
                        .padding(all = dimensionResource(id = R.dimen._10sdp).value.dp),
                ) {
                    Image(
                        painterResource(R.drawable.outline_volume_up_24),
                        contentDescription = null,
                        modifier = Modifier.requiredSize(25.dp)
                    )
                }
                if (currentQuestion.apkId?.isNotEmpty() == true)
                    IconButton(
                        onClick = {
                            val launchIntent: Intent? =
                                context.packageManager.getLaunchIntentForPackage(
                                    currentQuestion.apkId
                                )
                            if (launchIntent != null) {
                                context.startActivity(launchIntent)
                            } else {
                                // Bring user to the market or let them choose an app
                                val intent = Intent(Intent.ACTION_VIEW);
                                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                intent.data =
                                    Uri.parse("market://details?id=" + currentQuestion.apkId);
                                context.startActivity(intent);
                            }
                        },
                        modifier = Modifier
                            .background(colorResource(R.color.white))
                            .padding(bottom = dimensionResource(id = R.dimen.item_vertical_spacing).value.dp),
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Image(
                                painterResource(R.drawable.baseline_phone_android_24),
                                contentDescription = null,
                                modifier = Modifier.requiredSize(25.dp)
                            )
                            Text(text = "Open App")
                        }
                    }
            }

            if (currentQuestion.relatedResponse?.question != null) {
                relatedResponse?.let {
                    Text(
                        modifier = Modifier.padding(vertical = 20.dp),
                        style = TextStyle(fontStyle = FontStyle.Italic),
                        text = "Related Ques.-> ${it.question} : ${it.responses.toString()}"
                    )
                }
            }

            if (currentQuestion.imageUrl?.isNotEmpty() == true) {
                GlideImage(
                    model = currentQuestion.imageUrl,
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(dimensionResource(id = R.dimen._200sdp).value.dp)
                        .padding(dimensionResource(id = R.dimen._5sdp).value.dp),
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
                        .padding(vertical = 5.dp),
                    fontSize = dimensionResource(id = R.dimen.text_small).value.sp,
                    color = colorResource(R.color.text_color),
                    textAlign = TextAlign.Center
                )
            }
            when (currentQuestion.inputType) {
                InputType.TEXT_INPUT -> SimpleInputResponse(
                    submittedResponse,
                    newResponse,
                    isNumber = false,
                    id = currentQuestion.questionID
                )

                InputType.NUMBER_FIELD -> SimpleInputResponse(
                    submittedResponse,
                    newResponse,
                    isNumber = true,
                    currentQuestion.questionID
                )

                InputType.CHECKBOXES -> currentQuestion.options?.let {
                    MultiSelectionResponse(
                        submittedResponse,
                        it,
                        newResponse,
                        audioPlayer,
                        currentQuestion.questionID,
                        currentQuestion.hasImageOptions
                    )
                }

                InputType.RADIO_BUTTON -> currentQuestion.options?.let {
                    SingleSelectionResponse(
                        submittedResponse,
                        it,
                        newResponse,
                        audioPlayer,
                        currentQuestion.questionID,
                        currentQuestion.hasImageOptions
                    )
                }

                InputType.RANGE_SLIDER -> currentQuestion.minNumericValue?.let {
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
    isNumber: Boolean = false,
    id: String?,
) {
    val currentValue: String = currentResponse?.text ?: ""
    val textState = remember(id) { mutableStateOf(TextFieldValue(currentValue)) }

    // Update response
    newResponse.value = textState.value.text

    TextField(value = textState.value,
        modifier = Modifier
            .fillMaxWidth()
            .background(colorResource(R.color.white)),
        singleLine = isNumber,
        colors = TextFieldDefaults.textFieldColors(textColor = colorResource(R.color.text_color)),
        keyboardOptions = KeyboardOptions(keyboardType = if (isNumber) KeyboardType.Decimal else KeyboardType.Text),
        onValueChange = { textState.value = it })
}

@OptIn(ExperimentalGlideComposeApi::class, ExperimentalLayoutApi::class)
@Composable
fun SingleSelectionResponse(
    currentResponse: SubmittedAdolescentResponse?,
    options: List<Option>,
    newResponse: NewAdolescentResponse,
    audioPlayer: AudioPlayer? = null,
    id: String?,
    hasImage: Boolean? = false,
) {
    val chosenOptions = currentResponse?.chosenOptions
    val currentValue = if ((chosenOptions?.size ?: 0) > 0) chosenOptions?.get(0) else null

    val (selectedOption, onOptionSelected) = remember(id) {
        mutableStateOf(currentValue)
    }
    // Update response
    if (selectedOption != null) {
        newResponse.chosenOptions = listOf(selectedOption)
    }

    FlowRow(
        modifier = Modifier
            .padding(8.dp)
            .background(colorResource(R.color.white)),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalArrangement = Arrangement.Top,
        maxItemsInEachRow = 3,
    ) {
        val configuration = LocalConfiguration.current
        val screenWidth = configuration.screenWidthDp
        val columnWidth: Double =
            if (hasImage == true) screenWidth / 2.2 else screenWidth.toDouble()

        options.forEach { option ->
            Column(
                modifier = Modifier
                    .selectable(selected = (option.value == selectedOption?.value), onClick = {
                        onOptionSelected(option)
                    })
                    .padding(vertical = dimensionResource(id = R.dimen._5sdp).value.dp)
                    .width((columnWidth).dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (option.imageUrl?.isNotEmpty() == true) {
                    GlideImage(
                        model = option.imageUrl,
                        contentDescription = null,
                        modifier = Modifier
                            .height(150.dp)
                            .width(columnWidth.dp)
                            .padding(10.dp),
                        failure = placeholder(ColorDrawable(R.drawable.placeholder)),
                        loading = placeholder(ColorDrawable(R.drawable.placeholder))
                    )
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = if (hasImage == true) Arrangement.Center else Arrangement.Start,
                    modifier = Modifier
                        .fillMaxWidth()

                ) {
                    RadioButton(selected = (option.value == selectedOption?.value), onClick = {
                        onOptionSelected(option)
                    })
                    Text(
                        text = option.value,
                        fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                        color = colorResource(R.color.text_color),
                        style = MaterialTheme.typography.body1.merge(),
                    )
                    if (option.audioUrl?.isNotEmpty() == true) IconButton(
                        onClick = {
                            audioPlayer?.playAudio(option.audioUrl)
                        },
                    ) {
                        Image(
                            painterResource(R.drawable.outline_volume_up_24),
                            contentDescription = null,
                            modifier = Modifier.requiredSize(25.dp)
                        )
                    }
                }
            }
            if (hasImage != true)
                Divider(color = colorResource(R.color.text_color), thickness = 0.5.dp)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class, ExperimentalGlideComposeApi::class)
@Composable
fun MultiSelectionResponse(
    currentResponse: SubmittedAdolescentResponse?,
    options: List<Option>,
    newResponse: NewAdolescentResponse,
    audioPlayer: AudioPlayer? = null,
    id: String?,
    hasImage: Boolean? = false,
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp
    val columnWidth: Double =
        if (hasImage == true) screenWidth / 2.2 else screenWidth.toDouble()

    val currentValue = currentResponse?.chosenOptions ?: mutableListOf()
    val selectedOptions = remember(id) { currentValue.toMutableStateList() }

    // Update response
    if (selectedOptions.toList().isNotEmpty()) {
        newResponse.chosenOptions = selectedOptions.toList()
    }

    FlowRow(
        modifier = Modifier
            .padding(8.dp)
            .background(colorResource(R.color.white)),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalArrangement = Arrangement.Top,
        maxItemsInEachRow = 3,
    ) {
        options.forEach { option ->
            Column(
                modifier = Modifier
                    .padding(vertical = dimensionResource(id = R.dimen._5sdp).value.dp)
                    .width(columnWidth.dp),
                horizontalAlignment = if (hasImage == true) Alignment.CenterHorizontally else Alignment.Start
            ) {
                if (option.imageUrl?.isNotEmpty() == true) {
                    GlideImage(
                        model = option.imageUrl,
                        contentDescription = null,
                        modifier = Modifier
                            .height(150.dp)
                            .width(columnWidth.dp)
                            .padding(10.dp),
                        failure = placeholder(ColorDrawable(R.drawable.placeholder)),
                        loading = placeholder(ColorDrawable(R.drawable.placeholder))
                    )
                }
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Checkbox(checked = option.value in selectedOptions.map { opt -> opt.value },
                        onCheckedChange = { isChecked ->
                            if (isChecked) selectedOptions.add(option) else selectedOptions.remove(
                                option
                            )
                        })
                    Text(
                        option.value,
                        fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                        color = colorResource(R.color.text_color)
                    )
                    if (option.audioUrl?.isNotEmpty() == true) IconButton(
                        onClick = {
                            audioPlayer?.playAudio(option.audioUrl)
                        },
                    ) {
                        Image(
                            painterResource(R.drawable.outline_volume_up_24),
                            contentDescription = null,
                            modifier = Modifier.requiredSize(25.dp)
                        )
                    }
                }
            }
            if (hasImage != true)
                Divider(color = colorResource(R.color.text_color), thickness = 0.5.dp)
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
    val currentValue: Float = (currentResponse?.text?.toInt() ?: minValue).toFloat()

    var sliderPosition by remember { mutableFloatStateOf(currentValue) }

    // Update response
    newResponse.value = sliderPosition.toInt().toString()

    Column {
        Slider(value = sliderPosition,
            steps = 1,
            valueRange = (minValue.toFloat())..(maxValue.toFloat()),
            onValueChange = { sliderPosition = it })
        Text(
            text = sliderPosition.toString(),
            fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
        )
    }

}
