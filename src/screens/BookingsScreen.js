// screens/BookingsScreen.js

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import { getBookings } from '../utils/storage';
import LoadingIndicator from '../components/LoadingIndicator';

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

const formatDateOnly = date => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const BookingsScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookings = async () => {
    setIsLoading(true);
    const data = await getBookings();
    setBookings(Array.isArray(data) ? data : []);
    setIsLoading(false);
  };

  // перезагружаем список при каждом фокусе экрана
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBookings);
    return unsubscribe;
  }, [navigation]);

  const items = useMemo(() => {
    const now = new Date();
    return bookings
      .map(b => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        const isActive = end > now;

        return {
          ...b,
          start,
          end,
          isActive,
        };
      })
      .sort((a, b) => {
        // активные вперёд
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        // внутри группы — по дате начала, новые выше
        return b.start - a.start;
      });
  }, [bookings]);

  const handleBookingPress = booking => {
    if (!booking.isActive) return;
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const renderBooking = booking => {
    const title = booking.carBrand ? `${booking.carBrand} ${booking.carModel}` : booking.carModel;

    const subtitle = booking.isActive
      ? `Начало аренды: ${formatDateTime(booking.start)}`
      : `Аренда завершена, ${formatDateOnly(booking.end)}`;

    return (
      <TouchableOpacity
        key={booking.id}
        onPress={() => handleBookingPress(booking)}
        activeOpacity={booking.isActive ? 0.7 : 1}
        style={styles.bookingItem}
      >
        <Text style={[styles.bookingTitle, { color: theme.text }]}>{title}</Text>
        <Text
          style={[
            styles.bookingSubtitle,
            { color: booking.isActive ? theme.primary : theme.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerIconText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Мои бронирования</Text>

        <View style={styles.headerIconButton} />
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            У вас пока нет бронирований
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {items.map(renderBooking)}
        </ScrollView>
      )}
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

  bookingItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  bookingTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginBottom: 4,
  },
  bookingSubtitle: {
    fontSize: 13,
    fontFamily: 'Montserrat',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});

export default BookingsScreen;
