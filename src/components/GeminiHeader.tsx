import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Globe, LogOut, User, UserPlus, X, Shield, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { TargetModel, UserSession } from '../types';

interface GeminiHeaderProps {
  currentModel: TargetModel;
  onSelectModel: (model: TargetModel) => void;
  onOpenDrawer: () => void;
  onNewChat: () => void;
  lang: 'ar' | 'en' | 'fr';
  setLang: (lang: 'ar' | 'en' | 'fr') => void;
  userSession?: UserSession;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

export const GeminiHeader: React.FC<GeminiHeaderProps> = ({
  currentModel,
  onSelectModel,
  onOpenDrawer,
  onNewChat,
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
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [internalLoggedIn, setInternalLoggedIn] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoggedIn = userSession ? userSession.isLoggedIn : internalLoggedIn;
  const userName = userSession?.name || 'Adwaw';
  const userEmail = userSession?.email || 'dawrachid4@gmail.com';
  const userAvatar = userSession?.avatar || './assets/user_avatar.png';

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setModelDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    if (onSignOut) {
      onSignOut();
    } else {
      setInternalLoggedIn(false);
      showToast(
        lang === 'ar'
          ? 'تم تسجيل الخروج من حساب Adwaw بنجاح'
          : lang === 'fr'
          ? 'Déconnexion du compte Adwaw réussie'
          : 'Signed out of Adwaw successfully'
      );
    }
  };

  const handleSignIn = () => {
    setUserMenuOpen(false);
    if (onSignIn) {
      onSignIn();
    } else {
      setInternalLoggedIn(true);
      showToast(
        lang === 'ar'
          ? 'تم تسجيل الدخول بحساب Adwaw (dawrachid4@gmail.com)'
          : lang === 'fr'
          ? 'Connecté en tant que Adwaw (dawrachid4@gmail.com)'
          : 'Signed in as Adwaw (dawrachid4@gmail.com)'
      );
    }
  };

  const [modelFilter, setModelFilter] = useState<'all' | 'gemini' | 'agents'>('all');

  interface ModelItem {
    id: TargetModel;
    name: string;
    provider: string;
    group: 'gemini' | 'agents';
    icon: string;
    badgeAr: string;
    badgeFr: string;
    badgeEn: string;
    badgeColor: string;
    subFr: string;
    subAr: string;
    subEn: string;
    directUrl: string;
  }

  const modelsList: ModelItem[] = [
    // عائلة Gemini
    {
      id: 'gemini-flash-lite',
      name: 'Gemini Flash-Lite',
      provider: 'Google',
      group: 'gemini',
      icon: '✨',
      badgeAr: 'سريع واقتصادي',
      badgeFr: 'Rapide & Éco',
      badgeEn: 'Fast & Lite',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      subFr: 'Ultra-rapide et économique',
      subAr: 'فائق السرعة واقتصادي',
      subEn: 'Ultra-fast and cost-effective',
      directUrl: 'https://gemini.google.com/app',
    },
    {
      id: 'gemini-3-8-flash',
      name: 'Gemini 3.8 Flash',
      provider: 'Google',
      group: 'gemini',
      icon: '⚡',
      badgeAr: 'الرائد',
      badgeFr: 'Flagship',
      badgeEn: 'Flagship',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      subFr: 'Modèle phare pour textes et prompts',
      subAr: 'النموذج الرائد للنصوص والبرومبتات',
      subEn: 'Flagship model for text and prompts',
      directUrl: 'https://gemini.google.com/app',
    },
    {
      id: 'gemini-4-argon',
      name: 'Gemini 4 Argon (Pro)',
      provider: 'Google',
      group: 'gemini',
      icon: '🧠',
      badgeAr: 'تفكير متقدم',
      badgeFr: 'Raisonnement',
      badgeEn: 'Reasoning',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      subFr: 'Raisonnement complexe et programmation',
      subAr: 'تفكير منطقي عميق وبرمجة متقدمة',
      subEn: 'Complex reasoning and programming',
      directUrl: 'https://gemini.google.com/app',
    },
    {
      id: 'gemini-3-1-image',
      name: 'Gemini 3.1 Flash-Lite Image',
      provider: 'Google',
      group: 'gemini',
      icon: '🎨',
      badgeAr: 'توليد الصور',
      badgeFr: 'Images',
      badgeEn: 'Images',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      subFr: 'Dédié à la génération et édition d’images',
      subAr: 'مخصص لتوليد وتعديل الصور بدقة عالية',
      subEn: 'Dedicated to image generation and editing',
      directUrl: 'https://gemini.google.com/app',
    },
    // وكلاء الذكاء الاصطناعي الرواد (ChatGPT, Claude, DeepSeek, Manus, Llama, Qwen)
    {
      id: 'chatgpt-4o',
      name: 'ChatGPT-4o',
      provider: 'OpenAI',
      group: 'agents',
      icon: '🤖',
      badgeAr: 'الأكثر شمولاً',
      badgeFr: 'Polyvalent',
      badgeEn: 'Omni',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      subFr: 'Modèle phare polyvalent d’OpenAI pour texte et multimodal',
      subAr: 'نموذج OpenAI الرائد الأكثر شمولاً وتكاملاً للذكاء الاصطناعي',
      subEn: 'OpenAI flagship model for reasoning and multimodality',
      directUrl: 'https://chatgpt.com/',
    },
    {
      id: 'claude-3-7-sonnet',
      name: 'Claude 3.7 Sonnet',
      provider: 'Anthropic',
      group: 'agents',
      icon: '🎭',
      badgeAr: 'استدلال وكود',
      badgeFr: 'Code & Élite',
      badgeEn: 'Hybrid Elite',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      subFr: 'Raisonnement hybride avancé, rédaction et programmation',
      subAr: 'استدلال هجين متقدم، كتابة إبداعية وهندسة برمجية متفوقة',
      subEn: 'Advanced hybrid reasoning, elite coding & nuanced writing',
      directUrl: 'https://claude.ai/new',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek (R1 & V3)',
      provider: 'DeepSeek',
      group: 'agents',
      icon: '🐋',
      badgeAr: 'استدلال عميق',
      badgeFr: 'Raisonnement R1',
      badgeEn: 'Deep Reasoning',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      subFr: 'Raisonnement mathématique et logique open-source ultra-profond',
      subAr: 'استدلال منطقي ورياضي عميق وتفكير متدرج مفتوح المصدر',
      subEn: 'Deep open-weights reasoning, math & algorithmic logic',
      directUrl: 'https://chat.deepseek.com/',
    },
    {
      id: 'manus',
      name: 'Manus AI Agent',
      provider: 'Manus',
      group: 'agents',
      icon: '⚡',
      badgeAr: 'وكيل تنفيذي مستقل',
      badgeFr: 'Agent Autonome',
      badgeEn: 'Autonomous Agent',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      subFr: 'Agent autonome pour l’exécution de tâches complètes',
      subAr: 'وكيل ذكاء اصطناعي تنفيذي مستقل للمهام والأتمتة الشاملة',
      subEn: 'General autonomous execution agent for complex workflows',
      directUrl: 'https://manus.im/',
    },
    {
      id: 'llama',
      name: 'Meta Llama (3.3 70B)',
      provider: 'Meta',
      group: 'agents',
      icon: '🦙',
      badgeAr: 'مفتوح المصدر',
      badgeFr: 'Open Source',
      badgeEn: 'Open Source',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      subFr: 'Le modèle open-source le plus puissant de Meta (70B)',
      subAr: 'أقوى نموذج مفتوح المصدر للاستخدام السريع والحر من Meta',
      subEn: 'Industry-leading open-weights 70B model by Meta AI',
      directUrl: 'https://www.meta.ai/',
    },
    {
      id: 'qwen',
      name: 'Qwen 2.5 (Alibaba)',
      provider: 'Alibaba',
      group: 'agents',
      icon: '🔮',
      badgeAr: 'متعدد اللغات وكود',
      badgeFr: 'Multilingue & Code',
      badgeEn: 'Multilingual Code',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      subFr: 'Excellence en programmation et multilinguisme mondial',
      subAr: 'قوة استثنائية في البرمجة ودعم اللغات العالمية والعربية الفصحى',
      subEn: 'Exceptional multilingual reasoning & coding benchmark leader',
      directUrl: 'https://chat.qwenlm.ai/',
    },
  ];

  const currentModelData =
    modelsList.find(
      (m) =>
        m.id === currentModel ||
        (m.id === 'deepseek' && currentModel === 'deepseek-r1') ||
        (m.id === 'manus' && currentModel === 'manus-agent') ||
        (m.id === 'llama' && currentModel === 'llama-3-3') ||
        (m.id === 'qwen' && currentModel === 'qwen-2-5')
    ) || modelsList[0];

  const filteredModels = modelsList.filter((m) => {
    if (modelFilter === 'all') return true;
    return m.group === modelFilter;
  });

  return (
    <header className="sticky top-0 z-40 relative w-full bg-[#000000] text-slate-100 px-3 sm:px-5 h-14 flex items-center justify-between select-none border-b border-white/5" dir="ltr">
      
      {/* Left side: Hamburger menu icon '=' and Model Name right next to it */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          onClick={onOpenDrawer}
          className="w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1.5 text-slate-200 hover:text-white hover:bg-[#1f2022] active:bg-[#282a2c] transition-colors focus:outline-none"
          title="Menu"
          aria-label="Menu"
        >
          <span className="w-5 h-[2px] bg-white rounded-full" />
          <span className="w-5 h-[2px] bg-white rounded-full" />
        </button>

        {/* Model Selector Dropdown - Next to the Menu icon as shown in screenshot */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setModelDropdownOpen(!modelDropdownOpen);
              setUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-[#1f2022] active:bg-[#282a2c] text-white text-base sm:text-lg font-medium transition-colors focus:outline-none"
          >
            <span className="text-sm shrink-0">{currentModelData.icon}</span>
            <span className="tracking-tight text-white font-normal truncate max-w-[100px] sm:max-w-[160px] md:max-w-none">{currentModelData.name}</span>
            {modelDropdownOpen ? (
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
            )}
          </button>

          {/* Model Selection Dropdown Popup with Backdrop */}
          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div
                className="fixed sm:absolute top-14 left-2 sm:left-0 right-2 sm:right-auto w-auto sm:w-[390px] max-w-[calc(100vw-16px)] max-h-[82vh] overflow-y-auto bg-[#1e1f20] border border-[#3c4043] rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-zinc-700"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
              {/* Header Title with Counter */}
              <div className="px-2 pt-1 pb-2 flex items-center justify-between border-b border-[#2d2f31]">
                <div className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7cacf8]" />
                  <span>
                    {lang === 'ar' ? 'اختيار النموذج أو الوكيل الذكي' : lang === 'fr' ? 'SÉLECTION DU MODÈLE OU AGENT' : 'SELECT MODEL OR AGENT'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#282a2c] text-slate-400 border border-[#3c4043]">
                  {modelsList.length} {lang === 'ar' ? 'وكيل' : 'agents'}
                </span>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 my-2 p-1 bg-[#131314] rounded-xl border border-[#2d2f31]">
                <button
                  type="button"
                  onClick={() => setModelFilter('all')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                    modelFilter === 'all'
                      ? 'bg-[#1b6ef3] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'الكل (10)' : lang === 'fr' ? 'Tous (10)' : 'All (10)'}
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter('gemini')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                    modelFilter === 'gemini'
                      ? 'bg-[#1b6ef3] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'Gemini (4)' : 'Gemini (4)'}
                </button>
                <button
                  type="button"
                  onClick={() => setModelFilter('agents')}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                    modelFilter === 'agents'
                      ? 'bg-[#1b6ef3] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'الوكلاء الآخرون (6)' : lang === 'fr' ? 'Autres Agents (6)' : 'Other Agents (6)'}
                </button>
              </div>

              {/* Models List */}
              <div className="flex flex-col gap-1.5 mt-1">
                {filteredModels.map((m) => {
                  const isSelected =
                    m.id === currentModel ||
                    (m.id === 'deepseek' && currentModel === 'deepseek-r1') ||
                    (m.id === 'manus' && currentModel === 'manus-agent') ||
                    (m.id === 'llama' && currentModel === 'llama-3-3') ||
                    (m.id === 'qwen' && currentModel === 'qwen-2-5');
                  return (
                    <div
                      key={m.id}
                      className={`w-full px-3 py-2.5 rounded-2xl flex items-center justify-between transition-all group border ${
                        isSelected
                          ? 'bg-[#1a273e] text-[#c2e7ff] border-[#2d4b73] shadow-md'
                          : 'bg-[#18191a]/60 hover:bg-[#252729] text-slate-200 border-transparent hover:border-[#383a3c]'
                      }`}
                    >
                      {/* Main Select Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectModel(m.id);
                          setModelDropdownOpen(false);
                          showToast(
                            lang === 'ar'
                              ? `تم تفعيل نموذج ${m.name} بنجاح`
                              : `Modèle ${m.name} activé avec succès`
                          );
                        }}
                        className="flex-1 flex items-start gap-2.5 text-start focus:outline-none"
                      >
                        <span className="text-xl shrink-0 mt-0.5">{m.icon}</span>
                        <div className="flex flex-col text-start min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-sm font-semibold truncate ${isSelected ? 'text-[#c2e7ff]' : 'text-white'}`}>
                              {m.name}
                            </span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                              {lang === 'ar' ? m.badgeAr : lang === 'fr' ? m.badgeFr : m.badgeEn}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {lang === 'ar' ? m.subAr : lang === 'fr' ? m.subFr : m.subEn}
                          </span>
                        </div>
                      </button>

                      {/* Right Action: External Launch Tool & Checkmark */}
                      <div className="flex items-center gap-1.5 shrink-0 mr-1 ml-1">
                        {/* 1-Click Launch Directly in Tool */}
                        <a
                          href={m.directUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#323438] transition-colors"
                          title={`${lang === 'ar' ? 'استدعاء وفتح في' : 'Ouvrir dans'} ${m.name}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#1b6ef3]/30 border border-[#1b6ef3] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#7cacf8]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Summon Note at bottom of Dropdown */}
              <div className="mt-2.5 pt-2 border-t border-[#2d2f31] px-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {lang === 'ar'
                    ? '💡 اختر الوكيل لهندسة برومبت مخصص له أو اضغط ↗ للاستدعاء الفوري'
                    : '💡 Choisissez l’agent pour adapter le prompt ou ↗ pour l’ouvrir'}
                </span>
              </div>
            </div>
          </>
        )}
        </div>
      </div>

      {/* Right side: Language switch + New Chat (pencil with sparkle/dashed ring) + Google User Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0" ref={userMenuRef}>
        
        {/* Language switch */}
        <button
          onClick={() => {
            const next = lang === 'fr' ? 'ar' : lang === 'ar' ? 'en' : 'fr';
            setLang(next);
          }}
          className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded-full hover:bg-[#1f2022] transition-colors flex items-center gap-1 shrink-0"
          title="Changer de langue / تغيير اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="uppercase text-[11px] font-semibold">{lang}</span>
        </button>

        {/* New Chat Edit Icon with Dashed Ring */}
        <button
          onClick={onNewChat}
          className="w-8 h-8 rounded-full border border-dashed border-slate-400 hover:border-slate-200 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1f2022] transition-all shrink-0 active:scale-95"
          title={lang === 'ar' ? 'محادثة جديدة' : 'Nouvelle discussion'}
        >
          <svg className="w-4 h-4 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>

        {/* User Profile Avatar / Sign In Button */}
        {isLoggedIn ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((prev) => !prev);
              setModelDropdownOpen(false);
            }}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#5f6368] hover:border-[#7cacf8] hover:ring-2 hover:ring-[#7cacf8]/40 transition-all shrink-0 flex items-center justify-center bg-[#282a2c] active:scale-95 focus:outline-none cursor-pointer"
            title={lang === 'ar' ? `حساب Google: ${userName}` : `Compte Google: ${userName}`}
            aria-label="Google Account"
          >
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = './assets/user_avatar.png';
              }}
            />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setUserMenuOpen((prev) => !prev);
              setModelDropdownOpen(false);
            }}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#1a73e8] hover:bg-[#1b66ca] text-white flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In'}</span>
          </button>
        )}

        {/* Google Account Profile Modal / Dropdown */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]"
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(false);
              }}
            />
            <div
              className="fixed sm:absolute top-14 right-2 sm:right-3 left-2 sm:left-auto w-auto sm:w-[350px] max-w-[calc(100vw-16px)] bg-[#1e1f20] border border-[#444746] rounded-[28px] p-4 sm:p-5 shadow-2xl z-[75] animate-in fade-in zoom-in-95 duration-150 text-white"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3c4043]/60 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight flex items-center gap-1 text-slate-200">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-xs text-slate-400 font-normal mr-1 ml-1">
                    {lang === 'ar' ? 'حسابك' : lang === 'fr' ? 'Compte' : 'Account'}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isLoggedIn ? (
              <>
                {/* User Identity Details Card */}
                <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#131314] border border-[#2d2f31] mb-3">
                  <div className="relative mb-2">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#7cacf8] shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './assets/user_avatar.png';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-base text-white">{userName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{userEmail}</p>

                  <a
                    href="https://myaccount.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 px-4 py-1.5 rounded-full border border-[#5f6368] hover:border-slate-300 text-xs font-medium text-slate-200 hover:text-white hover:bg-[#282a2c] transition-all flex items-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? 'إدارة حسابك على Google' : lang === 'fr' ? 'Gérer votre compte Google' : 'Manage your Google Account'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                {/* Account Actions */}
                <div className="space-y-1 mb-3">
                  {/* Add another account */}
                  <button
                    onClick={() => {
                      showToast(lang === 'ar' ? 'ميزة تبديل الحسابات متوفرة قريباً' : 'Bientôt disponible');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-[#282a2c] transition-colors text-xs font-medium"
                  >
                    <UserPlus className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{lang === 'ar' ? 'إضافة حساب آخر' : lang === 'fr' ? 'Ajouter un autre compte' : 'Add another account'}</span>
                  </button>

                  {/* Sign Out Button - Clear and Explicit */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/40 transition-colors text-xs font-semibold active:scale-[0.98]"
                  >
                    <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                    <div className="flex flex-col text-start">
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : lang === 'fr' ? 'Se déconnecter' : 'Sign out'}</span>
                      <span className="text-[10px] text-rose-300/70 font-normal">
                        {lang === 'ar' ? `تسجيل الخروج من حساب ${userEmail}` : 'Déconnexion de cet appareil'}
                      </span>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              /* Signed Out State - Allow Sign In */
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#131314] border border-[#2d2f31] mb-3">
                <div className="w-14 h-14 rounded-full bg-[#282a2c] flex items-center justify-center text-slate-400 mb-3 border border-dashed border-[#5f6368]">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-sm text-white">
                  {lang === 'ar' ? 'أنت غير متصل بحساب' : lang === 'fr' ? 'Non connecté' : 'Not signed in'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  {lang === 'ar'
                    ? 'سجّل الدخول بحساب Google للوصول إلى كافة البرومبتات والميزات'
                    : 'Connectez-vous pour synchroniser vos prompts et préférences'}
                </p>

                <button
                  onClick={handleSignIn}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1b66ca] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
                >
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-4 h-4 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './assets/user_avatar.png';
                    }}
                  />
                  <span>
                    {lang === 'ar'
                      ? `تسجيل الدخول كـ ${userName}`
                      : lang === 'fr'
                      ? `Se connecter en tant que ${userName}`
                      : `Sign in as ${userName}`}
                  </span>
                </button>
              </div>
            )}

            {/* Footer Links */}
            <div className="pt-2 border-t border-[#3c4043]/60 flex items-center justify-center gap-3 text-[11px] text-slate-400">
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors"
              >
                {lang === 'ar' ? 'سياسة الخصوصية' : lang === 'fr' ? 'Confidentialité' : 'Privacy'}
              </a>
              <span>•</span>
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-200 transition-colors"
              >
                {lang === 'ar' ? 'بنود الخدمة' : lang === 'fr' ? 'Conditions' : 'Terms'}
              </a>
            </div>
          </div>
        </>
      )}

      </div>

      {/* Floating Action Confirmation Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1f20] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full border border-[#444746] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <CheckCircle2 className="w-4 h-4 text-[#7cacf8] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </header>
  );
};
