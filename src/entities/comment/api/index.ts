import { apiClient } from '@/shared/api/client';
import type { AddCommentApiResponse, CommentsApiResponse } from '@/shared/types';

export const fetchComments = (
  postId: string,
  cursor: string | undefined,
  limit = 20,
): Promise<CommentsApiResponse> => {
  const params: Record<string, string | number> = { limit };
  if (cursor) params.cursor = cursor;
  return apiClient
    .get<CommentsApiResponse>(`/posts/${postId}/comments`, { params })
    .then((r) => r.data);
};

export const addComment = (postId: string, text: string): Promise<AddCommentApiResponse> =>
  apiClient
    .post<AddCommentApiResponse>(`/posts/${postId}/comments`, { text })
    .then((r) => r.data);
