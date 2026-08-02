import React from 'react';
import { Search, User, FileText, Sun, Moon } from 'lucide-react';
import { ReadingTheme } from '../types';

interface HeaderProps {
  activeTab: 'articles' | 'about';
  setActiveTab: (tab: 'articles' | 'about') => void;
  onToggleSearch: () => void;
  isSearchOpen: boolean;
  theme: ReadingTheme;
  setTheme: (theme: ReadingTheme) => void;
  blogName?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onToggleSearch,
  isSearchOpen,
  theme,
  setTheme,
  blogName = "Sahan Sandaruwan",
  avatarUrl
}) => {
  const isDark = theme === 'dark' || theme === 'midnight';

  const toggleQuickTheme = () => {
    if (theme === 'light') setTheme('sepia');
    else if (theme === 'sepia') setTheme('dark');
    else if (theme === 'dark') setTheme('midnight');
    else setTheme('light');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-current/10 backdrop-blur-md bg-opacity-90 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo Title */}
        <button
          id="header-brand-title"
          onClick={() => setActiveTab('articles')}
          className="flex items-center gap-2 group text-left focus:outline-none min-w-0 shrink"
        >
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={blogName}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-current/20 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="font-hn-reader text-sm sm:text-base md:text-lg font-bold tracking-tight whitespace-nowrap truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none transition-opacity group-hover:opacity-80">
            {blogName}
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            id="nav-tab-articles"
            onClick={() => setActiveTab('articles')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[36px] ${
              activeTab === 'articles'
                ? 'bg-current/10 opacity-100 font-semibold'
                : 'opacity-70 hover:opacity-100 hover:bg-current/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Essays</span>
          </button>

          <button
            id="nav-tab-about"
            onClick={() => setActiveTab('about')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-1.5 min-h-[36px] ${
              activeTab === 'about'
                ? 'bg-current/10 opacity-100 font-semibold'
                : 'opacity-70 hover:opacity-100 hover:bg-current/5'
            }`}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>About</span>
          </button>

          <div className="h-4 w-[1px] bg-current/15 mx-0.5" />

          {/* Search Trigger */}
          <button
            id="header-search-btn"
            onClick={onToggleSearch}
            className={`p-1.5 sm:p-2 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
              isSearchOpen ? 'bg-current/15 opacity-100' : 'opacity-70 hover:opacity-100 hover:bg-current/5'
            }`}
            title="Search essays (Cmd+K / Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            id="header-theme-toggle"
            onClick={toggleQuickTheme}
            className="p-1.5 sm:p-2 rounded-md opacity-70 hover:opacity-100 hover:bg-current/5 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title={`Current theme: ${theme}. Click to switch theme`}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
};
