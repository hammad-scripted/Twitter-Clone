import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import { apiRequest, getImageUrl, normalizeUser } from '../../utils/api';

const RightPanel = ({ isLoading = false }) => {
  const queryClient = useQueryClient();
  const { data: imageVersion = 0 } = useQuery({
    queryKey: ['profileImageVersion'],
    queryFn: () => queryClient.getQueryData(['profileImageVersion']) || 0,
    staleTime: Infinity,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => (await apiRequest('/api/user/suggested')).map(normalizeUser),
  });

  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    mutationFn: async (userId) => apiRequest(`/api/user/follow/${userId}`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Followed successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {(isLoading || isUsersLoading) && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading && !isUsersLoading &&
            users?.map((user) => (
              <div className="flex items-center justify-between gap-4" key={user._id}>
                <Link to={`/profile/${user.username}`} className="flex gap-2 items-center flex-1">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={getImageUrl(user?.profileImg, imageVersion)} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">{user.fullName}</span>
                    <span className="text-sm text-slate-500">@{user.username}</span>
                  </div>
                </Link>
                <button
                  className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    followUser(user._id);
                  }}
                  disabled={isFollowPending}
                >
                  Follow
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
