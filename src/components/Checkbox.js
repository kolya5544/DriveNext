/**
 * Компонент чекбокса
 * Используется для согласия с условиями и другими опциями
 */
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const Checkbox = ({ checked, onPress, label }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.checkbox,
          { borderColor: checked ? theme.primary : theme.border },
          checked && { backgroundColor: theme.primary },
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // eslint-disable-next-line react-native/no-color-literals
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    flex: 1,
    fontSize: 14,
  },
});

export default Checkbox;
