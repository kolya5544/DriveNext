/**
 * Экран успешной регистрации
 * Показывает сообщение о завершении регистрации
 */

import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';

const RegisterSuccessScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const currentTheme = getTheme(isDark);

  const goToHome = () => {
    navigation.replace('Home');
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: currentTheme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />

      {/* Заголовок */}
      <View style={styles.headerBox}>
        <Text style={[styles.headerText, { color: currentTheme.text }]}>Регистрация успешна</Text>
      </View>

      {/* Основной контент */}
      <View style={styles.mainContent}>
        {/* Иконка подтверждения */}
        <View style={styles.successBox}>
          <View style={[styles.circle, { backgroundColor: currentTheme.primary }]}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Сообщение */}
        <View style={styles.textBlock}>
          <Text style={[styles.congrats, { color: currentTheme.text }]}>Поздравляем!</Text>
          <Text style={[styles.description, { color: currentTheme.text }]}>
            Вы успешно зарегистрировались в DriveNext. Теперь вы можете арендовать автомобили и
            наслаждаться поездками!
          </Text>
        </View>
      </View>

      {/* Кнопка продолжения */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.actionButton, { backgroundColor: currentTheme.primary }]}
        onPress={goToHome}
      >
        <Text style={styles.actionText}>Начать</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerBox: {
    paddingTop: 64,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  successBox: {
    marginBottom: 32,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: 'bold',
  },
  textBlock: {
    alignItems: 'center',
    gap: 32,
  },
  congrats: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  actionButton: {
    position: 'absolute',
    bottom: 66,
    left: 24,
    right: 24,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});

export default RegisterSuccessScreen;
