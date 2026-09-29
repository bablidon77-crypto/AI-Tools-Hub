import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Terms of Service – AI Tools Hub',
      description: 'Terms of Service and acceptable use conditions for AI Tools Hub.',
      canonicalPath: '/terms',
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <header className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the website AI Tools Hub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Acceptable Use
          </h2>
          <p>
            You agree not to use the tools provided on AI Tools Hub for any unlawful purpose, including but not limited to transmitting malicious files, generating abusive content, violating copyright or trademark rights, or attempting to circumvent usage limits and security perimeters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The services and browser utilities are provided on an "as is" and "as available" basis. While we strive for optimal accuracy and high uptime, AI Tools Hub makes no warranties regarding the infallibility, completeness, or fitness for a particular purpose of any generated resume, compressed file, or AI text.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall AI Tools Hub or its maintainers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the tools.
          </p>
        </section>
      </div>
    </div>
  );
};
