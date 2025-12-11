import { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';

const SplashScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const palette = getTheme(isDark);

  useEffect(() => {
    const timeoutId = setTimeout(() => navigation.replace('Onboarding'), 2500);
    return () => clearTimeout(timeoutId);
  }, [navigation]);

  const barStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <View style={[styles.root, { backgroundColor: palette.background }]}>
      <StatusBar barStyle={barStyle} backgroundColor={palette.background} />

      <View style={styles.topBlock}>
        <Text style={[styles.title, { color: palette.primary }]}>DriveNext</Text>
        <Text style={[styles.caption, { color: palette.textLight }]}>
          Поможем найти твою следующую поездку
        </Text>
      </View>

      <View style={styles.middleBlock}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../assets/images/splash_skreen.jpg')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },

  topBlock: {
    marginBottom: 49,
    marginTop: 64,
  },

  title: {
    fontWeight: '600',
    lineHeight: 29,
    marginBottom: 8,
    fontSize: 24,
  },

  caption: {
    fontSize: 14,
    lineHeight: 17,
  },

  middleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  bottomBlock: {
    marginBottom: 50,
    gap: 16,
  },

  mainBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
    height: 52,
  },

  // eslint-disable-next-line react-native/no-color-literals
  mainBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  // eslint-disable-next-line react-native/no-color-literals
  altBtn: {
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  altBtnText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default SplashScreen;
