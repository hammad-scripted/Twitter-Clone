import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import Post from './Post';
import PostSkeleton from '../../../components/skeletons/PostSkeleton';
import { apiRequest, normalizePosts } from '../../../utils/api';

const Posts = ({ feedType = 'forYou', username, userId, onCountChange }) => {
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
    enabled: (feedType === 'user' ? Boolean(username) : true) && (feedType !== 'likes' || Boolean(userId)),
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      onCountChange?.(posts.length);
    }
  }, [posts.length, isLoading, isError, onCountChange]);

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
        <div className="mx-auto max-w-sm px-6 py-16 text-center"><p className="text-xl font-bold">Nothing here yet</p><p className="mt-2 text-sm text-slate-500">When posts show up in this feed, you’ll see them here.</p></div>
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
