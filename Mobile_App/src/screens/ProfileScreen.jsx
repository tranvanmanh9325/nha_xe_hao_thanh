import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { 
  UserIcon, 
  SettingsIcon, 
  BellIcon, 
  ShieldIcon, 
  HelpIcon, 
  LogoutIcon, 
  ChevronRightIcon, 
  TicketOutlineIcon 
} from '../components/icons/CustomIcons';
import { TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import authService from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors, isDarkMode);
  const [userProfile, setUserProfile] = useState({
    fullName: t('common.loading'),
    phone: "---",
    tier: t('profile.defaultTier'),
    points: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const response = await authService.getProfile();
          if (response) {
            setUserProfile({
              fullName: response.fullName || t('profile.defaultName'),
              phone: response.phone || "---",
              tier: response.tier || t('profile.defaultTier'),
              points: response.points || 0,
            });
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle'),
      t('profile.logoutConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: "cancel"
        },
        { 
          text: t('profile.logout'), 
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              // Navigate back to Login screen and reset stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }
        }
      ]
    );
  };

  const renderMenuItem = (icon, title, subtitle = null, isDestructive = false, onPress = () => {}) => {
    return (
      <TouchableOpacity 
        style={styles.menuItem} 
        activeOpacity={0.7}
        onPress={onPress}
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
        {!isDestructive && (
          <ChevronRightIcon size={20} color={colors.neutral[400]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header / User Info */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <UserIcon size={40} color={colors.white} />
          </View>
          <Text style={styles.userName}>{userProfile.fullName}</Text>
          <Text style={styles.userPhone}>{userProfile.phone}</Text>
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t('profile.membershipTier')}</Text>
            <Text style={styles.cardTier}>{userProfile.tier}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.pointsLabel}>{t('profile.pointsLabel')}</Text>
            <Text style={styles.pointsValue}>
              {userProfile.points.toLocaleString('vi-VN')} <Text style={styles.pointsUnit}>H-Coin</Text>
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
          <Text style={styles.progressText}>{t('profile.pointsProgress')}</Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.myAccount')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <UserIcon size={24} color={color} />, 
              t('profile.personalProfile'), 
              t('profile.personalProfileDesc')
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <ShieldIcon size={24} color={color} />, 
              t('profile.security'),
              t('profile.securityDesc'),
              false,
              () => navigation.navigate('Security')
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.activities')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <TicketOutlineIcon size={24} color={color} />, 
              t('profile.bookingHistory'),
              null,
              false,
              () => navigation.navigate('BookingHistory')
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <BellIcon size={24} color={color} />, 
              t('profile.notificationSettings'),
              null,
              false,
              () => navigation.navigate('NotificationSettings')
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('profile.others')}</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <SettingsIcon size={24} color={color} />, 
              t('profile.generalSettings'),
              null,
              false,
              () => navigation.navigate('GeneralSettings')
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <HelpIcon size={24} color={color} />, 
              t('profile.support'),
              null,
              false,
              () => navigation.navigate('Support')
            )}
          </View>
        </View>

        {/* Logout Button in Thumb Zone */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <LogoutIcon size={20} color={colors.semantic.danger} />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>{t('common.version')} 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.brand,
    position: 'relative',
  },
  avatarGlow: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.brand[400],
    opacity: 0.5,
    transform: [{ scale: 1.15 }],
  },
  userName: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.neutral[900],
    marginBottom: 4,
  },
  userPhone: {
    fontSize: TYPOGRAPHY.base,
    color: colors.neutral[500],
  },
  membershipCard: {
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: RADIUS['2xl'],
    padding: 20,
    marginBottom: 32,
    ...SHADOWS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.neutral[500],
    fontSize: TYPOGRAPHY.sm,
  },
  cardTier: {
    color: colors.brand[500],
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  cardBody: {
    marginBottom: 16,
  },
  pointsLabel: {
    color: colors.neutral[500],
    fontSize: TYPOGRAPHY.xs,
    marginBottom: 4,
  },
  pointsValue: {
    color: colors.neutral[900],
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  pointsUnit: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: colors.brand[500],
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.neutral[100],
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.brand[500],
    borderRadius: 3,
  },
  progressText: {
    color: colors.neutral[500],
    fontSize: TYPOGRAPHY.xs,
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
    marginLeft: 56, // Align with text
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2',
    paddingVertical: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: isDarkMode ? '#991B1B' : '#FECACA',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: colors.semantic.danger,
  },
  versionText: {
    textAlign: 'center',
    color: colors.neutral[400],
    fontSize: TYPOGRAPHY.sm,
  }
});