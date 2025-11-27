/**
 * Экран избранного
 * Заглушка для сохраненных автомобилей
 */

import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import BottomNavigation from '../components/BottomNavigation';

const BookmarksScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const navigateTab = tabName => {
    if (tabName === 'home') navigation.navigate('Home');
    else if (tabName === 'settings') navigation.navigate('Settings');
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.centerContent}>
        <Text style={[styles.mainTitle, { color: theme.text }]}>Избранное</Text>
        <Text style={[styles.description, { color: theme.textLight }]}>
          Здесь будут сохраненные автомобили
        </Text>
      </View>

      <BottomNavigation activeTab="bookmarks" onTabPress={navigateTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookmarksScreen;
