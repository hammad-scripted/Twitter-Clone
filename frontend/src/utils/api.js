export const unwrapApiResponse = async (res, { emptyOn404 = false } = {}) => {
  const data = await res.json().catch(() => null);

  if (emptyOn404 && res.status === 404) {
    return [];
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data?.data;
};

export const apiRequest = async (url, options = {}, config) => {
  const res = await fetch(url, { credentials: 'include', ...options });
  return unwrapApiResponse(res, config);
};

export const getAuthUser = async () => {
  const res = await fetch('/api/auth/me', { credentials: 'include' });

  if (res.status === 401) {
    return null;
  }

  return normalizeUser(await unwrapApiResponse(res));
};

export const normalizeUser = (user) => {
  if (!user) return user;

  const nextUsername = user.username || user.userName || '';

  return {
    ...user,
    username: nextUsername,
    userName: nextUsername,
  };
};

export const getImageUrl = (url, version = 0) => {
  if (!url) return '/avatar-placeholder.png';

  if (typeof url === 'string' && url.startsWith('data:image/')) {
    return url;
  }

  if (typeof url === 'string' && url.startsWith('http')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${version}`;
  }

  return url;
};

export const syncUserInCache = (queryClient, updatedUser) => {
  const normalizedUser = normalizeUser(updatedUser);

  if (!normalizedUser) return normalizedUser;

  const userId = normalizedUser._id?.toString();
  const username = normalizedUser.username || normalizedUser.userName;

  queryClient.setQueryData(['authUser'], normalizedUser);
  queryClient.setQueryData(['latestProfile'], normalizedUser);
  queryClient.setQueryData(['profileImageVersion'], Date.now());

  if (username) {
    queryClient.setQueryData(['profile', username], normalizedUser);
  }

  queryClient.setQueriesData({ queryKey: ['profile'] }, (prev) => (prev ? { ...prev, ...normalizedUser } : prev));
  queryClient.setQueriesData({ queryKey: ['posts'] }, (prev) => {
    if (!Array.isArray(prev)) return prev;

    return prev.map((post) => ({
      ...post,
      user: post?.user?._id?.toString() === userId ? { ...post.user, ...normalizedUser } : post.user,
      comments: (post.comments || []).map((comment) =>
        comment?.user?._id?.toString() === userId
          ? { ...comment, user: { ...comment.user, ...normalizedUser } }
          : comment,
      ),
    }));
  });

  queryClient.setQueriesData({ queryKey: ['notifications'] }, (prev) => {
    if (!Array.isArray(prev)) return prev;

    return prev.map((notification) =>
      notification?.from?._id?.toString() === userId
        ? { ...notification, from: { ...notification.from, ...normalizedUser } }
        : notification,
    );
  });

  queryClient.setQueriesData({ queryKey: ['suggestedUsers'] }, (prev) => {
    if (!Array.isArray(prev)) return prev;

    return prev.map((user) => (user?._id?.toString() === userId ? { ...user, ...normalizedUser } : user));
  });

  return normalizedUser;
};

export const normalizePost = (post) => {
  if (!post) return post;

  return {
    ...post,
    img: post.img || post.Img,
    user: normalizeUser(post.user),
    comments:
      post.comments?.map((comment) => ({
        ...comment,
        user: normalizeUser(comment.user),
      })) || [],
  };
};

export const normalizePosts = (posts = []) => posts.map(normalizePost);
