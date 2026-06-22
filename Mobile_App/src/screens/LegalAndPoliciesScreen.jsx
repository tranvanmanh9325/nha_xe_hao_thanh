import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeftIcon, 
  DocumentIcon,
  ShieldIcon,
  ChevronRightIcon
} from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { useTranslation } from 'react-i18next';

export default function LegalAndPoliciesScreen({ navigation }) {
  const { t } = useTranslation();

  const renderMenuItem = ({ icon, title, description, onPress }) => {
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
          <Text style={styles.menuTitle}>{title}</Text>
          {description && <Text style={styles.menuDescription}>{description}</Text>}
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
        <Text style={styles.headerTitle}>{t('legal.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            {t('legal.intro')}
          </Text>
        </View>

        <View style={styles.menuCard}>
          {renderMenuItem({
            icon: (color) => <DocumentIcon size={24} color={color} />, 
            title: t('legal.termsTitle'),
            description: t('legal.termsDesc'),
            onPress: () => navigation.navigate('TermsOfService')
          })}
          <View style={styles.divider} />
          {renderMenuItem({
            icon: (color) => <ShieldIcon size={24} color={color} />, 
            title: t('legal.privacyTitle'),
            description: t('legal.privacyDesc'),
            onPress: () => navigation.navigate('PrivacyPolicy')
          })}
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  introContainer: {
    marginBottom: 24,
  },
  introText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[600],
    lineHeight: 22,
    textAlign: 'center',
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
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
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
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.neutral[800],
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.neutral[500],
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
    marginLeft: 60,
  },
});