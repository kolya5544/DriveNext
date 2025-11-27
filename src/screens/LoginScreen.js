/**
 * Экран входа в аккаунт (из Figma дизайна)
 * Форма авторизации пользователя с email и паролем
 * Также поддерживает вход через Google
 */
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { mockLogin } from '../utils/mockData';
import { saveToken, saveUserData, getUserData } from '../utils/storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Введите email';
    else if (!validateEmail(email)) newErrors.email = 'Введите корректный адрес электронной почты';
    if (!password) newErrors.password = 'Введите пароль';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await mockLogin(email, password);
      setLoading(false);

      if (result.success) {
        await saveToken(result.token);

        const existingProfile = await getUserData();
        const userFromServer = result.user || {};
        const base = existingProfile || {};

        const mergedProfile = {
          // Если пользователь уже регистрировался — оставляем его данные
          firstName: base.firstName || userFromServer.firstName,
          lastName: base.lastName || userFromServer.lastName,
          middleName: base.middleName || userFromServer.middleName,
          email: base.email || userFromServer.email || email,
          avatarUri: base.avatarUri || userFromServer.avatarUri || null,

          gender:
            base.gender ||
            userFromServer.gender ||
            (userFromServer.genderValue === 'male'
              ? 'Мужской'
              : userFromServer.genderValue === 'female'
                ? 'Женский'
                : undefined),

          googleEmail:
            base.googleEmail ||
            userFromServer.googleEmail ||
            `${(base.firstName || userFromServer.firstName || 'user').toLowerCase()}ov@gmail.com`,

          joinDate: base.joinDate || userFromServer.joinDate || 'июль 2024',
        };

        await saveUserData(mergedProfile);
        navigation.replace('Home');
      } else {
        setErrors({
          general: result.error || 'Ошибка входа. Попробуйте снова.',
        });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ general: 'Ошибка соединения. Попробуйте снова.' });
    }
  };

  const handleGoogleLogin = () => {
    console.log('Вход через Google');
    navigation.replace('Home');
  };

  const isFormValid = email && password;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Вход в аккаунт</Text>
          <Text style={[styles.subtitle, { color: theme.textGray }]}>
            Введите свои данные для входа
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Электронная почта
            </Text>
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.inputText, { color: theme.text }]}
                placeholder="name@example.com"
                placeholderTextColor={theme.textGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Пароль</Text>
            <View
              style={[
                styles.inputField,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                style={[styles.inputText, { color: theme.text }]}
                placeholder="Введите пароль"
                placeholderTextColor={theme.textGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.forgotPasswordRow}>
            <TouchableOpacity>
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Забыли пароль?
              </Text>
            </TouchableOpacity>
          </View>

          {errors.general && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.general}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: theme.primary },
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.primaryButtonText}>{loading ? 'Вход...' : 'Войти'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: theme.background, borderColor: theme.border },
            ]}
            onPress={handleGoogleLogin}
          >
            <View style={styles.googleIcon}>
              <View style={styles.googleIconBlue} />
              <View style={styles.googleIconGreen} />
              <View style={styles.googleIconYellow} />
              <View style={styles.googleIconRed} />
            </View>
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Войти через Google
            </Text>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={[styles.registerText, { color: theme.text }]}>Нет аккаунта? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterStep1')}>
              <Text style={[styles.registerLink, { color: theme.primary }]}>
                Зарегистрироваться
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  scrollView: { flex: 1 },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 138,
    paddingBottom: 20,
  },
  header: { marginBottom: 64 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, lineHeight: 24, textAlign: 'center' },
  form: { marginBottom: 32 },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 4,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: { fontSize: 14, fontWeight: '400', lineHeight: 24, flex: 1 },
  eyeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconText: { fontSize: 16 },
  forgotPasswordRow: { alignItems: 'center', marginTop: 20 },
  forgotPasswordText: { fontSize: 14, fontWeight: '500' },
  errorContainer: { marginTop: 16, paddingVertical: 8 },
  errorText: { fontSize: 14, fontWeight: '400', textAlign: 'center' },
  actions: { gap: 12 },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
  },
  disabledButton: { opacity: 0.6 },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: { width: 20, height: 20, position: 'relative' },
  googleIconBlue: {
    position: 'absolute',
    left: '51%',
    right: '0.98%',
    top: '40.99%',
    bottom: '12.07%',
    backgroundColor: '#4285F4',
  },
  googleIconGreen: {
    position: 'absolute',
    left: '6.32%',
    right: '15.86%',
    top: '59.58%',
    bottom: '0%',
    backgroundColor: '#34A853',
  },
  googleIconYellow: {
    position: 'absolute',
    left: '1%',
    right: '77.07%',
    top: '27.56%',
    bottom: '27.54%',
    backgroundColor: '#FBBC04',
  },
  googleIconRed: {
    position: 'absolute',
    left: '6.32%',
    right: '15.54%',
    top: '0%',
    bottom: '59.56%',
    backgroundColor: '#EA4335',
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '500', lineHeight: 24 },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: { fontSize: 14, fontWeight: '500' },
  registerLink: { fontSize: 14, fontWeight: '500' },
});

export default LoginScreen;
