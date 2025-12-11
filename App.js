/**
 * Главный компонент приложения DriveNext
 * Инициализирует навигацию и управляет потоком экранов
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Импорт контекста темы
import { ThemeProvider } from './src/context/ThemeContext';

// Импорт экранов
import SplashScreen from './src/screens/SplashScreen';
import NoConnectionScreen from './src/screens/NoConnectionScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthChoiceScreen from './src/screens/AuthChoiceScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterStep1Screen from './src/screens/RegisterStep1Screen';
import RegisterStep2Screen from './src/screens/RegisterStep2Screen';
import RegisterStep3Screen from './src/screens/RegisterStep3Screen';
import RegisterSuccessScreen from './src/screens/RegisterSuccessScreen';
import MainScreen from './src/screens/MainScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchResultsScreen from './src/screens/SearchResultsScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import CarDetailsScreen from './src/screens/CarDetailsScreen';
import RentScreen from './src/screens/RentScreen';
import RentSuccessScreen from './src/screens/RentSuccessScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import BookingDetailsScreen from './src/screens/BookingDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="NoConnection" component={NoConnectionScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="AuthChoice" component={AuthChoiceScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterStep1" component={RegisterStep1Screen} />
          <Stack.Screen name="RegisterStep2" component={RegisterStep2Screen} />
          <Stack.Screen name="RegisterStep3" component={RegisterStep3Screen} />
          <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="Loader" component={LoaderScreen} />
          <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
          <Stack.Screen name="CarDetails" component={CarDetailsScreen} />
          <Stack.Screen name="Rent" component={RentScreen} />
          <Stack.Screen name="RentSuccess" component={RentSuccessScreen} />
          <Stack.Screen name="Bookings" component={BookingsScreen} />
          <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
