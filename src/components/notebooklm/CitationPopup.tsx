import React from 'react';
import { X, ExternalLink, Bookmark, Check } from 'lucide-react';
import { CitationRef } from '../../types/notebooklm';

interface CitationPopupProps {
  citation: CitationRef | null;
  onClose: () => void;
  onViewSource?: (sourceId: string) => void;
  onSaveToNote?: (citation: CitationRef) => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const CitationPopup: React.FC<CitationPopupProps> = ({
  citation,
  onClose,
  onViewSource,
  onSaveToNote,
  lang = 'ar',
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!citation) return null;

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(citation.quote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#1e1f20] border border-[#3c4043] rounded-2xl shadow-2xl overflow-hidden p-5 text-slate-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1b6ef3]/20 border border-[#1b6ef3] text-[#7cacf8] text-xs font-bold flex items-center justify-center">
              {citation.citationId}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === 'ar' ? 'استشهاد موثق من المصدر' : 'Verified Source Citation'}
              </span>
              <span className="text-sm font-semibold text-white truncate max-w-[280px] sm:max-w-[360px]">
                {citation.sourceTitle}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quoted Passage */}
        <div className="p-3.5 rounded-xl bg-[#131314] border border-[#2d2f31] relative">
          <span className="text-xs text-slate-400 block mb-1.5 font-medium">
            {lang === 'ar' ? 'النص المقتبس حرفياً:' : 'Direct Quoted Excerpt:'}
          </span>
          <p className="text-sm text-slate-200 leading-relaxed font-sans italic border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 border-[#7cacf8] pr-3 rtl:pr-3 ltr:pl-3">
            "{citation.quote}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2">
            {onViewSource && (
              <button
                type="button"
                onClick={() => {
                  onViewSource(citation.sourceId);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-[#c2e7ff] hover:text-white flex items-center gap-1.5 transition-colors font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض المصدر بالكامل' : 'View Full Source'}</span>
              </button>
            )}

            {onSaveToNote && (
              <button
                type="button"
                onClick={() => {
                  onSaveToNote(citation);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'حفظ في الملاحظات' : 'Save to Notes'}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyQuote}
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#282a2c] transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <span>{lang === 'ar' ? 'نسخ الاقتباس' : 'Copy Quote'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
