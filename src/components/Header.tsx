import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS } from '@/theme/colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: SPACING.lg,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
});
