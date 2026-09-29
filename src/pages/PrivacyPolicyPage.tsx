import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Privacy Policy – AI Tools Hub',
      description:
        'Privacy Policy for AI Tools Hub: How we process client-side images, PDFs, resumes, and text utilities with complete transparency.',
      canonicalPath: '/privacy-policy',
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Client-Side Browser Processing
          </h2>
          <p>
            AI Tools Hub is fundamentally architected around client-side execution wherever technically feasible. Utilities including the <strong>Image Compressor</strong>, <strong>PDF Tools Suite</strong>, and <strong>QR Code Generator</strong> execute in the local sandbox of your browser using HTML5 Canvas, WebAssembly, and JavaScript. Your image binaries and PDF files are not uploaded to our application servers for these operations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. AI Services & Text Processing
          </h2>
          <p>
            When utilizing optional AI features (such as the AI Resume Enhancer or AI Text Tools), user-submitted text prompts are securely routed via an encrypted server-side proxy to the Google Gemini API to produce completion output. We do not store, catalog, or sell your submitted prompts. API keys and service secrets are strictly maintained server-side and never exposed to client browser scripts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Local Storage Data
          </h2>
          <p>
            Certain application preferences—such as your dark/light theme choice, favorite tools list, recently opened tools, and drafted resume details—are stored strictly within your browser's <code>localStorage</code>. This data remains on your physical device and can be cleared at any time through your browser settings or the tool reset buttons.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Analytics & Advertising
          </h2>
          <p>
            We may utilize Google Analytics and Google AdSense to monitor non-personally identifiable site performance and display contextual advertisements to free-tier visitors. These third-party services may use cookies or web beacons in accordance with their respective privacy policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Contact Information
          </h2>
          <p>
            For privacy inquiries or technical questions regarding data handling, contact our security team at <code>privacy@aitoolshub.io</code>.
          </p>
        </section>
      </div>
    </div>
  );
};
