import { View, Text, StyleSheet } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const MainScreen = () => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return <View style={[styles.container, { backgroundColor: theme.background }]}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
  },
});

export default MainScreen;
