import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BLOG_POSTS } from '../data/blogPosts';
import { TOOLS_LIST } from '../data/tools';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdBanner } from '../components/common/AdBanner';
import { updateSEO } from '../utils/seo';
import { Share2, Clock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import blogHeaderImg from '../assets/images/blog_productivity_guide_1790611052323.jpg';
import { NotFoundPage } from './NotFoundPage';

export const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate, openShareModal } = useApp();

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const relatedTool = post?.relatedToolSlug
    ? TOOLS_LIST.find((t) => t.slug === post.relatedToolSlug)
    : null;

  useEffect(() => {
    if (post) {
      updateSEO({
        title: `${post.title} | AI Tools Hub`,
        description: post.description,
        canonicalPath: `/blog/${post.slug}`,
        ogType: 'article',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AI Tools Hub',
            logo: {
              '@type': 'ImageObject',
              url: 'https://aitoolshub.io/logo.png',
            },
          },
          datePublished: '2026-09-01',
        },
      });
    }
  }, [post, slug]);

  if (!post) {
    return <NotFoundPage resourceType="guide" />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs & Share Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', path: '/blog' },
            { label: post.category },
          ]}
        />

        <button
          onClick={() => openShareModal(post.title, window.location.href)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Share2 className="h-3.5 w-3.5 text-blue-600" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>{post.publishDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 pt-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
            {post.author.name[0]}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {post.author.name}
            </div>
            <div className="text-[11px] text-slate-500">
              {post.author.role}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Visual Asset for Article */}
      <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 aspect-video max-h-80 w-full bg-slate-100">
        <img
          src={blogHeaderImg}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Article Content Prose */}
      <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-4">
        {post.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </article>

      {/* In-content AdSense Slot */}
      <AdBanner slotId="ARTICLE_IN_CONTENT_SLOT" format="horizontal" />

      {/* Related Interactive Tool Callout */}
      {relatedTool && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Try the tool directly
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Launch {relatedTool.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md">
              {relatedTool.description}
            </p>
          </div>
          <button
            onClick={() => navigate(`/tools/${relatedTool.slug}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Open Tool Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Keywords / Tags Cloud */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-x-2">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Tags:</span>
        {post.keywords.map((kw) => (
          <span key={kw} className="text-slate-500">
            #{kw}
          </span>
        ))}
      </div>

    </div>
  );
};
