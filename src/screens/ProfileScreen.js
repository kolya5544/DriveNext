/**
 * Экран профиля пользователя
 * Отображает детальную информацию о пользователе
 */
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import * as ImagePicker from 'expo-image-picker';
import { getUserData, removeToken, clearAllData, saveUserData } from '../utils/storage';
import BottomNavigation from '../components/BottomNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const data = await getUserData();
    setUser(
      data || {
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivanov@mtuci.ru',
        gender: 'Мужской',
        googleEmail: 'ivanov@gmail.com',
        joinDate: 'июль 2024',
      },
    );
  };

  const handleAvatarPress = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert(
          'Требуется разрешение',
          'Разрешите доступ к галерее, чтобы сменить аватар',
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      const uri = result.assets[0].uri;

      // локально обновляем стейт
      const updated = { ...(user || {}), avatarUri: uri };
      setUser(updated);

      // и сохраняем в AsyncStorage
      await saveUserData({ avatarUri: uri });
    } catch (error) {
      console.error('Ошибка смены аватара:', error);
      Alert.alert('Ошибка', 'Не удалось обновить аватар. Попробуйте ещё раз.');
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Смена пароля', 'Функция смены пароля будет реализована');
  };

  const handleLogout = () => {
    Alert.alert('Выход из профиля', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          // НЕ трогаем clearAllData, чтобы не терять профиль/тему/настройки
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Иван Иванов';
  const profileFields = [
    {
      label: 'Электронная почта',
      value: user?.email || 'ivanov@mtuci.ru',
      editable: false,
    },
    {
      label: 'Пароль',
      value: 'Поменять пароль',
      editable: true,
      onPress: handleChangePassword,
      valueStyle: { color: colors.primary },
    },
    { label: 'Пол', value: user?.gender || 'Мужской', editable: false },
    {
      label: 'Google',
      value: user?.googleEmail || 'ivanov@gmail.com',
      editable: false,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Профиль</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleAvatarPress}
            activeOpacity={0.7}
          >
            <View style={[styles.avatar, { borderColor: colors.primary }]}>
              {user?.avatarUri ? (
                <Image
                  source={{ uri: user.avatarUri }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>
            <View style={[styles.editIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.editIconText}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.joinDate, { color: colors.text }]}>
            Присоединился в {user?.joinDate || 'июль 2024'}
          </Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsSection}>
          {profileFields.map((field, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.detailItem}
                onPress={field.onPress}
                disabled={!field.editable}
                activeOpacity={field.editable ? 0.7 : 1}
              >
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>{field.label}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      {
                        color: field.valueStyle?.color || colors.textSecondary,
                      },
                    ]}
                  >
                    {field.value}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < profileFields.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={[styles.logoutText, { color: colors.text }]}>Выйти из профиля</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab="settings"
        onTabPress={tab => {
          if (tab === 'home') navigation.navigate('Home');
          else if (tab === 'bookmarks') navigation.navigate('Bookmarks');
          else if (tab === 'settings') navigation.navigate('Settings');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
  scrollView: { flex: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 32, gap: 16 },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEDED',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#29183B',
    borderRadius: 30,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editIconText: { fontSize: 16 },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  detailsSection: { paddingHorizontal: 24, gap: 16 },
  detailItem: { paddingVertical: 8, minHeight: 52, justifyContent: 'center' },
  detailContent: { gap: 4 },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    fontFamily: 'Montserrat',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 15,
    fontFamily: 'Montserrat',
  },
  divider: { height: 1, marginVertical: 8 },
  logoutSection: { paddingHorizontal: 24, paddingVertical: 32 },
  logoutButton: { paddingVertical: 16 },
  logoutText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});

export default ProfileScreen;
