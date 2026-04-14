import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostCardActions } from '@/entities/post/ui/PostCardActions';
import { PostCardCover } from '@/entities/post/ui/PostCardCover';
import { activeOpacity, colors, fonts, fontSize, lineHeight, radius, shadows, spacing } from '@/shared/theme';
import type { Post } from '@/shared/types';

interface PostCardProps {
  post: Post;
  likesCount?: number;
  isLiked?: boolean;
  commentsCount?: number;
  onLike?: () => void;
  onPress?: () => void;
  onBack?: () => void;
  onCommentsPress?: () => void;
}

export function PostCard({
  post,
  onPress,
  onBack,
  likesCount: likesCountProp,
  isLiked: isLikedProp,
  commentsCount: commentsCountProp,
  onLike,
  onCommentsPress,
}: PostCardProps) {
  const { author, tier, body, title, coverUrl } = post;
  const isLocked = tier === 'paid' && !body;
  const likesCount = likesCountProp ?? post.likesCount;
  const isLiked = isLikedProp ?? post.isLiked;
  const commentsCount = commentsCountProp ?? post.commentsCount;
  const isDetailView = !!onBack;

  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const handleShowMore = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setExpanded(true);
  };

  const handleTextLayout = (e: { nativeEvent: { lines: unknown[] } }) => {
    if (!expanded) setIsTruncated(e.nativeEvent.lines.length >= 2);
  };

  const inner = (
    <>
      <View style={styles.authorRow}>
        {onBack && (
          <TouchableOpacity onPress={onBack} activeOpacity={activeOpacity} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}
        <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
        <Text style={styles.authorName}>{author.displayName}</Text>
      </View>

      <PostCardCover coverUrl={coverUrl} isLocked={isLocked} />

      <View style={styles.content}>
        {isLocked ? (
          <View style={styles.lockedContent}>
            <View style={[styles.skeletonLine, styles.skeletonTitle]} />
            <View style={[styles.skeletonLine, styles.skeletonDescription]} />
          </View>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={isDetailView ? undefined : 2}>
              {title}
            </Text>
            <View>
              <Text
                style={styles.body}
                numberOfLines={isDetailView || expanded ? undefined : 2}
                onTextLayout={isDetailView ? undefined : handleTextLayout}
              >
                {body}
              </Text>
              {!isDetailView && !expanded && isTruncated && (
                <TouchableOpacity
                  style={styles.showMoreBtn}
                  onPress={handleShowMore}
                  activeOpacity={activeOpacity}
                >
                  <LinearGradient
                    colors={[colors.surfaceTransparent, colors.surface]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fadeGradient}
                    pointerEvents="none"
                  />
                  <Text style={styles.showMoreText}>Показать ещё</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        {!isLocked && (
          <PostCardActions
            likesCount={likesCount}
            isLiked={isLiked}
            commentsCount={commentsCount}
            onLike={onLike}
            onCommentsPress={onCommentsPress}
          />
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.cardFeed]}
        onPress={isLocked ? undefined : onPress}
        disabled={isLocked}
        activeOpacity={isLocked ? 1 : 0.5}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, styles.cardDetail]}>{inner}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardFeed: {
    marginBottom: spacing.lg,
  },
  cardDetail: {
    marginTop: spacing.md,
    marginBottom: 0,
    boxShadow: 'none',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  backButton: {
    marginRight: spacing.xs,
  },
  backIcon: {
    fontSize: fontSize['3xl'],
    color: colors.text.primary,
    lineHeight: lineHeight['3xl'],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  authorName: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.primary,
  },
  content: {
    paddingTop: spacing.sm,
    paddingBottom: 0,
    paddingHorizontal: spacing.lg,
  },
  lockedContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  skeletonLine: {
    backgroundColor: colors.skeleton,
    borderRadius: 22,
    height: 12,
  },
  skeletonTitle: {
    width: 164,
    height: 26,
    marginBottom: spacing.sm,
  },
  skeletonDescription: {
    width: 361,
    height: 40,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.title,
    lineHeight: lineHeight.lg,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.primary,
  },
  showMoreBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  fadeGradient: {
    position: 'absolute',
    right: '100%',
    top: 0,
    bottom: 0,
    width: 48,
  },
  showMoreText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.primary,
  },
});
