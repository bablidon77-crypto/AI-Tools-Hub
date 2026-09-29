import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { PDFDocument } from 'pdf-lib';
import { trackEvent } from '../../../utils/analytics';
import {
  Layers,
  FilePlus,
  Scissors,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileDown,
  Minimize2,
} from 'lucide-react';

type PdfSubTool = 'merge' | 'split' | 'extract' | 'images-to-pdf' | 'compress';

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export const PdfTools: React.FC = () => {
  const { addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeSubTool, setActiveSubTool] = useState<PdfSubTool>('merge');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitRange, setSplitRange] = useState<string>('1-2');
  const [extractPagesInput, setExtractPagesInput] = useState<string>('1');
  const [processedDownloadUrl, setProcessedDownloadUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<string>('');

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const valid: UploadedFileItem[] = [];

    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        addToast('error', `"${f.name}" exceeds the 50MB browser memory limit.`);
        continue;
      }
      valid.push({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
        file: f,
        name: f.name,
        size: f.size,
      });
    }

    if (valid.length > 0) {
      if (activeSubTool === 'split' || activeSubTool === 'extract' || activeSubTool === 'compress') {
        // Single file operation
        setUploadedFiles([valid[0]]);
      } else {
        // Multi-file operation
        setUploadedFiles((prev) => [...prev, ...valid]);
      }
      setProcessedDownloadUrl(null);
      setResultMessage('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
    setProcessedDownloadUrl(null);
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setProcessedDownloadUrl(null);
    setResultMessage('');
  };

  // 1. PDF Merge
  const executeMerge = async () => {
    if (uploadedFiles.length < 2) {
      addToast('error', 'Please upload at least 2 PDF documents to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of uploadedFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setProcessedDownloadUrl(url);
      setProcessedFileName('merged-document.pdf');
      setResultMessage(
        `Successfully merged ${uploadedFiles.length} PDF files into a single document (${formatFileSize(
          blob.size
        )}).`
      );
      addToast('success', 'PDF documents merged successfully!');
      trackEvent('tool_complete', { tool_name: 'pdf-tools', subtool: 'merge' });
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to merge PDFs. Ensure documents are not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. PDF Split
  const executeSplit = async () => {
    if (uploadedFiles.length === 0) {
      addToast('error', 'Please upload a PDF document.');
      return;
    }

    setIsProcessing(true);
    try {
      const item = uploadedFiles[0];
      const arrayBuffer = await item.file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Parse range e.g. "1-3" or "2"
      const parts = splitRange.split('-').map((p) => parseInt(p.trim(), 10));
      let start = parts[0] ? parts[0] - 1 : 0;
      let end = parts[1] ? parts[1] - 1 : start;

      if (start < 0) start = 0;
      if (end >= totalPages) end = totalPages - 1;
      if (start > end) {
        addToast('error', 'Invalid page range specified.');
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const pageIndices = [];
      for (let i = start; i <= end; i++) {
        pageIndices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setProcessedDownloadUrl(url);
      setProcessedFileName(`split-pages-${start + 1}-to-${end + 1}.pdf`);
      setResultMessage(
        `Extracted pages ${start + 1} to ${end + 1} from total ${totalPages} pages.`
      );
      addToast('success', 'PDF split completed!');
      trackEvent('tool_complete', { tool_name: 'pdf-tools', subtool: 'split' });
    } catch (err: any) {
      addToast('error', 'Error splitting PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. PDF Page Extractor
  const executeExtract = async () => {
    if (uploadedFiles.length === 0) {
      addToast('error', 'Please upload a PDF document.');
      return;
    }

    setIsProcessing(true);
    try {
      const item = uploadedFiles[0];
      const arrayBuffer = await item.file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Parse comma separated list e.g. "1, 3, 5"
      const pagesToExtract = extractPagesInput
        .split(',')
        .map((p) => parseInt(p.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 1 && num <= totalPages)
        .map((p) => p - 1);

      if (pagesToExtract.length === 0) {
        addToast('error', `Please provide valid page numbers between 1 and ${totalPages}.`);
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(pdf, pagesToExtract);
      copied.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setProcessedDownloadUrl(url);
      setProcessedFileName(`extracted-pages.pdf`);
      setResultMessage(
        `Successfully extracted ${pagesToExtract.length} specific page(s) into a new PDF.`
      );
      addToast('success', 'Selected pages extracted!');
      trackEvent('tool_complete', { tool_name: 'pdf-tools', subtool: 'extract' });
    } catch (err: any) {
      addToast('error', 'Failed to extract pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Images to PDF
  const executeImagesToPdf = async () => {
    if (uploadedFiles.length === 0) {
      addToast('error', 'Please upload at least one image file (PNG or JPG).');
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of uploadedFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/jpeg' || item.file.name.toLowerCase().endsWith('.jpg') || item.file.name.toLowerCase().endsWith('.jpeg')) {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png' || item.file.name.toLowerCase().endsWith('.png')) {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Attempt canvas draw for WebP/others
          continue;
        }

        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setProcessedDownloadUrl(url);
      setProcessedFileName('converted-images.pdf');
      setResultMessage(
        `Converted ${uploadedFiles.length} image(s) into a high-resolution PDF document.`
      );
      addToast('success', 'Images converted to PDF successfully!');
      trackEvent('tool_complete', { tool_name: 'pdf-tools', subtool: 'images-to-pdf' });
    } catch (err: any) {
      addToast('error', 'Could not convert images to PDF. Ensure files are valid JPG or PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. PDF Compress (Stream Optimization)
  const executeCompress = async () => {
    if (uploadedFiles.length === 0) {
      addToast('error', 'Please upload a PDF document.');
      return;
    }

    setIsProcessing(true);
    try {
      const item = uploadedFiles[0];
      const arrayBuffer = await item.file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      // Re-encode and optimize internal streams
      const optimizedBytes = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([optimizedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const savings =
        item.size > blob.size
          ? Math.round(((item.size - blob.size) / item.size) * 100)
          : 0;

      setProcessedDownloadUrl(url);
      setProcessedFileName(`compressed-${item.name}`);
      setResultMessage(
        `PDF optimized! Original: ${formatFileSize(item.size)} → New: ${formatFileSize(
          blob.size
        )} (${savings}% size reduction).`
      );
      addToast('success', 'PDF optimization complete!');
      trackEvent('tool_complete', { tool_name: 'pdf-tools', subtool: 'compress' });
    } catch (err: any) {
      addToast('error', 'PDF compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = () => {
    if (activeSubTool === 'merge') executeMerge();
    else if (activeSubTool === 'split') executeSplit();
    else if (activeSubTool === 'extract') executeExtract();
    else if (activeSubTool === 'images-to-pdf') executeImagesToPdf();
    else if (activeSubTool === 'compress') executeCompress();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#06B6D4]/10 dark:bg-cyan-950/60 text-[#06B6D4] dark:text-cyan-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
                Browser PDF Tools Suite
              </h2>
              <p className="text-xs text-[#475569] dark:text-slate-400">
                Merge, split, extract, and convert PDF documents locally in your browser
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16A34A]/10 dark:bg-emerald-950/40 border border-[#16A34A]/30 dark:border-emerald-800/60 text-[#16A34A] dark:text-emerald-300 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-[#16A34A] shrink-0" />
            <span>Zero server upload. Processed in memory via WebAssembly.</span>
          </div>
        </div>

        {/* Sub-tools Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'merge', label: 'PDF Merge', icon: <FilePlus className="h-3.5 w-3.5" /> },
            { id: 'split', label: 'PDF Split', icon: <Scissors className="h-3.5 w-3.5" /> },
            { id: 'extract', label: 'Page Extractor', icon: <FileText className="h-3.5 w-3.5" /> },
            { id: 'images-to-pdf', label: 'Images to PDF', icon: <ImageIcon className="h-3.5 w-3.5" /> },
            { id: 'compress', label: 'PDF Compress', icon: <Minimize2 className="h-3.5 w-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTool(tab.id as PdfSubTool);
                clearAll();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTool === tab.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Working Panel */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
        
        {/* Upload Box */}
        <div
          role="button"
          tabIndex={0}
          aria-label={activeSubTool === 'images-to-pdf' ? 'Click to select JPG or PNG images' : 'Click to select PDF document'}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={activeSubTool === 'merge' || activeSubTool === 'images-to-pdf'}
            accept={activeSubTool === 'images-to-pdf' ? 'image/jpeg,image/png' : 'application/pdf'}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={handleFileUpload}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FilePlus className="h-6 w-6" />
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {activeSubTool === 'images-to-pdf'
                ? 'Click to select JPG or PNG images'
                : 'Click to select PDF document(s)'}
            </div>
            <p className="text-xs text-slate-400">
              Maximum file size: 50MB per file. Strictly browser-side memory.
            </p>
          </div>
        </div>

        {/* Dynamic Controls based on selected Sub-tool */}
        {activeSubTool === 'split' && uploadedFiles.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <label htmlFor="pdf-split-range" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Page Range to Split:
            </label>
            <div className="flex items-center gap-2 max-w-xs">
              <input
                id="pdf-split-range"
                name="splitRange"
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="e.g. 1-3 or 2"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 shrink-0">e.g. 1-3</span>
            </div>
          </div>
        )}

        {activeSubTool === 'extract' && uploadedFiles.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <label htmlFor="pdf-extract-pages" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Specific Page Numbers to Extract (comma-separated):
            </label>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                id="pdf-extract-pages"
                name="extractPages"
                type="text"
                value={extractPagesInput}
                onChange={(e) => setExtractPagesInput(e.target.value)}
                placeholder="e.g. 1, 3, 5"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <span className="text-xs text-slate-500 shrink-0">e.g. 1, 3, 5</span>
            </div>
          </div>
        )}

        {/* Selected Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-[#475569] dark:text-slate-400">
              <span>Selected Files ({uploadedFiles.length}):</span>
              <button
                onClick={clearAll}
                className="text-[#475569] hover:text-[#DC2626] cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uploadedFiles.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC]/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[#475569]">{idx + 1}.</span>
                    <span className="font-medium text-[#0F172A] dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                    <span className="font-mono text-[#475569]">
                      ({formatFileSize(item.size)})
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="text-[#475569] hover:text-[#DC2626] p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Execute Button */}
            <div className="pt-2">
              <button
                disabled={isProcessing}
                onClick={handleExecute}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? 'Processing in browser memory...'
                    : activeSubTool === 'merge'
                    ? 'Merge Selected PDFs'
                    : activeSubTool === 'split'
                    ? 'Split PDF Document'
                    : activeSubTool === 'extract'
                    ? 'Extract Specified Pages'
                    : activeSubTool === 'images-to-pdf'
                    ? 'Generate PDF from Images'
                    : 'Optimize & Compress PDF'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Processed Result & Download */}
        {processedDownloadUrl && (
          <div className="p-5 rounded-xl bg-[#16A34A]/10 dark:bg-emerald-950/40 border border-[#16A34A]/30 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#16A34A] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0F172A] dark:text-white">
                  Document Ready for Download
                </div>
                <div className="text-xs text-[#475569] dark:text-slate-400 mt-0.5">
                  {resultMessage}
                </div>
              </div>
            </div>

            <a
              href={processedDownloadUrl}
              download={processedFileName}
              onClick={() =>
                trackEvent('download', {
                  tool_name: 'pdf-tools',
                  subtool: activeSubTool,
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Download File</span>
            </a>
          </div>
        )}

      </div>

      {/* SEO & Educational Info */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Why Client-Side PDF Processing is More Secure
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Standard online PDF utilities require you to transmit sensitive financial statements, tax forms, identity scans, and employment records across public networks to remote web servers. AI Tools Hub leverages compiled JavaScript libraries directly in your browser. Your confidential information stays entirely on your physical machine.
        </p>
      </div>

    </div>
  );
};
