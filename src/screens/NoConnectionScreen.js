/**
 * Экран отсутствия подключения к интернету (из Figma дизайна)
 * Отображается когда нет доступа к сети
 * Позволяет повторить попытку подключения
 */

import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const NoConnectionScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const colors = getTheme(isDark);

  const handleRetry = () => {
    console.log('Повторная попытка подключения...');
    navigation.replace('Main');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.skipText, { color: colors.primary }]}>Пропустить</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/no_connection.jpg')}
            style={styles.connectionIcon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Нет соединения</Text>
          <Text style={[styles.message, { color: colors.text }]}>
            Проверьте подключение к интернету и попробуйте снова
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRetry}
        >
          <Text style={styles.buttonText}>Подтвердить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 64, paddingBottom: 16, alignItems: 'flex-end' },
  skipText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 36 },
  iconContainer: { marginBottom: 32 },
  connectionIcon: { width: 96, height: 96 },
  textContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '600', lineHeight: 29, textAlign: 'center', marginBottom: 32 },
  message: { fontSize: 14, lineHeight: 17, textAlign: 'center' },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 342,
  },
  buttonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 22 },
});

export default NoConnectionScreen;
