import React, { useState, useEffect } from 'react';
import {
  Notebook,
  SourceItem,
  CitationRef,
  NotebookNote,
  AudioOverviewData,
  StudyGuideData,
  BriefingDocData,
  FAQItem,
} from '../../types/notebooklm';
import { DEFAULT_NOTEBOOKS } from '../../data/defaultNotebooks';
import { SourcesPanel } from './SourcesPanel';
import { GroundedChatPanel } from './GroundedChatPanel';
import { NotebookStudioPanel } from './NotebookStudioPanel';
import { AddSourceModal } from './AddSourceModal';
import { SourceDetailModal } from './SourceDetailModal';
import { CitationPopup } from './CitationPopup';
import {
  askNotebookLMGrounded,
  generateAudioOverview,
  generateStudyGuide,
  generateBriefingDoc,
  generateFAQs,
} from '../../services/notebooklmEngine';
import {
  BookOpen,
  Plus,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
  Trash2,
  CheckCircle2,
  Radio,
  FileText,
} from 'lucide-react';

const NOTEBOOK_STORAGE_KEY = 'notebooklm_storage_v1';

interface NotebookLMViewProps {
  onBackToGemini: () => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const NotebookLMView: React.FC<NotebookLMViewProps> = ({
  onBackToGemini,
  lang = 'ar',
}) => {
  // Saved Notebooks state in localStorage
  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    try {
      const stored = localStorage.getItem(NOTEBOOK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_NOTEBOOKS;
  });

  const [activeNotebookId, setActiveNotebookId] = useState<string>(
    notebooks[0]?.id || DEFAULT_NOTEBOOKS[0].id
  );

  // Responsive View Mode for mobile/tablets
  const [mobileTab, setMobileTab] = useState<'sources' | 'chat' | 'studio'>('chat');

  // Notebook switcher dropdown state
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Modals state
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [inspectedSource, setInspectedSource] = useState<SourceItem | null>(null);
  const [activeCitation, setActiveCitation] = useState<CitationRef | null>(null);

  // Loading generation states
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [isGeneratingFaqs, setIsGeneratingFaqs] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Active Notebook
  const activeNotebook =
    notebooks.find((nb) => nb.id === activeNotebookId) || notebooks[0] || DEFAULT_NOTEBOOKS[0];

  // Save changes to localStorage
  const updateActiveNotebook = (updater: (prev: Notebook) => Notebook) => {
    setNotebooks((prevList) => {
      const updated = prevList.map((nb) => {
        if (nb.id === activeNotebook.id) {
          return updater(nb);
        }
        return nb;
      });
      try {
        localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Source Actions
  const handleToggleSource = (sourceId: string) => {
    updateActiveNotebook((nb) => ({
      ...nb,
      sources: nb.sources.map((s) => (s.id === sourceId ? { ...s, isSelected: !s.isSelected } : s)),
    }));
  };

  const handleToggleAllSources = (selected: boolean) => {
    updateActiveNotebook((nb) => ({
      ...nb,
      sources: nb.sources.map((s) => ({ ...s, isSelected: selected })),
    }));
  };

  const handleDeleteSource = (sourceId: string) => {
    updateActiveNotebook((nb) => ({
      ...nb,
      sources: nb.sources.filter((s) => s.id !== sourceId),
    }));
    showToast(lang === 'ar' ? 'تم حذف المصدر من الدفتر' : 'Source deleted');
  };

  const handleAddSource = (sourceData: Omit<SourceItem, 'id' | 'addedAt'>) => {
    const newSource: SourceItem = {
      ...sourceData,
      id: `src-${Date.now()}`,
      addedAt: new Date().toLocaleDateString(),
    };

    updateActiveNotebook((nb) => ({
      ...nb,
      sources: [newSource, ...nb.sources],
    }));

    showToast(lang === 'ar' ? `تمت إضافة "${newSource.title}" إلى المصادر` : 'Source added');
  };

  // Chat Actions
  const handleSendMessage = async (query: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [],
    };

    updateActiveNotebook((nb) => ({
      ...nb,
      chatMessages: [...nb.chatMessages, userMsg],
    }));

    setIsChatLoading(true);

    try {
      const result = await askNotebookLMGrounded(query, activeNotebook.sources, lang);
      updateActiveNotebook((nb) => ({
        ...nb,
        chatMessages: [...nb.chatMessages, result.message],
      }));
    } catch (err) {
      showToast(lang === 'ar' ? 'تعذر إتمام الإجابة، يرجى المحاولة لاحقاً' : 'Failed to ground answer');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm(lang === 'ar' ? 'هل تريد مسح كل رسائل المحادثة في هذا الدفتر؟' : 'Clear all messages in this notebook?')) {
      updateActiveNotebook((nb) => ({
        ...nb,
        chatMessages: [],
      }));
    }
  };

  // Studio Generation Actions
  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    showToast(lang === 'ar' ? 'جارٍ توليد النقاش الصوتي المعمق...' : 'Generating Audio Overview...');
    try {
      const overview = await generateAudioOverview(activeNotebook.sources, lang);
      updateActiveNotebook((nb) => ({
        ...nb,
        audioOverview: overview,
      }));
      showToast(lang === 'ar' ? 'تم تجهيز البودكاست الصوتي بنجاح!' : 'Audio Overview generated!');
    } catch (err) {
      showToast(lang === 'ar' ? 'تعذر توليد البودكاست' : 'Failed to generate audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGenerateStudyGuide = async () => {
    setIsGeneratingGuide(true);
    showToast(lang === 'ar' ? 'جارٍ استخراج الدليل الدراسي والمصطلحات...' : 'Generating Study Guide...');
    try {
      const guide = await generateStudyGuide(activeNotebook.sources, lang);
      updateActiveNotebook((nb) => ({
        ...nb,
        studyGuide: guide,
      }));
      showToast(lang === 'ar' ? 'تم إنشاء الدليل الدراسي والاختبار!' : 'Study Guide generated!');
    } catch (err) {
      showToast(lang === 'ar' ? 'تعذر إنشاء الدليل الدراسي' : 'Failed to generate guide');
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const handleGenerateBriefingDoc = async () => {
    setIsGeneratingDoc(true);
    showToast(lang === 'ar' ? 'جارٍ صياغة مستند الإحاطة التنفيذي...' : 'Generating Briefing Doc...');
    try {
      const doc = await generateBriefingDoc(activeNotebook.sources, lang);
      updateActiveNotebook((nb) => ({
        ...nb,
        briefingDoc: doc,
      }));
      showToast(lang === 'ar' ? 'تم تجهيز مستند الإحاطة التنفيذي!' : 'Briefing Doc generated!');
    } catch (err) {
      showToast(lang === 'ar' ? 'تعذر توليد مستند الإحاطة' : 'Failed to generate doc');
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleGenerateFAQs = async () => {
    setIsGeneratingFaqs(true);
    try {
      const faqsList = await generateFAQs(activeNotebook.sources, lang);
      updateActiveNotebook((nb) => ({
        ...nb,
        faqs: faqsList,
      }));
      showToast(lang === 'ar' ? 'تم توليد الأسئلة الشائعة من المصادر!' : 'FAQs generated!');
    } catch (err) {
      showToast(lang === 'ar' ? 'تعذر استخراج الأسئلة' : 'Failed to generate FAQs');
    } finally {
      setIsGeneratingFaqs(false);
    }
  };

  // Notes Actions
  const handleAddNote = (noteData: Omit<NotebookNote, 'id' | 'createdAt'>) => {
    const newNote: NotebookNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
    };
    updateActiveNotebook((nb) => ({
      ...nb,
      notes: [newNote, ...nb.notes],
    }));
    showToast(lang === 'ar' ? 'تم حفظ الملاحظة بنجاح' : 'Note saved');
  };

  const handleDeleteNote = (noteId: string) => {
    updateActiveNotebook((nb) => ({
      ...nb,
      notes: nb.notes.filter((n) => n.id !== noteId),
    }));
  };

  const handleTogglePinNote = (noteId: string) => {
    updateActiveNotebook((nb) => ({
      ...nb,
      notes: nb.notes.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)),
    }));
  };

  // Notebook Manager Actions (Create / Delete)
  const handleCreateNewNotebook = () => {
    const title = prompt(lang === 'ar' ? 'أدخل اسم الدفتر الجديد:' : 'Enter Notebook Name:');
    if (!title || !title.trim()) return;

    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      title: title.trim(),
      description: lang === 'ar' ? 'دفتر أبحاث جديد تم إنشاؤه في NotebookLM' : 'New NotebookLM workspace',
      icon: '📓',
      color: 'from-blue-600 to-indigo-700',
      sources: [],
      chatMessages: [],
      notes: [],
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };

    setNotebooks((prev) => {
      const updated = [newNb, ...prev];
      try {
        localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setActiveNotebookId(newNb.id);
    setIsSwitcherOpen(false);
    showToast(lang === 'ar' ? `تم إنشاء دفتر "${newNb.title}"` : 'Notebook created');
  };

  const handleDeleteNotebook = (nbId: string) => {
    if (notebooks.length <= 1) {
      alert(lang === 'ar' ? 'يجب الاحتفاظ بدفتر واحد على الأقل' : 'Must keep at least one notebook');
      return;
    }
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الدفتر بكل مصادره؟' : 'Delete this notebook?')) {
      const nextList = notebooks.filter((n) => n.id !== nbId);
      setNotebooks(nextList);
      setActiveNotebookId(nextList[0].id);
      try {
        localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(nextList));
      } catch {}
      showToast(lang === 'ar' ? 'تم حذف الدفتر' : 'Notebook deleted');
    }
  };

  const activeSourcesCount = activeNotebook.sources.filter((s) => s.isSelected).length;

  return (
    <div className="w-full h-screen flex flex-col bg-[#000000] text-slate-100 overflow-hidden font-sans select-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Navbar matching Google NotebookLM */}
      <header className="h-14 px-3 sm:px-5 bg-[#121316] border-b border-[#2d2f31] flex items-center justify-between shrink-0 z-30">
        
        {/* Left Side: Brand Logo, Notebook Selector Dropdown, Back to Gemini */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Back to Gemini Prompter Button */}
          <button
            onClick={onBackToGemini}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-[#282a2e] text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title={lang === 'ar' ? 'العودة إلى Gemini' : 'Back to Gemini'}
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4 text-slate-400" /> : <ArrowLeft className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">Gemini</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

          {/* NotebookLM Title & Icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <span className="text-base font-bold">N</span>
            </div>
            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white">NotebookLM</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                  Google
                </span>
              </div>
            </div>
          </div>

          {/* Notebook Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2025] hover:bg-[#272a31] border border-[#383a40] text-xs font-medium text-white transition-all shadow-sm max-w-[170px] sm:max-w-[260px] md:max-w-[340px]"
            >
              <span className="text-sm shrink-0">{activeNotebook.icon || '📓'}</span>
              <span className="truncate">{activeNotebook.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Notebooks Dropdown Menu */}
            {isSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                  onClick={() => setIsSwitcherOpen(false)}
                />
                <div className="absolute top-12 left-0 rtl:left-auto rtl:right-0 w-72 sm:w-80 bg-[#1e1f20] border border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#2d2f31] flex items-center justify-between text-xs text-slate-400">
                    <span>{lang === 'ar' ? 'دفاتر أبحاثك' : 'Your Notebooks'}</span>
                    <button
                      onClick={handleCreateNewNotebook}
                      className="text-xs text-[#7cacf8] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'دفتر جديد' : 'New Notebook'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 my-1 max-h-60 overflow-y-auto">
                    {notebooks.map((nb) => {
                      const isCur = nb.id === activeNotebook.id;
                      return (
                        <div
                          key={nb.id}
                          className={`p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                            isCur
                              ? 'bg-[#1b6ef3]/20 border border-[#1b6ef3]/40 text-[#c2e7ff]'
                              : 'hover:bg-[#282a2c] text-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotebookId(nb.id);
                              setIsSwitcherOpen(false);
                            }}
                            className="flex-1 flex items-center gap-2 text-start text-xs truncate"
                          >
                            <span>{nb.icon || '📓'}</span>
                            <span className="font-medium truncate">{nb.title}</span>
                          </button>

                          {notebooks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteNotebook(nb.id)}
                              className="p-1 rounded-md text-slate-500 hover:text-rose-400"
                              title="حذف الدفتر"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Responsive Column Switcher (for small screens) + Share & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Mobile Column Tabs Switcher */}
          <div className="flex lg:hidden items-center p-1 bg-[#1a1b1f] rounded-xl border border-[#2d2f31] text-[11px]">
            <button
              onClick={() => setMobileTab('sources')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mobileTab === 'sources'
                  ? 'bg-[#1b6ef3] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? `المصادر (${activeSourcesCount})` : `Sources (${activeSourcesCount})`}
            </button>
            <button
              onClick={() => setMobileTab('chat')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mobileTab === 'chat'
                  ? 'bg-[#1b6ef3] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? 'المحادثة' : 'Chat'}
            </button>
            <button
              onClick={() => setMobileTab('studio')}
              className={`px-2 py-1 rounded-lg transition-all ${
                mobileTab === 'studio'
                  ? 'bg-[#1b6ef3] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? 'الاستوديو' : 'Studio'}
            </button>
          </div>

          {/* Source Active Count Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a20] border border-[#2e3138] text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {lang === 'ar'
                ? `${activeSourcesCount} من ${activeNotebook.sources.length} مصادر نشطة`
                : `${activeSourcesCount}/${activeNotebook.sources.length} sources active`}
            </span>
          </div>

          {/* Add Source Fast Button in Header */}
          <button
            onClick={() => setIsAddSourceOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'إضافة مصدر' : 'Add Source'}</span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Sources Panel (Visible on Desktop OR when mobileTab === 'sources') */}
        <div
          className={`w-full lg:w-72 xl:w-80 shrink-0 h-full ${
            mobileTab === 'sources' ? 'block' : 'hidden lg:block'
          }`}
        >
          <SourcesPanel
            sources={activeNotebook.sources}
            onToggleSource={handleToggleSource}
            onToggleAllSources={handleToggleAllSources}
            onDeleteSource={handleDeleteSource}
            onViewSource={(src) => setInspectedSource(src)}
            onOpenAddModal={() => setIsAddSourceOpen(true)}
            lang={lang}
          />
        </div>

        {/* Center Column: Grounded Chat Panel (Visible on Desktop OR when mobileTab === 'chat') */}
        <div
          className={`flex-1 h-full min-w-0 ${
            mobileTab === 'chat' ? 'block' : 'hidden lg:block'
          }`}
        >
          <GroundedChatPanel
            messages={activeNotebook.chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            selectedSources={activeNotebook.sources.filter((s) => s.isSelected)}
            onSelectCitation={(cit) => setActiveCitation(cit)}
            onSaveToNotes={(content, title) => {
              handleAddNote({
                title: title || 'اقتباس من المحادثة',
                content,
                color: 'blue',
                isPinned: true,
                sourceTitle: title,
              });
            }}
            onClearChat={handleClearChat}
            lang={lang}
          />
        </div>

        {/* Right Column: Studio Panel (Audio Overview, Study Guide, Briefing, FAQs, Notes) */}
        <div
          className={`w-full lg:w-80 xl:w-96 shrink-0 h-full ${
            mobileTab === 'studio' ? 'block' : 'hidden lg:block'
          }`}
        >
          <NotebookStudioPanel
            audioOverview={activeNotebook.audioOverview || null}
            studyGuide={activeNotebook.studyGuide || null}
            briefingDoc={activeNotebook.briefingDoc || null}
            faqs={activeNotebook.faqs || null}
            notes={activeNotebook.notes}
            onGenerateAudio={handleGenerateAudio}
            onGenerateStudyGuide={handleGenerateStudyGuide}
            onGenerateBriefingDoc={handleGenerateBriefingDoc}
            onGenerateFAQs={handleGenerateFAQs}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onTogglePinNote={handleTogglePinNote}
            onSelectCitation={(cit) => setActiveCitation(cit)}
            isGeneratingAudio={isGeneratingAudio}
            isGeneratingGuide={isGeneratingGuide}
            isGeneratingDoc={isGeneratingDoc}
            isGeneratingFaqs={isGeneratingFaqs}
            lang={lang}
          />
        </div>
      </div>

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={handleAddSource}
        lang={lang}
      />

      {/* Source Detail Modal */}
      <SourceDetailModal
        source={inspectedSource}
        onClose={() => setInspectedSource(null)}
        lang={lang}
      />

      {/* Citation Popover Modal */}
      <CitationPopup
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
        onViewSource={(sourceId) => {
          const match = activeNotebook.sources.find((s) => s.id === sourceId);
          if (match) setInspectedSource(match);
        }}
        onSaveToNote={(cit) => {
          handleAddNote({
            title: `اقتباس: ${cit.sourceTitle}`,
            content: cit.quote,
            color: 'amber',
            isPinned: true,
            sourceTitle: cit.sourceTitle,
          });
        }}
        lang={lang}
      />

      {/* Floating Action Feedback Toast */}
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
};
