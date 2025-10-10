package ax.nk.drivenext.presentation.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

import ax.nk.drivenext.R
import androidx.compose.ui.res.stringResource
import ax.nk.drivenext.ui.theme.DriveNextTheme

@Composable
fun NoConnectionScreen(
    onTryAgainButtonClick: () -> Unit
) {
    Scaffold(
        content = { paddingValues ->
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Image(
                    painter = painterResource(R.drawable.no_connection),
                    contentDescription = null,
                    modifier = Modifier
                        .size(128.dp)
                        .padding(bottom = 24.dp)
                )
                Text(
                    text = stringResource(R.string.no_connection),
                    style = MaterialTheme.typography.titleLarge,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .padding(bottom = 16.dp)
                )
                Text(
                    text = stringResource(R.string.no_connection_description),
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                )
            }
        },
        bottomBar = {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier.padding(all = 16.dp)
            ) {
                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(8.dp),
                    onClick = onTryAgainButtonClick,
                ) {
                    Text(
                        text = stringResource(R.string.retry),
                        style = MaterialTheme.typography.bodyLarge,
                        textAlign = TextAlign.Center,
                    )
                }
            }
        },

        modifier = Modifier
            .systemBarsPadding()
    )
}

@Preview(showBackground = true)
@Composable
fun NoConnectionScreenPreview() {
    DriveNextTheme {
        NoConnectionScreen(onTryAgainButtonClick = {})
    }
}
