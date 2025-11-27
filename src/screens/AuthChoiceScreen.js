/**
 * Экран выбора действия (Вход/Регистрация)
 * Позволяет пользователю выбрать между входом и регистрацией
 */

import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const AuthChoiceScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={[styles.screenWrapper, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.appTitle, { color: theme.primary }]}>DriveNext</Text>
        <ThemeToggle />
      </View>

      <View style={styles.mainContent}>
        <Image
          source={require('../../assets/images/getting_started.jpg')}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={[styles.tagline, { color: theme.textLight }]}>
          Поможем найти твою следующую поездку
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Войти"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          style={styles.actionButton}
        />
        <Button
          title="Зарегистрироваться"
          onPress={() => navigation.navigate('RegisterStep1')}
          variant="outline"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    padding: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  actions: {
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
  },
});

export default AuthChoiceScreen;
