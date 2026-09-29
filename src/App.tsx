/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { ShareModal } from './components/common/ShareModal';
import { UpgradeModal } from './components/common/UpgradeModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AdminConfigPage } from './pages/AdminConfigPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  // Route matching logic
  const renderCurrentRoute = () => {
    // 1. Tool routes: /tools/:slug
    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '').split('/')[0];
      return <ToolPage slug={slug} />;
    }

    // 2. Blog Post routes: /blog/:slug
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').split('/')[0];
      return <BlogPostPage slug={slug} />;
    }

    // 3. Static route matchers
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/pricing':
        return <PricingPage />;
      case '/blog':
        return <BlogPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/cookie-policy':
        return <CookiePolicyPage />;
      case '/disclaimer':
        return <DisclaimerPage />;
      case '/admin/config':
        return <AdminConfigPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0F172A] dark:text-[#F8FAFC] transition-colors">
      <Header />
      <main className="flex-1 w-full">{renderCurrentRoute()}</main>
      <Footer />

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ShareModal />
      <UpgradeModal />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
