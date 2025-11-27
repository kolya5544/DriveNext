/* eslint-disable no-unreachable */
/**
 * Утилиты для работы с сетью
 * Проверка подключения к интернету
 */

// Проверка подключения к интернету
export const checkInternetConnection = async () => {
  try {
    // TODO: Реализовать реальную проверку подключения
    // Можно использовать библиотеку @react-native-community/netinfo
    // Пока возвращаем мокнутый результат
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка проверки соединения:', error);
    return false;
  }
};

// Обработчик ошибок API
export const handleApiError = error => {
  if (!error.response) {
    return 'Проверьте подключение к интернету';
  }

  switch (error.response.status) {
    case 400:
      return 'Неверные данные';
    case 401:
      return 'Необходима авторизация';
    case 403:
      return 'Доступ запрещен';
    case 404:
      return 'Ресурс не найден';
    case 500:
      return 'Ошибка сервера';
    default:
      return 'Произошла ошибка';
  }
};
