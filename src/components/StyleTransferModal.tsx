import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Upload,
  ArrowRight,
  Copy,
  Check,
  Send,
  Image as ImageIcon,
  Sliders,
  RefreshCw,
  Layers,
  Palette,
  SunMedium,
  Cpu,
  Trash2,
  FileCheck2,
  Wand2,
} from 'lucide-react';
import { StyleTransferEngine, StyleTransferResult } from '../utils/StyleTransferEngine';

interface StyleTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en' | 'fr';
  onInjectPromptIntoChat: (promptText: string, title: string, explanation: string) => void;
}

const PRESET_STYLES = [
  {
    nameAr: 'زيتي انطباعي (فان غوخ / مونيه)',
    nameEn: 'Impressionist Oil Painting',
    desc: 'لوحة زيتية انطباعية بضربات فرشاة بارزة وألوان دافئة وملمس كانفاس غني',
    previewColor: 'from-amber-600 to-yellow-800',
  },
  {
    nameAr: 'سايبربانك نيون سينمائي',
    nameEn: 'Cinematic Neon Cyberpunk',
    desc: 'إضاءة نيون وردية وزرقاء متباينة مع أجواء ممطرة وانعكاسات رطبة على الأسفلت',
    previewColor: 'from-fuchsia-600 to-cyan-700',
  },
  {
    nameAr: 'أنمي سينمائي (ماكوتو شينكاي)',
    nameEn: 'Makoto Shinkai Anime Aesthetic',
    desc: 'سماء متدرجة ساحرة، غيوم حجمية مضيئة، إضاءة شمس ذهبية وألوان باستيل زاهية',
    previewColor: 'from-sky-500 to-indigo-700',
  },
  {
    nameAr: 'تصوير فيلمي بولارويد كلاسيكي',
    nameEn: 'Vintage Polaroid 35mm Film',
    desc: 'حبوب فيلمية حقيقية (Grain)، تدرجات باهتة (Faded tones)، وإضاءة فلاش دافئة',
    previewColor: 'from-orange-700 to-stone-800',
  },
];

const PRESET_SUBJECTS = [
  {
    nameAr: 'فارس أندلسي في الصحراء',
    nameEn: 'Andalusian Knight on Horseback',
    desc: 'فارس عربي بدرع معدني مزخرف يمتطي حصاناً أصيلاً فوق الكثبان الرملية',
  },
  {
    nameAr: 'رائد فضاء في غابة غريبة',
    nameEn: 'Astronaut in Alien Bioluminescent Jungle',
    desc: 'رائد فضاء بخوذة عاكسة يستكشف نباتات مضيئة متوهجة في كوكب مجهول',
  },
  {
    nameAr: 'مقهى دافئ في شارع أوروبي قديم',
    nameEn: 'Cozy Rain-Drenched European Cafe',
    desc: 'شخص يجلس بجانب نافذة مقهى خشبي دافئ بينما تتساقط الأمطار في الخارج',
  },
];

