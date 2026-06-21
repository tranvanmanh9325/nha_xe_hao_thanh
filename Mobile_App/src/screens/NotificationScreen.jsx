import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY } from '../theme';

export default function NotificationScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.neutral[50] }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: TYPOGRAPHY.xl, fontWeight: TYPOGRAPHY.weight.bold, color: COLORS.neutral[800] }}>
          Thông báo
        </Text>
        <Text style={{ fontSize: TYPOGRAPHY.sm, color: COLORS.neutral[500], marginTop: 8 }}>
          Bạn chưa có thông báo nào
        </Text>
      </View>
    </SafeAreaView>
  );
}
