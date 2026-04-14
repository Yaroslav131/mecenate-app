import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/shared/theme';

function SkeletonBox({ width, height, style }: { width?: number | string; height: number; style?: object }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width ?? '100%', height, borderRadius: radius.md, backgroundColor: colors.skeleton },
        { opacity },
        style,
      ]}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <SkeletonBox width={36} height={36} style={styles.avatarSkeleton} />
        <SkeletonBox width={120} height={14} />
      </View>
      <SkeletonBox width="100%" height={200} style={styles.image} />
      <View style={styles.content}>
        <SkeletonBox width="60%" height={16} />
        <SkeletonBox width="100%" height={12} style={{ marginTop: spacing.xs }} />
        <View style={styles.actionsRow}>
          <SkeletonBox width={60} height={28} style={styles.pill} />
          <SkeletonBox width={60} height={28} style={styles.pill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  avatarSkeleton: {
    borderRadius: radius.full,
  },
  image: {
    borderRadius: 0,
  },
  content: {
    padding: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  pill: {
    borderRadius: radius.full,
  },
});
