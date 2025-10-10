package ax.nk.drivenext.presentation.screens.signUp.second

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.getValue
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusEvent
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

enum class Gender {
    Male, Female
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignUpSecondScreen(
    onNextButtonClick: () -> Unit,
    onBackButtonClick: () -> Unit,
    viewModel: SignUpSecondViewModel = viewModel()
) {
    var patronymic by remember { mutableStateOf("") }

    // birth date field
    val datePickerState = rememberDatePickerState()
    var showDatePickerDialog by rememberSaveable { mutableStateOf(false) }

    // --- helper: вычисление возраста в полных годах (минимальные изменения) ---
    fun ageInYears(millis: Long): Int {
        val today = Calendar.getInstance()
        val dob = Calendar.getInstance().apply { timeInMillis = millis }
        var age = today.get(Calendar.YEAR) - dob.get(Calendar.YEAR)
        // Если день рождения в этом году ещё не наступил — уменьшаем возраст
        if (today.get(Calendar.DAY_OF_YEAR) < dob.get(Calendar.DAY_OF_YEAR)) {
            age--
        }
        return age
    }
    // ------------------------------------------------------------------------

    if (showDatePickerDialog) {
        DatePickerDialog(
            onDismissRequest = { showDatePickerDialog = false },
            confirmButton = {
                TextButton(onClick = {
                    val picked = datePickerState.selectedDateMillis
                    if (picked != null) {
                        val age = ageInYears(picked)
                        if (age < 16) {
                            // выставляем ошибку и не сохраняем дату
                            viewModel.selectedDateError.value = "Минимальный возраст — 16 лет"
                            viewModel.selectedDateMillis.value = null
                        } else {
                            // дата валидна: сохраняем и очищаем ошибку
                            viewModel.onDateChanged(picked)
                            viewModel.selectedDateError.value = null
                        }
                    } else {
                        // ничего не выбрано — очищаем
                        viewModel.selectedDateError.value = "Выберите дату рождения"
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
                onClick = { viewModel.onSecondContinueClick(onNextButtonClick) },
                enabled = viewModel.isSecondFormValid,
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
        Column(
            modifier = Modifier
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            // Surname
            Column(
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.surname),
                    style = MaterialTheme.typography.bodyLarge,
                )
                OutlinedTextField(
                    value = viewModel.surname.value,
                    onValueChange = { viewModel.onSurnameChanged(it) },
                    placeholder = { Text(stringResource(R.string.surname_placeholder)) },
                    isError = viewModel.surnameError.value != null,
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
                viewModel.surnameError.value?.let {
                    Text(
                        text = it,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier
                            .padding(8.dp)
                    )
                }
            }

            // Name
            Column(
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.name),
                    style = MaterialTheme.typography.bodyLarge,
                )
                OutlinedTextField(
                    value = viewModel.name.value,
                    onValueChange = { viewModel.onNameChanged(it) },
                    placeholder = { Text(stringResource(R.string.name_placeholder)) },
                    isError = viewModel.nameError.value != null,
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
                        .fillMaxWidth(),
                )
                viewModel.nameError.value?.let {
                    Text(
                        text = it,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier
                            .padding(8.dp)
                    )
                }
            }

            // Patronymic
            Column(
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.patronymic),
                    style = MaterialTheme.typography.bodyLarge,
                )
                OutlinedTextField(
                    value = patronymic,
                    onValueChange = { patronymic = it },
                    placeholder = { Text(stringResource(R.string.patronymic_placeholder)) },
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
            }

            // Date of Birth
            Column(
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.date_of_birth),
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

            // Sex
            Column(
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                Text(
                    text = stringResource(R.string.sex),
                    style = MaterialTheme.typography.bodyLarge,
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        RadioButton(
                            selected = viewModel.gender.value == Gender.Male,
                            onClick = { viewModel.onGenderChanged(Gender.Male) }
                        )
                        Text(
                            text = stringResource(R.string.male),
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        RadioButton(
                            selected = viewModel.gender.value == Gender.Female,
                            onClick = { viewModel.onGenderChanged(Gender.Female) }
                        )
                        Text(
                            text = stringResource(R.string.female),
                            style = MaterialTheme.typography.bodyLarge,
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SignUpSecondScreenPreview() {
    DriveNextTheme {
        SignUpSecondScreen(
            onNextButtonClick = {},
            onBackButtonClick = {},
        )
    }
}
