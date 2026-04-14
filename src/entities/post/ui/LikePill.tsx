import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useCountAnimation } from '@/shared/lib/useCountAnimation';
import { useIconLikeAnimation } from '@/shared/lib/useIconLikeAnimation';
import { LikeActiveIcon, LikeInactiveIcon } from '@/shared/ui/icons/PostActionIcons';
import { colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';

interface LikePillProps {
  isLiked: boolean;
  likesCount: number;
  onPress: () => void;
}

export function LikePill({ isLiked, likesCount, onPress }: LikePillProps) {
  const pillScale = useSharedValue(1);
  const { iconAnimStyle, triggerAnimation } = useIconLikeAnimation(isLiked);
  const { shownCount, nextCount, outStyle, inStyle } = useCountAnimation(likesCount);

  const pillAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pillScale.value }],
  }));

  const handlePress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();

    cancelAnimation(pillScale);
    pillScale.value = withSequence(
      withTiming(1.12, { duration: 60 }),
      withSpring(1, { damping: 12, stiffness: 220 }),
    );

    triggerAnimation();
    onPress();
  };

  const countStyle = [styles.count, isLiked && styles.countLiked];

  return (
    <Animated.View style={[styles.pill, isLiked && styles.pillLiked, pillAnimStyle]}>
      <Pressable style={styles.pressable} onPress={handlePress}>
        <Animated.View style={[styles.iconWrap, iconAnimStyle]}>
          {isLiked ? <LikeActiveIcon /> : <LikeInactiveIcon />}
        </Animated.View>

        <View style={styles.countWrap}>
          <Animated.Text style={[...countStyle, outStyle]}>{shownCount}</Animated.Text>
          <Animated.Text style={[...countStyle, styles.countIncoming, inStyle]}>
            {nextCount}
          </Animated.Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    height: 36,
    overflow: 'hidden',
  },
  pillLiked: {
    backgroundColor: colors.like,
  },
  pressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  countWrap: {
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
  countLiked: {
    color: colors.text.inverse,
  },
});
