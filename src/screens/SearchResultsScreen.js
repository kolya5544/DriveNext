/**
 * Экран с результатами поиска автомобилей
 * Отображает найденные машины по запросу пользователя
 */
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';
import { mockSearchCars } from '../utils/mockData';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import LoaderScreen from './LoaderScreen';

const SearchResultsScreen = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [foundCars, setFoundCars] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const query = route?.params?.query ?? '';

  const fetchResults = async term => {
    setIsFetching(true);
    setFetchError(null);

    try {
      const response = await mockSearchCars(term);
      if (response.success) {
        setFoundCars(response.cars);
      } else {
        setFetchError('Ошибка при выполнении поиска. Попробуйте позже.');
      }
    } catch {
      setFetchError('Ошибка при выполнении поиска. Попробуйте позже.');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const retrySearch = () => {
    if (query) fetchResults(query);
  };

  const openBooking = id => {
    console.log('Забронировать автомобиль:', id);
    // navigation.navigate('Booking', { id });
  };

  const openDetails = id => {
    console.log('Открыть детали автомобиля:', id);
    // navigation.navigate('CarDetails', { id });
  };

  const renderCarItem = item => (
    <View key={item.id} style={[styles.carCard, { borderColor: theme.border }]}>
      <View style={styles.carInfo}>
        <View style={styles.carHeader}>
          <Text numberOfLines={1} style={[styles.carModel, { color: theme.text }]}>
            {item.model}
          </Text>
          <Text numberOfLines={1} style={[styles.carBrand, { color: theme.textLight }]}>
            {item.brand}
          </Text>
        </View>

        <Text style={[styles.carPrice, { color: theme.text }]}>{item.price}₽ в день</Text>

        <View style={styles.carSpecs}>
          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⚙️</Text>
            <Text style={[styles.specText, { color: theme.textSecondary }]}>
              {item.transmission}
            </Text>
          </View>

          {item.seats && (
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>👤</Text>
              <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.seats}</Text>
            </View>
          )}

          {item.doors && (
            <View style={styles.specItem}>
              <Text style={styles.specIcon}>🚪</Text>
              <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.doors}</Text>
            </View>
          )}

          <View style={styles.specItem}>
            <Text style={styles.specIcon}>⛽</Text>
            <Text style={[styles.specText, { color: theme.textSecondary }]}>{item.fuel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.carImageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.carImage} resizeMode="cover" />
        ) : (
          <View style={[styles.carImagePlaceholder, { backgroundColor: theme.border }]}>
            <Text style={styles.carImageText}>🚗</Text>
          </View>
        )}
      </View>

      <View style={styles.carActions}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openBooking(item.id)}
          style={[styles.bookButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.bookButtonText}>Забронировать</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openDetails(item.id)}
          style={[styles.detailsButton, { borderColor: theme.primary }]}
        >
          <Text style={[styles.detailsButtonText, { color: theme.text }]}>Детали</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Загрузка
  if (isFetching) {
    return <LoaderScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <View style={[styles.backIcon, { borderColor: theme.text }]} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Результаты поиска</Text>

        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Content */}
      {fetchError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{fetchError}</Text>
          <Button
            title="Попробовать снова"
            onPress={retrySearch}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      ) : foundCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textLight }]}>Ничего не найдено</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {foundCars.map(car => renderCarItem(car))}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="home"
        onTabPress={tab => {
          if (tab === 'home') navigation.navigate('Home');
          if (tab === 'settings') navigation.navigate('Settings');
          if (tab === 'bookmarks') navigation.navigate('Bookmarks');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 48,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  backIcon: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '45deg' }],
  },
  backButtonPlaceholder: { width: 24 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
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
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  carBrand: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
    opacity: 0.2,
  },
  carPrice: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
    letterSpacing: 0.01,
  },
  carSpecs: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specIcon: { fontSize: 16 },
  specText: {
    fontFamily: 'Montserrat',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 15,
    letterSpacing: 0.02,
  },
  carImageContainer: { alignItems: 'flex-end' },
  carImage: { width: 176, height: 136, borderRadius: 8 },
  carImagePlaceholder: {
    width: 176,
    height: 136,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImageText: { fontSize: 48 },
  carActions: { flexDirection: 'row', gap: 12 },
  bookButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
  },
  detailsButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
  },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  errorText: { fontSize: 16, fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  retryButton: { minWidth: 200 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyText: { fontSize: 16, fontWeight: '400', textAlign: 'center' },
});

export default SearchResultsScreen;
