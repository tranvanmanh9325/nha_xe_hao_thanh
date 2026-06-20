import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withDelay,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY } from '../theme';
import { BusIcon } from '../components/icons/CustomIcons';
import authService from '../services/authService';

export default function SplashScreen({ navigation }) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    // Animate text after logo
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 100 }));

    const checkAuthAndNavigate = async () => {
      // Wait for animation to be visible before navigating
      await new Promise(resolve => setTimeout(resolve, 2000));

      const isLoggedIn = await authService.isAuthenticated();
      navigation.replace(isLoggedIn ? 'Home' : 'Login');
    };

    checkAuthAndNavigate();
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [
        { scale: logoScale.value }
      ]
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        { translateY: textTranslateY.value }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.iconWrapper}>
          <BusIcon size={64} color={COLORS.brand[500]} />
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.title}>HÀO THANH</Text>
        <Text style={styles.subtitle}>Chuyến xe đẳng cấp 5 sao</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    transform: [{ rotateZ: '-5deg' }]
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.brand[100],
    letterSpacing: 0.5,
  }
});