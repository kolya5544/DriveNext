/**
 * Утилиты для валидации данных форм
 */

// Валидация email
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация пароля (минимум 6 символов)
export const validatePassword = password => {
  return password.length >= 6;
};

// Валидация даты в формате MM/DD/YYYY
export const validateDateMMDDYYYY = date => {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return dateRegex.test(date);
};

// Валидация даты в формате DD/MM/YYYY
export const validateDateDDMMYYYY = date => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return dateRegex.test(date);
};

// Валидация номера телефона
export const validatePhone = phone => {
  const phoneRegex = /^[\d\s+\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Проверка пустого значения
export const isEmpty = value => {
  return !value || value.trim().length === 0;
};

// Проверка совпадения паролей
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
