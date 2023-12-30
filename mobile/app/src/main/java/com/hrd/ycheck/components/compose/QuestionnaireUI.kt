package com.hrd.ycheck.components.compose


import android.content.Intent
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import androidx.compose.foundation.Image
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.MutableLiveData
import com.bumptech.glide.integration.compose.ExperimentalGlideComposeApi
import com.bumptech.glide.integration.compose.GlideImage
import com.bumptech.glide.integration.compose.placeholder
import com.hrd.ycheck.R
import com.hrd.ycheck.models.*
import com.hrd.ycheck.utils.AudioPlayer


@OptIn(ExperimentalGlideComposeApi::class)
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
            text = "Section $currentSectionNumber/$totalSectionCount",
            fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
            color = colorResource(R.color.text_color),
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth()
        )

        LinearProgressIndicator(
            progress = (currentSectionNumber).toFloat() / totalSectionCount.toFloat(),
            color = accentAmber,
            modifier = Modifier
                .height(dimensionResource(id = R.dimen._10sdp))
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
                fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                color = colorResource(R.color.text_color),
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = dimensionResource(id = R.dimen.item_vertical_spacing).value.dp),
                textAlign = TextAlign.Justify
            )
            Row(modifier = Modifier.align(Alignment.End)) {
                if (currentQuestion.audioUrl?.isNotEmpty() == true) IconButton(
                    onClick = {
                        audioPlayer?.playAudio(currentQuestion.audioUrl)
                    },
                    modifier = Modifier.padding(bottom = dimensionResource(id = R.dimen.item_vertical_spacing).value.dp),
                ) {
                    Image(
                        painterResource(R.drawable.outline_volume_up_24),
                        contentDescription = null,
                        modifier = Modifier.requiredSize(25.dp)
                    )
                }
                if (currentQuestion.apkId?.isNotEmpty() == true) IconButton(
                    onClick = {
                        val launchIntent: Intent? =
                            context.packageManager.getLaunchIntentForPackage(currentQuestion.apkId)
                        if (launchIntent != null) {
                            context.startActivity(launchIntent)
                        } else {
                            // Bring user to the market or let them choose an app?
                            val intent = Intent(Intent.ACTION_VIEW);
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            intent.data = Uri.parse("market://details?id=" + currentQuestion.apkId);
                            context.startActivity(intent);
                        }
                    },
                    modifier = Modifier.padding(bottom = dimensionResource(id = R.dimen.item_vertical_spacing).value.dp),
                ) {
                    Image(
                        painterResource(R.drawable.baseline_phone_android_24),
                        contentDescription = null,
                        modifier = Modifier.requiredSize(25.dp)
                    )
                }
            }
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
                    submittedResponse, newResponse, isNumber = true, currentQuestion.questionID
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
        modifier = Modifier.fillMaxWidth(),
        singleLine = true,
        colors = TextFieldDefaults.textFieldColors(textColor = colorResource(R.color.text_color)),
        keyboardOptions = KeyboardOptions(keyboardType = if (isNumber) KeyboardType.Number else KeyboardType.Text),
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
        modifier = Modifier.padding(8.dp),
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
        modifier = Modifier.padding(8.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalArrangement = Arrangement.Top,
        maxItemsInEachRow = 3,
    ) {
        options.forEach { option ->
            Column(
                modifier = Modifier
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
