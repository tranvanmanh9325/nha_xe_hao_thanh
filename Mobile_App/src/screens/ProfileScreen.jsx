import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
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
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import authService from '../services/authService';

export default function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState({
    fullName: "Đang tải...",
    phone: "---",
    tier: "Thành viên Bạc",
    points: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const response = await authService.getProfile();
          if (response && response.data) {
            setUserProfile({
              fullName: response.data.fullName || "Người dùng",
              phone: response.data.phone || "---",
              tier: response.data.tier || "Thành viên Bạc",
              points: response.data.points || 0,
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
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Đăng xuất", 
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
          {icon(isDestructive ? COLORS.semantic.danger : COLORS.brand[500])}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, isDestructive && styles.textDestructive]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {!isDestructive && (
          <ChevronRightIcon size={20} color={COLORS.neutral[400]} />
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
            <UserIcon size={40} color={COLORS.white} />
          </View>
          <Text style={styles.userName}>{userProfile.fullName}</Text>
          <Text style={styles.userPhone}>{userProfile.phone}</Text>
        </View>

        {/* Membership Card */}
        <View style={styles.membershipCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Hạng thành viên</Text>
            <Text style={styles.cardTier}>{userProfile.tier}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.pointsLabel}>Điểm tích lũy</Text>
            <Text style={styles.pointsValue}>
              {userProfile.points.toLocaleString('vi-VN')} <Text style={styles.pointsUnit}>H-Coin</Text>
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '40%' }]} />
          </View>
          <Text style={styles.progressText}>Cần thêm 750 H-Coin để lên hạng Vàng</Text>
        </View>

        {/* Menu Sections */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <UserIcon size={24} color={color} />, 
              "Hồ sơ cá nhân", 
              "Cập nhật thông tin của bạn"
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <ShieldIcon size={24} color={color} />, 
              "Bảo mật & Mật khẩu",
              "Bảo vệ tài khoản của bạn"
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hoạt động</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <TicketOutlineIcon size={24} color={color} />, 
              "Lịch sử đặt vé"
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <BellIcon size={24} color={color} />, 
              "Cài đặt thông báo"
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Khác</Text>
          <View style={styles.menuCard}>
            {renderMenuItem(
              (color) => <SettingsIcon size={24} color={color} />, 
              "Cài đặt chung"
            )}
            <View style={styles.divider} />
            {renderMenuItem(
              (color) => <HelpIcon size={24} color={color} />, 
              "Trợ giúp & Hỗ trợ"
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
            <LogoutIcon size={20} color={COLORS.semantic.danger} />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
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
    backgroundColor: COLORS.brand[500],
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
    borderColor: COLORS.brand[400],
    opacity: 0.5,
    transform: [{ scale: 1.15 }],
  },
  userName: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 4,
  },
  userPhone: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[500],
  },
  membershipCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
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
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.sm,
  },
  cardTier: {
    color: COLORS.brand[500],
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  cardBody: {
    marginBottom: 16,
  },
  pointsLabel: {
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.xs,
    marginBottom: 4,
  },
  pointsValue: {
    color: COLORS.neutral[900],
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  pointsUnit: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.brand[500],
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brand[500],
    borderRadius: 3,
  },
  progressText: {
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.xs,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.brand[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconDestructive: {
    backgroundColor: '#FEF2F2', // Light red bg
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.neutral[800],
  },
  menuSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.neutral[400],
    marginTop: 2,
  },
  textDestructive: {
    color: COLORS.semantic.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
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
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.semantic.danger,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.neutral[400],
    fontSize: TYPOGRAPHY.sm,
  }
});