package ax.nk.drivenext.presentation.screens.signUp.second

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import java.util.Calendar
import java.util.Date

class SignUpSecondViewModel : ViewModel() {
    var surname = mutableStateOf("")
    var name = mutableStateOf("")
    var gender = mutableStateOf<Gender?>(null)
    var selectedDateMillis = mutableStateOf<Long?>(null)

    var surnameError = mutableStateOf<String?>(null)
    var nameError = mutableStateOf<String?>(null)
    var selectedDateError = mutableStateOf<String?>(null)

    val isSecondFormValid: Boolean
        get() = surnameError.value == null &&
                nameError.value == null &&
                selectedDateError.value == null &&
                gender.value != null &&
                selectedDateMillis.value != null &&
                surname.value.isNotBlank() &&
                name.value.isNotBlank()

    fun onSurnameChanged(newSurnameValue: String) {
        surname.value = newSurnameValue
        surnameError.value = validateSurname(newSurnameValue)
    }
    fun onNameChanged(newNameValue: String) {
        name.value = newNameValue
        nameError.value = validateName(newNameValue)
    }
    fun onGenderChanged(newGenderValue: Gender) {
        gender.value = newGenderValue
    }
    fun onDateChanged(newDateValue: Long?) {
        selectedDateMillis.value = newDateValue
        selectedDateError.value = validateDate(newDateValue)
    }

    fun validateSurname(value: String): String? {
        return if (value.isBlank()) "Введите фамилию" else null
    }
    fun validateName(value: String): String? {
        return if (value.isBlank()) "Введите имя" else null
    }
    fun validateDate(value: Long?): String? {
        if (value == null) return "Введите дату рождения."
        val selectedDate = Date(value)
        val today = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.time

        return if (selectedDate >= today) {
            "Введите корректную дату рождения."
        } else {
            null
        }
    }

    fun onSecondContinueClick(onSuccess: () -> Unit) {
        viewModelScope.launch {
            if (isSecondFormValid) {
                // TODO server request
                onSuccess()
            }
        }
    }
}