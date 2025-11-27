/**
 * Мокнутые данные для тестирования
 * В дальнейшем будут заменены на реальные API запросы
 */

// Мокнутый пользователь для тестирования
export const mockUser = {
  id: '1',
  email: 'ivan@mtuci.ru',
  firstName: 'Иван',
  lastName: 'Иванов',
  middleName: 'Иванович',
  birthDate: '01/15/1990',
  gender: 'Мужской',
  genderValue: 'male',
  profilePhoto: null,
  licenseNumber: '1234 567890',
  licenseIssueDate: '15/06/2020',
  googleEmail: 'ivanov@gmail.com',
  joinDate: 'июль 2024',
};

// Мокнутый токен
export const mockToken = 'mock_access_token_12345';

// Тестовые учетные данные для входа (любые email/пароль, но для демо используем эти)
export const TEST_CREDENTIALS = {
  email: 'ivan@mtuci.ru',
  password: '123456', // Любой пароль подойдет
};

// Имитация API запроса на вход
export const mockLogin = async (email, password) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Принимает любой email и пароль, но рекомендуем использовать test@example.com или ivan@mtuci.ru
      if (email && password) {
        // Используем данные из mockUser или создаем на основе email
        const userEmail = email.toLowerCase();
        resolve({
          success: true,
          token: mockToken,
          user: {
            ...mockUser,
            email: userEmail,
            // Если email отличается, создаем имя на его основе
            firstName: userEmail.includes('ivan') ? 'Иван' : mockUser.firstName,
            lastName: userEmail.includes('ivanov') ? 'Иванов' : mockUser.lastName,
          },
        });
      } else {
        resolve({
          success: false,
          error: 'Неверный email или пароль',
        });
      }
    }, 1000);
  });
};

// Имитация API запроса на регистрацию
export const mockRegister = async userData => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (userData.email && userData.password) {
        resolve({
          success: true,
          token: mockToken,
          user: { ...mockUser, ...userData },
        });
      } else {
        resolve({
          success: false,
          error: 'Ошибка регистрации',
        });
      }
    }, 1500);
  });
};

// Имитация проверки подключения к интернету
export const mockCheckConnection = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ connected: true });
    }, 500);
  });
};

// Мокнутые данные об автомобилях
export const mockCars = [
  {
    id: '1',
    model: 'S 500 Sedan',
    brand: 'Mercedes-Benz',
    price: 2500,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
  },
  {
    id: '2',
    model: 'GLE 350',
    brand: 'Mercedes-Benz',
    price: 900,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
    drive: '4WD',
  },
  {
    id: '3',
    model: 'E 200',
    brand: 'Mercedes-Benz',
    price: 1800,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
  },
  {
    id: '4',
    model: 'C 300',
    brand: 'Mercedes-Benz',
    price: 2000,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
  },
];

// Имитация API запроса на получение списка автомобилей
export const mockGetCars = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        cars: mockCars,
      });
    }, 1500);
  });
};

// Имитация API запроса на поиск автомобилей
export const mockSearchCars = async query => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = mockCars.filter(
        car =>
          car.brand.toLowerCase().includes(query.toLowerCase()) ||
          car.model.toLowerCase().includes(query.toLowerCase()),
      );
      resolve({
        success: true,
        cars: filtered,
      });
    }, 1500);
  });
};
