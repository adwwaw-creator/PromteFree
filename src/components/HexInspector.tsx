import React, { useState } from 'react';
import { SAMPLE_PE_SECTIONS, GENERATE_INITIAL_HEX_STREAM } from '../data/hexAndFormats';
import { HexByte, BinarySection } from '../types/reverseEngineering';
import { Binary, Eye, FileCode, Edit3, Shield, CheckCircle, RefreshCw } from 'lucide-react';

interface HexInspectorProps {
  englishMode: boolean;
}

export const HexInspector: React.FC<HexInspectorProps> = ({ englishMode }) => {
  const [hexBytes, setHexBytes] = useState<HexByte[]>(GENERATE_INITIAL_HEX_STREAM);
  const [selectedOffset, setSelectedOffset] = useState<number>(0x5A); // Default selected on the critical JE opcode
  const [patchInput, setPatchInput] = useState<string>('75');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const selectedByte = hexBytes[selectedOffset] || hexBytes[0];

  // Group bytes into 16-byte rows
  const rows: HexByte[][] = [];
  for (let i = 0; i < hexBytes.length; i += 16) {
    rows.push(hexBytes.slice(i, i + 16));
  }

  const handleApplyPatch = () => {
    const cleanHex = patchInput.trim().toUpperCase().slice(0, 2);
    const parsed = parseInt(cleanHex, 16);
    if (isNaN(parsed) || parsed < 0 || parsed > 255) {
      setFeedbackMsg(englishMode ? 'Invalid Hex value (enter 00-FF)' : 'قيمة هيكس غير صالحة (أدخل بين 00 و FF)');
      return;
    }

    setHexBytes((prev) =>
      prev.map((b) =>
        b.offset === selectedOffset
          ? {
              ...b,
              byte: parsed,
              hex: cleanHex.padStart(2, '0'),
              ascii: parsed >= 32 && parsed <= 126 ? String.fromCharCode(parsed) : '.',
              isPatched: true,
            }
          : b
      )
    );

    setFeedbackMsg(
      englishMode
        ? `Successfully patched offset 0x${selectedOffset.toString(16).toUpperCase()} to 0x${cleanHex}!`
        : `تم تعديل البايت عند الإزاحة 0x${selectedOffset.toString(16).toUpperCase()} إلى 0x${cleanHex} بنجاح!`
    );

    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleResetHex = () => {
    setHexBytes(GENERATE_INITIAL_HEX_STREAM());
    setFeedbackMsg(englishMode ? 'Hex stream restored to original binary.' : 'تمت استعادة الملف الثنائي لحالته الأصلية.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      
      {/* Introduction Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white">
          {englishMode ? 'Binary Anatomy & Interactive Hex Editor' : 'تشريح الملفات الثنائية ومحرر الهيكس التفاعلي'}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
          {englishMode
            ? 'Inspect executable machine bytes directly at disk and memory offsets. Explore Portable Executable (PE) headers, calculate section entropy, and apply live binary patches.'
            : 'استكشف البايتات الآلية للملف التنفيذي كما تخزن في القرص والذاكرة. افحص ترويسات PE وأقسام .text و .rdata، واكتشف كيفية ترقيع وتعديل البايتات (Binary Patching) لكسر الحماية أو إصلاح الثغرات.'}
        </p>
      </div>

      {/* Main Grid: Hex Dump (Left 8 cols) & Byte Inspector / Patcher (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Hex Dump Panel */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Binary className="w-4 h-4 text-emerald-400" />
              <span>{englishMode ? 'Executable Hex View (Offset / Hex / ASCII)' : 'عرض الهيكس (الإزاحة / البايتات / ASCII)'}</span>
            </div>
            <button
              onClick={handleResetHex}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
              title="Reset Hex Stream"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{englishMode ? 'Restore' : 'استعادة'}</span>
            </button>
          </div>

          {/* Hex Table */}
          <div className="p-4 bg-[#070b12] text-xs font-mono overflow-x-auto select-none max-h-[500px]">
            {/* Column Headers */}
            <div className="flex items-center gap-4 text-slate-500 pb-2 border-b border-slate-800 text-[11px]">
              <span className="w-16">Offset</span>
              <div className="flex gap-1.5 flex-1 justify-between max-w-[360px]">
                {['00','01','02','03','04','05','06','07','08','09','0A','0B','0C','0D','0E','0F'].map(h => (
                  <span key={h} className="w-5 text-center">{h}</span>
                ))}
              </div>
              <span className="w-32 pl-2">ASCII Decoded</span>
            </div>

            {/* Rows */}
            <div className="space-y-1 pt-2">
              {rows.map((rowBytes, rowIdx) => {
                const rowOffset = rowIdx * 16;
                const offsetHex = '0x' + rowOffset.toString(16).padStart(4, '0').toUpperCase();
                return (
                  <div key={rowOffset} className="flex items-center gap-4 hover:bg-slate-900/40 px-1 py-0.5 rounded">
                    {/* Offset */}
                    <span className="w-16 text-slate-600 tabular-nums">{offsetHex}</span>

                    {/* 16 Hex Bytes */}
                    <div className="flex gap-1.5 flex-1 justify-between max-w-[360px]">
                      {rowBytes.map((b) => {
                        const isSelected = b.offset === selectedOffset;
                        const isPatch = b.isPatched;
                        return (
                          <button
                            key={b.offset}
                            onClick={() => {
                              setSelectedOffset(b.offset);
                              setPatchInput(b.hex);
                            }}
                            className={`w-5 text-center rounded transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 font-bold scale-110 shadow'
                                : isPatch
                                ? 'bg-amber-500/30 text-amber-300 font-bold underline'
                                : b.byte === 0x00
                                ? 'text-slate-600'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {b.hex}
                          </button>
                        );
                      })}
                    </div>

                    {/* ASCII column */}
                    <div className="w-32 pl-2 text-slate-400 font-mono tracking-wider flex">
                      {rowBytes.map((b) => (
                        <span
                          key={b.offset}
                          className={`${b.offset === selectedOffset ? 'text-emerald-400 font-bold' : ''}`}
                        >
                          {b.ascii}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Byte Deep Inspector & Patcher */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-white">
                {englishMode ? 'Byte Inspector' : 'فاحص البايت المحدد'}
              </span>
              <span className="text-xs font-mono text-emerald-400">
                0x{selectedByte.offset.toString(16).padStart(4, '0').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Hex Value</span>
                <span className="text-emerald-300 font-bold text-sm">0x{selectedByte.hex}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Decimal (Uint8)</span>
                <span className="text-white font-bold text-sm">{selectedByte.byte}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Binary (8-bit)</span>
                <span className="text-indigo-300 font-semibold">{selectedByte.byte.toString(2).padStart(8, '0')}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">ASCII Char</span>
                <span className="text-amber-300 font-bold text-sm">'{selectedByte.ascii}'</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800/80 space-y-1 text-xs">
              <span className="text-slate-500 block text-[10px] font-mono">Section Location</span>
              <span className="text-white font-semibold font-mono">{selectedByte.section || 'PE Header'}</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {selectedByte.offset === 0x5A
                  ? (englishMode ? 'Critical Opcode: 0x74 represents x86 conditional branch "JE" (Jump if Equal). Patching this byte inverts authorization check!' : 'أمر حرج: البايت 0x74 يمثل تعليمة JE (Jump if Equal). تعديله يقلب شرط التحقق!')
                  : selectedByte.offset < 0x40
                  ? (englishMode ? 'DOS Stub Header segment containing legacy compatibility strings.' : 'مقطع DOS Stub التوافقي.')
                  : (englishMode ? 'Payload machine instructions or data literals.' : 'تعليمات الآلة وبيانات البرنامج.')}
              </p>
            </div>

            {/* Binary Patcher Form */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  {englishMode ? 'Live Binary Patcher' : 'ترقيع وتعديل البايت مباشرة'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={2}
                  value={patchInput}
                  onChange={(e) => setPatchInput(e.target.value)}
                  className="w-16 bg-slate-950 border border-slate-700 text-center font-mono text-emerald-400 font-bold text-sm rounded-lg py-1.5 focus:outline-none focus:border-emerald-500"
                  placeholder="75"
                />
                <button
                  onClick={handleApplyPatch}
                  className="flex-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                >
                  {englishMode ? 'Apply Patch (Save)' : 'تطبيق الباتش (حفظ)'}
                </button>
              </div>

              {/* Quick shortcut presets */}
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <span>Presets:</span>
                <button
                  onClick={() => setPatchInput('75')}
                  className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200"
                  title="Invert to JNE"
                >
                  0x75 (JNE)
                </button>
                <button
                  onClick={() => setPatchInput('90')}
                  className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200"
                  title="Replace with NOP"
                >
                  0x90 (NOP)
                </button>
                <button
                  onClick={() => setPatchInput('CC')}
                  className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 text-slate-200"
                  title="Insert INT 3 Breakpoint"
                >
                  0xCC (INT3)
                </button>
              </div>

              {feedbackMsg && (
                <div className="text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-900/60 p-2 rounded">
                  {feedbackMsg}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* PE Section Headers Table (Fundamental reverse engineering concept) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {englishMode ? 'PE / ELF Binary Sections Breakdown' : 'أقسام الملف الثنائي (PE / ELF Sections)'}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {englishMode
              ? 'Every compiled executable is structured into segregated memory sections with distinct permissions and entropy levels.'
              : 'ينقسم أي ملف تنفيذي مترجم إلى أقسام ذاكرة محددة الصلاحيات (R/W/X)، مع تباين في معامل الإنتروبيا (Entropy) الذي يكشف التشفير والضغط.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">{englishMode ? 'Section Name' : 'اسم القسم'}</th>
                <th className="py-2.5 px-3">{englishMode ? 'Virtual Addr' : 'العنوان الافتراضي'}</th>
                <th className="py-2.5 px-3">{englishMode ? 'Raw / Virtual Size' : 'الحجم في القرص / الذاكرة'}</th>
                <th className="py-2.5 px-3">{englishMode ? 'Entropy (Bits)' : 'معامل الإنتروبيا'}</th>
                <th className="py-2.5 px-3">{englishMode ? 'Permissions' : 'الصلاحيات'}</th>
                <th className="py-2.5 px-3 font-sans">{englishMode ? 'Role in Reverse Engineering' : 'الوظيفة في الهندسة العكسية'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SAMPLE_PE_SECTIONS.map((sec) => (
                <tr key={sec.name} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-bold text-emerald-400">{sec.name}</td>
                  <td className="py-3 px-3 text-slate-300">{sec.virtualAddress}</td>
                  <td className="py-3 px-3 text-slate-400">{sec.rawSize}B / {sec.virtualSize}B</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      sec.entropy > 6.0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {sec.entropy.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${sec.permissions.includes('x') ? 'text-rose-400' : 'text-slate-300'}`}>
                      {sec.permissions}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300 text-xs">
                    {englishMode ? sec.descriptionEn : sec.descriptionAr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
