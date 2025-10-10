package ax.nk.drivenext.presentation.screens.signUp.third

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusEvent
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.res.stringResource
import androidx.lifecycle.viewmodel.compose.viewModel
import ax.nk.drivenext.R
import ax.nk.drivenext.ui.theme.DriveNextTheme
import ax.nk.drivenext.ui.theme.Gray300
import ax.nk.drivenext.ui.theme.Purple40
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignUpThirdScreen(
    onNextButtonClick: () -> Unit,
    onBackButtonClick: () -> Unit,
    viewModel: SignUpThirdViewModel = viewModel()
) {
    // date of issue field
    val datePickerState = rememberDatePickerState()
    var showDatePickerDialog by rememberSaveable { mutableStateOf(false) }

    // --- helper: сколько полных лет прошло с даты выдачи ---
    fun yearsSince(millis: Long): Int {
        val today = Calendar.getInstance()
        val issued = Calendar.getInstance().apply { timeInMillis = millis }
        var years = today.get(Calendar.YEAR) - issued.get(Calendar.YEAR)
        if (today.get(Calendar.DAY_OF_YEAR) < issued.get(Calendar.DAY_OF_YEAR)) years--
        return years
    }
    // -------------------------------------------------------

    if (showDatePickerDialog) {
        DatePickerDialog(
            onDismissRequest = { showDatePickerDialog = false },
            confirmButton = {
                TextButton(onClick = {
                    val picked = datePickerState.selectedDateMillis
                    if (picked != null) {
                        val years = yearsSince(picked)
                        if (years > 13) {
                            viewModel.selectedDateError.value = "Удостоверению больше 13 лет"
                            viewModel.selectedDateMillis.value = null
                        } else {
                            viewModel.onDateChanged(picked)
                            viewModel.selectedDateError.value = null
                        }
                    } else {
                        viewModel.selectedDateError.value = "Выберите дату выдачи"
                        viewModel.selectedDateMillis.value = null
                    }
                    showDatePickerDialog = false
                }) {
                    Text("ОК")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePickerDialog = false }) {
                    Text("Отмена")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    val formattedDate: String = remember(viewModel.selectedDateMillis.value) {
        val millis = viewModel.selectedDateMillis.value
        if (millis != null) {
            val date = Date(millis)
            SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(date)
        } else {
            ""
        }
    }

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                IconButton(
                    onClick = onBackButtonClick
                ) {
                    Icon(
                        painter = painterResource(R.drawable.back_button),
                        contentDescription = null,
                    )
                }
                Text(
                    text = stringResource(R.string.create_account),
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier
                        .align(Alignment.CenterVertically)
                )
            }
        },
        bottomBar = {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 24.dp)
                    .height(52.dp),
                shape = RoundedCornerShape(8.dp),
                enabled = viewModel.isThirdFormValid,
                onClick = onNextButtonClick,
            ) {
                Text(
                    text = stringResource(R.string.countinue),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                )
            }
        },
        modifier = Modifier
            .systemBarsPadding()
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            item {
                // User Photo
                IconButton(
                    onClick = onBackButtonClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .size(128.dp)
                ) {
                    Image(
                        painter = painterResource(R.drawable.new_profile_photo),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                    )
                }
            }

            item {
                Text(
                    text = stringResource(R.string.user_photo_description),
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier
                        .fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
            }

            item {
                // Drivers License Number
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = stringResource(R.string.drivers_license_number),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    OutlinedTextField(
                        value = viewModel.driversLicenseNumber.value,
                        onValueChange = { viewModel.onDriversLicenseNumberChange(it) },
                        placeholder = { Text(stringResource(R.string.drivers_license_number_placeholder)) },
                        isError = viewModel.driversLicenseNumberError.value != null,
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Purple40,
                            unfocusedBorderColor = Gray300,
                            disabledBorderColor = Gray300,
                            errorBorderColor = MaterialTheme.colorScheme.error,
                            focusedLabelColor = Gray300,
                            unfocusedLabelColor = Gray300
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                    )
                    viewModel.driversLicenseNumberError.value?.let {
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier
                                .padding(8.dp)
                        )
                    }
                }
            }

            item {
                // Date of Issue
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = stringResource(R.string.date_of_issue),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    OutlinedTextField(
                        value = formattedDate,
                        onValueChange = {},
                        readOnly = true,
                        placeholder = { Text(stringResource(R.string.date_placeholder)) },
                        isError = viewModel.selectedDateError.value != null,
                        shape = RoundedCornerShape(8.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Purple40,
                            unfocusedBorderColor = Gray300,
                            disabledBorderColor = Gray300,
                            errorBorderColor = MaterialTheme.colorScheme.error,
                            focusedLabelColor = Gray300,
                            unfocusedLabelColor = Gray300
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .onFocusEvent { focusState ->
                                if (focusState.isFocused) {
                                    showDatePickerDialog = true
                                }
                            },
                        leadingIcon = {
                            IconButton(onClick = { showDatePickerDialog = true }) {
                                Icon(
                                    painter = painterResource(R.drawable.calendar),
                                    contentDescription = null,
                                )
                            }
                        }
                    )
                    viewModel.selectedDateError.value?.let {
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier
                                .padding(8.dp)
                        )
                    }
                }
            }

            item {
                // Driver's License Photo
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = stringResource(R.string.drivers_license_photo),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    Row(
                        modifier = Modifier
                            .padding(top = 8.dp)
                    ) {
                        Image(
                            painter = painterResource(R.drawable.upload),
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                        )
                        Text(
                            text = stringResource(R.string.upload_photo),
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier
                                .align(Alignment.CenterVertically)
                                .padding(start = 8.dp)
                        )
                    }
                }
            }

            item {
                // Passport Photo
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = stringResource(R.string.passport_photo),
                        style = MaterialTheme.typography.bodyLarge,
                    )
                    Row(
                        modifier = Modifier
                            .padding(top = 8.dp)
                    ) {
                        Image(
                            painter = painterResource(R.drawable.upload),
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                        )
                        Text(
                            text = stringResource(R.string.upload_photo),
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier
                                .align(Alignment.CenterVertically)
                                .padding(start = 8.dp)
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SignUpThirdScreenPreview() {
    DriveNextTheme {
        SignUpThirdScreen(
            onNextButtonClick = {},
            onBackButtonClick = {},
        )
    }
}
