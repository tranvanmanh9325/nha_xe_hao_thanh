import React, { useState } from 'react';
import { TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolateColor, 
  useSharedValue 
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, RADIUS } from '../theme';
import { EyeIcon, EyeSlashIcon } from './icons/CustomIcons';

export default function AnimatedInput({ 
  label, 
  secureTextEntry, 
  icon: Icon,
  style,
  error,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  const hasError = !!error;

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [COLORS.neutral[200], COLORS.brand[500]]
    );
    
    const translateY = -(focusAnim.value * 2);
    const shadowOpacity = focusAnim.value * 0.15;

    return { 
      borderColor, 
      borderWidth: 1.5,
      transform: [{ translateY }],
      shadowColor: COLORS.brand[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity,
      shadowRadius: 8,
      elevation: focusAnim.value * 4,
      backgroundColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [COLORS.neutral[50], COLORS.white]
      )
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      focusAnim.value,
      [0, 1],
      [COLORS.neutral[600], COLORS.brand[600]]
    );
    return { color };
  });

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Animated.Text style={[styles.label, animatedLabelStyle]}>
          {label}
        </Animated.Text>
      )}
      <Animated.View style={[styles.container, animatedContainerStyle, hasError && styles.errorContainer]}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={20} color={hasError ? '#DC2626' : (isFocused ? COLORS.brand[500] : COLORS.neutral[400])} />
          </View>
        )}
        
        <TextInput
          style={[styles.input, !Icon && styles.inputNoIcon]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={COLORS.neutral[400]}
          {...props}
        />
        
        {secureTextEntry && (
          <Pressable 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
            style={styles.eyeButton}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon size={20} color={COLORS.neutral[400]} />
            ) : (
              <EyeIcon size={20} color={COLORS.neutral[400]} />
            )}
          </Pressable>
        )}
      </Animated.View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    height: 54,
  },
  iconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.neutral[900],
    fontSize: TYPOGRAPHY.base,
  },
  inputNoIcon: {
    paddingLeft: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  }
});