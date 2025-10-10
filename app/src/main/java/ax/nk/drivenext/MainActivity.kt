package ax.nk.drivenext

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import ax.nk.drivenext.ui.theme.DriveNextTheme

import ax.nk.drivenext.core.Route
import ax.nk.drivenext.presentation.screens.*
import ax.nk.drivenext.presentation.screens.login.*

import ax.nk.drivenext.presentation.screens.signUp.first.*
import ax.nk.drivenext.presentation.screens.signUp.second.*
import ax.nk.drivenext.presentation.screens.signUp.third.*
import ax.nk.drivenext.presentation.screens.signUp.fourth.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        enableEdgeToEdge()
        setContent {
            DriveNextTheme {
                val navController = rememberNavController()
                NavHost (
                    navController = navController,
                    startDestination = Route.LoadingSplashScreen
                ) {
                    composable<Route.LoadingSplashScreen> {
                        LoadingSplashScreen(
                            navController = navController
                        )
                    }

                    composable<Route.NoConnectionScreen> {
                        NoConnectionScreen(
                            onTryAgainButtonClick = { navController.navigate(Route.LoadingSplashScreen) }
                        )
                    }

                    composable<Route.OnboardingScreen> {
                        OnboardingScreen(
                            onLetsGoButtonClick = {
                                navController.navigate(Route.GettingStartedScreen)
                            },
                            onSkipButtonClick = {
                                navController.navigate(Route.GettingStartedScreen)
                            }
                        )
                    }

                    composable<Route.GettingStartedScreen> {
                        GettingStartedScreen(
                            onLogInButtonClick = { navController.navigate(Route.LoginScreen) },
                            onSignUpButtonClick = { navController.navigate(Route.SignUpFirstScreen) }
                        )
                    }

                    composable<Route.LoginScreen> {
                        LoginScreen(
                            onSignUpButtonClick = { navController.navigate(Route.SignUpFirstScreen) },
                            onLoginClick = { navController.navigate(Route.OnboardingScreen) },
                        )
                    }

                    composable<Route.SignUpFirstScreen> {
                        SignUpFirstScreen(
                            onNextButtonClick = { navController.navigate(Route.SignUpSecondScreen) },
                            onBackButtonClick = { navController.navigate(Route.GettingStartedScreen) }
                        )
                    }

                    composable<Route.SignUpSecondScreen> {
                        SignUpSecondScreen(
                            onNextButtonClick = { navController.navigate(Route.SignUpThirdScreen) },
                            onBackButtonClick = { navController.navigate(Route.SignUpFirstScreen) }
                        )
                    }

                    composable<Route.SignUpThirdScreen> {
                        SignUpThirdScreen(
                            onNextButtonClick = { navController.navigate(Route.SignUpFourthScreen) },
                            onBackButtonClick = { navController.navigate(Route.SignUpSecondScreen) }
                        )
                    }

                    composable<Route.SignUpFourthScreen> {
                        SignUpFourthScreen()
                    }
                }
            }
        }
    }
}