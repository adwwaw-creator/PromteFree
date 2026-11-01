import React, { useState } from 'react';
import { ASM_REFERENCE } from '../data/assemblyReference';
import { AsmDocItem } from '../types/reverseEngineering';
import { Search, BookMarked, Terminal, HelpCircle, Code } from 'lucide-react';

interface InstructionReferenceProps {
  englishMode: boolean;
}

export const InstructionReference: React.FC<InstructionReferenceProps> = ({ englishMode }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', ar: 'جميع الأوامر', en: 'All Instructions' },
    { id: 'نقل البيانات', ar: 'نقل البيانات', en: 'Data Movement' },
    { id: 'منطقية ومقارنات', ar: 'منطقية ومقارنات', en: 'Logic & Comparisons' },
    { id: 'تحكم بالتدفق', ar: 'تحكم بالتدفق', en: 'Control Flow' },
    { id: 'المكدس والدوال', ar: 'المكدس والدوال', en: 'Stack & Functions' },
  ];

  const filteredInstructions = ASM_REFERENCE.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery =
      item.mnemonic.toLowerCase().includes(q) ||
      item.fullName.toLowerCase().includes(q) ||
      item.descriptionAr.toLowerCase().includes(q) ||
      item.descriptionEn.toLowerCase().includes(q) ||
      item.idiomAr.toLowerCase().includes(q) ||
      item.idiomEn.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <BookMarked className="w-4 h-4" />
          <span>{englishMode ? 'REVERSE ENGINEERING DICTIONARY' : 'معجم أوامر التجميع للمهندس العكسي'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          {englishMode ? 'x86-64 Instruction Reference & Reversing Idioms' : 'دليل تعليمات x86-64 والأنماط الشائعة في التفكيك'}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
          {englishMode
            ? 'Quickly decipher compiler tricks, zeroing idioms, stack frames, and conditional branch mechanics.'
            : 'مرجع سريع وشامل لفهم حيل المترجمات، تصفير السجلات، بناء إطارات المكدس، وتفسير القفزات الشرطية أثناء التحليل العكسي.'}
        </p>

        {/* Search & Category Filter bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={englishMode ? 'Search by instruction (e.g. mov, lea, xor)...' : 'ابحث عن أمر أو نمط (مثال: mov, lea, xor)...'}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {englishMode ? cat.en : cat.ar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instruction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInstructions.map((item) => (
          <div
            key={item.mnemonic}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
          >
            {/* Title & Syntax Header */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono text-emerald-400">{item.mnemonic}</span>
                  <span className="text-xs text-slate-400 font-medium">({item.fullName})</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">{item.syntax}</div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {item.architecture}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {englishMode ? item.descriptionEn : item.descriptionAr}
            </p>

            {/* Reversing Idiom Highlight */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 block font-mono">
                {englishMode ? 'REVERSING IDIOM / PATTERN:' : 'النمط الشائع في الهندسة العكسية:'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {englishMode ? item.idiomEn : item.idiomAr}
              </p>
            </div>

            {/* Example & Flags */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>{englishMode ? 'Flags Affected:' : 'الرايات المتأثرة:'}</span>
                <span className="font-mono text-slate-300">{item.flagsAffected}</span>
              </div>
              <div className="bg-[#070b12] p-2 rounded border border-slate-800/80 font-mono text-indigo-300 overflow-x-auto">
                <pre className="m-0 text-[11px]">{item.example}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
