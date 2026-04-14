import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { postStore } from '@/entities/post/model/store';
import { wsService } from '@/shared/lib/websocket';
import type { WsEvent } from '@/shared/types';

export function usePostRealtime(postId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    wsService.connect();
    const unsub = wsService.subscribe((event: WsEvent) => {
      if (event.type === 'like_updated' && event.postId === postId) {
        postStore.updateLikesCount(postId, event.likesCount);
      }
      if (event.type === 'comment_added' && event.postId === postId) {
        postStore.prependComment(postId, event.comment);
      }
    });
    return () => {
      unsub();
      wsService.disconnect();
      postStore.clearRealtimeComments(postId);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    };
  }, [postId, queryClient]);
}
