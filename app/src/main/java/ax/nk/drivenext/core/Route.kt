package ax.nk.drivenext.core

import kotlinx.serialization.Serializable

@Serializable
sealed interface Route {
    @Serializable
    data object LoadingSplashScreen: Route

    @Serializable
    data object NoConnectionScreen: Route

    @Serializable
    data object OnboardingScreen: Route

    @Serializable
    data object GettingStartedScreen: Route

    @Serializable
    data object LoginScreen: Route

    @Serializable
    data object SignUpFirstScreen: Route

    @Serializable
    data object SignUpSecondScreen: Route

    @Serializable
    data object SignUpThirdScreen: Route

    @Serializable
    data object SignUpFourthScreen: Route
}