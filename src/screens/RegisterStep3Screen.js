/**
 * Экран регистрации — шаг 3 (загрузка фото и документов)
 * Переписанная версия (тот же функционал, другой код)
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
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import { saveUserData } from '../utils/storage';

const RegisterStep3Screen = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const { email, password, firstName, lastName, middleName, birthDate, gender } = route.params;

  const [driverNumber, setDriverNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [photoProfile, setPhotoProfile] = useState(null);
  const [photoLicense, setPhotoLicense] = useState(null);
  const [photoPassport, setPhotoPassport] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  // Вспомогательные функции
  const checkDate = val => /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(val);

  const normalizeDate = value => {
    const digits = value.replace(/\D/g, '');
    const d = digits.slice(0, 8);
    if (d.length >= 5) return `${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4)}`;
    if (d.length >= 3) return `${d.slice(0, 2)}.${d.slice(2)}`;
    return d;
  };

  const pickImage = async target => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert(
          'Требуется разрешение',
          'Разрешите доступ к галерее для загрузки изображения',
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;
      const uri = result.assets[0].uri;

      if (target === 'profile') setPhotoProfile({ uri });
      if (target === 'license') setPhotoLicense({ uri });
      if (target === 'passport') setPhotoPassport({ uri });
    } catch (err) {
      console.error('Ошибка выбора изображения:', err);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };

  const onSubmit = async () => {
    const errs = {};

    if (!driverNumber.trim()) errs.driverNumber = 'Введите номер ВУ';
    if (!issueDate) errs.issueDate = 'Введите дату выдачи';
    else if (!checkDate(issueDate)) errs.issueDate = 'Некорректная дата';
    if (!photoLicense) errs.photoLicense = 'Загрузите фото ВУ';
    if (!photoPassport) errs.photoPassport = 'Загрузите фото паспорта';

    if (Object.keys(errs).length) return setFormErrors(errs);

    setFormErrors({});
    setIsSending(true);

    try {
      // сохраняем профиль пользователя локально
      await saveUserData({
        firstName,
        lastName,
        middleName,
        birthDate,
        gender,
        email,
        avatarUri: photoProfile?.uri || null,
      });

      // имитация отправки на сервер, как было
      setTimeout(() => {
        setIsSending(false);
        navigation.replace('RegisterSuccess');
      }, 2000);
    } catch (e) {
      console.error('Ошибка сохранения профиля:', e);
      setIsSending(false);
      Alert.alert('Ошибка', 'Не удалось сохранить профиль. Попробуйте ещё раз.');
    }
  };

  const formComplete = driverNumber && issueDate && photoLicense && photoPassport;

  return (
    <KeyboardAvoidingView
      style={[styles.wrapper, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Шапка */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <View style={[styles.arrow, { borderColor: colors.text }]} />
          </TouchableOpacity>

          <Text style={[styles.pageTitle, { color: colors.text }]}>Регистрация</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Контент */}
        <View style={styles.main}>
          {/* Фото профиля */}
          <View style={styles.photoBlock}>
            <TouchableOpacity
              onPress={() => pickImage('profile')}
              style={[styles.avatar, { borderColor: colors.border }]}
            >
              <View style={styles.avatarPlaceholder}>
                <View style={[styles.avatarHead, { borderColor: colors.border }]} />
                <View style={[styles.avatarBody, { borderColor: colors.border }]} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.photoHint, { color: colors.text }]}>
              Добавьте фото, чтобы арендаторы и владельцы могли узнать вас при встрече
            </Text>
          </View>

          {/* Поле номер ВУ */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Номер водительского удостоверения
            </Text>
            <View
              style={[
                styles.fieldBox,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <TextInput
                value={driverNumber}
                onChangeText={setDriverNumber}
                style={[styles.input, { color: colors.text }]}
                placeholder="1234 567890"
                placeholderTextColor={colors.textGray}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Поле дата выдачи */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Дата выдачи *</Text>
            <View
              style={[
                styles.fieldBox,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <TextInput
                value={issueDate}
                onChangeText={val => setIssueDate(normalizeDate(val))}
                style={[styles.input, { color: colors.text }]}
                placeholder="DD.MM.YYYY"
                placeholderTextColor={colors.textGray}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* Загрузка ВУ */}
          <View style={styles.uploadSection}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Загрузить фото ВУ</Text>
            <View style={styles.uploadRow}>
              <TouchableOpacity
                style={[styles.uploadBtn, { borderColor: colors.textGray }]}
                onPress={() => pickImage('license')}
              >
                <View style={styles.uploadIcon}>
                  <View style={[styles.uploadArrow, { borderColor: colors.textGray }]} />
                </View>
              </TouchableOpacity>
              <Text style={[styles.uploadText, { color: colors.textGray }]}>Загрузить фото</Text>
            </View>
          </View>

          {/* Загрузка паспорта */}
          <View style={styles.uploadSection}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Загрузить фото паспорта
            </Text>
            <View style={styles.uploadRow}>
              <TouchableOpacity
                style={[styles.uploadBtn, { borderColor: colors.textGray }]}
                onPress={() => pickImage('passport')}
              >
                <View style={styles.uploadIcon}>
                  <View style={[styles.uploadArrow, { borderColor: colors.textGray }]} />
                </View>
              </TouchableOpacity>
              <Text style={[styles.uploadText, { color: colors.textGray }]}>Загрузить фото</Text>
            </View>
          </View>
        </View>

        {/* Кнопка Далее */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!formComplete || isSending}
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primary },
            (!formComplete || isSending) && styles.disabledBtn,
          ]}
        >
          <Text style={styles.submitText}>{isSending ? 'Загрузка...' : 'Далее'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 6,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  placeholder: { width: 24 },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    flex: 1,
  },
  main: { gap: 16, marginBottom: 120 },
  photoBlock: { alignItems: 'center', gap: 32, marginBottom: 16 },
  avatar: {
    width: 128,
    height: 128,
    borderWidth: 4,
    borderRadius: 64,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  avatarPlaceholder: { alignItems: 'center', gap: 21 },
  avatarHead: { width: 42, height: 42, borderWidth: 5, borderRadius: 21 },
  avatarBody: {
    width: 74,
    height: 32,
    borderWidth: 5,
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
  },
  photoHint: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'center',
  },
  fieldGroup: { gap: 4 },
  label: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  fieldBox: {
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
  uploadSection: { gap: 4 },
  uploadRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  uploadBtn: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: { width: 18, height: 18 },
  uploadArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginTop: 5,
  },
  uploadText: { fontSize: 14, fontWeight: '400', lineHeight: 24 },
  submitBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 32,
  },
  disabledBtn: { opacity: 0.6 },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});

export default RegisterStep3Screen;
