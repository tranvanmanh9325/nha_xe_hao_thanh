import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  interpolateColor
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton({ title, onPress, style, textStyle, variant = 'primary', loading = false, ...props }) {
  const isPressed = useSharedValue(0);

  const handlePressIn = () => {
    isPressed.value = withSpring(1, { damping: 12, stiffness: 400 });
  };

  const handlePressOut = () => {
    isPressed.value = withSpring(0, { damping: 12, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    // 3D Press effect: scale down slightly, translate down, rotateX slightly
    const scale = 1 - (isPressed.value * 0.03);
    const translateY = isPressed.value * 2;
    const rotateX = `${isPressed.value * 2}deg`;
    
    // Shadow diminishes when pressed
    const shadowOpacity = variant === 'primary' 
      ? 0.25 - (isPressed.value * 0.1)
      : 0.1 - (isPressed.value * 0.05);

    return {
      transform: [
        { perspective: 800 },
        { scale },
        { translateY },
        { rotateX }
      ],
      shadowOpacity,
    };
  });

  const isPrimary = variant === 'primary';

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.outlineButton,
        animatedStyle,
        loading && styles.disabledButton,
        style
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.brand[500]} size="small" />
      ) : (
        <Text style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.outlineText,
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButton: {
    backgroundColor: COLORS.brand[500],
    shadowColor: COLORS.brand[500],
  },
  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    shadowColor: COLORS.neutral[900],
  },
  text: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: 0.5,
  },
  primaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.neutral[800],
  },
  disabledButton: {
    opacity: 0.7,
  }
});