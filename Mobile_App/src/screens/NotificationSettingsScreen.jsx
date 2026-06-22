import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Vibration
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedSwitch from '../components/AnimatedSwitch';
import { 
  ArrowLeftIcon, 
  BellIcon, 
  MailIcon, 
  MessageIcon, 
  TicketOutlineIcon, 
  StarIcon,
  InfoIcon,
  MoonIcon
} from '../components/icons/CustomIcons';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

export default function NotificationSettingsScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);
  
  // Channels
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  // Topics
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [promotionsEnabled, setPromotionsEnabled] = useState(false);
  // System is always enabled, no state needed
  
  // Modes
  const [dndEnabled, setDndEnabled] = useState(false);

  const loadSettings = async () => {
    try {
      // First try to load from API if authenticated
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        try {
          const settings = await authService.getNotificationSettings();
          setPushEnabled(settings.pushEnabled);
          setEmailEnabled(settings.emailEnabled);
          setSmsEnabled(settings.smsEnabled);
          setBookingEnabled(settings.bookingEnabled);
          setPromotionsEnabled(settings.promotionsEnabled);
          setDndEnabled(settings.dndEnabled);
          
          // Sync API data to AsyncStorage for offline backup
          await AsyncStorage.multiSet([
            ['@settings_notif_push', String(settings.pushEnabled)],
            ['@settings_notif_email', String(settings.emailEnabled)],
            ['@settings_notif_sms', String(settings.smsEnabled)],
            ['@settings_notif_booking', String(settings.bookingEnabled)],
            ['@settings_notif_promo', String(settings.promotionsEnabled)],
            ['@settings_notif_dnd', String(settings.dndEnabled)],
          ]);
          return;
        } catch (apiError) {
          console.log('Failed to fetch notification settings from API, falling back to local storage', apiError);
        }
      }

      // Fallback to local storage
      const keys = ['@settings_notif_push', '@settings_notif_email', '@settings_notif_sms', '@settings_notif_booking', '@settings_notif_promo', '@settings_notif_dnd'];
      const values = await AsyncStorage.multiGet(keys);
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          const isEnabled = value === 'true';
          switch (key) {
            case '@settings_notif_push': setPushEnabled(isEnabled); break;
            case '@settings_notif_email': setEmailEnabled(isEnabled); break;
            case '@settings_notif_sms': setSmsEnabled(isEnabled); break;
            case '@settings_notif_booking': setBookingEnabled(isEnabled); break;
            case '@settings_notif_promo': setPromotionsEnabled(isEnabled); break;
            case '@settings_notif_dnd': setDndEnabled(isEnabled); break;
          }
        }
      });
    } catch (e) {
      console.log('Error loading notification settings', e);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = async (key, currentValue, setter, fieldName) => {
    const newValue = !currentValue;
    setter(newValue);
    if (newValue) {
      Vibration.vibrate(50);
    }
    
    // Save to local storage
    try {
      await AsyncStorage.setItem(key, newValue.toString());
    } catch (e) {
      console.log('Error saving notification setting to AsyncStorage', e);
    }

    // Sync to API
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        const currentSettings = {
          pushEnabled,
          emailEnabled,
          smsEnabled,
          bookingEnabled,
          promotionsEnabled,
          dndEnabled,
          [fieldName]: newValue // override the toggled field
        };
        await authService.updateNotificationSettings(currentSettings);
      }
    } catch (e) {
      console.log('Error syncing notification setting to API', e);
      // Optionally show a toast error message here
    }
  };

  const renderMenuItem = ({ icon, title, subtitle, toggleValue, onToggle, disabled = false }) => {
    return (
      <View style={[styles.menuItem, disabled && { opacity: 0.6 }]}>
        <View style={[styles.iconContainer, disabled && { backgroundColor: colors.neutral[100] }]}>
          {icon(disabled ? colors.neutral[400] : colors.brand[500])}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, disabled && { color: colors.neutral[500] }]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <AnimatedSwitch
          onValueChange={onToggle}
          value={toggleValue}
          activeColor={colors.brand[500]}
          inactiveColor={colors.neutral[200]}
          disabled={disabled}
        />
      </View>
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
        <Text style={styles.headerTitle}>{t('notificationSettings.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.channels')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <BellIcon size={24} color={color} />, 
              title: t('notificationSettings.push'), 
              subtitle: t('notificationSettings.pushDesc'),
              toggleValue: pushEnabled,
              onToggle: () => handleToggle('@settings_notif_push', pushEnabled, setPushEnabled, 'pushEnabled')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <MailIcon size={24} color={color} />, 
              title: t('notificationSettings.email'),
              subtitle: t('notificationSettings.emailDesc'),
              toggleValue: emailEnabled,
              onToggle: () => handleToggle('@settings_notif_email', emailEnabled, setEmailEnabled, 'emailEnabled')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <MessageIcon size={24} color={color} />, 
              title: t('notificationSettings.sms'),
              subtitle: t('notificationSettings.smsDesc'),
              toggleValue: smsEnabled,
              onToggle: () => handleToggle('@settings_notif_sms', smsEnabled, setSmsEnabled, 'smsEnabled')
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.topics')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <TicketOutlineIcon size={24} color={color} />, 
              title: t('notificationSettings.booking'), 
              subtitle: t('notificationSettings.bookingDesc'),
              toggleValue: bookingEnabled,
              onToggle: () => handleToggle('@settings_notif_booking', bookingEnabled, setBookingEnabled, 'bookingEnabled')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <StarIcon size={24} color={color} />, 
              title: t('notificationSettings.promotions'),
              subtitle: t('notificationSettings.promotionsDesc'),
              toggleValue: promotionsEnabled,
              onToggle: () => handleToggle('@settings_notif_promo', promotionsEnabled, setPromotionsEnabled, 'promotionsEnabled')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <InfoIcon size={24} color={color} />, 
              title: t('notificationSettings.system'),
              subtitle: t('notificationSettings.systemDesc'),
              toggleValue: true,
              onToggle: () => {},
              disabled: true // System notifications cannot be disabled
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.modes')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <MoonIcon size={24} color={color} />, 
              title: t('notificationSettings.doNotDisturb'),
              subtitle: t('notificationSettings.doNotDisturbDesc'),
              toggleValue: dndEnabled,
              onToggle: () => handleToggle('@settings_notif_dnd', dndEnabled, setDndEnabled, 'dndEnabled')
            })}
          </View>
        </View>
      </ScrollView>
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
  divider: {
    height: 1,
    backgroundColor: colors.neutral[100],
    marginLeft: 56,
  }
});