import { ToolItem } from '../types';

export const TOOLS_LIST: ToolItem[] = [
  {
    id: 'ai-resume-maker',
    name: 'AI Resume Maker',
    slug: 'ai-resume-maker',
    tagline: 'Build ATS-compliant, professional resumes with AI assistance',
    description: 'Create tailored resumes with live preview, multiple career templates, ATS score optimization, and one-click PDF export.',
    category: 'ai',
    iconName: 'FileText',
    badge: 'Free',
    popular: true,
    featured: true,
    metaTitle: 'Free AI Resume Maker – ATS Resume Builder Online | AI Tools Hub',
    metaDescription: 'Build professional, ATS-friendly resumes in minutes with AI suggestions. Export directly to print or PDF without watermarks.',
    features: [
      'Live real-time preview',
      '4 customizable templates (Modern, Professional, Simple, ATS)',
      'AI summary & bullet point enhancer',
      'Print & PDF download',
      '100% private local storage persistence'
    ]
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    tagline: 'Lossless & high-ratio browser image compression',
    description: 'Compress JPG, PNG, and WebP files up to 90% directly in your browser without uploading your photos to third-party servers.',
    category: 'image',
    iconName: 'Image',
    badge: 'Free',
    popular: true,
    featured: true,
    metaTitle: 'Online Image Compressor – Reduce JPG, PNG, WebP Size Free | AI Tools Hub',
    metaDescription: 'Compress images securely in your browser. Reduce file size without visual quality degradation. Zero uploads, 100% private.',
    features: [
      'Client-side HTML5 canvas compression',
      'Adjustable quality & dimension controls',
      'Side-by-side zoom & comparison',
      'Batch compression & download',
      'Supports JPG, PNG, and WebP'
    ]
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    slug: 'pdf-tools',
    tagline: 'Merge, split, extract, and convert PDF documents in browser',
    description: 'Fast, secure PDF manipulation suite. Merge multiple files, extract pages, split documents, and turn photos into PDFs without external server uploads.',
    category: 'pdf',
    iconName: 'Layers',
    badge: 'Free',
    popular: true,
    featured: true,
    metaTitle: 'Free Online PDF Tools – Merge, Split & Convert PDFs | AI Tools Hub',
    metaDescription: 'Manage your PDF workflows completely in your browser. Merge documents, split ranges, extract pages, and create PDFs with zero privacy leakage.',
    features: [
      'PDF Merge (Multi-file combiner)',
      'PDF Split & Page Extractor',
      'Images to PDF converter',
      'Client-side PDF-Lib engine',
      'Strict file size validation & security'
    ]
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    tagline: 'Generate high-resolution custom & scannable QR codes',
    description: 'Generate customizable QR codes for websites, plain text, Wi-Fi networks, vCards, emails, phone numbers, and WhatsApp messages with vector SVG and PNG downloads.',
    category: 'productivity',
    iconName: 'QrCode',
    badge: 'Free',
    popular: true,
    featured: true,
    metaTitle: 'Free QR Code Generator – Custom Colors, PNG & SVG | AI Tools Hub',
    metaDescription: 'Create scannable custom QR codes with custom foreground/background colors and high error correction. Download PNG or SVG for print and digital use.',
    features: [
      'Multi-type support (URL, Wi-Fi, Phone, WhatsApp, Email, Text)',
      'Custom color pickers & contrast protection',
      'High-resolution PNG and crisp SVG export',
      'Configurable error correction levels (L, M, Q, H)',
      'Instant live preview and scanner verification'
    ]
  },
  {
    id: 'ai-text-tools',
    name: 'AI Text Tools',
    slug: 'ai-text-tools',
    tagline: 'Smart writing assistant, rewriter, summarizer & copy generator',
    description: 'Accelerate your content workflow with 9 specialized writing modes: email composer, grammar improver, blog outline generator, text summarizer, and product description writer.',
    category: 'ai',
    iconName: 'Sparkles',
    badge: 'Free',
    popular: true,
    featured: true,
    metaTitle: 'AI Text Tools & Writing Assistant – Free Copywriter Online | AI Tools Hub',
    metaDescription: 'Free AI-powered text rewriter, grammar fixer, summarizer, and copy generator with multi-language and tone customization.',
    features: [
      '9 specialized AI copywriting modes',
      '6 tone adjustments (Professional, Casual, Persuasive, etc.)',
      'Multilingual support (English, Urdu, Spanish, French, German, Arabic)',
      'Length & creativity controls',
      'One-click clipboard copy & word metrics'
    ]
  }
];

export const POPULAR_TOOLS = TOOLS_LIST.filter(t => t.popular);
export const FEATURED_TOOLS = TOOLS_LIST.filter(t => t.featured);
