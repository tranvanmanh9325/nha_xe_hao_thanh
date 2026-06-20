import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import TicketScreen from '../screens/TicketScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Trang chủ' }} 
      />
      <Tab.Screen 
        name="TicketTab" 
        component={TicketScreen} 
        options={{ tabBarLabel: 'Vé' }} 
      />
      <Tab.Screen 
        name="NotificationTab" 
        component={NotificationScreen} 
        options={{ tabBarLabel: 'Thông báo' }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Tài khoản' }} 
      />
    </Tab.Navigator>
  );
}
