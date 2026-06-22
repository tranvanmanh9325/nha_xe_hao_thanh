import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Linking,
  Modal,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  SearchIcon,
  PhoneIcon,
  MailIcon,
  MessageIcon,
  ChevronDownIcon,
  XIcon
} from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import { useTranslation } from 'react-i18next';

export default function SupportScreen({ navigation }) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', email: '', showCopyBtn: false, isFaq: false, question: '' });
  const [settings, setSettings] = useState({ hotline: '1900 1234', email: 'haothanhhungnguyen@gmail.com' });
  const [isLoading, setIsLoading] = useState(true);

  const [faqs, setFaqs] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch Settings
        const settingsRes = await api.get('/settings');
        if (settingsRes.data && settingsRes.data.success) {
          const { hotline, email } = settingsRes.data.data;
          setSettings({ 
            hotline: hotline || '1900 1234', 
            email: email || 'haothanhhungnguyen@gmail.com' 
          });
        }
        
        // Fetch FAQs
        const faqsRes = await api.get('/faqs');
        if (faqsRes.data && faqsRes.data.success) {
          setFaqs(faqsRes.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredFaqs = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    const query = searchQuery.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }, [faqs, searchQuery]);

  const handleSelectSuggestion = (faq) => {
    Keyboard.dismiss();
    setSearchQuery('');
    setExpandedFaq(faq.id);
    
    setModalConfig({
      title: "Chi tiết hỗ trợ",
      question: faq.question,
      message: faq.answer,
      email: '',
      showCopyBtn: false,
      isFaq: true
    });
    setModalVisible(true);
  };

  const HighlightText = ({ text, highlight, isSnippet }) => {
    if (!highlight.trim()) {
      return <Text style={isSnippet ? styles.snippetText : styles.suggestionText} numberOfLines={1}>{text}</Text>;
    }
    
    let displayText = text;
    if (isSnippet) {
      const matchIndex = text.toLowerCase().indexOf(highlight.toLowerCase());
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(text.length, matchIndex + highlight.length + 30);
        displayText = (start > 0 ? "..." : "") + text.substring(start, end).trim() + (end < text.length ? "..." : "");
      }
    }

    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
    const parts = displayText.split(regex);
    
    return (
      <Text style={isSnippet ? styles.snippetText : styles.suggestionText} numberOfLines={1}>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <Text key={index} style={{ color: COLORS.brand[500], fontWeight: 'bold' }}>{part}</Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const handleContact = async (type) => {
    try {
      switch(type) {
        case 'call':
          const phoneUrl = `tel:${settings.hotline.replace(/\s/g, '')}`;
          const canCall = await Linking.canOpenURL(phoneUrl);
          if (canCall) {
            await Linking.openURL(phoneUrl);
          } else {
            setModalConfig({
              title: "Thông báo",
              message: `Không thể thực hiện cuộc gọi trên thiết bị này.\nHotline: ${settings.hotline}`,
              email: "",
              showCopyBtn: false,
              isFaq: false
            });
            setModalVisible(true);
          }
          break;
        case 'email':
          const emailAddress = settings.email;
          const emailUrl = `mailto:${emailAddress}`;
          const canEmail = await Linking.canOpenURL(emailUrl);
          if (canEmail) {
            await Linking.openURL(emailUrl);
          } else {
            setModalConfig({
              title: "Lỗi",
              message: `Thiết bị chưa cài đặt ứng dụng Email. Bạn vui lòng gửi email về:\n${emailAddress}`,
              email: emailAddress,
              showCopyBtn: true,
              isFaq: false
            });
            setModalVisible(true);
          }
          break;
        case 'chat':
          navigation.navigate('Chat');
          break;
      }
    } catch (error) {
      setModalConfig({
        title: "Lỗi",
        message: "Không thể thực hiện tác vụ này trên thiết bị của bạn.",
        email: "",
        showCopyBtn: false,
        isFaq: false
      });
      setModalVisible(true);
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchSection}>
          <Text style={styles.greetingText}>Xin chào,</Text>
          <Text style={styles.askText}>Chúng tôi có thể giúp gì cho bạn?</Text>
          
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <SearchIcon size={20} color={COLORS.neutral[400]} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('support.searchPlaceholder')}
                placeholderTextColor={COLORS.neutral[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearSearchBtn}
                  onPress={() => setSearchQuery('')}
                >
                  <XIcon size={18} color={COLORS.neutral[400]} />
                </TouchableOpacity>
              )}
            </View>

            {searchQuery.trim().length > 0 && (
              <View style={styles.suggestionsInlineContainer}>
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => {
                    const questionMatches = faq.question.toLowerCase().includes(searchQuery.toLowerCase());
                    const answerMatches = faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
                    return (
                      <TouchableOpacity 
                        key={faq.id} 
                        style={[
                          styles.suggestionItem,
                          index === filteredFaqs.length - 1 && styles.suggestionItemLast
                        ]}
                        onPress={() => handleSelectSuggestion(faq)}
                        activeOpacity={0.7}
                      >
                        <SearchIcon size={16} color={COLORS.neutral[400]} />
                        <View style={styles.suggestionTextContainer}>
                          <HighlightText text={faq.question} highlight={searchQuery} isSnippet={false} />
                          {!questionMatches && answerMatches && (
                            <HighlightText text={faq.answer} highlight={searchQuery} isSnippet={true} />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.noResultContainer}>
                    <Text style={styles.noResultText}>Không tìm thấy kết quả phù hợp</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>{t('support.categories', 'Liên hệ nhanh')}</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('call')}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.semantic.info + '20' }]}>
                <PhoneIcon size={24} color={COLORS.semantic.info} />
              </View>
              <Text style={styles.contactTitle}>{t('support.contactCall', 'Gọi Hotline')}</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.semantic.info} style={{ marginTop: 2 }} />
              ) : (
                <Text style={styles.contactSubtitle}>{settings.hotline}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('email')}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.semantic.success + '20' }]}>
                <MailIcon size={24} color={COLORS.semantic.success} />
              </View>
              <Text style={styles.contactTitle}>{t('support.contactRequest', 'Gửi Email')}</Text>
              <Text style={styles.contactSubtitle}>{t('support.contactRequestDesc', 'Phản hồi 24h')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('chat')}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.brand[50] }]}>
                <MessageIcon size={24} color={COLORS.brand[500]} />
              </View>
              <Text style={styles.contactTitle}>{t('support.contactChat', 'Chat Online')}</Text>
              <Text style={styles.contactSubtitle}>{t('support.contactChatDesc', 'Trực tiếp')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>{t('support.recentArticles', 'Câu hỏi thường gặp')}</Text>
          <View style={styles.faqList}>
            {faqs.map((faq) => (
              <TouchableOpacity 
                key={faq.id} 
                style={styles.faqItem}
                onPress={() => toggleFaq(faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, expandedFaq === faq.id && { color: COLORS.brand[500] }]}>
                    {faq.question}
                  </Text>
                  <View style={[styles.chevron, expandedFaq === faq.id && styles.chevronExpanded]}>
                    <ChevronDownIcon 
                      size={20} 
                      color={expandedFaq === faq.id ? COLORS.brand[500] : COLORS.neutral[400]} 
                    />
                  </View>
                </View>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>{t('support.stillNeedHelp')}</Text>
          <TouchableOpacity 
            style={styles.ticketButton}
            onPress={() => navigation.navigate('CreateSupportRequest')}
          >
            <Text style={styles.ticketButtonText}>{t('support.contactRequest')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            
            {modalConfig.isFaq ? (
              <View style={styles.faqModalBody}>
                <Text style={styles.faqModalQuestion}>{modalConfig.question}</Text>
                <Text style={styles.faqModalAnswer}>{modalConfig.message}</Text>
              </View>
            ) : (
              <Text style={styles.modalMessage}>{modalConfig.message}</Text>
            )}
            
            {modalConfig.showCopyBtn && (
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={async () => {
                  await Clipboard.setStringAsync(modalConfig.email);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.copyButtonText}>Sao chép Email</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    ...SHADOWS.sm,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: COLORS.brand[500],
    borderBottomLeftRadius: RADIUS['2xl'],
    borderBottomRightRadius: RADIUS['2xl'],
    ...SHADOWS.md,
    zIndex: 100,
  },
  greetingText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  askText: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.white,
    marginBottom: 20,
  },
  searchWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    height: 52,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[900],
  },
  clearSearchBtn: {
    padding: 8,
  },
  suggestionsInlineContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginTop: 12,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[800],
  },
  snippetText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  noResultContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noResultText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[500],
  },
  contactSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactCard: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.neutral[800],
    textAlign: 'center',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.neutral[500],
    textAlign: 'center',
  },
  faqSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  faqList: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.neutral[800],
    paddingRight: 16,
  },
  chevron: {
    transition: 'transform 0.3s ease',
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[600],
    lineHeight: 22,
  },
  footerSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[500],
    marginBottom: 16,
  },
  ticketButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.brand[500],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
  },
  ticketButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.brand[500],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 16,
  },
  faqModalBody: {
    width: '100%',
    backgroundColor: COLORS.neutral[50],
    padding: 16,
    borderRadius: RADIUS.xl,
    marginBottom: 24,
  },
  faqModalQuestion: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.brand[500],
    marginBottom: 8,
    textAlign: 'left',
  },
  faqModalAnswer: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.neutral[700],
    textAlign: 'left',
    lineHeight: 22,
  },
  modalMessage: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  copyButton: {
    backgroundColor: COLORS.brand[500],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  copyButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  closeButton: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.neutral[500],
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.semibold,
  }
});