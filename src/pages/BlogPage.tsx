import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogPosts';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdBanner } from '../components/common/AdBanner';
import { updateSEO } from '../utils/seo';
import { BookOpen, Clock, ArrowRight, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    updateSEO({
      title: 'Productivity & Tool Guides Blog – AI Tools Hub',
      description:
        'In-depth practical guides on ATS resume optimization, lossy vs. lossless image compression, PDF management, and productive AI writing workflows.',
      canonicalPath: '/blog',
    });
  }, []);

  const categories = [
    'All',
    'AI Tools',
    'Resume & Career',
    'PDF Guides',
    'Image Optimization',
    'Productivity',
  ];

  const filteredPosts =
    selectedCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      <Breadcrumbs items={[{ label: 'Blog & Guides' }]} />

      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Productivity, Tool & Optimization Guides
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Actionable, deeply researched technical articles to help you build better resumes, speed up websites with compressed assets, and master document utilities.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-3">
                <span>{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{post.author.name}</span>
              </div>
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </article>
        ))}
      </div>

      <AdBanner slotId="BLOG_INDEX_FOOTER_SLOT" format="horizontal" />

    </div>
  );
};
