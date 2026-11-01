import React, { useState } from 'react';
import {
  Radio,
  BookOpen,
  FileCheck,
  HelpCircle,
  Bookmark,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Pin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  AudioOverviewData,
  StudyGuideData,
  BriefingDocData,
  FAQItem,
  NotebookNote,
  CitationRef,
} from '../../types/notebooklm';
import { AudioOverviewPlayer } from './AudioOverviewPlayer';

interface NotebookStudioPanelProps {
  audioOverview: AudioOverviewData | null;
  studyGuide: StudyGuideData | null;
  briefingDoc: BriefingDocData | null;
  faqs: FAQItem[] | null;
  notes: NotebookNote[];
  onGenerateAudio: () => void;
  onGenerateStudyGuide: () => void;
  onGenerateBriefingDoc: () => void;
  onGenerateFAQs: () => void;
  onAddNote: (note: Omit<NotebookNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePinNote: (noteId: string) => void;
  onSelectCitation: (citation: CitationRef) => void;
  isGeneratingAudio?: boolean;
  isGeneratingGuide?: boolean;
  isGeneratingDoc?: boolean;
  isGeneratingFaqs?: boolean;
  lang?: 'ar' | 'en' | 'fr';
}

export const NotebookStudioPanel: React.FC<NotebookStudioPanelProps> = ({
  audioOverview,
  studyGuide,
  briefingDoc,
  faqs,
  notes,
  onGenerateAudio,
  onGenerateStudyGuide,
  onGenerateBriefingDoc,
  onGenerateFAQs,
  onAddNote,
  onDeleteNote,
  onTogglePinNote,
  onSelectCitation,
  isGeneratingAudio = false,
  isGeneratingGuide = false,
  isGeneratingDoc = false,
  isGeneratingFaqs = false,
  lang = 'ar',
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'guide' | 'doc' | 'faqs' | 'notes'>('audio');

  // Study Guide Quiz interactive answer reveals
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  // FAQ accordion
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // New Note Modal / Inline Form
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState<NotebookNote['color']>('blue');

  // Copied State
  const [copiedDoc, setCopiedDoc] = useState(false);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    onAddNote({
      title: noteTitle.trim() || 'ملاحظة جديدة',
      content: noteContent.trim(),
      color: noteColor,
      isPinned: false,
    });

    setNoteTitle('');
    setNoteContent('');
    setIsAddingNote(false);
  };

  const handleCopyBriefing = async () => {
    if (!briefingDoc) return;
    const markdown = `# ${briefingDoc.title}\n\n## ملخص تنفيذي\n${briefingDoc.executiveSummary}\n\n## أبرز النتائج\n${briefingDoc.keyTakeaways.map((t) => `• ${t}`).join('\n')}\n\n## التوصيات وخطوات العمل\n${briefingDoc.actionItems.map((a) => `• ${a}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
    } catch {}
  };

