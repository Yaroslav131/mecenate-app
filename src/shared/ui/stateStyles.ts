import { StyleSheet } from 'react-native';
import { colors, fonts, fontSize, lineHeight, spacing } from '@/shared/theme';

export const stateStyles = StyleSheet.create({
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
