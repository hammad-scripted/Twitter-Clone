import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import LoadingSpinner from './components/common/LoadingSpinner';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
const AppLayout = ({ children, rightPanelLoading = false }) => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      {children}
      <RightPanel isLoading={rightPanelLoading} />
    </div>
  );
};

function App() {
  const {
    data: authUser,
    isLoading,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data.data;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {' '}
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <AppLayout>
                <HomePage />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? (
            <AppLayout>
              <NotificationPage />
            </AppLayout>): (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile/:username"
          element={
            authUser ? (
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !authUser ? (
              <AppLayout>
                <SignUpPage />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authUser ? (
              <AppLayout rightPanelLoading>
                <LoginPage />
              </AppLayout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
