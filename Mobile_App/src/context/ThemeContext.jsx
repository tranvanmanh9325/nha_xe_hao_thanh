import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme';
import { StatusBar } from 'react-native';

const ThemeContext = createContext({
  isDarkMode: false,
  colors: lightColors,
  toggleDarkMode: async () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@settings_dark_mode');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'true');
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      } finally {
        setIsThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newValue = !isDarkMode;
      setIsDarkMode(newValue);
      await AsyncStorage.setItem('@settings_dark_mode', newValue.toString());
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const themeValue = useMemo(
    () => ({ isDarkMode, colors, toggleDarkMode }),
    [isDarkMode, colors]
  );

  if (!isThemeLoaded) {
    return null; // Prevent UI flicker by waiting for theme to load
  }

  return (
    <ThemeContext.Provider value={themeValue}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? colors.neutral[900] : colors.white} 
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);