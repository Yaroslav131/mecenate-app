import { observer } from 'mobx-react-lite';
import { PostCard } from '@/entities/post/ui/PostCard';
import { useToggleLike } from '@/features/like-post/model/useToggleLike';
import type { Post } from '@/shared/types';

interface PostCardItemProps {
  post: Post;
  onPress: () => void;
  onCommentsPress: () => void;
}

function PostCardItemComponent({ post, onPress, onCommentsPress }: PostCardItemProps) {
  const { id, isLiked: initialIsLiked, likesCount: initialLikesCount } = post;
  const { isLiked, likesCount, handleLike } = useToggleLike(id, initialIsLiked, initialLikesCount);

  return (
    <PostCard
      post={post}
      likesCount={likesCount}
      isLiked={isLiked}
      onLike={handleLike}
      onPress={onPress}
      onCommentsPress={onCommentsPress}
    />
  );
}

export const PostCardItem = observer(PostCardItemComponent);
