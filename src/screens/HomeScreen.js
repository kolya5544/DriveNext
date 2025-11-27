/**
 * Экран домашнего просмотра
 * Содержит поиск и список доступных автомобилей
 */
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import { mockGetCars } from '../utils/mockData';
import BottomNavigation from '../components/BottomNavigation';
import LoadingIndicator from '../components/LoadingIndicator';
import Button from '../components/Button';

const HomeScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const [carList, setCarList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const response = await mockGetCars();
      if (response.success) {
        setCarList(response.cars);
      } else {
        setLoadError('Не удалось загрузить данные. Попробуйте снова.');
      }
    } catch {
      setLoadError('Не удалось загрузить данные. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSearch = () => {
    if (query.trim()) {
      navigation.navigate('SearchResults', { query });
    }
  };

  const bookCar = id => console.log('Забронировать автомобиль:', id);
  const viewCarDetails = id => console.log('Детали автомобиля:', id);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchSection, { backgroundColor: '#F9F5FF' }]}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[styles.searchInput, { backgroundColor: theme.background }]}
            onPress={onSearch}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInputText}
              placeholder="Введите марку автомобиля"
              placeholderTextColor={theme.placeholder}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={onSearch}
              returnKeyType="search"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headingContainer}>
          <Text style={[styles.heading, { color: theme.text }]}>Давайте найдем автомобиль</Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingIndicator />
      ) : loadError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{loadError}</Text>
          <Button
            title="Попробовать снова"
            onPress={fetchCars}
            variant="primary"
            style={styles.retryButton}
          />
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
  searchSection: {
    paddingTop: 64,
    paddingBottom: 10,
    paddingHorizontal: 24,
    gap: 32,
  },
  searchContainer: { gap: 8 },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: { fontSize: 24 },
  searchInputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
  headingContainer: { paddingVertical: 4 },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Montserrat',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: { minWidth: 200 },
});

export default HomeScreen;
