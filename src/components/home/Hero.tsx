import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import heroImage from '../../assets/images/hero_ai_tools_hub_1790611014418.jpg';

export const Hero: React.FC<{ onExploreClick: () => void }> = ({ onExploreClick }) => {
  const { navigate, setIsSearchOpen } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#E2E8F0] dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-blue-950/50 border border-[#2563EB]/25 dark:border-blue-800/60 text-[#2563EB] dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart AI & Browser Productivity Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-[1.15]">
              AI Tools Hub
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2563EB] dark:text-blue-400 mt-2">
                Smart AI & Online Tools, All in One Place.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#475569] dark:text-slate-300 max-w-xl leading-relaxed">
              Free AI and online tools for resumes, images, PDFs, QR codes, writing, and everyday productivity. Process documents directly on your device with complete privacy.
            </p>

            {/* Quick Search Bar */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center max-w-md w-full p-2 pl-4 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-900 shadow-sm hover:border-[#2563EB] dark:hover:border-blue-400 transition-all cursor-pointer group"
            >
              <Search className="h-4 w-4 text-[#475569] group-hover:text-[#2563EB] transition-colors mr-3 shrink-0" />
              <span className="text-xs sm:text-sm text-[#475569] flex-1">Search for a tool (e.g., resume, compress, pdf)...</span>
              <span className="hidden sm:inline-block px-2 py-1 rounded bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[11px] font-mono text-[#475569]">
                ⌘K
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Explore Free Tools</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#FFFFFF] dark:bg-slate-900 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 text-[#0F172A] dark:text-slate-200 px-5 py-3 text-sm font-semibold transition-all cursor-pointer"
              >
                <span>View Pro Tools</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#475569] dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#16A34A]" />
                <span>Zero Server Uploads for Files</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-[#F59E0B]" />
                <span>Fast Browser Processing</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-800 aspect-video lg:aspect-[4/3]">
              <img
                src={heroImage}
                alt="AI Tools Hub Modern Digital Workspace"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xs font-semibold tracking-wider uppercase text-[#06B6D4]">
                    Browser-Powered Performance
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Lightning-fast tools designed for long-term productivity
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
