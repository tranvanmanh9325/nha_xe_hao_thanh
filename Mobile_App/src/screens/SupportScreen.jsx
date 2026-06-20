import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  TextInput,
  Linking,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import api from '../services/api';
import { 
  ArrowLeftIcon, 
  SearchIcon,
  PhoneIcon,
  MailIcon,
  MessageIcon,
  ChevronDownIcon
} from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';

export default function SupportScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', email: '', showCopyBtn: false });
  const [settings, setSettings] = useState({ hotline: '1900 1234', email: 'haothanhhungnguyen@gmail.com' });
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && response.data.success) {
          const { hotline, email } = response.data.data;
          setSettings({ 
            hotline: hotline || '1900 1234', 
            email: email || 'haothanhhungnguyen@gmail.com' 
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const faqs = [
    {
      id: 1,
      question: "Làm thế nào để đặt vé xe?",
      answer: "Bạn có thể đặt vé dễ dàng thông qua ứng dụng bằng cách chọn điểm đi, điểm đến, ngày đi và chọn chuyến xe phù hợp. Sau đó tiến hành thanh toán để hoàn tất."
    },
    {
      id: 2,
      question: "Chính sách hoàn/hủy vé như thế nào?",
      answer: "Vé có thể được hủy miễn phí trước 24 giờ so với giờ khởi hành. Hủy vé trong vòng 24 giờ sẽ chịu phí 30% giá vé."
    },
    {
      id: 3,
      question: "Tôi có thể thanh toán qua các hình thức nào?",
      answer: "Chúng tôi hỗ trợ nhiều hình thức thanh toán bao gồm: Thẻ tín dụng/ghi nợ, Ví điện tử (Momo, ZaloPay, VNPay) và Chuyển khoản ngân hàng."
    },
    {
      id: 4,
      question: "Tôi có được mang theo thú cưng không?",
      answer: "Hiện tại nhà xe chưa hỗ trợ mang theo thú cưng trên khoang hành khách để đảm bảo không gian chung. Rất mong quý khách thông cảm."
    }
  ];

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
              showCopyBtn: false
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
              showCopyBtn: true
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
        showCopyBtn: false
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
        <Text style={styles.headerTitle}>Trợ giúp & Hỗ trợ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchSection}>
          <Text style={styles.greetingText}>Xin chào,</Text>
          <Text style={styles.askText}>Chúng tôi có thể giúp gì cho bạn?</Text>
          
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color={COLORS.neutral[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm vấn đề của bạn..."
              placeholderTextColor={COLORS.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Liên hệ nhanh</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('call')}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.semantic.info + '20' }]}>
                <PhoneIcon size={24} color={COLORS.semantic.info} />
              </View>
              <Text style={styles.contactTitle}>Gọi Hotline</Text>
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
              <Text style={styles.contactTitle}>Gửi Email</Text>
              <Text style={styles.contactSubtitle}>Phản hồi 24h</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('chat')}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.brand[50] }]}>
                <MessageIcon size={24} color={COLORS.brand[500]} />
              </View>
              <Text style={styles.contactTitle}>Chat Online</Text>
              <Text style={styles.contactSubtitle}>Trực tiếp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
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
          <Text style={styles.footerText}>Bạn vẫn cần thêm hỗ trợ?</Text>
          <TouchableOpacity style={styles.ticketButton}>
            <Text style={styles.ticketButtonText}>Gửi yêu cầu hỗ trợ mới</Text>
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
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>
            
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
    marginBottom: 12,
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