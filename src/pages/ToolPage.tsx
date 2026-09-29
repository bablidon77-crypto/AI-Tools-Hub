import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS_LIST } from '../data/tools';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdBanner } from '../components/common/AdBanner';
import { ToolCard } from '../components/home/ToolCard';
import { ResumeMaker } from '../components/tools/ResumeMaker/ResumeMaker';
import { ImageCompressor } from '../components/tools/ImageCompressor/ImageCompressor';
import { PdfTools } from '../components/tools/PdfTools/PdfTools';
import { QrGenerator } from '../components/tools/QrGenerator/QrGenerator';
import { AiTextTools } from '../components/tools/AiTextTools/AiTextTools';
import { updateSEO } from '../utils/seo';
import { Share2, ArrowLeft } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage';

export const ToolPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate, recordToolUsage, openShareModal } = useApp();

  const tool = TOOLS_LIST.find((t) => t.slug === slug);

  useEffect(() => {
    if (tool) {
      recordToolUsage(tool.slug);
      updateSEO({
        title: tool.metaTitle,
        description: tool.metaDescription,
        canonicalPath: `/tools/${tool.slug}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: tool.name,
          applicationCategory: 'ProductivityApplication',
          operatingSystem: 'All',
          description: tool.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      });
    }
  }, [tool, slug]);

  if (!tool) {
    return <NotFoundPage resourceType="tool" />;
  }

  const renderActiveTool = () => {
    switch (tool.slug) {
      case 'ai-resume-maker':
        return <ResumeMaker />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'pdf-tools':
        return <PdfTools />;
      case 'qr-code-generator':
        return <QrGenerator />;
      case 'ai-text-tools':
        return <AiTextTools />;
      default:
        return <div>Tool coming soon</div>;
    }
  };

  const relatedTools = TOOLS_LIST.filter((t) => t.slug !== tool.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs & Share Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: 'Tools', path: '/' },
            { label: tool.name },
          ]}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              openShareModal(
                `${tool.name} – Free Online Utility`,
                window.location.href
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Share Tool</span>
          </button>
        </div>
      </div>

      {/* Main Tool Component */}
      <div>{renderActiveTool()}</div>

      {/* In-tool AdSense Slot */}
      <AdBanner slotId={`TOOL_${tool.slug.toUpperCase()}_SLOT`} format="horizontal" />

      {/* Related Tools Recommendation */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            Related Productivity Tools
          </h3>
          <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Continue Working in Your Browser
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTools.map((rel) => (
            <ToolCard key={rel.id} tool={rel} />
          ))}
        </div>
      </div>

    </div>
  );
};
