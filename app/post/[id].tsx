import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { toggleLike } from '@/entities/post/api';
import { usePost } from '@/entities/post/model/usePost';
import { postStore } from '@/entities/post/model/store';
import { PostCard } from '@/entities/post/ui/PostCard';
import { useComments } from '@/entities/comment/model/useComments';
import { CommentItem } from '@/entities/comment/ui/CommentItem';
import { CommentInput } from '@/features/send-comment/ui/CommentInput';
import { useSendComment } from '@/features/send-comment/model/useSendComment';
import { ErrorState } from '@/shared/ui/ErrorState';
import { wsService } from '@/shared/lib/websocket';
import { colors, fonts, fontSize, fontWeight, lineHeight, radius, spacing } from '@/shared/theme';
import type { Comment, WsEvent } from '@/shared/types';

const PostDetailScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');

  const { data: postData, isLoading: postLoading, isError: postError } = usePost(id);
  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(id);

  const { isSending, send } = useSendComment(id);

  const post = postData?.data.post;
  const allFetchedComments = commentsData?.pages.flatMap((p) => p.data.comments) ?? [];
  const realtimeComments = postStore.getRealtimeComments(id);

  const fetchedIds = useMemo(
    () => new Set(allFetchedComments.map((c) => c.id)),
    [allFetchedComments],
  );
  const newRealtimeComments = realtimeComments.filter((c) => !fetchedIds.has(c.id));
  const allComments: Comment[] = [...newRealtimeComments, ...allFetchedComments];

  const liveState = postStore.getLiveState(id);
  const likesCount = liveState?.likesCount ?? post?.likesCount ?? 0;
  const isLiked = liveState?.isLiked ?? post?.isLiked ?? false;

  useEffect(() => {
    wsService.connect();
    const unsub = wsService.subscribe((event: WsEvent) => {
      if (event.type === 'like_updated' && event.postId === id) {
        postStore.updateLikesCount(id, event.likesCount);
      }
      if (event.type === 'comment_added' && event.postId === id) {
        postStore.prependComment(id, event.comment);
      }
    });
    return () => {
      unsub();
      wsService.disconnect();
      postStore.clearRealtimeComments(id);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    };
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    postStore.setLiked(id, !isLiked, isLiked ? likesCount - 1 : likesCount + 1);
    try {
      const res = await toggleLike(id);
      postStore.setLiked(id, res.data.isLiked, res.data.likesCount);
    } catch {
      postStore.setLiked(id, isLiked, likesCount);
    }
  };

  const handleSendComment = async () => {
    const success = await send(commentText);
    if (success) setCommentText('');
  };

  if (postLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} activeOpacity={0.5}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  if (postError || !post) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <ErrorState onPress={() => router.back()} buttonLabel="На главную" />
      </View>
    );
  }

  const commentsTotal = post.commentsCount + newRealtimeComments.length;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.commentsCard}>
        <FlatList<Comment>
          data={allComments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CommentItem comment={item} />}
          ListHeaderComponent={
            <>
              <PostCard
                post={post}
                likesCount={likesCount}
                isLiked={isLiked}
                onLike={handleLike}
                commentsCount={commentsTotal}
                onBack={() => router.back()}
              />
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsCountLabel}>
                  {commentsTotal} комментари{commentsTotal === 1 ? 'й' : 'я'}
                </Text>
                <Text style={styles.sortLabel}>Сначала новые</Text>
              </View>
            </>
          }
          ListFooterComponent={
            <>
              {commentsLoading && (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
              )}
              {hasNextPage && !commentsLoading && (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  <Text style={styles.loadMoreText}>
                    {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ height: spacing.lg }} />
            </>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <CommentInput
        value={commentText}
        onChange={setCommentText}
        onSend={handleSendComment}
        isSending={isSending}
        paddingBottom={insets.bottom + spacing.sm}
      />
    </KeyboardAvoidingView>
  );
});

export default PostDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  commentsCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backIcon: {
    fontSize: fontSize['3xl'],
    color: colors.text.primary,
    lineHeight: lineHeight['3xl'],
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  commentsCountLabel: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.commentsCount,
    textAlign: 'center',
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  sortLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.actionButton,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  loadMoreText: {
    fontFamily: fonts.medium,
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
});
