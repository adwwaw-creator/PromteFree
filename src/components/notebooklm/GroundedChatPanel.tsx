import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bookmark,
  Copy,
  Check,
  Volume2,
  Trash2,
  Mic,
  MicOff,
  CornerDownLeft,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { NotebookChatMessage, CitationRef, SourceItem } from '../../types/notebooklm';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface GroundedChatPanelProps {
  messages: NotebookChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  selectedSources: SourceItem[];
  onSelectCitation: (citation: CitationRef) => void;
  onSaveToNotes: (content: string, sourceTitle?: string) => void;
  onClearChat: () => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const GroundedChatPanel: React.FC<GroundedChatPanelProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedSources,
  onSelectCitation,
  onSaveToNotes,
  onClearChat,
  lang = 'ar',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Dynamic textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const computed = Math.min(Math.max(scrollHeight, 36), 140);
      textareaRef.current.style.height = `${computed}px`;
    }
  }, [inputValue]);

  // Voice Input via Web Speech API
  const {
    isListening,
    startListening,
    stopListening,
    isSupported: isVoiceSupported,
  } = useSpeechRecognition({
    lang: lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
    onTranscriptChange: (spoken) => {
      setInputValue((prev) => (prev ? `${prev} ${spoken}` : spoken));
    },
  });

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isVoiceSupported) {
        alert(lang === 'ar' ? 'التعرف الصوتي غير مدعوم في هذا المتصفح' : 'Speech recognition not supported');
        return;
      }
      startListening(lang === 'ar' ? 'ar-SA' : 'en-US');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handlePin = (msg: NotebookChatMessage) => {
    onSaveToNotes(msg.content, msg.citations[0]?.sourceTitle || 'رد من NotebookLM');
    setPinnedId(msg.id);
    setTimeout(() => setPinnedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove citation tags [1], [2] for smooth reading
      const cleanText = text.replace(/\[\d+\]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper to parse message text and render clickable citation badges [1], [2]
  const renderFormattedContent = (content: string, citations: CitationRef[]) => {
    const parts = content.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const citationObj = citations.find((c) => c.citationId === citationNum) || {
          citationId: citationNum,
          sourceId: 'src-default',
          sourceTitle: `المصدر [${citationNum}]`,
          quote: 'اقتباس موثق من نصوص المصادر النشطة في هذا الدفتر.',
        };

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelectCitation(citationObj)}
            className="inline-flex items-center justify-center mx-1 px-1.5 py-0.2 rounded-md bg-[#1b6ef3]/20 hover:bg-[#1b6ef3]/40 border border-[#1b6ef3]/50 text-[#7cacf8] text-[11px] font-bold font-mono transition-transform active:scale-90 align-baseline cursor-pointer"
            title={`${lang === 'ar' ? 'عرض اقتباس المصدر' : 'View Citation'} [${citationNum}]`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const defaultSuggestions = [
    lang === 'ar' ? 'لخص المصادر المحددة في نقاط رئيسية' : 'Summarize the selected sources',
    lang === 'ar' ? 'ما هي أهم النتائج العملية المستخلصة؟' : 'What are the key takeaways?',
    lang === 'ar' ? 'قارن بين الأفكار المطروحة في الوثائق' : 'Compare perspectives across documents',
    lang === 'ar' ? 'هل هناك قيود أو مخاطر محددة؟' : 'Are there any critical risks mentioned?',
  ];

  return (
    <div className="h-full flex flex-col bg-[#0e0f11] text-slate-100 overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Status Header */}
      <div className="px-4 py-3 border-b border-[#2d2f31] flex items-center justify-between shrink-0 bg-[#131416]/80 backdrop-blur-xs">
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-[#7cacf8]" />
          <span className="font-semibold text-slate-200">
            {lang === 'ar' ? 'المحادثة الموثقة بالمصادر' : 'Grounded Research Chat'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {selectedSources.length} {lang === 'ar' ? 'مصادر مفعلة' : 'sources active'}
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-colors text-xs flex items-center gap-1"
            title={lang === 'ar' ? 'مسح المحادثة' : 'Clear Chat'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'مسح' : 'Clear'}</span>
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-700">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-14 h-14 rounded-3xl bg-[#1e1f20] border border-[#383a3c] flex items-center justify-center text-indigo-400 mb-3 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
              {lang === 'ar' ? 'اسأل أي شيء حول مصادرك' : 'Ask anything about your sources'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
              {lang === 'ar'
                ? 'في NotebookLM، كل إجابة يتم تقديمها تكون مستندة وموثقة باقتباسات حرفية [1] من وثائقك المحددة دون هلوسة.'
                : 'NotebookLM grounds every answer strictly in your selected sources with verifiable inline citations [1].'}
            </p>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 max-w-lg">
              {defaultSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(sug)}
                  className="px-3.5 py-2 rounded-xl bg-[#18191c] hover:bg-[#22242a] border border-[#2d2f31] hover:border-[#7cacf8]/40 text-xs text-slate-300 hover:text-white transition-all text-start"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 max-w-[90%] sm:max-w-[85%] ${
                  isUser ? 'self-end' : 'self-start'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed transition-all ${
                    isUser
                      ? 'bg-[#1b6ef3] text-white rounded-br-xs shadow-md'
                      : 'bg-[#18191d] text-slate-200 border border-[#2d2f31] rounded-bl-xs shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="whitespace-pre-wrap font-sans">
                      {renderFormattedContent(msg.content, msg.citations)}
                    </div>
                  )}
                </div>

                {/* Assistant Message Actions & Citations Summary */}
                {!isUser && (
                  <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
                    {/* Citations Preview Chips */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {lang === 'ar' ? 'المصادر:' : 'Citations:'}
                        </span>
                        {msg.citations.map((c) => (
                          <button
                            key={c.citationId}
                            onClick={() => onSelectCitation(c)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e2025] hover:bg-[#282b32] text-slate-300 text-[10px] border border-[#383b42] transition-colors"
                          >
                            <span className="font-mono text-[#7cacf8]">[{c.citationId}]</span>
                            <span className="truncate max-w-[110px]">{c.sourceTitle}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Actions: Copy, Pin, Read */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto rtl:ml-0 rtl:mr-auto">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
                        title={lang === 'ar' ? 'نسخ الإجابة' : 'Copy'}
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handlePin(msg)}
                        className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-[#282a2c] transition-colors"
                        title={lang === 'ar' ? 'حفظ في استوديو الملاحظات' : 'Save to Notes'}
                      >
                        {pinnedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-300 hover:bg-[#282a2c] transition-colors"
                        title={lang === 'ar' ? 'قراءة صوتية' : 'Read Aloud'}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="self-start p-4 rounded-3xl bg-[#18191d] border border-[#2d2f31] flex items-center gap-2.5 text-xs text-slate-300 animate-pulse">
            <Sparkles className="w-4 h-4 text-[#7cacf8] animate-spin" />
            <span>
              {lang === 'ar'
                ? 'جارٍ فحص المصادر وصياغة الإجابة الموثقة مع الاستشهادات...'
                : 'Searching sources and synthesizing grounded citations...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Prompts */}
      {messages.length > 0 && messages[messages.length - 1].suggestedQuestions && (
        <div className="px-4 py-2 border-t border-[#232529] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-[#121316]">
          <span className="text-[11px] text-slate-500 font-medium shrink-0">
            {lang === 'ar' ? 'اقتراحات:' : 'Suggestions:'}
          </span>
          {messages[messages.length - 1].suggestedQuestions?.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-[#1a1b20] hover:bg-[#262830] text-[11px] text-slate-300 hover:text-white border border-[#2d2f36] shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Grounded Input Bar */}
      <div className="p-3 sm:p-4 bg-[#111214] border-t border-[#2d2f31] shrink-0">
        <form
          onSubmit={handleFormSubmit}
          className="relative bg-[#18191d] border border-[#383a3d] focus-within:border-[#7cacf8] rounded-2xl p-2 sm:p-2.5 flex items-end gap-2 transition-colors shadow-lg"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedSources.length === 0
                ? lang === 'ar'
                  ? '⚠️ حدد مصدراً واحداً على الأقل من القائمة لبدء المحادثة...'
                  : 'Select at least one source to chat...'
                : lang === 'ar'
                ? 'اسأل أي سؤال حول مصادرك المحددة...'
                : 'Ask anything grounded in your selected sources...'
            }
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed py-1 px-1.5"
          />

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-[#282a2c]'
              }`}
              title={lang === 'ar' ? 'إدخال صوتي' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || selectedSources.length === 0}
              className="w-9 h-9 rounded-xl bg-[#1b6ef3] hover:bg-[#1a65db] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
