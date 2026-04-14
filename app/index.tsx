import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCardItem } from '@/features/like-post/ui/PostCardItem';
import { TabFilter } from '@/features/filter-feed/ui/TabFilter';
import { PostCardSkeleton } from '@/entities/post/ui/PostCardSkeleton';
import { usePosts } from '@/entities/post/model/usePosts';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { colors, spacing } from '@/shared/theme';
import type { Post, PostTier } from '@/shared/types';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [tier, setTier] = useState<PostTier | undefined>(undefined);
  const { data, isLoading, isError, isRefetching, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(tier);

  const posts = data?.pages.flatMap((p) => p.data.posts) ?? [];

  const handlePostPress = (id: string) => router.push(`/post/${id}`);
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TabFilter active={tier} onChange={setTier} />
      {isLoading ? (
        <>
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </>
      ) : isError ? (
        <ErrorState onPress={refetch} isLoading={isRefetching} buttonLabel="Повторить" />
      ) : (
        <FlatList<Post>
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCardItem
              post={item}
              onPress={() => handlePostPress(item.id)}
              onCommentsPress={() => handlePostPress(item.id)}
            />
          )}
          ListEmptyComponent={<EmptyState title="По вашему запросу ничего не найдено" />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
    flexGrow: 1,
  },
  footerLoader: {
    marginVertical: spacing.lg,
  },
});
