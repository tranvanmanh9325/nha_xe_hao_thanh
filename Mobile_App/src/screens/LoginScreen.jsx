import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import { COLORS, TYPOGRAPHY, RADIUS } from '../theme';
import { BusIcon, PhoneIcon, LockIcon, FingerprintIcon } from '../components/icons/CustomIcons';
import authService from '../services/authService';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRICS_KEY = '@biometrics_enabled';

const PHONE_REGEX = /^0\d{9,10}$/;

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const isEnabled = await AsyncStorage.getItem(BIOMETRICS_KEY);
      if (isEnabled === 'true') {
        setIsBiometricsAvailable(true);
        // Tự động gọi quét khi vừa vào màn hình Login nếu có credentials
        const credentials = await authService.getSecureCredentials();
        if (credentials) {
          handleBiometricLogin();
        }
      }
    } catch (e) {
      console.log('Error checking biometrics', e);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: t('auth.biometricPrompt', 'Đăng nhập bằng Sinh trắc học'),
        fallbackLabel: t('auth.biometricFallback', 'Dùng mật khẩu'),
        disableDeviceFallback: true,
      });

      if (authResult.success) {
        // Lấy credentials từ SecureStore
        const credentials = await authService.getSecureCredentials();
        if (credentials) {
          setLoading(true);
          await authService.login(credentials.phone, credentials.password);
          navigation.replace('Main');
        } else {
          Alert.alert(t('common.error', 'Lỗi'), t('auth.noCredentials', 'Không tìm thấy thông tin đăng nhập đã lưu. Vui lòng đăng nhập lại bằng mật khẩu.'));
        }
      }
    } catch (e) {
      console.log('Biometric error', e);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!phone.trim()) {
      newErrors.phone = t('auth.loginError', 'Vui lòng nhập số điện thoại');
    } else if (!PHONE_REGEX.test(phone.trim())) {
      newErrors.phone = t('auth.loginError', 'Số điện thoại không hợp lệ');
    }

    if (!password) {
      newErrors.password = t('auth.loginError', 'Vui lòng nhập mật khẩu');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await authService.login(phone.replace(/\s/g, ''), password.trim());
      navigation.replace('Main');
    } catch (error) {
      const message = authService.getErrorMessage(error);
      if (message) {
        // 401 from Spring Security means bad credentials
        if (error.response?.status === 401) {
          setErrors({ general: t('auth.loginError', 'Số điện thoại hoặc mật khẩu không đúng') });
        } else {
          Alert.alert(t('createRequest.submitError', 'Lỗi'), message);
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Animated.View 
              entering={FadeInDown.duration(800).springify()}
              style={styles.card}
            >
              <Animated.View entering={FadeIn.delay(200).duration(800)} style={styles.header}>
                <View style={styles.logoWrapper}>
                  <BusIcon size={36} color={COLORS.brand[500]} />
                </View>
                <Text style={styles.title}>{t('auth.loginTitle')}</Text>
                <Text style={styles.subtitle}>{t('auth.loginIntro', 'Đăng nhập để đặt vé xe nhanh chóng và nhận nhiều ưu đãi.')}</Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.formContainer}>
                {errors.general && (
                  <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{errors.general}</Text>
                  </View>
                )}

                <AnimatedInput
                  label={t('auth.phonePlaceholder')}
                  placeholder="09xx xxx xxx"
                  keyboardType="phone-pad"
                  icon={PhoneIcon}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  error={errors.phone}
                />
                
                <AnimatedInput
                  label={t('auth.passwordPlaceholder')}
                  placeholder={t('auth.passwordPlaceholder')}
                  secureTextEntry
                  icon={LockIcon}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  error={errors.password}
                />

                <View style={styles.forgotPasswordContainer}>
                  <Pressable>
                    <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
                  </Pressable>
                </View>

                <View style={styles.actionButtonsContainer}>
                  <AnimatedButton
                    title={t('auth.loginButton')}
                    onPress={handleLogin}
                    loading={loading}
                    style={[styles.loginButton, isBiometricsAvailable && { flex: 1, marginBottom: 0 }]}
                  />
                  
                  {isBiometricsAvailable && (
                    <Pressable 
                      style={styles.biometricButton}
                      onPress={handleBiometricLogin}
                    >
                      <FingerprintIcon size={28} color={COLORS.brand[600]} />
                    </Pressable>
                  )}
                </View>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>{t('auth.noAccount')} </Text>
                  <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerLinkContainer}>
                    <Text style={styles.registerLink}>{t('auth.registerNow')}</Text>
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    paddingVertical: 36,
    paddingHorizontal: 28,
    shadowColor: COLORS.brand[700],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.brand[50],
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 36,
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.brand[600],
  },
  loginButton: {
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  biometricButton: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.brand[50],
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  registerLinkContainer: {
    padding: 4,
  },
  registerLink: {
    color: COLORS.brand[600],
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
  }
});