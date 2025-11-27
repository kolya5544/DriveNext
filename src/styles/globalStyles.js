/**
 * Глобальные стили приложения (из Figma)
 */
import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },

  // Текстовые стили из Figma
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 29,
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 17,
    fontFamily: 'Montserrat',
  },
  supportingText: {
    fontSize: 14,
    color: Colors.textGray,
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },

  // Логотип
  logo: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    lineHeight: 29,
    fontFamily: 'Montserrat',
  },

  // Кнопки из Figma
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },

  // eslint-disable-next-line react-native/no-color-literals
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },

  // Поля ввода из Figma
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  // eslint-disable-next-line react-native/no-color-literals
  inputField: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textGray,
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },

  // Индикаторы прогресса
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
  },
  progressDotActive: {
    width: 40,
    backgroundColor: Colors.primary,
  },
  carIcon: {
    width: '30%',
    height: '30%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // чтобы изображение не вылезало за круг
  },
});
