/**
 * Цветовая палитра приложения DriveNext
 * Поддерживает светлую и тёмную темы
 */

// СВЕТЛАЯ ТЕМА (оригинальная из Figma)
export const LightTheme = {
  // Основные цвета
  primary: '#2A1246',
  secondary: '#29D6EF',
  background: '#FFFFFF',

  // Текст
  text: '#1A1A1A',
  textLight: 'rgba(0, 0, 0, 0.7)',
  textSecondary: '#404040',
  textGray: '#667085',

  // Статусы
  error: '#E74C3C',
  success: '#27AE60',

  // Границы и элементы
  border: '#D0D5DD',
  borderLight: '#E4E7EC',
  disabled: '#CCCCCC',
  placeholder: '#667085',

  // Градиенты
  gradientBlue: '#1EBAD0',
  gradientBlueDark: '#006482',
  gradientPink: '#D48292',
  gradientPinkLight: '#F4B2BE',
};

// ТЁМНАЯ ТЕМА
export const DarkTheme = {
  // Основные цвета
  primary: '#8B5FBF', // Светлее фиолетовый для темного фона
  secondary: '#29D6EF', // Бирюзовый остаётся ярким
  background: '#121212', // Тёмный фон

  // Текст
  text: '#E8E8E8', // Светлый текст
  textLight: 'rgba(255, 255, 255, 0.7)',
  textSecondary: '#B0B0B0',
  textGray: '#9CA3AF',

  // Статусы
  error: '#FF6B6B', // Немного светлее для контраста
  success: '#4ADE80',

  // Границы и элементы
  border: '#2D2D2D',
  borderLight: '#404040',
  disabled: '#555555',
  placeholder: '#9CA3AF',

  // Градиенты
  gradientBlue: '#1EBAD0',
  gradientBlueDark: '#006482',
  gradientPink: '#D48292',
  gradientPinkLight: '#F4B2BE',
};

// Функция для получения текущей темы
export const getTheme = isDark => {
  return isDark ? DarkTheme : LightTheme;
};

// Для обратной совместимости со старым кодом
export const Colors = LightTheme;
