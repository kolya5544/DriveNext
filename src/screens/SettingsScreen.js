/* eslint-disable no-console */
/**
 * Экран настроек — профиль пользователя и пункты меню
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import BottomNavigation from '../components/BottomNavigation';
import { getUserData } from '../utils/storage';
import SunIcon from '../components/icons/SunIcon';
import BellIcon from '../components/icons/BellIcon';
import MailIcon from '../components/icons/MailIcon';
import HelpCircleIcon from '../components/icons/HelpCircleIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const palette = getTheme(isDark);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const info = await getUserData();
    setProfile(
      info || {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@mtuci.ru',
      },
    );
  };

  const openProfile = () => navigation.navigate('Profile');

  const onMenuPress = key => {
    switch (key) {
      case 'bookings':
        navigation.navigate('Bookings');
        break;
      case 'theme':
        console.log('Тема');
        toggleTheme();
        break;
      case 'notifications':
        console.log('Уведомления');
        break;
      case 'car':
        console.log('Подключить автомобиль');
        break;
      case 'help':
        console.log('Помощь');
        break;
      case 'invite':
        console.log('Пригласи друга');
        break;
      default:
        break;
    }
  };

  const items = [
    { id: 'bookings', title: 'Мои бронирования', icon: '📑' },
    { id: 'theme', title: isDark ? 'Тема: тёмная' : 'Тема: светлая', icon: '☀️' },
    { id: 'notifications', title: 'Уведомления', icon: '🔔' },
    { id: 'car', title: 'Подключить свой автомобиль', icon: '🚗' },
    { id: 'help', title: 'Помощь', icon: '❓' },
    { id: 'invite', title: 'Пригласи друга', icon: '✉️' },
  ];

  const name = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
    : 'Иван Иванов';
  const mail = profile?.email || 'ivan@mtuci.ru';

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]} edges={['top']}>
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: palette.background }]}>
        <Text style={[styles.headerText, { color: palette.text }]}>Настройки</Text>
      </View>

      {/* Контент */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Профиль */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openProfile}
          style={[styles.profileRow, { backgroundColor: palette.background }]}
        >
          <View style={styles.profileInfo}>
            <View style={[styles.avatarWrapper, { backgroundColor: '#EDEDED' }]}>
              {profile?.avatarUri ? (
                <Image
                  source={{ uri: profile.avatarUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarDot} />
              )}
            </View>
            <View style={styles.userData}>
              <Text style={[styles.name, { color: palette.primary }]}>{name}</Text>
              <Text style={[styles.email, { color: palette.textLight }]}>{mail}</Text>
            </View>
          </View>
          <View style={styles.arrowBox}>
            <View style={[styles.arrow, { borderColor: palette.primary }]} />
          </View>
        </TouchableOpacity>

        {/* Меню */}
        <View style={[styles.menuBlock, { backgroundColor: palette.background }]}>
          {items.map((opt, idx) => (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.7}
              onPress={() => onMenuPress(opt.id)}
              style={[
                styles.menuRow,
                // eslint-disable-next-line react-native/no-inline-styles
                idx < items.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: palette.border,
                },
              ]}
            >
              <View style={styles.menuLeft}>
                {opt.id === 'theme' && <SunIcon size={20} color={palette.text} />}
                {opt.id === 'notifications' && <BellIcon size={20} color={palette.text} />}
                {opt.id === 'invite' && <MailIcon width={20} height={16} color={palette.text} />}
                {opt.id === 'help' && <HelpCircleIcon size={24} color={palette.text} />}
                {!(
                  opt.id === 'theme' ||
                  opt.id === 'notifications' ||
                  opt.id === 'invite' ||
                  opt.id === 'help'
                ) && <Text style={styles.menuEmoji}>{opt.icon}</Text>}
                <Text numberOfLines={1} style={[styles.menuLabel, { color: palette.text }]}>
                  {opt.title}
                </Text>
              </View>
              <View style={styles.arrowBox}>
                <View style={[styles.arrow, { borderColor: palette.primary }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Нижняя навигация */}
      <BottomNavigation
        activeTab="settings"
        onTabPress={tab => {
          if (tab === 'home') navigation.navigate('Home');
          if (tab === 'bookmarks') navigation.navigate('Bookmarks');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 48,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  profileRow: {
    minHeight: 83,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarWrapper: {
    width: 69,
    height: 67,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 69,
    height: 67,
    borderRadius: 50,
  },
  // eslint-disable-next-line react-native/no-color-literals
  avatarDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#29183B',
  },
  userData: { gap: 2 },
  name: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
  },
  email: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
  },
  arrowBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  arrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#29183B',
    transform: [{ rotate: '45deg' }],
  },
  menuBlock: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuRow: {
    minHeight: 40,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLeft: {
    flex: 1,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuEmoji: {
    fontSize: 20,
    width: 20,
    height: 20,
  },
  menuLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    flexShrink: 1,
  },
});

export default SettingsScreen;
