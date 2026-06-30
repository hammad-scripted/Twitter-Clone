import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';

const AppLayout = ({ children }) => {
	return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar />
			{children}
			<RightPanel />
		</div>
	);
};

function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<AppLayout>
						<HomePage />
					</AppLayout>
				}
			/>
			<Route
				path='/notifications'
				element={
					<AppLayout>
						<NotificationPage />
					</AppLayout>
				}
			/>
			<Route
				path='/profile/:username'
				element={
					<AppLayout>
						<ProfilePage />
					</AppLayout>
				}
			/>
			<Route path='/signup' element={<SignUpPage />} />
			<Route path='/login' element={<LoginPage />} />
		</Routes>
	);
}

export default App;
