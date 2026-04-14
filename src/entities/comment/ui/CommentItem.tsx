import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCountAnimation } from '@/shared/lib/useCountAnimation';
import { LikeActiveIcon, LikeInactiveIcon } from '@/shared/ui/icons/PostActionIcons';
import { colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';
import type { Comment } from '@/shared/types';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { author, text, likesCount: initialLikesCount = 0, isLiked: initialIsLiked = false } = comment;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialLikesCount);
  const { shownCount, nextCount, outStyle, inStyle } = useCountAnimation(count);

  const iconScale = useSharedValue(1);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    cancelAnimation(iconScale);
    iconScale.value = withSequence(
      withTiming(1.4, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 220 }),
    );

    Haptics.impactAsync(
      isLiked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.name}>{author.displayName}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Pressable style={styles.likeBtn} onPress={handleLike}>
        <Animated.View style={iconAnimStyle}>
          {isLiked ? (
            <LikeActiveIcon color={colors.like} />
          ) : (
            <LikeInactiveIcon />
          )}
        </Animated.View>
        <View style={styles.countWrap}>
          <Animated.Text style={[styles.count, outStyle]}>{shownCount}</Animated.Text>
          <Animated.Text style={[styles.count, styles.countIncoming, inStyle]}>{nextCount}</Animated.Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 58,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.primary,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: lineHeight.md,
    color: colors.text.comment,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  countWrap: {
    minWidth: 16,
    height: lineHeight.sm,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  count: {
    fontFamily: fonts.bold,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.text.secondary,
    fontVariant: ['lining-nums', 'tabular-nums'],
    textAlign: 'center',
  },
  countIncoming: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
