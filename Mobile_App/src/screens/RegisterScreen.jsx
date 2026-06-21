import React, { useState } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Pressable,
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { COLORS, TYPOGRAPHY, RADIUS } from '../theme';
import { PhoneIcon, LockIcon, UserIcon } from '../components/icons/CustomIcons';
import authService from '../services/authService';

const PHONE_REGEX = /^0\d{9,10}$/;
const MIN_PASSWORD_LENGTH = 6;

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password && confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear individual field error on user input
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await authService.register(fullName.trim(), phone.replace(/\s/g, ''), password.trim());
      navigation.replace('Main');
    } catch (error) {
      const message = authService.getErrorMessage(error);
      if (message) {
        // 409 Conflict = duplicate phone number
        if (error.response?.status === 409) {
          setErrors({ phone: 'Số điện thoại này đã được đăng ký' });
        } else {
          Alert.alert('Lỗi', message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Register has 4 fields - needs ScrollView for small screens/keyboard,
            but scrollEnabled is false by default to lock the card in place.
            On small devices the content may overflow, so we keep ScrollView
            but disable bouncing and overscroll completely. */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View style={styles.container}>
            <Animated.View 
              entering={FadeInDown.duration(800).springify()}
              style={styles.card}
            >
              <Animated.View entering={FadeIn.delay(200).duration(800)} style={styles.header}>
                <Text style={styles.title}>Tạo tài khoản mới</Text>
                <Text style={styles.subtitle}>Điền thông tin bên dưới để bắt đầu đặt vé ngay hôm nay.</Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.formContainer}>
                {errors.general && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{errors.general}</Text>
                  </View>
                )}

                <AnimatedInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên đầy đủ"
                  autoCapitalize="words"
                  icon={UserIcon}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    clearError('fullName');
                  }}
                  error={errors.fullName}
                />

                <AnimatedInput
                  label="Số điện thoại"
                  placeholder="09xx xxx xxx"
                  keyboardType="phone-pad"
                  icon={PhoneIcon}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    clearError('phone');
                  }}
                  error={errors.phone}
                />
                
                <AnimatedInput
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  secureTextEntry
                  icon={LockIcon}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  error={errors.password}
                />

                <AnimatedInput
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  icon={LockIcon}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearError('confirmPassword');
                  }}
                  error={errors.confirmPassword}
                />

                <AnimatedButton
                  title="Đăng Ký"
                  onPress={handleRegister}
                  loading={loading}
                  style={styles.registerButton}
                />

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Đã có tài khoản? </Text>
                  <Pressable onPress={() => navigation.goBack()} style={styles.loginLinkContainer}>
                    <Text style={styles.loginLink}>Đăng nhập</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.brand[50],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    padding: 24,
    shadowColor: COLORS.brand[700],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: '800',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[500],
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    textAlign: 'center',
  },
  registerButton: {
    marginBottom: 24,
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  loginLinkContainer: {
    padding: 4,
  },
  loginLink: {
    color: COLORS.brand[600],
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
  }
});