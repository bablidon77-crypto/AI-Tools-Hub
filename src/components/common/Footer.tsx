import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Share2, Mail, Check, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, openShareModal, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('error', 'Please provide a valid email address.');
      return;
    }
    setSubscribed(true);
    addToast('success', 'Thank you for subscribing to new tool updates!');
    setEmail('');
  };

  return (
    <footer className="w-full border-t border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Row */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 pb-10 border-b border-[#E2E8F0] dark:border-slate-800">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white font-bold text-sm">
                AI
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                AI Tools Hub
              </span>
            </div>
            <p className="text-sm text-[#475569] dark:text-slate-400 max-w-sm leading-relaxed">
              Smart AI & online utilities engineered for fast, secure in-browser productivity. Create resumes, compress images, manage PDFs, and write smarter without data leakage.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#475569] dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                Browser Local Processing
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-[#2563EB]" />
                No App Installation Required
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="rounded-xl bg-[#F8FAFC] dark:bg-slate-800/60 p-6 border border-[#E2E8F0] dark:border-slate-700/60">
              <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                Get monthly productivity tool updates
              </h4>
              <p className="text-xs text-[#475569] dark:text-slate-400 mt-1 mb-4">
                Be the first to access new browser tools, performance guides, and career resources. Zero spam, unsubscribe anytime.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-[#16A34A] font-medium">
                  <Check className="h-4 w-4 text-[#16A34A]" /> You're on the early-access list!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-[#0F172A] dark:text-white placeholder:text-[#475569]/60 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-10">
          
          {/* AI Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              AI Tools
            </h5>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/tools/ai-resume-maker')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  AI Resume Maker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/ai-text-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  AI Writing Assistant
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/ai-text-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Text Rewriter & Grammar
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/ai-text-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Email & Article Outliner
                </button>
              </li>
            </ul>
          </div>

          {/* PDF & Documents */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              PDF & Documents
            </h5>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/tools/pdf-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  PDF Merge Tool
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/pdf-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  PDF Split & Extractor
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/pdf-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Images to PDF
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/pdf-tools')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  PDF Stream Optimizer
                </button>
              </li>
            </ul>
          </div>

          {/* Image & Productivity */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Image & Media
            </h5>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/tools/image-compressor')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Image Compressor
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/image-compressor')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  JPG & PNG Optimizer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/qr-code-generator')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  QR Code Generator
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/tools/qr-code-generator')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Wi-Fi & URL Barcodes
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Resources */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  About AI Tools Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Productivity Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/config')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer text-[#475569]">
                  Integration Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white mb-3">
              Legal & Trust
            </h5>
            <ul className="space-y-2 text-xs text-[#475569] dark:text-slate-400">
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-[#2563EB] dark:hover:text-blue-400 cursor-pointer">
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Share Bar */}
        <div className="pt-8 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475569] dark:text-slate-400">
          <div>
            © 2027 AI Tools Hub. All rights reserved. Built for private, high-performance browser workflows.
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => openShareModal()}
              className="flex items-center gap-1.5 hover:text-[#2563EB] dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>Share Platform</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              Crafted with care
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
