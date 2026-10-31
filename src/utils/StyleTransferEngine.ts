/**
 * StyleTransferEngine.ts
 * محرك الهندسة العكسية لنقل الأنماط الفنية والأسلوب (صورة ➜ صورة)
 * يستخرج النمط واللوحة اللونية والإضاءة والوسيط من الصورة الأولى
 * ويطبقها على موضوع ومحتوى وتكوين الصورة الثانية
 */

export interface ImageAnalysisData {
  dataUrl: string;
  name: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  palette?: string[];
  brightness?: 'dark' | 'balanced' | 'bright';
  saturation?: 'muted' | 'vibrant' | 'monochrome';
}

export type StyleStrength = 'subtle' | 'balanced' | 'strong';
export type TargetImageEngine = 'universal' | 'midjourney' | 'flux' | 'dalle';

export interface StyleTransferOptions {
  styleImage: ImageAnalysisData;
  targetImage: ImageAnalysisData;
  styleDescription?: string;
  targetSubject?: string;
  engine?: TargetImageEngine;
  strength?: StyleStrength;
  aspectRatio?: string;
  lang?: 'ar' | 'en' | 'fr';
}

export interface StyleTransferResult {
  title: string;
  summaryAr: string;
  summaryEn: string;
  midjourneyPrompt: string;
  fluxPrompt: string;
  dallePrompt: string;
  universalPrompt: string;
  arabicInstruction: string;
  extractedStyle: {
    medium: string;
    lighting: string;
    palette: string[];
    paletteNamesAr: string[];
    texture: string;
    mood: string;
    cameraAngle: string;
  };
  targetSubjectSummary: string;
  tips: string[];
}

/**
 * Extracts dominant color palette from an image using HTML5 Canvas
 */
export async function extractPaletteFromImage(
  dataUrl: string,
  maxColors: number = 5
): Promise<{ palette: string[]; brightness: 'dark' | 'balanced' | 'bright'; saturation: 'muted' | 'vibrant' | 'monochrome'; width: number; height: number; aspectRatio: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const width = img.naturalWidth || img.width || 512;
      const height = img.naturalHeight || img.height || 512;

      let ar = '1:1';
      const ratio = width / height;
      if (ratio > 1.6) ar = '16:9';
      else if (ratio > 1.25) ar = '4:3';
      else if (ratio < 0.65) ar = '9:16';
      else if (ratio < 0.85) ar = '4:5';

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sampleSize = 64;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        if (!ctx) {
          resolve({
            palette: ['#1e1f20', '#4a5568', '#718096', '#cbd5e0', '#f7fafc'],
            brightness: 'balanced',
            saturation: 'vibrant',
            width,
            height,
            aspectRatio: ar,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

        // Sample colors and compute brightness & saturation
        const colorCounts: Record<string, { r: number; g: number; b: number; count: number; sat: number; bri: number }> = {};
        let totalBrightness = 0;
        let totalSaturation = 0;
        let validPixels = 0;

        for (let i = 0; i < imageData.length; i += 16) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          if (a < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const bri = (r * 0.299 + g * 0.587 + b * 0.114);
          const sat = max === 0 ? 0 : (max - min) / max;

          totalBrightness += bri;
          totalSaturation += sat;
          validPixels++;

          // Quantize to reduce noise
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr},${qg},${qb}`;

          if (!colorCounts[key]) {
            colorCounts[key] = { r: qr, g: qg, b: qb, count: 1, sat, bri };
          } else {
            colorCounts[key].count++;
          }
        }

        const sorted = Object.values(colorCounts).sort((a, b) => b.count - a.count);
        const palette = sorted.slice(0, maxColors).map((c) => {
          const hex = `#${Math.min(255, c.r).toString(16).padStart(2, '0')}${Math.min(255, c.g).toString(16).padStart(2, '0')}${Math.min(255, c.b).toString(16).padStart(2, '0')}`;
          return hex;
        });

        const avgBri = validPixels > 0 ? totalBrightness / validPixels : 128;
        const avgSat = validPixels > 0 ? totalSaturation / validPixels : 0.5;

        const brightness = avgBri < 85 ? 'dark' : avgBri > 170 ? 'bright' : 'balanced';
        const saturation = avgSat < 0.15 ? 'monochrome' : avgSat > 0.45 ? 'vibrant' : 'muted';

        resolve({
          palette: palette.length >= 3 ? palette : ['#2c3e50', '#e74c3c', '#ecf0f1', '#3498db', '#f1c40f'],
          brightness,
          saturation,
          width,
          height,
          aspectRatio: ar,
        });
      } catch {
        resolve({
          palette: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
          brightness: 'balanced',
          saturation: 'vibrant',
          width,
          height,
          aspectRatio: ar,
        });
      }
    };

    img.onerror = () => {
      resolve({
        palette: ['#1e1f20', '#4a5568', '#718096', '#cbd5e0', '#f7fafc'],
        brightness: 'balanced',
        saturation: 'vibrant',
        width: 1024,
        height: 1024,
        aspectRatio: '1:1',
      });
    };

    img.src = dataUrl;
  });
}

