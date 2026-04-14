import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DonateIcon } from '@/shared/ui/icons/PostActionIcons';
import { colors, fonts, fontSize, lineHeight, spacing } from '@/shared/theme';

interface PostCardCoverProps {
  coverUrl: string;
  isLocked: boolean;
}

export function PostCardCover({ coverUrl, isLocked }: PostCardCoverProps) {
  return (
    <View>
      <Image
        source={{ uri: coverUrl }}
        style={styles.cover}
        resizeMode="cover"
        blurRadius={isLocked ? 18 : 0}
      />
      {isLocked && (
        <View style={styles.paidOverlay}>
          <View style={styles.paidBadge}>
            <DonateIcon size={30} />
          </View>
          <Text style={styles.paidText}>
            Контент скрыт пользователем.{'\n'}Доступ откроется после доната
          </Text>
          <TouchableOpacity style={styles.paidDonateBtn} activeOpacity={0.5}>
            <Text style={styles.paidDonateBtnText}>Отправить донат</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  paidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  paidBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.inverse,
    textAlign: 'center',
  },
  paidDonateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    width: 239,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  paidDonateBtnText: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    color: colors.text.inverse,
    textAlign: 'center',
  },
});
