import React, { useState } from 'react';
import {
  Plus,
  FileText,
  Globe,
  Trash2,
  Eye,
  Search,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { SourceItem } from '../../types/notebooklm';

interface SourcesPanelProps {
  sources: SourceItem[];
  onToggleSource: (sourceId: string) => void;
  onToggleAllSources: (selected: boolean) => void;
  onDeleteSource: (sourceId: string) => void;
  onViewSource: (source: SourceItem) => void;
  onOpenAddModal: () => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  sources,
  onToggleSource,
  onToggleAllSources,
  onDeleteSource,
  onViewSource,
  onOpenAddModal,
  lang = 'ar',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = sources.filter((s) => s.isSelected).length;
  const allSelected = sources.length > 0 && activeCount === sources.length;

  const filteredSources = sources.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.summary && s.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col bg-[#111214] border-r rtl:border-r-0 rtl:border-l border-[#2d2f31] text-slate-100 select-none overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="p-4 border-b border-[#2d2f31] flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-white">
              {lang === 'ar' ? 'المصادر' : 'Sources'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#202225] text-slate-400 border border-[#383a3c] font-mono">
              {sources.length}
            </span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة مصدر' : 'Add Source'}</span>
          </button>
        </div>

        {/* Source Active Selection Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => onToggleAllSources(!allSelected)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-[#7cacf8]" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>
              {lang === 'ar'
                ? allSelected
                  ? 'إلغاء تحديد الكل'
                  : 'تحديد كل المصادر'
                : allSelected
                ? 'Deselect All'
                : 'Select All'}
            </span>
          </button>

          <span className="text-[11px] font-mono text-[#c2e7ff]">
            {lang === 'ar'
              ? `${activeCount} من ${sources.length} نشطة`
              : `${activeCount}/${sources.length} active`}
          </span>
        </div>

        {/* Search Sources Input */}
        {sources.length > 2 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في المصادر...' : 'Search sources...'}
              className="w-full bg-[#1e1f20] border border-[#2d2f31] rounded-xl py-1.5 px-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8]"
            />
          </div>
        )}
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {sources.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-5 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-[#1e1f20] flex items-center justify-center text-slate-500 mb-3 border border-dashed border-[#383a3c]">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-white mb-1">
              {lang === 'ar' ? 'لا توجد مصادر بعد' : 'No sources yet'}
            </p>
            <p className="text-[11px] text-slate-400 mb-3 max-w-[200px]">
              {lang === 'ar'
                ? 'أضف وثائق أو روابط أو نصوص لتبدأ الدردشة والاستوديو الصوتي.'
                : 'Add documents, links, or notes to ground your notebook.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-xs font-semibold text-[#c2e7ff] transition-colors"
            >
              {lang === 'ar' ? 'إضافة أول مصدر' : 'Add First Source'}
            </button>
          </div>
        ) : (
          filteredSources.map((source) => (
            <div
              key={source.id}
              className={`p-3 rounded-2xl transition-all border group flex flex-col gap-2 ${
                source.isSelected
                  ? 'bg-[#181a20] border-[#3c4043] shadow-sm'
                  : 'bg-[#131416]/50 border-transparent opacity-65 hover:opacity-100 hover:bg-[#181a20]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleSource(source.id)}
                  className="mt-0.5 text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  {source.isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#7cacf8]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {/* Source Icon & Title */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => onViewSource(source)}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-slate-400 shrink-0">
                      {source.type === 'url' ? (
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </span>
                    <h3 className="text-xs font-semibold text-white truncate leading-tight group-hover:text-[#c2e7ff] transition-colors">
                      {source.title}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                    {source.summary || source.content.slice(0, 110)}
                  </p>
                </div>
              </div>

              {/* Source Meta & Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-500">
                <span className="font-mono">
                  {source.wordCount} {lang === 'ar' ? 'كلمة' : 'words'}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onViewSource(source)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={lang === 'ar' ? 'معاينة المصدر' : 'Inspect'}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSource(source.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title={lang === 'ar' ? 'حذف المصدر' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
