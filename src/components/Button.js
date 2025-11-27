/**
 * Компонент кнопки (из Figma дизайна)
 * Переиспользуемая кнопка с разными вариантами стилей
 */
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTheme } from '../styles/colors';
import { useTheme } from '../context/ThemeContext';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const buttonStyle = [
    styles.button,
    variant === 'primary' && { backgroundColor: theme.primary },
    variant === 'secondary' && {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    disabled && { backgroundColor: theme.disabled, opacity: 0.6 },
    style,
  ];

  const textStyle = [
    styles.buttonText,
    variant === 'primary' && { color: '#FFFFFF' },
    variant === 'secondary' && { color: theme.text },
    variant === 'outline' && { color: theme.primary },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.primary : '#FFFFFF'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
});

export default Button;
