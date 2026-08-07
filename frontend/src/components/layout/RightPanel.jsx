import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import { apiRequest, getImageUrl, normalizeUser } from '../../utils/api';
import { useImageVersion } from '../../hooks/useImageVersion';

const RightPanel = ({ isLoading = false }) => {
  const queryClient = useQueryClient();
  const imageVersion = useImageVersion();

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
    <aside className="hidden lg:block my-4 mx-4 w-80 shrink-0">
      <div className="bg-white/[0.045] border border-white/10 p-5 rounded-2xl sticky top-4 shadow-xl shadow-black/10">
        <p className="font-extrabold text-xl tracking-tight">Who to follow</p>
        <p className="mb-5 mt-1 text-sm text-slate-500">People you might enjoy</p>
        <div className="flex flex-col gap-5">
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
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={getImageUrl(user?.profileImg, imageVersion)}
                        className="w-full h-full object-cover"
                        alt={user?.fullName}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
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
    </aside>
  );
};

export default RightPanel;
