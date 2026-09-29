# AI Tools Hub 🚀
> **Smart AI & Online Tools, All in One Place.**

A modern, fast, mobile-first productivity platform featuring browser-based document and media tools, ATS resume engineering, and an AI assistance layer designed for organic Google search traffic and sustainable monetization.

---

## 🛠️ Included Core Tools

1. **AI Resume Maker (`/tools/ai-resume-maker`)**
   - Live document preview with 4 ATS-compliant templates (*Modern*, *Professional*, *Simple*, *ATS*).
   - Local persistence via browser storage with zero privacy leakage.
   - Built-in AI generation for summaries, experience action bullets, and skills.
   - 1-click PDF download & print.

2. **Client-Side Image Compressor (`/tools/image-compressor`)**
   - 100% private in-browser HTML5 Canvas processing (zero remote file upload).
   - Supports JPG, PNG, and WebP formats.
   - Configurable quality and max-dimension resizing.
   - Batch compression and bulk download.

3. **PDF Tools Suite (`/tools/pdf-tools`)**
   - **PDF Merge:** Combine multiple PDFs into a single file in memory.
   - **PDF Split:** Extract customized page ranges (e.g., pages 1–3).
   - **PDF Page Extractor:** Extract chosen non-contiguous pages (e.g., 1, 3, 5).
   - **Images to PDF:** Turn multiple JPG or PNG images into a print-ready PDF.
   - **PDF Compress:** Stream-level optimization to reduce file weight.
   - Strict 50MB file size limit to prevent browser memory crashes.

4. **QR Code Generator (`/tools/qr-code-generator`)**
   - Real-time scannable barcode generator for URLs, Wi-Fi passwords, Emails, Phones, WhatsApp, and Plain Text.
   - Custom foreground/background color pickers with contrast safety.
   - High-resolution PNG and scalable vector SVG downloads.
   - Configurable Reed-Solomon error correction levels (L, M, Q, H).

5. **AI Text Tools (`/tools/ai-text-tools`)**
   - 9 specialized copywriting modes: *AI Writer*, *Text Rewriter*, *Grammar Improver*, *Summarizer*, *Email Writer*, *Blog Outliner*, *Social Media Caption*, *Product Description*, and *Title Generator*.
   - 6 tone selections (Professional, Casual, Persuasive, Friendly, Witty, Academic).
   - Multilingual support for English, Urdu, Spanish, French, German, and Arabic.

---

## 🏗️ Architecture & Security Principles

- **Security First:** Secret API keys are **never** exposed in client-side code. All AI generations route through the Express proxy backend (`/api/ai/generate`).
- **Data Privacy:** File processing (images, PDFs, QR codes) takes place strictly inside the user's browser memory.
- **SEO Ready:** Technical SEO with unique titles, meta descriptions, canonical URLs, OpenGraph cards, Twitter cards, dynamic `sitemap.xml`, `robots.txt`, and Schema.org structured data (`WebApplication`, `Organization`, `Article`, `FAQPage`).
- **Responsive & Accessible:** Dark mode, light mode, and system preference with full WCAG contrast standards.

---

## 💻 Local Installation & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your environment variables in `.env`:
```ini
# Required for AI generation features
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Base URL of the deployment
APP_URL="http://localhost:3000"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📈 Search Console & Google Analytics Integration

### Google Search Console
1. Add your property in [Google Search Console](https://search.google.com/search-console).
2. Verify domain ownership using DNS or HTML tag in `index.html`.
3. Submit your sitemap: `https://your-domain.com/sitemap.xml`.

### Google Analytics 4 (GA4)
Add your GA4 tag into `/index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
Pre-instrumented events: `tool_open`, `tool_complete`, `download`, `copy`, `pricing_view`, `pro_cta_click`.

---

## 💰 Monetization & Google AdSense Setup

1. Sign up for [Google AdSense](https://adsense.google.com/).
2. Place your Publisher script in `index.html`.
3. Update your publisher ID and ad slot IDs in `src/components/common/AdBanner.tsx` or through the interactive dashboard at `/admin/config`.
4. Users subscribed to Pro or Business tiers automatically enjoy an ad-free interface.

---

## 📣 Marketing & Social Media Strategy

Use the following curated hashtags when promoting AI Tools Hub articles and tool launches across LinkedIn, X/Twitter, Instagram, and TikTok:

```
#AITools #AIToolsHub #FreeAITools #AIOnlineTools #OnlineTools #AIResumeMaker #ResumeMaker #PDFTools #PDFToolsOnline #ImageCompressor #QRGenerator #AIWritingTools #ProductivityTools #FreeTools #OnlineToolsFree #TechTools #AITechnology #ArtificialIntelligence #SaaSTools #WebTools #DigitalTools #SEO #OnlineBusiness #Productivity #2027Tech
```

---

## 📄 License
© 2027 AI Tools Hub. Apache-2.0 License.
