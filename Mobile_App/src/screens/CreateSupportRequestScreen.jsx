import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ChevronDownIcon, CheckCircleIcon } from '../components/icons/CustomIcons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../theme';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function CreateSupportRequestScreen({ navigation }) {
  const { t } = useTranslation();
  
  const TOPICS = [
    t('createRequest.topicBooking', 'Vấn đề đặt vé'),
    t('createRequest.topicPayment', 'Thanh toán & Hoàn tiền'),
    t('createRequest.topicService', 'Dịch vụ chuyến đi'),
    t('createRequest.topicOther', 'Khác')
  ];

  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateForm = () => {
    if (!topic) return t('createRequest.submitErrorMessage', 'Vui lòng chọn chủ đề');
    if (!title.trim()) return t('createRequest.submitErrorMessage', 'Vui lòng nhập tiêu đề');
    if (!description.trim()) return t('createRequest.submitErrorMessage', 'Vui lòng nhập nội dung chi tiết');
    if (description.trim().length < 10) return t('createRequest.submitErrorMessage', 'Nội dung chi tiết phải có ít nhất 10 ký tự');
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await api.post('/support-requests', {
        topic,
        title: title.trim(),
        description: description.trim()
      });

      if (response.data && response.data.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMsg(response.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={24} color={COLORS.neutral[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('createRequest.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              {t('createRequest.requestContentPlaceholder', 'Vui lòng cung cấp chi tiết...')}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createRequest.selectTopic')} <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => setShowTopicModal(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !topic && styles.placeholderText]}>
                  {topic || t('createRequest.selectTopic')}
                </Text>
                <ChevronDownIcon size={20} color={COLORS.neutral[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createRequest.requestContent')} <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder={t('createRequest.requestContentPlaceholder')}
                placeholderTextColor={COLORS.neutral[400]}
                maxLength={200}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('createRequest.requestContent')} <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('createRequest.requestContentPlaceholder')}
                placeholderTextColor={COLORS.neutral[400]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errorMsg) setErrorMsg('');
                }}
              />
            </View>

            {errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}

          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>{t('createRequest.submitButton')}</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* Topic Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTopicModal}
        onRequestClose={() => setShowTopicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowTopicModal(false)} />
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chọn chủ đề</Text>
              <TouchableOpacity onPress={() => setShowTopicModal(false)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TOPICS.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.topicItem, topic === item && styles.topicItemSelected]}
                  onPress={() => {
                    setTopic(item);
                    if (errorMsg) setErrorMsg('');
                    setShowTopicModal(false);
                  }}
                >
                  <Text style={[styles.topicText, topic === item && styles.topicTextSelected]}>
                    {item}
                  </Text>
                  {topic === item && <CheckCircleIcon size={20} color={COLORS.brand[500]} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <CheckCircleIcon size={48} color={COLORS.semantic.success} />
            </View>
            <Text style={styles.successTitle}>{t('createRequest.submitSuccess')}</Text>
            <Text style={styles.successMessage}>
              {t('createRequest.submitSuccessMessage')}
            </Text>
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.doneButtonText}>{t('support.contactCall', 'Đồng ý')}</Text>
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
  infoSection: {
    padding: 20,
    backgroundColor: COLORS.brand[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brand[100],
  },
  infoText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.brand[700],
    lineHeight: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.weight.medium,
    color: COLORS.neutral[800],
    marginBottom: 8,
  },
  required: {
    color: COLORS.semantic.error,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    height: 52,
  },
  dropdownText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[900],
  },
  placeholderText: {
    color: COLORS.neutral[400],
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[900],
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  errorText: {
    color: COLORS.semantic.error,
    fontSize: TYPOGRAPHY.sm,
    marginTop: -8,
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[200],
  },
  submitButton: {
    backgroundColor: COLORS.brand[500],
    height: 56,
    borderRadius: RADIUS.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
  },
  sheetTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
  },
  sheetCloseText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.brand[500],
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[50],
  },
  topicItemSelected: {
    backgroundColor: COLORS.brand[50],
  },
  topicText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[800],
  },
  topicTextSelected: {
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.brand[600],
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS['2xl'],
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  successMessage: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  doneButton: {
    backgroundColor: COLORS.brand[500],
    paddingVertical: 14,
    width: '100%',
    borderRadius: RADIUS.xl,
    alignItems: 'center',
  },
  doneButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.weight.bold,
  }
});