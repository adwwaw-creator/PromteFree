import React from 'react';
import { Cpu, Terminal, Shield, Play } from 'lucide-react';

interface HeaderProps {
  activeTab: 'origins' | 'sandbox' | 'hex' | 'challenges' | 'reference';
  setActiveTab: (tab: 'origins' | 'sandbox' | 'hex' | 'challenges' | 'reference') => void;
  englishMode: boolean;
  setEnglishMode: (val: boolean) => void;
  onLaunchSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  englishMode,
  setEnglishMode,
  onLaunchSimulator,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0f17]/95 backdrop-blur-md border-b border-[#1e293b] px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <button
            onClick={() => setActiveTab('origins')}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap text-right"
          >
            {englishMode ? 'Reverse Engineering Studio' : 'أصل الهندسة العكسية'}
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveTab('origins')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'origins'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {englishMode ? 'Origins & History' : 'الأصل والتاريخ'}
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sandbox'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {englishMode ? 'Disassembly Sandbox' : 'مختبر التفكيك'}
          </button>

          <button
            onClick={() => setActiveTab('hex')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'hex'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {englishMode ? 'Hex & PE Format' : 'محرر الهيكس وبنية الملفات'}
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'challenges'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {englishMode ? 'Crackme Challenges' : 'تحديات كسر الحماية'}
          </button>

          <button
            onClick={() => setActiveTab('reference')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'reference'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {englishMode ? 'Assembly Reference' : 'مرجع Assembly'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action & language toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setEnglishMode(!englishMode)}
            className="px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            title="Toggle Arabic / English terminology"
          >
            {englishMode ? 'AR عربي' : 'EN Terms'}
          </button>

          <button
            onClick={onLaunchSimulator}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{englishMode ? 'Open Sandbox' : 'تشغيل المختبر'}</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="flex md:hidden items-center justify-between gap-2 overflow-x-auto pt-3 border-t border-slate-800/60 mt-2 text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('origins')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'origins' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
        >
          {englishMode ? 'Origins' : 'الأصل'}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'sandbox' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
        >
          {englishMode ? 'Sandbox' : 'التفكيك'}
        </button>
        <button
          onClick={() => setActiveTab('hex')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'hex' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
        >
          {englishMode ? 'Hex View' : 'الهيكس'}
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'challenges' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
        >
          {englishMode ? 'Crackme' : 'التحديات'}
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'reference' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'}`}
        >
          {englishMode ? 'Assembly' : 'المرجع'}
        </button>
      </div>
    </header>
  );
};
