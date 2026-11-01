import React, { useState } from 'react';
import { X, Search, Copy, Check, Download, ExternalLink, Sparkles, BookOpen, Filter, ArrowUpRight, Scale } from 'lucide-react';
import { promptLibrary, LibraryPromptItem } from '../data/promptLibrary';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string) => void;
  onOpenRules?: () => void;
  lang: 'ar' | 'en' | 'fr';
}

export const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  onOpenRules,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelAr: 'جميع البرومبتات', labelFr: 'Tous les prompts', labelEn: 'All Prompts' },
    { id: 'gemini-api', labelAr: '⚡ Google AI Studio (Gemini SDK)', labelFr: '⚡ Google AI Studio (Gemini SDK)', labelEn: '⚡ Google AI Studio (Gemini SDK)' },
    { id: 'health', labelAr: '🩺 الصحة والطب المبني على البراهين', labelFr: '🩺 Santé & Médecine Factuelle', labelEn: '🩺 Evidence-Based Health' },
    { id: 'photography', labelAr: '🖼️ الصور والسينما', labelFr: '🖼️ Photographie & Art', labelEn: '🖼️ Photography & Art' },
    { id: 'education', labelAr: '🎓 التعليم والتدريس', labelFr: '🎓 Éducation & Enseignement', labelEn: '🎓 Education & Teaching' },
    { id: 'student', labelAr: '📚 الطلاب والبحوث', labelFr: '📚 Tuteur Virtuel & Étudiants', labelEn: '📚 Student & Virtual Tutor' },
    { id: 'framework', labelAr: '📐 أطر هندسة الأوامر', labelFr: '📐 Cadres & Méthodes (COSTAR)', labelEn: '📐 Frameworks (COSTAR/CoT)' },
    { id: 'business', labelAr: '💼 الأعمال والقانون', labelFr: '💼 Affaires & Juridique', labelEn: '💼 Business & Legal' },
    { id: 'creative', labelAr: '✍️ الكتابة الإبداعية', labelFr: '✍️ Écriture Créative', labelEn: '✍️ Creative Writing' },
  ];

  const filteredPrompts = promptLibrary.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.titleAr.toLowerCase().includes(q) ||
      item.titleFr.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.descriptionAr.toLowerCase().includes(q) ||
      item.descriptionFr.toLowerCase().includes(q) ||
      item.descriptionEn.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (item: LibraryPromptItem) => {
    const blob = new Blob([item.prompt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}-prompt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#14151b] border border-[#2d2f31] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#242631] bg-[#101116] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#7cacf8] border border-blue-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {lang === 'ar'
                  ? 'مكتبة البرومبتات الاحترافية المرفقة'
                  : lang === 'fr'
                  ? 'Bibliothèque de Prompts & Méthodologies'
                  : 'Professional Prompt Library'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'مستخرجة مباشرة من ملفات PDF المرفقة (Nano Banana, Enseignants, ObTIC, Promptbook, UCLouvain)'
                  : 'Extraits directement des guides et manuels de prompt engineering fournis'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenRules && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRules();
                }}
                className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض القوانين والميثاق' : 'Lois & Règles'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#252833] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-[#242631] bg-[#14151b] flex flex-col gap-3 shrink-0">
          
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 ltr:left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث في البرومبتات (مثال: بورتريه، 8K، تدريس، COSTAR، تلخيص، عقد)...'
                  : 'Rechercher un prompt (ex: portrait, 8K, enseignement, COSTAR, contrat)...'
              }
              className="w-full bg-[#1e1f25] border border-[#383b48] rounded-2xl py-2.5 px-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#647de8] text-white shadow-sm'
                      : 'bg-[#1e1f25] hover:bg-[#252833] text-slate-300 border border-[#383b48]'
                  }`}
                >
                  {lang === 'ar' ? c.labelAr : lang === 'fr' ? c.labelFr : c.labelEn}
                </button>
              );
            })}
          </div>

        </div>

        {/* Prompts Cards List View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm">
                {lang === 'ar' ? 'لم يتم العثور على برومبتات مطابقة لبحثك' : 'Aucun prompt ne correspond à votre recherche'}
              </p>
            </div>
          ) : (
            filteredPrompts.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#1b1d25] border border-[#2d2f31] p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-lg hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40 truncate">
                      {lang === 'ar' ? item.categoryLabelAr : lang === 'fr' ? item.categoryLabelFr : item.categoryLabelEn}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.defaultModel && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                          {item.defaultModel}
                        </span>
                      )}
                      {item.temperature !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          t:{item.temperature}
                        </span>
                      )}
                      {item.responseMimeType === 'application/json' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40">
                          JSON
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.sourceDoc}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {lang === 'ar' ? item.titleAr : lang === 'fr' ? item.titleFr : item.titleEn}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {lang === 'ar' ? item.descriptionAr : lang === 'fr' ? item.descriptionFr : item.descriptionEn}
                  </p>

                  {/* Code snippet preview */}
                  <div className="rounded-xl bg-[#0e0f13] border border-[#252833] p-3 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                    <code>{item.prompt}</code>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#252833]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item.prompt, item.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#252833] hover:bg-[#323644] text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'ar' ? 'تم النسخ!' : 'Copié!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lang === 'ar' ? 'نسخ' : 'Copier'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1.5 rounded-xl bg-[#252833] hover:bg-[#323644] text-slate-300 hover:text-white transition-colors"
                      title="تحميل كملف TXT"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#647de8] hover:bg-[#758dff] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span>{lang === 'ar' ? 'استخدام في المحادثة' : 'Utiliser ce prompt'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
