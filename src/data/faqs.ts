import { FAQItem } from '../types';

export const FAQS_LIST: FAQItem[] = [
  {
    category: 'general',
    question: 'Are the tools on AI Tools Hub really free to use?',
    answer: 'Yes! All core online utilities—including Image Compressor, PDF Tools, QR Code Generator, and Resume Maker—are completely free with generous daily usage allowances. We offer an optional Pro upgrade for advanced limits, premium templates, and elevated AI quotas.'
  },
  {
    category: 'privacy',
    question: 'Are my uploaded images and PDF documents private?',
    answer: 'Yes. Where technically possible, our utilities (like Image Compression, PDF Merging/Splitting, and QR Code generation) process files entirely on your device inside your web browser via HTML5 Canvas and WebAssembly. Your files are not uploaded, stored, or reviewed on our servers.'
  },
  {
    category: 'tools',
    question: 'Can I download my resume as a PDF?',
    answer: 'Yes! You can preview your resume live in four different ATS-compliant templates and instantly download it as a print-ready PDF document without any third-party watermarks or branding.'
  },
  {
    category: 'tools',
    question: 'Will the generated QR codes expire?',
    answer: 'No. The QR codes you generate on AI Tools Hub are static barcodes that encode your data directly into the matrix. They will never expire and can be scanned indefinitely.'
  },
  {
    category: 'privacy',
    question: 'Do you sell or share my resume or text data?',
    answer: 'No. Your resume information is saved strictly to your local browser storage (localStorage) so you can resume editing later. We never sell, harvest, or aggregate user data.'
  },
  {
    category: 'pricing',
    question: 'How do Pro subscriptions and billing work?',
    answer: 'The Pro tier is designed for power users who need high-volume AI copywriting generations, specialized ATS resume templates, and an ad-free interface. We support standard flexible billing with month-to-month cancellation.'
  }
];
