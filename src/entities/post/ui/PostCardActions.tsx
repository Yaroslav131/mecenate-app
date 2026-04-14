import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LikePill } from '@/entities/post/ui/LikePill';
import { CommentIcon } from '@/shared/ui/icons/PostActionIcons';
import { activeOpacity, colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';

interface PostCardActionsProps {
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  onLike?: () => void;
  onCommentsPress?: () => void;
}

export function PostCardActions({
  likesCount,
  isLiked,
  commentsCount,
  onLike,
  onCommentsPress,
}: PostCardActionsProps) {
  const handleLike = onLike ?? (() => {});

  const handleCommentsPress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onCommentsPress?.();
  };

  return (
    <View style={styles.actionsRow}>
      <LikePill isLiked={isLiked} likesCount={likesCount} onPress={handleLike} />

      <TouchableOpacity
        style={styles.actionPill}
        onPress={handleCommentsPress}
        activeOpacity={activeOpacity}
      >
        <View style={styles.iconWrap}>
          <CommentIcon />
        </View>
        <Text style={styles.actionCount}>{commentsCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    height: 36,
    paddingLeft: 6,
    paddingRight: spacing.md,
    paddingVertical: 9,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCount: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.text.secondary,
    fontVariant: ['lining-nums', 'tabular-nums'],
    textAlign: 'center',
  },
});
