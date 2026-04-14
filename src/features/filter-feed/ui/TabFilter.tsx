import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, fonts, fontSize, lineHeight, radius, shadows, spacing } from '@/shared/theme';
import type { PostTier } from '@/shared/types';

type FilterTab = { label: string; value: PostTier | undefined };

const TABS: FilterTab[] = [
  { label: 'Все', value: undefined },
  { label: 'Бесплатные', value: 'free' },
  { label: 'Платные', value: 'paid' },
];
const AnimatedView = Animated.createAnimatedComponent(View);

interface TabFilterProps {
  active: PostTier | undefined;
  onChange: (tier: PostTier | undefined) => void;
}

export function TabFilter({ active, onChange }: TabFilterProps) {
  const [width, setWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isFirstLayout = useRef(true);

  const activeIndex = useMemo(
    () => TABS.findIndex((tab) => tab.value === active),
    [active],
  );

  const tabWidth = width > 0 ? width / TABS.length : 0;

  useEffect(() => {
    if (tabWidth <= 0 || activeIndex < 0) return;
    if (isFirstLayout.current) {
      isFirstLayout.current = false;
      translateX.value = activeIndex * tabWidth;
      return;
    }
    translateX.value = withTiming(activeIndex * tabWidth, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, tabWidth, translateX]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.island} onLayout={handleLayout}>
      {tabWidth > 0 && (
        <AnimatedView
          pointerEvents="none"
          style={[styles.activePill, { width: tabWidth }, animatedPillStyle]}
        />
      )}
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            onPress={() => onChange(tab.value)}
            activeOpacity={0.5}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  island: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'stretch',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    height: 38,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  activePill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.full,
    zIndex: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: fonts.bold,
    color: colors.text.inverse,
  },
});
