import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, SHADOWS, RADIUS } from '../theme';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get('/privacy-policies');
        if (response.data && (response.data.success === true || response.data.status === 'success')) {
          setSections(response.data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chính sách bảo mật:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

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
        <Text style={styles.headerTitle}>{t('legal.privacyTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introContainer}>
          <Text style={styles.lastUpdate}>{t('legal.lastUpdate')}</Text>
          <Text style={styles.introText}>
            {t('legal.privacyIntro')}
          </Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.brand[500]} style={{ marginVertical: 40 }} />
          ) : (!sections || sections.length === 0) ? (
            <Text style={styles.emptyText}>{t('legal.emptyPrivacy')}</Text>
          ) : (
            sections.map((section, index) => {
              const lang = i18n.language || 'vi';
              
              // Helper function to get localized content from the API object
              const getLocalizedProp = (propName) => {
                if (lang === 'vi') return section[propName];
                const translation = section.translations?.find(t => t.languageCode === lang);
                const localizedValue = translation ? translation[propName] : undefined;
                // Fallback to Vietnamese if localized string is missing
                return localizedValue || section[propName];
              };

              const localizedTitle = getLocalizedProp('title');
              const localizedContent = getLocalizedProp('content');

              return (
                <View key={section.id || index} style={[styles.section, index === sections.length - 1 && styles.lastSection]}>
                  <Text style={styles.sectionTitle}>{localizedTitle}</Text>
                  <Text style={styles.sectionContent}>{localizedContent}</Text>
                </View>
              );
            })
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('legal.privacyFooter')}</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  introContainer: {
    marginBottom: 20,
  },
  lastUpdate: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[500],
    fontStyle: 'italic',
    marginBottom: 12,
  },
  introText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[700],
    lineHeight: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 20,
    ...SHADOWS.sm,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    paddingBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.brand[700],
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[600],
    lineHeight: 24,
    textAlign: 'justify',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginVertical: 40,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[500],
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});