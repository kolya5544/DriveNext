package ax.nk.drivenext.presentation.screens.signUp.third

import android.graphics.Bitmap
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel

class SignUpThirdViewModel : ViewModel() {
    // Храним превьюшки
    val avatarBitmap   = mutableStateOf<Bitmap?>(null)
    val licenseBitmap  = mutableStateOf<Bitmap?>(null)
    val passportBitmap = mutableStateOf<Bitmap?>(null)

    fun setPhoto(target: PhotoTarget, bmp: Bitmap?) {
        when (target) {
            PhotoTarget.AVATAR   -> avatarBitmap.value = bmp
            PhotoTarget.LICENSE  -> licenseBitmap.value = bmp
            PhotoTarget.PASSPORT -> passportBitmap.value = bmp
        }
    }

    // Поля формы (минимум чтобы собрать)
    val driversLicenseNumber = mutableStateOf("")
    val driversLicenseNumberError = mutableStateOf<String?>(null)

    val selectedDateMillis = mutableStateOf<Long?>(null)
    val selectedDateError = mutableStateOf<String?>(null)

    // Твоя логика валидации — адаптируй по необходимости
    val isThirdFormValid: Boolean
        get() = selectedDateMillis.value != null && driversLicenseNumber.value.isNotBlank()

    fun onDriversLicenseNumberChange(v: String) {
        driversLicenseNumber.value = v
        driversLicenseNumberError.value = null
    }

    fun onDateChanged(millis: Long) {
        selectedDateMillis.value = millis
        selectedDateError.value = null
    }
}