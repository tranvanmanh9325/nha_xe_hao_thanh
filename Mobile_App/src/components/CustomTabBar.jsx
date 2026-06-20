import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AnimatedTabIcon from './AnimatedTabIcon';
import { SHADOWS } from '../theme';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        if (route.name === 'HomeTab') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'TicketTab') {
          iconName = isFocused ? 'ticket' : 'ticket-outline';
        } else if (route.name === 'NotificationTab') {
          iconName = isFocused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = isFocused ? 'person' : 'person-outline';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.8}
          >
            <AnimatedTabIcon name={iconName} focused={isFocused} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    alignSelf: 'center',
    width: '82%', // Not full width for a premium futuristic look
    height: 64,
    flexDirection: 'row',
    // Glassmorphism translucent background
    backgroundColor: 'rgba(255, 255, 255, 0.88)', 
    borderRadius: 32, // Perfect pill shape
    ...SHADOWS.futuristic, // Add deep 3D shadow from theme
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Shiny glass rim
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