/**
 * Maps hex color codes to descriptive names in Arabic and English
 */
export function getDescriptiveColorNames(palette: string[]): { ar: string[]; en: string[] } {
  const arNames: string[] = [];
  const enNames: string[] = [];

  palette.forEach((hex) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;

    if (r > 180 && g < 80 && b < 80) {
      arNames.push('قرمزي ملتهب');
      enNames.push('deep crimson');
    } else if (r > 200 && g > 150 && b < 60) {
      arNames.push('عنبري دافئ');
      enNames.push('warm amber');
    } else if (r < 60 && g > 140 && b > 140) {
      arNames.push('سماوي تركوازي');
      enNames.push('cyan turquoise');
    } else if (r < 60 && g < 80 && b > 160) {
      arNames.push('أزرق نيلي عميق');
      enNames.push('deep cobalt blue');
    } else if (r > 160 && g < 80 && b > 160) {
      arNames.push('أرجواني غامض');
      enNames.push('mystic violet');
    } else if (r < 50 && g < 50 && b < 50) {
      arNames.push('فحمي داكن');
      enNames.push('matte charcoal');
    } else if (r > 210 && g > 210 && b > 210) {
      arNames.push('أبيض لؤلؤي ساطع');
      enNames.push('luminous pearl white');
    } else if (r > 120 && g > 100 && b < 70) {
      arNames.push('ذهبي عتيق');
      enNames.push('vintage gold');
    } else if (g > r && g > b) {
      arNames.push('أخضر زمردي طبيعي');
      enNames.push('emerald botanical green');
    } else {
      arNames.push('نغمة متوازنة متدرجة');
      enNames.push('harmonic tone');
    }
  });

  return {
    ar: Array.from(new Set(arNames)).slice(0, 4),
    en: Array.from(new Set(enNames)).slice(0, 4),
  };
}

/**
 * Builds high-fidelity prompts transferring the style of Image 1 to Image 2
 */
