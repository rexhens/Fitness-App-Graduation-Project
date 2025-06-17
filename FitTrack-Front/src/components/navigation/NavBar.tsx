import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, BarChart3, Target } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { name: 'AI Coach', icon: <Dumbbell size={20} />, path: '/chatbot' },
    { name: 'Metrics', icon: <BarChart3 size={20} />, path: '/metrics' },
    { name: 'Goals', icon: <Target size={20} />, path: '/goals' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`
            }
          >
            {item.icon}
            <span className="mt-1 text-xs">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;