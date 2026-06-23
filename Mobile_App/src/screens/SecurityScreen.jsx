import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon, 
  LockIcon, 
  TrashIcon, 
  CheckCircleIcon,
  InfoIcon
} from '../components/icons/CustomIcons';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedSwitch from '../components/AnimatedSwitch';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRICS_KEY = '@biometrics_enabled';

export default function SecurityScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  // Passwords
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  // Mock device
  const currentDevice = Platform.OS === 'ios' ? 'iPhone 15 Pro' : 'Android Device';

  useEffect(() => {
    loadBiometricsSetting();
  }, []);

  const loadBiometricsSetting = async () => {
    try {
      const value = await AsyncStorage.getItem(BIOMETRICS_KEY);
      if (value !== null) {
        setIsBiometricsEnabled(value === 'true');
      }
    } catch (e) {
      console.log('Error loading biometrics setting', e);
    }
  };

  const toggleBiometrics = async () => {
    try {
      const newValue = !isBiometricsEnabled;
      
      if (newValue) {
        // Kiểm tra xem thiết bị có hỗ trợ vân tay/FaceID không
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (!hasHardware || !isEnrolled) {
          Alert.alert(
            t('common.error', 'Lỗi'),
            t('securityScreen.biometricsNotSupported', 'Thiết bị của bạn không hỗ trợ hoặc chưa cài đặt sinh trắc học.')
          );
          return;
        }

        // Gọi màn hình quét
        const authResult = await LocalAuthentication.authenticateAsync({
          promptMessage: t('securityScreen.biometricsPrompt', 'Xác thực để bật tính năng đăng nhập nhanh'),
          fallbackLabel: t('securityScreen.biometricsFallback', 'Sử dụng mật khẩu'),
          cancelLabel: t('common.cancel', 'Hủy'),
          disableDeviceFallback: true,
        });

        if (!authResult.success) {
          return; // Hủy quét
        }
      }

      setIsBiometricsEnabled(newValue);
      await AsyncStorage.setItem(BIOMETRICS_KEY, newValue.toString());
    } catch (e) {
      console.log('Error saving biometrics setting', e);
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = t('auth.loginError', 'Vui lòng nhập mật khẩu hiện tại');
    }
    
    if (!newPassword || newPassword.length < 6) {
      newErrors.newPassword = t('securityScreen.passwordRequirements', 'Mật khẩu phải có ít nhất 6 ký tự');
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('securityScreen.passwordNotMatch', 'Mật khẩu xác nhận không khớp');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await authService.changePassword(oldPassword, newPassword);
      
      Alert.alert(
        t('common.success'), 
        t('securityScreen.passwordChangedSuccess', 'Đổi mật khẩu thành công!'),
        [{ text: 'OK', onPress: () => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}]
      );
    } catch (error) {
      setErrors({ general: authService.getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('securityScreen.deleteAccountConfirmTitle', 'Xác nhận xóa tài khoản'),
      t('securityScreen.deleteAccountConfirmMessage', 'Hành động này không thể hoàn tác. Toàn bộ dữ liệu đặt vé, H-Coin và thông tin cá nhân sẽ bị xóa vĩnh viễn. Bạn có chắc chắn muốn tiếp tục?'),
      [
        { text: t('securityScreen.cancel', 'Hủy'), style: 'cancel' },
        { 
          text: t('securityScreen.delete', 'Xóa'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.deleteAccount();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err) {
              Alert.alert(t('common.error'), authService.getErrorMessage(err));
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeftIcon size={24} color={colors.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('securityScreen.title', 'Bảo mật & Mật khẩu')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Change Password Section */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('securityScreen.changePassword', 'Đổi mật khẩu')}</Text>
            <View style={styles.card}>
              {errors.general && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errors.general}</Text>
                </View>
              )}

              <AnimatedInput
                label={t('securityScreen.oldPassword', 'Mật khẩu hiện tại')}
                placeholder={t('securityScreen.oldPassword', 'Mật khẩu hiện tại')}
                secureTextEntry
                icon={LockIcon}
                value={oldPassword}
                onChangeText={(text) => {
                  setOldPassword(text);
                  if (errors.oldPassword) setErrors((prev) => ({ ...prev, oldPassword: undefined }));
                }}
                error={errors.oldPassword}
              />

              <AnimatedInput
                label={t('securityScreen.newPassword', 'Mật khẩu mới')}
                placeholder={t('securityScreen.newPassword', 'Mật khẩu mới')}
                secureTextEntry
                icon={LockIcon}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
                }}
                error={errors.newPassword}
              />
              
              <AnimatedInput
                label={t('securityScreen.confirmNewPassword', 'Xác nhận mật khẩu mới')}
                placeholder={t('securityScreen.confirmNewPassword', 'Xác nhận mật khẩu mới')}
                secureTextEntry
                icon={LockIcon}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                error={errors.confirmPassword}
              />

              <AnimatedButton
                title={t('securityScreen.saveChanges', 'Lưu thay đổi')}
                onPress={handleChangePassword}
                loading={loading}
                style={styles.submitButton}
              />
            </View>
          </Animated.View>

          {/* Biometrics Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('securityScreen.biometrics', 'Xác thực sinh trắc học')}</Text>
            <View style={styles.card}>
              <View style={styles.menuItem}>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{t('securityScreen.biometrics', 'Xác thực sinh trắc học')}</Text>
                  <Text style={styles.menuSubtitle}>{t('securityScreen.biometricsDesc', 'Sử dụng FaceID / TouchID để đăng nhập nhanh')}</Text>
                </View>
                <AnimatedSwitch
                  onValueChange={toggleBiometrics}
                  value={isBiometricsEnabled}
                  activeColor={colors.brand[500]}
                  inactiveColor={colors.neutral[200]}
                />
              </View>
            </View>
          </Animated.View>

          {/* Device Management Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t('securityScreen.deviceManagement', 'Thiết bị & Hoạt động')}</Text>
            <View style={styles.card}>
              <View style={styles.menuItem}>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{currentDevice}</Text>
                  <Text style={[styles.menuSubtitle, { color: colors.semantic.success }]}>
                    {t('securityScreen.activeSession', 'Đang hoạt động')}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: isDarkMode ? '#064E3B' : '#ECFDF5' }]}>
                  <CheckCircleIcon size={16} color={colors.semantic.success} />
                  <Text style={[styles.badgeText, { color: colors.semantic.success }]}>
                    {t('securityScreen.currentDevice', 'Thiết bị hiện tại')}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Delete Account Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.sectionContainer, { marginBottom: 40 }]}>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.menuItem} 
                activeOpacity={0.7}
                onPress={handleDeleteAccount}
              >
                <View style={[styles.iconContainer, styles.iconDestructive]}>
                  <TrashIcon size={24} color={colors.semantic.danger} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, styles.textDestructive]}>
                    {t('securityScreen.deleteAccount', 'Xóa tài khoản')}
                  </Text>
                  <Text style={styles.menuSubtitle}>
                    {t('securityScreen.deleteAccountDesc', 'Xóa vĩnh viễn dữ liệu tài khoản')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.xl,
    padding: 16,
    ...SHADOWS.sm,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 8,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.brand[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconDestructive: {
    backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2',
  },
  menuTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: colors.neutral[800],
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: colors.neutral[400],
    lineHeight: 16,
  },
  textDestructive: {
    color: colors.semantic.danger,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  }
});