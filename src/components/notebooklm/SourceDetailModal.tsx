import React, { useState } from 'react';
import { X, FileText, Search, Copy, Check, Hash, Calendar, Globe, Sparkles } from 'lucide-react';
import { SourceItem } from '../../types/notebooklm';

interface SourceDetailModalProps {
  source: SourceItem | null;
  onClose: () => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  lang = 'ar',
}) => {
  const [searchWord, setSearchWord] = useState('');
  const [copied, setCopied] = useState(false);

  if (!source) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-[#1e1f20] border border-[#3c4043] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in zoom-in-95 duration-150"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d2f31] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              {source.type === 'url' ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                {source.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{source.wordCount} {lang === 'ar' ? 'كلمة' : 'words'}</span>
                <span>·</span>
                <span>{source.charCount} {lang === 'ar' ? 'حرف' : 'chars'}</span>
                <span>·</span>
                <span>{source.addedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
              title={lang === 'ar' ? 'نسخ محتوى المصدر' : 'Copy Source Text'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source Summary & Key Topics Banner */}
        <div className="px-5 py-3.5 bg-[#131314] border-b border-[#2d2f31] flex flex-col gap-2.5 shrink-0">
          {source.summary && (
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#7cacf8] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-[#c2e7ff]">{lang === 'ar' ? 'ملخص المصدر:' : 'Summary:'} </span>
                {source.summary}
              </p>
            </div>
          )}

          {source.keyTopics && source.keyTopics.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === 'ar' ? 'المفاهيم المحورية:' : 'Key Topics:'}
              </span>
              {source.keyTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#252729] text-slate-300 border border-[#383a3c] text-[11px]"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Search inside Document */}
        <div className="px-5 py-2.5 border-b border-[#2d2f31] flex items-center gap-2 shrink-0 bg-[#1e1f20]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في نص المصدر...' : 'Search inside source...'}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          {searchWord && (
            <button
              onClick={() => setSearchWord('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Full Text Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-zinc-700">
          {source.content}
        </div>
      </div>
    </div>
  );
};
