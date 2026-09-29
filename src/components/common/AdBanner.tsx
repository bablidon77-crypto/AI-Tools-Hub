import React from 'react';
import { useApp } from '../../context/AppContext';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = 'YOUR_AD_SLOT_ID',
  format = 'horizontal',
  className = '',
}) => {
  const { userPlan, adsensePublisherId } = useApp();

  // Pro and Business users experience an ad-free interface
  if (userPlan !== 'free') {
    return null;
  }

  const heightClass =
    format === 'horizontal'
      ? 'min-h-[90px] max-h-[100px]'
      : format === 'rectangle'
      ? 'min-h-[250px]'
      : 'min-h-[120px]';

  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 text-center transition-all ${className}`}
      aria-label="Advertisement Sponsor Zone"
    >
      <div className="w-full flex justify-between items-center px-2 pb-1 text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
        <span>Advertisement</span>
        <span>AdSense Slot: {slotId}</span>
      </div>

      <div className={`w-full flex flex-col items-center justify-center ${heightClass}`}>
        <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
          Google AdSense Placeholder
        </p>
        <p className="text-[11px] text-slate-400/80 dark:text-slate-500/80 mt-1 max-w-sm">
          Publisher: <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded">{adsensePublisherId}</code>
        </p>
      </div>
    </div>
  );
};
