import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import Posts from '../../components/common/Posts';
import ProfileHeaderSkeleton from '../../components/skeletons/ProfileHeaderSkeleton';
import EditProfileModal from './EditProfileModal';

import { FaArrowLeft } from 'react-icons/fa6';
import { IoCalendarOutline } from 'react-icons/io5';
import { FaLink } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

import { apiRequest, getAuthUser, normalizeUser } from '../../utils/api';

const ProfilePage = () => {
  const { username } = useParams();
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImgFile, setCoverImgFile] = useState(null);
  const [profileImgFile, setProfileImgFile] = useState(null);
  const [feedType, setFeedType] = useState('posts');
  const [imageVersion, setImageVersion] = useState(0);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'], queryFn: getAuthUser });

  const getDisplayImageUrl = (url) => {
    if (!url) return '/avatar-placeholder.png';

    if (typeof url === 'string' && url.startsWith('data:image/')) {
      return url;
    }

    if (typeof url === 'string' && url.startsWith('http')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${imageVersion}`;
    }

    return url;
  };

  const handleProfileUpdated = async (updatedUser) => {
    const normalizedUser = normalizeUser(updatedUser);

    setCoverImg(normalizedUser?.coverImg || null);
    setProfileImg(normalizedUser?.profileImg || null);
    setCoverImgFile(null);
    setProfileImgFile(null);
    setImageVersion(Date.now());

    queryClient.setQueryData(['authUser'], normalizedUser);
    queryClient.setQueryData(['profile', username], normalizedUser);
    queryClient.setQueryData(['profileImageVersion'], Date.now());
    await queryClient.invalidateQueries({ queryKey: ['profile', username] });
    await queryClient.refetchQueries({ queryKey: ['profile', username], exact: true });
  };
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => normalizeUser(await apiRequest(`/api/user/profile/${username}`)),
    enabled: Boolean(username),
  });

  const isMyProfile = authUser?.username === user?.username || authUser?._id === user?._id;
  const isFollowing = authUser?.following?.some((id) => id?.toString() === user?._id?.toString());

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (!file) return;

    if (state === 'coverImg') {
      setCoverImgFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverImg(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    setProfileImgFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  };

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    mutationFn: async () => apiRequest(`/api/user/follow/${user._id}`, { method: 'POST' }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['authUser'], (prev) =>
        prev ? { ...prev, following: updatedUser.following || prev.following } : prev,
      );
      queryClient.setQueryData(['profile', username], (prev) => {
        if (!prev) return prev;

        const nextFollowers = isFollowing
          ? (prev.followers || []).filter((id) => id?.toString() !== authUser?._id?.toString())
          : [...(prev.followers || []), authUser?._id];

        return { ...prev, followers: nextFollowers };
      });
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
      toast.success(isFollowing ? 'User unfollowed successfully' : 'User followed successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
      <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && !isError && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        {isError && <p className="text-center text-red-500 mt-4">{error.message}</p>}
        <div className="flex flex-col">
          {!isLoading && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">0 posts</span>
                </div>
              </div>
              <div className="relative group/cover">
                <img
                  src={getDisplayImageUrl(coverImg || user?.coverImg || '/cover.png')}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input type="file" hidden ref={coverImgRef} onChange={(e) => handleImgChange(e, 'coverImg')} />
                <input type="file" hidden ref={profileImgRef} onChange={(e) => handleImgChange(e, 'profileImg')} />
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img src={getDisplayImageUrl(profileImg || user?.profileImg || '/avatar-placeholder.png')} />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit className="w-4 h-4 text-white" onClick={() => profileImgRef.current.click()} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && (
                  <EditProfileModal
                    user={user}
                    coverImgFile={coverImgFile}
                    profileImgFile={profileImgFile}
                    onProfileUpdated={handleProfileUpdated}
                  />
                )}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => followUser()}
                    disabled={isFollowPending}
                  >
                    {isFollowPending ? 'Please wait...' : isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">@{user?.username}</span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href={user.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {user.link}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">{user?.following?.length || 0}</span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">{user?.followers?.length || 0}</span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType('posts')}
                >
                  Posts
                  {feedType === 'posts' && <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType('likes')}
                >
                  Likes
                  {feedType === 'likes' && <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType === 'likes' ? 'likes' : 'user'} username={user?.username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
