import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

export default function TicketScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.neutral[50] }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: TYPOGRAPHY.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.neutral[800] }}>
          Vé của tôi
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.sm, color: COLORS.neutral[500], marginTop: 8 }}>
          Tính năng đang được phát triển
        </Text>
      </View>
    </SafeAreaView>
  );
}
