/**
 * Экран загрузки поиска автомобилей
 * Отображается во время выполнения поиска
 */

import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const LoaderScreen = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Car Icon */}
      <View style={styles.carIconContainer}>
        <Image
          source={require('../../assets/images/loader_car.png')}
          style={styles.carIcon}
          resizeMode="contain"
        />
      </View>

      <Text style={[styles.loadingText, { color: theme.text }]}>Ищем подходящие автомобили</Text>

      <ActivityIndicator size="small" color={theme.primary} style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 54,
    gap: 32,
  },
  carIconContainer: {
    width: 150,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carIcon: {
    width: 110,
    height: 110,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  spinner: {
    marginTop: 16,
  },
});

export default LoaderScreen;
