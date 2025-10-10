package ax.nk.drivenext.presentation.screens.signUp.first

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class SignUpFirstViewModel : ViewModel() {
    var email = mutableStateOf("")
    var password = mutableStateOf("")
    var repeatPassword = mutableStateOf("")
    var termsAndConditionsChecked = mutableStateOf(false)

    var emailError = mutableStateOf<String?>(null)
    var passwordError = mutableStateOf<String?>(null)
    var repeatPasswordError = mutableStateOf<String?>(null)
    var termsAndConditionsCheckedError = mutableStateOf<String?>(null)

    val isFirstFormValid: Boolean
        get() = emailError.value == null &&
                passwordError.value == null &&
                repeatPasswordError.value == null &&
                email.value.isNotBlank() &&
                password.value.isNotBlank() &&
                repeatPassword.value.isNotBlank() &&
                termsAndConditionsChecked.value

    fun onEmailChanged(newEmail: String) {
        email.value = newEmail
        emailError.value = validateEmail(newEmail)
    }

    fun onPasswordChanged(newPassword: String) {
        password.value = newPassword
        passwordError.value = validatePassword(newPassword)
    }

    fun onRepeatPasswordChanged(newRepeatPassword: String) {
        repeatPassword.value = newRepeatPassword
        repeatPasswordError.value = validateRepeatPassword(newRepeatPassword)
    }

    fun onTermsAndConditionsChanged(newAgreement: Boolean) {
        termsAndConditionsChecked.value = newAgreement
        termsAndConditionsCheckedError.value = validateTermsAndConditions(newAgreement)
    }

    private fun validateEmail(value: String): String? {
        if (value.isBlank()) return "Введите email"
        val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
        return if (!emailRegex.matches(value)) "Введите корректный адрес электронной почты." else null
    }

    private fun validatePassword(value: String): String? {
        return if (value.isBlank()) "Введите пароль" else null
    }

    private fun validateRepeatPassword(value: String): String? {
        if (value.isBlank()) return "Повторите пароль"
        return if (value != password.value) "Пароли не совпадают." else null
    }

    private fun validateTermsAndConditions(value: Boolean): String? {
        return if (value) null else "Необходимо согласиться с условиями обслуживания и политикой конфиденциальности."
    }

    fun onFirstContinueClick(onSuccess: () -> Unit) {
        viewModelScope.launch {
            if (isFirstFormValid) {
                // TODO server request
                onSuccess()
            }
        }
    }
}
