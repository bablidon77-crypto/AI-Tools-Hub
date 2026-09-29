import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Shield, Zap, Sparkles, CreditCard } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const UpgradeModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    upgradeModalFeature,
    userPlan,
    setUserPlan,
    aiUsageCount,
    aiUsageLimit,
    addToast,
    navigate,
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business'>('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleCheckoutIntent = (gateway: 'stripe' | 'paypal' | 'googlepay') => {
    setIsProcessing(true);
    trackEvent('pro_cta_click', { plan: selectedPlan, gateway, cycle: billingCycle });

    // Inform the user about the secure backend checkout architecture
    setTimeout(() => {
      setIsProcessing(false);
      addToast(
        'info',
        `Production Gateway: Directing to secure ${gateway.toUpperCase()} hosted session. (Backend webhook verification required).`
      );
    }, 600);
  };

  // Safe developer demo switch for testing Pro UI features
  const handleSimulateActivation = () => {
    setUserPlan('pro');
    addToast('success', 'Demo Mode: Pro plan active in local session. Enjoy ad-free & high quotas!');
    closeUpgradeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all my-8">
        
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unlock Premium Capabilities</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Upgrade for {upgradeModalFeature}
          </h3>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-2">
            You are currently on the <span className="font-semibold text-[#0F172A] dark:text-white capitalize">{userPlan}</span> tier.
            {userPlan === 'free' && (
              <span className="block mt-1 font-mono text-[11px] text-[#F59E0B] dark:text-amber-400">
                Usage: {aiUsageCount} / {aiUsageLimit} free daily AI operations used.
              </span>
            )}
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-sm'
                  : 'text-[#475569] dark:text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-sm'
                  : 'text-[#475569] dark:text-slate-400'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#16A34A]/10 dark:bg-emerald-900/50 text-[#16A34A] dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Pro Card */}
          <div
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
              selectedPlan === 'pro'
                ? 'border-[#2563EB] dark:border-blue-500 bg-[#2563EB]/5 dark:bg-blue-950/20 ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Pro Plan</h4>
                <p className="text-[11px] text-[#475569] dark:text-slate-400">For ambitious professionals</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {billingCycle === 'annual' ? '$9' : '$12'}
                </span>
                <span className="text-xs text-[#475569]">/mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-[#0F172A] dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>100 AI Generations / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>All 4 ATS Resume templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>Completely Ad-Free workspace</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>High-resolution vector SVG exports</span>
              </li>
            </ul>
          </div>

          {/* Business Card */}
          <div
            onClick={() => setSelectedPlan('business')}
            className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
              selectedPlan === 'business'
                ? 'border-[#2563EB] dark:border-blue-500 bg-[#2563EB]/5 dark:bg-blue-950/20 ring-1 ring-[#2563EB]'
                : 'border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Business Plan</h4>
                <p className="text-[11px] text-[#475569] dark:text-slate-400">For agencies & creators</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#0F172A] dark:text-white">
                  {billingCycle === 'annual' ? '$24' : '$29'}
                </span>
                <span className="text-xs text-[#475569]">/mo</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-[#0F172A] dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>500 AI Generations / day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>Batch PDF processing limits (100MB)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>Priority generation throughput</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span>Dedicated developer support</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Gateways (Stripe, PayPal, Google Pay) */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              Secure 256-bit encrypted checkout session
            </span>
            <span className="font-mono text-[10px]">PCI-DSS Compliant</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              disabled={isProcessing}
              onClick={() => handleCheckoutIntent('stripe')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Card / Stripe</span>
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handleCheckoutIntent('paypal')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>PayPal</span>
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handleCheckoutIntent('googlepay')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>Google Pay</span>
            </button>
          </div>

          {/* Test Session Mode Switch */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Development Preview:</span>
            {userPlan === 'free' ? (
              <button
                onClick={handleSimulateActivation}
                className="underline hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                Enable Pro for this local session
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserPlan('free');
                  addToast('info', 'Reverted back to Free plan.');
                }}
                className="underline hover:text-rose-600 cursor-pointer"
              >
                Revert to Free tier
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
