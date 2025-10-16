package ax.nk.drivenext.presentation.screens.signUp.third

import android.Manifest
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusEvent
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.content.FileProvider
import androidx.lifecycle.viewmodel.compose.viewModel
import ax.nk.drivenext.R
import ax.nk.drivenext.ui.theme.DriveNextTheme
import ax.nk.drivenext.ui.theme.Gray300
import ax.nk.drivenext.ui.theme.Purple40
import java.io.File
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

// ВНЕ композиции
enum class PhotoTarget { AVATAR, LICENSE, PASSPORT }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignUpThirdScreen(
    onNextButtonClick: () -> Unit,
    onBackButtonClick: () -> Unit,
    viewModel: SignUpThirdViewModel = viewModel()
) {
    // --------------- DATE PICKER ---------------
    val datePickerState = rememberDatePickerState()
    var showDatePickerDialog by rememberSaveable { mutableStateOf(false) }

    fun yearsSince(millis: Long): Int {
        val today = Calendar.getInstance()
        val issued = Calendar.getInstance().apply { timeInMillis = millis }
        var years = today.get(Calendar.YEAR) - issued.get(Calendar.YEAR)
        if (today.get(Calendar.DAY_OF_YEAR) < issued.get(Calendar.DAY_OF_YEAR)) years--
        return years
    }

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
                }) { Text("ОК") }
            },
            dismissButton = {
                TextButton(onClick = { showDatePickerDialog = false }) { Text("Отмена") }
            }
        ) { DatePicker(state = datePickerState) }
    }

    val formattedDate: String = remember(viewModel.selectedDateMillis.value) {
        viewModel.selectedDateMillis.value?.let {
            SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(Date(it))
        } ?: ""
    }

    // --------------- SYSTEM CHOOSER: CAMERA / GALLERY ---------------
    var currentTarget by rememberSaveable { mutableStateOf<PhotoTarget?>(null) }
    val context = LocalContext.current
    var pendingCameraUri by remember { mutableStateOf<Uri?>(null) }

    fun createImageUri(): Uri? = try {
        val imagesDir = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        val file = File.createTempFile("camera_", ".jpg", imagesDir)
        FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    } catch (_: Exception) { null }

    fun buildGalleryIntent(): Intent =
        if (Build.VERSION.SDK_INT >= 33) {
            Intent(MediaStore.ACTION_PICK_IMAGES).apply { type = "image/*" }
        } else {
            Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "image/*"
            }
        }

    fun buildCameraIntent(output: Uri): Intent =
        Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
            putExtra(MediaStore.EXTRA_OUTPUT, output)
            addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }

    val chooserLauncher = rememberLauncherForActivityResult(StartActivityForResult()) { result ->
        if (result.resultCode == android.app.Activity.RESULT_OK) {
            val picked = result.data?.data
            val uri = picked ?: pendingCameraUri
            if (uri != null) {
                val bmp: Bitmap? = runCatching {
                    context.contentResolver.openInputStream(uri).use { ins ->
                        BitmapFactory.decodeStream(ins)
                    }
                }.getOrNull()

                when (currentTarget) {
                    PhotoTarget.AVATAR   -> viewModel.setPhoto(PhotoTarget.AVATAR, bmp)
                    PhotoTarget.LICENSE  -> viewModel.setPhoto(PhotoTarget.LICENSE, bmp)
                    PhotoTarget.PASSPORT -> viewModel.setPhoto(PhotoTarget.PASSPORT, bmp)
                    null -> {}
                }

                // persist permission для OPEN_DOCUMENT
                if (picked != null && result.data?.flags?.and(
                        Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                    ) != 0
                ) {
                    runCatching {
                        context.contentResolver.takePersistableUriPermission(
                            picked,
                            (result.data?.flags ?: 0) and
                                    (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
                        )
                    }
                }
            }
        }
    }

    fun openSystemChooser() {
        val gallery = buildGalleryIntent()
        val cameraUri = createImageUri()
        val camera = cameraUri?.let { buildCameraIntent(it) }
        pendingCameraUri = cameraUri

        val chooser = Intent.createChooser(
            gallery,
            context.getString(R.string.upload_photo) // заголовок chooser-а
        ).apply {
            if (camera != null) {
                putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(camera))
            }
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
        }

        chooserLauncher.launch(chooser)
    }

    // --------------- UI ---------------
    Scaffold(
        topBar = {
            Row(modifier = Modifier.fillMaxWidth()) {
                IconButton(onClick = onBackButtonClick) {
                    Icon(painter = painterResource(R.drawable.back_button), contentDescription = null)
                }
                Text(
                    text = stringResource(R.string.create_account),
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.align(Alignment.CenterVertically)
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
                onClick = onNextButtonClick
            ) {
                Text(
                    text = stringResource(R.string.countinue),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center
                )
            }
        },
        modifier = Modifier.systemBarsPadding()
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .padding(paddingValues)
                .padding(horizontal = 16.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            contentPadding = PaddingValues(vertical = 16.dp)
        ) {
            // ----- Аватар -----
            item {
                IconButton(
                    onClick = {
                        currentTarget = PhotoTarget.AVATAR
                        openSystemChooser()
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .size(128.dp)
                ) {
                    val bmp = viewModel.avatarBitmap.value
                    if (bmp != null) {
                        Image(
                            bitmap = bmp.asImageBitmap(),
                            contentDescription = null,
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Image(
                            painter = painterResource(R.drawable.new_profile_photo),
                            contentDescription = null,
                            contentScale = ContentScale.Crop
                        )
                    }
                }
            }

            item {
                Text(
                    text = stringResource(R.string.user_photo_description),
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.fillMaxWidth(),
                    textAlign = TextAlign.Center
                )
            }

            // ----- Номер ВУ -----
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = stringResource(R.string.drivers_license_number),
                        style = MaterialTheme.typography.bodyLarge
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
                        modifier = Modifier.fillMaxWidth()
                    )
                    viewModel.driversLicenseNumberError.value?.let {
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(8.dp)
                        )
                    }
                }
            }

            // ----- Дата выдачи -----
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = stringResource(R.string.date_of_issue),
                        style = MaterialTheme.typography.bodyLarge
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
                                if (focusState.isFocused) showDatePickerDialog = true
                            },
                        leadingIcon = {
                            IconButton(onClick = { showDatePickerDialog = true }) {
                                Icon(painter = painterResource(R.drawable.calendar), contentDescription = null)
                            }
                        }
                    )
                    viewModel.selectedDateError.value?.let {
                        Text(
                            text = it,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.padding(8.dp)
                        )
                    }
                }
            }

            // ----- Фото ВУ -----
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = stringResource(R.string.drivers_license_photo),
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Row(
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .clickable {
                                currentTarget = PhotoTarget.LICENSE
                                openSystemChooser()
                            },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val bmp = viewModel.licenseBitmap.value
                        if (bmp != null) {
                            Image(
                                bitmap = bmp.asImageBitmap(),
                                contentDescription = null,
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Image(
                                painter = painterResource(R.drawable.upload),
                                contentDescription = null,
                                contentScale = ContentScale.Crop
                            )
                        }
                        Text(
                            text = stringResource(R.string.upload_photo),
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }

            // ----- Фото паспорта -----
            item {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = stringResource(R.string.passport_photo),
                        style = MaterialTheme.typography.bodyLarge
                    )
                    Row(
                        modifier = Modifier
                            .padding(top = 8.dp)
                            .clickable {
                                currentTarget = PhotoTarget.PASSPORT
                                openSystemChooser()
                            },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val bmp = viewModel.passportBitmap.value
                        if (bmp != null) {
                            Image(
                                bitmap = bmp.asImageBitmap(),
                                contentDescription = null,
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Image(
                                painter = painterResource(R.drawable.upload),
                                contentDescription = null,
                                contentScale = ContentScale.Crop
                            )
                        }
                        Text(
                            text = stringResource(R.string.upload_photo),
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.padding(start = 8.dp)
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
            onBackButtonClick = {}
        )
    }
}
