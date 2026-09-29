import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateSEO } from '../utils/seo';
import { TOOLS_LIST } from '../data/tools';
import { Search, Home, ArrowRight, FileQuestion, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  resourceType?: 'page' | 'tool' | 'guide';
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ resourceType = 'page' }) => {
  const { navigate, setIsSearchOpen } = useApp();

  useEffect(() => {
    updateSEO({
      title: '404 - Page Not Found | AI Tools Hub',
      description: 'The requested page or tool could not be found. Explore our free suite of browser utilities and productivity guides.',
      canonicalPath: '/404',
      noindex: true,
    });
  }, []);

  const getMessage = () => {
    switch (resourceType) {
      case 'tool':
        return 'The tool you are looking for does not exist or may have been renamed.';
      case 'guide':
        return 'The guide or article you requested was not found.';
      default:
        return 'The page you are looking for does not exist, was moved, or had its URL updated.';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* 404 Badge & Visual */}
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 shadow-xs">
        <FileQuestion className="h-10 w-10" />
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {resourceType === 'tool' ? 'Tool Not Found' : resourceType === 'guide' ? 'Guide Not Found' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {getMessage()} Use the quick search below or return to our verified tools directory.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Return to Homepage</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Search className="h-4 w-4 text-blue-600" />
          <span>Search All Tools (⌘K)</span>
        </button>
      </div>

      {/* Suggested Popular Tools Grid */}
      <div className="pt-12 border-t border-slate-200 dark:border-slate-800 text-left space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Available Productivity Tools
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Catalog</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {TOOLS_LIST.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(`/tools/${tool.slug}`)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {tool.name}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {tool.tagline}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
