import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeftIcon, 
  GlobeIcon, 
  DocumentIcon,
  ShieldIcon,
  StarIcon,
  ChevronRightIcon
} from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import api from '../services/api';

export default function AppInfoScreen({ navigation }) {
  const [companyName, setCompanyName] = useState('Hào Thành Bus');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && response.data.data && response.data.data.companyName) {
          setCompanyName(response.data.data.companyName);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin nhà xe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleRateApp = () => {
    // TODO: Thay thế bằng Package Name (Android) và App ID (iOS) thật của ứng dụng "Hào Thanh" khi đã publish
    const androidPackageName = "com.haothanh.app";
    const iosAppId = "id123456789"; 

    if (Platform.OS === 'android') {
      // Mở Google Play thẳng tới ứng dụng
      Linking.openURL(`market://details?id=${androidPackageName}`).catch(() => {
        // Fallback mở bằng trình duyệt nếu không có app Google Play
        Linking.openURL(`https://play.google.com/store/apps/details?id=${androidPackageName}`);
      });
    } else if (Platform.OS === 'ios') {
      // Mở App Store thẳng tới ứng dụng
      Linking.openURL(`itms-apps://itunes.apple.com/app/${iosAppId}?action=write-review`).catch(() => {
        // Fallback mở bằng trình duyệt
        Linking.openURL(`https://apps.apple.com/app/${iosAppId}`);
      });
    }
  };

  const handleOpenWebsite = async () => {
    const url = 'https://haothanhbus.vn';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở trang web này trên thiết bị của bạn.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra sự cố khi mở trang web.");
    }
  };

  const renderMenuItem = ({ icon, title, subtitle, onPress }) => {
    return (
      <TouchableOpacity 
        style={styles.menuItem} 
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.iconContainer}>
          {icon(COLORS.brand[500])}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <ChevronRightIcon size={20} color={COLORS.neutral[400]} />
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
          <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin ứng dụng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo and App Details */}
        <View style={styles.appInfoContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.appName}>{companyName}</Text>
          <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
        </View>

        {/* Links Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Liên kết</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <GlobeIcon size={24} color={color} />, 
              title: "Website chính thức", 
              subtitle: "haothanhbus.vn",
              onPress: handleOpenWebsite
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <StarIcon size={24} color={color} />, 
              title: "Đánh giá ứng dụng",
              onPress: handleRateApp
            })}
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pháp lý</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <DocumentIcon size={24} color={color} />, 
              title: "Điều khoản dịch vụ",
              onPress: () => navigation.navigate('TermsOfService')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <ShieldIcon size={24} color={color} />, 
              title: "Chính sách bảo mật",
              onPress: () => navigation.navigate('PrivacyPolicy')
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.copyrightText}>© {new Date().getFullYear()} {companyName}.</Text>
          <Text style={styles.rightsText}>All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  appInfoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: RADIUS['2xl'],
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.md,
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 4,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[500],
    fontWeight: TYPOGRAPHY.weight.medium,
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
  menuTextContainer: {
    flex: 1,
    marginRight: 16,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginLeft: 56,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  copyrightText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[400],
    fontWeight: TYPOGRAPHY.weight.medium,
    marginBottom: 2,
  },
  rightsText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.neutral[400],
  }
});