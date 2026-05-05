import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun } from "lucide-react";
import { useTheme } from '../hooks/UseTheme';
import { useAuth } from '../context/AuthContext';


const Navbar = () => {
  const { user, logout: authLogout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full h-14 bg-slate-900 border-b border-slate-800/80 relative z-50">
      <div className='w-full h-full px-4 sm:px-6'>
        <div className='flex items-center justify-between h-full'>

          {/* Logo & Brand */}
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-2.5 hover:opacity-80 transition-opacity'
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className='w-4.5 h-4.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
              </svg>
            </div>
            <span className='text-base font-bold text-white tracking-tight'>
              AI Smart Notebook
            </span>
          </button>

          {/* Desktop Navigation — Center */}
          <div className='hidden md:flex items-center gap-1 bg-slate-800/50 rounded-xl p-1'>
            <NavButton
              active={isActive('/')}
              onClick={() => navigate('/')}
              icon={
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              }
            >
              Home
            </NavButton>
            <NavButton
              active={isActive('/notebooks')}
              onClick={() => navigate('/notebooks')}
              icon={
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
              }
            >
              My Notebooks
            </NavButton>
          </div>

          {/* Right Side Actions */}
          <div className='hidden md:flex items-center gap-2'>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === "dark" ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Notifications */}
            <button
              className='relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all'
              title="Notifications"
            >
              <svg className='w-4.5 h-4.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
              </svg>
              <span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-slate-900'></span>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-700/60 mx-1"></div>

            {/* User Menu */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className='flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-800 transition-all'
              >
                <div className='w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm'>
                  <span className='text-white text-xs font-bold'>
                    {user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                  </span>
                </div>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700/60 rounded-xl shadow-2xl shadow-black/30 py-1.5 z-[100] overflow-hidden"
                  style={{ animation: "fadeSlideIn 0.15s ease-out" }}
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-700/60">
                    <p className="text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email || ''}</p>
                  </div>

                  <div className="py-1">
                    <DropdownItem
                      icon={<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />}
                      onClick={() => { setIsUserMenuOpen(false); navigate('/profile'); }}
                    >
                      Profile
                    </DropdownItem>
                    <DropdownItem
                      icon={<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      icon={<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Statistics
                    </DropdownItem>
                  </div>

                  <div className="border-t border-slate-700/60 pt-1">
                    <DropdownItem
                      icon={<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />}
                      danger
                      onClick={() => { setIsUserMenuOpen(false); authLogout(); navigate('/login'); }}
                    >
                      Logout
                    </DropdownItem>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {isMobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-slate-900 border-t border-slate-800' style={{ animation: "fadeSlideIn 0.2s ease-out" }}>
          <div className='px-4 py-3 space-y-1'>
            <MobileNavButton active={isActive('/')} onClick={() => navigate('/')}>
              🏠 Home
            </MobileNavButton>
            <MobileNavButton active={isActive('/notebooks')} onClick={() => navigate('/notebooks')}>
              📚 My Notebooks
            </MobileNavButton>

            <div className='border-t border-slate-800 my-2 pt-2 flex items-center justify-between'>
              <span className="text-xs text-gray-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


// =========================
// Desktop Nav Button
// =========================
const NavButton = ({
  active,
  onClick,
  icon,
  children
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm ${
        active
          ? 'bg-purple-600/90 text-white font-medium shadow-sm shadow-purple-500/20'
          : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        {icon}
      </svg>
      <span>{children}</span>
    </button>
  );
};


// =========================
// Mobile Nav Button
// =========================
const MobileNavButton = ({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm ${
        active
          ? 'bg-purple-600/20 text-purple-400 font-medium'
          : 'text-gray-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};


// =========================
// Dropdown Item
// =========================
const DropdownItem = ({
  icon,
  children,
  danger = false,
  onClick
}: {
  icon: React.ReactElement;
  children: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 transition-colors text-sm ${
        danger
          ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
          : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        {icon}
      </svg>
      <span>{children}</span>
    </button>
  );
};

export default Navbar;