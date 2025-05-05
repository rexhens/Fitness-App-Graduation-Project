import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, BarChart3, Target, X } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuthContext();

  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { name: 'AI Fitness Coach', icon: <Dumbbell size={20} />, path: '/chatbot' },
    { name: 'Physical Metrics', icon: <BarChart3 size={20} />, path: '/metrics' },
    { name: 'Fitness Goals', icon: <Target size={20} />, path: '/goals' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center mr-2">
              <Dumbbell className="text-white" size={16} />
            </div>
            <span className="text-xl font-semibold text-secondary">FitTrack</span>
          </div>
        </div>
        {onClose && (
          <button
            className="p-2 text-gray-500 rounded-md hover:text-secondary lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <div className="mr-3">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;