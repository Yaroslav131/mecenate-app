import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { colors, fontSize, radius, spacing } from '@/shared/theme';

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onPress: () => void;
  size?: 'sm' | 'md';
}

export function LikeButton({ isLiked, count, onPress, size = 'md' }: LikeButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.35, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const iconSize = size === 'sm' ? 14 : 18;
  const textSize = size === 'sm' ? fontSize.xs : fontSize.sm;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.container, isLiked && styles.containerLiked, animatedStyle]}>
        <Text style={{ fontSize: iconSize }}>{isLiked ? '❤️' : '🤍'}</Text>
        <Text
          style={[
            styles.count,
            { fontSize: textSize },
            isLiked ? styles.countLiked : styles.countDefault,
          ]}
        >
          {count}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  containerLiked: {
    backgroundColor: colors.likeBackground,
  },
  count: {
    fontWeight: '500',
  },
  countDefault: {
    color: colors.text.secondary,
  },
  countLiked: {
    color: colors.like,
  },
});
