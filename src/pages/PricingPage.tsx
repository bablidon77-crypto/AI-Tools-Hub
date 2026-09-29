import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateSEO } from '../utils/seo';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Check, X, Shield, Zap, Sparkles, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { userPlan, openUpgradeModal } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    updateSEO({
      title: 'Pricing & Pro Subscriptions – AI Tools Hub',
      description:
        'Compare Free, Pro, and Business plans on AI Tools Hub. Unlock unlimited AI generations, premium ATS templates, batch PDF processing, and ad-free productivity.',
      canonicalPath: '/pricing',
    });
  }, []);

  const featuresMatrix = [
    { name: 'Image Compressor (JPG, PNG, WebP)', free: 'Full', pro: 'Full', business: 'Full' },
    { name: 'PDF Merge, Split & Extract', free: 'Up to 50MB', pro: 'Up to 100MB', business: 'Up to 250MB' },
    { name: 'QR Code Generator (PNG & SVG)', free: 'Full', pro: 'Full + High Res', business: 'Full + High Res' },
    { name: 'AI Generations (Text & Resume)', free: '5 daily', pro: '100 daily', business: '500 daily' },
    { name: 'ATS Resume Templates', free: 'Standard', pro: 'All 4 Templates', business: 'All 4 Templates' },
    { name: 'Ad-Free Experience', free: false, pro: true, business: true },
    { name: 'Dedicated Fast API Routing', free: false, pro: true, business: true },
    { name: 'Multi-User Agency Support', free: false, pro: false, business: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <Breadcrumbs items={[{ label: 'Pricing & Plans' }]} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Choose the right productivity tier for your workflow
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Start free forever with client-side utilities. Upgrade to Pro for expanded AI generation quotas, priority models, and an ad-free interface.
        </p>

        {/* Billing Switcher */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-xs'
                  : 'text-[#475569] dark:text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-xs'
                  : 'text-[#475569] dark:text-slate-400'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#16A34A]/10 dark:bg-emerald-900/60 text-[#16A34A] dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FREE */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Free Plan
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Everyday Essentials
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 mb-6">
              Ideal for students, casual creators, and one-off document edits.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono">
                $0
              </span>
              <span className="text-xs text-[#475569] ml-1">/ forever</span>
            </div>

            <ul className="space-y-3 text-xs text-[#475569] dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#16A34A] shrink-0" />
                <span>Basic browser tools (Image, QR, PDF)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#16A34A] shrink-0" />
                <span>5 AI generations per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#16A34A] shrink-0" />
                <span>Standard resume builder template</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <X className="h-4 w-4 shrink-0" />
                <span>Includes non-intrusive ads</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <button
              disabled={userPlan === 'free'}
              className="w-full py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {userPlan === 'free' ? 'Current Active Tier' : 'Downgrade to Free'}
            </button>
          </div>
        </div>

        {/* PRO */}
        <div className="rounded-2xl border-2 border-[#2563EB] bg-[#FFFFFF] dark:bg-slate-900 p-8 shadow-lg flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            Most Popular
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-blue-400 mb-2">
              Pro Plan
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Productivity Power
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 mb-6">
              For job seekers, freelance writers, and daily professional users.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono">
                {billingCycle === 'annual' ? '$9' : '$12'}
              </span>
              <span className="text-xs text-[#475569] ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#475569] dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span className="font-semibold text-[#0F172A] dark:text-white">100 AI generations per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>All 4 ATS resume templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span className="font-semibold text-[#0F172A] dark:text-white">Completely Ad-Free experience</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>Vector SVG QR exports & high-res print</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>Priority generation pipeline</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={() => openUpgradeModal('Pro Subscription')}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              {userPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* BUSINESS */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
              Business Plan
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Agencies & Teams
            </h3>
            <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 mb-6">
              For content marketing studios, HR recruiting teams, and high-volume workloads.
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-[#0F172A] dark:text-white font-mono">
                {billingCycle === 'annual' ? '$24' : '$29'}
              </span>
              <span className="text-xs text-[#475569] ml-1">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#475569] dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span className="font-semibold text-[#0F172A] dark:text-white">500 AI generations per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>250MB PDF document limits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>Everything in Pro included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>Multi-seat account management</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>Direct developer API support</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={() => openUpgradeModal('Business Subscription')}
              className="w-full py-2.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              {userPlan === 'business' ? 'Current Plan' : 'Select Business'}
            </button>
          </div>
        </div>

      </div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-8 shadow-xs overflow-x-auto">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-6">
          Detailed Feature Comparison
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-slate-800 text-[#475569]">
              <th className="pb-3 font-semibold">Capability</th>
              <th className="pb-3 font-semibold">Free</th>
              <th className="pb-3 font-semibold">Pro</th>
              <th className="pb-3 font-semibold">Business</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-slate-800">
            {featuresMatrix.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/40">
                <td className="py-3 font-medium text-[#0F172A] dark:text-slate-200">{item.name}</td>
                <td className="py-3 text-[#475569] dark:text-slate-400">
                  {typeof item.free === 'boolean' ? (
                    item.free ? <Check className="h-4 w-4 text-[#16A34A]" /> : <X className="h-4 w-4 text-slate-300" />
                  ) : (
                    item.free
                  )}
                </td>
                <td className="py-3 text-[#0F172A] dark:text-slate-200 font-semibold">
                  {typeof item.pro === 'boolean' ? (
                    item.pro ? <Check className="h-4 w-4 text-[#16A34A]" /> : <X className="h-4 w-4 text-slate-300" />
                  ) : (
                    item.pro
                  )}
                </td>
                <td className="py-3 text-[#0F172A] dark:text-slate-200 font-semibold">
                  {typeof item.business === 'boolean' ? (
                    item.business ? <Check className="h-4 w-4 text-[#16A34A]" /> : <X className="h-4 w-4 text-slate-300" />
                  ) : (
                    item.business
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
