import React from 'react';
import { Camera, Image as ImageIcon, Paperclip, HardDrive, BookOpen, MapPin, Video, Music, Layout, Sparkles, Compass, Megaphone, Code, HelpCircle, Check, Sliders, Layers, FileText } from 'lucide-react';
import { PromptCategory, DetailLevel, DeliveryMode } from '../types';
import { dawaiCategoryCards } from '../data/prompts';
import { AdSenseBanner } from './AdSenseBanner';

interface GeminiBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: PromptCategory, sampleText?: string) => void;
  lang: 'ar' | 'en' | 'fr';
  detailLevel?: DetailLevel;
  setDetailLevel?: (d: DetailLevel) => void;
  deliveryMode?: DeliveryMode;
  setDeliveryMode?: (m: DeliveryMode) => void;
  tone?: string;
  setTone?: (t: string) => void;
  onOpenStyleTransfer?: () => void;
}

export const GeminiBottomSheet: React.FC<GeminiBottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  lang,
  detailLevel = 'medium',
  setDetailLevel,
  deliveryMode = 'both',
  setDeliveryMode,
  tone = 'رسمي واحترافي',
  setTone,
  onOpenStyleTransfer,
}) => {
  if (!isOpen) return null;

  const deliveryOptions: Array<{ id: DeliveryMode; labelAr: string; labelEn: string; desc: string }> = [
    {
      id: 'both',
      labelAr: 'البرومت والنتيجة معاً',
      labelEn: 'Prompt & Result',
      desc: 'توليد البرومت الجاهز للنسخ + النتيجة التنفيذية المباشرة',
    },
    {
      id: 'prompt_only',
      labelAr: 'برومت للنسخ فقط',
      labelEn: 'Prompt Only',
      desc: 'تسليم البرومت المهندس بدقة دون محاكاة النتيجة',
    },
    {
      id: 'result_only',
      labelAr: 'النتيجة المباشرة فقط',
      labelEn: 'Result Only',
      desc: 'تنفيذ المطلوب مباشرة وعرض المخرجات النهائية فقط',
    },
  ];

  const detailOptions: Array<{ id: DetailLevel; labelAr: string; labelEn: string; words: string }> = [
    {
      id: 'short',
      labelAr: 'موجز وسريع',
      labelEn: 'Short',
      words: '~120 كلمة',
    },
    {
      id: 'medium',
      labelAr: 'متوازن ومتكامل',
      labelEn: 'Medium',
      words: '150-300 كلمة',
    },
    {
      id: 'detailed',
      labelAr: 'مفصّل ومعماري',
      labelEn: 'Detailed',
      words: '300-600 كلمة',
    },
  ];

  const toneOptions = [
    'رسمي واحترافي',
    'إبداعي وتسويقي',
    'تقني وبرمجي',
    'تعليمي ومبسط',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Drawer */}
      <div className="relative w-full max-w-xl bg-[#1e1f20] border-t border-[#333537] rounded-t-[32px] p-4 sm:p-5 shadow-2xl flex flex-col gap-4 max-h-[82vh] overflow-y-auto z-10 text-white animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Drag Handle Bar */}
        <div className="w-12 h-1 bg-[#5e6164] rounded-full mx-auto my-1 shrink-0" />

        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-slate-200">
            {lang === 'ar' ? 'فئات هندسة البرومبتات (Daw Ai)' : 'Catégories de Prompts (Daw Ai)'}
          </span>
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? 'اختر مجالك لتخصيص القواعد' : 'Sélectionnez un domaine'}
          </span>
        </div>

        {/* Style Transfer Reverse Engineering Feature Banner */}
        {onOpenStyleTransfer && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenStyleTransfer();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-900/30 via-purple-900/30 to-blue-900/30 border border-amber-500/40 hover:border-amber-400 text-start flex items-center justify-between group transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🔄
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-amber-200">
                    {lang === 'ar' ? 'الهندسة العكسية لنقل الأنماط (صورة ➜ صورة)' : 'Reverse Engineering Style Transfer'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    {lang === 'ar' ? 'مجاني' : 'Free'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'ارفع صورة النمط وصورة الهدف لتوليد برومت ينقل النمط من الأولى للثانية'
                    : 'Extract style from Image 1 and project it onto Image 2'}
                </span>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
              {lang === 'ar' ? 'فتح' : 'Open'}
            </span>
          </button>
        )}

        {/* Circular Action Buttons Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {dawaiCategoryCards.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                const sample = lang === 'ar' ? c.sampleIdeaAr : lang === 'fr' ? c.sampleIdeaFr : c.sampleIdeaEn;
                onSelectCategory(c.id, sample);
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-16 h-16 rounded-full bg-[#282a2c] group-hover:bg-[#333538] group-active:scale-95 border border-[#3c4043] flex items-center justify-center transition-all shadow-md text-2xl">
                {c.icon}
              </div>
              <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate max-w-[72px]">
                {lang === 'ar' ? c.ar : lang === 'fr' ? c.fr : c.en}
              </span>
            </button>
          ))}
        </div>

        {/* Google AdSense Banner */}
        <div className="w-full">
          <AdSenseBanner className="w-full" />
        </div>

        {/* Capability Cards List */}
        <div className="flex flex-col gap-1.5 mt-1">
          {dawaiCategoryCards.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const sample = lang === 'ar' ? item.sampleIdeaAr : lang === 'fr' ? item.sampleIdeaFr : item.sampleIdeaEn;
                onSelectCategory(item.id, sample);
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-[#282a2c]/60 hover:bg-[#282a2c] border border-transparent hover:border-[#383a3c] transition-all flex items-center gap-3.5 text-start group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
                  {lang === 'ar' ? item.ar : lang === 'fr' ? item.fr : item.en}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {lang === 'ar' ? item.sampleIdeaAr : lang === 'fr' ? item.sampleIdeaFr : item.sampleIdeaEn}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Options & Preferences Section (ArabiPrompt V3.0 Configuration) */}
        <div className="pt-2 border-t border-[#333537] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#7cacf8]" />
              <span>{lang === 'ar' ? 'إعدادات توليد البرومت المتقدمة' : 'Paramètres Avancés'}</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#282a2c] text-blue-300 border border-[#3c4043]">
              ArabiPrompt V4.0
            </span>
          </div>

          {/* 1. Delivery Mode Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ar' ? '1. نمط التسليم (Delivery Mode)' : 'Mode de livraison'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {deliveryOptions.map((opt) => {
                const isSelected = deliveryMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryMode && setDeliveryMode(opt.id)}
                    className={`p-2.5 rounded-xl border text-start transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-[#1a273e] border-[#2d4b73] text-white shadow-md'
                        : 'bg-[#18191a]/60 hover:bg-[#252729] text-slate-300 border-[#2d2f31]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{opt.labelAr}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#7cacf8]" />}
                    </div>
                    <span className="text-[10px] text-slate-400 leading-tight">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Detail Level Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ar' ? '2. مستوى التفصيل وطول البرومت (Detail Level)' : 'Niveau de détail'}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {detailOptions.map((opt) => {
                const isSelected = detailLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDetailLevel && setDetailLevel(opt.id)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#1a273e] border-[#2d4b73] text-white shadow-md'
                        : 'bg-[#18191a]/60 hover:bg-[#252729] text-slate-300 border-[#2d2f31]'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.labelAr}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{opt.words}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tone Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ar' ? '3. نبرة الخطاب والأسلوب (Tone)' : 'Tonalité'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {toneOptions.map((t) => {
                const isSelected = tone === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone && setTone(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#1b6ef3] border-[#1b6ef3] text-white shadow-sm'
                        : 'bg-[#282a2c] hover:bg-[#323438] text-slate-300 border-[#3c4043]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
