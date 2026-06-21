import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeftIcon, 
  GlobeIcon, 
  MoonIcon, 
  BellIcon, 
  TrashIcon, 
  InfoIcon, 
  DocumentIcon,
  ChevronRightIcon
} from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';

export default function GeneralSettingsScreen({ navigation }) {
  // State for toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
  const toggleSound = () => setIsSoundEnabled(previousState => !previousState);

  const handleClearCache = () => {
    Alert.alert(
      "Xóa bộ nhớ đệm",
      "Bạn có chắc chắn muốn xóa bộ nhớ đệm của ứng dụng? Quá trình này sẽ không xóa tài khoản hay dữ liệu cá nhân của bạn.",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive",
          onPress: () => {
            // Simulate clearing cache
            Alert.alert("Thành công", "Đã xóa bộ nhớ đệm.");
          }
        }
      ]
    );
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
          {icon(isDestructive ? COLORS.semantic.danger : COLORS.brand[500])}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuTitle, isDestructive && styles.textDestructive]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {isToggle ? (
          <Switch
            trackColor={{ false: COLORS.neutral[200], true: COLORS.brand[500] }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.neutral[200]}
            onValueChange={onToggle}
            value={toggleValue}
          />
        ) : (
          <ChevronRightIcon size={20} color={COLORS.neutral[400]} />
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
          <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt chung</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hiển thị & Ngôn ngữ</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <GlobeIcon size={24} color={color} />, 
              title: "Ngôn ngữ", 
              subtitle: "Tiếng Việt",
              onPress: () => Alert.alert("Thông báo", "Tính năng đổi ngôn ngữ đang phát triển.")
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <MoonIcon size={24} color={color} />, 
              title: "Giao diện tối",
              toggleValue: isDarkMode,
              onToggle: toggleDarkMode
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hệ thống</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <BellIcon size={24} color={color} />, 
              title: "Âm thanh thông báo", 
              toggleValue: isSoundEnabled,
              onToggle: toggleSound
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <TrashIcon size={24} color={color} />, 
              title: "Xóa bộ nhớ đệm",
              subtitle: "Giải phóng dung lượng ứng dụng",
              isDestructive: true,
              onPress: handleClearCache
            })}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thông tin</Text>
          <View style={styles.menuCard}>
            {renderMenuItem({
              icon: (color) => <DocumentIcon size={24} color={color} />, 
              title: "Điều khoản & Chính sách",
              onPress: () => navigation.navigate('LegalAndPolicies')
            })}
            <View style={styles.divider} />
            {renderMenuItem({
              icon: (color) => <InfoIcon size={24} color={color} />, 
              title: "Thông tin ứng dụng",
              subtitle: "Phiên bản 1.0.0",
              onPress: () => navigation.navigate('AppInfo')
            })}
          </View>
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
    backgroundColor: '#FEF2F2',
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
  textDestructive: {
    color: COLORS.semantic.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginLeft: 56,
  },
});