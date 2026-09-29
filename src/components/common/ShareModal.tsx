import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, closeShareModal, shareData, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen) return null;

  const url = shareData.url;
  const title = shareData.title;
  const hashtags = 'AITools,AIToolsHub,FreeAITools,OnlineTools,ProductivityTools';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('success', 'URL copied to clipboard!');
    trackEvent('copy', { type: 'share_url' });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  const shareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-base">
            <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Share AI Tools Hub
          </div>
          <button
            onClick={closeShareModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Share this free productivity tool with colleagues, students, or your audience on social networks.
          </p>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shareTwitter}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={shareLinkedIn}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span>LinkedIn</span>
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Copy URL bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent px-2 text-xs text-slate-700 dark:text-slate-300 outline-none truncate"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Media Content Tags */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Campaign Hashtags:</span>
            <p className="font-mono text-[10px] mt-1 text-slate-500 dark:text-slate-400 leading-normal">
              #AITools #AIToolsHub #FreeAITools #OnlineTools #AIResumeMaker #PDFTools #ImageCompressor #QRGenerator #Productivity #2027Tech
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
