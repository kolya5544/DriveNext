/**
 * Компонент нижней навигации
 * Отображает иконки для перехода между основными экранами
 */
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';
import HomeIcon from './icons/HomeIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import SettingsIcon from './icons/SettingsIcon';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const tabs = [
    { id: 'home', name: 'home' },
    { id: 'bookmarks', name: 'bookmarks' },
    { id: 'settings', name: 'settings' },
  ];

  const renderHomeIcon = isActive => (
    <HomeIcon size={24} color={isActive ? theme.primary : theme.text} />
  );

  const renderBookmarkIcon = isActive => (
    <BookmarkIcon width={16} height={20} color={isActive ? theme.primary : theme.text} />
  );

  const renderSettingsIcon = isActive => (
    <SettingsIcon size={24} color={isActive ? theme.primary : theme.text} />
  );

  const renderIcon = tab => {
    const isActive = activeTab === tab.id;

    switch (tab.id) {
      case 'home':
        return renderHomeIcon(isActive);
      case 'bookmarks':
        return renderBookmarkIcon(isActive);
      case 'settings':
        return renderSettingsIcon(isActive);
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {renderIcon(tab)}
            {activeTab === tab.id && (
              <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    width: '100%',
    height: 83,
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 0,
    height: 49,
    gap: 24,
  },
  tab: {
    width: 75,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default BottomNavigation;
