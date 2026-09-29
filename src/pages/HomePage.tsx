import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ToolCategory } from '../types';
import { TOOLS_LIST, POPULAR_TOOLS } from '../data/tools';
import { BLOG_POSTS } from '../data/blogPosts';
import { Hero } from '../components/home/Hero';
import { CategoryFilter } from '../components/home/CategoryFilter';
import { ToolCard } from '../components/home/ToolCard';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { HomeFaq } from '../components/home/HomeFaq';
import { FAQS_LIST } from '../data/faqs';
import { AdBanner } from '../components/common/AdBanner';
import { updateSEO } from '../utils/seo';
import { Sparkles, ArrowRight, Heart, Clock, BookOpen } from 'lucide-react';
import blogFeatureImg from '../assets/images/blog_productivity_guide_1790611052323.jpg';

export const HomePage: React.FC = () => {
  const { navigate, favorites, recentTools } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const toolsSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    updateSEO({
      title: 'AI Tools Hub – Smart AI & Online Tools, All in One Place',
      description:
        'Free, fast online tools for AI resumes, client-side image compression, PDF merging and splitting, custom QR code generation, and smart AI writing.',
      canonicalPath: '/',
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: 'AI Tools Hub',
            url: 'https://aitoolshub.io/',
            description: 'Smart AI & Online Tools, All in One Place.',
          },
          {
            '@type': 'FAQPage',
            mainEntity: FAQS_LIST.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ],
      },
    });
  }, []);

  const scrollToTools = () => {
    toolsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredTools =
    selectedCategory === 'all'
      ? TOOLS_LIST
      : TOOLS_LIST.filter((tool) => tool.category === selectedCategory);

  const favoriteToolObjects = TOOLS_LIST.filter((t) => favorites.includes(t.slug));
  const recentToolObjects = TOOLS_LIST.filter((t) => recentTools.includes(t.slug));

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Section */}
      <Hero onExploreClick={scrollToTools} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* AdSense Top Slot */}
        <AdBanner slotId="HOMEPAGE_HEADER_SLOT" format="horizontal" />

        {/* Recently Used / Favorites Quick Access (If populated) */}
        {recentToolObjects.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Jump Back In (Recent Tools)
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {recentToolObjects.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 truncate">
                    {tool.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Main Tools Catalog Section */}
        <div ref={toolsSectionRef} className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Explore The Suite
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Popular & Essential Utilities
              </h3>
            </div>
            
            {/* Category Filter Tabs */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* AdSense Mid-Page Slot */}
        <AdBanner slotId="HOMEPAGE_IN_CONTENT_SLOT" format="horizontal" />

        {/* 3. Why AI Tools Hub Section */}
        <WhyChooseUs />

        {/* 4. Editorial & SEO Guides Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Guides & Knowledge Base
              </h2>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Master Online Productivity
              </h3>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>View all guides</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <div
                key={post.slug}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    {post.category} · {post.readTime}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>By {post.author.name}</span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Read Guide →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Frequently Asked Questions */}
        <HomeFaq />

        {/* AdSense Pre-Footer Slot */}
        <AdBanner slotId="HOMEPAGE_FOOTER_SLOT" format="horizontal" />

        {/* Internal SEO Link Cloud */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-6 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
            Fast Keyword Access
          </div>
          <p className="leading-relaxed">
            Free online tools · AI tools online · Free PDF tools · AI resume maker · Client-side image compressor · QR code generator · AI writing tools · PDF merger · Split PDF online · WebP optimizer · ATS resume templates.
          </p>
        </div>

      </div>

    </div>
  );
};
