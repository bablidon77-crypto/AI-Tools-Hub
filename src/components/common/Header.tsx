import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sun, Moon, Monitor, Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, theme, setTheme, setIsSearchOpen, openUpgradeModal, userPlan } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tools', path: '/' },
    { label: 'Resume', path: '/tools/ai-resume-maker' },
    { label: 'Image', path: '/tools/image-compressor' },
    { label: 'PDF', path: '/tools/pdf-tools' },
    { label: 'QR Code', path: '/tools/qr-code-generator' },
    { label: 'AI Writing', path: '/tools/ai-text-tools' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Blog', path: '/blog' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172A]/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
            aria-label="AI Tools Hub Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-lg shadow-sm group-hover:bg-[#1D4ED8] transition-colors">
              AI
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              AI Tools Hub
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569] dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors py-1 cursor-pointer whitespace-nowrap hover:text-[#2563EB] dark:hover:text-blue-400 ${
                  isActive
                    ? 'text-[#2563EB] dark:text-blue-400 font-semibold border-b-2 border-[#2563EB] dark:border-blue-400'
                    : ''
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Theme, Pro Plan / CTA) */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/60 px-3 py-1.5 text-xs text-[#475569] dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            aria-label="Search tools"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block rounded bg-[#E2E8F0] dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-[#475569] dark:text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              if (theme === 'light') setTheme('dark');
              else if (theme === 'dark') setTheme('system');
              else setTheme('light');
            }}
            className="p-2 text-[#475569] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to switch.`}
            aria-label="Toggle theme"
          >
            {theme === 'light' && <Sun className="h-4 w-4" />}
            {theme === 'dark' && <Moon className="h-4 w-4" />}
            {theme === 'system' && <Monitor className="h-4 w-4" />}
          </button>

          {/* Pro Action Button */}
          {userPlan === 'free' ? (
            <button
              onClick={() => openUpgradeModal('Header Upgrade')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <span>Get Pro</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex items-center rounded-lg bg-[#16A34A]/10 border border-[#16A34A]/30 px-2.5 py-1 text-xs font-semibold text-[#16A34A]">
              Pro Active
            </span>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md font-medium cursor-pointer transition-colors ${
                currentPath === link.path
                  ? 'bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                  : 'text-[#475569] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openUpgradeModal('Mobile Upgrade');
              }}
              className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              View Pro Plans
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
