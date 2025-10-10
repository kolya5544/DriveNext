package ax.nk.drivenext.presentation.screens

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import ax.nk.drivenext.R
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavController
import ax.nk.drivenext.core.AppPreferences
import ax.nk.drivenext.core.Route
import ax.nk.drivenext.ui.theme.Purple40
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first

fun isNetworkAvailable(context: Context): Boolean {
    val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    val network = cm.activeNetwork ?: return false
    val caps = cm.getNetworkCapabilities(network) ?: return false

    // Интернет есть, если сеть реально даёт доступ наружу
    return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
            caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
}

@Composable
fun LoadingSplashScreen(
    navController: NavController,
) {
    val context = LocalContext.current
    val prefs = remember { AppPreferences(context) }

    LaunchedEffect(Unit) {
        delay(2000)

        if (!isNetworkAvailable(context)) {
            navController.navigate(Route.NoConnectionScreen) {
                popUpTo(Route.LoadingSplashScreen) { inclusive = true }
            }
            return@LaunchedEffect
        }

        val isFirstLaunch = prefs.isFirstLaunch.first()

        val nextRoute = if (isFirstLaunch) {
            prefs.setFirstLaunchDone()
            Route.OnboardingScreen
        } else {
            Route.GettingStartedScreen
        }

        navController.navigate(nextRoute) {
            popUpTo(Route.LoadingSplashScreen) { inclusive = true }
        }
    }

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
    }
}