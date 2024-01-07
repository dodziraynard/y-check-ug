package com.hrd.ycheck.components.compose


import FormField
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.MaterialTheme
import androidx.compose.material.RadioButton
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.material.TextFieldDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DisplayMode
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hrd.ycheck.R
import com.hrd.ycheck.models.Adolescent
import com.hrd.ycheck.utils.Functions.Companion.getAttr
import com.hrd.ycheck.utils.Functions.Companion.setAttr
import com.hrd.ycheck.utils.ModelFieldType
import java.time.Instant
import java.util.Locale

@Preview
@Composable
fun ModelDataInputView(
    data: FormField? = null, adolescent: Adolescent? = null, errorMessage: String? = "Error message"
) {
    val configuration = LocalConfiguration.current
    val screenHeight = configuration.screenHeightDp
    val context = LocalContext.current

    val title: String = data?.label ?: "What's the question?"
    val field: String = data?.field ?: "field"
    val description: String = data?.description ?: "What's the question?"
    val inputType: String = data?.type ?: "What's the question?"
    val options: List<String> = if (data?.options != null) data.options else listOf(
        "Option 1", "Option 2"
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp)
    ) {
        Column(
            modifier = Modifier
                .verticalScroll(rememberScrollState())
                .weight(weight = 1f, fill = false)
        ) {
            Text(
                text = description.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.ROOT) else it.toString() },
                fontSize = dimensionResource(id = R.dimen._25sdp).value.sp,
                color = colorResource(R.color.text_color),
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = dimensionResource(id = R.dimen.item_vertical_spacing).value.dp),
                textAlign = TextAlign.Left
            )

            Text(
                text = title.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.ROOT) else it.toString() },
                fontSize = dimensionResource(id = R.dimen.text_small).value.sp,
                color = colorResource(android.R.color.darker_gray),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = dimensionResource(id = R.dimen._10sdp).value.dp),
                textAlign = TextAlign.Left
            )

            when (inputType) {
                ModelFieldType.RADIO_BUTTON -> adolescent.let {
                    if (options != null) {
                        RadioModelInput(
                            adolescent, field, options
                        )
                    }
                }

                ModelFieldType.TEXT_INPUT -> SimpleTextInputResponse(
                    adolescent, field
                )

                ModelFieldType.DATE -> SimpleDatePickerInDatePickerDialog(
                    adolescent, field
                )
            }

            if (errorMessage != null) {
                Text(
                    text = errorMessage,
                    fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                    color = colorResource(R.color.color_warning),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = dimensionResource(id = R.dimen._20sdp).value.dp),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Preview
@Composable
fun RadioModelInput(
    adolescent: Adolescent? = null,
    field: String = "surname",
    options: List<String> = listOf("Option 1", "Option 2"),
) {
    val currentValue = if (adolescent != null) getAttr(adolescent, field) else null

    val (selectedOption, onOptionSelected) = remember(field) {
        mutableStateOf(currentValue)
    }
    // Update response
    if (selectedOption != null && adolescent != null) {
        setAttr(adolescent, field, selectedOption)
    }

    FlowRow(
        modifier = Modifier.padding(8.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalArrangement = Arrangement.Top,
        maxItemsInEachRow = 3,
    ) {
        val configuration = LocalConfiguration.current
        val screenWidth = configuration.screenWidthDp
        val columnWidth: Double = screenWidth.toDouble()

        options.forEach { option ->
            Column(
                modifier = Modifier
                    .selectable(selected = (option.lowercase() == selectedOption?.toString()?.lowercase()), onClick = {
                        onOptionSelected(option)
                    })
                    .width((columnWidth).dp), horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    RadioButton(selected = (option == selectedOption), onClick = {
                        onOptionSelected(option)
                    })
                    Text(
                        text = option.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.ROOT) else it.toString() },
                        fontSize = dimensionResource(id = R.dimen.text_size).value.sp,
                        color = colorResource(R.color.text_color),
                        style = MaterialTheme.typography.body1.merge(),
                    )
                }
            }
        }
    }
}

@Composable
fun SimpleTextInputResponse(
    adolescent: Adolescent? = null,
    field: String = "surname",
    isNumber: Boolean = false,
) {
    val currentValue: String = if (adolescent != null) getAttr(adolescent, field).toString() else ""
    val textState = remember(field) { mutableStateOf(TextFieldValue(currentValue)) }

    // Update response
    if (adolescent != null) {
        setAttr(adolescent, field, textState.value.text)
    }

    TextField(value = textState.value,
        modifier = Modifier.fillMaxWidth(),
        singleLine = true,
        colors = TextFieldDefaults.textFieldColors(textColor = colorResource(R.color.text_color)),
        keyboardOptions = KeyboardOptions(keyboardType = if (isNumber) KeyboardType.Number else KeyboardType.Text),
        onValueChange = { textState.value = it })
}

@Composable
@Preview()
@OptIn(ExperimentalMaterial3Api::class)
private fun SimpleDatePickerInDatePickerDialog(
    adolescent: Adolescent? = null,
    field: String = "dob",
    openDialog: Boolean = true,
    onDismiss: (() -> Unit?)? = null
) {
    val datePickerState = rememberDatePickerState(
        initialSelectedDateMillis = adolescent?.dob ?: Instant.now().toEpochMilli()
    )
    datePickerState.displayMode = DisplayMode.Input
    datePickerState.selectedDateMillis?.let {
        adolescent?.let {
            setAttr(
                adolescent,
                field,
                datePickerState.selectedDateMillis
            )
        }
    }
    DatePicker(state = datePickerState)
}






















