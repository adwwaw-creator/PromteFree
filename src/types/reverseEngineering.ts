export interface CpuRegisters {
  rax: number;
  rbx: number;
  rcx: number;
  rdx: number;
  rsi: number;
  rdi: number;
  rbp: number;
  rsp: number;
  rip: number;
  flags: {
    zf: boolean; // Zero flag
    cf: boolean; // Carry flag
    sf: boolean; // Sign flag
    of: boolean; // Overflow flag
  };
}

export interface StackItem {
  address: string;
  valueHex: string;
  decimal: number;
  label?: string;
  isRsp?: boolean;
  isRbp?: boolean;
  type?: 'ret_addr' | 'saved_rbp' | 'local_var' | 'arg';
}

export interface AsmInstruction {
  address: string;
  bytesHex: string;
  mnemonic: string;
  operands: string;
  explanationAr: string;
  explanationEn: string;
  affectsLineC?: number;
  jumpTarget?: string;
  isBreakpoint?: boolean;
}

export interface CFGNode {
  id: string;
  title: string;
  blockType: 'entry' | 'normal' | 'condition' | 'exit';
  instructions: AsmInstruction[];
  trueBranch?: string;
  falseBranch?: string;
  x: number;
  y: number;
}

export interface DecompiledProgram {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'crackme' | 'algorithm' | 'security' | 'anti_debug' | 'cryptography';
  descriptionAr: string;
  descriptionEn: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  cCode: string;
  instructions: AsmInstruction[];
  cfgNodes: CFGNode[];
  initialRegisters: CpuRegisters;
  initialStack: StackItem[];
  executionSteps: Array<{
    stepIndex: number;
    instructionIndex: number;
    registers: CpuRegisters;
    stack: StackItem[];
    highlightCLine: number;
    explanationAr: string;
    explanationEn: string;
    output?: string;
  }>;
}

export interface HexByte {
  offset: number;
  byte: number;
  hex: string;
  ascii: string;
  section?: string;
  isPatched?: boolean;
}

export interface BinarySection {
  name: string;
  virtualAddress: string;
  rawSize: number;
  virtualSize: number;
  entropy: number;
  permissions: 'r-x' | 'rw-' | 'r--';
  descriptionAr: string;
  descriptionEn: string;
}

export interface HistoryMilestone {
  id: string;
  period: string;
  year: string;
  titleAr: string;
  titleEn: string;
  category: 'عسكري' | 'صناعي' | 'ألعاب وبرمجيات' | 'أمن سيبراني';
  summaryAr: string;
  summaryEn: string;
  fullStoryAr: string;
  fullStoryEn: string;
  keyTechniqueAr: string;
  keyTechniqueEn: string;
  legalLessonAr: string;
  legalLessonEn: string;
}

export interface CrackmeChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  difficulty: 'سهل' | 'متوسط' | 'تحدي قوي';
  objectiveAr: string;
  objectiveEn: string;
  disassembly: AsmInstruction[];
  hintAr: string;
  hintEn: string;
  solutionType: 'input_key' | 'patch_byte';
  validKeys?: string[];
  patchableAddress?: string;
  originalByte?: string;
  patchedByteExpected?: string;
  decompiledSnippet: string;
  explanationAfterSolveAr: string;
  explanationAfterSolveEn: string;
}

export interface AsmDocItem {
  mnemonic: string;
  fullName: string;
  syntax: string;
  architecture: 'x86-64' | 'ARM64';
  category: 'نقل البيانات' | 'عمليات حسابية' | 'منطقية ومقارنات' | 'تحكم بالتدفق' | 'المكدس والدوال';
  descriptionAr: string;
  descriptionEn: string;
  flagsAffected: string;
  idiomAr: string;
  idiomEn: string;
  example: string;
}
