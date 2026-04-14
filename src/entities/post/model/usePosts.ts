import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/entities/post/api';
import type { PostTier } from '@/shared/types';

export const usePosts = (tier?: PostTier) =>
  useInfiniteQuery({
    queryKey: ['posts', tier ?? 'all'],
    queryFn: ({ pageParam }) => fetchPosts(tier, pageParam as string | undefined),
    getNextPageParam: (last) => last.data.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
