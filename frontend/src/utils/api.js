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

export const normalizeUser = (user) => {
  if (!user) return user;

  return {
    ...user,
    username: user.username || user.userName,
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
