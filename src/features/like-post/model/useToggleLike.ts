import { useRef } from 'react';
import { toggleLike } from '@/entities/post/api';
import { postStore } from '@/entities/post/model/store';

export function useToggleLike(postId: string, initialIsLiked: boolean, initialLikesCount: number) {
  const liveState = postStore.getLiveState(postId);
  const isLiked = liveState?.isLiked ?? initialIsLiked;
  const likesCount = liveState?.likesCount ?? initialLikesCount;
  const isPending = useRef(false);

  const handleLike = async () => {
    if (isPending.current) return;
    isPending.current = true;
    const nextIsLiked = !isLiked;
    const nextCount = isLiked ? likesCount - 1 : likesCount + 1;
    postStore.setLiked(postId, nextIsLiked, nextCount);
    try {
      const res = await toggleLike(postId);
      postStore.setLiked(postId, res.data.isLiked, res.data.likesCount);
    } catch {
      postStore.setLiked(postId, isLiked, likesCount);
    } finally {
      isPending.current = false;
    }
  };

  return { isLiked, likesCount, handleLike };
}
