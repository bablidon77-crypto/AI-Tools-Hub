import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';
import { ShieldCheck, Zap, Globe, Sparkles, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    updateSEO({
      title: 'About AI Tools Hub – Our Mission & Architecture',
      description:
        'Learn why we built AI Tools Hub: delivering lightning-fast, privacy-first browser utilities and AI assistance without deceptive paywalls or data exploitation.',
      canonicalPath: '/about',
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About AI Tools Hub
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Smart AI & Online Tools, All in One Place. Built on modern web technologies for uncompromising speed and genuine privacy.
        </p>
      </header>

      {/* Mission Statement */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Our Core Mission
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The modern internet is flooded with online converters and PDF tools that bombard users with popups, force downloads of suspicious software, or upload private documents to unknown third-party servers.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          AI Tools Hub was founded with a clear alternative: provide clean, beautiful, browser-local utilities where users can compress photos, merge PDFs, generate scannable QR codes, craft ATS-compliant resumes, and draft text with smart AI assistance.
        </p>
      </section>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Client-Side Processing
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Whenever technically viable, tools run directly inside your browser memory using HTML5 Canvas, WebAssembly, and local storage. No server transmission required.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Zero Install & Mobile Ready
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            No app store downloads, desktop software, or browser extensions needed. Instant performance across Android, iOS, Windows, Mac, and Linux.
          </p>
        </div>
      </div>

    </div>
  );
};
