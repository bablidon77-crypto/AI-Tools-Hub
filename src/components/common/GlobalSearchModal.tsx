import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS_LIST } from '../../data/tools';
import { BLOG_POSTS } from '../../data/blogPosts';
import { Search, X, ArrowRight, FileText, Image, Layers, QrCode, Sparkles, BookOpen } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigate } = useApp();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredTools = normalizedQuery
    ? TOOLS_LIST.filter(
        (t) =>
          t.name.toLowerCase().includes(normalizedQuery) ||
          t.description.toLowerCase().includes(normalizedQuery) ||
          t.tagline.toLowerCase().includes(normalizedQuery) ||
          t.category.toLowerCase().includes(normalizedQuery)
      )
    : TOOLS_LIST;

  const filteredArticles = normalizedQuery
    ? BLOG_POSTS.filter(
        (b) =>
          b.title.toLowerCase().includes(normalizedQuery) ||
          b.description.toLowerCase().includes(normalizedQuery) ||
          b.keywords.some((k) => k.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const handleSelectTool = (slug: string) => {
    trackEvent('search_tool', { query, slug });
    navigate(`/tools/${slug}`);
    setIsSearchOpen(false);
    setQuery('');
  };

  const handleSelectArticle = (slug: string) => {
    navigate(`/blog/${slug}`);
    setIsSearchOpen(false);
    setQuery('');
  };

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'FileText':
        return <FileText className="h-4 w-4 text-[#2563EB]" />;
      case 'Image':
        return <Image className="h-4 w-4 text-[#7C3AED]" />;
      case 'Layers':
        return <Layers className="h-4 w-4 text-[#06B6D4]" />;
      case 'QrCode':
        return <QrCode className="h-4 w-4 text-[#16A34A]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#F59E0B]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#FFFFFF] dark:bg-slate-900 shadow-2xl border border-[#E2E8F0] dark:border-slate-800 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E2E8F0] dark:border-slate-800">
          <Search className="h-5 w-5 text-[#475569] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, guides, or features (e.g. compress, resume, pdf, qr)..."
            className="flex-1 bg-transparent text-sm text-[#0F172A] dark:text-white placeholder:text-[#475569] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#475569] hover:text-[#0F172A] dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 rounded bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] px-1.5 py-0.5 text-[10px] font-mono text-[#475569]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Tools Section */}
          {filteredTools.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                Tools & Utilities
              </div>
              <div className="space-y-1">
                {filteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.slug)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getToolIcon(tool.iconName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {tool.tagline}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog Articles Section */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                Guides & Articles
              </div>
              <div className="space-y-1">
                {filteredArticles.map((article) => (
                  <button
                    key={article.slug}
                    onClick={() => handleSelectArticle(article.slug)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        <BookOpen className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {article.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {article.category} · {article.readTime}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTools.length === 0 && filteredArticles.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching tools or guides found for "{query}".
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
