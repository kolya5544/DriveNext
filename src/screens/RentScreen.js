// screens/RentScreen.js

import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import { mockGetCarDetails } from '../utils/mockData';
import Button from '../components/Button';
import BottomNavigation from '../components/BottomNavigation';
import { addBooking } from '../utils/storage';
import { getUserData } from '../utils/storage';

const INSURANCE_PER_DAY = 300;
const DEPOSIT_AMOUNT = 15000;

const formatDateTime = date => {
  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return `${time}, ${dateStr}`;
};

const getDaysCount = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((end - start) / msPerDay);
  return diff > 0 ? diff : 1;
};

const RentScreen = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const { carId } = route.params || {};

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await mockGetCarDetails(carId);
        if (response.success) {
          setCar(response.car);
        } else {
          setLoadError('Не удалось загрузить данные. Попробуйте снова.');
        }
      } catch (e) {
        setLoadError('Не удалось загрузить данные. Попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    };

    if (carId) {
      loadCar();
    }
  }, [carId]);

  useEffect(() => {
    const loadUser = async () => {
      const info = await getUserData();
      setUserData(info);
    };

    loadUser();
  }, []);

  const safeCar = car || {
    model: 'Неизвестный автомобиль',
    brand: '',
    price: 0,
    image: null,
    address: 'Адрес не указан',
  };

  // базовые даты: сегодня и сегодня + 3 дня в 08:00
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0);
  });

  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0);
    base.setDate(base.getDate() + 3);
    return base;
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const daysCount = useMemo(() => getDaysCount(startDate, endDate), [startDate, endDate]);

  const pricePerDay = safeCar?.price ?? 0;
  const rentalTotal = pricePerDay * daysCount;
  const insuranceTotal = INSURANCE_PER_DAY * daysCount;
  const totalAmount = rentalTotal + insuranceTotal;

  const handleChangeStartDate = () => {
    setShowStartPicker(true);
  };

  const handleChangeEndDate = () => {
    setShowEndPicker(true);
  };

  const onChangeStartDate = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowStartPicker(false);
    }
    if (event.type === 'dismissed') return;

    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);

    // если конец раньше начала — сдвигаем конец
    if (currentDate >= endDate) {
      const newEnd = new Date(currentDate);
      newEnd.setDate(newEnd.getDate() + 3);
      setEndDate(newEnd);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowEndPicker(false);
    }
    if (event.type === 'dismissed') return;

    const currentDate = selectedDate || endDate;
    // не даём выбрать дату раньше старта
    if (currentDate <= startDate) {
      const minEnd = new Date(startDate);
      minEnd.setDate(minEnd.getDate() + 1);
      setEndDate(minEnd);
    } else {
      setEndDate(currentDate);
    }
  };

  const handleContinue = async () => {
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const driverFullName = userData
      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Иван Иванов'
      : 'Иван Иванов';

    const driverLicenseNumber = userData?.licenseNumber || '45164634';

    const booking = {
      id: Date.now().toString(),
      bookingNumber,
      carId: safeCar.id,
      carModel: safeCar.model,
      carBrand: safeCar.brand,
      pricePerDay,
      insurancePerDay: INSURANCE_PER_DAY,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      address: safeCar.address,
      driverName: driverFullName,
      driverLicense: driverLicenseNumber,
      status: 'Одобрено',
      totalAmount,
    };

    await addBooking(booking);

    navigation.navigate('RentSuccess', {
      bookingId: booking.id,
      car: safeCar,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalAmount,
      deposit: DEPOSIT_AMOUNT,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerIconText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Оформление аренды</Text>

        <View style={styles.headerIconButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Карточка автомобиля */}
        <View
          style={[
            styles.carCard,
            {
              borderColor: theme.border,
              backgroundColor: theme.card || '#FFFFFF',
            },
          ]}
        >
          <View style={styles.carInfo}>
            <Text style={[styles.carModel, { color: theme.text }]}>{safeCar.model}</Text>
            {!!safeCar.brand && (
              <Text style={[styles.carBrand, { color: theme.textSecondary }]}>{safeCar.brand}</Text>
            )}
            <Text style={[styles.carPrice, { color: theme.primary }]}>{safeCar.price}₽ в день</Text>
          </View>

          <View style={styles.carImageContainer}>
            {safeCar.image ? (
              <Image source={safeCar.image} style={styles.carImage} />
            ) : (
              <View style={[styles.carImagePlaceholder, { backgroundColor: theme.border }]}>
                <Text style={styles.carImageText}>🚗</Text>
              </View>
            )}
          </View>
        </View>

        {/* Даты аренды */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={handleChangeStartDate} activeOpacity={0.7}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Начало аренды:</Text>
            <Text style={[styles.rowValue, { color: theme.text }]}>
              {formatDateTime(startDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={handleChangeEndDate} activeOpacity={0.7}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Конец аренды:</Text>
            <Text style={[styles.rowValue, { color: theme.text }]}>{formatDateTime(endDate)}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.separator, { borderBottomColor: theme.border }]} />

        {/* Адрес */}
        <View style={styles.section}>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.addressText, { color: theme.text }]}>
                {safeCar.address || 'Адрес не указан'}
              </Text>
              <Text style={[styles.addressLabel, { color: theme.textSecondary }]}>
                Адрес нахождения
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.separator, { borderBottomColor: theme.border }]} />

        {/* Стоимость */}
        <View style={styles.section}>
          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>
              Аренда автомобиля ×{daysCount} дн.:
            </Text>
            <Text style={[styles.costValue, { color: theme.text }]}>{pricePerDay}₽/день</Text>
          </View>

          <View style={styles.costRow}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>
              Страховка ×{daysCount} дн.:
            </Text>
            <Text style={[styles.costValue, { color: theme.text }]}>{INSURANCE_PER_DAY}₽/день</Text>
          </View>
        </View>

        {/* Итоговый блок */}
        <View style={[styles.summaryCard, { backgroundColor: '#F9F5FF' }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>Итого</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{totalAmount}₽</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLink, { color: theme.primary }]}>Возвращаемый депозит</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{DEPOSIT_AMOUNT}₽</Text>
          </View>
        </View>
      </ScrollView>

      {/* ПИКЕРЫ ДАТ */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChangeStartDate}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChangeEndDate}
        />
      )}

      {/* Кнопка «Продолжить» */}
      <View style={styles.footer}>
        <Button
          title="Продолжить"
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
        />
      </View>

      <BottomNavigation
        activeTab="home"
        onTabPress={tab => {
          if (tab === 'settings') navigation.navigate('Settings');
          else if (tab === 'bookmarks') navigation.navigate('Bookmarks');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  headerIconButton: {
    padding: 8,
    minWidth: 32,
    alignItems: 'flex-start',
  },
  headerIconText: {
    fontSize: 22,
  },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  carCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carInfo: {
    flex: 1,
    gap: 4,
  },
  carModel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  carBrand: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  carPrice: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginTop: 8,
  },
  carImageContainer: {
    marginLeft: 12,
    width: 120,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  carImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImageText: {
    fontSize: 36,
  },

  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    marginTop: 4,
  },

  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  costLabel: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
  costValue: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },

  summaryCard: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  summaryLink: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    textDecorationLine: 'underline',
  },

  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  continueButton: {
    width: '100%',
  },
});

export default RentScreen;
