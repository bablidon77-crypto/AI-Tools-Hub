import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlanType, ToastMessage, ToolItem } from '../types';
import { TOOLS_LIST } from '../data/tools';
import { trackEvent } from '../utils/analytics';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  recentTools: string[];
  recordToolUsage: (slug: string) => void;
  userPlan: PlanType;
  setUserPlan: (plan: PlanType) => void;
  aiUsageCount: number;
  incrementAiUsage: () => boolean; // returns false if free limit exceeded
  aiUsageLimit: number;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: (featureName?: string) => void;
  closeUpgradeModal: () => void;
  upgradeModalFeature: string;
  isShareModalOpen: boolean;
  openShareModal: (title?: string, url?: string) => void;
  closeShareModal: () => void;
  shareData: { title: string; url: string };
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  adsensePublisherId: string;
  setAdsensePublisherId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with browser history sync
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (path === currentPath) return;
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Theme Management
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aitoolshub_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    }
    return 'system';
  });

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('aitoolshub_theme', newTheme);
    trackEvent('theme_change', { theme: newTheme });
  };

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_favorites');
      return saved ? JSON.parse(saved) : ['ai-resume-maker', 'image-compressor'];
    } catch {
      return ['ai-resume-maker', 'image-compressor'];
    }
  });

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('aitoolshub_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Recently Used Tools
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_recents');
      return saved ? JSON.parse(saved) : ['ai-resume-maker', 'image-compressor', 'pdf-tools'];
    } catch {
      return ['ai-resume-maker', 'image-compressor', 'pdf-tools'];
    }
  });

  const recordToolUsage = (slug: string) => {
    setRecentTools((prev) => {
      const updated = [slug, ...prev.filter((s) => s !== slug)].slice(0, 5);
      localStorage.setItem('aitoolshub_recents', JSON.stringify(updated));
      return updated;
    });
    trackEvent('tool_open', { tool_name: slug });
  };

  // Plan & AI Usage
  const [userPlan, setUserPlanState] = useState<PlanType>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_plan');
      return (saved as PlanType) || 'free';
    } catch {
      return 'free';
    }
  });

  const setUserPlan = (plan: PlanType) => {
    setUserPlanState(plan);
    localStorage.setItem('aitoolshub_plan', plan);
  };

  const aiUsageLimit = userPlan === 'business' ? 500 : userPlan === 'pro' ? 100 : 5;
  const [aiUsageCount, setAiUsageCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_ai_usage');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const incrementAiUsage = (): boolean => {
    if (userPlan === 'free' && aiUsageCount >= aiUsageLimit) {
      openUpgradeModal('Unlimited AI Generations');
      return false;
    }
    const nextCount = aiUsageCount + 1;
    setAiUsageCount(nextCount);
    localStorage.setItem('aitoolshub_ai_usage', nextCount.toString());
    return true;
  };

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Upgrade Modal
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState('Pro Capabilities');

  const openUpgradeModal = (featureName: string = 'Pro Capabilities') => {
    setUpgradeModalFeature(featureName);
    setIsUpgradeModalOpen(true);
    trackEvent('pro_cta_click', { feature: featureName });
  };

  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  // Social Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState({ title: 'AI Tools Hub', url: 'https://aitoolshub.io' });

  const openShareModal = (title?: string, url?: string) => {
    setShareData({
      title: title || 'AI Tools Hub – Smart AI & Online Tools, All in One Place',
      url: url || (typeof window !== 'undefined' ? window.location.href : 'https://aitoolshub.io'),
    });
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => setIsShareModalOpen(false);

  // Global Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // AdSense Publisher ID
  const [adsensePublisherId, setAdsensePublisherIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('aitoolshub_adsense_pub') || 'YOUR_ADSENSE_PUBLISHER_ID';
    } catch {
      return 'YOUR_ADSENSE_PUBLISHER_ID';
    }
  });

  const setAdsensePublisherId = (id: string) => {
    setAdsensePublisherIdState(id);
    localStorage.setItem('aitoolshub_adsense_pub', id);
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        theme,
        setTheme,
        favorites,
        toggleFavorite,
        recentTools,
        recordToolUsage,
        userPlan,
        setUserPlan,
        aiUsageCount,
        incrementAiUsage,
        aiUsageLimit,
        toasts,
        addToast,
        removeToast,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        upgradeModalFeature,
        isShareModalOpen,
        openShareModal,
        closeShareModal,
        shareData,
        isSearchOpen,
        setIsSearchOpen,
        adsensePublisherId,
        setAdsensePublisherId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
