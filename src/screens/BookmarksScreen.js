/**
 * Экран избранного
 * Список сохранённых автомобилей
 */

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import BottomNavigation from '../components/BottomNavigation';
import LoadingIndicator from '../components/LoadingIndicator';
import Button from '../components/Button';
import { mockGetCars } from '../utils/mockData';
import { getFavoriteCars } from '../utils/storage';

const BookmarksScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [carList, setCarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [favoriteIds, carsResponse] = await Promise.all([getFavoriteCars(), mockGetCars()]);

      if (!carsResponse.success) {
        throw new Error('load_failed');
      }

      const favCars = carsResponse.cars.filter(car => favoriteIds.includes(car.id));

      setCarList(favCars);
    } catch (e) {
      setLoadError('Не удалось загрузить данные. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // обновляем список при каждом фокусе экрана
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const bookCar = id => {
    navigation.navigate('Rent', { carId: id });
  };

  const viewCarDetails = id => {
    navigation.navigate('CarDetails', { carId: id });
  };

  const renderCarItem = car => (
    <View key={car.id} style={[styles.carCard, { borderColor: theme.border }]}>
      <View style={styles.carInfo}>
        <View style={styles.carHeader}>
          <Text numberOfLines={1} style={[styles.carModel, { color: theme.text }]}>
            {car.model}
          </Text>
          <Text numberOfLines={1} style={[styles.carBrand, { color: theme.textLight }]}>
            {car.brand}
          </Text>
        </View>
        <Text style={[styles.carPrice, { color: theme.text }]}>{car.price}₽ в день</Text>
        <View style={styles.carSpecs}>
          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⚙️</Text>
            <Text style={[styles.specText, { color: theme.textSecondary }]}>
              {car.transmission}
            </Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⛽</Text>
            <Text style={[styles.specText, { color: theme.textSecondary }]}>{car.fuel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.carImageContainer}>
        {car.image ? (
          <Image source={car.image} style={styles.carImage} resizeMode="cover" />
        ) : (
          <View style={[styles.carImagePlaceholder, { backgroundColor: theme.border }]}>
            <Text style={styles.carImageText}>🚗</Text>
          </View>
        )}
      </View>

      <View style={styles.carActions}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
          onPress={() => bookCar(car.id)}
        >
          <Text numberOfLines={1} style={styles.bookButtonText}>
            Забронировать
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: theme.primary }]}
          onPress={() => viewCarDetails(car.id)}
        >
          <Text numberOfLines={1} style={[styles.detailsButtonText, { color: theme.text }]}>
            Детали
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const navigateTab = tabName => {
    if (tabName === 'home') navigation.navigate('Home');
    else if (tabName === 'settings') navigation.navigate('Settings');
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Избранное</Text>
      </View>

      {/* Контент */}
      {isLoading ? (
        <LoadingIndicator />
      ) : loadError ? (
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: theme.error }]}>{loadError}</Text>
          <Button
            title="Попробовать снова"
            onPress={loadFavorites}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      ) : carList.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            У вас пока нет избранных автомобилей
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textLight }]}>
            Добавьте авто в избранное с экрана деталей
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {carList.map(renderCarItem)}
        </ScrollView>
      )}

      <BottomNavigation activeTab="bookmarks" onTabPress={navigateTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, gap: 16 },

  carCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  carInfo: { gap: 12 },
  carHeader: { gap: 2 },
  carModel: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
  carBrand: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
    fontFamily: 'Montserrat',
    opacity: 0.2,
  },
  carPrice: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    fontFamily: 'Montserrat',
    letterSpacing: 0.01,
  },
  carSpecs: { flexDirection: 'row', gap: 12 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specIcon: { fontSize: 16 },
  specText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
    fontFamily: 'Montserrat',
    letterSpacing: 0.02,
  },
  carImageContainer: { alignItems: 'flex-end' },
  carImagePlaceholder: {
    width: 176,
    height: 136,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: { width: 176, height: 136, borderRadius: 8 },
  carImageText: { fontSize: 48 },
  carActions: { flexDirection: 'row', gap: 12 },
  bookButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Montserrat',
    color: '#FFFFFF',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Montserrat',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  retryButton: { minWidth: 200 },
});

export default BookmarksScreen;
