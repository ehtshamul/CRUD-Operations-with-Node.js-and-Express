import React from 'react';
import { Users, LogOut, User } from 'lucide-react';

interface NavbarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="backdrop-blur-lg bg-white/70 border-b border-white/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Friends List
              </h1>
              <p className="text-xs text-gray-600">Professional Network Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              <span>Welcome, {user.name}</span>
            </div>
            
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;