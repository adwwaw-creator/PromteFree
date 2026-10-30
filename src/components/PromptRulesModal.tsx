import React, { useState } from 'react';
import { X, Scale, Copy, Check, ShieldCheck, Sparkles, BookOpen, Layers, Camera, Code2, GraduationCap, Film } from 'lucide-react';
import { promptRules, PromptRuleItem } from '../data/promptRules';

interface PromptRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (template: string) => void;
  lang: 'ar' | 'en' | 'fr';
}

export const PromptRulesModal: React.FC<PromptRulesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelAr: 'جميع القوانين (10)', labelEn: 'All Laws (10)', labelFr: 'Toutes les lois' },
    { id: 'core', labelAr: 'القواعد الجوهرية الذهبية', labelEn: 'Core Golden Rules', labelFr: 'Règles d’Or' },
    { id: 'framework', labelAr: 'أطر العمل (COSTAR / RTFC)', labelEn: 'Frameworks (COSTAR/RTFC)', labelFr: 'Cadres Méthodologiques' },
    { id: 'visual', labelAr: 'قوانين التصوير 8K', labelEn: '8K Photography Optics', labelFr: 'Photographie 8K' },
    { id: 'pedagogy', labelAr: 'التعليم والميثاق السقراطي', labelEn: 'Pedagogy & Socratic AI', labelFr: 'Pédagogie & Éthique' },
    { id: 'code', labelAr: 'البرمجة والأمان (SOLID)', labelEn: 'Clean Code & Security', labelFr: 'Architecture Code' },
    { id: 'video', labelAr: 'السينما والفيديو (10s Pacing)', labelEn: 'Cinema & Video Pacing', labelFr: 'Cinéma & Vidéo' },
  ];

  const filteredRules = promptRules.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'core':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'framework':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'visual':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'pedagogy':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'code':
        return <Code2 className="w-4 h-4 text-sky-400" />;
      case 'video':
        return <Film className="w-4 h-4 text-rose-400" />;
      default:
        return <Scale className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#121318] border border-[#2d2f38] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#252834] bg-[#0e0f14] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {lang === 'ar'
                    ? 'ميثاق وقوانين هندسة البرومبت'
                    : lang === 'fr'
                    ? 'Charte & Lois du Prompt Engineering'
                    : 'The Laws of Prompt Engineering'}
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  Daw Ai & ObTIC
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'القواعد العشرة الذهبية المعتمدة لصياغة وتنفيذ الأوامر الاحترافية بدقة 100%'
                  : 'Les 10 règles fondamentales pour concevoir et exécuter des méta-prompts parfaits'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#20222a] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="p-3 sm:p-4 border-b border-[#22242e] bg-[#14151b] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-[#1b1c24] hover:bg-[#252834] text-slate-300 border border-[#2f3240]'
                }`}
              >
                {lang === 'ar' ? c.labelAr : lang === 'fr' ? c.labelFr : c.labelEn}
              </button>
            );
          })}
        </div>

        {/* Laws & Rules List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => {
            const isCopied = copiedId === rule.id;
            return (
              <div
                key={rule.id}
                className="rounded-3xl bg-[#171920] border border-[#2b2d38] p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xl hover:border-amber-500/40 transition-colors"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Top Bar of the Rule Card */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#20232c] text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                      #{rule.number}
                    </span>
                    <span className="text-[11px] bg-[#222530] text-slate-300 border border-[#343746] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium">
                      {getCategoryIcon(rule.category)}
                      <span>{rule.badge}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {lang === 'ar' ? rule.titleAr : rule.titleEn}
                  </h3>

                  {/* Principle Quote Box */}
                  <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs sm:text-sm font-medium leading-relaxed">
                    « {lang === 'ar' ? rule.principleAr : rule.principleEn} »
                  </div>

                  {/* Detailed Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar' ? rule.explanationAr : rule.explanationEn}
                  </p>

                  {/* Source Reference Tag */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{rule.sourceDoc}</span>
                  </div>
                </div>

                {/* Template Code Snippet & Action Buttons */}
                <div className="pt-3 border-t border-[#252834] flex flex-col gap-2">
                  <pre
                    className="p-2.5 rounded-xl bg-[#0e0f14] border border-[#252733] text-[11px] font-mono text-slate-300 leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap select-all text-left"
                    dir="ltr"
                  >
                    <code>{rule.templatePrompt}</code>
                  </pre>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(rule.templatePrompt, rule.id)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#20232c] hover:bg-[#2b2e3a] text-slate-200 hover:text-white border border-[#333644] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">{lang === 'ar' ? 'تم نسخ القانون!' : 'Copié !'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'نسخ صيغة القانون' : 'Copier la formule'}</span>
                        </>
                      )}
                    </button>

                    {onApplyTemplate && (
                      <button
                        onClick={() => {
                          onApplyTemplate(rule.templatePrompt);
                          onClose();
                        }}
                        className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shrink-0 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'استخدام' : 'Appliquer'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
