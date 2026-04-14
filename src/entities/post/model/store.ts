import { makeAutoObservable } from 'mobx';
import type { Comment } from '@/shared/types';

interface LivePostState {
  likesCount: number;
  isLiked: boolean;
}

export class PostStore {
  liveState = new Map<string, LivePostState>();
  realtimeComments = new Map<string, Comment[]>();

  constructor() {
    makeAutoObservable(this);
  }

  setLiked(postId: string, isLiked: boolean, likesCount: number) {
    this.liveState.set(postId, { isLiked, likesCount });
  }

  updateLikesCount(postId: string, likesCount: number) {
    const cur = this.liveState.get(postId);
    if (cur) {
      this.liveState.set(postId, { ...cur, likesCount });
    } else {
      this.liveState.set(postId, { likesCount, isLiked: false });
    }
  }

  prependComment(postId: string, comment: Comment) {
    const existing = this.realtimeComments.get(postId) ?? [];
    if (existing.some((c) => c.id === comment.id)) return;
    this.realtimeComments.set(postId, [comment, ...existing]);
  }

  getLiveState(postId: string): LivePostState | undefined {
    return this.liveState.get(postId);
  }

  getRealtimeComments(postId: string): Comment[] {
    return this.realtimeComments.get(postId) ?? [];
  }

  clearRealtimeComments(postId: string) {
    this.realtimeComments.delete(postId);
  }

  clear() {
    this.liveState.clear();
    this.realtimeComments.clear();
  }
}

export const postStore = new PostStore();