  return (
    <div className="h-full flex flex-col bg-[#111214] border-l rtl:border-l-0 rtl:border-r border-[#2d2f31] text-slate-100 select-none overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Studio Segmented Tool Navigation */}
      <div className="p-2.5 bg-[#141518] border-b border-[#2d2f31] shrink-0">
        <div className="flex items-center gap-1 p-1 bg-[#0c0d0f] rounded-2xl border border-[#232428] overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all shrink-0 ${
              activeTab === 'audio'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'ar' ? 'نظرة صوتية (بودكاست)' : 'Audio Overview'}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'صوت' : 'Audio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all shrink-0 ${
              activeTab === 'guide'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'ar' ? 'دليل دراسي واختبار' : 'Study Guide'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'دليل' : 'Guide'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('doc')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all shrink-0 ${
              activeTab === 'doc'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'ar' ? 'مستند إحاطة' : 'Briefing Doc'}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إحاطة' : 'Brief'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all shrink-0 ${
              activeTab === 'faqs'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'ar' ? 'أسئلة شائعة' : 'FAQs'}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أسئلة' : 'FAQ'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all shrink-0 ${
              activeTab === 'notes'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={lang === 'ar' ? 'الملاحظات' : 'Notes'}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'ملاحظات' : 'Notes'}</span>
            {notes.length > 0 && (
              <span className="text-[10px] opacity-75 font-mono">({notes.length})</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Body Content */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Tab 1: Audio Overview Player */}
        {activeTab === 'audio' && (
          <AudioOverviewPlayer
            data={audioOverview}
            onGenerateNew={onGenerateAudio}
            isGenerating={isGeneratingAudio}
            lang={lang}
          />
        )}

        {/* Tab 2: Study Guide */}
        {activeTab === 'guide' && (
          <div className="p-4 sm:p-5 flex flex-col gap-4 text-xs sm:text-sm">
            {!studyGuide ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 shadow-md">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {lang === 'ar' ? 'الدليل الدراسي الشامل' : 'Interactive Study Guide'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'استخرج مسرد المفاهيم الرئيسية، وبنك أسئلة الاختبار الذاتي من وثائقك المرفوعة.'
                    : 'Extract key terms glossary and practice quizzes grounded strictly in your documents.'}
                </p>
                <button
                  onClick={onGenerateStudyGuide}
                  disabled={isGeneratingGuide}
                  className="px-4 py-2 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isGeneratingGuide
                      ? lang === 'ar' ? 'جارٍ إعداد الدليل...' : 'Generating...'
                      : lang === 'ar' ? 'توليد الدليل الدراسي' : 'Generate Study Guide'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{studyGuide.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{studyGuide.overview}</p>
                  </div>
                  <button
                    onClick={onGenerateStudyGuide}
                    disabled={isGeneratingGuide}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="تجديد"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>

                {/* Key Terms Glossary */}
                <div className="flex flex-col gap-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {lang === 'ar' ? 'مسرد المصطلحات والمفاهيم المحورية:' : 'Key Concepts Glossary:'}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {studyGuide.keyTerms.map((term, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#17181c] border border-[#2d2f31] flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-xs">{term.term}</span>
                          {term.sourceTitle && (
                            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                              {term.sourceTitle}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{term.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Practice Quiz */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {lang === 'ar' ? 'بنك أسئلة واختبار ذاتي:' : 'Practice Quiz:'}
                  </h4>
                  {studyGuide.quizQuestions.map((quiz, qIdx) => {
                    const chosen = selectedAnswers[quiz.id];
                    const showExp = showExplanations[quiz.id];

                    return (
                      <div
                        key={quiz.id}
                        className="p-3.5 rounded-2xl bg-[#17181c] border border-[#2d2f31] flex flex-col gap-2.5"
                      >
                        <span className="font-semibold text-white text-xs">
                          {qIdx + 1}. {quiz.question}
                        </span>

                        <div className="flex flex-col gap-1.5">
                          {quiz.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            const isCorrect = quiz.correctIndex === optIdx;
                            let btnStyle = 'bg-[#1f2025] hover:bg-[#282a30] text-slate-300 border-[#32353c]';

                            if (chosen !== undefined) {
                              if (isSelected && isCorrect) {
                                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                              } else if (isSelected && !isCorrect) {
                                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                              } else if (isCorrect) {
                                btnStyle = 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [quiz.id]: optIdx }))
                                }
                                className={`w-full text-start p-2 rounded-xl border text-xs transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setShowExplanations((prev) => ({
                                ...prev,
                                [quiz.id]: !prev[quiz.id],
                              }))
                            }
                            className="text-[11px] text-[#7cacf8] hover:underline"
                          >
                            {showExp
                              ? lang === 'ar' ? 'إخفاء التفسير' : 'Hide explanation'
                              : lang === 'ar' ? 'عرض التفسير والحل' : 'Show explanation'}
                          </button>
                        </div>

                        {showExp && (
                          <div className="p-2.5 rounded-xl bg-black/40 border border-[#383a40] text-xs text-slate-300 leading-relaxed font-sans">
                            <span className="font-semibold text-emerald-400 block mb-0.5">
                              {lang === 'ar' ? 'التفسير الموثق:' : 'Explanation:'}
                            </span>
                            {quiz.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Briefing Doc */}
        {activeTab === 'doc' && (
          <div className="p-4 sm:p-5 flex flex-col gap-4 text-xs sm:text-sm">
            {!briefingDoc ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 shadow-md">
                  <FileCheck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {lang === 'ar' ? 'مستند إحاطة تنفيذي' : 'Executive Briefing Doc'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'لخص مصادرك في تقرير إحاطة مؤسسي رفيع المستوى مع تقييم المخاطر وخطة العمل.'
                    : 'Transform your sources into an executive briefing document with action items.'}
                </p>
                <button
                  onClick={onGenerateBriefingDoc}
                  disabled={isGeneratingDoc}
                  className="px-4 py-2 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isGeneratingDoc
                      ? lang === 'ar' ? 'جارٍ إعداد الإحاطة...' : 'Generating...'
                      : lang === 'ar' ? 'توليد مستند الإحاطة' : 'Generate Briefing Doc'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3">
                  <h3 className="text-base font-semibold text-white">{briefingDoc.title}</h3>
                  <button
                    onClick={handleCopyBriefing}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
                  >
                    {copiedDoc ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{lang === 'ar' ? 'نسخ التقرير' : 'Copy'}</span>
                  </button>
                </div>

                {/* Executive Summary */}
                <div className="p-3.5 rounded-2xl bg-[#17181c] border border-[#2d2f31]">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                    {lang === 'ar' ? 'الملخص التنفيذي:' : 'Executive Summary:'}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {briefingDoc.executiveSummary}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="p-3.5 rounded-2xl bg-[#17181c] border border-[#2d2f31] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {lang === 'ar' ? 'أبرز المخرجات والنتائج:' : 'Key Takeaways:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {briefingDoc.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="p-3.5 rounded-2xl bg-[#17181c] border border-[#2d2f31] flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {lang === 'ar' ? 'خطوات العمل والتوصيات:' : 'Action Items:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {briefingDoc.actionItems.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === 'faqs' && (
          <div className="p-4 sm:p-5 flex flex-col gap-4 text-xs sm:text-sm">
            {!faqs ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 shadow-md">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {lang === 'ar' ? 'الأسئلة الأكثر شيوعاً (FAQ)' : 'Frequently Asked Questions'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4 leading-relaxed">
                  {lang === 'ar'
                    ? 'استخرج الأسئلة والإجابات الأكثر أهمية من وثائقك مع توثيق الاقتباسات.'
                    : 'Auto-generate key questions and answers grounded in your documents.'}
                </p>
                <button
                  onClick={onGenerateFAQs}
                  disabled={isGeneratingFaqs}
                  className="px-4 py-2 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isGeneratingFaqs
                      ? lang === 'ar' ? 'جارٍ الاستخراج...' : 'Generating...'
                      : lang === 'ar' ? 'توليد الأسئلة الشائعة' : 'Generate FAQs'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3 mb-1">
                  <span className="text-xs font-semibold text-white">
                    {lang === 'ar' ? 'الأسئلة الشائعة المستخلصة من المصادر' : 'Grounded FAQs'}
                  </span>
                  <button
                    onClick={onGenerateFAQs}
                    disabled={isGeneratingFaqs}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>

                {faqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl bg-[#17181c] border border-[#2d2f31] overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-3.5 flex items-center justify-between text-start text-xs font-semibold text-white hover:text-[#c2e7ff] transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed font-sans border-t border-[#232428] mt-1">
                          <p className="mt-2">{faq.answer}</p>
                          {faq.citations && faq.citations.length > 0 && (
                            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                              {faq.citations.map((c) => (
                                <button
                                  key={c.citationId}
                                  onClick={() => onSelectCitation(c)}
                                  className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-[#7cacf8] border border-[#1b6ef3]/40"
                                >
                                  [{c.citationId}] {c.sourceTitle}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Notes Pinboard */}
        {activeTab === 'notes' && (
          <div className="p-4 sm:p-5 flex flex-col gap-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3">
              <span className="text-xs font-semibold text-white">
                {lang === 'ar' ? 'استوديو الملاحظات المحفوظة' : 'Saved Notes & Pins'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="px-3 py-1.5 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-xs font-semibold shadow-sm flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'ملاحظة جديدة' : 'New Note'}</span>
              </button>
            </div>

            {/* Inline Note Creation Form */}
            {isAddingNote && (
              <form
                onSubmit={handleCreateNote}
                className="p-3.5 rounded-2xl bg-[#18191d] border border-[#383a3e] flex flex-col gap-3 animate-in fade-in duration-150"
              >
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'عنوان الملاحظة...' : 'Note title...'}
                  className="w-full bg-[#111214] border border-[#2d2f31] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8]"
                />

                <textarea
                  required
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب ملاحظتك الشخصية هنا...' : 'Type note content...'}
                  className="w-full bg-[#111214] border border-[#2d2f31] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8] resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {(['blue', 'amber', 'emerald', 'purple', 'rose'] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNoteColor(color)}
                        className={`w-4 h-4 rounded-full transition-transform ${
                          color === 'blue'
                            ? 'bg-blue-500'
                            : color === 'amber'
                            ? 'bg-amber-500'
                            : color === 'emerald'
                            ? 'bg-emerald-500'
                            : color === 'purple'
                            ? 'bg-purple-500'
                            : 'bg-rose-500'
                        } ${noteColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={!noteContent.trim()}
                      className="px-3.5 py-1 rounded-lg bg-[#1b6ef3] text-white text-xs font-semibold"
                    >
                      {lang === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Notes List */}
            {notes.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs">
                  {lang === 'ar'
                    ? 'لم تحفظ أي ملاحظات بعد. يمكنك حفظ الردود من المحادثة مباشرة أو كتابة ملاحظاتك هنا.'
                    : 'No saved notes. Save insights from chat or write notes here.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {notes.map((note) => {
                  const borderColors = {
                    blue: 'border-blue-500/40 bg-blue-950/20',
                    amber: 'border-amber-500/40 bg-amber-950/20',
                    emerald: 'border-emerald-500/40 bg-emerald-950/20',
                    purple: 'border-purple-500/40 bg-purple-950/20',
                    rose: 'border-rose-500/40 bg-rose-950/20',
                    zinc: 'border-zinc-500/40 bg-zinc-900/30',
                  };

                  return (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-2xl border transition-all relative flex flex-col gap-1.5 ${
                        borderColors[note.color || 'blue']
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{note.title}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onTogglePinNote(note.id)}
                            className={`p-1 rounded-md transition-colors ${
                              note.isPinned
                                ? 'text-amber-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={note.isPinned ? 'مثبتة' : 'تثبيت'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-400"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                        {note.content}
                      </p>

                      {note.sourceTitle && (
                        <span className="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-white/5 truncate">
                          📌 {note.sourceTitle}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
