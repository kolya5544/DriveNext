/**
 * Экран приветствия (Onboarding) - из Figma дизайна
 * Показывает несколько слайдов с преимуществами приложения
 * Отображается только при первом запуске
 */
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import ProgressIndicator from '../components/ProgressIndicator';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Аренда автомобилей',
    description: 'Открой для себя удобный и доступный способ передвижения',
    image: require('../../assets/images/onboarding1.jpg'),
  },
  {
    id: 2,
    title: 'Безопасно и удобно',
    description: 'Арендуй автомобиль и наслаждайся его удобством',
    image: require('../../assets/images/onboarding2.jpg'),
  },
  {
    id: 3,
    title: 'Лучшие предложения',
    description: 'Выбирай понравившееся среди сотен доступных автомобилей',
    image: require('../../assets/images/onboarding3.jpg'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const handleSkip = () => navigation.replace('AuthChoice');

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      scrollViewRef.current?.scrollTo({ x: width * nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    } else {
      navigation.replace('AuthChoice');
    }
  };

  const handleScroll = event => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.primary }]}>Пропустить</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map(slide => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={slide.image} style={styles.slideImage} resizeMode="contain" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
              <Text style={[styles.description, { color: colors.text }]}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={currentSlide} totalSteps={slides.length} />
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentSlide < slides.length - 1 ? 'Далее' : 'Начать'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16, alignItems: 'flex-end' },
  skipButton: { paddingVertical: 8, paddingHorizontal: 8 },
  skipText: { fontSize: 14, fontWeight: '600' },
  scrollView: { flex: 1 },
  slide: { width, paddingHorizontal: 24 },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 64 },
  slideImage: { width: 342, height: 307 },
  textContainer: { paddingHorizontal: 16, marginBottom: 64 },
  title: { fontSize: 24, fontWeight: '600', lineHeight: 29, marginBottom: 24 },
  description: { fontSize: 14, lineHeight: 17 },
  footer: { paddingHorizontal: 24, paddingBottom: 50 },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 42,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500', lineHeight: 22 },
});

export default OnboardingScreen;
