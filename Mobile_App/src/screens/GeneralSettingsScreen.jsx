import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  Vibration,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInDown,
  FadeOutDown,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedSwitch from '../components/AnimatedSwitch';
import { 
  ArrowLeftIcon, 
  GlobeIcon, 
  MoonIcon, 
  BellIcon, 
  TrashIcon, 
  InfoIcon, 
  DocumentIcon,
  ChevronRightIcon,
  CheckCircleIcon
} from '../components/icons/CustomIcons';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LanguageOption = ({ title, isActive, onPress, colors, isDarkMode, styles }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedPressable
      onPressIn={() => scale.value = withSpring(0.95)}
      onPressOut={() => scale.value = withSpring(1)}
      onPress={onPress}
      style={[
        styles.languageOption, 
        animatedStyle,
        isActive && {
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(240, 81, 35, 0.08)',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(240, 81, 35, 0.2)',
          borderWidth: 1,
        }
      ]}
    >
      <Text style={[styles.languageOptionText, isActive && styles.languageOptionTextActive]}>
        {title}
      </Text>
      {isActive ? (
        <Animated.View entering={ZoomIn.duration(200)} exiting={ZoomOut.duration(200)}>
          <CheckCircleIcon size={24} color={colors.brand[500]} />
        </Animated.View>
      ) : (
        <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.neutral[300], backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'transparent' }} />
      )}
    </AnimatedPressable>
  );
};

const AVAILABLE_LANGUAGES = [
  { code: 'vi' },
  { code: 'en' },
  { code: 'ja' },
  { code: 'ko' },
  { code: 'zh' },
];