export const StyleTransferModal: React.FC<StyleTransferModalProps> = ({
  isOpen,
  onClose,
  lang,
  onInjectPromptIntoChat,
}) => {
  // Style Source State
  const [styleDesc, setStyleDesc] = useState('');
  const [styleImagePreview, setStyleImagePreview] = useState<string | null>(null);

  // Target Content State
  const [subjectDesc, setSubjectDesc] = useState('');
  const [subjectImagePreview, setSubjectImagePreview] = useState<string | null>(null);

  // Settings
  const [selectedTool, setSelectedTool] = useState<'midjourney' | 'flux' | 'dalle3' | 'imagen3'>('midjourney');
  const [intensity, setIntensity] = useState<'subtle' | 'balanced' | 'strong'>('balanced');
  const [activePromptTab, setActivePromptTab] = useState<'master' | 'midjourney' | 'flux' | 'dalle'>('master');

  // Execution & UI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<StyleTransferResult | null>(null);
  const [copiedType, setCopiedType] = useState<'prompt' | 'negative' | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'style' | 'subject') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (type === 'style') {
            setStyleImagePreview(reader.result);
            if (!styleDesc) setStyleDesc('نمط بصري مستخرج من الصورة المرفوعة (لوحة الألوان والإضاءة والملمس الفني)');
          } else {
            setSubjectImagePreview(reader.result);
            if (!subjectDesc) setSubjectDesc('موضوع وتكوين مستخرج من الصورة المرفوعة (الشخصيات والكتل الهندسية)');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = (type: 'style' | 'subject') => {
    if (type === 'style') {
      setStyleImagePreview(null);
    } else {
      setSubjectImagePreview(null);
    }
  };

  const handleRunReverseEngineering = async () => {
    if (!styleImagePreview && !styleDesc.trim()) {
      setStyleDesc('لوحة زيتية انطباعية بألوان دافئة وإضاءة غروب درامية وملمس كانفاس غني');
    }
    if (!subjectImagePreview && !subjectDesc.trim()) {
      setSubjectDesc('شخصية مركزية سينمائية تقف بثقة في بيئة تفاعلية مع المحيط');
    }

    setIsAnalyzing(true);
    setAnalysisStep(lang === 'ar' ? '🔍 تفكيك الحمض النووي للنمط (Visual DNA Extraction)...' : 'Extracting Visual Style DNA...');

    try {
      setTimeout(() => {
        setAnalysisStep(
          lang === 'ar'
            ? '📐 تحليل هندسة المحتوى والتكوين (Spatial Geometry & Content)...'
            : 'Analyzing Target Content & Spatial Geometry...'
        );
      }, 700);

      setTimeout(() => {
        setAnalysisStep(
          lang === 'ar'
            ? '🎨 صياغة البرومبت العكسي الشامل مع Gemini AI...'
            : 'Synthesizing Reverse Engineered Prompt with Gemini AI...'
        );
      }, 1500);

      const res = await StyleTransferEngine.analyzeWithAI({
        styleImage: styleImagePreview,
        targetImage: subjectImagePreview,
        styleNotes: styleDesc,
        targetNotes: subjectDesc,
        targetTool: selectedTool,
        intensity,
        lang,
      });

      setResult(res);
      // Auto-select corresponding tab
      if (selectedTool === 'flux') setActivePromptTab('flux');
      else if (selectedTool === 'midjourney') setActivePromptTab('midjourney');
      else if (selectedTool === 'dalle3') setActivePromptTab('dalle');
      else setActivePromptTab('master');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const getCurrentPromptText = () => {
    if (!result) return '';
    if (activePromptTab === 'midjourney') return result.midjourneyPrompt || result.masterPrompt || result.prompt;
    if (activePromptTab === 'flux') return result.fluxPrompt || result.masterPrompt || result.prompt;
    if (activePromptTab === 'dalle') return result.dallePrompt || result.masterPrompt || result.prompt;
    return result.masterPrompt || result.prompt;
  };

  const handleCopy = (text: string, type: 'prompt' | 'negative') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const handleSendToChat = () => {
    if (result) {
      const promptToUse = getCurrentPromptText();
      const titleToUse = result.titleAr || result.title;
      const explanationToUse = result.explanationAr || result.explanation;
      onInjectPromptIntoChat(promptToUse, titleToUse, explanationToUse);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#12131a] border border-[#3b2b52] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#292338] bg-[#110e19] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <RefreshCw className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'ar' ? 'الهندسة العكسية لنقل الأنماط الفنية' : 'Reverse Engineering Style Transfer'}
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  مدعوم بـ Gemini 3.8 Flash AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'ارفع صورة النمط وصورة المحتوى ➜ يقوم الذكاء الاصطناعي بتفكيك النمط ونقله للهدف وتوليد برومبت عالي الدقة'
                  : 'Upload a style source image and content target image — AI reverse engineers the style transfer prompt'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1e1f25] hover:bg-[#2c2f3d] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Dual Upload Columns: Source Style & Target Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: SOURCE STYLE IMAGE */}
            <div className="p-4 rounded-2xl bg-[#181524] border border-[#3f2d59] flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  1. صورة النمط الفني (Source Style)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                  الألوان • الإضاءة • الملمس
                </span>
              </div>

              {/* Upload Dropzone or Preview */}
              <div className="relative border-2 border-dashed border-[#553c75] hover:border-purple-400 rounded-xl p-3 flex flex-col items-center justify-center transition-colors bg-[#110e1a] min-h-[140px] overflow-hidden group">
                {styleImagePreview ? (
                  <div className="relative w-full flex flex-col items-center">
                    <img
                      src={styleImagePreview}
                      alt="Style Reference"
                      className="max-h-36 w-auto rounded-lg object-contain shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleClearImage('style')}
                      className="absolute top-1 right-1 p-1.5 rounded-lg bg-black/70 hover:bg-red-600/80 text-white transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="w-7 h-7 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-purple-200">ارفع صورة النمط المرئي</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP (حتى 20MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'style')}
                    />
                  </label>
                )}
              </div>

              {/* Quick Preset Styles Pills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">أو اختر نمطاً جاهزاً:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_STYLES.map((ps, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStyleDesc(ps.desc)}
                      className="p-1.5 rounded-lg bg-[#221c32] hover:bg-[#302647] border border-[#3d2f59] text-[11px] text-start font-medium text-purple-200 truncate transition-colors flex items-center gap-1.5"
                    >
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${ps.previewColor} shrink-0`} />
                      <span className="truncate">{ps.nameAr}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style notes input */}
              <textarea
                value={styleDesc}
                onChange={(e) => setStyleDesc(e.target.value)}
                placeholder="وصف إضافي للنمط (مثل: ألوان الباستيل، إضاءة سينمائية حجمية، ملمس دهان زيتي)..."
                rows={2}
                className="w-full bg-[#100d18] border border-[#382b4c] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Box 2: TARGET CONTENT IMAGE */}
            <div className="p-4 rounded-2xl bg-[#141824] border border-[#263753] flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  2. صورة المحتوى المستهدف (Target Content)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/40">
                  الشخصية • التكوين • المشهد
                </span>
              </div>

              {/* Upload Dropzone or Preview */}
              <div className="relative border-2 border-dashed border-[#344b70] hover:border-blue-400 rounded-xl p-3 flex flex-col items-center justify-center transition-colors bg-[#0e121b] min-h-[140px] overflow-hidden group">
                {subjectImagePreview ? (
                  <div className="relative w-full flex flex-col items-center">
                    <img
                      src={subjectImagePreview}
                      alt="Content Target"
                      className="max-h-36 w-auto rounded-lg object-contain shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleClearImage('subject')}
                      className="absolute top-1 right-1 p-1.5 rounded-lg bg-black/70 hover:bg-red-600/80 text-white transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                    <Upload className="w-7 h-7 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-blue-200">ارفع صورة المحتوى والهدف</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WebP (حتى 20MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'subject')}
                    />
                  </label>
                )}
              </div>

              {/* Quick Preset Subjects */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400">أو اختر موضوعاً مقترحاً:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_SUBJECTS.map((ps, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSubjectDesc(ps.desc)}
                      className="p-1.5 rounded-lg bg-[#1a2133] hover:bg-[#252f47] border border-[#2d3a57] text-[11px] text-start font-medium text-blue-200 truncate transition-colors"
                    >
                      {ps.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject notes input */}
              <textarea
                value={subjectDesc}
                onChange={(e) => setSubjectDesc(e.target.value)}
                placeholder="وصف المشهد أو الشخصية التي تريد رسمها بالنمط المنقول..."
                rows={2}
                className="w-full bg-[#0c0f17] border border-[#25324a] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

          </div>

          {/* Engine Parameters Bar (Tool, Intensity, Action Button) */}
          <div className="p-4 rounded-2xl bg-[#161722] border border-[#2d2f40] flex flex-wrap items-center justify-between gap-4">
            
            {/* Target Tool Selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                محرك التوليد المستهدف:
              </span>
              <div className="flex items-center gap-1 bg-[#0f1016] p-1 rounded-xl border border-[#2b2d3d]">
                {(['midjourney', 'flux', 'dalle3', 'imagen3'] as const).map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedTool === tool
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tool === 'midjourney'
                      ? 'Midjourney v6.1'
                      : tool === 'flux'
                      ? 'FLUX.1'
                      : tool === 'dalle3'
                      ? 'DALL-E 3'
                      : 'Imagen 3'}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Intensity */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">درجة دمج النمط:</span>
              <div className="flex items-center gap-1 bg-[#0f1016] p-1 rounded-xl border border-[#2b2d3d]">
                {(['subtle', 'balanced', 'strong'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      intensity === lvl
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl === 'subtle' ? 'خفيف (0.8)' : lvl === 'balanced' ? 'متوازن (1.2)' : 'قوي (2.0)'}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Reverse Engineering Action Button */}
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleRunReverseEngineering}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xl hover:shadow-purple-500/25 active:scale-95 transition-all ml-auto cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{analysisStep || 'جاري التحليل العكسي بالذكاء الاصطناعي...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-amber-300" />
                  <span>توليد برومبت النمط العكسي بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Card */}
          {result && (
            <div className="p-5 rounded-3xl bg-[#110e1a] border border-[#583582] space-y-5 animate-in fade-in duration-300 shadow-2xl">
              
              {/* Result Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-[#2b1f3d]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {result.titleAr || result.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                        {result.source === 'gemini-3.8-flash' ? '✨ Gemini 3.8 Flash Vision' : '⚡ Visual Engine'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        تم استخراج النمط ونقله بدقة للأبعاد
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(getCurrentPromptText(), 'prompt')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#231b32] hover:bg-[#322649] text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-[#483466] transition-colors"
                  >
                    {copiedType === 'prompt' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم نسخ البرومبت!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-purple-300" />
                        <span>نسخ البرومبت النشط</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToChat}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إدراج في محادثة Daw AI</span>
                  </button>
                </div>
              </div>

              {/* Style DNA Metrics Grid */}
              {result.styleDna && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#191426] border border-[#372652]">
                    <span className="text-[10px] text-purple-300 flex items-center gap-1 font-semibold">
                      <Palette className="w-3 h-3 text-purple-400" /> الوسيط الفني (Medium)
                    </span>
                    <p className="text-xs text-white font-medium mt-1 truncate">
                      {result.styleDna.medium || 'Mixed Fine Art'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#191426] border border-[#372652]">
                    <span className="text-[10px] text-amber-300 flex items-center gap-1 font-semibold">
                      <SunMedium className="w-3 h-3 text-amber-400" /> الإضاءة (Lighting)
                    </span>
                    <p className="text-xs text-white font-medium mt-1 truncate">
                      {result.styleDna.lighting || 'Cinematic Volumetric'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#191426] border border-[#372652]">
                    <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                      <Layers className="w-3 h-3 text-emerald-400" /> التناغم اللوني (Palette)
                    </span>
                    <p className="text-xs text-white font-medium mt-1 truncate">
                      {result.styleDna.palette || 'Rich Harmonized'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#191426] border border-[#372652]">
                    <span className="text-[10px] text-cyan-300 flex items-center gap-1 font-semibold">
                      <FileCheck2 className="w-3 h-3 text-cyan-400" /> المحتوى المحفوظ (Content)
                    </span>
                    <p className="text-xs text-white font-medium mt-1 truncate">
                      {result.contentPreserved || 'Target Subject Geometry'}
                    </p>
                  </div>
                </div>
              )}

              {/* Prompt Engine Tabs */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setActivePromptTab('master')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activePromptTab === 'master'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1b172a] text-slate-300 hover:text-white border border-[#31254a]'
                    }`}
                  >
                    🌟 البرومبت الشامل (Master Prompt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePromptTab('midjourney')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activePromptTab === 'midjourney'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1b172a] text-slate-300 hover:text-white border border-[#31254a]'
                    }`}
                  >
                    🎨 Midjourney v6.1 (--sref)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePromptTab('flux')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activePromptTab === 'flux'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1b172a] text-slate-300 hover:text-white border border-[#31254a]'
                    }`}
                  >
                    ⚡ FLUX.1 (Dev / Schnell)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePromptTab('dalle')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activePromptTab === 'dalle'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1b172a] text-slate-300 hover:text-white border border-[#31254a]'
                    }`}
                  >
                    🖼️ DALL-E 3
                  </button>
                </div>

                {/* Main Prompt Textarea Box */}
                <div className="rounded-2xl bg-[#0a0812] border border-[#3d2757] p-3.5 text-xs sm:text-sm font-mono text-purple-100 leading-relaxed select-all whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner">
                  {getCurrentPromptText()}
                </div>
              </div>

              {/* Negative Prompt Row */}
              {result.negativePrompt && (
                <div className="p-3 rounded-xl bg-[#14101e] border border-[#34244d] flex items-center justify-between gap-3">
                  <div className="flex flex-col text-start">
                    <span className="text-[10px] font-bold text-red-400">
                      البرومبت السلبي الموصى به (Negative Prompt):
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 line-clamp-1">
                      {result.negativePrompt}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.negativePrompt, 'negative')}
                    className="px-2.5 py-1 rounded-lg bg-[#221735] hover:bg-[#31204c] text-[11px] font-medium text-slate-300 shrink-0 border border-[#482e6c]"
                  >
                    {copiedType === 'negative' ? 'تم النسخ!' : 'نسخ'}
                  </button>
                </div>
              )}

              {/* Reverse Engineering Technical Explanation */}
              <div className="p-3.5 rounded-xl bg-[#130f1e] border border-[#2e2044] text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-purple-300 block mb-1">
                  💡 التحليل الفني لعملية نقل النمط المعكوس:
                </span>
                <p>{result.explanationAr || result.explanation}</p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
