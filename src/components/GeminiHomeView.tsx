import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MicOff, AudioWaveform, Copy, Check, Share2, ThumbsUp, ThumbsDown, Send, Sparkles, Download, Maximize2, Minimize2, Info, Edit2, ExternalLink, AlertCircle, X, Volume2, Scale } from 'lucide-react';
import { TargetModel, ChatMessage, PromptCategory, OutputLanguage, ExecutionType, DetailLevel, DeliveryMode, SupportedLanguage } from '../types';
import { dawaiCategoryCards } from '../data/prompts';
import { dawaiCategories } from '../utils/promptGenerator';
import { BookOpen } from 'lucide-react';
import { useSpeechRecognition, getSpeechRecognitionLocale } from '../hooks/useSpeechRecognition';
import { AdSenseBanner } from './AdSenseBanner';
import { FREE_AI_TOOLS, AIToolLauncher } from '../data/aiTools';
import { t } from '../utils/translations';

interface GeminiHomeViewProps {
  currentModel: TargetModel;
  onOpenBottomSheet: () => void;
  onOpenLibrary: () => void;
  onOpenRules: () => void;
  lang: SupportedLanguage;
  messages: ChatMessage[];
  onSendMessage: (idea: string, category: PromptCategory, language: OutputLanguage, execution: ExecutionType) => void;
  isLoading: boolean;
  selectedCategory: PromptCategory;
  setSelectedCategory: (cat: PromptCategory) => void;
  outputLanguage: OutputLanguage;
  setOutputLanguage: (l: OutputLanguage) => void;
  executionType: ExecutionType;
  setExecutionType: (ex: ExecutionType) => void;
  detailLevel?: DetailLevel;
  setDetailLevel?: (d: DetailLevel) => void;
  deliveryMode?: DeliveryMode;
  setDeliveryMode?: (m: DeliveryMode) => void;
  tone?: string;
  setTone?: (t: string) => void;
  onOpenStyleTransfer?: () => void;
}

