import React from 'react';
import { ToolItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { FileText, Image, Layers, QrCode, Sparkles, Heart, ArrowRight } from 'lucide-react';

export const ToolCard: React.FC<{ tool: ToolItem }> = ({ tool }) => {
  const { navigate, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(tool.slug);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'FileText':
        return <FileText className="h-6 w-6 text-[#2563EB] dark:text-blue-400" />;
      case 'Image':
        return <Image className="h-6 w-6 text-[#7C3AED] dark:text-purple-400" />;
      case 'Layers':
        return <Layers className="h-6 w-6 text-[#06B6D4] dark:text-cyan-400" />;
      case 'QrCode':
        return <QrCode className="h-6 w-6 text-[#16A34A] dark:text-emerald-400" />;
      default:
        return <Sparkles className="h-6 w-6 text-[#F59E0B] dark:text-amber-400" />;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      
      {/* Top Header: Icon, Favorite, Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 transition-colors">
            {renderIcon(tool.iconName)}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                tool.badge === 'Pro'
                  ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                  : 'bg-[#2563EB]/10 text-[#2563EB]'
              }`}
            >
              {tool.badge}
            </span>

            <button
              onClick={() => toggleFavorite(tool.slug)}
              className="p-1.5 rounded-lg text-[#475569] hover:text-[#DC2626] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={`Favorite ${tool.name}`}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#475569]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>

        <p className="text-xs font-medium text-[#475569] dark:text-slate-400 mt-1 mb-3">
          {tool.tagline}
        </p>

        <p className="text-xs text-[#475569] dark:text-slate-300 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>

        {/* Feature Points */}
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-slate-800/80">
          <div className="text-[11px] text-[#475569] dark:text-slate-400 space-y-1">
            {tool.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="text-[#2563EB] font-bold">·</span>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={() => navigate(`/tools/${tool.slug}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-[#2563EB] text-white dark:bg-slate-800 dark:hover:bg-[#2563EB] py-2.5 px-4 text-xs font-semibold shadow-sm transition-all cursor-pointer group-hover:bg-[#2563EB]"
        >
          <span>Open Tool</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
