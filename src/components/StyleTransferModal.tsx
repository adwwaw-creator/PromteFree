import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Download,
  Send,
  Trash2,
  Sliders,
  Image as ImageIcon,
  Palette,
  Layers,
  Wand2,
  RefreshCw,
  Lightbulb,
  Info
} from 'lucide-react';
import {
  ImageAnalysisData,
  StyleStrength,
  TargetImageEngine,
  StyleTransferResult,
  reverseEngineerStyleTransfer,
  extractPaletteFromImage
} from '../utils/StyleTransferEngine';

interface StyleTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en' | 'fr';
  onInjectPromptIntoChat: (promptText: string, title: string, explanation: string) => void;
}

// Built-in presets for 1-click instant demo
const PRESETS = [
  {
    id: 'cyberpunk-car',
    titleAr: 'ستايل سايبربانك نيون ➜ سيارة رياضية',
    titleEn: 'Cyberpunk Neon ➜ Sports Car',
    styleName: 'Cyberpunk Neon & Chromatic Glow',
    styleNameAr: 'سايبربانك مستقبلي بإضاءة نيون وأسطح مبللة',
    targetSubject: 'A sleek modern aerodynamic sports car driving on asphalt at night',
    targetSubjectAr: 'سيارة رياضية انسيابية حديثة تسير على طريق أسفلتي ليلاً',
    // High quality SVG data URIs so they load instantly without external dependencies
    styleThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff007f"/><stop offset="50%" stop-color="%237928ca"/><stop offset="100%" stop-color="%2300f0ff"/></linearGradient></defs><rect width="400" height="400" fill="%23090a0f"/><circle cx="200" cy="200" r="140" fill="url(%23g1)" opacity="0.85"/><path d="M50 300 L200 120 L350 300 Z" fill="none" stroke="%2300f0ff" stroke-width="8"/><text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="22" fill="%2300f0ff" text-anchor="middle">STYLE: CYBERPUNK</text></svg>',
    targetThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><path d="M60 260 Q120 180 200 180 Q280 180 340 260 Z" fill="%2394a3b8"/><circle cx="120" cy="260" r="32" fill="%230f172a"/><circle cx="280" cy="260" r="32" fill="%230f172a"/><text x="200" y="340" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23e2e8f0" text-anchor="middle">TARGET: SPORTS CAR</text></svg>',
  },
  {
    id: 'ghibli-city',
    titleAr: 'ستايل أنمي غيبلي ساحر ➜ مشهد مدينة هادئة',
    titleEn: 'Studio Ghibli ➜ Peaceful City',
    styleName: 'Studio Ghibli Hand-Drawn Painterly Aesthetic',
    styleNameAr: 'رسم يدوي دافئ بأسلوب ستوديو غيبلي وخلفيات مائية مبهجة',
    targetSubject: 'A cozy coastal city with small houses, coffee shops, and quiet stone alleys',
    targetSubjectAr: 'مدينة ساحلية هادئة ببيوت ملونة ومقاهٍ صغيرة وأزقة حجرية',
    styleThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%2387ceeb"/><stop offset="60%" stop-color="%23fef08a"/><stop offset="100%" stop-color="%2386efac"/></linearGradient></defs><rect width="400" height="400" fill="url(%23g2)"/><circle cx="320" cy="100" r="45" fill="%23fff" opacity="0.9"/><path d="M0 320 Q120 250 240 310 Q320 340 400 300 L400 400 L0 400 Z" fill="%2315803d"/><text x="200" y="375" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23ffffff" text-anchor="middle">STYLE: GHIBLI</text></svg>',
    targetThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23334155"/><rect x="80" y="160" width="70" height="160" fill="%2364748b"/><rect x="170" y="110" width="80" height="210" fill="%2394a3b8"/><rect x="270" y="190" width="60" height="130" fill="%2364748b"/><text x="200" y="360" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23f1f5f9" text-anchor="middle">TARGET: CITYSCAPE</text></svg>',
  },
  {
    id: 'oil-portrait',
    titleAr: 'ستايل لوحة زيتية كلاسيكية ➜ بورتريه فتاة',
    titleEn: 'Classical Oil Impasto ➜ Portrait',
    styleName: 'Renaissance Oil Painting Heavy Impasto',
    styleNameAr: 'لوحة زيتية كلاسيكية بضربات سكين تعبيرية وإضاءة ريمبرانت',
    targetSubject: 'Portrait of a thoughtful person looking towards the side with expressive eyes',
    targetSubjectAr: 'بورتريه لشخص متأمل ينظر إلى الجانب بملامح معبرة',
    styleThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><radialGradient id="g3" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="%23d97706"/><stop offset="50%" stop-color="%2378350f"/><stop offset="100%" stop-color="%231c1917"/></radialGradient></defs><rect width="400" height="400" fill="url(%23g3)"/><circle cx="180" cy="170" r="80" fill="%23fbbf24" opacity="0.3"/><text x="200" y="360" font-family="serif" font-weight="bold" font-size="20" fill="%23fbbf24" text-anchor="middle">STYLE: OIL PAINTING</text></svg>',
    targetThumb: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%2327272a"/><circle cx="200" cy="180" r="70" fill="%23e4e4e7"/><rect x="140" y="270" width="120" height="110" rx="30" fill="%23a1a1aa"/><text x="200" y="350" font-family="sans-serif" font-weight="bold" font-size="20" fill="%23ffffff" text-anchor="middle">TARGET: PORTRAIT</text></svg>',
  },
];

