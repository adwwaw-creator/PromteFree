import React, { useState } from 'react';
import {
  X,
  Search,
  Edit3,
  LayoutGrid,
  Image as ImageIcon,
  Clock,
  SlidersHorizontal,
  Video,
  Plus,
  Filter,
  Trash2,
  ExternalLink,
  Settings as SettingsIcon,
  Sparkles,
  Scale,
  LogOut,
  User,
  LogIn,
  Globe,
  MapPin,
  Activity,
  Users,
  RotateCcw,
} from 'lucide-react';
import { PromptCategory, UserSession, SupportedLanguage } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { t } from '../utils/translations';
import { VisitorLocation } from '../hooks/useVisitorAnalytics';

interface SavedSession {
  id: string;
  title: string;
  messages: Array<{ idea: string; prompt: string }>;
}

interface GeminiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenLibrary: () => void;
  onOpenRules: () => void;
  onSelectCategory: (cat: PromptCategory, sampleText?: string) => void;
  onSelectHistorySession: (session: SavedSession) => void;
  onClearHistory: () => void;
  sessions: SavedSession[];
  lang: SupportedLanguage;
  setLang?: (lang: SupportedLanguage) => void;
  userSession?: UserSession;
  onSignOut?: () => void;
  onSignIn?: () => void;
  onOpenVisitorAnalytics?: () => void;
  visitorLocation?: VisitorLocation;
  totalVisitors?: number;
  onlineNow?: number;
  onResetToZero?: () => void;
}

