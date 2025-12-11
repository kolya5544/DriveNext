// screens/RentSuccessScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/colors';
import Button from '../components/Button';

const RentSuccessScreen = ({ navigation }) => {
  const { isDark } = useTheme();
  const theme = getTheme(isDark);

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToBookings = () => {
    navigation.navigate('Bookings');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Удачной поездки</Text>

        <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
          <Text style={styles.iconCheck}>✓</Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.text }]}>Бронирование успешно создано</Text>

        <TouchableOpacity onPress={goToBookings} style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            Перейти к своим бронированиям
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button title="Домой" onPress={goHome} variant="primary" style={styles.homeButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },

  content: {
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginBottom: 48,
  },

  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  iconCheck: {
    fontSize: 40,
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },

  linkContainer: {
    marginTop: 40,
  },

  linkText: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },

  footer: {
    width: '100%',
  },

  homeButton: {
    width: '100%',
  },
});

export default RentSuccessScreen;