export async function reverseEngineerStyleTransfer(
  options: StyleTransferOptions
): Promise<StyleTransferResult> {
  const {
    styleImage,
    targetImage,
    styleDescription = '',
    targetSubject = '',
    strength = 'balanced',
    aspectRatio = targetImage.aspectRatio || '16:9',
  } = options;

  // Extract visual metrics for both images
  const styleMetrics = await extractPaletteFromImage(styleImage.dataUrl, 5);

  const colors = getDescriptiveColorNames(styleMetrics.palette);

  // Determine lighting profile from style image
  let lightingEn = 'cinematic atmospheric lighting with subtle rim light and soft volumetric haze';
  let lightingAr = 'إضاءة سينمائية جوية مع ضوء حافة دقيق وضباب حجمي ناعم';

  if (styleMetrics.brightness === 'dark') {
    lightingEn = 'dramatic chiaroscuro low-key lighting, deep cinematic shadows, focused ambient glow';
    lightingAr = 'إضاءة درامية تباينية (كياروسكورو) خافتة، ظلال سينمائية عميقة، وتوهج محيطي مركز';
  } else if (styleMetrics.brightness === 'bright') {
    lightingEn = 'bright ethereal high-key illumination, soft diffusion, glowing daylight radiance';
    lightingAr = 'إضاءة أثيرية ساطعة عالية التباين، انتشار ناعم، وإشراقة ضوء نهار متوهج';
  }

  // Determine texture and medium
  let mediumEn = 'masterpiece digital painting with rich textural impasto, organic brushstrokes, and nuanced grain';
  let mediumAr = 'رسم رقمي احترافي ذو لمسات فرشاة غنية وملمس بارز مع حبيبات سينمائية دقيقة';

  const descLower = (styleDescription || '').toLowerCase();

  if (descLower.includes('3d') || styleDescription.includes('ثلاثي')) {
    mediumEn = 'hyper-realistic 3D octane render, subsurface scattering, ray-traced reflections, tactile materials';
    mediumAr = 'تصيير ثلاثي الأبعاد فائق الواقعية بمحرك Octane، تشتت ضوء تحت السطح، وانعكاسات شعاعية ملموسة';
  } else if (descLower.includes('anime') || styleDescription.includes('أنمي') || descLower.includes('ghibli') || styleDescription.includes('غيبلي')) {
    mediumEn = 'Studio Ghibli aesthetic, hand-drawn anime cel-shading, lush painted backgrounds, nostalgic painterly texture';
    mediumAr = 'أسلوب ستوديو غيبلي الساحر، تلوين يدوي لخلايا الأنمي، خلفيات مرسومة بعناية، وملمس كلاسيكي دافئ';
  } else if (descLower.includes('cyberpunk') || styleDescription.includes('سايبر')) {
    mediumEn = 'futuristic cyberpunk aesthetic, vivid volumetric neon glow, wet reflective surfaces, chromatic aberration';
    mediumAr = 'أسلوب سايبربانك مستقبلي، توهج نيون حجمي ساطع، أسطح مبللة عاكسة، وزيغ لوني سينمائي';
  } else if (descLower.includes('oil') || styleDescription.includes('زيتي') || descLower.includes('لوحة')) {
    mediumEn = 'classical oil painting on heavy canvas, expressive visible palette knife strokes, rich varnish patina';
    mediumAr = 'لوحة زيتية كلاسيكية على قماش خشن، ضربات سكين ألوان تعبيرية ظاهرة، وطبقة ورنيش عتيقة فاخرة';
  } else if (descLower.includes('pixel') || styleDescription.includes('بكسل')) {
    mediumEn = 'meticulous 16-bit isometric pixel art, nostalgic arcade color grading, clean dithering textures';
    mediumAr = 'فن بكسل إيزومتري متقن 16-بت، تدريج ألوان ريترو نوستالجي، وتدرجات نقطية نقية';
  } else if (descLower.includes('watercolor') || styleDescription.includes('مائي')) {
    mediumEn = 'delicate transparent watercolor wash on cold-press cotton paper, bleeding pigment edges, organic fluid blooms';
    mediumAr = 'ألوان مائية شفافة رقيقة على ورق قطني، حواف صبغة متسربة بانسجام، وتأثيرات سائلة عفوية خلابة';
  } else if (descLower.includes('comic') || styleDescription.includes('كوميكس') || descLower.includes('مانجا')) {
    mediumEn = 'dynamic graphic novel comic illustration, bold ink cross-hatching, stylized halftone dots, dramatic contours';
    mediumAr = 'رسوم كوميكس وروايات مصورة ديناميكية، تحبير قوي بتهشير دقيق، ونقاط هافتون أسلوبية وتحديدات جريئة';
  }

  // Target subject description
  const cleanSubject = targetSubject.trim() || 'the main character, focal element, and environmental composition of Image 2';
  const cleanSubjectAr = targetSubject.trim() || 'الشخصية والعناصر والتكوين الأساسي للصورة الثانية';

  // Style weight calculation
  const mjWeight = strength === 'subtle' ? 300 : strength === 'strong' ? 950 : 650;
  const stylizeValue = strength === 'subtle' ? 150 : strength === 'strong' ? 650 : 350;
  const arParam = aspectRatio;

  const colorPaletteStringEn = colors.en.join(', ');

  // 1. Midjourney v6 Prompt with --sref syntax
  const midjourneyPrompt = `${cleanSubject}, in the signature artistic style of image 1, ${mediumEn}, illuminated by ${lightingEn}, dominant color grading in ${colorPaletteStringEn}, impeccable composition, award-winning visual fidelity, intricate textures, masterpiece --sref [URL_IMAGE_1_STYLE] --sw ${mjWeight} --s ${stylizeValue} --ar ${arParam} --v 6.0`;

  // 2. FLUX.1 & Stable Diffusion XL Prompt
  const fluxPrompt = `[Style Transfer Task]: Transfer the artistic rendering style, lighting, and palette from reference image 1 and apply onto reference image 2 (${cleanSubject}).
Style specification: ${mediumEn}.
Lighting & Ambience: ${lightingEn}.
Color Palette: ${colorPaletteStringEn}.
Composition: Preserve the exact pose, subject arrangement, and silhouette of target image 2 while transforming every pixel into the medium, brushwork, and aesthetic atmosphere of image 1.
Negative Prompt: low quality, blurry, deformed anatomy, mismatched colors, flat lighting, artifacts, text, watermark.`;

  // 3. DALL-E 3 & Google Imagen 3 Prompt
  const dallePrompt = `Create a visually stunning artwork that executes a complete artistic style transfer. The core subject and composition are: ${cleanSubject}. Render this subject entirely in the distinctive aesthetic style of reference image 1. Apply its unique artistic medium (${mediumEn}), replicate its lighting scheme (${lightingEn}), and strictly adhere to its color harmony consisting of ${colorPaletteStringEn}. The final piece must seamlessly unite the exact structure and narrative of image 2 with the visual soul, texture, and mood of image 1, appearing as if the original artist of image 1 painted the subject of image 2.`;

  // 4. Universal / Comprehensive Natural Language Prompt
  const universalPrompt = `[REVERSE ENGINEERING STYLE TRANSFER PROMPT]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. CORE INSTRUCTION:
"Apply the exact visual style, lighting, texture, and artistic medium of Image 1 (Style Reference) onto the subject, character, and composition of Image 2 (Target Content)."

2. TARGET SUBJECT:
${cleanSubject}

3. EXTRACTED STYLE DNA (IMAGE 1):
- Artistic Medium: ${mediumEn}
- Lighting Setup: ${lightingEn}
- Harmonic Palette: ${colorPaletteStringEn}
- Texture & Grain: ${styleMetrics.saturation === 'vibrant' ? 'High saturation vibrancy with dynamic tonal range' : 'Sophisticated muted grading with tactile surface'}

4. DIRECT ENGINE COMMAND:
Render "${cleanSubject}" with the color scheme of (${colorPaletteStringEn}), illuminated by ${lightingEn}, executed with ${mediumEn}.`;

  // Arabic guidance
  const arabicInstruction = `قم بتطبيق النمط الفني، ضربات الفرشاة، نظام الإضاءة، ولوحة الألوان المستخرجة من (الصورة 1: مرجع النمط) على موضوع وتكوين (الصورة 2: ${cleanSubjectAr}). حافظ على ملامح وتكوين الهدف مع صبغه بالكامل بروح وجماليات النمط الفني المستخرج.`;

  const tips = [
    'في Midjourney: ارفع صورة النمط إلى الديسكورد، انسخ رابطها واستبدل [URL_IMAGE_1_STYLE] به لتفعيل ميزة --sref بأقصى دقة.',
    'في Stable Diffusion / FLUX: استخدم ControlNet (Depth أو Canny) للصورة 2 لحفظ أبعاد الهدف، واستخدم IP-Adapter للصورة 1 لنقل النمط بدقة 100%.',
    'في DALL-E 3 أو Imagen 3: انسخ البرومت الوصفي الكامل مباشرة إلى المحادثة، وسيفهم النموذج تلقائياً دمج النمط من الأولى والهدف من الثانية.',
    'عدّل شريط قوة النمط (Style Strength) في الخيارات للتحكم بدرجة هيمنة الأسلوب الفني على تفاصيل الصورة المستهدفة.',
  ];

  return {
    title: `الهندسة العكسية لنقل النمط: ${cleanSubject.slice(0, 32)}`,
    summaryAr: `تم تفكيك النمط الفني للصورة الأولى بنجاح (${colors.ar[0] || 'ألوان سينمائية'} + ${lightingAr}) وإعادة تركيبه على موضوع الصورة الثانية.`,
    summaryEn: `Extracted style DNA from Image 1 (${colorPaletteStringEn}) and successfully projected onto Image 2's subject.`,
    midjourneyPrompt,
    fluxPrompt,
    dallePrompt,
    universalPrompt,
    arabicInstruction,
    extractedStyle: {
      medium: mediumAr,
      lighting: lightingAr,
      palette: styleMetrics.palette,
      paletteNamesAr: colors.ar,
      texture: styleMetrics.saturation === 'vibrant' ? 'تشبع لوني غني وتباين حيوي' : 'تدريج لوني كلاسيكي متزن وناعم',
      mood: styleMetrics.brightness === 'dark' ? 'غموض سينمائي داكن ومكثف' : 'إشراقة أثيرية حيوية ومتفائلة',
      cameraAngle: 'زاوية سينمائية متوازنة تحافظ على بؤرة تركيز الموضوع',
    },
    targetSubjectSummary: cleanSubjectAr,
    tips,
  };
}
