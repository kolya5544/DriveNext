/* eslint-disable no-console */
/**
 * Утилиты для работы с локальным хранилищем
 * Сохранение и получение данных (токены, настройки)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@access_token',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  USER_DATA: '@user_data',
  THEME: '@theme',
  NOTIFICATIONS_ENABLED: '@notifications_enabled',
};

// Сохранение токена
export const saveToken = async token => {
  try {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
    return false;
  }
};

// Получение токена
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('Ошибка получения токена:', error);
    return null;
  }
};

// Удаление токена (выход из системы)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
    return true;
  } catch (error) {
    console.error('Ошибка удаления токена:', error);
    return false;
  }
};

// Сохранение флага завершения onboarding
export const setOnboardingCompleted = async () => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
    return true;
  } catch (error) {
    console.error('Ошибка сохранения onboarding:', error);
    return false;
  }
};

// Проверка завершения onboarding
export const isOnboardingCompleted = async () => {
  try {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Ошибка проверки onboarding:', error);
    return false;
  }
};

// Сохранение данных пользователя
export const saveUserData = async userData => {
  try {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Ошибка сохранения данных пользователя:', error);
    return false;
  }
};

// Получение данных пользователя
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    return null;
  }
};

// Очистка всех данных
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Ошибка очистки данных:', error);
    return false;
  }
};

// Сохранение темы
export const saveTheme = async theme => {
  try {
    await AsyncStorage.setItem(KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения темы:', error);
    return false;
  }
};

// Получение темы
export const loadTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(KEYS.THEME);
    return theme;
  } catch (error) {
    console.error('Ошибка загрузки темы:', error);
    return null;
  }
};

// Сохранение настроек уведомлений
export const saveNotificationsEnabled = async enabled => {
  try {
    await AsyncStorage.setItem(KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(enabled));
    return true;
  } catch (error) {
    console.error('Ошибка сохранения настроек уведомлений:', error);
    return false;
  }
};

// Получение настроек уведомлений
export const getNotificationsEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(KEYS.NOTIFICATIONS_ENABLED);
    return value ? JSON.parse(value) : true; // По умолчанию включены
  } catch (error) {
    console.error('Ошибка получения настроек уведомлений:', error);
    return true;
  }
};
