import { useState } from 'react';
import { Link } from 'react-router-dom';

import XSvg from '../../../components/svgs/X';

import { MdOutlineMail, MdPassword } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiRequest, normalizeUser } from '../../../utils/api';

const LoginPage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      return normalizeUser(data);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['authUser'], user);
      toast.success('Logged in successfully');
    },
    onError: (err) => {
      toast.error(err.message);
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
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center gap-6">
        <div className="rounded-[2rem] bg-primary/10 p-16 ring-1 ring-primary/20"><XSvg className="w-56 fill-white" /></div>
        <p className="max-w-sm text-center text-xl text-slate-400">See what people are talking about, right now.</p>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="auth-card flex gap-5 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-12 fill-white" />
          <div><p className="text-sm font-semibold text-primary">WELCOME BACK</p><h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white">Sign in to your feed.</h1></div>
          <label className="auth-input flex items-center gap-3">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              autoComplete="username"
              required
            />
          </label>

          <label className="auth-input flex items-center gap-3">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              autoComplete="current-password"
              required
            />
          </label>
          <button
            className="btn rounded-full border-0 bg-primary text-white shadow-lg shadow-primary/20 hover:bg-sky-500"
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Login'}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
          <p className="text-center text-sm text-slate-400">New here? <Link className="font-semibold text-primary hover:underline" to="/signup">Create an account</Link></p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
