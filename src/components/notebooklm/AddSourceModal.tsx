import React, { useState } from 'react';
import { X, FileText, Upload, Globe, Sparkles, Check, Plus, AlertCircle } from 'lucide-react';
import { SourceItem } from '../../types/notebooklm';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: Omit<SourceItem, 'id' | 'addedAt'>) => void;
  lang?: 'ar' | 'en' | 'fr';
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
  lang = 'ar',
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url' | 'samples'>('text');

  // Text Tab State
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  // URL Tab State
  const [urlTitle, setUrlTitle] = useState('');
  const [urlAddress, setUrlAddress] = useState('');
  const [urlSummary, setUrlSummary] = useState('');

  // File Tab State
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content || '');
    };
    reader.readAsText(file);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;

    const title = textTitle.trim() || textContent.slice(0, 36) + '...';
    const words = textContent.trim().split(/\s+/).length;

    onAddSource({
      title,
      type: 'text',
      content: textContent.trim(),
      summary: textContent.slice(0, 160) + '...',
      keyTopics: extractSimpleTopics(textContent),
      charCount: textContent.length,
      wordCount: words,
      isSelected: true,
    });

    setTextTitle('');
    setTextContent('');
    onClose();
  };

  const handleSubmitFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContent.trim()) return;

    const title = fileName || 'مستند مرفوع';
    const words = fileContent.trim().split(/\s+/).length;

    onAddSource({
      title,
      type: 'file',
      fileName,
      content: fileContent.trim(),
      summary: fileContent.slice(0, 160) + '...',
      keyTopics: extractSimpleTopics(fileContent),
      charCount: fileContent.length,
      wordCount: words,
      isSelected: true,
    });

    setFileName('');
    setFileContent('');
    onClose();
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlAddress.trim()) return;

    const title = urlTitle.trim() || `مقال من: ${new URL(urlAddress).hostname}`;
    const generatedContent = `مقال مستخرج من الرابط (${urlAddress}):\n\n${urlSummary.trim() || 'يحتوي هذا الرابط على معلومات بحثية موثقة تم ربطها في مساحة عمل NotebookLM.'}`;
    const words = generatedContent.split(/\s+/).length;

    onAddSource({
      title,
      type: 'url',
      url: urlAddress,
      content: generatedContent,
      summary: urlSummary.trim() || `محتوى مستخلص من ${urlAddress}`,
      keyTopics: ['رابط ويب', 'تحليل المقال'],
      charCount: generatedContent.length,
      wordCount: words,
      isSelected: true,
    });

    setUrlTitle('');
    setUrlAddress('');
    setUrlSummary('');
    onClose();
  };

  // Sample quick packs
  const samplePacks = [
    {
      title: 'أخلاقيات الذكاء الاصطناعي والحوكمة المؤسسية 2026',
      topics: ['الشفافية', 'الحوكمة', 'الحد من التحيز', 'الأمان السيبراني'],
      content: `أخلاقيات الذكاء الاصطناعي والحوكمة المؤسسية 2026

تفرض لوائح الذكاء الاصطناعي العالمية لعام 2026 أربعة معايير حاسمة للشركات والمؤسسات:
1. الشفافية وقابلية التفسير (Explainability): يجب أن يكون كل قرار صادر عن نموذج الذكاء الاصطناعي قابلاً للتدقيق والتفسير البشري.
2. حماية البيانات والخصوصية: منع تدريب النماذج العامة على بيانات المستخدمين الخاصة دون موافقة صريحة.
3. التقييد المصدري (Source Grounding): إلزام النماذج بذكر الاقتباسات الدقيقة لكل حقيقة في المجالات الطبية والقانونية.
4. التدخل البشري الحاسم (Human-in-the-Loop): عدم تفويض الوكلاء المستقلين باتخاذ قرارات مالية أو تعاقدية حاسمة دون تأكيد بشري معتمد.`,
    },
    {
      title: 'استراتيجيات التحول إلى الطاقة المتجددة والهيدروجين الأخضر',
      topics: ['الهيدروجين الأخضر', 'كفاءة الطاقة', 'الطاقة الشمسية', 'تخفيض الانبعاثات'],
      content: `استراتيجيات التحول إلى الطاقة المتجددة والهيدروجين الأخضر

تستهدف الخطط الوطنية بحلول عام 2030 خفض الانبعاثات الكربونية بنسبة 45% عبر المسارات التالية:
• التوسع في مزارع الطاقة الشمسية الكهروضوئية وطاقة الرياح البحرية.
• إنتاج الهيدروجين الأخضر باستخدام المحللات الكهربائية المعتمدة على الطاقة المتجددة.
• تخزين الطاقة عبر بطاريات الحالة الصلبة والمضخات الكهرومائية لتأمين استقرار الشبكة.
• تشجيع الاستثمار الصناعي في سلاسل التوريد المحلية لتقليل البصمة الكربونية للنقل.`,
    },
  ];

  const handleSelectSample = (sample: typeof samplePacks[0]) => {
    const words = sample.content.split(/\s+/).length;
    onAddSource({
      title: sample.title,
      type: 'text',
      content: sample.content,
      summary: sample.content.slice(0, 150) + '...',
      keyTopics: sample.topics,
      charCount: sample.content.length,
      wordCount: words,
      isSelected: true,
    });
    onClose();
  };

  function extractSimpleTopics(text: string): string[] {
    const lines = text.split('\n').filter((l) => l.trim().length > 3);
    const topics: string[] = [];
    for (const line of lines) {
      if (line.startsWith('#') || line.includes(':') || line.startsWith('•') || line.startsWith('-')) {
        const clean = line.replace(/[#•:\-]/g, '').trim();
        if (clean.length > 3 && clean.length < 35 && !topics.includes(clean)) {
          topics.push(clean);
        }
      }
    }
    return topics.slice(0, 4);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#1e1f20] border border-[#3c4043] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in zoom-in-95 duration-150"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d2f31] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">
                {lang === 'ar' ? 'إضافة مصدر جديد إلى NotebookLM' : 'Add Source to NotebookLM'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'ستعتمد إجابات الذكاء الاصطناعي والنظرة الصوتية على هذه المصادر'
                  : 'AI answers and Audio Overview will be grounded strictly in these sources'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#282a2c] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#131314] border-b border-[#2d2f31] shrink-0 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'text'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#282a2c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'نص مباشر' : 'Paste Text'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'file'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#282a2c]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'رفع ملف' : 'Upload File'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'url'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#282a2c]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'رابط ويب' : 'Web URL'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'samples'
                ? 'bg-[#1b6ef3] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#282a2c]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'نماذج جاهزة' : 'Sample Packs'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'text' && (
            <form onSubmit={handleSubmitText} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'عنوان المصدر (اختياري):' : 'Source Title (Optional):'}
                </label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: تقرير المشروع أو ملخص الاجتماع...' : 'e.g. Project Specs...'}
                  className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'الصق نص المصدر أو الملاحظات:' : 'Paste Source Text or Notes:'}
                </label>
                <textarea
                  required
                  rows={7}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'الصق هنا أي نص أو مقال أو وثيقة بحثية كاملة...'
                      : 'Paste any article, documentation, or research text here...'
                  }
                  className="w-full bg-[#131314] border border-[#3c4043] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!textContent.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1b6ef3] hover:bg-[#1a65db] text-white disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة المصدر' : 'Add Source'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'file' && (
            <form onSubmit={handleSubmitFile} className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-[#3c4043] hover:border-[#7cacf8] rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors bg-[#131314]/50">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-white mb-1">
                  {lang === 'ar' ? 'اختر ملفاً من جهازك (TXT, MD, JSON, PDF)' : 'Upload a document (TXT, MD, JSON, PDF)'}
                </span>
                <span className="text-[11px] text-slate-400 mb-3">
                  {lang === 'ar' ? 'يدعم الملفات النصية المباشرة والمستندات' : 'Plain text, notes, and documentation files'}
                </span>
                <label className="px-4 py-2 rounded-xl bg-[#282a2c] hover:bg-[#333538] text-xs font-semibold text-[#c2e7ff] cursor-pointer transition-colors border border-[#3c4043]">
                  <span>{lang === 'ar' ? 'تصفح الملفات' : 'Browse Files'}</span>
                  <input
                    type="file"
                    accept=".txt,.md,.json,.csv,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {fileName && (
                <div className="p-3 rounded-xl bg-[#131314] border border-[#2d2f31] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span className="font-medium text-white truncate max-w-[260px]">{fileName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{fileContent.length} حرف</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!fileContent.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1b6ef3] hover:bg-[#1a65db] text-white disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تضمين الملف' : 'Add File'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'url' && (
            <form onSubmit={handleSubmitUrl} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'رابط المقال أو الموقع (URL):' : 'Web URL:'}
                </label>
                <input
                  type="url"
                  required
                  value={urlAddress}
                  onChange={(e) => setUrlAddress(e.target.value)}
                  placeholder="https://example.com/article..."
                  className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'عنوان المصدر:' : 'Source Title:'}
                </label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: دراسة تحول الطاقة العالمية...' : 'e.g. Energy Transition Study...'}
                  className="w-full bg-[#131314] border border-[#3c4043] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'ar' ? 'موجز أو مقتطف من الرابط (اختياري):' : 'Summary or Excerpt (Optional):'}
                </label>
                <textarea
                  rows={4}
                  value={urlSummary}
                  onChange={(e) => setUrlSummary(e.target.value)}
                  placeholder={lang === 'ar' ? 'أضف أي تفاصيل أو مقتطفات من المقال...' : 'Optional key quotes or summary...'}
                  className="w-full bg-[#131314] border border-[#3c4043] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7cacf8] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!urlAddress.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1b6ef3] hover:bg-[#1a65db] text-white disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة الرابط' : 'Add URL'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'samples' && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-slate-400 mb-1 block">
                {lang === 'ar'
                  ? 'اختر حزمة وثائق جاهزة للاختبار الفوري لـ NotebookLM بنقرة واحدة:'
                  : 'Select a pre-built sample knowledge pack to test NotebookLM instantly:'}
              </span>

              {samplePacks.map((pack, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#131314] border border-[#2d2f31] hover:border-[#7cacf8]/40 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white">{pack.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleSelectSample(pack)}
                      className="px-3 py-1 rounded-lg bg-[#1b6ef3] hover:bg-[#1a65db] text-white text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'إضافة' : 'Add'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {pack.content}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {pack.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-[#252729] text-[10px] text-slate-300 border border-[#383a3c]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
