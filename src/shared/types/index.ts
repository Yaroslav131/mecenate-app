export type PostTier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface LiveLikeState {
  likesCount: number;
  isLiked: boolean;
}

export interface PostsApiResponse {
  ok: boolean;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface PostDetailApiResponse {
  ok: boolean;
  data: {
    post: Post;
  };
}

export interface LikeApiResponse {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

export interface CommentsApiResponse {
  ok: boolean;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface AddCommentApiResponse {
  ok: boolean;
  data: {
    comment: Comment;
  };
}

export interface WsPingEvent {
  type: 'ping';
}

export interface WsLikeUpdatedEvent {
  type: 'like_updated';
  postId: string;
  likesCount: number;
}

export interface WsCommentAddedEvent {
  type: 'comment_added';
  postId: string;
  comment: Comment;
}

export type WsEvent = WsPingEvent | WsLikeUpdatedEvent | WsCommentAddedEvent;
