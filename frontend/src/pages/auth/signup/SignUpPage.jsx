import { Link } from 'react-router-dom';
import { useState } from 'react';

import XSvg from '../../../components/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdPassword } from 'react-icons/md';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiRequest, normalizeUser } from '../../../utils/api';

const SignUpPage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      return normalizeUser(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['authUser'], user);
      toast.success('Account created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="max-w-6xl mx-auto flex min-h-screen px-5 py-10 sm:px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="auth-card flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-12 fill-white" />
          <div><p className="text-sm font-semibold text-primary">JOIN THE CONVERSATION</p><h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white">Create your account.</h1></div>
          <label className="auth-input flex items-center gap-3">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              autoComplete="email"
              required
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="auth-input flex items-center gap-2 flex-1 min-w-40">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                autoComplete="username"
                required
              />
            </label>
            <label className="auth-input flex items-center gap-2 flex-1 min-w-40">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
                autoComplete="name"
                required
              />
            </label>
          </div>
          <label className="auth-input flex items-center gap-3">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              autoComplete="new-password"
              required
            />
          </label>
          <button
            className="btn rounded-full border-0 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-sky-500"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Sign up'}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
          <p className="text-center text-sm text-slate-400">Already have an account? <Link className="font-semibold text-primary hover:underline" to="/login">Sign in</Link></p>
        </form>
      </div>
    </main>
  );
};
export default SignUpPage;
