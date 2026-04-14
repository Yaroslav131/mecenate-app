import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchComments } from '@/entities/comment/api';

export const useComments = (postId: string) =>
  useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam as string | undefined),
    getNextPageParam: (last) => last.data.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!postId,
  });
