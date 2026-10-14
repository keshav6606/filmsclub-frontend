import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HiOutlineHome, HiHome, HiOutlineFilm, HiFilm, HiOutlineTv, HiTv, HiOutlineBookmark, HiBookmark } from 'react-icons/hi2';
import { MdSmartDisplay, MdOutlineSmartDisplay } from 'react-icons/md';

export default function MobileBottomNav() {
  const location = useLocation();
  const [savedCount, setSavedCount] = useState(0);

  const updateCount = () => {
    try {
      const list = JSON.parse(localStorage.getItem('filmsclub_watchlist') || '[]');
      setSavedCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setSavedCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('watchlistUpdated', updateCount);
    return () => window.removeEventListener('watchlistUpdated', updateCount);
  }, []);

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <HiOutlineHome className="text-xl" />,
      activeIcon: <HiHome className="text-xl text-red-500" />,
      isActive: location.pathname === '/' || location.pathname === '/filmsclub'
    },
    {
      label: 'Movies',
      path: '/movies',
      icon: <HiOutlineFilm className="text-xl" />,
      activeIcon: <HiFilm className="text-xl text-red-500" />,
      isActive: location.pathname.startsWith('/movies') || location.pathname.startsWith('/mov')
    },
    {
      label: 'Series',
      path: '/series',
      icon: <HiOutlineTv className="text-xl" />,
      activeIcon: <HiTv className="text-xl text-red-500" />,
      isActive: location.pathname.startsWith('/series') || location.pathname.startsWith('/ser')
    },
    {
      label: 'OTT Hub',
      path: '/filmsclub',
      icon: <MdOutlineSmartDisplay className="text-xl" />,
      activeIcon: <MdSmartDisplay className="text-xl text-cyan-400" />,
      isActive: location.pathname.startsWith('/filmsclub') && location.pathname !== '/filmsclub'
    },
    {
      label: 'Watchlist',
      path: '/watchlist',
      icon: <HiOutlineBookmark className="text-xl" />,
      activeIcon: <HiBookmark className="text-xl text-amber-400" />,
      isActive: location.pathname === '/watchlist',
      badge: savedCount > 0 ? savedCount : null
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#090b10]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.85)] px-2 py-1 safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 select-none ${
              item.isActive
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
            }`}
          >
            {/* Active Pill Indicator */}
            {item.isActive && (
              <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
            )}

            <div className="relative">
              {item.isActive ? item.activeIcon : item.icon}
              {item.badge != null && (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-red-600 text-white font-mono font-bold text-[9px] rounded-full shadow-md min-w-[15px] text-center">
                  {item.badge}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] font-outfit mt-0.5 transition-colors ${
                item.isActive ? 'font-bold text-white' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
