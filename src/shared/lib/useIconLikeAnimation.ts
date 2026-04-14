import * as Haptics from 'expo-haptics';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useIconLikeAnimation(isLiked: boolean) {
  const iconScale = useSharedValue(1);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const triggerAnimation = () => {
    cancelAnimation(iconScale);
    iconScale.value = withSequence(
      withTiming(1.4, { duration: 80 }),
      withSpring(1, { damping: 12, stiffness: 220 }),
    );
    Haptics.impactAsync(
      isLiked ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium,
    );
  };

  return { iconAnimStyle, triggerAnimation };
}
