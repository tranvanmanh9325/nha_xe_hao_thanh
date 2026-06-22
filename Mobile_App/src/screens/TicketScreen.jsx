import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPOGRAPHY } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function TicketScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: TYPOGRAPHY.xl, fontWeight: TYPOGRAPHY.weight.bold, color: colors.neutral[800] }}>
          {t('ticket.title')}
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.sm, color: colors.neutral[500], marginTop: 8 }}>
          {t('common.inDevelopment')}
        </Text>
      </View>
    </SafeAreaView>
  );
}