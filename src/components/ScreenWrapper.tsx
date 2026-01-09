import React from 'react';
import { SafeAreaView, View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '@/theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withPadding?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  withPadding = true,
}) => {
  return (
    <SafeAreaView style={[styles.safe, style]}>
      <View style={withPadding ? styles.container : styles.containerNoPadding}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  containerNoPadding: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
