package ax.nk.drivenext.presentation.screens.signUp.fourth

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

import ax.nk.drivenext.R
import androidx.compose.ui.res.stringResource
import ax.nk.drivenext.ui.theme.DriveNextTheme

@Composable
fun SignUpFourthScreen() {
    Scaffold(
        topBar = {
            Text(
                text = stringResource(R.string.enjoy),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier
                    .padding(top = 50.dp)
                    .fillMaxWidth(),
                textAlign = TextAlign.Center
            )
        },

        bottomBar = {
            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 24.dp)
                    .height(52.dp),
                shape = RoundedCornerShape(8.dp),
                onClick = {},
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
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(R.drawable.check_circle),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .padding(bottom = 24.dp)
            )
            Text(
                text = stringResource(R.string.congratulations),
                style = MaterialTheme.typography.titleLarge,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .padding(bottom = 16.dp)
            )
            Text(
                text = stringResource(R.string.congratulations_description),
                style = MaterialTheme.typography.bodyMedium,
                textAlign = TextAlign.Center,
            )
        }

    }
}

@Preview(showBackground = true)
@Composable
fun SignUpFourthScreenPreview() {
    DriveNextTheme {
        SignUpFourthScreen()
    }
}
