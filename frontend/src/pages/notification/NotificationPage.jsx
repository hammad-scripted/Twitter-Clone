import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiRequest, getImageUrl, normalizeUser } from '../../utils/api';
import { useImageVersion } from '../../hooks/useImageVersion';

import { IoSettingsOutline } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { FaHeart, FaRegComment } from 'react-icons/fa6';

const notificationText = {
  follow: 'followed you',
  like: 'liked your post',
  comment: 'commented on your post',
};

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const imageVersion = useImageVersion();

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => apiRequest('/api/notifications', undefined, { emptyOn404: true }),
  });

  const { mutate: deleteNotifications, isPending } = useMutation({
    mutationFn: async () => apiRequest('/api/notifications', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.setQueryData(['notifications'], []);
      toast.success('Notifications deleted');
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
      <div className="min-w-0 flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="glass-header flex justify-between items-center p-4">
          <p className="font-bold text-lg">Notifications</p>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => deleteNotifications()} disabled={isPending}>
                  Delete all notifications
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {isError && <p className="text-center text-red-500 p-4">{error.message}</p>}
        {!isLoading && !isError && notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => {
          const senderUser = normalizeUser(notification.from);
          const senderUsername = senderUser?.username;
          return (
            <div className="border-b border-gray-700 hover:bg-white/[0.03] transition-colors" key={notification._id}>
              <div className="flex min-w-0 gap-2 p-4 items-center">
                {notification.type === 'follow' && <FaUser className="w-7 h-7 text-primary" />}
                {notification.type === 'like' && <FaHeart className="w-7 h-7 text-red-500" />}
                {notification.type === 'comment' && <FaRegComment className="w-7 h-7 text-sky-400" />}
                <Link to={`/profile/${senderUsername}`} className="flex min-w-0 gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={getImageUrl(senderUser?.profileImg, imageVersion)}
                        className="w-full h-full object-cover"
                        alt={senderUsername}
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 gap-1">
                    <span className="truncate font-bold">@{senderUsername}</span>{' '}
                    {notificationText[notification.type] || 'interacted with you'}
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NotificationPage;
