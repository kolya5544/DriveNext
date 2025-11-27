/**
 * Контекст темы приложения
 * Управляет переключением между светлой и тёмной темой
 */
import { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { loadTheme, saveTheme } from '../utils/storage';

// Создаём контекст
const ThemeContext = createContext();

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme(); // Получаем системную тему
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Загружаем сохранённую тему при запуске
  useEffect(() => {
    const loadSavedTheme = async () => {
      const savedTheme = await loadTheme();
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    };
    loadSavedTheme();
  }, []);

  // Функция переключения темы
  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await saveTheme(newTheme ? 'dark' : 'light');
  };

  return <ThemeContext.Provider value={{ isDark, toggleTheme }}>{children}</ThemeContext.Provider>;
};

// Хук для использования темы в компонентах
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};
