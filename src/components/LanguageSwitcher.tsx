import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, saveAppLanguage, getLanguageMetadata } from '../utils/translations';

interface LanguageSwitcherProps {
  currentLang: SupportedLanguage;
  onChangeLanguage: (newLang: SupportedLanguage) => void;
  variant?: 'header' | 'select' | 'compact' | 'drawer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onChangeLanguage,
  variant = 'header',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMeta = getLanguageMetadata(currentLang);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    saveAppLanguage(code);
    onChangeLanguage(code);
    setIsOpen(false);
  };

  // Render variant 1: Native styled select (great for forms or bottom sheet)
  if (variant === 'select') {
    return (
      <div className={`relative inline-block ${className}`}>
        <select
          value={currentLang}
          onChange={(e) => handleSelect(e.target.value as SupportedLanguage)}
          aria-label="Select language"
          className="w-full appearance-none rounded-xl bg-[#1e1f20] text-slate-200 border border-[#3c4043] px-3.5 py-2.5 text-xs font-medium hover:border-[#5f6368] focus:border-[#7cacf8] focus:outline-none transition-colors cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((item) => (
            <option key={item.code} value={item.code} className="bg-[#1e1f20] text-white">
              {item.flag} {item.nativeName} ({item.name})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }

  // Render variant 2: Drawer list items
  if (variant === 'drawer') {
    return (
      <div className={`grid grid-cols-3 gap-1.5 p-2 bg-[#131314] rounded-2xl border border-[#2d2f31] ${className}`}>
        {SUPPORTED_LANGUAGES.map((item) => {
          const isSelected = item.code === currentLang;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#1b6ef3] text-white font-semibold shadow-md'
                  : 'bg-[#1e1f20] text-slate-300 hover:text-white hover:bg-[#282a2c] border border-transparent hover:border-[#3c4043]'
              }`}
              title={`${item.nativeName} (${item.name})`}
            >
              <span className="text-sm">{item.flag}</span>
              <span className="truncate">{item.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Render variant 3: Header Interactive Dropdown (Default)
  return (
    <div className={`relative inline-block text-start ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#1e1f20]/90 hover:bg-[#2a2c2e] border border-[#3c4043] hover:border-[#5f6368] text-slate-200 text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
        title="تغيير لغة الموقع / Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#7cacf8] shrink-0" />
        <span className="text-sm leading-none">{currentMeta.flag}</span>
        <span className="hidden md:inline font-medium text-slate-200">{currentMeta.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="listbox"
            aria-label="Available languages"
            className="fixed sm:absolute top-14 sm:top-full mt-2 left-2 sm:left-auto right-2 sm:right-0 w-auto sm:w-64 max-w-[calc(100vw-16px)] bg-[#1e1f20] border border-[#3c4043] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-white"
          >
            {/* Header / Title */}
            <div className="px-3 py-2 border-b border-[#2d2f31] flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#7cacf8]" />
                <span>اللغات المدعومة / Languages</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#282a2c] text-slate-400">
                {SUPPORTED_LANGUAGES.length}
              </span>
            </div>

            {/* List of 9 Supported Languages */}
            <div className="max-h-72 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-zinc-700">
              {SUPPORTED_LANGUAGES.map((item) => {
                const isSelected = item.code === currentLang;
                return (
                  <button
                    key={item.code}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-[#1a273e] text-[#c2e7ff] font-semibold border border-[#2d4b73]'
                        : 'text-slate-300 hover:text-white hover:bg-[#282a2c] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.flag}</span>
                      <div className="flex flex-col text-start">
                        <span className="leading-tight">{item.nativeName}</span>
                        <span className="text-[10px] text-slate-400">{item.name}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#7cacf8] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
