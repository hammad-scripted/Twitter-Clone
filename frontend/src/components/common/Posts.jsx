import { useQuery } from '@tanstack/react-query';

import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';
import { apiRequest, normalizePosts } from '../../utils/api';

const Posts = ({ feedType = 'forYou', username, userId }) => {
  const getPostsEndpoint = () => {
    if (feedType === 'following') return '/api/posts/following';
    if (feedType === 'user') return `/api/posts/user/${username}`;
    if (feedType === 'likes') return `/api/posts/liked/${userId}`;
    return '/api/posts/all';
  };

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts', feedType, username, userId],
    queryFn: async () =>
      normalizePosts(
        await apiRequest(getPostsEndpoint(), undefined, { emptyOn404: true }),
      ),
    enabled: feedType !== 'likes' || Boolean(userId),
  });

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && isError && (
        <p className="text-center text-red-500 my-4">{error.message}</p>
      )}
      {!isLoading && !isError && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab.</p>
      )}
      {!isLoading && !isError && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
