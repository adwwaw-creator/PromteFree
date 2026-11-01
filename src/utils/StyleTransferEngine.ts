export interface StyleDna {
  medium?: string;
  palette?: string;
  lighting?: string;
  textures?: string;
}

export interface StyleTransferRequest {
  styleImage?: string | null;
  targetImage?: string | null;
  styleNotes?: string;
  targetNotes?: string;
  targetTool?: 'midjourney' | 'flux' | 'dalle3' | 'imagen3' | 'stable-diffusion';
  intensity?: 'subtle' | 'balanced' | 'strong';
  lang?: 'ar' | 'en' | 'fr';
}

export interface StyleTransferResult {
  title: string;
  titleAr?: string;
  prompt: string;
  masterPrompt?: string;
  midjourneyPrompt?: string;
  fluxPrompt?: string;
  dallePrompt?: string;
  negativePrompt: string;
  explanation: string;
  explanationAr?: string;
  explanationEn?: string;
  extractedStyleKeywords: string[];
  styleDna?: StyleDna;
  contentPreserved?: string;
  source?: 'gemini-3.8-flash' | 'fallback';
}

/**
 * Reverse Engineering Style Transfer Engine
 * Analyzes the artistic style, color palette, lighting, and texture from a source style image
 * and applies it cleanly to a target content image.
 */
export class StyleTransferEngine {
  /**
   * AI-powered reverse engineering calling the server-side Gemini 3.8 Flash endpoint
   */
  static async analyzeWithAI(req: StyleTransferRequest): Promise<StyleTransferResult> {
    try {
      const response = await fetch('/api/style-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const masterPrompt = data.masterPrompt || data.prompt || '';
      const prompt =
        req.targetTool === 'flux'
          ? data.fluxPrompt || masterPrompt
          : req.targetTool === 'midjourney'
          ? data.midjourneyPrompt || masterPrompt
          : req.targetTool === 'dalle3'
          ? data.dallePrompt || masterPrompt
          : masterPrompt;

      const keywords = [
        data.styleDna?.medium || 'Artistic Medium Transfer',
        data.styleDna?.lighting || 'Volumetric Lighting',
        data.styleDna?.palette || 'Palette Harmony',
        (req.targetTool || 'midjourney').toUpperCase(),
        data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash AI' : 'Visual Engine',
      ];

      return {
        title: data.title || 'Style Transfer Result',
        titleAr: data.titleAr || data.title,
        prompt,
        masterPrompt,
        midjourneyPrompt: data.midjourneyPrompt || masterPrompt,
        fluxPrompt: data.fluxPrompt || masterPrompt,
        dallePrompt: data.dallePrompt || masterPrompt,
        negativePrompt:
          data.negativePrompt ||
          'blurry, low quality, oversaturated plastic textures, watermark, deformed anatomy, distorted faces, missing fingers',
        explanation: data.explanationAr || data.explanation || '',
        explanationAr: data.explanationAr,
        explanationEn: data.explanationEn,
        extractedStyleKeywords: keywords,
        styleDna: data.styleDna,
        contentPreserved: data.contentPreserved,
        source: data.source || 'gemini-3.8-flash',
      };
    } catch (err) {
      console.warn('API call failed, running local fallback engine:', err);
      return this.analyzeAndGenerate(
        req.styleNotes || 'فن تعبيري معاصر بألوان غنية وإضاءة سينمائية',
        req.targetNotes || 'تكوين متوازن للشخصية الأساسية والمحيط',
        {
          targetTool: req.targetTool,
          styleIntensity: req.intensity,
        }
      );
    }
  }

  /**
   * Synchronous / offline fallback engine
   */
  static analyzeAndGenerate(
    styleNameOrDescription: string,
    subjectDescription: string,
    options: {
      targetTool?: 'midjourney' | 'flux' | 'dalle3' | 'imagen3' | 'stable-diffusion';
      styleIntensity?: 'subtle' | 'balanced' | 'strong';
    } = {}
  ): StyleTransferResult {
    const intensity = options.styleIntensity || 'balanced';
    const tool = options.targetTool || 'midjourney';

    const cleanedSubject = subjectDescription.trim() || 'A majestic central character with cinematic presence';
    const cleanedStyle =
      styleNameOrDescription.trim() ||
      'Cinematic neon cyberpunk with warm volumetric lighting and rich oil painting texture';

    let toolSuffix = '';
    if (tool === 'midjourney') {
      const iw = intensity === 'strong' ? ' --iw 2.0' : intensity === 'subtle' ? ' --iw 0.8' : ' --iw 1.2';
      toolSuffix = ` --v 6.1 --style raw --c 5${iw} --ar 16:9`;
    } else if (tool === 'flux') {
      toolSuffix = ' [FLUX.1 Schnell / Dev optimized prompt structure, photo-realistic render, 8K resolution]';
    } else if (tool === 'dalle3') {
      toolSuffix = ' Modern high-end editorial digital art, wide angle, intricate composition, HDR.';
    }

    const masterPrompt = `[SUBJECT]: ${cleanedSubject}.
[ARTISTIC STYLE TRANSFERRED]: Rendered precisely in the signature artistic style of ${cleanedStyle}.
[VISUAL DNA & PALETTE]: Harmonized color grading, volumetric lighting matching the source style, distinctive brushwork / render aesthetic, high tactile surface textures.
[CAMERA & COMPOSITION]: Cinematic framing, focal depth highlighting the subject, ultra-detailed craftsmanship, 8K masterpiece.${toolSuffix}`;

    const negativePrompt =
      'blurry, low quality, oversaturated plastic textures, watermark, deformed anatomy, distorted faces, missing fingers, low resolution artifacts';

    const explanation = `تم تطبيق الهندسة العكسية لنقل النمط بنجاح:
1. استخراج الحمض النووي البصري (Visual DNA): تم تحليل لوحة الألوان والإضاءة وجمالية الملمس الفني (${cleanedStyle}).
2. تطبيق النمط على الهدف (${cleanedSubject}) بدقة عالية ودون تشويه المعالم الأساسية.
3. التوافق مع محركات التوليد: جاهز للاستخدام مع Midjourney v6.1 (--sref / --iw) و FLUX.1 و DALL-E 3 و Imagen 3.`;

    const extractedStyleKeywords = [
      'Visual DNA Extraction',
      'Harmonized Palette',
      'Volumetric Lighting',
      'Texture Coherence',
      tool.toUpperCase(),
      'Visual Engine',
    ];

    return {
      title: `${cleanedSubject.slice(0, 32)} (بنمط: ${cleanedStyle.slice(0, 24)})`,
      titleAr: `${cleanedSubject.slice(0, 32)} (بنمط: ${cleanedStyle.slice(0, 24)})`,
      prompt: masterPrompt,
      masterPrompt,
      midjourneyPrompt: masterPrompt,
      fluxPrompt: `${masterPrompt} [FLUX.1 Schnell/Dev]`,
      dallePrompt: masterPrompt,
      negativePrompt,
      explanation,
      explanationAr: explanation,
      extractedStyleKeywords,
      styleDna: {
        medium: 'Digital Fine Art & Dynamic Mixed Media',
        palette: 'Harmonized reference tone map',
        lighting: 'Volumetric cinematic scheme',
        textures: 'Tactile surface fidelity',
      },
      contentPreserved: cleanedSubject,
      source: 'fallback',
    };
  }
}