export const GeminiSidebar: React.FC<GeminiSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onOpenLibrary,
  onOpenRules,
  onSelectCategory,
  onSelectHistorySession,
  onClearHistory,
  sessions,
  lang,
  setLang,
  userSession = {
    isLoggedIn: true,
    name: 'Adwaw',
    email: 'dawrachid4@gmail.com',
    avatar: './assets/user_avatar.png',
  },
  onSignOut,
  onSignIn,
  onOpenVisitorAnalytics,
  visitorLocation,
  totalVisitors,
  onlineNow,
  onResetToZero,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  if (!isOpen) return null;

  // Preset default history conversations matching official Screenshot 3
  const defaultHistories: SavedSession[] = [
    {
      id: 'default-1',
      title: 'Political Satire Video Generation',
      messages: [{ idea: 'Political satire short film storyboard with comedic dialogue', prompt: '' }],
    },
    {
      id: 'default-2',
      title: 'Temporary Service Outage Notice',
      messages: [{ idea: 'Formal customer apology and system maintenance notice', prompt: '' }],
    },
  ];

  const allSessions = [...sessions, ...defaultHistories.filter((d) => !sessions.some((s) => s.title === d.title))];
  const filteredSessions = filterQuery
    ? allSessions.filter((s) => s.title.toLowerCase().includes(filterQuery.toLowerCase()))
    : allSessions;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Drawer - Exact match to Screenshot 3 */}
      <div className="relative w-full max-w-[300px] sm:max-w-[320px] bg-[#0c0d0e] h-full shadow-2xl flex flex-col z-10 text-slate-100 select-none animate-in slide-in-from-start duration-200">
        
        {/* Top Header: Gemini Title, Search Icon, Close Icon */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="text-xl font-normal text-slate-200 tracking-tight">
            Gemini
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1e1f20] hover:text-white transition-colors"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#1e1f20] hover:text-white transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Search Input */}
        {showSearchInput && (
          <div className="px-4 pb-2">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في المحادثات...' : 'Rechercher...'}
              className="w-full bg-[#1e1f20] border border-[#333537] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              autoFocus
            />
          </div>
        )}

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-1 flex flex-col gap-1 no-scrollbar">
          
          {/* 1. Nouvelle discussion (New Chat) - Pill button with pen */}
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full h-12 rounded-full bg-[#1e1f20] hover:bg-[#282a2c] active:scale-[0.98] text-slate-100 flex items-center gap-3.5 px-4 mb-2 transition-all text-sm font-medium"
          >
            <Edit3 className="w-4 h-4 text-slate-300" />
            <span>{lang === 'ar' ? 'محادثة جديدة' : lang === 'fr' ? 'Nouvelle discussion' : 'New chat'}</span>
          </button>

          {/* 2. Bibliothèque (Prompt Library from attached PDFs) */}
          <button
            onClick={() => {
              onOpenLibrary();
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center justify-between text-sm transition-colors text-start group"
          >
            <div className="flex items-center gap-3.5">
              <LayoutGrid className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium">
                {lang === 'ar' ? 'المكتبة (الملفات المرفقة)' : 'Bibliothèque'}
              </span>
            </div>
            <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-700/40">
              PDF
            </span>
          </button>

          {/* 2.1. Lois du Prompt Engineering (Laws & Frameworks) */}
          <button
            onClick={() => {
              onOpenRules();
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center justify-between text-sm transition-colors text-start group"
          >
            <div className="flex items-center gap-3.5">
              <Scale className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium">
                {lang === 'ar' ? 'قوانين هندسة البرومبت' : 'Lois du Prompt'}
              </span>
            </div>
            <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-700/40">
              10 Lois
            </span>
          </button>

          {/* 3. Images */}
          <button
            onClick={() => {
              onSelectCategory('image', 'صورة بورتريه سينمائية 8K مع عدسة 85mm وإضاءة ناعمة');
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center gap-3.5 text-sm transition-colors text-start"
          >
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span>{lang === 'ar' ? 'توليد الصور' : 'Images'}</span>
          </button>

          {/* 4. Programmé */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center gap-3.5 text-sm transition-colors text-start opacity-75"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{lang === 'ar' ? 'المهام المجدولة' : 'Programmé'}</span>
          </button>

          {/* 5. Personnaliser */}
          <button
            onClick={() => {
              onOpenLibrary();
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center gap-3.5 text-sm transition-colors text-start"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>{lang === 'ar' ? 'تخصيص القوالب' : 'Personnaliser'}</span>
          </button>

          {/* 6. Vidéos */}
          <button
            onClick={() => {
              onSelectCategory('video', 'فيديو سينمائي تسلسلي إعلاني مع حركة كاميرا بطيئة');
              onClose();
            }}
            className="w-full px-4 py-2.5 rounded-full hover:bg-[#1e1f20] text-slate-200 hover:text-white flex items-center gap-3.5 text-sm transition-colors text-start"
          >
            <Video className="w-4 h-4 text-slate-400" />
            <span>{lang === 'ar' ? 'الفيديو' : 'Vidéos'}</span>
          </button>

          {/* Notebooks Section */}
          <div className="pt-4 pb-1">
            <span className="px-4 text-xs font-semibold text-slate-400 tracking-wide">
              Notebooks
            </span>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full px-4 py-2 rounded-full hover:bg-[#1e1f20] text-slate-300 hover:text-white flex items-center gap-3 text-sm transition-colors text-start"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>{lang === 'ar' ? 'دفتر جديد' : 'Nouveau notebook'}</span>
          </button>

          {/* Toutes / History Section */}
          <div className="pt-4 pb-1 flex items-center justify-between px-4 text-xs font-semibold text-slate-400">
            <span>{lang === 'ar' ? 'كل المحادثات' : 'Toutes'}</span>
            <div className="flex items-center gap-1.5">
              {sessions.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="hover:text-rose-400 transition-colors p-1"
                  title="Effacer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <Filter className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Conversation History List (matching Screenshot 3) */}
          <div className="flex flex-col gap-0.5">
            {filteredSessions.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => {
                  onSelectHistorySession(s);
                  onClose();
                }}
                className="w-full px-4 py-2.5 rounded-2xl text-start transition-colors text-xs font-normal truncate text-slate-300 hover:bg-[#1e1f20] hover:text-white"
                title={s.title}
              >
                {s.title}
              </button>
            ))}
          </div>

        </div>

        {/* Multilingual Selector inside Sidebar */}
        {setLang && (
          <div className="px-3.5 py-2.5 border-t border-[#1e1f20] bg-[#0c0d0f]">
            <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#7cacf8]" />
                <span>{t('language', lang)}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">9 languages</span>
            </div>
            <LanguageSwitcher
              currentLang={lang}
              onChangeLanguage={setLang}
              variant="drawer"
            />
          </div>
        )}

        {/* Visitor Counter & Geolocation Card in Drawer */}
        <div className="mx-3 my-2 p-3 rounded-2xl bg-gradient-to-br from-[#121829] to-[#151c33] border border-cyan-500/30 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'عداد الزوار الفعلي' : lang === 'fr' ? 'Compteur Réel' : 'Real Visitors Counter'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {onlineNow ?? 0} {lang === 'ar' ? 'نشط الآن' : 'online'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1 px-2 rounded-xl bg-black/40 border border-[#222b44] mb-2 font-mono">
            <span className="text-slate-400 text-[11px]">{lang === 'ar' ? 'إجمالي الزيارات:' : 'Total visits:'}</span>
            <span className="font-bold text-white tracking-wide">{(totalVisitors ?? 0).toLocaleString()}</span>
          </div>

          {visitorLocation && (
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {lang === 'ar' ? 'موقعك:' : 'Votre pays:'}
              </span>
              <span className="font-semibold text-white flex items-center gap-1 text-[11px]">
                <span>{visitorLocation.flag}</span>
                <span className="truncate max-w-[130px]">{visitorLocation.country}</span>
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {onOpenVisitorAnalytics && (
              <button
                type="button"
                onClick={() => {
                  onOpenVisitorAnalytics();
                  onClose();
                }}
                className="w-full py-1.5 px-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض التوزيع الجغرافي للدول' : 'Voir la carte des pays'}</span>
              </button>
            )}

            {onResetToZero && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(lang === 'ar' ? 'هل تريد تصفير عداد الزوار والبدء من الصفر؟' : 'Remettre le compteur à zéro ?')) {
                    onResetToZero();
                  }
                }}
                className="w-full py-1 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                title={lang === 'ar' ? 'إعادة الحساب من الصفر' : 'Remettre à 0'}
              >
                <RotateCcw className="w-3 h-3 text-rose-400" />
                <span>{lang === 'ar' ? 'إعادة الحساب من الصفر' : 'Remise à zéro'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Profile & Authentication Section */}
        <div className="p-3.5 bg-[#0e1012] border-t border-[#1e1f20] flex flex-col gap-2">
          {userSession.isLoggedIn ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={userSession.avatar || './assets/user_avatar.png'}
                      alt={userSession.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#5f6368] shadow-sm"
                      onError={(e) => {
                        // Fallback in case image fails to load
                        (e.target as HTMLImageElement).src = './assets/user_avatar.png';
                      }}
                    />
                    <span className="absolute bottom-0 end-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e1012]" />
                  </div>
                  <div className="flex flex-col text-start min-w-0">
                    <span className="text-xs font-semibold text-white leading-tight truncate">
                      {userSession.name || 'Adwaw'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      {userSession.email || 'dawrachid4@gmail.com'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onOpenLibrary();
                    onClose();
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1e1f20] transition-colors shrink-0"
                  title={lang === 'ar' ? 'المكتبة والإعدادات' : 'Bibliothèque & Paramètres'}
                  aria-label="Settings"
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Dedicated Sign-Out Action Button */}
              <button
                onClick={() => {
                  if (onSignOut) {
                    onSignOut();
                  }
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition-all text-xs font-semibold active:scale-[0.98]"
                title={lang === 'ar' ? 'تسجيل الخروج من حساب dawrachid4@gmail.com' : 'Déconnexion'}
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'تسجيل الخروج'
                    : lang === 'fr'
                    ? 'Se déconnecter'
                    : 'Sign out'}
                </span>
              </button>
            </div>
          ) : (
            /* Logged Out State in Sidebar */
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1e1f20] border border-dashed border-[#5f6368] flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-medium text-slate-200">
                    {lang === 'ar' ? 'غير متصل بحساب' : lang === 'fr' ? 'Non connecté' : 'Not signed in'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'سجّل الدخول للمزامنة' : 'Connectez-vous'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSignIn) {
                    onSignIn();
                  }
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1b66ca] text-white text-xs font-medium transition-all shadow-md active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'تسجيل الدخول كـ Adwaw'
                    : lang === 'fr'
                    ? 'Se connecter en tant que Adwaw'
                    : 'Sign in as Adwaw'}
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
