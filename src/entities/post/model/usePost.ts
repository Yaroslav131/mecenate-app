import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/entities/post/api';

export const usePost = (id: string) =>
  useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
