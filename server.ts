import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// NotebookLM Grounded Chat Endpoint
app.post('/api/notebooklm/chat', async (req, res) => {
  try {
    const { query, sources, lang } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured on server' });
    }

    const sourcesContext = (sources || [])
      .map((s: any, idx: number) => `### Source [${idx + 1}]: ${s.title}\n${s.content}`)
      .join('\n\n');

    const isArabic = lang === 'ar';
    const systemInstruction = `You are Google NotebookLM, a personalized AI research assistant grounded strictly in the user's provided sources.
CRITICAL RULES:
1. Answer ONLY using the information contained in the provided sources. Do not assume or fabricate facts.
2. Embed citation markers like [1], [2], [3] immediately following statements that derive from Source [1], Source [2], etc.
3. If the answer cannot be found in the sources, state clearly that the provided documents do not contain that information.
4. Reply in ${isArabic ? 'fluent Modern Standard Arabic' : lang === 'fr' ? 'French' : 'English'}.`;

    const prompt = `Here are the sources provided by the user:\n\n${sourcesContext}\n\nUser Question:\n${query}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const text = response.text || '';

    // Extract citation refs from text
    const citations: Array<{ citationId: number; sourceId: string; sourceTitle: string; quote: string }> = [];
    (sources || []).forEach((s: any, idx: number) => {
      const cId = idx + 1;
      if (text.includes(`[${cId}]`)) {
        citations.push({
          citationId: cId,
          sourceId: s.id || `src-${cId}`,
          sourceTitle: s.title || `المصدر [${cId}]`,
          quote: s.content ? s.content.slice(0, 220) + '...' : '',
        });
      }
    });

    res.json({
      content: text,
      citations,
      suggestedQuestions: isArabic
        ? [
            'لخص النقاط الجوهرية لهذه المصادر',
            'ما هي أوجه الاختلاف أو المقارنة بين الوثائق؟',
            'استخرج الخطوات العملية الممكن تطبيقها مباشرة',
          ]
        : [
            'Summarize the core insights of these sources',
            'Compare key arguments across documents',
            'What actionable next steps can be taken?',
          ],
    });
  } catch (error: any) {
    console.error('NotebookLM Chat Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// NotebookLM Audio Overview Podcast Script Endpoint
app.post('/api/notebooklm/audio-overview', async (req, res) => {
  try {
    const { sources, lang } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured on server' });
    }

    const sourcesContext = (sources || [])
      .map((s: any, idx: number) => `### Source [${idx + 1}]: ${s.title}\n${s.content}`)
      .join('\n\n');

    const prompt = `Generate a lively, engaging Deep Dive podcast conversation between two AI hosts (Host 1: Ahmed / Host 2: Sarah in Arabic, or Alex & Sarah in English) discussing these sources:\n\n${sourcesContext}\n\nFormat strictly as JSON with keys: id, title, summary, durationSeconds, hosts: { host1, host2 }, turns: Array<{ id, speaker: 'host1'|'host2', speakerName, text, durationSeconds, startSeconds, endSeconds }>.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Audio Overview Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware integration in Dev / Static serving in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
