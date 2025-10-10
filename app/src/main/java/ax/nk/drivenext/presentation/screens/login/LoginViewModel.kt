package ax.nk.drivenext.presentation.screens.login

import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {

    var email = mutableStateOf("")
    var password = mutableStateOf("")
    var emailError = mutableStateOf<String?>(null)
    var passwordError = mutableStateOf<String?>(null)

    val isFormValid: Boolean
        get() = emailError.value == null &&
                passwordError.value == null &&
                email.value.isNotBlank() &&
                password.value.isNotBlank()

    fun onEmailChanged(newEmail: String) {
        email.value = newEmail
        emailError.value = validateEmail(newEmail)
    }

    fun onPasswordChanged(newPassword: String) {
        password.value = newPassword
        passwordError.value = validatePassword(newPassword)
    }

    private fun validateEmail(value: String): String? {
        if (value.isBlank()) return "Введите email"
        val emailRegex = Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")
        return if (!emailRegex.matches(value)) "Некорректный email" else null
    }

    private fun validatePassword(value: String): String? {
        return if (value.isBlank()) "Введите пароль" else null
    }

    fun onLoginClick(onSuccess: () -> Unit) {
        viewModelScope.launch {
            if (isFormValid) {
                // TODO server request
                onSuccess()
            }
        }
    }
}
