import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function AnimatedTabIcon({ name, focused }) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, {
      damping: 12,
      stiffness: 100,
    });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: 1 + progress.value * 0.2, // Scales up gracefully
        },
        {
          translateY: -progress.value * 3, // Moves up slightly to give 3D popping feel
        }
      ],
    };
  });

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        {
          scale: progress.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons 
          name={name} 
          size={24} 
          color={focused ? COLORS.brand[500] : COLORS.neutral[400]} 
        />
      </Animated.View>
      {/* 3D Glowing Dot Indicator */}
      <Animated.View style={[styles.dot, animatedDotStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.brand[500],
    shadowColor: COLORS.brand[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  }
});
