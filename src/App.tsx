import React, { useState, useEffect } from 'react';
import { GeminiHeader } from './components/GeminiHeader';
import { GeminiHomeView } from './components/GeminiHomeView';
import { GeminiBottomSheet } from './components/GeminiBottomSheet';
import { GeminiSidebar } from './components/GeminiSidebar';
import { PromptLibraryModal } from './components/PromptLibraryModal';
import { PromptRulesModal } from './components/PromptRulesModal';
import { NotebookLMView } from './components/notebooklm/NotebookLMView';
import {
  TargetModel,
  ChatMessage,
  PromptCategory,
  OutputLanguage,
  ExecutionType,
  DetailLevel,
  DeliveryMode,
  UserSession,
} from './types';
import { ArabiPromptEngine, generateMetaPrompt } from './utils/ArabiPromptEngine';
import { CheckCircle2 } from 'lucide-react';

const STORE_KEY = 'dawai-free-v1';
const AUTH_KEY = 'adwaw_user_session_v1';

const DEFAULT_USER: UserSession = {
  isLoggedIn: true,
  name: 'Adwaw',
  email: 'dawrachid4@gmail.com',
  avatar: '/assets/user_avatar.png',
};

interface SavedSession {
  id: string;
  title: string;
  messages: Array<{ idea: string; prompt: string }>;
}

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en' | 'fr'>('ar');
  const [activeAppMode, setActiveAppMode] = useState<'gemini' | 'notebooklm'>('gemini');
  const [currentModel, setCurrentModel] = useState<TargetModel>('gemini-flash-lite');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // User Session Management
  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_USER;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleSignOut = () => {
    const updated: UserSession = {
      ...userSession,
      isLoggedIn: false,
    };
    setUserSession(updated);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    } catch {}
    setIsSidebarOpen(false);
    showToast(
      lang === 'ar'
        ? 'تم تسجيل الخروج من حساب Adwaw (dawrachid4@gmail.com) بنجاح'
        : lang === 'fr'
        ? 'Déconnexion du compte Adwaw (dawrachid4@gmail.com) réussie'
        : 'Signed out of Adwaw (dawrachid4@gmail.com) successfully'
    );
  };

  const handleSignIn = () => {
    const updated: UserSession = {
      ...DEFAULT_USER,
      isLoggedIn: true,
    };
    setUserSession(updated);
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    } catch {}
    showToast(
      lang === 'ar'
        ? 'تم تسجيل الدخول بحساب Adwaw (dawrachid4@gmail.com)'
        : lang === 'fr'
        ? 'Connecté en tant que Adwaw (dawrachid4@gmail.com)'
        : 'Signed in as Adwaw (dawrachid4@gmail.com)'
    );
  };
  
  // Daw Ai Specific Controls & ArabiPrompt Configuration
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('auto');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('en');
  const [executionType, setExecutionType] = useState<ExecutionType>('both');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('medium');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('both');
  const [tone, setTone] = useState<string>('رسمي واحترافي');

  // Sessions History matching Daw Ai localStorage
  const [sessions, setSessions] = useState<SavedSession[]>(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (Array.isArray(data)) return data;
    } catch {}
    return [];
  });

  // Current Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    document.documentElement.dir = ['ar', 'darija'].includes(outputLanguage) || lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = ['ar', 'darija'].includes(outputLanguage) ? 'ar' : outputLanguage;
  }, [lang, outputLanguage]);

  const saveSessionsToStorage = (updatedSessions: SavedSession[]) => {
    setSessions(updatedSessions);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(updatedSessions.slice(0, 40)));
    } catch {}
  };

  // Main prompt generation triggered by entered idea
  const handleGeneratePrompt = (
    idea: string,
    category: PromptCategory = selectedCategory,
    language: OutputLanguage = outputLanguage,
    execution: ExecutionType = executionType
  ) => {
    if (!idea.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: idea,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      // Execute using ArabiPromptEngine.generate
      const promptData = ArabiPromptEngine.generate(idea, {
        category,
        language,
        execute: execution !== 'prompt_only' && deliveryMode !== 'prompt_only',
        model: currentModel,
        detail: detailLevel,
        delivery: deliveryMode,
        tone,
        brand: true,
      });

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: currentModel,
        promptData,
      };

      setMessages((prev) => [...prev, modelMsg]);
      setIsLoading(false);

      // Save to sessions history (Daw Ai style)
      const newSession: SavedSession = {
        id: Date.now().toString(),
        title: idea.slice(0, 48),
        messages: [{ idea, prompt: promptData.promptCode }],
      };
      saveSessionsToStorage([newSession, ...sessions.filter((s) => s.title !== newSession.title)]);
    }, 450);
  };

  const handleSelectCategoryFromDrawer = (cat: PromptCategory, sampleText?: string) => {
    setSelectedCategory(cat);
    if (sampleText) {
      handleGeneratePrompt(sampleText, cat, outputLanguage, executionType);
    }
  };

  const handleSelectHistorySession = (session: SavedSession) => {
    if (session.messages.length > 0) {
      const first = session.messages[0];
      const promptData = generateMetaPrompt(
        first.idea,
        'auto',
        outputLanguage,
        executionType,
        currentModel,
        detailLevel,
        deliveryMode,
        tone
      );
      setMessages([
        {
          id: Date.now().toString(),
          role: 'user',
          content: first.idea,
          timestamp: 'السابق',
        },
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: '',
          timestamp: 'السابق',
          model: currentModel,
          promptData,
        },
      ]);
    }
  };

  const handleClearHistory = () => {
    if (confirm('حذف كل المحادثات المحفوظة محلياً؟')) {
      saveSessionsToStorage([]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  // If user selected NotebookLM mode, render the full NotebookLM studio
  if (activeAppMode === 'notebooklm') {
    return (
      <NotebookLMView
        onBackToGemini={() => setActiveAppMode('gemini')}
        lang={lang}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#000000] bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(10,24,60,0.65),rgba(0,0,0,1))] text-[#f5f6fc] flex flex-col font-sans selection:bg-[#647de8] selection:text-white m-0 p-0 overflow-x-hidden">
      
      {/* Top Header */}
      <GeminiHeader
        currentModel={currentModel}
        onSelectModel={(model) => setCurrentModel(model)}
        onOpenDrawer={() => setIsSidebarOpen(true)}
        onNewChat={handleNewChat}
        onOpenNotebookLM={() => setActiveAppMode('notebooklm')}
        lang={lang}
        setLang={(newLang) => setLang(newLang)}
        userSession={userSession}
        onSignOut={handleSignOut}
        onSignIn={handleSignIn}
      />

      {/* Main Home & Prompt Stream View */}
      <main className="w-full flex-1 flex flex-col items-center">
        <GeminiHomeView
          currentModel={currentModel}
          onOpenBottomSheet={() => setIsBottomSheetOpen(true)}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          lang={lang}
          messages={messages}
          onSendMessage={handleGeneratePrompt}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          executionType={executionType}
          setExecutionType={setExecutionType}
          detailLevel={detailLevel}
          setDetailLevel={setDetailLevel}
          deliveryMode={deliveryMode}
          setDeliveryMode={setDeliveryMode}
          tone={tone}
          setTone={setTone}
        />
      </main>

      {/* Bottom Sheet Drawer for Categories & Options */}
      <GeminiBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        onSelectCategory={handleSelectCategoryFromDrawer}
        lang={lang}
        detailLevel={detailLevel}
        setDetailLevel={setDetailLevel}
        deliveryMode={deliveryMode}
        setDeliveryMode={setDeliveryMode}
        tone={tone}
        setTone={setTone}
      />

      {/* Sidebar Drawer matching Gemini official UI */}
      <GeminiSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onOpenNotebookLM={() => setActiveAppMode('notebooklm')}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onSelectCategory={handleSelectCategoryFromDrawer}
        onSelectHistorySession={handleSelectHistorySession}
        onClearHistory={handleClearHistory}
        sessions={sessions}
        lang={lang}
        userSession={userSession}
        onSignOut={handleSignOut}
        onSignIn={handleSignIn}
      />

      {/* Modal for Prompt Library extracted from attached PDF files */}
      <PromptLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectPrompt={(promptText) => {
          handleGeneratePrompt(promptText, selectedCategory, outputLanguage, executionType);
        }}
        onOpenRules={() => setIsRulesOpen(true)}
        lang={lang}
      />

      {/* Modal for Constitutional Laws & Rules of Prompt Engineering */}
      <PromptRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        onApplyTemplate={(template) => {
          handleGeneratePrompt(template, selectedCategory, outputLanguage, executionType);
        }}
        lang={lang}
      />

      {/* Global Floating Action Feedback Toast */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#1e1f20] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full border border-[#444746] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          <CheckCircle2 className="w-4 h-4 text-[#7cacf8] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
