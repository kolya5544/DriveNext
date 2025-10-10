package ax.nk.drivenext.presentation.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import ax.nk.drivenext.R
import androidx.compose.ui.res.stringResource
import ax.nk.drivenext.ui.theme.DriveNextTheme
import kotlinx.coroutines.launch

@Composable
fun OnboardingScreen(
    onLetsGoButtonClick: () -> Unit,
    onSkipButtonClick: () -> Unit
) {
    val pagerState = rememberPagerState(pageCount = { 3 })
    val coroutineScope = rememberCoroutineScope()

    val imageResources = listOf(
        R.drawable.onboarding0,
        R.drawable.onboarding1,
        R.drawable.onboarding2,
    )

    val titles = listOf(
        stringResource(R.string.onboarding0_title),
        stringResource(R.string.onboarding1_title),
        stringResource(R.string.onboarding2_title),
    )

    val descriptions = listOf(
        stringResource(R.string.onboarding0_description),
        stringResource(R.string.onboarding1_description),
        stringResource(R.string.onboarding2_description),
    )

    val buttonText = listOf(
        stringResource(R.string.countinue),
        stringResource(R.string.countinue),
        stringResource(R.string.lets_go),
    )

    HorizontalPager(
        state = pagerState,
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding()
    ) { page ->
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            TextButton(
                onClick = {
                    onSkipButtonClick()
                },
                modifier = Modifier
                    .align(Alignment.TopEnd)
            ) {
                Text(
                    text = stringResource(R.string.skip),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }

            Column(
                modifier = Modifier
                    .align(Alignment.Center)
            ) {
                Image(
                    painter = painterResource(imageResources[page]),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(307.dp)
                )

                Column(
                    modifier = Modifier
                        .padding(30.dp)
                ) {
                    Text(
                        text = titles[page],
                        style = MaterialTheme.typography.titleLarge,
                        modifier = Modifier
                            .padding(bottom = 24.dp)
                    )

                    Text(
                        text = descriptions[page],
                        style = MaterialTheme.typography.bodyLarge,
                    )
                }



                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight()
                        .padding(30.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .weight(1f)
                            .align(Alignment.CenterVertically)
                    ) {
                        repeat(pagerState.pageCount) { iteration ->
                            val color =
                                if (pagerState.currentPage == iteration) Color.Blue else Color.LightGray
                            val width = if (pagerState.currentPage == iteration) 40.dp else 16.dp

                            Box(
                                modifier = Modifier
                                    .padding(8.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .width(width)
                                    .height(8.dp)
                                    .background(color)
                                    .size(16.dp)
                            )
                        }
                    }


                    Button(
                        onClick = {
                            if (pagerState.currentPage < pagerState.pageCount - 1) {
                                coroutineScope.launch {
                                    pagerState.animateScrollToPage(pagerState.currentPage + 1)
                                }
                            } else {
                                onLetsGoButtonClick()
                            }
                        },
                        shape = RoundedCornerShape(8.dp),
                    ) {
                        Text(
                            text = buttonText[page]
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun OnboardingScreenPreview() {
    DriveNextTheme {
        OnboardingScreen(
            onLetsGoButtonClick = {},
            onSkipButtonClick = {}
        )
    }
}
