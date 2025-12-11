// screens/BookingDetailsScreen.js

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import { getBookings, updateBookingStatus } from '../utils/storage';
import { mockGetCarDetails } from '../utils/mockData';
import LoadingIndicator from '../components/LoadingIndicator';
import Button from '../components/Button';

const INSURANCE_FALLBACK = 300;

const formatTime = date =>
  date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDate = date =>
  date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const getDaysCount = (start, end) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((end - start) / msPerDay);
  return diff > 0 ? diff : 1;
};

const BookingDetailsScreen = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const { bookingId } = route.params || {};

  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const all = await getBookings();
        const found = (all || []).find(b => b.id === bookingId);

        if (!found) {
          setLoadError('Бронирование не найдено');
          return;
        }

        setBooking(found);

        if (found.carId) {
          const response = await mockGetCarDetails(found.carId);
          if (response.success) {
            setCar(response.car);
          }
        }
      } catch (e) {
        setLoadError('Не удалось загрузить данные. Попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      load();
    }
  }, [bookingId]);

  const startDate = booking ? new Date(booking.startDate) : null;
  const endDate = booking ? new Date(booking.endDate) : null;
  const daysCount = startDate && endDate ? getDaysCount(startDate, endDate) : 1;

  const pricePerDay = booking?.pricePerDay ?? car?.price ?? 0;
  const insurancePerDay = booking?.insurancePerDay ?? INSURANCE_FALLBACK;

  const rentalTotal = pricePerDay * daysCount;
  const insuranceTotal = insurancePerDay * daysCount;
  const totalAmount = booking?.totalAmount ?? rentalTotal + insuranceTotal;

  const bookingNumber = booking?.bookingNumber || (booking?.id ? booking.id.slice(-6) : '—');

  const driverName = booking?.driverName || 'Иван Иванов';
  const driverLicense = booking?.driverLicense || '45164634';
  const address = booking?.address || car?.address || 'Авиамоторная ул., 8, стр. 2';
  const status = booking?.status || 'Одобрено';

  const now = new Date();
  const isActive = booking && endDate && endDate > now && status !== 'Отменено';

  const handleCancel = async () => {
    if (!booking) return;

    await updateBookingStatus(booking.id, 'Отменено');
    navigation.goBack(); // вернёмся к списку бронирований
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (loadError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
            <Text style={[styles.headerIconText, { color: theme.text }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Бронирование</Text>
          <View style={styles.headerIconButton} />
        </View>

        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{loadError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerIconText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Бронирование # {bookingNumber}
        </Text>

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
            <Text style={[styles.carModel, { color: theme.text }]}>{booking.carModel}</Text>
            {!!booking.carBrand && (
              <Text style={[styles.carBrand, { color: theme.textSecondary }]}>
                {booking.carBrand}
              </Text>
            )}
            <Text style={[styles.carPrice, { color: theme.primary }]}>{pricePerDay}₽ в день</Text>
          </View>

          <View style={styles.carImageContainer}>
            {car?.image ? (
              <Image source={car.image} style={styles.carImage} />
            ) : (
              <View style={[styles.carImagePlaceholder, { backgroundColor: theme.border }]}>
                <Text style={styles.carImageText}>🚗</Text>
              </View>
            )}
          </View>
        </View>

        {/* Основная информация */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Адрес нахождения</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Начало аренды</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {startDate ? `${formatTime(startDate)}, ${formatDate(startDate)}` : '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Конец аренды</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {endDate ? `${formatTime(endDate)}, ${formatDate(endDate)}` : '—'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>ФИО водителя</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{driverName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Номер ВУ</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{driverLicense}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Статус аренды</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{status}</Text>
          </View>
        </View>

        <View style={[styles.separator, { borderBottomColor: theme.border }]} />

        {/* Стоимость */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Аренда ×{daysCount} дн:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{pricePerDay}₽/день</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Страховка ×{daysCount} дн:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>{insurancePerDay}₽/день</Text>
          </View>
        </View>

        <Text style={[styles.totalLabel, { color: theme.text }]}>Общая сумма</Text>
        <Text style={[styles.totalValue, { color: theme.text }]}>{totalAmount}₽</Text>

        {isActive && (
          <View style={styles.footer}>
            <Button
              title="Отменить бронирование"
              onPress={handleCancel}
              variant="primary"
              style={styles.cancelButton}
            />
          </View>
        )}
      </ScrollView>
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

  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginTop: 8,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat',
    marginBottom: 16,
  },

  footer: {
    marginTop: 12,
  },
  cancelButton: {
    width: '100%',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});

export default BookingDetailsScreen;