export default function GeneralSettingsScreen({ navigation }) {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  // State for toggles
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isClearCacheModalVisible, setClearCacheModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [cacheSize, setCacheSize] = useState(t('settings.calculating'));
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success'
  });

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const calculateCacheSize = async () => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      let totalSize = 0;
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${cacheDir}${file}`, { size: true });
        if (fileInfo.exists && !fileInfo.isDirectory) {
          totalSize += fileInfo.size || 0;
        }
      }
      setCacheSize(formatBytes(totalSize));
    } catch (error) {
      console.log('Error calculating cache size:', error);
      setCacheSize(t('settings.unknown'));
    }
  };

  const loadSettings = async () => {
    try {
      const soundSetting = await AsyncStorage.getItem('@settings_sound');
      if (soundSetting !== null) {
        setIsSoundEnabled(soundSetting === 'true');
      }
    } catch (e) {
      console.log('Error loading settings', e);
    }
  };

  useEffect(() => {
    calculateCacheSize();
    loadSettings();
  }, []);

  const toggleSound = async () => {
    const newValue = !isSoundEnabled;
    setIsSoundEnabled(newValue);
    if (newValue) {
      Vibration.vibrate(50);
    }
    try {
      await AsyncStorage.setItem('@settings_sound', newValue.toString());
    } catch (e) {
      console.log(e);
    }
  };

  const handleClearCache = () => {
    setClearCacheModalVisible(true);
  };

  const performClearCache = async () => {
    setClearCacheModalVisible(false);
    try {
      const cacheDir = FileSystem.cacheDirectory;
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      
      for (const file of files) {
        await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
      }
      
      await calculateCacheSize();
      
      setAlertConfig({
        visible: true,
        title: t('common.success'),
        message: t('settings.clearCacheSuccess'),
        type: 'success'
      });
      setCacheSize('0 B');
      setClearCacheModalVisible(false);
    } catch (error) {
      console.log('Error clearing cache:', error);
      setAlertConfig({
        visible: true,
        title: t('common.error'),
        message: t('settings.clearCacheError'),
        type: 'error'
      });
      setClearCacheModalVisible(false);
    }
  };

  const renderMenuItem = ({ icon, title, subtitle, onPress, toggleValue, onToggle, isDestructive }) => {
    const isToggle = onToggle !== undefined;

    return (
      <TouchableOpacity 
        style={styles.menuItem} 
        activeOpacity={isToggle ? 1 : 0.7}
        onPress={isToggle ? onToggle : onPress}
      >
        <View style={[styles.iconContainer, isDestructive && styles.iconDestructive]}>
          {icon(isDestructive ? colors.semantic.danger : colors.brand[500])}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, isDestructive && styles.textDestructive]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {isToggle ? (
          <AnimatedSwitch
            onValueChange={onToggle}
            value={toggleValue}
            activeColor={colors.brand[500]}
            inactiveColor={colors.neutral[200]}
          />
        ) : (
          <ChevronRightIcon size={20} color={colors.neutral[400]} />
        )}
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.displayAndLanguage')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <GlobeIcon size={24} color={color} />, 
              title: t('settings.language'), 
              subtitle: t(`languages.${i18n.language}`),
              onPress: () => setLanguageModalVisible(true)
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <MoonIcon size={24} color={color} />, 
              title: t('settings.darkMode'),
              toggleValue: isDarkMode,
              onToggle: toggleDarkMode
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.system')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <BellIcon size={24} color={color} />, 
              title: t('settings.sound'), 
              toggleValue: isSoundEnabled,
              onToggle: toggleSound
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <TrashIcon size={24} color={color} />, 
              title: t('settings.clearCache'),
              subtitle: `${t('settings.currentSize')}: ${cacheSize}`,
              isDestructive: true,
              onPress: () => setClearCacheModalVisible(true)
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.information')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <DocumentIcon size={24} color={color} />, 
              title: t('settings.termsAndPolicies'),
              onPress: () => navigation.navigate('LegalAndPolicies')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <InfoIcon size={24} color={color} />, 
              title: t('settings.appInfo'),
              subtitle: `${t('common.version')} 1.0.0`,
              onPress: () => navigation.navigate('AppInfo')
            })}
          </View>
        </View>
      </ScrollView>

      {/* Clear Cache Confirmation Modal */}
      <Modal
        visible={isClearCacheModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClearCacheModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <TrashIcon size={32} color={colors.semantic.danger} />
            </View>
            <Text style={styles.modalTitle}>{t('settings.clearCacheTitle')}</Text>
            <Text style={styles.modalMessage}>
              {t('settings.clearCacheMessage')}
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setClearCacheModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={performClearCache}
              >
                <Text style={styles.confirmButtonText}>{t('common.delete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModalVisible(false)}
        >
          <Animated.View 
            entering={ZoomIn.duration(300)}
            exiting={ZoomOut.duration(200)}
            style={styles.languageModalWrapper}
          >
            <LinearGradient
              colors={isDarkMode ? ['rgba(31, 41, 55, 0.95)', 'rgba(17, 24, 39, 0.95)'] : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 250, 252, 0.95)']}
              style={styles.languageModalContent}
            >
              <Text style={styles.languageModalTitle}>{t('settings.language')}</Text>
              
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350 }}>
                {AVAILABLE_LANGUAGES.map((lang, index) => (
                  <View key={lang.code}>
                    <LanguageOption 
                      title={t(`languages.${lang.code}`)}
                      isActive={i18n.language === lang.code}
                      onPress={() => {
                        i18n.changeLanguage(lang.code);
                        setTimeout(() => setLanguageModalVisible(false), 200);
                      }}
                      colors={colors}
                      isDarkMode={isDarkMode}
                      styles={styles}
                    />
                    {index < AVAILABLE_LANGUAGES.length - 1 && <View style={{ height: 12 }} />}
                  </View>
                ))}
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Alert Modal */}
      <Modal
        visible={alertConfig.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconContainer, { backgroundColor: alertConfig.type === 'success' ? (isDarkMode ? '#064E3B' : '#ECFDF5') : (isDarkMode ? '#7F1D1D' : '#FEF2F2') }]}>
              {alertConfig.type === 'success' ? (
                <CheckCircleIcon size={32} color={colors.semantic.success} />
              ) : (
                <InfoIcon size={32} color={colors.semantic.danger} />
              )}
            </View>
            <Text style={styles.modalTitle}>{alertConfig.title}</Text>
            <Text style={styles.modalMessage}>{alertConfig.message}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.brand[500], ...SHADOWS.sm }]}
                onPress={() => setAlertConfig({ ...alertConfig, visible: false })}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
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
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    ...SHADOWS.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: colors.neutral[400],
    marginTop: 2,
  },
  textDestructive: {
    color: colors.semantic.danger,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginLeft: 56,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: RADIUS['2xl'],
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: TYPOGRAPHY.base,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.neutral[100],
  },
  confirmButton: {
    backgroundColor: colors.semantic.danger,
    ...SHADOWS.sm,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: colors.neutral[700],
  },
  confirmButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: colors.neutral[50],
  },
  languageModalWrapper: {
    width: '100%',
    maxWidth: 340,
  },
  languageModalContent: {
    borderRadius: RADIUS['3xl'],
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
    ...SHADOWS.futuristic,
  },
  languageModalTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: RADIUS.xl,
    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageOptionText: {
    fontSize: TYPOGRAPHY.base,
    color: colors.neutral[700],
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  languageOptionTextActive: {
    color: colors.brand[500],
    fontWeight: TYPOGRAPHY.weight.bold,
  }
});