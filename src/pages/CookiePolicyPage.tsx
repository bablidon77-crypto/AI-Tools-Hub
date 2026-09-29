import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';

export const CookiePolicyPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Cookie Policy – AI Tools Hub',
      description: 'Cookie Policy explaining how AI Tools Hub uses local storage and cookies.',
      canonicalPath: '/cookie-policy',
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Cookie Policy' }]} />

      <header className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Cookie Policy
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. What Are Cookies and Local Storage?
          </h2>
          <p>
            Cookies are small text files placed on your device to help web applications operate smoothly. We also rely on standard HTML5 Local Storage to save your UI preferences (like dark mode or resume drafts) without requiring account registration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. How We Use Cookies
          </h2>
          <p>
            AI Tools Hub uses strictly necessary browser storage for essential site operations, and optional third-party cookies from Google Analytics and Google AdSense to understand user engagement and support free tool access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Controlling Your Cookies
          </h2>
          <p>
            You can configure your browser to block or alert you about cookies. Note that disabling local storage may prevent the resume builder or theme toggles from remembering your work across sessions.
          </p>
        </section>
      </div>
    </div>
  );
};