export const StyleTransferModal: React.FC<StyleTransferModalProps> = ({
  isOpen,
  onClose,
  lang,
  onInjectPromptIntoChat,
}) => {
  if (!isOpen) return null;

  const isRtl = lang === 'ar';

  // Uploaded state
  const [styleImage, setStyleImage] = useState<ImageAnalysisData | null>(null);
  const [targetImage, setTargetImage] = useState<ImageAnalysisData | null>(null);
  const [styleHint, setStyleHint] = useState<string>('');
  const [targetSubject, setTargetSubject] = useState<string>('');

  // Settings
  const [selectedEngine, setSelectedEngine] = useState<TargetImageEngine>('universal');
  const [strength, setStrength] = useState<StyleStrength>('balanced');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [result, setResult] = useState<StyleTransferResult | null>(null);
  const [activeTab, setActiveTab] = useState<'universal' | 'midjourney' | 'flux' | 'dalle'>('universal');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const styleInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'style' | 'target') => {
    if (!file.type.startsWith('image/')) {
      alert(lang === 'ar' ? 'يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)' : 'Please choose a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const metrics = await extractPaletteFromImage(dataUrl);

      const analysisData: ImageAnalysisData = {
        dataUrl,
        name: file.name,
        width: metrics.width,
        height: metrics.height,
        aspectRatio: metrics.aspectRatio,
        palette: metrics.palette,
        brightness: metrics.brightness,
        saturation: metrics.saturation,
      };

      if (type === 'style') {
        setStyleImage(analysisData);
      } else {
        setTargetImage(analysisData);
        if (metrics.aspectRatio) {
          setAspectRatio(metrics.aspectRatio);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = async (preset: typeof PRESETS[0]) => {
    setStyleHint(preset.styleNameAr);
    setTargetSubject(preset.targetSubjectAr);

    const styleMetrics = await extractPaletteFromImage(preset.styleThumb);
    const targetMetrics = await extractPaletteFromImage(preset.targetThumb);

    setStyleImage({
      dataUrl: preset.styleThumb,
      name: `${preset.id}-style.svg`,
      palette: styleMetrics.palette,
      brightness: styleMetrics.brightness,
      saturation: styleMetrics.saturation,
      aspectRatio: '1:1',
    });

    setTargetImage({
      dataUrl: preset.targetThumb,
      name: `${preset.id}-target.svg`,
      palette: targetMetrics.palette,
      brightness: targetMetrics.brightness,
      saturation: targetMetrics.saturation,
      aspectRatio: '1:1',
    });
  };

  const handleGenerate = async () => {
    if (!styleImage) {
      alert(lang === 'ar' ? 'يرجى رفع صورة النمط والأسلوب أولاً' : 'Please upload the style image first');
      return;
    }
    if (!targetImage) {
      alert(lang === 'ar' ? 'يرجى رفع صورة الهدف والمحتوى أولاً' : 'Please upload the target image first');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(lang === 'ar' ? 'فحص البكسلات واستخراج لوحة الألوان...' : 'Extracting color palette and lighting...');

    setTimeout(async () => {
      setProcessingStep(lang === 'ar' ? 'تفكيك الوسيط الفني والإضاءة والملمس...' : 'Deconstructing artistic medium and texture...');

      setTimeout(async () => {
        setProcessingStep(lang === 'ar' ? 'صياغة برومبتات نقل النمط (Midjourney, FLUX, DALL-E)...' : 'Synthesizing style transfer prompts...');

        const transferResult = await reverseEngineerStyleTransfer({
          styleImage,
          targetImage,
          styleDescription: styleHint,
          targetSubject,
          engine: selectedEngine,
          strength,
          aspectRatio,
          lang,
        });

        setResult(transferResult);
        setIsProcessing(false);
        setProcessingStep('');
      }, 500);
    }, 500);
  };

  const handleCopyPrompt = async (text: string, tabId: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedTab(tabId);
      setTimeout(() => setCopiedTab(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadTxt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendToChat = () => {
    if (!result) return;
    const currentText =
      activeTab === 'midjourney'
        ? result.midjourneyPrompt
        : activeTab === 'flux'
        ? result.fluxPrompt
        : activeTab === 'dalle'
        ? result.dallePrompt
        : result.universalPrompt;

    onInjectPromptIntoChat(
      currentText,
      result.title,
      `${result.summaryAr}\n\n💡 توجيه التنفيذ: ${result.arabicInstruction}`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-4xl bg-[#1e1f20] border border-[#333537] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2d2f31] flex items-center justify-between bg-[#18191a]/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-amber-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'ar' ? 'الهندسة العكسية لنقل الأنماط (صورة ➜ صورة)' : 'Reverse Engineering Style Transfer'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-medium text-emerald-300">
                  {lang === 'ar' ? 'مجاني 100%' : 'Free'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'خذ النمط والإضاءة والألوان من الصورة الأولى وطبّقها بدقة على موضوع ومحتوى الصورة الثانية'
                  : 'Extract artistic style from Image 1 and project it onto the subject of Image 2'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[#282a2c] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
          {/* Quick Presets Ribbon */}
          <div className="bg-[#141517] border border-[#282a2c] rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{lang === 'ar' ? 'تجربة سريعة بدون رفع ملفات:' : 'Quick Presets:'}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#202124] hover:bg-[#2c2d30] border border-[#3c4043] text-xs text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'ar' ? p.titleAr : p.titleEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Two Image Upload Cards in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* Box 1: Style Reference Image */}
            <div className="bg-[#161719] border border-[#2d2f31] rounded-2xl p-4 flex flex-col gap-3 relative group hover:border-[#4285f4]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <label className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'صورة النمط والأسلوب (Style)' : 'Image 1: Style Reference'}
                  </label>
                </div>
                {styleImage && (
                  <button
                    onClick={() => setStyleImage(null)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'حذف' : 'Remove'}</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone */}
              <input
                ref={styleInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'style');
                }}
              />

              {styleImage ? (
                <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex items-center justify-center group/img">
                  <img
                    src={styleImage.dataUrl}
                    alt="Style Reference"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => styleInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs backdrop-blur-md cursor-pointer transition-colors"
                    >
                      {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                    </button>
                  </div>
                  {styleImage.palette && (
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-center gap-1.5 p-1 rounded-lg bg-black/70 backdrop-blur-sm">
                      {styleImage.palette.map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => styleInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-[#3c4043] hover:border-amber-400/60 bg-[#1a1b1d] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[160px]"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'ar' ? 'اسحب صورة النمط هنا أو انقر للاختيار' : 'Upload Style Reference Image'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {lang === 'ar' ? '(لوحة فنية، رسمة ثلاثية الأبعاد، أنمي، سايبربانك...)' : 'PNG, JPG, WebP up to 15MB'}
                  </span>
                </div>
              )}

              {/* Style hint input */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {lang === 'ar' ? 'وصف النمط الفني (اختياري / يُكتشف تلقائياً):' : 'Style Hint (Optional):'}
                </label>
                <input
                  type="text"
                  value={styleHint}
                  onChange={(e) => setStyleHint(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: ألوان مائية حالمة، إضاءة نيون سايبربانك...' : 'e.g. watercolor, neon cyberpunk...'}
                  className="w-full px-3 py-2 rounded-xl bg-[#202124] border border-[#3c4043] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Central Arrow indicator between two cards */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1b6ef3] border-2 border-[#1e1f20] text-white items-center justify-center shadow-lg pointer-events-none">
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </div>

            {/* Box 2: Target Content Image */}
            <div className="bg-[#161719] border border-[#2d2f31] rounded-2xl p-4 flex flex-col gap-3 relative group hover:border-[#1b6ef3]/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <label className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'صورة الهدف والمحتوى (Target)' : 'Image 2: Target Content'}
                  </label>
                </div>
                {targetImage && (
                  <button
                    onClick={() => setTargetImage(null)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'حذف' : 'Remove'}</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone */}
              <input
                ref={targetInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'target');
                }}
              />

              {targetImage ? (
                <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex items-center justify-center group/img">
                  <img
                    src={targetImage.dataUrl}
                    alt="Target Subject"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => targetInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs backdrop-blur-md cursor-pointer transition-colors"
                    >
                      {lang === 'ar' ? 'تغيير الصورة' : 'Change Image'}
                    </button>
                  </div>
                  {targetImage.aspectRatio && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/20 text-[10px] text-slate-300 font-mono">
                      AR {targetImage.aspectRatio}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => targetInputRef.current?.click()}
                  className="rounded-xl border-2 border-dashed border-[#3c4043] hover:border-blue-400/60 bg-[#1a1b1d] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[160px]"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {lang === 'ar' ? 'اسحب صورة الهدف هنا أو انقر للاختيار' : 'Upload Target Subject Image'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {lang === 'ar' ? '(صورة شخصية، سيارة، مبنى، قطة، منظر طبيعي...)' : 'The subject to apply the style onto'}
                  </span>
                </div>
              )}

              {/* Target subject input */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  {lang === 'ar' ? 'تحديد موضوع الهدف (اختياري / يُكتشف تلقائياً):' : 'Subject Details (Optional):'}
                </label>
                <input
                  type="text"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: شاب يرتدي معطفاً، قلعة على جبل، قطة رمادية...' : 'e.g. portrait of a person, sports car...'}
                  className="w-full px-3 py-2 rounded-xl bg-[#202124] border border-[#3c4043] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Transfer Options Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#161719] border border-[#282a2c] rounded-2xl p-3.5">
            {/* Style Strength */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'قوة تأثير النمط (Strength)' : 'Style Intensity'}</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#202124] p-1 rounded-xl border border-[#3c4043]">
                {(['subtle', 'balanced', 'strong'] as StyleStrength[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStrength(st)}
                    className={`py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      strength === st
                        ? 'bg-[#1b6ef3] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'subtle'
                      ? lang === 'ar' ? 'خفيف' : 'Subtle'
                      : st === 'balanced'
                      ? lang === 'ar' ? 'متوازن' : 'Balanced'
                      : lang === 'ar' ? 'قوي' : 'Strong'}
                  </button>
                ))}
              </div>
            </div>

            {/* Target AI Engine */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'ar' ? 'المحرك المفضل' : 'Preferred Engine'}</span>
              </label>
              <select
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value as TargetImageEngine)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#202124] border border-[#3c4043] text-xs text-white focus:outline-none focus:border-[#1b6ef3] cursor-pointer"
              >
                <option value="universal">{lang === 'ar' ? '🌐 شامل لكل النماذج' : '🌐 Universal (All Models)'}</option>
                <option value="midjourney">Midjourney v6 (--sref)</option>
                <option value="flux">FLUX.1 & Stable Diffusion XL</option>
                <option value="dalle">DALL-E 3 & Google Imagen 3</option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'أبعاد الصورة الناتجة' : 'Aspect Ratio'}</span>
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#202124] border border-[#3c4043] text-xs text-white focus:outline-none focus:border-[#1b6ef3] cursor-pointer"
              >
                <option value="16:9">16:9 (عريض سينمائي / Cinematic)</option>
                <option value="1:1">1:1 (مربع / Square)</option>
                <option value="9:16">9:16 (طولي / Story & Reels)</option>
                <option value="4:5">4:5 (إنستغرام / Instagram Feed)</option>
                <option value="4:3">4:3 (كلاسيكي / Classic)</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isProcessing || !styleImage || !targetImage}
              className="w-full sm:w-auto min-w-[280px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#1b6ef3] via-[#7cacf8] to-[#9b51e0] hover:opacity-95 active:scale-95 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{processingStep || (lang === 'ar' ? 'جارٍ تفكيك النمط...' : 'Processing...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {lang === 'ar'
                      ? '⚡ تفكيك النمط وهندسة برومت النقل (صورة ➜ صورة)'
                      : '⚡ Reverse Engineer & Generate Style Transfer Prompt'}
                  </span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? '✨ نظام مجاني فوري يفكك الألوان والإضاءة والملمس والوسيط الفني بدقة هندسية'
                : '100% Client-side Free Reverse Engineering Engine'}
            </span>
          </div>

          {/* Output Results Section */}
          {result && (
            <div className="bg-[#141517] border border-[#2d2f31] rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
              {/* Header of Results */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#282a2c]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{result.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{result.summaryAr}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleSendToChat}
                    className="px-3 py-1.5 rounded-xl bg-[#1b6ef3] hover:bg-[#1860d5] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إرسال إلى المحادثة' : 'Send to Chat'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadTxt(
                        `=== REVERSE ENGINEERING STYLE TRANSFER ===\n\nTitle: ${result.title}\n\nUniversal Prompt:\n${result.universalPrompt}\n\nMidjourney Prompt:\n${result.midjourneyPrompt}\n\nFLUX / SD Prompt:\n${result.fluxPrompt}\n\nDALL-E 3 Prompt:\n${result.dallePrompt}\n\nGenerated via Daw Ai Free Style Transfer`,
                        'style-transfer-prompt.txt'
                      )
                    }
                    className="p-1.5 rounded-xl bg-[#202124] hover:bg-[#282a2c] text-slate-300 hover:text-white border border-[#3c4043] transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'تحميل كملف نصي' : 'Download TXT'}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Extracted Style DNA Chips */}
              <div className="bg-[#1a1b1d] rounded-xl p-3 border border-[#2d2f31] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">🎨 لوحة الألوان المستخرجة:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {result.extractedStyle.palette.map((hex, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm flex items-center justify-center text-[9px] font-mono text-white/90"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">💡 أسلوب الإضاءة:</span>
                  <span className="text-slate-200 line-clamp-2">{result.extractedStyle.lighting}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">🖌️ الوسيط الفني والملمس:</span>
                  <span className="text-slate-200 line-clamp-2">{result.extractedStyle.medium}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5 font-semibold">🎯 الهدف والموضوع:</span>
                  <span className="text-slate-200 line-clamp-2">{result.targetSubjectSummary}</span>
                </div>
              </div>

              {/* Tabs for Different Models */}
              <div className="flex items-center gap-1 border-b border-[#2d2f31] pb-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'universal', label: '🌐 برومت شامل لكل النماذج' },
                  { id: 'midjourney', label: 'Midjourney v6 (--sref)' },
                  { id: 'flux', label: 'FLUX.1 & Stable Diffusion' },
                  { id: 'dalle', label: 'DALL-E 3 & Imagen 3' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#282a2c] text-white border border-[#444746]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Prompt Box */}
              <div className="relative bg-[#0d0e11] rounded-xl border border-[#2d2f31] p-3.5">
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeTab === 'midjourney'
                      ? 'Midjourney v6 (--sref parameter included)'
                      : activeTab === 'flux'
                      ? 'FLUX.1 / SDXL ControlNet Spec'
                      : activeTab === 'dalle'
                      ? 'DALL-E 3 & Imagen 3 Natural Prompt'
                      : 'Universal Style Transfer Directive'}
                  </span>
                  <button
                    onClick={() => {
                      const text =
                        activeTab === 'midjourney'
                          ? result.midjourneyPrompt
                          : activeTab === 'flux'
                          ? result.fluxPrompt
                          : activeTab === 'dalle'
                          ? result.dallePrompt
                          : result.universalPrompt;
                      handleCopyPrompt(text, activeTab);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#202124] hover:bg-[#282a2c] border border-[#3c4043] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedTab === activeTab ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'نسخ البرومت' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre
                  dir="ltr"
                  className="font-mono text-xs sm:text-[13px] text-emerald-300 leading-relaxed whitespace-pre-wrap break-words max-h-56 overflow-y-auto selection:bg-blue-500 selection:text-white"
                >
                  {activeTab === 'midjourney'
                    ? result.midjourneyPrompt
                    : activeTab === 'flux'
                    ? result.fluxPrompt
                    : activeTab === 'dalle'
                    ? result.dallePrompt
                    : result.universalPrompt}
                </pre>
              </div>

              {/* Arabic Instruction & Practical Tips */}
              <div className="bg-[#1a1b1d]/80 rounded-xl p-3 border border-amber-500/20 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Lightbulb className="w-4 h-4" />
                  <span>{lang === 'ar' ? '💡 توجيه الاستخدام والتطبيق العملي:' : '💡 Usage Tips:'}</span>
                </div>
                <p className="leading-relaxed">{result.arabicInstruction}</p>
                <div className="pt-1.5 border-t border-white/5 space-y-1">
                  {result.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2d2f31] bg-[#18191a]/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'ar' ? 'هندسة عكسية فورية مجانية بدون حاجة لأي رصيد' : 'Instant 100% Free Style Transfer'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#282a2c] hover:bg-[#333537] text-white font-medium transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