export const GeminiHomeView: React.FC<GeminiHomeViewProps> = ({
  currentModel,
  onOpenBottomSheet,
  onOpenLibrary,
  onOpenRules,
  lang,
  messages,
  onSendMessage,
  isLoading,
  selectedCategory,
  setSelectedCategory,
  outputLanguage,
  setOutputLanguage,
  executionType,
  setExecutionType,
  detailLevel = 'medium',
  setDetailLevel,
  deliveryMode = 'both',
  setDeliveryMode,
  tone = 'رسمي واحترافي',
  setTone,
  onOpenStyleTransfer,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'task'>('chat');
  const [showAllLaunchers, setShowAllLaunchers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const homeInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Dynamic context placeholder based on selected category & speech state
  const getCategoryPlaceholder = () => {
    if (isListening) {
      return lang === 'ar' ? '🎙️ جارٍ الاستماع... تكلّم الآن...' : '🎙️ Écoute en cours...';
    }
    switch (selectedCategory) {
      case 'image':
        return lang === 'ar'
          ? 'صف فكرة الصورة بالتفصيل... (مثال: بورتريه سينمائي بدقة 8K لشخصية مستقبلية)'
          : lang === 'fr'
          ? 'Décrivez votre idée d\'image... (ex: portrait cinématique 8K)'
          : 'Describe your image concept... (e.g. 8K cinematic character)';
      case 'video':
        return lang === 'ar'
          ? 'اكتب فكرة وسيناريو الفيديو... (مثال: سيناريو إعلان تشويقي 30 ثانية)'
          : lang === 'fr'
          ? 'Décrivez l\'idée de votre vidéo... (ex: teaser cinématique 30s)'
          : 'Describe your video concept or storyboard...';
      case 'music':
        return lang === 'ar'
          ? 'صف نمط الموسيقى أو الكلمات لـ Suno / Udio... (مثال: لحن شرقي مدمج بسينث)'
          : lang === 'fr'
          ? 'Décrivez le style musical ou les paroles pour Suno / Udio...'
          : 'Describe music style, mood, or lyrics for Suno / Udio...';
      case 'code':
        return lang === 'ar'
          ? 'صف التطبيق أو الميزة البرمجية... (مثال: نظام ذكي لأتمتة الاختبارات)'
          : lang === 'fr'
          ? 'Décrivez l\'application ou le code à développer...'
          : 'Describe the software or feature to build...';
      default:
        return 'Demandez ...';
    }
  };

  // Voice-to-Text via Web Speech API
  const voiceLang = getSpeechRecognitionLocale(lang, outputLanguage);
  const baseInputRef = useRef('');

  const {
    isListening,
    interimText,
    errorMessage,
    audioLevel,
    permissionState,
    clearError,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    lang: voiceLang,
    onTranscriptChange: (spokenText) => {
      const base = baseInputRef.current.trim();
      const updated = base ? `${base} ${spokenText.trim()}` : spokenText.trim();
      setInputValue(updated);
    },
  });

  // Handle microphone error feedback
  useEffect(() => {
    if (errorMessage) {
      if (errorMessage === 'permission-denied') {
        showToast(
          lang === 'ar'
            ? '⚠️ تم حظر إذن الميكروفون. انقر فوق أيقونة القفل أو الميكروفون 🔒 في شريط عنوان المتصفح للسماح بالوصول.'
            : lang === 'fr'
            ? '⚠️ Accès au micro refusé. Cliquez sur l’icône de cadenas 🔒 dans la barre d’adresse de votre navigateur pour l’autoriser.'
            : '⚠️ Microphone permission denied. Click the lock 🔒 icon in your browser address bar to allow microphone access.'
        );
      } else if (errorMessage === 'not-supported') {
        showToast(
          lang === 'ar'
            ? 'ميزة التعرف الصوتي (Web Speech API) غير مدعومة في هذا المتصفح. يُرجى استخدام متصفح Google Chrome أو Edge.'
            : 'Speech recognition is not supported in this browser. Please try Google Chrome or Edge.'
        );
      } else if (errorMessage !== 'start-failed') {
        showToast(
          lang === 'ar'
            ? `⚠️ تنبيه الميكروفون: ${errorMessage}`
            : `⚠️ Microphone alert: ${errorMessage}`
        );
      }
      clearError();
    }
  }, [errorMessage, lang]);

  const handleToggleVoice = async () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isSupported) {
        showToast(
          lang === 'ar'
            ? 'ميزة تحويل الصوت إلى نص (Web Speech API) غير مدعومة في هذا المتصفح. استخدم متصفح Chrome أو Edge.'
            : lang === 'fr'
            ? 'La reconnaissance vocale Web Speech API n’est pas disponible. Utilisez Google Chrome ou Edge.'
            : 'Web Speech API is not supported in this browser. Please try Chrome or Edge.'
        );
        return;
      }
      baseInputRef.current = inputValue.trim();
      await startListening(voiceLang);
      if (messages.length > 0) {
        chatInputRef.current?.focus();
      } else {
        homeInputRef.current?.focus();
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      showToast(
        lang === 'ar'
          ? 'تم النسخ إلى الحافظة بنجاح! 📋'
          : lang === 'fr'
          ? 'Copié dans le presse-papier ! 📋'
          : 'Copied to Clipboard! 📋'
      );
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      showToast(lang === 'ar' ? 'تعذر النسخ إلى الحافظة' : 'Failed to copy to clipboard');
    }
  };

  const handleSharePrompt = async (promptText: string, promptTitle?: string, id?: string) => {
    const title = promptTitle || 'Daw Ai Meta-Prompt';
    const textToShare = promptText;

    if (id) {
      setSharedId(id);
      setTimeout(() => setSharedId(null), 2500);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: textToShare,
        });
        showToast(lang === 'ar' ? 'تمت مشاركة البرومبت بنجاح! 🚀' : 'Prompt partagé avec succès !');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard and show toast
    try {
      await navigator.clipboard.writeText(textToShare);
      showToast(lang === 'ar' ? 'تم نسخ نص البرومبت للمشاركة! 📋' : 'Prompt copié pour partage !');
    } catch {
      showToast(lang === 'ar' ? 'تعذرت المشاركة' : 'Échec du partage');
    }
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbackState((prev) => {
      const current = prev[id];
      const next = current === type ? undefined : type;
      const updated = { ...prev };
      if (!next) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });

    if (type === 'up') {
      showToast(lang === 'ar' ? 'شكراً على تقييمك الإيجابي! 👍' : 'Merci pour votre retour positif ! 👍');
    } else {
      showToast(lang === 'ar' ? 'شكراً لملاحظتك، سنعمل على تحسين البرومبتات 👎' : 'Merci pour votre retour ! 👎');
    }
  };

  const handleDownloadTxt = (code: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DawAi-Prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOpenInTool = async (tool: AIToolLauncher, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {}
    const toolTitle = lang === 'ar' ? `${tool.nameAr} (${tool.name})` : tool.name;
    showToast(
      lang === 'ar'
        ? `تم نسخ البرومبت بنجاح! 📋 جارٍ الفتح في ${toolTitle}... 🚀`
        : `Prompt copié ! Ouverture dans ${toolTitle}... 🚀`
    );
    const targetUrl = tool.url(promptText);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (!inputValue.trim()) {
      if (messages.length === 0 && homeInputRef.current) {
        homeInputRef.current.focus();
      } else {
        chatInputRef.current?.focus();
      }
      showToast(lang === 'ar' ? 'اكتب فكرتك في الحقل أولاً لتصميم البرومبت 💡' : 'Saisissez d\'abord votre idée pour concevoir le prompt 💡');
      return;
    }
    if (isLoading) return;
    onSendMessage(inputValue.trim(), selectedCategory, outputLanguage, executionType);
    setInputValue('');
    baseInputRef.current = '';
  };

  // Global Keyboard Shortcuts: Cmd/Ctrl + K to focus input area, Escape to clear prompt
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux): Quickly focus on the input area
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const targetInput = messages.length > 0 ? chatInputRef.current : homeInputRef.current;
        if (targetInput) {
          targetInput.focus();
          targetInput.select();
        }
        showToast(
          lang === 'ar'
            ? 'تم التركيز على خانة الكتابة (Ctrl + K) ⚡'
            : 'Focus sur la zone de texte (Ctrl + K) ⚡'
        );
        return;
      }

      // Escape key or Cmd/Ctrl + Shift + K: Quickly clear prompt if active or contains text
      if (
        (e.key === 'Escape' && (document.activeElement === chatInputRef.current || document.activeElement === homeInputRef.current || inputValue)) ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'x'))
      ) {
        if (inputValue) {
          e.preventDefault();
          setInputValue('');
          baseInputRef.current = '';
          const targetInput = messages.length > 0 ? chatInputRef.current : homeInputRef.current;
          targetInput?.focus();
          showToast(lang === 'ar' ? 'تم مسح نص الفكرة (Esc) 🧹' : 'Prompt effacé (Esc) 🧹');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inputValue, lang, messages.length]);

  // Handle escape to clear in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && inputValue) {
      e.preventDefault();
      setInputValue('');
      baseInputRef.current = '';
      showToast(lang === 'ar' ? 'تم مسح نص الفكرة (Esc) 🧹' : 'Prompt effacé (Esc) 🧹');
    }
  };

  return (
    <div className={`w-full flex-1 flex flex-col justify-between items-center ${messages.length > 0 ? 'w-full max-w-full px-1.5 sm:px-4 pb-28 sm:pb-32 pt-2' : 'w-full max-w-full px-0 pb-6 pt-0'}`}>
      
      {/* If No Messages: Exact Match to the Target Screenshot */}
      {messages.length === 0 ? (
        <div className="relative w-full flex-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-between text-center overflow-hidden animate-in fade-in duration-300 select-none">
          
          {/* 1. Cosmic Light Wave Background Ribbon across the top */}
          <div className="absolute top-0 left-0 right-0 h-[280px] sm:h-[360px] pointer-events-none overflow-hidden z-0 opacity-90">
            <svg className="w-full h-full" viewBox="0 0 1000 360" preserveAspectRatio="none" fill="none">
              <defs>
                <linearGradient id="cyanWaveGrad" x1="0%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="pinkWaveGrad" x1="20%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0.95" />
                </linearGradient>
                <filter id="waveBloom" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Left cyan-blue luminous wave threads */}
              <path
                d="M-50,200 C150,90 260,230 460,130 C620,50 780,170 1050,70"
                stroke="url(#cyanWaveGrad)"
                strokeWidth="3.5"
                filter="url(#waveBloom)"
                fill="none"
              />
              <path
                d="M-50,160 C180,70 290,250 490,120 C660,30 820,200 1050,50"
                stroke="#38bdf8"
                strokeWidth="1.5"
                fill="none"
                opacity="0.8"
              />
              <path
                d="M-50,230 C120,120 230,210 430,140 C590,80 740,150 1050,100"
                stroke="#0284c7"
                strokeWidth="2"
                fill="none"
                opacity="0.65"
              />
              
              {/* Right magenta-pink swirling particle wave */}
              <path
                d="M360,140 C560,60 720,190 920,90 C980,60 1030,80 1080,50"
                stroke="url(#pinkWaveGrad)"
                strokeWidth="4"
                filter="url(#waveBloom)"
                fill="none"
              />
              <path
                d="M410,120 C610,40 760,220 960,100 C1010,70 1050,90 1080,60"
                stroke="#ec4899"
                strokeWidth="1.5"
                fill="none"
                opacity="0.75"
              />

              {/* Sparkling cosmic dust particles */}
              <circle cx="710" cy="115" r="2" fill="#f472b6" opacity="0.9" />
              <circle cx="750" cy="100" r="2.5" fill="#f43f5e" opacity="0.85" />
              <circle cx="800" cy="135" r="3" fill="#e879f9" opacity="0.9" />
              <circle cx="840" cy="105" r="2" fill="#fb7185" opacity="0.95" />
              <circle cx="880" cy="90" r="2.5" fill="#c084fc" opacity="0.85" />
              <circle cx="920" cy="75" r="2" fill="#f472b6" opacity="0.9" />
              <circle cx="960" cy="65" r="3" fill="#f43f5e" opacity="0.85" />
              <circle cx="770" cy="145" r="1.5" fill="#38bdf8" opacity="0.8" />
              <circle cx="830" cy="155" r="2" fill="#ec4899" opacity="0.75" />
              <circle cx="900" cy="115" r="2.5" fill="#fbcfe8" opacity="0.95" />
            </svg>
          </div>

          {/* 2. Top Content: Glowing 4-Point Star + Multilingual Headlines */}
          <div className="relative z-10 w-full flex flex-col items-center pt-8 sm:pt-12 px-4 max-w-2xl mx-auto">
            
            {/* Glowing 4-Point Star matching screenshot */}
            <div className="relative mb-5 sm:mb-6 flex items-center justify-center">
              <div className="absolute w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tr from-cyan-500/25 via-pink-500/30 to-amber-500/25 rounded-full blur-3xl animate-pulse" />
              <svg className="w-16 h-16 sm:w-20 sm:h-20 relative z-10 drop-shadow-[0_0_28px_rgba(236,72,153,0.7)]" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
                  fill="url(#gemini-screen-star)"
                />
                <defs>
                  <linearGradient id="gemini-screen-star" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ff007f" />
                    <stop offset="25%" stopColor="#ff5e36" />
                    <stop offset="50%" stopColor="#f7b733" />
                    <stop offset="75%" stopColor="#00f2fe" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Multilingual Greetings matching design */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
              {t('heroGreeting', lang)}
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-normal font-arabic mt-1.5 sm:mt-2">
              ماذا تريد أن تبدع اليوم ؟
            </p>
            <p className="text-sm sm:text-base text-slate-300 font-light mt-1">
              {t('heroQuestionSub', lang)}
            </p>

            {/* 3. Futuristic Glowing Search / Prompt Input Bar matching screenshot */}
            <div className="w-full max-w-xl mt-6 sm:mt-8 px-2 relative z-20">
              {/* Voice Dictation Live Banner on Home View */}
              {isListening && (
                <div className="w-full mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="w-full bg-[#101728]/95 backdrop-blur-xl border border-red-500/70 rounded-2xl p-2.5 sm:p-3 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-500/20 border border-red-500/70 shrink-0">
                        <Mic className="w-4 h-4 text-red-400 animate-pulse" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                      </div>
                      <div className="flex flex-col text-start min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {lang === 'ar' ? 'جارٍ الاستماع... تكلّم الآن' : lang === 'fr' ? 'Écoute active en direct...' : 'Listening... Speak your idea'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                            {voiceLang}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">
                          {interimText
                            ? `"${interimText}"`
                            : lang === 'ar'
                            ? 'يتم تحويل صوتك إلى نص في الحقل فوراً'
                            : lang === 'fr'
                            ? 'Votre voix est transcrite en direct'
                            : 'Speaking into the input field...'}
                        </p>
                      </div>
                    </div>

                    {/* Audio wave dynamic equalizer + Stop button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 h-5 px-2 bg-black/40 rounded-lg">
                        <span
                          className="w-1 bg-red-500 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(6, Math.min(22, (audioLevel / 100) * 22 + 4))}px` }}
                        />
                        <span
                          className="w-1 bg-amber-400 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(8, Math.min(24, (audioLevel / 100) * 26 + 6))}px` }}
                        />
                        <span
                          className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(10, Math.min(26, (audioLevel / 100) * 30 + 8))}px` }}
                        />
                        <span
                          className="w-1 bg-pink-400 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(8, Math.min(24, (audioLevel / 100) * 26 + 6))}px` }}
                        />
                        <span
                          className="w-1 bg-red-500 rounded-full transition-all duration-75"
                          style={{ height: `${Math.max(6, Math.min(22, (audioLevel / 100) * 22 + 4))}px` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={stopListening}
                        className="px-2.5 py-1 rounded-xl bg-red-500/25 hover:bg-red-500/40 border border-red-500/60 text-red-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm"
                        title={lang === 'ar' ? 'إيقاف الإملاء الصوتي' : 'Arrêter la dictée'}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'تم' : lang === 'fr' ? 'Terminé' : 'Done'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleFormSubmit}
                className={`w-full bg-[#0d1322]/90 backdrop-blur-xl border ${
                  isListening
                    ? 'border-red-400/80 shadow-[0_0_35px_rgba(248,113,113,0.5)] ring-2 ring-red-400/40'
                    : 'border-sky-400/60 shadow-[0_0_28px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] focus-within:shadow-[0_0_38px_rgba(56,189,248,0.6)]'
                } rounded-full min-h-[58px] sm:min-h-[62px] px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 transition-all`}
                dir="ltr"
              >
                {/* Plus Button - Triggers Drawer / Options */}
                <button
                  type="button"
                  onClick={onOpenBottomSheet}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all shrink-0 cursor-pointer"
                  title="Options & Modèles"
                  aria-label="Options"
                >
                  <Plus className="w-5 h-5 text-slate-200" />
                </button>

                {/* Text input for idea / prompt */}
                <div className="flex-1 min-w-0">
                  <input
                    ref={homeInputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    dir="auto"
                    placeholder={
                      isListening
                        ? (lang === 'ar' ? '🎙️ جارٍ الاستماع... تكلّم بفكرتك الآن...' : lang === 'fr' ? '🎙️ Écoute en cours... Parlez maintenant...' : '🎙️ Listening... Speak your prompt idea now...')
                        : getCategoryPlaceholder()
                    }
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-2 py-1 leading-normal"
                  />
                </div>

                {/* Voice Dictation (Web Speech API) Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    isListening
                      ? 'text-red-400 bg-red-500/25 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                      : 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
                  }`}
                  title={isListening ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Arrêter la dictée') : (lang === 'ar' ? 'بدء الإملاء الصوتي' : 'Dictée vocale')}
                  aria-label="Voice input toggle"
                >
                  {isListening ? (
                    <AudioWaveform className="w-5 h-5 text-red-400 animate-pulse" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Glowing Blue Circular Audio Waveform Button matching screenshot */}
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => {
                    if (isListening) stopListening();
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#2563eb] via-[#3b82f6] to-[#60a5fa] shadow-[0_0_20px_rgba(59,130,246,0.85)] hover:shadow-[0_0_25px_rgba(59,130,246,1)] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                  title={lang === 'ar' ? 'توليد البرومت' : 'Générer le prompt'}
                  aria-label="Submit Prompt"
                >
                  <AudioWaveform className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>

            {/* 4. Five Quick Category Tiles matching screenshot */}
            <div className="w-full max-w-xl mt-6 px-1 flex items-center justify-center gap-2.5 sm:gap-3.5 overflow-x-auto scrollbar-none py-1 relative z-20">
              {/* Card 1: Image */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('image');
                  homeInputRef.current?.focus();
                  showToast(
                    lang === 'ar'
                      ? 'تم تحديد نمط الصور 🖼️ اكتب فكرتك الآن ثم اضغط زر التوليد'
                      : 'Mode Image sélectionné 🖼️ Écrivez votre idée puis générez'
                  );
                }}
                className={`flex-1 min-w-[58px] max-w-[76px] sm:max-w-[88px] h-20 sm:h-24 rounded-2xl ${
                  selectedCategory === 'image'
                    ? 'bg-[#152a55] border-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.65)] ring-2 ring-sky-400/60'
                    : 'bg-[#0c1428]/85 hover:bg-[#121f3d]/95 border-sky-500/40 hover:border-sky-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                } border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer backdrop-blur-md`}
              >
                <div className={`w-8 h-8 rounded-xl ${selectedCategory === 'image' ? 'bg-sky-500/30 border-sky-400' : 'bg-sky-500/15 border-sky-500/30'} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">{t('categoryImage', lang)}</span>
              </button>

              {/* Card 2: Vidéo */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('video');
                  homeInputRef.current?.focus();
                  showToast(
                    lang === 'ar'
                      ? 'تم تحديد نمط الفيديو 🎬 اكتب فكرتك وسيناريو الفيديو الآن'
                      : 'Mode Vidéo sélectionné 🎬 Écrivez votre scénario de vidéo'
                  );
                }}
                className={`flex-1 min-w-[58px] max-w-[76px] sm:max-w-[88px] h-20 sm:h-24 rounded-2xl ${
                  selectedCategory === 'video'
                    ? 'bg-[#351426] border-pink-400 shadow-[0_0_22px_rgba(236,72,153,0.65)] ring-2 ring-pink-400/60'
                    : 'bg-[#0c1428]/85 hover:bg-[#121f3d]/95 border-pink-500/40 hover:border-pink-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                } border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer backdrop-blur-md`}
              >
                <div className={`w-8 h-8 rounded-xl ${selectedCategory === 'video' ? 'bg-pink-500/30 border-pink-400' : 'bg-pink-500/15 border-pink-500/30'} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 8-6 4 6 4V8Z"/>
                    <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">{t('categoryVideo', lang)}</span>
              </button>

              {/* Card 3: Musique */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('music');
                  homeInputRef.current?.focus();
                  showToast(
                    lang === 'ar'
                      ? 'تم تحديد نمط الموسيقى 🎵 اكتب كلمات أو نمط الأغنية لـ Suno / Udio الآن'
                      : 'Mode Musique sélectionné 🎵 Écrivez votre idée musicale'
                  );
                }}
                className={`flex-1 min-w-[58px] max-w-[76px] sm:max-w-[88px] h-20 sm:h-24 rounded-2xl ${
                  selectedCategory === 'music'
                    ? 'bg-[#2b123d] border-purple-400 shadow-[0_0_22px_rgba(168,85,247,0.65)] ring-2 ring-purple-400/60'
                    : 'bg-[#0c1428]/85 hover:bg-[#121f3d]/95 border-purple-500/40 hover:border-purple-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                } border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer backdrop-blur-md`}
              >
                <div className={`w-8 h-8 rounded-xl ${selectedCategory === 'music' ? 'bg-purple-500/30 border-purple-400' : 'bg-purple-500/15 border-purple-500/30'} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">{t('categoryMusic', lang)}</span>
              </button>

              {/* Card 4: Code */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('code');
                  homeInputRef.current?.focus();
                  showToast(
                    lang === 'ar'
                      ? 'تم تحديد نمط البرمجة 💻 اكتب متطلبات الكود أو التطبيق الآن'
                      : 'Mode Code sélectionné 💻 Écrivez votre besoin en code'
                  );
                }}
                className={`flex-1 min-w-[58px] max-w-[76px] sm:max-w-[88px] h-20 sm:h-24 rounded-2xl ${
                  selectedCategory === 'code'
                    ? 'bg-[#0b2b3d] border-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.65)] ring-2 ring-cyan-400/60'
                    : 'bg-[#0c1428]/85 hover:bg-[#121f3d]/95 border-cyan-500/40 hover:border-cyan-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                } border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer backdrop-blur-md`}
              >
                <div className={`w-8 h-8 rounded-xl ${selectedCategory === 'code' ? 'bg-cyan-500/30 border-cyan-400' : 'bg-cyan-500/15 border-cyan-500/30'} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">{t('categoryCode', lang)}</span>
              </button>

              {/* Card 5: Prompts */}
              <button
                type="button"
                onClick={onOpenLibrary}
                className="flex-1 min-w-[58px] max-w-[76px] sm:max-w-[88px] h-20 sm:h-24 rounded-2xl bg-[#0c1428]/85 hover:bg-[#121f3d]/95 border border-blue-500/40 hover:border-blue-400 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group cursor-pointer backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                    <path d="M6 6h10"/>
                    <path d="M6 10h10"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white">{t('categoryPrompts', lang)}</span>
              </button>
            </div>

          </div>

          {/* 5. Bottom Section: Google AdSense Banner + Orbital Earth Horizon + Link */}
          <div className="relative z-10 w-full flex flex-col items-center mt-auto">
            
            {/* Google AdSense Banner at Bottom - User explicitly requested: مع اعلان كوكل قي اسفل */}
            <div className="w-full max-w-xl px-4 my-3 relative z-20">
              <AdSenseBanner className="w-full" />
            </div>

            {/* Orbital Earth Horizon with Atmospheric Cyan Rim & Sunrise Flare */}
            <div className="relative w-full overflow-hidden pt-6 pb-3 flex flex-col items-center justify-end min-h-[160px] sm:min-h-[210px]">
              
              {/* Curved Earth Horizon Body */}
              <div className="absolute inset-x-[-15%] bottom-[-220px] sm:bottom-[-270px] h-[320px] sm:h-[380px] rounded-[50%] bg-[#020512] border-t-2 border-cyan-400 shadow-[0_-12px_45px_rgba(56,189,248,0.7),inset_0_25px_60px_rgba(30,58,138,0.85)] overflow-hidden pointer-events-none">
                
                {/* Atmospheric Sunrise Lens Flare at Apex */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-24 sm:h-32 bg-gradient-to-b from-white via-amber-200/90 to-transparent rounded-full blur-xl" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-1.5 bg-cyan-300 blur-sm shadow-[0_0_25px_#38bdf8]" />
                
                {/* Night City Lights Shimmer (Gold and Amber web over continents) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.22),transparent_70%)]" />
                <div className="absolute top-8 inset-x-12 h-24 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.3),transparent_65%)]" />
                
                {/* Golden City Light Nodes */}
                <div className="absolute top-5 left-1/3 w-2 h-2 bg-amber-400 rounded-full blur-[1px] opacity-80" />
                <div className="absolute top-8 left-2/5 w-1.5 h-1.5 bg-amber-300 rounded-full blur-[1px] opacity-75" />
                <div className="absolute top-6 right-1/3 w-2 h-2 bg-amber-400 rounded-full blur-[1px] opacity-85" />
                <div className="absolute top-10 right-2/5 w-2 h-2 bg-yellow-300 rounded-full blur-[1px] opacity-70" />
                <div className="absolute top-7 left-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full blur-[1px] opacity-90" />
              </div>

              {/* Centered Link Badge matching screenshot */}
              <a
                href="https://arabiprompt.ai.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1224]/85 hover:bg-[#0f1d38] border border-cyan-400/50 hover:border-cyan-400 text-white text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all active:scale-95 cursor-pointer backdrop-blur-md mb-2 group"
                title="ArabiPrompt Official Website"
              >
                <svg className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span className="tracking-wide text-slate-100 group-hover:text-white font-medium">arabiprompt.ai.studio</span>
              </a>
            </div>

          </div>

        </div>
      ) : (
        /* Conversation Stream (Render Generated Daw Ai Prompts) */
        <div className="w-full flex flex-col gap-6 py-2">
          {/* Google AdSense Container at the Top of Main Chat Area */}
          <div className="w-full max-w-full">
            <AdSenseBanner className="w-full" />
          </div>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isExpanded = expandedCardId === msg.id;

            return (
              <div
                key={msg.id}
                className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                {isUser ? (
                  /* User Bubble */
                  <div className="max-w-[88%] sm:max-w-[80%] rounded-3xl bg-[#252a39] text-white px-5 py-3.5 text-sm sm:text-base shadow-md font-medium leading-relaxed border border-[#313441]">
                    {msg.content}
                  </div>
                ) : (
                  /* Gemini / Daw Ai Generated Prompt Card - Full Width Clean Layout */
                  <div className="w-full max-w-full flex flex-col text-slate-100">
                    <div className="w-full flex flex-col gap-3 min-w-0">
                      
                      {msg.promptData ? (
                        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#1e1f20] border border-[#2d2f31] p-3 sm:p-6 shadow-2xl flex flex-col gap-4 text-start">
                          
                          {/* Card Top Row: Title, Target Models, and Action Buttons */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#2d2f31]">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-[#c2e7ff] bg-blue-950/60 border border-blue-800/40 px-3 py-1 rounded-full">
                                  {msg.promptData.categoryIcon} {msg.promptData.title} ({msg.promptData.categoryLabel})
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 font-mono mt-0.5">
                                {msg.promptData.targetModelsLabel}
                              </span>
                            </div>

                            {/* Actions: Blue Copy Button, Download TXT, Expand */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleCopyText(msg.promptData!.promptCode, msg.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b6ef3] hover:bg-[#1860d5] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                                title="Copy to Clipboard"
                                aria-label="Copy to Clipboard"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-4 h-4 text-emerald-300" />
                                    <span>{lang === 'ar' ? 'تم النسخ إلى الحافظة!' : lang === 'fr' ? 'Copié !' : 'Copied to Clipboard!'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span>{lang === 'ar' ? 'نسخ إلى الحافظة' : lang === 'fr' ? 'Copier' : 'Copy to Clipboard'}</span>
                                  </>
                                )}
                              </button>

                              {/* Share Button in Top Row */}
                              <button
                                onClick={() => handleSharePrompt(msg.promptData!.promptCode, msg.promptData!.title, msg.id)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
                                  sharedId === msg.id
                                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                                    : 'bg-[#282a2c] hover:bg-[#333538] text-slate-300 hover:text-white border-[#383a3c]'
                                }`}
                                title={lang === 'ar' ? 'مشاركة البرومبت' : 'Partager'}
                              >
                                {sharedId === msg.id ? (
                                  <Check className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Share2 className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDownloadTxt(msg.promptData!.promptCode)}
                                className="w-9 h-9 rounded-full bg-[#282a2c] hover:bg-[#333538] text-slate-300 hover:text-white flex items-center justify-center border border-[#383a3c] transition-colors"
                                title="حفظ TXT"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setExpandedCardId(isExpanded ? null : msg.id)}
                                className="w-9 h-9 rounded-full bg-[#282a2c] hover:bg-[#333538] text-slate-300 hover:text-white flex items-center justify-center border border-[#383a3c] transition-colors"
                                title={isExpanded ? 'تصغير' : 'تكبير'}
                              >
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Notice Callout Box */}
                          <div className="rounded-2xl bg-[#131314] border border-[#2a2b2c] p-3.5 sm:p-4 text-xs sm:text-sm text-slate-300 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">{msg.promptData.notice}</p>
                          </div>

                          {/* Code Block with Generated Meta-Prompt (LTR for English Prompt) */}
                          <div className="rounded-2xl bg-[#131314] border border-[#2a2b2c] overflow-hidden">
                            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1b1c1d] border-b border-[#2a2b2c]">
                              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span>{lang === 'ar' ? 'نص البرومبت المُولّد' : 'Prompt généré'}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(msg.promptData!.promptCode, `${msg.id}-code`)}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                              >
                                {copiedId === `${msg.id}-code` || copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400 font-semibold">{lang === 'ar' ? 'تم النسخ!' : 'Copié !'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                                    <span>{lang === 'ar' ? 'نسخ البرومبت' : 'Copier'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="p-4 sm:p-5">
                              <pre
                                className={`font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto ${
                                  isExpanded ? 'max-h-[900px]' : 'max-h-[420px]'
                                } overflow-y-auto whitespace-pre-wrap select-all text-left`}
                                dir="ltr"
                              >
                                <code>{msg.promptData.promptCode}</code>
                              </pre>
                            </div>
                          </div>

                          {/* Part 2: Executed Tangible Deliverable (Dual Delivery Mode) */}
                          {msg.promptData.executionResult && msg.promptData.delivery !== 'prompt_only' && (
                            <div className="rounded-2xl bg-gradient-to-br from-[#162032] to-[#121620] border border-[#2b3c58] p-4 sm:p-5 flex flex-col gap-2.5 shadow-lg">
                              <div className="flex items-center justify-between pb-2 border-b border-[#2d3a50]">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-[#c2e7ff] flex items-center gap-1.5">
                                    <span>⚡</span>
                                    <span>{lang === 'ar' ? 'النتيجة التنفيذية المباشرة (الجزء 2)' : 'Résultat Exécuté (Partie 2)'}</span>
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30">
                                    {lang === 'ar' ? 'القاعدة الذهبية المزدوجة' : 'Dual Delivery'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(msg.promptData!.executionResult!, `${msg.id}-res`)}
                                  className="text-xs text-blue-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1f2d45] hover:bg-[#273856] transition-colors"
                                >
                                  {copiedId === `${msg.id}-res` ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedId === `${msg.id}-res` ? (lang === 'ar' ? 'تم النسخ' : 'Copié') : (lang === 'ar' ? 'نسخ النتيجة' : 'Copier')}</span>
                                </button>
                              </div>
                              <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans text-start">
                                {msg.promptData.executionResult}
                              </div>
                            </div>
                          )}

                          {/* Smart Assumptions & Tips (Inspired by User's Engine) */}
                          {((msg.promptData.assumptions && msg.promptData.assumptions.length > 0) ||
                            (msg.promptData.tips && msg.promptData.tips.length > 0)) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {msg.promptData.assumptions && (
                                <div className="rounded-2xl bg-[#14151b] border border-[#262833] p-3.5 text-start">
                                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                                    <span>💡</span>
                                    <span>{lang === 'ar' ? 'الافتراضات الذكية المطبقة' : 'Hypothèses Clés'}</span>
                                  </span>
                                  <ul className="text-[11px] sm:text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                                    {msg.promptData.assumptions.map((item, idx) => (
                                      <li key={idx} className="leading-relaxed">{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {msg.promptData.tips && (
                                <div className="rounded-2xl bg-[#14151b] border border-[#262833] p-3.5 text-start">
                                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5 mb-2">
                                    <span>⚡</span>
                                    <span>{lang === 'ar' ? 'نصائح لتحسين النتيجة' : 'Conseils d\'Optimisation'}</span>
                                  </span>
                                  <ul className="text-[11px] sm:text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                                    {msg.promptData.tips.map((item, idx) => (
                                      <li key={idx} className="leading-relaxed">{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Quick Launchers into AI Tools (Target Model, Manus, DeepSeek, Llama, Qwen, ChatGPT, Gemini, Claude) */}
                          <div className="pt-3 border-t border-[#2d2f31] flex flex-col gap-2.5">
                            
                            {/* Primary 1-Click Launch in Selected Model */}
                            {msg.promptData.modelUrl && (
                              <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-[#1e1f20] border border-blue-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md">
                                <div className="flex items-center gap-2">
                                  <span className="text-base sm:text-lg">🎯</span>
                                  <div className="flex flex-col text-start">
                                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                                      {lang === 'ar' ? 'النموذج المختار للبرومبت:' : 'Modèle Cible :'} {msg.promptData.modelDirectName || msg.promptData.targetModelsLabel}
                                    </span>
                                    <span className="text-[11px] text-blue-300/80 font-mono">
                                      {msg.promptData.modelUrl}
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(msg.promptData!.promptCode);
                                    } catch {}
                                    showToast(
                                      lang === 'ar'
                                        ? `تم نسخ البرومبت! 📋 جارٍ الفتح في ${msg.promptData!.modelDirectName || 'النموذج'}... 🚀`
                                        : `Prompt copié ! Ouverture... 🚀`
                                    );
                                    window.open(msg.promptData!.modelUrl, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="px-4 py-2 rounded-xl bg-[#1b6ef3] hover:bg-[#1860d5] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
                                >
                                  <span>🚀</span>
                                  <span>{lang === 'ar' ? 'تشغيل البرومبت فوراً' : 'Lancer le prompt'}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-2 mt-1">
                              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <span>⚡</span>
                                <span>{lang === 'ar' ? 'أو افتح وانسخ في وكلاء الذكاء الاصطناعي الرواد:' : 'Ou tester dans d’autres agents IA :'}</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowAllLaunchers(!showAllLaunchers)}
                                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors py-0.5 px-2 rounded-full hover:bg-blue-500/10"
                                >
                                  {showAllLaunchers
                                    ? (lang === 'ar' ? 'عرض أقل ▴' : 'Réduire ▴')
                                    : (lang === 'ar' ? 'عرض الكل (+6) ▾' : 'عرض الكل (+6) ▾')}
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setInputValue(msg.promptData!.idea)}
                                  className="px-2.5 py-1 rounded-full bg-[#282a2c] hover:bg-[#333538] text-xs font-semibold text-blue-300 hover:text-white border border-[#383a3c] transition-colors flex items-center gap-1 active:scale-95"
                                  title={lang === 'ar' ? 'تعديل الفكرة الأصلية' : 'Modifier'}
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>{lang === 'ar' ? 'تعديل' : 'Modifier'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Free Tools Launch Buttons: Manus, DeepSeek, Llama, Qwen, ChatGPT, Gemini, Claude, etc. */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              {(showAllLaunchers ? FREE_AI_TOOLS : FREE_AI_TOOLS.slice(0, 7)).map((tool) => (
                                <button
                                  key={tool.id}
                                  type="button"
                                  onClick={() => handleOpenInTool(tool, msg.promptData!.promptCode)}
                                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${tool.badgeClass}`}
                                  title={`${lang === 'ar' ? 'نسخ البرومبت وفتح' : 'Copier et ouvrir'} ${tool.name}`}
                                >
                                  <span className="text-sm">{tool.icon}</span>
                                  <span>{lang === 'ar' ? tool.nameAr : tool.name}</span>
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </button>
                              ))}
                            </div>

                            <span className="text-[11px] text-slate-400 text-start">
                              {lang === 'ar'
                                ? '💡 يتم نسخ البرومبت تلقائياً للحافظة قبل الفتح في أي أداة'
                                : '💡 Le prompt est automatiquement copié dans le presse-papier'}
                            </span>
                          </div>

                        </div>
                      ) : (
                        <div className="rounded-3xl bg-[#1e1f20] border border-[#2d2f31] p-4 sm:p-6 shadow-xl leading-relaxed text-sm sm:text-base text-slate-200 whitespace-pre-wrap relative">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2d2f31]">
                            <span className="text-xs text-slate-400 font-medium">
                              {lang === 'ar' ? 'إجابة النموذج' : lang === 'fr' ? 'Réponse' : 'AI Response'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.content, msg.id)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#282a2c] hover:bg-[#333538] text-slate-200 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
                              title="Copy to Clipboard"
                              aria-label="Copy to Clipboard"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">{lang === 'ar' ? 'تم النسخ!' : lang === 'fr' ? 'Copié !' : 'Copied!'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-blue-400" />
                                  <span>{lang === 'ar' ? 'نسخ إلى الحافظة' : lang === 'fr' ? 'Copier' : 'Copy to Clipboard'}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div>{msg.content}</div>
                        </div>
                      )}

                      {/* Gemini Bottom Interaction Icons */}
                      <div className="flex items-center gap-1.5 text-slate-400 px-1 pt-1 flex-wrap">
                        {/* Copy to Clipboard button on every AI generated response */}
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.promptData?.promptCode || msg.content, msg.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282a2c]/80 hover:bg-[#282a2c] text-slate-200 hover:text-white text-xs transition-colors active:scale-95 border border-[#383a3c]/60 shadow-sm cursor-pointer"
                          title="Copy to Clipboard"
                          aria-label="Copy to Clipboard"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-medium">{lang === 'ar' ? 'تم النسخ إلى الحافظة!' : lang === 'fr' ? 'Copié dans le presse-papier !' : 'Copied to Clipboard!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#7cacf8]" />
                              <span className="font-medium">{lang === 'ar' ? 'نسخ إلى الحافظة' : lang === 'fr' ? 'Copier dans le presse-papier' : 'Copy to Clipboard'}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSharePrompt(msg.promptData?.promptCode || msg.content, msg.promptData?.title || 'Daw Ai Prompt', msg.id)}
                          className={`p-2 rounded-full transition-all active:scale-95 ${
                            sharedId === msg.id
                              ? 'bg-blue-600/30 text-blue-400'
                              : 'hover:bg-[#282a2c] hover:text-white'
                          }`}
                          title={lang === 'ar' ? 'مشاركة البرومبت' : 'Partager'}
                        >
                          {sharedId === msg.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-2 rounded-full transition-all active:scale-95 ${
                            feedbackState[msg.id] === 'up'
                              ? 'bg-blue-600/30 text-blue-400 scale-105'
                              : 'hover:bg-[#282a2c] hover:text-white'
                          }`}
                          title={lang === 'ar' ? 'إعجاب (إجابة ممتازة)' : 'Bonne réponse'}
                        >
                          <ThumbsUp className={`w-4 h-4 ${feedbackState[msg.id] === 'up' ? 'fill-blue-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-2 rounded-full transition-all active:scale-95 ${
                            feedbackState[msg.id] === 'down'
                              ? 'bg-rose-600/30 text-rose-400 scale-105'
                              : 'hover:bg-[#282a2c] hover:text-white'
                          }`}
                          title={lang === 'ar' ? 'لم يعجبني' : 'Mauvaise réponse'}
                        >
                          <ThumbsDown className={`w-4 h-4 ${feedbackState[msg.id] === 'down' ? 'fill-rose-400' : ''}`} />
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading State */}
          {isLoading && (
            <div className="w-full flex items-center justify-start animate-in fade-in py-1">
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#1e1f20] text-slate-300 text-xs sm:text-sm border border-[#2d2f31]">
                <span className="w-2 h-2 rounded-full bg-[#7cacf8] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#7cacf8] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#7cacf8] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2 font-medium">
                  {lang === 'ar' ? 'جارٍ هندسة وتوليد البرومبت من فكرتك...' : 'Génération du méta-prompt en cours...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Floating Bottom Section for Active Chat Mode */}
      {messages.length > 0 && (
        <div className="w-full fixed bottom-2 left-0 right-0 z-30 px-3 sm:px-6 flex flex-col items-center gap-2 pointer-events-none">
          
          {/* Voice Dictation Live Listening Floating Indicator */}
          {isListening && (
            <div className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-[#131b2e]/95 backdrop-blur-md border border-red-500/70 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-1.5 h-5 px-1.5 bg-black/40 rounded-lg">
                <span
                  className="w-1 bg-red-500 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(6, Math.min(22, (audioLevel / 100) * 22 + 4))}px` }}
                />
                <span
                  className="w-1 bg-amber-400 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(8, Math.min(24, (audioLevel / 100) * 26 + 6))}px` }}
                />
                <span
                  className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(10, Math.min(26, (audioLevel / 100) * 30 + 8))}px` }}
                />
                <span
                  className="w-1 bg-pink-400 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(8, Math.min(24, (audioLevel / 100) * 26 + 6))}px` }}
                />
                <span
                  className="w-1 bg-red-500 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(6, Math.min(22, (audioLevel / 100) * 22 + 4))}px` }}
                />
              </div>
              <div className="flex flex-col text-start min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    {lang === 'ar' ? 'جارٍ الاستماع... تكلّم بفكرتك' : lang === 'fr' ? 'Écoute vocale en cours...' : 'Listening... Speak your prompt idea'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                    {voiceLang}
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 truncate mt-0.5">
                  {interimText
                    ? `"${interimText}"`
                    : lang === 'ar'
                    ? 'يتم تحويل صوتك إلى نص في الحقل أدناه مباشرة'
                    : lang === 'fr'
                    ? 'Votre voix est transcrite en direct'
                    : 'Your voice is being transcribed live'}
                </span>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="px-2.5 py-1 rounded-full bg-red-500/25 hover:bg-red-500/40 text-red-200 hover:text-white text-xs font-medium border border-red-500/50 transition-all flex items-center gap-1 active:scale-95 cursor-pointer ml-1"
                title="إيقاف التسجيل"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تم' : lang === 'fr' ? 'Terminé' : 'Done'}</span>
              </button>
            </div>
          )}

          {/* Action Feedback Toast */}
          {toastMessage && (
            <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-[#1e1f20]/95 backdrop-blur-md border border-[#444746] text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
              <span className="flex-1 text-start">{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="p-1 rounded-full hover:bg-[#282a2c] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick ArabiPrompt Settings Trigger Pill */}
          <div className="pointer-events-auto flex items-center gap-2 mb-1 select-none flex-wrap justify-center" dir="ltr">
            <button
              type="button"
              onClick={onOpenBottomSheet}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162030]/90 backdrop-blur-md hover:bg-[#1f2d44] border border-[#2d4263] text-[11px] text-[#c2e7ff] transition-all shadow-md active:scale-95 cursor-pointer"
              title={lang === 'ar' ? 'تعديل إعدادات البرومت (نمط التسليم، التفصيل، النبرة)' : 'Modifier les options de prompt'}
            >
              <span className="text-xs">⚙️</span>
              <span>
                {deliveryMode === 'both'
                  ? lang === 'ar' ? 'البرومت والنتيجة' : 'Prompt & Résultat'
                  : deliveryMode === 'prompt_only'
                  ? lang === 'ar' ? 'برومت فقط' : 'Prompt Seul'
                  : lang === 'ar' ? 'النتيجة فقط' : 'Résultat Seul'}
              </span>
              <span className="opacity-40">•</span>
              <span>
                {detailLevel === 'short'
                  ? lang === 'ar' ? 'موجز' : 'Court'
                  : detailLevel === 'detailed'
                  ? lang === 'ar' ? 'مفصّل' : 'Détaillé'
                  : lang === 'ar' ? 'متوازن' : 'Moyen'}
              </span>
            </button>
          </div>

          {/* Chat Composer Pill Bar */}
          <form
            onSubmit={(e) => {
              if (isListening) stopListening();
              handleFormSubmit(e);
            }}
            className={`pointer-events-auto w-full max-w-xl bg-[#0e1424]/95 backdrop-blur-xl border ${
              isListening
                ? 'border-red-400/80 shadow-[0_0_25px_rgba(239,68,68,0.4)] ring-2 ring-red-400/40'
                : 'border-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.3)]'
            } rounded-full min-h-[56px] py-1.5 px-3 flex items-center gap-2 shadow-2xl transition-all`}
            dir="ltr"
          >
            {/* Plus Button */}
            <button
              type="button"
              onClick={onOpenBottomSheet}
              className="w-9 h-9 rounded-full hover:bg-white/10 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Options & Modèles"
            >
              <Plus className="w-5 h-5 text-slate-200" />
            </button>

            {/* Input area */}
            <div className="flex-1 min-w-0 flex items-center gap-1 relative">
              <input
                ref={chatInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                dir="auto"
                placeholder={
                  isListening
                    ? (lang === 'ar' ? '🎙️ جارٍ الاستماع... تكلّم الآن...' : lang === 'fr' ? '🎙️ Écoute en cours... Parlez...' : '🎙️ Listening... Speak now...')
                    : 'Demandez ...'
                }
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-2 py-1 leading-normal"
              />

              {inputValue && !isListening && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="w-6 h-6 rounded-full hover:bg-[#282a2c] text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  title="Effacer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`w-9 h-9 rounded-full active:scale-95 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-red-500/25 text-red-400 border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Arrêter la dictée') : (lang === 'ar' ? 'بدء الإملاء الصوتي' : 'Dictée vocale')}
            >
              {isListening ? (
                <AudioWaveform className="w-5 h-5 text-red-400 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5 text-slate-300" />
              )}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shrink-0 shadow-lg cursor-pointer disabled:opacity-50"
              title="Envoyer"
            >
              <Send className="w-4 h-4 translate-x-[-0.5px] text-white" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
