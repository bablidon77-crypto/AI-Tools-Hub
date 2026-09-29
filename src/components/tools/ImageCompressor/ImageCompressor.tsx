import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { trackEvent } from '../../../utils/analytics';
import {
  Image as ImageIcon,
  Upload,
  Download,
  Trash2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  FileDown,
  RefreshCw,
} from 'lucide-react';
import compressorHeroImg from '../../../assets/images/image_compressor_showcase_1790611040793.jpg';

interface ProcessedImage {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  type: string;
  width: number;
  height: number;
  savingsPercentage: number;
}

export const ImageCompressor: React.FC = () => {
  const { addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const compressSingleFile = (
    file: File,
    qualityRatio: number,
    outFormat: string,
    maxDim: number
  ): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const originalUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize down if exceeding maxWidth
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Fill white background for PNG transparent conversions to JPG
        if (outFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            const compressedUrl = URL.createObjectURL(blob);
            const compressedSize = blob.size;
            const savings =
              file.size > compressedSize
                ? Math.round(((file.size - compressedSize) / file.size) * 100)
                : 0;

            const ext = outFormat === 'image/webp' ? '.webp' : outFormat === 'image/jpeg' ? '.jpg' : '.png';
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

            resolve({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
              name: `${baseName}-compressed${ext}`,
              originalSize: file.size,
              compressedSize,
              originalUrl,
              compressedUrl,
              type: outFormat,
              width,
              height,
              savingsPercentage: savings,
            });
          },
          outFormat,
          qualityRatio
        );
      };
      img.onerror = () => reject(new Error('Could not read image file'));
      img.src = originalUrl;
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      addToast('error', 'Please select valid image files (JPG, PNG, or WebP).');
      return;
    }

    setIsProcessing(true);
    try {
      const results = await Promise.all(
        validFiles.map((file) =>
          compressSingleFile(file, quality / 100, targetFormat, maxWidth)
        )
      );

      setImages((prev) => [...results, ...prev]);
      addToast('success', `Compressed ${results.length} image(s) successfully!`);
      trackEvent('tool_complete', {
        tool_name: 'image-compressor',
        count: results.length,
      });
    } catch {
      addToast('error', 'Error occurred while compressing images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRecompressAll = async (newQuality: number) => {
    setQuality(newQuality);
    // User can trigger compression with updated settings on newly added items
  };

  const handleDownload = (img: ProcessedImage) => {
    const link = document.createElement('a');
    link.href = img.compressedUrl;
    link.download = img.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    trackEvent('download', { tool_name: 'image-compressor', file_type: img.type });
  };

  const handleDownloadAll = () => {
    images.forEach((img, idx) => {
      setTimeout(() => {
        handleDownload(img);
      }, idx * 250);
    });
    addToast('success', 'Downloading all compressed images...');
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    setImages([]);
    addToast('info', 'All images cleared.');
  };

  const totalOriginal = images.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressed = images.reduce((acc, curr) => acc + curr.compressedSize, 0);
  const totalSavings =
    totalOriginal > 0 && totalOriginal > totalCompressed
      ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
      : 0;

  return (
    <div className="space-y-8">
      
      {/* Tool Header */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#7C3AED]/10 dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-400">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                Browser Image Compressor
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Compress JPG, PNG & WebP files up to 90% without losing visual clarity
              </p>
            </div>
          </div>

          {/* Privacy Guarantee Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16A34A]/10 dark:bg-emerald-950/40 border border-[#16A34A]/30 dark:border-emerald-800/60 text-[#16A34A] dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0" />
            <span>Your images are processed locally in your browser.</span>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images for compression by clicking or dragging and dropping"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDragging
            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Upload className="h-8 w-8" />
          </div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            Click to upload or drag and drop images here
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Supports JPG, JPEG, PNG, and WebP. Batch processing supported. Zero server uploads.
          </p>
        </div>
      </div>

      {/* Compression Controls */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Compression Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="compress-quality-slider" className="font-semibold text-slate-700 dark:text-slate-300">
                Quality: {quality}%
              </label>
              <span className="text-[11px] text-slate-400">
                {quality >= 80 ? 'High Fidelity' : quality >= 60 ? 'Optimal Web' : 'Maximum Reduction'}
              </span>
            </div>
            <input
              id="compress-quality-slider"
              name="compressQuality"
              type="range"
              min={10}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => handleRecompressAll(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Output Format */}
          <div className="space-y-2">
            <label htmlFor="compress-format-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Format
            </label>
            <select
              id="compress-format-select"
              name="targetFormat"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="image/jpeg">JPG / JPEG (Standard Compatibility)</option>
              <option value="image/webp">WebP (Modern High Ratio)</option>
              <option value="image/png">PNG (Lossless / Transparent)</option>
            </select>
          </div>

          {/* Max Width Limit */}
          <div className="space-y-2">
            <label htmlFor="compress-maxwidth-select" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Max Width: {maxWidth}px
            </label>
            <select
              id="compress-maxwidth-select"
              name="maxWidth"
              value={maxWidth}
              onChange={(e) => setMaxWidth(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value={1200}>1200px (Mobile & Blog)</option>
              <option value={1920}>1920px (Full HD Standard)</option>
              <option value={2560}>2560px (2K Retina)</option>
              <option value={4000}>Original Dimensions (No Resize)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Results & Batch List */}
      {images.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          
          {/* Summary Metric Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compressed Images ({images.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Total Original: {formatFileSize(totalOriginal)} → Compressed: {formatFileSize(totalCompressed)} ({totalSavings}% saved)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>Download All</span>
              </button>
              <button
                onClick={handleClearAll}
                className="p-1.5 text-[#475569] hover:text-[#DC2626] rounded-lg cursor-pointer"
                title="Clear all images"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC]/60 dark:bg-slate-800/40 p-4 flex gap-4 items-center"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-[#E2E8F0] dark:border-slate-700">
                  <img
                    src={img.compressedUrl}
                    alt={img.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-[#16A34A] text-white text-[9px] font-bold px-1 rounded">
                    -{img.savingsPercentage}%
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-xs font-semibold text-[#0F172A] dark:text-white truncate">
                    {img.name}
                  </div>
                  <div className="text-[11px] font-mono text-[#475569] dark:text-slate-400 space-x-2">
                    <span className="line-through text-slate-400">
                      {formatFileSize(img.originalSize)}
                    </span>
                    <span className="font-bold text-[#16A34A] dark:text-emerald-400">
                      {formatFileSize(img.compressedSize)}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#475569] font-mono">
                    {img.width}×{img.height}px · {img.type.split('/')[1].toUpperCase()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(img)}
                    className="p-2 rounded-lg bg-[#2563EB]/10 dark:bg-blue-900/30 text-[#2563EB] dark:text-blue-400 hover:bg-[#2563EB]/20 transition-colors cursor-pointer"
                    title="Download compressed image"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(img.id)}
                    className="p-2 rounded-lg text-[#475569] hover:text-[#DC2626] transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Comprehensive SEO Content Section */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Understanding Image Compression & Web Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
              What is image compression?
            </h4>
            <p>
              Image compression is the science of minimizing the file size of graphics without significantly degrading visible photographic details. It works either losslessly (reorganizing pixels and purging metadata) or through calibrated lossy algorithms (pruning imperceptible nuances).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
              Why compress images for Google Search?
            </h4>
            <p>
              Page speed and Core Web Vitals (especially Largest Contentful Paint, LCP) are critical ranking factors in Google Search. Heavy uncompressed photography is the #1 cause of slow mobile websites and high bounce rates.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
              How to reduce image size safely?
            </h4>
            <p>
              Keep quality between 75% and 82%. Resizing display dimensions down from camera native (e.g., 4000px down to 1920px) yields up to 70% savings before quality compression is even applied.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
              Best image formats for websites
            </h4>
            <p>
              WebP is the modern golden standard, offering transparency and animation with 30% smaller sizes than JPEG. JPG remains the universal fallback, while PNG is optimal for vector logos and screenshots.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
