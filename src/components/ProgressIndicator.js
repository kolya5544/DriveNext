/**
 * Компонент индикатора прогресса (из Figma дизайна)
 * Показывает текущий шаг в онбординге
 */

import { View, StyleSheet } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const ProgressIndicator = ({ currentStep, totalSteps = 3 }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep
              ? // eslint-disable-next-line react-native/no-inline-styles
                { width: 40, backgroundColor: theme.primary }
              : // eslint-disable-next-line react-native/no-inline-styles
                { width: 16, backgroundColor: theme.borderLight },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 8,
  },
});

export default ProgressIndicator;
