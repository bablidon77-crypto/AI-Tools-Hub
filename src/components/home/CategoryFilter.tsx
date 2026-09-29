import React from 'react';
import { ToolCategory } from '../../types';

interface CategoryFilterProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: 'All Tools' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'pdf', label: 'PDF Tools' },
    { id: 'image', label: 'Image Tools' },
    { id: 'business', label: 'Business Tools' },
    { id: 'productivity', label: 'Productivity Tools' },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-[#FFFFFF] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700/80 hover:bg-[#F8FAFC] dark:hover:bg-slate-750'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
