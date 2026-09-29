import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Secure Server-side AI generation proxy
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, toolType } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: 'API_KEY_NOT_CONFIGURED',
        message: 'The AI service requires a GEMINI_API_KEY. Configure it in the server environment or AI Studio Secrets to enable live AI generations.',
        fallbackSuggestion: 'You can continue editing and using all other browser tools (Image Compression, PDF Tools, QR Generator, and Resume Builder) without an API key.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Choose the fast, cost-effective standard model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are an expert AI copywriting and resume specialist for AI Tools Hub. Provide crisp, professional, high-impact output.',
        temperature: 0.7,
      },
    });

    const outputText = response.text || '';
    return res.json({
      success: true,
      result: outputText,
      toolType: toolType || 'ai-tools'
    });
  } catch (error: any) {
    console.error('Gemini API Server Error:', error);
    return res.status(500).json({
      error: 'AI_PROCESSING_ERROR',
      message: error?.message || 'An error occurred while generating AI content. Please verify your connection and API quota.'
    });
  }
});

// Dynamic robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${process.env.APP_URL || 'https://aitoolshub.io'}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://aitoolshub.io';
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/tools/ai-resume-maker', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/image-compressor', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/pdf-tools', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/qr-code-generator', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/ai-text-tools', priority: '0.9', changefreq: 'weekly' },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog/how-to-create-a-professional-resume-online', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/how-to-compress-images-without-losing-quality', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/how-to-create-a-qr-code', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/best-ways-to-reduce-pdf-file-size', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/how-ai-writing-tools-improve-productivity', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.4', changefreq: 'yearly' },
    { url: '/terms', priority: '0.4', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.4', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.4', changefreq: 'yearly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
