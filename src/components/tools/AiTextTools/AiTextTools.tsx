import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { requestAIGeneration } from '../../../services/aiService';
import { trackEvent } from '../../../utils/analytics';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Languages,
  Sliders,
  Send,
  PenTool,
  CheckCircle2,
  FileText,
  Mail,
  ListTree,
  Share2,
  ShoppingBag,
  Heading,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

type TextSubTool =
  | 'ai-writer'
  | 'text-rewriter'
  | 'grammar-improver'
  | 'summarizer'
  | 'email-writer'
  | 'blog-outline'
  | 'social-caption'
  | 'product-description'
  | 'title-generator';

export const AiTextTools: React.FC = () => {
  const { addToast, incrementAiUsage } = useApp();

  const [activeTool, setActiveTool] = useState<TextSubTool>('ai-writer');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [targetLength, setTargetLength] = useState('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [configErrorMessage, setConfigErrorMessage] = useState<string | null>(null);

  const subTools: { id: TextSubTool; label: string; icon: React.ReactNode; placeholder: string }[] = [
    {
      id: 'ai-writer',
      label: 'AI Writer',
      icon: <PenTool className="h-3.5 w-3.5" />,
      placeholder: 'Enter a topic, question, or drafting prompt (e.g., Explain the impact of edge computing on IoT devices)...',
    },
    {
      id: 'text-rewriter',
      label: 'Text Rewriter',
      icon: <Sparkles className="h-3.5 w-3.5" />,
      placeholder: 'Paste text here to rewrite it with enhanced fluency, flow, and clarity...',
    },
    {
      id: 'grammar-improver',
      label: 'Grammar Improver',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      placeholder: 'Paste sentences or paragraphs with grammatical errors, typos, or awkward phrasing...',
    },
    {
      id: 'summarizer',
      label: 'Summarizer',
      icon: <FileText className="h-3.5 w-3.5" />,
      placeholder: 'Paste long articles, transcripts, or meeting notes to extract concise bullet summaries...',
    },
    {
      id: 'email-writer',
      label: 'Email Writer',
      icon: <Mail className="h-3.5 w-3.5" />,
      placeholder: 'Specify your email recipient, context, and core message (e.g., Decline a vendor proposal politely while keeping relationships open)...',
    },
    {
      id: 'blog-outline',
      label: 'Blog Outline Generator',
      icon: <ListTree className="h-3.5 w-3.5" />,
      placeholder: 'Enter a blog article concept or target keyword (e.g., Complete guide to remote team management)...',
    },
    {
      id: 'social-caption',
      label: 'Social Media Caption',
      icon: <Share2 className="h-3.5 w-3.5" />,
      placeholder: 'Describe your product launch, photo, or company announcement for social media...',
    },
    {
      id: 'product-description',
      label: 'Product Description',
      icon: <ShoppingBag className="h-3.5 w-3.5" />,
      placeholder: 'List key features, specs, and benefits of your product for an e-commerce store...',
    },
    {
      id: 'title-generator',
      label: 'Title Generator',
      icon: <Heading className="h-3.5 w-3.5" />,
      placeholder: 'Enter a topic or content overview to generate 5-10 clickable, SEO-friendly headlines...',
    },
  ];

  const currentToolConfig = subTools.find((t) => t.id === activeTool)!;

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      addToast('error', 'Please enter some text or context before generating.');
      return;
    }

    const allowed = incrementAiUsage();
    if (!allowed) return;

    setIsLoading(true);
    setConfigErrorMessage(null);

    const systemInstruction = `You are an elite copywriting assistant for AI Tools Hub.
Mode: ${currentToolConfig.label}
Selected Tone: ${tone}
Target Language: ${language}
Target Output Length: ${targetLength}

Produce high-quality, authentic, beautifully structured output directly matching the requested mode. Do not include conversational chit-chat like "Here is your output:". Output directly.`;

    const prompt = `Task: ${currentToolConfig.label}
Input Content:
"""
${inputText.trim()}
"""
Tone: ${tone}
Language: ${language}
Length: ${targetLength}`;

    const res = await requestAIGeneration({
      prompt,
      systemInstruction,
      toolType: activeTool,
    });

    setIsLoading(false);

    if (res.success && res.result) {
      setOutputText(res.result.trim());
      addToast('success', 'AI Generation completed!');
      trackEvent('tool_complete', { tool_name: 'ai-text-tools', mode: activeTool });
    } else if (res.isConfigError) {
      setConfigErrorMessage(
        res.message ||
          'The AI backend requires a GEMINI_API_KEY. Configure it in server environment variables or AI Studio Secrets.'
      );
      addToast('info', 'AI backend requires GEMINI_API_KEY configuration.');
    } else {
      addToast('error', res.message || 'Generation failed. Please try again.');
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    addToast('success', 'Copied generated text to clipboard!');
    setTimeout(() => setCopied(false), 2000);
    trackEvent('copy', { tool_name: 'ai-text-tools' });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setConfigErrorMessage(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Tool Header */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                AI Text & Copywriting Suite
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                9 specialized writing tools with tone, length, and multilingual adaptation
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tools Navigation */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap gap-2">
          {subTools.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTool(tab.id);
                setConfigErrorMessage(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTool === tab.id
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

      {/* Parameter Control Bar */}
      <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Tone Selector */}
          <div>
            <label htmlFor="ai-tone-select" className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
              Tone of Voice
            </label>
            <select
              id="ai-tone-select"
              name="aiTone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC]/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="Professional">Professional (Formal & Authoritative)</option>
              <option value="Casual">Casual (Conversational & Relaxed)</option>
              <option value="Persuasive">Persuasive (Sales & High-Converting)</option>
              <option value="Friendly">Friendly (Warm & Approachable)</option>
              <option value="Witty">Witty (Engaging & Clever)</option>
              <option value="Academic">Academic (Rigorous & Scholarly)</option>
            </select>
          </div>

          {/* Language Selector */}
          <div>
            <label htmlFor="ai-lang-select" className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
              Output Language
            </label>
            <select
              id="ai-lang-select"
              name="aiLanguage"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC]/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu (اردو)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Arabic">Arabic (العربية)</option>
            </select>
          </div>

          {/* Length Selector */}
          <div>
            <label htmlFor="ai-length-select" className="block text-xs font-semibold text-[#0F172A] dark:text-slate-300 mb-1">
              Target Length
            </label>
            <select
              id="ai-length-select"
              name="aiTargetLength"
              value={targetLength}
              onChange={(e) => setTargetLength(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC]/50 dark:bg-slate-800/50 px-3 py-2 text-xs text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="Short">Short (1-2 sentences / Quick bullet)</option>
              <option value="Medium">Medium (Balanced 1-2 paragraphs)</option>
              <option value="Long">Long (Detailed & comprehensive)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Dual Editor: Input on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Input Box */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
            <label htmlFor="ai-input-text" className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300 cursor-pointer">
              Input Context ({currentToolConfig.label})
            </label>
            <span className="text-[11px] font-mono text-[#475569]">
              {inputText.length} characters · {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            id="ai-input-text"
            name="aiInputText"
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={currentToolConfig.placeholder}
            className="w-full rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC]/50 dark:bg-slate-800/50 p-4 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              className="text-xs text-[#475569] hover:text-[#DC2626] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>

            <button
              disabled={isLoading || !inputText.trim()}
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isLoading ? 'Generating with AI...' : 'Generate Copy'}</span>
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-[#FFFFFF] dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-slate-300">
              Generated Result
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#475569]">
                {outputText.length} characters · {outputText.trim() ? outputText.trim().split(/\s+/).length : 0} words
              </span>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F8FAFC] dark:bg-slate-800 hover:bg-slate-200 border border-[#E2E8F0] dark:border-slate-700 text-xs font-semibold text-[#0F172A] dark:text-slate-200 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Config Error Message if GEMINI_API_KEY is not supplied */}
          {configErrorMessage && (
            <div className="p-4 rounded-xl bg-[#F59E0B]/10 dark:bg-amber-950/40 border border-[#F59E0B]/30 dark:border-amber-800/60 text-xs text-[#F59E0B] dark:text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4 text-[#F59E0B]" />
                <span>AI Backend Configuration Notice</span>
              </div>
              <p className="leading-relaxed text-[#475569] dark:text-slate-300">
                {configErrorMessage}
              </p>
              <div className="text-[11px] text-[#B45309] dark:text-amber-400 font-mono bg-[#F59E0B]/15 dark:bg-amber-900/40 p-2 rounded">
                Add GEMINI_API_KEY in your AI Studio Secrets or server environment (.env).
              </div>
            </div>
          )}

          <div
            className={`min-h-[240px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 p-4 text-xs text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap font-sans ${
              !outputText && !isLoading ? 'flex items-center justify-center text-slate-400' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 w-full">
                <Sparkles className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="text-xs text-slate-500">Generating in {language} with {tone} tone...</span>
              </div>
            ) : outputText ? (
              outputText
            ) : (
              'Generated copy will appear here. Choose your tone, length, and click Generate.'
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
