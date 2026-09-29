import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';
import { Settings, Shield, Globe, Search, BarChart3, Key, Mail, Check, ExternalLink } from 'lucide-react';

export const AdminConfigPage: React.FC = () => {
  const { adsensePublisherId, setAdsensePublisherId, addToast } = useApp();
  const [pubIdInput, setPubIdInput] = useState(adsensePublisherId);

  useEffect(() => {
    updateSEO({
      title: 'Platform Architecture & Integration Guide – AI Tools Hub',
      description:
        'Configuration reference for site owners: connecting Google Search Console, Google Analytics 4, AdSense IDs, and Gemini AI backend.',
      canonicalPath: '/admin/config',
    });
  }, []);

  const handleSaveAdSense = (e: React.FormEvent) => {
    e.preventDefault();
    setAdsensePublisherId(pubIdInput.trim() || 'YOUR_ADSENSE_PUBLISHER_ID');
    addToast('success', 'AdSense Publisher ID updated for this local session!');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ label: 'Integration & Setup Guide' }]} />

      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <Settings className="h-3.5 w-3.5" />
          <span>Site Owner Technical Guide</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Platform Architecture & Configuration Guide
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive step-by-step instructions for the website owner to configure production domains, Google Search Console indexing, Google Analytics, Google AdSense, and AI API keys.
        </p>
      </header>

      {/* 1. Google Search Console & Indexing */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Connecting Google Search Console (GSC)
            </h2>
            <p className="text-xs text-slate-500">Enable search discovery and submit your dynamic XML sitemap</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            Websites are <strong>not automatically indexed</strong> by search engines. To ensure Google crawls and evaluates your tools and blog guides:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>
              Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Search Console</a> and add your verified domain (e.g. <code>https://aitoolshub.io</code>).
            </li>
            <li>
              Choose DNS verification or HTML meta tag verification. Add the verification token in <code>index.html</code>.
            </li>
            <li>
              In the Search Console sidebar, navigate to <strong>Sitemaps</strong>.
            </li>
            <li>
              Enter your sitemap URL: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">/sitemap.xml</code> and click <strong>Submit</strong>.
            </li>
            <li>
              Review URL Inspection regularly to request indexing for newly published guides and tools.
            </li>
          </ol>
        </div>
      </section>

      {/* 2. Google Analytics 4 (GA4) */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Connecting Google Analytics 4 (GA4)
            </h2>
            <p className="text-xs text-slate-500">Track privacy-friendly user conversions, downloads, and popular tools</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            The codebase is already pre-wired with custom event listeners for:
            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono mx-1">tool_open</code>,
            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono mx-1">tool_complete</code>,
            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono mx-1">download</code>, and
            <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono mx-1">pro_cta_click</code>.
          </p>
          <p>
            To activate live Google Analytics, add your measurement ID (<code>G-XXXXXXXXXX</code>) into your <code>index.html</code> <code>&lt;head&gt;</code> using the standard Google tag script:
          </p>
          <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-[11px] font-mono">
{`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
          </pre>
        </div>
      </section>

      {/* 3. Google AdSense Setup & Live Testing */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Google AdSense Configuration
            </h2>
            <p className="text-xs text-slate-500">Configure compliant responsive ad slots</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <p>
            AdSense slots are strategically placed across the header, mid-content, and footer areas without obstructing user tool actions or triggering accidental clicks.
          </p>

          <form onSubmit={handleSaveAdSense} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-semibold text-slate-900 dark:text-white">
              Test Publisher ID for this session:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pubIdInput}
                onChange={(e) => setPubIdInput(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 4. Secure AI Backend & API Keys */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Gemini AI Backend Key Management
            </h2>
            <p className="text-xs text-slate-500">Security principles & zero client exposure</p>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
          <p>
            In accordance with security best practices, the client-side JavaScript bundle <strong>never</strong> has access to private API keys. AI calls route through the Express proxy in <code>server.ts</code>.
          </p>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono space-y-1">
            <div># Set in server environment or .env file</div>
            <div className="text-blue-600 dark:text-blue-400 font-bold">GEMINI_API_KEY="YOUR_GEMINI_KEY"</div>
            <div className="text-slate-500">APP_URL="https://your-domain.com"</div>
          </div>
          <p>
            When no key is configured, the application displays a friendly status notice without throwing fatal console exceptions.
          </p>
        </div>
      </section>

    </div>
  );
};
