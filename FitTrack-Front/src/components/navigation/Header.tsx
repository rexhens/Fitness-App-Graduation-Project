import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuButtonClick }) => {
  const { logout } = useAuthContext();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          className="p-2 text-gray-500 rounded-md hover:text-secondary focus:outline-none"
          onClick={onMenuButtonClick}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center ml-auto">
        <button className="p-2 text-gray-500 rounded-md hover:text-secondary focus:outline-none">
          <Bell size={20} />
        </button>

        <div className="relative ml-3">
          <div className="flex items-center">
            <button className="flex items-center p-1 text-gray-500 border border-transparent rounded-full hover:text-secondary focus:outline-none">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white">
                <User size={18} />
              </div>
            </button>
          </div>

          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden">
            {/* Profile dropdown items would go here */}
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;