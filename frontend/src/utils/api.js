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
