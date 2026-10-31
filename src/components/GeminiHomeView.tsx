import React, { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MicOff, AudioWaveform, Copy, Check, Share2, ThumbsUp, ThumbsDown, Send, Sparkles, Download, Maximize2, Minimize2, Info, Edit2, ExternalLink, AlertCircle, X, Volume2, Scale } from 'lucide-react';
import { TargetModel, ChatMessage, PromptCategory, OutputLanguage, ExecutionType, DetailLevel, DeliveryMode } from '../types';
import { dawaiCategoryCards } from '../data/prompts';
import { dawaiCategories } from '../utils/promptGenerator';
import { BookOpen } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { AdSenseBanner } from './AdSenseBanner';
import { FREE_AI_TOOLS, AIToolLauncher } from '../data/aiTools';

interface GeminiHomeViewProps {
  currentModel: TargetModel;
  onOpenBottomSheet: () => void;
  onOpenLibrary: () => void;
  onOpenRules: () => void;
  lang: 'ar' | 'en' | 'fr';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the input textarea dynamically to fit the written sentence
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      // Allow dynamic expansion from 28px up to 180px so long sentences wrap and remain fully visible
      const computedHeight = Math.min(Math.max(scrollHeight, 28), 180);
      textareaRef.current.style.height = `${computedHeight}px`;
    }
  }, [inputValue]);

  // Voice-to-Text via Web Speech API
  const [voiceLang, setVoiceLang] = useState<string>(
    outputLanguage === 'darija'
      ? 'ar-MA'
      : outputLanguage === 'ar' || lang === 'ar'
      ? 'ar-SA'
      : outputLanguage === 'fr' || lang === 'fr'
      ? 'fr-FR'
      : 'en-US'
  );
  const baseInputRef = useRef('');

  useEffect(() => {
    const target =
      outputLanguage === 'darija'
        ? 'ar-MA'
        : outputLanguage === 'ar' || lang === 'ar'
        ? 'ar-SA'
        : outputLanguage === 'fr' || lang === 'fr'
        ? 'fr-FR'
        : 'en-US';
    setVoiceLang(target);
  }, [lang, outputLanguage]);

  const {
    isListening,
    interimText,
    errorMessage,
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
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    },
  });

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isSupported) {
        showToast(
          lang === 'ar'
            ? 'ميزة تحويل الصوت إلى نص (Web Speech API) غير مدعومة في هذا المتصفح. استخدم Chrome أو Edge.'
            : 'Web Speech API is not supported in this browser. Please try Chrome or Edge.'
        );
        return;
      }
      baseInputRef.current = inputValue;
      startListening(voiceLang);
      textareaRef.current?.focus();
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
      textareaRef.current?.focus();
      showToast(lang === 'ar' ? 'اكتب فكرتك في الحقل أو اضغط الميكروفون للتحدث 💡' : 'Saisissez votre idée ou dictez-la 💡');
      return;
    }
    if (isLoading) return;
    onSendMessage(inputValue.trim(), selectedCategory, outputLanguage, executionType);
    setInputValue('');
    baseInputRef.current = '';
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Global Keyboard Shortcuts: Cmd/Ctrl + K to focus input area, Escape to clear prompt
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux): Quickly focus on the input area
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
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
        (e.key === 'Escape' && (document.activeElement === textareaRef.current || inputValue)) ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'x'))
      ) {
        if (inputValue) {
          e.preventDefault();
          setInputValue('');
          baseInputRef.current = '';
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.focus();
          }
          showToast(lang === 'ar' ? 'تم مسح نص الفكرة (Esc) 🧹' : 'Prompt effacé (Esc) 🧹');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inputValue, lang]);

  // Disable form submission on Enter: allows Enter to only insert a new line (\n)
  // Making the dedicated Send button the sole way to send the message
  // And allow Escape to quickly clear the prompt
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      // Allow native textarea newline insertion (\n) without submitting form
      e.stopPropagation();
    } else if (e.key === 'Escape' && inputValue) {
      e.preventDefault();
      setInputValue('');
      baseInputRef.current = '';
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      showToast(lang === 'ar' ? 'تم مسح نص الفكرة (Esc) 🧹' : 'Prompt effacé (Esc) 🧹');
    }
  };

  return (
    <div className={`w-full flex-1 flex flex-col justify-between items-center pb-28 sm:pb-32 pt-2 ${messages.length > 0 ? 'w-full max-w-full px-1.5 sm:px-4' : 'max-w-4xl mx-auto px-3 sm:px-6'}`}>
      
      {/* If No Messages: Show Welcome Screen (Chat) OR Task Category Grid with AdSense (Tâche) */}
      {messages.length === 0 ? (
        activeTab === 'chat' ? (
          /* Chat Mode: Gemini Multicolored Glowing 4-Point Star + Salut Adwaw, on fait quoi ? */
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center my-auto px-4 py-16 animate-in fade-in duration-300">
            {/* Glowing 4-Point Star */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-[#4285f4]/20 rounded-full blur-2xl animate-pulse" />
              <svg className="w-12 h-12 relative z-10 drop-shadow-[0_0_22px_rgba(66,133,244,0.7)]" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z"
                  fill="url(#gemini-main-gradient)"
                />
                <defs>
                  <linearGradient id="gemini-main-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="35%" stopColor="#9B72CB" />
                    <stop offset="70%" stopColor="#D96570" />
                    <stop offset="100%" stopColor="#F4B400" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Centered Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white text-center tracking-tight leading-snug max-w-lg">
              Salut Adwaw, on fait quoi ?
            </h1>

            {/* Google AdSense in Main Interface */}
            <div className="w-full max-w-md mx-auto mt-2">
              <AdSenseBanner className="w-full" />
            </div>
          </div>
        ) : (
          /* Tâche Mode: Exact Match to Screenshot (Library, Rules, Google AdSense, Category Grid) */
          <div className="w-full flex-1 flex flex-col items-center gap-4 py-4 px-2 sm:px-4 max-w-xl mx-auto animate-in fade-in duration-300">
            {/* Top Banner 1: مكتبة البرومبتات PDFs */}
            <div
              onClick={onOpenLibrary}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#172642] to-[#121c2d] border border-[#2b4168] flex items-center justify-between cursor-pointer hover:border-[#3d5d95] transition-all shadow-lg active:scale-98 group"
            >
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white flex items-center gap-1.5">
                    📚 مكتبة البرومبتات
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/40 text-blue-200 border border-blue-500/40 font-mono">
                    PDFs
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1">
                  بورتريهات، 8K، COSTAR، تعليم، عقود
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-[#7cacf8] border border-blue-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            {/* Top Banner 2: ميثاق وقوانين البرومبت 10 قوانين */}
            <div
              onClick={onOpenRules}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#2c1d11] to-[#1c140d] border border-[#5a3b22] flex items-center justify-between cursor-pointer hover:border-[#82542e] transition-all shadow-lg active:scale-98 group"
            >
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-amber-200 flex items-center gap-1.5">
                    ⚖️ ميثاق وقوانين البرومبت
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600/40 text-amber-200 border border-amber-500/40 font-mono">
                    10 قوانين
                  </span>
                </div>
                <span className="text-xs text-amber-200/70 mt-1">
                  القاعدة الذهبية المزدوجة + معايير الدقة
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            {/* Top Banner 3: الهندسة العكسية لنقل الأنماط (صورة ➜ صورة) مجاني */}
            <div
              onClick={onOpenStyleTransfer}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#2a133d] via-[#1f1a38] to-[#132238] border border-[#5d3185] flex items-center justify-between cursor-pointer hover:border-[#8545bf] transition-all shadow-lg active:scale-98 group"
            >
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white flex items-center gap-1.5">
                    🔄 الهندسة العكسية لنقل الأنماط
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    مجاني
                  </span>
                </div>
                <span className="text-xs text-purple-200/70 mt-1">
                  ارفع صورة النمط وصورة الهدف ➜ برومت ينقل النمط من هذه للأخرى
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>

            {/* Google AdSense Banner Injected Here: ca-pub-3312377428939400 */}
            <div className="w-full">
              <AdSenseBanner className="w-full" />
            </div>

            {/* 6 Category Cards 2-Column Grid (الصور، البرمجة، البحث، الفيديو، التسويق، الموسيقى) */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* الصور */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('image');
                  onSendMessage(
                    lang === 'ar' ? 'تصميم بوستر سينمائي عالي الدقة لشخصية خيال علمي' : 'Cinematic high-resolution sci-fi character concept poster',
                    'image',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
                <span className="text-sm sm:text-base font-bold text-white">الصور</span>
              </button>

              {/* البرمجة */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('code');
                  onSendMessage(
                    lang === 'ar' ? 'تطبيق ويب متكامل مع معمارية برمجيات نظيفة Clean Architecture' : 'Full-stack web application with Clean Architecture',
                    'code',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">💻</span>
                <span className="text-sm sm:text-base font-bold text-white">البرمجة</span>
              </button>

              {/* البحث */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('research');
                  onSendMessage(
                    lang === 'ar' ? 'بحث تحليلي شامل حول مستقبل الذكاء الاصطناعي التوليدي' : 'Comprehensive research analysis on generative AI',
                    'research',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
                <span className="text-sm sm:text-base font-bold text-white">البحث</span>
              </button>

              {/* الفيديو */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('video');
                  onSendMessage(
                    lang === 'ar' ? 'سيناريو فيديو إعلاني قصير مدته 30 ثانية لمنتج مبتكر' : '30-second commercial video storyboard for an innovative product',
                    'video',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🎬</span>
                <span className="text-sm sm:text-base font-bold text-white">الفيديو</span>
              </button>

              {/* التسويق */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('marketing');
                  onSendMessage(
                    lang === 'ar' ? 'خطة إطلاق حملة تسويقية رقمية لعلامة تجارية' : 'Digital marketing launch campaign strategy',
                    'marketing',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">📣</span>
                <span className="text-sm sm:text-base font-bold text-white">التسويق</span>
              </button>

              {/* الموسيقى */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('music');
                  onSendMessage(
                    lang === 'ar' ? 'تأليف كلمات ولحن لأغنية هادئة تمزج بين الآلات الشرقية والمودرن' : 'Lyrics and composition for an ambient track',
                    'music',
                    outputLanguage,
                    executionType
                  );
                }}
                className="h-32 sm:h-36 rounded-2xl bg-[#171a26] hover:bg-[#1f2434] border border-[#2b3044] hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 transition-all shadow-md group active:scale-95"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🎵</span>
                <span className="text-sm sm:text-base font-bold text-white">الموسيقى</span>
              </button>
            </div>

            {/* Free AI Tools Hub (مانوس، ديب سيك، لاما، وكل الأدوات المجانية) */}
            <div className="w-full rounded-2xl bg-[#171a26]/80 border border-[#2b3044] p-3.5 sm:p-4 text-start flex flex-col gap-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  <span className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'أدوات الذكاء الاصطناعي المجانية (مانوس، ديب سيك، لاما، ...)' : 'Outils IA Gratuits (Manus, DeepSeek, Llama...)'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {lang === 'ar' ? '12 أداة مجانية' : '12 Outils'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'اضغط لفتح أي أداة ذكاء اصطناعي مجانية مباشرة مع ميزة النسخ التلقائي للبرومبت:'
                  : 'Cliquez pour ouvrir directement les modèles IA gratuits avec copie automatique :'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {FREE_AI_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleOpenInTool(tool, inputValue.trim() || 'اكتب فكرة أو طلب هنا...')}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${tool.badgeClass}`}
                    title={`${lang === 'ar' ? 'فتح' : 'Ouvrir'} ${tool.name}`}
                  >
                    <span className="text-sm">{tool.icon}</span>
                    <span>{lang === 'ar' ? tool.nameAr : tool.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
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

      {/* Floating Bottom Section: Composer */}
      <div className="w-full fixed bottom-3 left-0 right-0 z-30 px-3 sm:px-6 flex flex-col items-center gap-2 pointer-events-none">
        
        {/* Voice Dictation Live Listening Floating Indicator */}
        {isListening && (
          <div className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-[#1e1f20]/95 backdrop-blur-md border border-red-500/50 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Animated Sound Wave Bars */}
            <div className="flex items-center gap-1 h-5">
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: '14px' }} />
              <span className="w-1 bg-red-400 rounded-full animate-bounce [animation-duration:0.4s]" style={{ height: '22px' }} />
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-duration:0.7s]" style={{ height: '10px' }} />
              <span className="w-1 bg-red-400 rounded-full animate-bounce [animation-duration:0.5s]" style={{ height: '18px' }} />
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: '12px' }} />
            </div>

            {/* Status Text */}
            <div className="flex flex-col text-start">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {lang === 'ar' ? 'جارٍ الاستماع... تكلّم بفكرتك' : lang === 'fr' ? 'Écoute vocale en cours...' : 'Listening... Speak your prompt idea'}
              </span>
              <span className="text-[11px] text-slate-300">
                {lang === 'ar' ? 'يتم تحويل صوتك إلى نص في الحقل أدناه مباشرة' : lang === 'fr' ? 'Votre voix est transcrite en direct' : 'Your voice is being transcribed live'}
              </span>
            </div>

            {/* Quick Language Toggle for Voice Recognition */}
            <div className="flex items-center bg-[#282a2c] rounded-full p-0.5 border border-[#383a3c] text-[10px] text-slate-300">
              <button
                type="button"
                onClick={() => {
                  setVoiceLang('ar-SA');
                  if (isListening) {
                    stopListening();
                    setTimeout(() => startListening('ar-SA'), 100);
                  }
                }}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  voiceLang.startsWith('ar') ? 'bg-red-500 text-white font-bold' : 'hover:text-white'
                }`}
                title="التعرف باللغة العربية"
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => {
                  setVoiceLang('en-US');
                  if (isListening) {
                    stopListening();
                    setTimeout(() => startListening('en-US'), 100);
                  }
                }}
                className={`px-2 py-0.5 rounded-full transition-colors ${
                  voiceLang.startsWith('en') ? 'bg-red-500 text-white font-bold' : 'hover:text-white'
                }`}
                title="English Speech Recognition"
              >
                EN
              </button>
            </div>

            {/* Stop Voice Recording Button */}
            <button
              type="button"
              onClick={stopListening}
              className="px-2.5 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white text-xs font-medium border border-red-500/40 transition-all flex items-center gap-1 active:scale-95"
              title="إيقاف التسجيل"
            >
              <X className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إيقاف' : 'Arrêter'}</span>
            </button>
          </div>
        )}

        {/* Action Feedback Toast (Share, Like, Copy) */}
        {toastMessage && (
          <div className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-[#1e1f20]/95 backdrop-blur-md border border-[#444746] text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
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

        {/* Voice Dictation Error Toast */}
        {errorMessage && (
          <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-amber-950/90 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2.5 shadow-2xl animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="flex-1 text-start">
              {errorMessage === 'permission-denied'
                ? lang === 'ar'
                  ? 'تم رفض إذن الميكروفون. يرجى تفعيل الميكروفون في إعدادات المتصفح.'
                  : 'Microphone permission denied. Please allow microphone access in your browser settings.'
                : errorMessage === 'not-supported'
                ? lang === 'ar'
                  ? 'ميزة تحويل الصوت إلى نص (Web Speech API) غير مدعومة في هذا المتصفح. جرّب Google Chrome أو Edge.'
                  : 'Speech recognition (Web Speech API) is not supported in this browser. Please try Chrome or Edge.'
                : `${lang === 'ar' ? 'إشعار التعرف الصوتي: ' : 'Speech recognition: '}${errorMessage}`}
            </span>
            <button
              type="button"
              onClick={clearError}
              className="p-1 rounded-full hover:bg-amber-900/50 text-amber-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mode Switcher Pill matching screenshot: [ Chat ]   Tâche + ArabiPrompt Quick Settings Pill */}
        <div className="pointer-events-auto flex items-center gap-2 mb-2 select-none flex-wrap justify-center" dir="ltr">
          <div className="flex items-center gap-1.5 bg-[#1b1c1d] p-0.5 rounded-full border border-[#2d2f31]">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#282a2c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'task'
                  ? 'bg-[#282a2c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tâche
            </button>
          </div>

          {/* Free Style Transfer Reverse Engineering Pill */}
          {onOpenStyleTransfer && (
            <button
              type="button"
              onClick={onOpenStyleTransfer}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/50 via-amber-900/40 to-blue-900/50 hover:from-purple-800/70 hover:to-blue-800/70 border border-purple-500/40 hover:border-purple-400 text-[11px] text-purple-200 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title={lang === 'ar' ? 'الهندسة العكسية لنقل الأنماط (صورة ➜ صورة)' : 'Reverse Engineering Style Transfer'}
            >
              <span className="text-xs">🔄</span>
              <span className="font-medium">{lang === 'ar' ? 'نقل النمط' : 'Transfert Style'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                {lang === 'ar' ? 'مجاني' : 'Free'}
              </span>
            </button>
          )}

          {/* Quick ArabiPrompt Settings Trigger Pill */}
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162030] hover:bg-[#1f2d44] border border-[#2d4263] text-[11px] text-[#c2e7ff] transition-all shadow-sm active:scale-95"
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

        {/* Active Voice Dictation Visualizer Banner */}
        {isListening && (
          <div
            className="pointer-events-auto w-full max-w-xl px-4 py-2.5 rounded-2xl bg-[#1a1b1e]/95 border border-red-500/50 text-white text-xs flex items-center justify-between gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 backdrop-blur-md mb-2"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div className="flex flex-col text-start min-w-0">
                <span className="font-semibold text-red-300 flex items-center gap-1.5 text-xs">
                  <span>{lang === 'ar' ? '🎙️ جارٍ الاستماع... تكلّم الآن' : lang === 'fr' ? '🎙️ Écoute en cours...' : '🎙️ Listening... speak now'}</span>
                  <span className="text-[10px] text-slate-300 font-mono px-1.5 py-0.2 rounded bg-black/40 border border-white/10">
                    {voiceLang}
                  </span>
                </span>
                <span className="text-[11px] text-slate-300 truncate max-w-[220px] sm:max-w-sm font-sans mt-0.5">
                  {interimText || (lang === 'ar' ? 'صوتك يتحول لنص تلقائياً...' : 'Your speech appears here in real time...')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick Language switch buttons */}
              <button
                type="button"
                onClick={() => {
                  const nextLang = voiceLang.startsWith('ar') ? 'en-US' : voiceLang.startsWith('en') ? 'fr-FR' : 'ar-SA';
                  setVoiceLang(nextLang);
                  startListening(nextLang);
                }}
                className="px-2 py-1 rounded-full bg-[#282a2c] hover:bg-[#333537] text-[10px] font-mono text-slate-200 border border-[#444746] transition-colors cursor-pointer"
                title="Changer langue vocale / تغيير لغة الصوت"
              >
                {voiceLang.slice(0, 2).toUpperCase()}
              </button>

              {/* Stop button */}
              <button
                type="button"
                onClick={stopListening}
                className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium text-xs transition-colors flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تم' : 'OK'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Composer Pill: Auto-expanding container for multiline and long text */}
        <form
          onSubmit={handleFormSubmit}
          className={`pointer-events-auto w-full max-w-xl bg-[#1e1f20] border ${
            isListening
              ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
              : 'border-[#2d2f31]'
          } rounded-[28px] min-h-[56px] sm:min-h-[64px] py-2 px-2.5 sm:px-3.5 flex items-end gap-1.5 sm:gap-2 shadow-2xl transition-all`}
          dir="ltr"
        >
          {/* Plus Button - Triggers Drawer / Category Bottom Sheet */}
          <button
            type="button"
            onClick={onOpenBottomSheet}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-[#282a2c] active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0 mb-0.5"
            title="Options & Catégories"
          >
            <Plus className="w-5 h-5 text-slate-200" />
          </button>

          {/* Multiline auto-expanding textarea for User's Idea */}
          <div className="flex-1 min-w-0 flex items-center gap-1 py-0.5 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              dir="auto"
              placeholder={
                isListening
                  ? (lang === 'ar' ? '🎙️ جارٍ الاستماع... تكلّم الآن...' : '🎙️ Écoute en cours...')
                  : (lang === 'ar' ? 'اكتب فكرتك هنا... (Ctrl+K للتركيز)' : 'Demandez ... (Ctrl+K)')
              }
              className={`w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-1.5 sm:px-2 py-1 transition-colors resize-none overflow-y-auto leading-relaxed max-h-[180px] ${
                isListening ? 'placeholder-red-400 font-medium' : ''
              }`}
              style={{ minHeight: '26px' }}
            />

            {/* Desktop Keyboard Shortcut Badge (Cmd/Ctrl + K) */}
            {!inputValue && !isListening && (
              <div
                onClick={() => textareaRef.current?.focus()}
                className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#282a2c]/60 hover:bg-[#333538] border border-[#3c4043] text-[10px] text-slate-400 font-mono select-none cursor-pointer shrink-0 transition-colors"
                title={lang === 'ar' ? 'اختصار لوحة المفاتيح: Ctrl + K للتركيز' : 'Raccourci: Ctrl + K'}
              >
                <span>⌘</span>
                <span>K</span>
              </div>
            )}

            {/* Quick Clear Button (or press Escape) */}
            {inputValue && !isListening && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  baseInputRef.current = '';
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.focus();
                  }
                  showToast(lang === 'ar' ? 'تم مسح نص الفكرة (Esc)' : 'Prompt effacé (Esc)');
                }}
                className="w-6 h-6 rounded-full hover:bg-[#282a2c] text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer self-center"
                title={lang === 'ar' ? 'مسح النص سريعاً (Esc)' : 'Effacer le texte (Esc)'}
                aria-label="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Dictation (Web Speech API) Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full active:scale-95 flex items-center justify-center transition-all shrink-0 cursor-pointer mb-0.5 ${
              isListening
                ? 'bg-red-500/25 text-red-400 border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-[#282a2c]'
            }`}
            title={
              isListening
                ? (lang === 'ar' ? 'إيقاف الإملاء الصوتي' : 'Arrêter la saisie vocale')
                : (lang === 'ar' ? `بدء الإملاء الصوتي (${voiceLang})` : `Démarrer la saisie vocale (${voiceLang})`)
            }
            aria-label="Voice input toggle"
          >
            {isListening ? (
              <AudioWaveform className="w-5 h-5 text-red-400 animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 text-slate-300" />
            )}
          </button>

          {/* Dedicated Send Button - The exclusive way to submit the prompt */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b6ef3] hover:bg-[#1860d5] active:scale-95 text-white flex items-center justify-center transition-all shrink-0 shadow-lg cursor-pointer disabled:opacity-50 mb-0.5"
            title={lang === 'ar' ? 'زر الإرسال / توليد البرومبت' : 'Bouton d\'envoi'}
            aria-label={lang === 'ar' ? 'إرسال الفكرة' : 'Envoyer'}
          >
            <Send className="w-4 h-4 translate-x-[-0.5px] text-white" />
          </button>
        </form>

      </div>

    </div>
  );
};
