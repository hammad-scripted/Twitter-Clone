import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import { apiRequest } from '../../utils/api';

import { IoSettingsOutline } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';

const NotificationPage = () => {
  const queryClient = useQueryClient();

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
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
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
          const senderUsername = notification.from?.username || notification.from?.userName;
          return (
            <div className="border-b border-gray-700" key={notification._id}>
              <div className="flex gap-2 p-4">
                {notification.type === 'follow' && <FaUser className="w-7 h-7 text-primary" />}
                {notification.type === 'like' && <FaHeart className="w-7 h-7 text-red-500" />}
                <Link to={`/profile/${senderUsername}`} className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={notification.from?.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-bold">@{senderUsername}</span>{' '}
                    {notification.type === 'follow' ? 'followed you' : 'liked your post'}
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