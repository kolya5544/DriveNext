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
    model: 'Model 3 2019',
    brand: 'Tesla',
    price: 2500,
    transmission: 'A/T',
    fuel: 'Электро',
    image: require('../../assets/images/car_three.png'),
    seats: 5,
    doors: 4,
    drive: 'RWD',
    address: 'Авиамоторная ул., 8, стр. 2',
    description:
      'Tesla Model 3 2019 оснащена электродвигателем с мгновенным откликом и поддерживает быстрый заряд. Идеально подходит для городской езды и дальних поездок.',
  },
  {
    id: '2',
    model: '3 Series 2020',
    brand: 'BMW',
    price: 2200,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_two.png'),
    seats: 5,
    doors: 4,
    drive: 'RWD',
    address: 'Шоссе Энтузиастов, 12',
    description:
      'BMW 3 Series 2020 сочетает спортивный характер и комфорт. Точный руль и динамичный двигатель делают поездки максимально приятными.',
  },
  {
    id: '3',
    model: 'A4 2018',
    brand: 'Audi',
    price: 1800,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
    drive: 'quattro',
    address: 'Ленинградский проспект, 45',
    description:
      'Audi A4 2018 — сбалансированный седан с фирменным полным приводом quattro и комфортным салоном для длительных поездок.',
  },
  {
    id: '4',
    model: 'Camry 2021',
    brand: 'Toyota',
    price: 1900,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_two.png'),
    seats: 5,
    doors: 4,
    drive: 'FWD',
    address: 'Пресненская наб., 10',
    description:
      'Toyota Camry 2021 — надёжный бизнес-седан с мягкой подвеской и просторным салоном. Подходит для ежедневной эксплуатации.',
  },
  {
    id: '5',
    model: 'K5 2021',
    brand: 'Kia',
    price: 1500,
    transmission: 'A/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_default.png'),
    seats: 5,
    doors: 4,
    drive: 'FWD',
    address: 'Варшавское шоссе, 95',
    description:
      'Kia K5 2021 выделяется ярким дизайном и богатым оснащением. Отличный вариант для комфортных поездок по городу.',
  },
  {
    id: '6',
    model: 'Solaris 2020',
    brand: 'Hyundai',
    price: 1100,
    transmission: 'M/T',
    fuel: 'Бензин',
    image: require('../../assets/images/car_two.png'),
    seats: 5,
    doors: 4,
    drive: 'FWD',
    address: 'Кутузовский проспект, 30',
    description:
      'Hyundai Solaris 2020 — экономичный и практичный автомобиль для повседневных задач с низким расходом топлива.',
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

// Имитация API запроса на получение деталей одного автомобиля
export const mockGetCarDetails = async carId => {
  return new Promise(resolve => {
    setTimeout(() => {
      const car = mockCars.find(c => c.id === String(carId));

      if (car) {
        resolve({ success: true, car });
      } else {
        resolve({ success: false, error: 'Автомобиль не найден' });
      }
    }, 800);
  });
};
// Внутреннее хранилище избранных автомобилей
const favoriteCarIds = new Set();

// Имитация API запроса на добавление/удаление автомобиля из избранного
export const mockToggleFavoriteCar = async carId => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (favoriteCarIds.has(carId)) {
        favoriteCarIds.delete(carId);
        resolve({
          success: true,
          isFavorite: false,
        });
      } else {
        favoriteCarIds.add(carId);
        resolve({
          success: true,
          isFavorite: true,
        });
      }
    }, 500);
  });
};
