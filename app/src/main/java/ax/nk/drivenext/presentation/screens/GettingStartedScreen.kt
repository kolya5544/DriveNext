package ax.nk.drivenext.presentation.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

import ax.nk.drivenext.R
import androidx.compose.ui.res.stringResource
import ax.nk.drivenext.ui.theme.DriveNextTheme
import ax.nk.drivenext.ui.theme.Purple40
import ax.nk.drivenext.ui.theme.White100

@Composable
fun GettingStartedScreen(
    onLogInButtonClick: () -> Unit,
    onSignUpButtonClick: () -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding(),
    ) {
        Column(
            modifier = Modifier
                .padding(top = 40.dp)
                .padding(all = 20.dp)
        ) {
            Text(
                text = stringResource(R.string.app_name),
                style = MaterialTheme.typography.titleLarge,
                color = Purple40
            )
            Text(
                text = stringResource(R.string.app_description),
                style = MaterialTheme.typography.labelMedium,
            )
        }

        Image(
            painter = painterResource(R.drawable.loading_screen_img),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.Center)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 50.dp, start = 20.dp, end = 20.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
                    .height(52.dp),
                shape = RoundedCornerShape(8.dp),
                onClick = onLogInButtonClick,
            ) {
                Text(
                    text = stringResource(R.string.log_in),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                )
            }

            OutlinedButton(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
                colors = ButtonDefaults.outlinedButtonColors(
                    containerColor = White100, 
                    contentColor = MaterialTheme.colorScheme.primary 
                ),
                onClick = onSignUpButtonClick,
            ) {
                Text(
                    text = stringResource(R.string.sign_in),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun GettingStartedScreenPreview() {
    DriveNextTheme {
        GettingStartedScreen(
            onLogInButtonClick = {},
            onSignUpButtonClick = {}
        )
    }
}
