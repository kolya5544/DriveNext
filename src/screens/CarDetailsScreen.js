// screens/CarDetailsScreen.js

import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getFavoriteCars, addFavoriteCar, removeFavoriteCar } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import LoadingIndicator from '../components/LoadingIndicator';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { mockGetCarDetails, mockToggleFavoriteCar } from '../utils/mockData';

const CarDetailsScreen = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const carId = route?.params?.carId;

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [favoriteError, setFavoriteError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
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

  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const ids = await getFavoriteCars();
        setIsFavorite(ids.includes(carId));
      } catch {
        // тихо игнорим, просто не ставим избранное
      }
    };

    if (carId) {
      loadFavorite();
    }
  }, [carId]);

  const handleToggleFavorite = async () => {
    if (!carId) return;

    try {
      setFavoriteError(null);

      if (isFavorite) {
        const ok = await removeFavoriteCar(carId);
        if (!ok) throw new Error('remove_failed');
        setIsFavorite(false);
      } else {
        const ok = await addFavoriteCar(carId);
        if (!ok) throw new Error('add_failed');
        setIsFavorite(true);
      }
    } catch (e) {
      setFavoriteError('Не удалось добавить в избранное. Попробуйте снова.');
    }
  };

  const handleBookCar = () => {
    if (!car) return;
    navigation.navigate('Rent', { carId: car.id });
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (loadError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{loadError}</Text>
          <Button
            title="Попробовать снова"
            onPress={loadCarDetails}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      );
    }

    if (!car) {
      return null;
    }

    return (
      <>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {car.image && <Image source={car.image} style={styles.carImage} resizeMode="cover" />}

          {favoriteError && (
            <Text style={[styles.inlineError, { color: theme.error }]}>{favoriteError}</Text>
          )}

          <Text style={[styles.carTitle, { color: theme.text }]}>{car.model}</Text>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              Адрес нахождения
            </Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressIcon}>📍</Text>
              <Text style={[styles.addressText, { color: theme.text }]}>
                {car.address || 'Авиамоторная ул., 8, стр. 2'}
              </Text>
            </View>
          </View>

          <View style={[styles.separator, { borderBottomColor: theme.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Описание</Text>
            <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
              {car.description ||
                'Tesla Model 3 оснащена 2,0-литровым турбированным рядным 4 бензиновым двигателем, который обеспечивает 255 лошадиных сил и высокий крутящий момент.'}
            </Text>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { borderTopColor: theme.border, backgroundColor: theme.background },
          ]}
        >
          <View style={styles.priceContainer}>
            <Text style={[styles.priceText, { color: theme.text }]}>{car.price}₽/день</Text>
          </View>
          <Button
            title="Забронировать"
            onPress={handleBookCar}
            variant="primary"
            style={styles.bookButton}
          />
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Хедер */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.headerIconText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Детали</Text>

        <TouchableOpacity style={styles.headerIconButton} onPress={handleToggleFavorite}>
          <Text style={[styles.headerIconText, { color: isFavorite ? theme.primary : theme.text }]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

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
  },
  headerIconText: {
    fontSize: 22,
  },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  carImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginBottom: 16,
  },

  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat',
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  bookButton: {
    flex: 1.2,
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
    fontFamily: 'Montserrat',
  },
  retryButton: { minWidth: 200 },

  inlineError: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 12,
    fontFamily: 'Montserrat',
  },
});

export default CarDetailsScreen;
