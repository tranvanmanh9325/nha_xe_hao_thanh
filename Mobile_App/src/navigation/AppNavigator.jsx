import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SupportScreen from '../screens/SupportScreen';
import ChatScreen from '../screens/ChatScreen';
import CreateSupportRequestScreen from '../screens/CreateSupportRequestScreen';
import GeneralSettingsScreen from '../screens/GeneralSettingsScreen';
import AppInfoScreen from '../screens/AppInfoScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import LegalAndPoliciesScreen from '../screens/LegalAndPoliciesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen 
          name="Support" 
          component={SupportScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="CreateSupportRequest" 
          component={CreateSupportRequestScreen} 
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="GeneralSettings" 
          component={GeneralSettingsScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="AppInfo" 
          component={AppInfoScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicyScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="TermsOfService" 
          component={TermsOfServiceScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="LegalAndPolicies" 
          component={LegalAndPoliciesScreen} 
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}