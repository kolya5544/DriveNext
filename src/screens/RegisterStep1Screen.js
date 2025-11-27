/**
 * Экран регистрации — шаг 1 (email, пароль, согласие)
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
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';

const RegisterStep1Screen = ({ navigation }) => {
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleNext = () => {
    const errs = {};
    if (!userEmail) errs.email = 'Введите email';
    else if (!validateEmail(userEmail)) errs.email = 'Введите корректный адрес электронной почты';

    if (!password) errs.password = 'Придумайте пароль';
    if (!confirmPwd) errs.confirmPwd = 'Повторите пароль';
    else if (password !== confirmPwd) errs.confirmPwd = 'Пароли не совпадают';

    if (!acceptedTerms) errs.terms = 'Необходимо согласиться с условиями';

    if (Object.keys(errs).length) return setErrors(errs);

    setErrors({});
    navigation.navigate('RegisterStep2', { email: userEmail, password });
  };

  const formValid = userEmail && password && confirmPwd && acceptedTerms;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <View style={[styles.backIcon, { borderColor: colors.text }]} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Регистрация</Text>
          <Text style={[styles.progressText, { color: colors.text }]}>1/3</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/** Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Электронная почта</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="name@example.com"
                placeholderTextColor={colors.textGray}
                style={[styles.input, { color: colors.text }]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
            )}
          </View>

          {/** Пароль */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Придумайте пароль</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Минимум 6 символов"
                placeholderTextColor={colors.textGray}
                secureTextEntry={!showPwd}
                style={[styles.input, { color: colors.text }]}
              />
              <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPwd ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
            )}
          </View>

          {/** Подтверждение пароля */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Повторите пароль</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                placeholder="Повторите пароль"
                placeholderTextColor={colors.textGray}
                secureTextEntry={!showConfirmPwd}
                style={[styles.input, { color: colors.text }]}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPwd(!showConfirmPwd)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeText}>{showConfirmPwd ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPwd && (
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPwd}</Text>
            )}
          </View>

          {/** Чекбокс */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              style={styles.checkbox}
            >
              <View style={[styles.checkboxBox, { borderColor: colors.border }]}>
                {acceptedTerms && (
                  <View style={[styles.checkboxCheck, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              Я согласен с условиями обслуживания и политикой конфиденциальности
            </Text>
          </View>
          {errors.terms && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.terms}</Text>
          )}
        </View>
      </ScrollView>

      {/* Далее */}
      <TouchableOpacity
        onPress={handleNext}
        disabled={!formValid}
        style={[
          styles.nextBtn,
          { backgroundColor: colors.primary },
          !formValid && styles.disabledBtn,
        ]}
      >
        <Text style={styles.nextText}>Далее</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  backIcon: {
    width: 6,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  pageTitle: { fontSize: 20, fontWeight: '600', lineHeight: 24, textAlign: 'center', flex: 1 },
  progressText: { fontSize: 14, fontWeight: '500' },
  form: { gap: 16, marginBottom: 100 },
  inputGroup: { gap: 4 },
  label: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  inputBox: {
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
  input: { fontSize: 14, fontWeight: '400', lineHeight: 24, flex: 1 },
  eyeBtn: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  eyeText: { fontSize: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheck: { width: 12, height: 12, borderRadius: 2 },
  checkboxLabel: { flex: 1, fontSize: 12, fontWeight: '500', lineHeight: 15 },
  nextBtn: {
    position: 'absolute',
    bottom: 66,
    left: 24,
    right: 24,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  disabledBtn: { opacity: 0.6 },
  nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 22 },
  errorText: { fontSize: 12, marginTop: 4 },
});

export default RegisterStep1Screen;
