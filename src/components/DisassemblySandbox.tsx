import React, { useState, useEffect, useRef } from 'react';
import { CURATED_BINARIES } from '../data/curatedBinaries';
import { DecompiledProgram, CpuRegisters, StackItem, AsmInstruction } from '../types/reverseEngineering';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Cpu, Layers, GitBranch, Terminal, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface DisassemblySandboxProps {
  englishMode: boolean;
}

export const DisassemblySandbox: React.FC<DisassemblySandboxProps> = ({ englishMode }) => {
  const [selectedProgram, setSelectedProgram] = useState<DecompiledProgram>(CURATED_BINARIES[0]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1400); // ms per step
  const [activeTab, setActiveTab] = useState<'disasm' | 'cfg'>('disasm');
  const [breakpoints, setBreakpoints] = useState<Record<string, boolean>>({});
  
  const timerRef = useRef<number | null>(null);

  const currentStep = selectedProgram.executionSteps[stepIndex] || selectedProgram.executionSteps[0];
  const activeInstruction = selectedProgram.instructions[currentStep.instructionIndex] || selectedProgram.instructions[0];

  // Auto-step timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= selectedProgram.executionSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const nextStep = prev + 1;
          const targetInstr = selectedProgram.instructions[selectedProgram.executionSteps[nextStep].instructionIndex];
          if (targetInstr && breakpoints[targetInstr.address]) {
            setIsPlaying(false); // Hit breakpoint
          }
          return nextStep;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedProgram, breakpoints]);

  const handleProgramChange = (programId: string) => {
    const found = CURATED_BINARIES.find((p) => p.id === programId);
    if (found) {
      setIsPlaying(false);
      setSelectedProgram(found);
      setStepIndex(0);
      setBreakpoints({});
    }
  };

  const handleStepForward = () => {
    if (stepIndex < selectedProgram.executionSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const toggleBreakpoint = (addr: string) => {
    setBreakpoints((prev) => ({
      ...prev,
      [addr]: !prev[addr],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Controller Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Program Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {englishMode ? 'Select Binary Target:' : 'اختر البرنامج المستهدف:'}
          </label>
          <select
            value={selectedProgram.id}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            {CURATED_BINARIES.map((p) => (
              <option key={p.id} value={p.id}>
                {englishMode ? p.titleEn : p.titleAr} [{p.difficulty}]
              </option>
            ))}
          </select>
        </div>

        {/* Execution Step Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={englishMode ? 'Reset Simulation' : 'إعادة ضبط'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepBack}
            disabled={stepIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title={englishMode ? 'Step Back' : 'خطوة للخلف'}
          >
            <SkipBack className="w-4 h-4 rtl:rotate-180" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{englishMode ? 'Pause' : 'إيقاف مؤقت'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{englishMode ? 'Auto Run' : 'تشغيل تلقائي'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            disabled={stepIndex >= selectedProgram.executionSteps.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
            title={englishMode ? 'Step Forward (F8)' : 'خطوة للأمام (F8)'}
          >
            <SkipForward className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1.5 mr-2 pl-2 border-r rtl:border-l rtl:border-r-0 border-slate-700 text-xs text-slate-400">
            <span>{englishMode ? 'Speed:' : 'السرعة:'}</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1"
            >
              <option value={2000}>{englishMode ? 'Slow (2s)' : 'بطيء (2ث)'}</option>
              <option value={1200}>{englishMode ? 'Normal (1.2s)' : 'عادي (1.2ث)'}</option>
              <option value={600}>{englishMode ? 'Fast (0.6s)' : 'سريع (0.6ث)'}</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('disasm')}
              className={`px-2.5 py-1 rounded ${activeTab === 'disasm' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'}`}
            >
              {englishMode ? 'Assembly View' : 'عرض التفكيك'}
            </button>
            <button
              onClick={() => setActiveTab('cfg')}
              className={`px-2.5 py-1 rounded ${activeTab === 'cfg' ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-400'}`}
            >
              {englishMode ? 'CFG Graph' : 'مخطط التدفق CFG'}
            </button>
          </div>

        </div>
      </div>

      {/* Program Summary Info */}
      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
        <span className="font-semibold text-slate-300">{englishMode ? selectedProgram.titleEn : selectedProgram.titleAr}</span>
        <span aria-hidden="true">·</span>
        <span>{englishMode ? 'Category: ' + selectedProgram.category : 'التصنيف: ' + selectedProgram.category}</span>
        <span aria-hidden="true">·</span>
        <span>{englishMode ? 'Step ' + (stepIndex + 1) + ' of ' + selectedProgram.executionSteps.length : 'الخطوة ' + (stepIndex + 1) + ' من ' + selectedProgram.executionSteps.length}</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-400">{englishMode ? currentStep.explanationEn : currentStep.explanationAr}</span>
      </div>

      {/* Main Multi-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Reconstructed C Source (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{englishMode ? 'Reconstructed C Source' : 'الشيفرة المصدرية (C)'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Decompiled Pseudo-Code</span>
          </div>

          <div className="p-3 text-xs font-mono overflow-x-auto bg-[#070b12] text-slate-300 leading-relaxed max-h-[520px]">
            {selectedProgram.cCode.split('\n').map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = currentStep.highlightCLine === lineNum;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 px-2 py-0.5 rounded transition-colors ${
                    isHighlighted ? 'bg-emerald-500/20 text-emerald-300 font-semibold border-r-2 rtl:border-r-0 rtl:border-l-2 border-emerald-400' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <span className="w-6 text-slate-600 select-none text-right tabular-nums">{lineNum}</span>
                  <pre className="m-0 font-mono whitespace-pre">{line}</pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Assembly Disassembly (5 cols) OR CFG */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{englishMode ? 'Disassembly (x86-64)' : 'لغة التجميع والتفكيك (x86-64)'}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              RIP: {currentStep.registers.rip.toString(16).padStart(8, '0').toUpperCase()}
            </span>
          </div>

          {activeTab === 'disasm' ? (
            <div className="p-3 text-xs font-mono overflow-y-auto bg-[#070b12] max-h-[520px] space-y-1">
              {selectedProgram.instructions.map((instr, idx) => {
                const isActive = idx === currentStep.instructionIndex;
                const hasBp = !!breakpoints[instr.address];
                return (
                  <div
                    key={instr.address}
                    onClick={() => toggleBreakpoint(instr.address)}
                    className={`group cursor-pointer flex flex-col p-2 rounded border transition-all ${
                      isActive
                        ? 'bg-emerald-950/60 border-emerald-500/60 shadow-md text-emerald-200'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Breakpoint indicator */}
                        <span
                          className={`w-2.5 h-2.5 rounded-full border shrink-0 transition-colors ${
                            hasBp ? 'bg-rose-500 border-rose-400' : 'bg-transparent border-slate-700 group-hover:border-slate-500'
                          }`}
                          title="Click to toggle breakpoint"
                        />
                        <span className="text-slate-500 select-none tabular-nums">{instr.address}</span>
                      </div>
                      <span className="text-slate-600 text-[10px] tabular-nums font-mono">{instr.bytesHex}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`font-bold ${isActive ? 'text-emerald-400' : 'text-indigo-300'}`}>
                        {instr.mnemonic}
                      </span>
                      <span className="text-slate-200">{instr.operands}</span>
                      {isActive && (
                        <span className="text-[10px] font-sans px-1.5 py-0.2 bg-emerald-400 text-slate-950 font-bold rounded mr-auto rtl:mr-0 rtl:ml-auto">
                          {englishMode ? 'CURRENT RIP' : 'المؤشر الحالي'}
                        </span>
                      )}
                    </div>

                    {/* Arabic explanation */}
                    <p className="text-[11px] font-sans text-slate-400 mt-1 line-clamp-2">
                      {englishMode ? instr.explanationEn : instr.explanationAr}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* CFG View */
            <div className="p-4 bg-[#070b12] max-h-[520px] overflow-y-auto space-y-4">
              <div className="text-xs text-slate-400">
                {englishMode ? 'Control Flow Graph (Basic Blocks & Conditional Edges):' : 'مخطط التحكم بالتدفق (الكتل الأساسية والتفرعات):'}
              </div>
              <div className="space-y-3">
                {selectedProgram.cfgNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg border text-xs font-mono space-y-2 ${
                      node.blockType === 'condition'
                        ? 'bg-amber-950/20 border-amber-800/60'
                        : node.blockType === 'exit'
                        ? 'bg-slate-900 border-slate-700'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                      <span className="font-bold text-white">{node.title}</span>
                      <span className="text-slate-500 font-mono">[{node.blockType}]</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300">
                      {node.instructions.map((i, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-indigo-400 font-semibold">{i.mnemonic}</span>
                          <span className="text-slate-400">{i.operands}</span>
                        </div>
                      ))}
                    </div>

                    {node.trueBranch && (
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px]">
                        <span className="text-emerald-400">
                          {node.falseBranch ? 'True (Branch Taken):' : 'Next Block:'}
                        </span>
                        <span className="text-slate-300 font-mono">→ {node.trueBranch}</span>
                        {node.falseBranch && (
                          <>
                            <span className="text-rose-400 ml-2">False (Fallthrough):</span>
                            <span className="text-slate-300 font-mono">→ {node.falseBranch}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Registers & Memory Stack (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Registers Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {englishMode ? 'CPU Registers (x64)' : 'سجلات المعالج (x64)'}
              </span>
              <span className="text-[11px] font-mono text-emerald-400">64-bit Core</span>
            </div>

            <div className="p-3 bg-[#070b12] space-y-1.5 text-xs font-mono">
              {[
                { name: 'RAX', val: currentStep.registers.rax, desc: 'Accumulator / Return val' },
                { name: 'RBX', val: currentStep.registers.rbx, desc: 'Base register' },
                { name: 'RCX', val: currentStep.registers.rcx, desc: 'Counter / 4th arg' },
                { name: 'RDX', val: currentStep.registers.rdx, desc: 'Data / 3rd arg' },
                { name: 'RSI', val: currentStep.registers.rsi, desc: 'Source index / 2nd arg' },
                { name: 'RDI', val: currentStep.registers.rdi, desc: 'Dest index / 1st arg' },
                { name: 'RBP', val: currentStep.registers.rbp, desc: 'Base frame pointer' },
                { name: 'RSP', val: currentStep.registers.rsp, desc: 'Stack pointer' },
                { name: 'RIP', val: currentStep.registers.rip, desc: 'Instruction pointer' },
              ].map((reg) => (
                <div key={reg.name} className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-900/60">
                  <span className="text-slate-400 font-semibold">{reg.name}</span>
                  <span className="text-slate-200 tabular-nums">
                    0x{reg.val.toString(16).padStart(8, '0').toUpperCase()}
                  </span>
                </div>
              ))}

              {/* Status Flags */}
              <div className="pt-2 mt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1.5 font-sans font-medium">
                  {englishMode ? 'Status Flags (EFLAGS):' : 'رايات الحالة (EFLAGS):'}
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className={`py-1 rounded text-[10px] font-bold ${currentStep.registers.flags.zf ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-950 text-slate-500'}`}>
                    ZF={currentStep.registers.flags.zf ? '1' : '0'}
                  </div>
                  <div className={`py-1 rounded text-[10px] font-bold ${currentStep.registers.flags.cf ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-950 text-slate-500'}`}>
                    CF={currentStep.registers.flags.cf ? '1' : '0'}
                  </div>
                  <div className={`py-1 rounded text-[10px] font-bold ${currentStep.registers.flags.sf ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-950 text-slate-500'}`}>
                    SF={currentStep.registers.flags.sf ? '1' : '0'}
                  </div>
                  <div className={`py-1 rounded text-[10px] font-bold ${currentStep.registers.flags.of ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-950 text-slate-500'}`}>
                    OF={currentStep.registers.flags.of ? '1' : '0'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Stack Frame Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {englishMode ? 'Call Stack Memory' : 'مكدس الذاكرة (Call Stack)'}
              </span>
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            <div className="p-3 bg-[#070b12] space-y-1.5 text-xs font-mono max-h-[220px] overflow-y-auto">
              {currentStep.stack.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded border text-[11px] ${
                    item.isRsp
                      ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] text-slate-500">{item.address}</span>
                    <span className="font-semibold text-white">{item.valueHex}</span>
                  </div>
                  {item.label && (
                    <div className="text-[10px] text-emerald-400 font-sans mt-0.5">
                      {item.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Program Output Terminal / Callout if output produced */}
      {currentStep.output && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-mono text-emerald-300">
            <span className="text-slate-500 mr-2 rtl:mr-0 rtl:ml-2">[Program Console Output]:</span>
            <span>{currentStep.output}</span>
          </div>
        </div>
      )}

    </div>
  );
};
