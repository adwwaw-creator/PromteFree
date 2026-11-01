import React, { useState } from 'react';
import { HISTORY_MILESTONES, CORE_PRINCIPLES } from '../data/historyTimeline';
import { HistoryMilestone } from '../types/reverseEngineering';
import { ShieldCheck, BookOpen, Clock, Binary, ArrowRight, X, ExternalLink, Cpu, Layers } from 'lucide-react';

interface OriginsViewProps {
  englishMode: boolean;
  onNavigateToSandbox: () => void;
}

export const OriginsView: React.FC<OriginsViewProps> = ({
  englishMode,
  onNavigateToSandbox,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<HistoryMilestone | null>(HISTORY_MILESTONES[2]); // Default Phoenix BIOS
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredMilestones = activeCategory === 'all'
    ? HISTORY_MILESTONES
    : HISTORY_MILESTONES.filter(m => m.category === activeCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12">
      
      {/* Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="text-xs font-mono text-emerald-400 tracking-wider">
            {englishMode ? 'FOUNDATIONS & HISTORICAL ATLAS' : 'أطلس وتاريخ الهندسة العكسية'}
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white" style={{ textWrap: 'balance' }}>
            {englishMode 
              ? 'The Origin and Evolution of Reverse Engineering' 
              : 'أصل الهندسة العكسية: من صواميل الحرب إلى فك شفرات البرمجيات الخبيثة'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {englishMode
              ? 'From the physical teardown of radar circuits and captured B-29 bombers to the legal clean-room synthesis of the IBM PC BIOS and modern malware triage, reverse engineering represents humanity\'s ultimate scientific discipline of understanding complex closed systems without prior blueprints.'
              : 'من التفكيك الميكانيكي لرادارات الحرب العالمية وقاذفات B-29، إلى ابتكار "الغرفة النظيفة" لاستنساخ نظام BIOS الخاص بشركة IBM وإقرار مشروعية التفكيك في المحاكم، وصولاً إلى تشريح أسلحة السايبر مثل Stuxnet وWannaCry. الهندسة العكسية هي الفن العلمي لإعادة بناء المعرفة من المنتج النهائي دون امتلاك المخططات الأصلية.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToSandbox}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-sm rounded-lg transition-colors shadow-sm"
            >
              <span>{englishMode ? 'Open Disassembly Sandbox' : 'بدء تجربة التفكيك في المختبر'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{englishMode ? '7 Epochs Documented' : '7 محطات تاريخية موثقة'}</span>
              <span aria-hidden="true">·</span>
              <span>{englishMode ? 'Clean-Room Protocol' : 'بروتوكول الغرفة النظيفة'}</span>
              <span aria-hidden="true">·</span>
              <span>{englishMode ? 'Ethical Framework' : 'الإطار القانوني والأخلاقي'}</span>
            </div>
          </div>
        </div>

        {/* Ambient background grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </section>

      {/* Clean Room Architecture Showcase (Fundamental Origin Concept) */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {englishMode ? 'The Clean Room Protocol (1982)' : 'بروتوكول الغرفة النظيفة: كيف تأسست الهندسة العكسية القانونية؟'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {englishMode 
                ? 'The architectural breakthrough that legitimized reverse engineering in software and created the modern PC ecosystem.' 
                : 'الابتكار القانوني والتقني الذي سمح باستنساخ برمجيات IBM المحتكرة دون انتهاك حقوق الملكية الفكرية.'}
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {englishMode ? 'Two-Team Isolation Model' : 'نموذج عزل الفريقين'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          
          {/* Team 1: Dirty Room */}
          <div className="bg-slate-950/80 border border-rose-900/40 rounded-lg p-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-rose-400">
                {englishMode ? '01. DIRTY ROOM' : '01. الغرفة القذرة (Dirty Room)'}
              </span>
              <Binary className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {englishMode ? 'Decompilers & Analysts' : 'المحللون ومفككو الشفرة'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed flex-1">
              {englishMode
                ? 'Engineers disassemble the original target binary. They are forbidden from writing any functional code. Instead, they draft an abstract specification document in English describing purely WHAT the system does, not HOW it is coded.'
                : 'يقوم مهندسون بتفكيك الملف الثنائي المحمي من IBM وقراءة لغة التجميع. يُحظر عليهم كتابة أي كود تنفيذي نهائي! دورهم الوحيد هو صياغة وثيقة مواصفات تجريدية باللغة الإنجليزية تشرح ماذا تفعل كل دالة بالتفصيل دون نقل سطر كود واحد.'}
            </p>
            <div className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              {englishMode ? 'Output: Functional Spec Document' : 'المخرج: وثيقة المواصفات الوظيفية'}
            </div>
          </div>

          {/* Central Firewall */}
          <div className="bg-slate-950/80 border border-amber-900/40 rounded-lg p-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-amber-400">
                {englishMode ? '02. THE LEGAL FIREWALL' : '02. الجدار الناري القانوني'}
              </span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {englishMode ? 'Legal & Architectural Audit' : 'التدقيق القانوني والمراجعة'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed flex-1">
              {englishMode
                ? 'Legal counsel reviews the specification document to ensure no proprietary copyrighted code phrases, internal algorithms, or patents are passed across the boundary. Only external functional interfaces are preserved.'
                : 'يقوم محامون ومراجعون تقنيون بفحص وثيقة المواصفات للتأكد من خلوها تماماً من أي تعبيرات حرفية أو شيفرات سرية أو أسرار تجارية منتهكة، وضمان أنها تصف فقط السلوك التفاعلي الضروري للتشغيل البيني (Interoperability).'}
            </p>
            <div className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              {englishMode ? 'Result: Certified Pure Interface' : 'المخرج: واجهة مواصفات معتمدة'}
            </div>
          </div>

          {/* Team 2: Clean Room */}
          <div className="bg-slate-950/80 border border-emerald-900/40 rounded-lg p-5 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-emerald-400">
                {englishMode ? '03. CLEAN ROOM' : '03. الغرفة النظيفة (Clean Room)'}
              </span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {englishMode ? 'Uncontaminated Programmers' : 'المبرمجون النظيفون'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed flex-1">
              {englishMode
                ? 'Engineers who have NEVER seen the original IBM binary or disassembly. They write a 100% brand-new, original implementation strictly from the verified specification. If taken to court, clean-room logs prove independent creation.'
                : 'مهندسون لم يروا كود IBM الأصلي أو تفكيكه في حياتهم إطلاقاً. يأخذون وثيقة المواصفات المعتمدة ويكتبون شيفرة تجميع جديدة 100%. أمام المحاكم، تثبت سجلاتهم أن الكود كُتب باستقلالية تامة مما يسقط تهمة النسخ.'}
            </p>
            <div className="text-xs font-mono text-slate-500 pt-2 border-t border-slate-800/80">
              {englishMode ? 'Outcome: Legal Phoenix BIOS Clone' : 'النتيجة: BIOS قانوني 100%'}
            </div>
          </div>

        </div>
      </section>

      {/* Historical Milestones Timeline */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {englishMode ? 'Historical Milestones (1944 — Present)' : 'محطات تاريخية فارقة في تاريخ الهندسة العكسية'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {englishMode
                ? 'From wartime intelligence and industrial cloning to cyber warfare attribution.'
                : 'سجل زمني يوثق أبرز القضايا والتحولات التي شكلت العالم الرقمي.'}
            </p>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'all' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {englishMode ? 'All' : 'الكل'}
            </button>
            <button
              onClick={() => setActiveCategory('عسكري')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'عسكري' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {englishMode ? 'Military' : 'عسكري'}
            </button>
            <button
              onClick={() => setActiveCategory('صناعي')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'صناعي' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {englishMode ? 'Industrial' : 'صناعي'}
            </button>
            <button
              onClick={() => setActiveCategory('ألعاب وبرمجيات')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'ألعاب وبرمجيات' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {englishMode ? 'Gaming' : 'ألعاب وفيدرالي'}
            </button>
            <button
              onClick={() => setActiveCategory('أمن سيبراني')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeCategory === 'أمن سيبراني' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {englishMode ? 'Cybersecurity' : 'أمن سيبراني'}
            </button>
          </div>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMilestones.map((m) => {
            const isSelected = selectedMilestone?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className={`cursor-pointer rounded-xl border p-5 transition-all text-right ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                  <span className="font-mono text-emerald-400 font-bold">{m.year}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{m.period}</span>
                    <span aria-hidden="true">·</span>
                    <span>{m.category}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-3 line-clamp-1">
                  {englishMode ? m.titleEn : m.titleAr}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {englishMode ? m.summaryEn : m.summaryAr}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span>{englishMode ? 'Click to inspect case' : 'انقر لعرض تفاصيل القضية'}</span>
                  <span className="font-mono text-emerald-400">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Milestone Dossier Modal / Drawer */}
      {selectedMilestone && (
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>{selectedMilestone.year}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedMilestone.period}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedMilestone.category}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {englishMode ? selectedMilestone.titleEn : selectedMilestone.titleAr}
              </h3>
            </div>
            <button
              onClick={() => setSelectedMilestone(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md bg-slate-800/50"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
            {englishMode ? selectedMilestone.fullStoryEn : selectedMilestone.fullStoryAr}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-slate-400">
                {englishMode ? 'Key Technical Technique' : 'التقنية الهندسية المستخدمة'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-300">
                {englishMode ? selectedMilestone.keyTechniqueEn : selectedMilestone.keyTechniqueAr}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-mono text-slate-400">
                {englishMode ? 'Legal / Cybersecurity Significance' : 'الأثر القانوني والسيبراني'}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-amber-300">
                {englishMode ? selectedMilestone.legalLessonEn : selectedMilestone.legalLessonAr}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Core Principles & Ethics */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {englishMode ? 'The Four Pillars of Reverse Engineering' : 'الأركان الأربعة للهندسة العكسية المعاصرة'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {englishMode
              ? 'Fundamental concepts every software analyst, vulnerability researcher, and security engineer must master.'
              : 'المفاهيم الجوهرية والضوابط الأخلاقية التي تحكم عمل محلل البرمجيات ومكتشف الثغرات.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CORE_PRINCIPLES.map((pillar, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-xs font-mono text-emerald-400 font-semibold">
                {`0${idx + 1}. `}{englishMode ? pillar.titleEn : pillar.titleAr}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {englishMode ? pillar.contentEn : pillar.contentAr}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
