/**
 * Экран регистрации — шаг 2 (личные данные)
 * Переписанная версия с тем же функционалом
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';

const RegisterStep2Screen = ({ navigation, route }) => {
  const { email, password } = route.params;
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const checkDate = val => /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(val);

  const normalizeDate = text => {
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 8)
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    if (digits.length >= 4) return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
    if (digits.length >= 2) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return digits;
  };

  const handleNextStep = () => {
    const errs = {};
    if (!surname.trim()) errs.surname = 'Введите фамилию';
    if (!name.trim()) errs.name = 'Введите имя';
    if (!dob) errs.dob = 'Введите дату рождения';
    else if (!checkDate(dob)) errs.dob = 'Введите корректную дату';
    if (!sex) errs.sex = 'Выберите пол';

    if (Object.keys(errs).length) return setValidationErrors(errs);

    setValidationErrors({});
    navigation.navigate('RegisterStep3', {
      email,
      password,
      lastName: surname,
      firstName: name,
      middleName: patronymic,
      birthDate: dob,
      gender: sex,
    });
  };

  const formFilled = surname && name && dob && sex;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <View style={[styles.backIcon, { borderColor: colors.text }]} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Регистрация</Text>
          <Text style={[styles.progressText, { color: colors.text }]}>2/3</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/** Фамилия */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Фамилия</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={surname}
                onChangeText={setSurname}
                placeholder="Иванов"
                placeholderTextColor={colors.textGray}
                style={[styles.input, { color: colors.text }]}
                autoCapitalize="words"
              />
            </View>
            {validationErrors.surname && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationErrors.surname}
              </Text>
            )}
          </View>

          {/** Имя */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Имя</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Иван"
                placeholderTextColor={colors.textGray}
                style={[styles.input, { color: colors.text }]}
                autoCapitalize="words"
              />
            </View>
            {validationErrors.name && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationErrors.name}
              </Text>
            )}
          </View>

          {/** Отчество */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Отчество</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={patronymic}
                onChangeText={setPatronymic}
                placeholder="Иванович"
                placeholderTextColor={colors.textGray}
                style={[styles.input, { color: colors.text }]}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/** Дата рождения */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Дата рождения *</Text>
            <View
              style={[
                styles.inputBox,
                { borderColor: colors.border, backgroundColor: colors.background },
              ]}
            >
              <TextInput
                value={dob}
                onChangeText={val => setDob(normalizeDate(val))}
                placeholder="DD.MM.YYYY"
                placeholderTextColor={colors.textGray}
                style={[styles.input, { color: colors.text }]}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            {validationErrors.dob && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationErrors.dob}
              </Text>
            )}
          </View>

          {/** Пол */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Пол</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity style={styles.genderBtn} onPress={() => setSex('male')}>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: sex === 'male' ? colors.primary : colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  {sex === 'male' && (
                    <View style={[styles.radioCheck, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <Text style={[styles.genderLabel, { color: colors.textGray }]}>Мужской</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.genderBtn} onPress={() => setSex('female')}>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: sex === 'female' ? colors.primary : colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  {sex === 'female' && (
                    <View style={[styles.radioCheck, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <Text style={[styles.genderLabel, { color: colors.textGray }]}>Женский</Text>
              </TouchableOpacity>
            </View>
            {validationErrors.sex && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationErrors.sex}
              </Text>
            )}
          </View>
        </View>

        {/* Кнопка Далее */}
        <TouchableOpacity
          onPress={handleNextStep}
          disabled={!formFilled}
          style={[
            styles.nextBtn,
            { backgroundColor: colors.primary },
            !formFilled && styles.disabledBtn,
          ]}
        >
          <Text style={styles.nextText}>Далее</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: { fontSize: 14, fontWeight: '400', lineHeight: 24, flex: 1 },
  genderRow: { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  genderBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCheck: { width: 8, height: 8, borderRadius: 4 },
  genderLabel: { fontSize: 14, fontWeight: '400', lineHeight: 24 },
  nextBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 32,
  },
  disabledBtn: { opacity: 0.6 },
  nextText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 22 },
  errorText: { fontSize: 12, marginTop: 4 },
});

export default RegisterStep2Screen;
