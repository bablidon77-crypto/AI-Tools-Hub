import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const { navigate } = useApp();

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(item.path!)}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
