import { apiClient } from '@/shared/api/client';
import type {
  LikeApiResponse,
  PostDetailApiResponse,
  PostsApiResponse,
  PostTier,
} from '@/shared/types';

export const fetchPosts = (
  tier: PostTier | undefined,
  cursor: string | undefined,
  limit = 10,
): Promise<PostsApiResponse> => {
  const params: Record<string, string | number> = { limit };
  if (tier) params.tier = tier;
  if (cursor) params.cursor = cursor;
  return apiClient.get<PostsApiResponse>('/posts', { params }).then((r) => r.data);
};

export const fetchPost = (id: string): Promise<PostDetailApiResponse> =>
  apiClient.get<PostDetailApiResponse>(`/posts/${id}`).then((r) => r.data);

export const toggleLike = (id: string): Promise<LikeApiResponse> =>
  apiClient.post<LikeApiResponse>(`/posts/${id}/like`).then((r) => r.data);
