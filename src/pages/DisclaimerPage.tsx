import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { updateSEO } from '../utils/seo';

export const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Disclaimer – AI Tools Hub',
      description: 'Legal disclaimer for AI Tools Hub online and AI tools.',
      canonicalPath: '/disclaimer',
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <header className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-500 font-mono">Last updated: September 2026</p>
      </header>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. General Informational Use Only
          </h2>
          <p>
            The content, tools, and guides provided on AI Tools Hub are for general informational, educational, and productivity purposes. While our AI Resume Builder creates ATS-compliant drafts, we do not guarantee job placement, interview callbacks, or hiring outcomes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Artificial Intelligence Content Disclaimer
          </h2>
          <p>
            AI-generated text, summaries, and suggestions are produced probabilistically by large language models. Users should exercise independent judgment and review all generated text, professional resumes, and correspondence for factual accuracy and appropriateness before submitting or publishing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. File Processing & Data Integrity
          </h2>
          <p>
            While our PDF tools and image compression algorithms use robust, verified standards, we recommend maintaining original backups of all critical documents and high-resolution photography before performing splits, merges, or lossy conversions.
          </p>
        </section>
      </div>
    </div>
  );
};
