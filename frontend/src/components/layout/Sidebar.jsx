import XSvg from '../svgs/X';

import { MdHomeFilled } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiRequest, getAuthUser, getImageUrl } from '../../utils/api';
import { useImageVersion } from '../../hooks/useImageVersion';
const Sidebar = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['authUser'], queryFn: getAuthUser });
  const { data: unreadNotifications } = useQuery({
    queryKey: ['notificationUnreadCount'],
    queryFn: () => apiRequest('/api/notifications/unread-count'),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  const imageVersion = useImageVersion();
  const unreadCount = unreadNotifications?.count || 0;
  const navClass = ({ isActive }) => `flex gap-3 items-center transition-all rounded-full py-2.5 px-3 max-w-fit hover:bg-white/[0.07] ${isActive ? 'font-bold text-white' : 'text-slate-300'}`;

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.setQueryData(['authUser'], null);
      queryClient.removeQueries({ predicate: ({ queryKey }) => queryKey[0] !== 'authUser' });
      toast.success('Logout successful');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <aside className="w-16 shrink-0 md:w-56">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-white/10 w-full px-2 md:px-3">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/"
              className={navClass}
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </NavLink>
          </li>
          <li className="flex justify-center md:justify-start">
            <NavLink
              to="/notifications"
              className={navClass}
            >
              <span className="relative">
                <IoNotifications className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </span>
              <span className="text-lg hidden md:block">Notifications</span>
            </NavLink>
          </li>

          <li className="flex justify-center md:justify-start">
            <NavLink
              to={`/profile/${data?.username}`}
              className={navClass}
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </NavLink>
          </li>
        </ul>
        {data && (
          <Link
            to={`/profile/${data.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={getImageUrl(data?.profileImg, imageVersion)}
                  className="w-full h-full object-cover"
                  alt={data?.fullName}
                />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{data?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
