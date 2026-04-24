import { router, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePost } from '@/entities/post/model/usePost';
import { usePostRealtime } from '@/entities/post/model/usePostRealtime';
import { postStore } from '@/entities/post/model/store';
import { PostCard } from '@/entities/post/ui/PostCard';
import { useComments } from '@/entities/comment/model/useComments';
import { CommentItem } from '@/entities/comment/ui/CommentItem';
import { useToggleLike } from '@/features/like-post/model/useToggleLike';
import { CommentInput } from '@/features/send-comment/ui/CommentInput';
import { useSendComment } from '@/features/send-comment/model/useSendComment';
import { ErrorState } from '@/shared/ui/ErrorState';
import { colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';
import type { Comment, Post } from '@/shared/types';

interface PostDetailHeaderProps {
  post: Post;
  likesCount: number;
  isLiked: boolean;
  commentsTotal: number;
  onLike: () => void;
  onBack: () => void;
}

function PostDetailHeader({ post, likesCount, isLiked, commentsTotal, onLike, onBack }: PostDetailHeaderProps) {
  return (
    <>
      <PostCard
        post={post}
        likesCount={likesCount}
        isLiked={isLiked}
        onLike={onLike}
        commentsCount={commentsTotal}
        onBack={onBack}
      />
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsCountLabel}>
          {commentsTotal} комментари{commentsTotal === 1 ? 'й' : 'я'}
        </Text>
        <Text style={styles.sortLabel}>Сначала новые</Text>
      </View>
    </>
  );
}

interface CommentsFooterProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

function CommentsFooter({ isLoading, isFetchingNextPage }: CommentsFooterProps) {
  return (
    <>
      {(isLoading || isFetchingNextPage) && (
        <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
      )}
      <View style={styles.listFooterSpacer} />
    </>
  );
}

const PostDetailScreen = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const post = postData?.data.post;
  const { isLiked, likesCount, handleLike } = useToggleLike(
    id,
    post?.isLiked ?? false,
    post?.likesCount ?? 0,
  );

  usePostRealtime(id);

  const { isSending, send } = useSendComment(id);

  const allFetchedComments = commentsData?.pages.flatMap((p) => p.data.comments) ?? [];
  const realtimeComments = postStore.getRealtimeComments(id);

  const fetchedIds = useMemo(
    () => new Set(allFetchedComments.map((c) => c.id)),
    [allFetchedComments],
  );
  const newRealtimeComments = realtimeComments.filter((c) => !fetchedIds.has(c.id));
  const allComments: Comment[] = [...newRealtimeComments, ...allFetchedComments];

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
            <PostDetailHeader
              post={post}
              likesCount={likesCount}
              isLiked={isLiked}
              commentsTotal={commentsTotal}
              onLike={handleLike}
              onBack={() => router.back()}
            />
          }
          ListFooterComponent={
            <CommentsFooter
              isLoading={commentsLoading}
              isFetchingNextPage={isFetchingNextPage}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.4}
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
  footerLoader: {
    marginVertical: spacing.lg,
  },
  listFooterSpacer: {
    height: spacing.lg,
  },
});
