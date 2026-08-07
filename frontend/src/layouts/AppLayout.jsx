import RightPanel from '../components/layout/RightPanel';
import Sidebar from '../components/layout/Sidebar';

const AppLayout = ({ children }) => (
  <div className="app-shell flex max-w-7xl mx-auto min-h-screen">
    <Sidebar />
    {children}
    <RightPanel />
  </div>
);

export default AppLayout;
