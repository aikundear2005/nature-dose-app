import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';

const BottomNav = () => {
  const activeLinkClass = 'text-blue-500';
  const inactiveLinkClass = 'text-gray-500 hover:text-blue-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30">
      <div className="flex justify-around py-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
        >
          <div className="flex flex-col items-center w-16">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">主頁</span>
          </div>
        </NavLink>
        <NavLink
          to="/knowledge"
          className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
        >
          <div className="flex flex-col items-center w-16">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs mt-1">小知識</span>
          </div>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
