import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IllustrationSticker } from '@/shared/ui/IllustrationSticker';
import { colors, fonts, fontSize, lineHeight, spacing } from '@/shared/theme';

interface EmptyStateProps {
  title?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  onPress?: () => void;
}

export function EmptyState({
  title = 'По вашему запросу ничего не найдено',
  buttonLabel = 'На главную',
  isLoading,
  onPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <IllustrationSticker />
      </View>
      <Text style={styles.title}>{title}</Text>
      {onPress && (
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.5}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={styles.buttonLabel}>{buttonLabel}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  illustration: {
    marginBottom: spacing['3xl'],
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.title,
    lineHeight: lineHeight.lg,
    color: colors.text.primary,
    textAlign: 'center',
    fontVariant: ['lining-nums', 'tabular-nums'],
    marginBottom: spacing.lg,
  },
  button: {
    width: 361,
    height: 42,
    backgroundColor: colors.actionButton,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.inverse,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
});
