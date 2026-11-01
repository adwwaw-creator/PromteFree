import React, { useState } from 'react';
import { CRACKME_CHALLENGES } from '../data/challenges';
import { CrackmeChallenge } from '../types/reverseEngineering';
import { Shield, Key, Edit, HelpCircle, CheckCircle, AlertTriangle, ArrowRight, Trophy } from 'lucide-react';

interface ChallengesViewProps {
  englishMode: boolean;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ englishMode }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<CrackmeChallenge>(CRACKME_CHALLENGES[0]);
  const [userKeyInput, setUserKeyInput] = useState<string>('');
  const [isPatched, setIsPatched] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [solveState, setSolveState] = useState<'idle' | 'success' | 'failure'>('idle');
  const [solvedChallenges, setSolvedChallenges] = useState<Record<string, boolean>>({});

  const handleSelectChallenge = (c: CrackmeChallenge) => {
    setSelectedChallenge(c);
    setUserKeyInput('');
    setIsPatched(false);
    setShowHint(false);
    setSolveState('idle');
  };

  const handleCheckSolution = () => {
    if (selectedChallenge.solutionType === 'input_key') {
      const input = userKeyInput.trim();
      const isValidKey = selectedChallenge.validKeys?.some(
        k => k.toLowerCase() === input.toLowerCase()
      );

      // Or if patched in challenge 1
      if (isValidKey || (selectedChallenge.id === 'challenge_01_pass_or_patch' && isPatched)) {
        setSolveState('success');
        setSolvedChallenges(prev => ({ ...prev, [selectedChallenge.id]: true }));
      } else {
        setSolveState('failure');
      }
    } else if (selectedChallenge.solutionType === 'patch_byte') {
      if (isPatched) {
        setSolveState('success');
        setSolvedChallenges(prev => ({ ...prev, [selectedChallenge.id]: true }));
      } else {
        setSolveState('failure');
      }
    }
  };

  const totalSolved = Object.values(solvedChallenges).filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Shield className="w-4 h-4" />
            <span>{englishMode ? 'CTF CRACKME LAB' : 'مختبر تحديات كسر الحماية'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {englishMode ? 'Hands-on Reverse Engineering Challenges' : 'تحديات عملية في فك التشفير وهندسة الـ Crackmes'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {englishMode
              ? 'Put theory into practice: crack passcodes, forge valid serials, and patch out anti-debugging evasion loops.'
              : 'طبّق مهاراتك عملياً: استخرج كلمات المرور، ابنِ معادلات السيريال، وتجاوز آليات كشف المنقح.'}
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 shrink-0 self-start md:self-auto">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div className="text-right">
            <span className="text-xs text-slate-400 block">{englishMode ? 'Challenges Solved' : 'التحديات المنجزة'}</span>
            <span className="text-base font-bold text-white font-mono">{totalSolved} / {CRACKME_CHALLENGES.length}</span>
          </div>
        </div>
      </div>

      {/* Challenge Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CRACKME_CHALLENGES.map((c) => {
          const isSelected = selectedChallenge.id === c.id;
          const isCompleted = !!solvedChallenges[c.id];
          return (
            <div
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`cursor-pointer rounded-xl border p-4 transition-all text-right ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.difficulty === 'سهل' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  c.difficulty === 'متوسط' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {c.difficulty}
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{englishMode ? 'Solved' : 'تم الحل'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mt-2 line-clamp-1">
                {englishMode ? c.titleEn : c.titleAr}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {englishMode ? c.objectiveEn : c.objectiveAr}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Challenge Interactive Workbench */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        
        {/* Challenge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {englishMode ? selectedChallenge.titleEn : selectedChallenge.titleAr}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
              {englishMode ? selectedChallenge.objectiveEn : selectedChallenge.objectiveAr}
            </p>
          </div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{showHint ? (englishMode ? 'Hide Hint' : 'إخفاء التلميح') : (englishMode ? 'Show Hint' : 'عرض التلميح')}</span>
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-900/60 text-amber-300 text-xs space-y-1">
            <span className="font-bold block">{englishMode ? 'Analyst Hint:' : 'تلميح المحلل العكسي:'}</span>
            <p>{englishMode ? selectedChallenge.hintEn : selectedChallenge.hintAr}</p>
          </div>
        )}

        {/* Split: Disassembly on left, C Snippet on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Target Routine Disassembly */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-400 block">
              {englishMode ? 'Target Routine Disassembly:' : 'تفكيك الدالة المستهدفة في لغة التجميع:'}
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {selectedChallenge.disassembly.map((inst, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>{inst.address}</span>
                    <span>{inst.bytesHex}</span>
                  </div>
                  <div className="flex gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">{inst.mnemonic}</span>
                    <span>{inst.operands}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans">
                    {englishMode ? inst.explanationEn : inst.explanationAr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decompiled C Logic */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2 flex flex-col">
            <span className="text-xs font-mono font-semibold text-slate-400 block">
              {englishMode ? 'Decompiler High-Level Pseudo-C:' : 'الشيفرة شبه المصدرية المسترجعة (Pseudo-C):'}
            </span>
            <pre className="p-3 bg-[#070b12] text-slate-300 text-xs font-mono rounded flex-1 overflow-x-auto whitespace-pre leading-relaxed">
              {selectedChallenge.decompiledSnippet}
            </pre>
          </div>

        </div>

        {/* Interactive Verification / Action Form */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400 font-semibold">
            {englishMode ? 'SOLVER STATION' : 'محطة إدخال الحل وتطبيق الباتش'}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* If key challenge */}
            {selectedChallenge.solutionType === 'input_key' && (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={userKeyInput}
                  onChange={(e) => setUserKeyInput(e.target.value)}
                  placeholder={
                    selectedChallenge.id === 'challenge_01_pass_or_patch'
                      ? (englishMode ? 'Enter extracted passcode (e.g. VORTEX-88)' : 'أدخل كلمة المرور المستخرجة (مثال: VORTEX-88)')
                      : (englishMode ? 'Enter valid serial (e.g. REV-zzz)' : 'أدخل مفتاح التفعيل (مثال: REV-zzz)')
                  }
                  className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            )}

            {/* Binary Patching Option if applicable */}
            {(selectedChallenge.patchableAddress || selectedChallenge.solutionType === 'patch_byte') && (
              <button
                onClick={() => setIsPatched(!isPatched)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isPatched
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>
                  {isPatched
                    ? (englishMode ? `Patched: 0x${selectedChallenge.patchedByteExpected} (NOP/JNE Active)` : `تم التعديل: 0x${selectedChallenge.patchedByteExpected} نشط`)
                    : (englishMode ? `Apply Patch (0x${selectedChallenge.patchedByteExpected})` : `تطبيق الباتش (0x${selectedChallenge.patchedByteExpected})`)}
                </span>
              </button>
            )}

            {/* Verify CTA */}
            <button
              onClick={handleCheckSolution}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-sm"
            >
              {englishMode ? 'Verify & Solve' : 'تحقق من الحل'}
            </button>
          </div>

          {/* Feedback Messages */}
          {solveState === 'success' && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/60 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{englishMode ? 'SUCCESS: Crackme Defeated!' : 'نجاح باهر: تم كسر الحماية بنجاح!'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {englishMode ? selectedChallenge.explanationAfterSolveEn : selectedChallenge.explanationAfterSolveAr}
              </p>
            </div>
          )}

          {solveState === 'failure' && (
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {englishMode
                  ? 'Access Denied / Verification Failed. Inspect the disassembly or check the analyst hint!'
                  : 'فشل التحقق: الإدخال غير صحيح أو أن الباتش لم يُفعّل. راجع كود التجميع أو اضغط على عرض التلميح!'}
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
