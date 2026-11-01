import { DecompiledProgram } from '../types/reverseEngineering';

export const CURATED_BINARIES: DecompiledProgram[] = [
  {
    id: 'crackme_basic_pass',
    titleAr: 'تحليل كراك-مي: التحقق من كلمة المرور',
    titleEn: 'Crackme 01: Passcode Verification & Jump Inversion',
    category: 'crackme',
    difficulty: 'مبتدئ',
    descriptionAr: 'برنامج نموذجي يستقبل مدخل المستخدم ويقارنه برمز سري مخزن. هدف المهندس العكسي هو إما استخراج الرمز أو قلب القفزة الشرطية (Patching JE to JNE).',
    descriptionEn: 'A standard entry-level crackme binary that validates a user passcode. The analyst objective is extracting the hardcoded key or inverting the conditional branch.',
    cCode: `// Source Code Reconstructed from Binary
#include <stdio.h>
#include <string.h>

int main() {
    char input[16];
    printf("Enter license passcode: ");
    scanf("%15s", input);

    // Critical check point
    if (strcmp(input, "VORTEX-88") == 0) {
        printf("[+] ACCESS GRANTED: Welcome Operator\\n");
        return 0; // Success exit
    } else {
        printf("[-] ACCESS DENIED: Invalid Passcode\\n");
        return 1; // Failure exit
    }
}`,
    instructions: [
      {
        address: '0x00401120',
        bytesHex: '55',
        mnemonic: 'push',
        operands: 'rbp',
        explanationAr: 'حفظ مؤشر قاعدة المكدس القديم (Old Base Pointer) في قمة المكدس.',
        explanationEn: 'Save caller base pointer onto the runtime stack.',
        affectsLineC: 6
      },
      {
        address: '0x00401121',
        bytesHex: '48 89 E5',
        mnemonic: 'mov',
        operands: 'rbp, rsp',
        explanationAr: 'تثبيت إطار الدالة الجديد بجعل RBP يشير إلى قمة المكدس الحالية.',
        explanationEn: 'Establish new stack frame by copying stack pointer RSP into RBP.',
        affectsLineC: 6
      },
      {
        address: '0x00401124',
        bytesHex: '48 83 EC 20',
        mnemonic: 'sub',
        operands: 'rsp, 0x20',
        explanationAr: 'حجز مساحة 32 بايت على المكدس لتخزين المتغيرات المحلية (مصفوفة المدخلات).',
        explanationEn: 'Allocate 32 bytes on the stack for local variables buffer.',
        affectsLineC: 7
      },
      {
        address: '0x00401128',
        bytesHex: '48 8D 3D 15 20 00 00',
        mnemonic: 'lea',
        operands: 'rdi, [rip + 0x2015]',
        explanationAr: 'تحميل عنوان نص المقارنة "VORTEX-88" من قسم البيانات .rdata في السجل RDI.',
        explanationEn: 'Load address of hardcoded string "VORTEX-88" from .rdata into RDI.',
        affectsLineC: 11
      },
      {
        address: '0x0040112F',
        bytesHex: '48 8D 75 E0',
        mnemonic: 'lea',
        operands: 'rsi, [rbp - 0x20]',
        explanationAr: 'تحميل عنوان مدخل المستخدم المخزن في المكدس في السجل RSI للمقارنة.',
        explanationEn: 'Load effective address of user input buffer into RSI register.',
        affectsLineC: 11
      },
      {
        address: '0x00401133',
        bytesHex: 'E8 78 02 00 00',
        mnemonic: 'call',
        operands: 'strcmp@plt',
        explanationAr: 'استدعاء دالة strcmp. إذا كانت النصوص متطابقة تعيد القيمة 0 في السجل EAX.',
        explanationEn: 'Invoke standard strcmp. Returns 0 in EAX if strings match exactly.',
        affectsLineC: 11
      },
      {
        address: '0x00401138',
        bytesHex: '85 C0',
        mnemonic: 'test',
        operands: 'eax, eax',
        explanationAr: 'فحص ناتج المقارنة: إذا كان EAX = 0 يتم ضبط راية الصفر (Zero Flag ZF = 1).',
        explanationEn: 'Logical AND test on EAX; sets Zero Flag (ZF = 1) if result is zero.',
        affectsLineC: 11
      },
      {
        address: '0x0040113A',
        bytesHex: '74 14',
        mnemonic: 'je',
        operands: '0x00401150',
        jumpTarget: '0x00401150',
        explanationAr: 'قفزة شرطية: إذا تحقق التطابق (ZF = 1) اقفز لعنوان النجاح؛ وإلا تابع للرفض.',
        explanationEn: 'Conditional branch: Jump to success block if ZF == 1. Target of binary patch!',
        affectsLineC: 11
      },
      {
        address: '0x0040113C',
        bytesHex: '48 8D 3D 30 20 00 00',
        mnemonic: 'lea',
        operands: 'rdi, [rip + 0x2030]',
        explanationAr: 'كتلة الفشل: تحميل رسالة الرفض "ACCESS DENIED".',
        explanationEn: 'Failure block: load "ACCESS DENIED" string reference.',
        affectsLineC: 15
      },
      {
        address: '0x00401143',
        bytesHex: 'E8 68 02 00 00',
        mnemonic: 'call',
        operands: 'puts@plt',
        explanationAr: 'طباعة رسالة الرفض على الشاشة.',
        explanationEn: 'Print access denied output string.',
        affectsLineC: 15
      },
      {
        address: '0x00401148',
        bytesHex: 'B8 01 00 00 00',
        mnemonic: 'mov',
        operands: 'eax, 0x1',
        explanationAr: 'وضع كود الخروج 1 (خطأ) في سجل القيمة المرجعة EAX.',
        explanationEn: 'Return code 1 (failure) loaded into EAX.',
        affectsLineC: 16
      },
      {
        address: '0x0040114D',
        bytesHex: 'EB 12',
        mnemonic: 'jmp',
        operands: '0x00401161',
        jumpTarget: '0x00401161',
        explanationAr: 'قفزة غير مشروطة إلى خاتمة الدالة Epilogue.',
        explanationEn: 'Unconditional jump to function epilogue cleanup.',
        affectsLineC: 16
      },
      {
        address: '0x00401150',
        bytesHex: '48 8D 3D 50 20 00 00',
        mnemonic: 'lea',
        operands: 'rdi, [rip + 0x2050]',
        explanationAr: 'كتلة النجاح: تحميل رسالة "ACCESS GRANTED: Welcome Operator".',
        explanationEn: 'Success block: load address of authorized grant message.',
        affectsLineC: 12
      },
      {
        address: '0x00401157',
        bytesHex: 'E8 54 02 00 00',
        mnemonic: 'call',
        operands: 'puts@plt',
        explanationAr: 'طباعة رسالة الترحيب والنجاح.',
        explanationEn: 'Print access granted output string.',
        affectsLineC: 12
      },
      {
        address: '0x0040115C',
        bytesHex: 'B8 00 00 00 00',
        mnemonic: 'mov',
        operands: 'eax, 0x0',
        explanationAr: 'وضع كود الخروج 0 (نجاح كامل) في السجل EAX.',
        explanationEn: 'Load status code 0 (success) into EAX.',
        affectsLineC: 13
      },
      {
        address: '0x00401161',
        bytesHex: 'C9',
        mnemonic: 'leave',
        operands: '',
        explanationAr: 'استعادة مؤشر المكدس وإلغاء حجز المتغيرات (mov rsp, rbp; pop rbp).',
        explanationEn: 'Function cleanup: unwind stack frame (restores RSP and pops RBP).',
        affectsLineC: 17
      },
      {
        address: '0x00401162',
        bytesHex: 'C3',
        mnemonic: 'ret',
        operands: '',
        explanationAr: 'العودة للمنادي بسحب عنوان الرجوع من قمة المكدس في سجل RIP.',
        explanationEn: 'Pop return address from stack top into RIP and return to caller.',
        affectsLineC: 17
      }
    ],
    cfgNodes: [
      {
        id: 'bb_entry',
        title: 'Prologue & Strcmp Setup',
        blockType: 'entry',
        x: 200,
        y: 20,
        instructions: [
          { address: '0x00401120', bytesHex: '55', mnemonic: 'push', operands: 'rbp', explanationAr: '', explanationEn: '' },
          { address: '0x00401121', bytesHex: '48 89 E5', mnemonic: 'mov', operands: 'rbp, rsp', explanationAr: '', explanationEn: '' },
          { address: '0x00401124', bytesHex: '48 83 EC 20', mnemonic: 'sub', operands: 'rsp, 0x20', explanationAr: '', explanationEn: '' },
          { address: '0x00401128', bytesHex: '48 8D 3D..', mnemonic: 'lea', operands: 'rdi, "VORTEX-88"', explanationAr: '', explanationEn: '' },
          { address: '0x00401133', bytesHex: 'E8..', mnemonic: 'call', operands: 'strcmp', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'bb_cond'
      },
      {
        id: 'bb_cond',
        title: 'Condition Test (ZF Flag)',
        blockType: 'condition',
        x: 200,
        y: 190,
        instructions: [
          { address: '0x00401138', bytesHex: '85 C0', mnemonic: 'test', operands: 'eax, eax', explanationAr: '', explanationEn: '' },
          { address: '0x0040113A', bytesHex: '74 14', mnemonic: 'je', operands: '0x00401150', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'bb_success',
        falseBranch: 'bb_fail'
      },
      {
        id: 'bb_fail',
        title: 'Access Denied Block',
        blockType: 'normal',
        x: 80,
        y: 340,
        instructions: [
          { address: '0x0040113C', bytesHex: '48 8D..', mnemonic: 'lea', operands: 'rdi, "ACCESS DENIED"', explanationAr: '', explanationEn: '' },
          { address: '0x00401143', bytesHex: 'E8..', mnemonic: 'call', operands: 'puts', explanationAr: '', explanationEn: '' },
          { address: '0x00401148', bytesHex: 'B8 01..', mnemonic: 'mov', operands: 'eax, 1', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'bb_exit'
      },
      {
        id: 'bb_success',
        title: 'Access Granted Block',
        blockType: 'normal',
        x: 320,
        y: 340,
        instructions: [
          { address: '0x00401150', bytesHex: '48 8D..', mnemonic: 'lea', operands: 'rdi, "ACCESS GRANTED"', explanationAr: '', explanationEn: '' },
          { address: '0x00401157', bytesHex: 'E8..', mnemonic: 'call', operands: 'puts', explanationAr: '', explanationEn: '' },
          { address: '0x0040115C', bytesHex: 'B8 00..', mnemonic: 'mov', operands: 'eax, 0', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'bb_exit'
      },
      {
        id: 'bb_exit',
        title: 'Function Epilogue (Leave & Ret)',
        blockType: 'exit',
        x: 200,
        y: 490,
        instructions: [
          { address: '0x00401161', bytesHex: 'C9', mnemonic: 'leave', operands: '', explanationAr: '', explanationEn: '' },
          { address: '0x00401162', bytesHex: 'C3', mnemonic: 'ret', operands: '', explanationAr: '', explanationEn: '' }
        ]
      }
    ],
    initialRegisters: {
      rax: 0x00000000,
      rbx: 0x00000000,
      rcx: 0x00401200,
      rdx: 0x00000000,
      rsi: 0x7fffffffe000,
      rdi: 0x7fffffffe000,
      rbp: 0x7fffffffe100,
      rsp: 0x7fffffffe0e0,
      rip: 0x00401120,
      flags: { zf: false, cf: false, sf: false, of: false }
    },
    initialStack: [
      { address: '0x7fffffffe0e0', valueHex: '0x00401030', decimal: 4198448, label: 'عنوان الرجوع [RIP Return]', type: 'ret_addr' },
      { address: '0x7fffffffe0e8', valueHex: '0x7fffffffe120', decimal: 140737488347424, label: 'إطار الدالة السابقة [Old RBP]', type: 'saved_rbp' },
      { address: '0x7fffffffe0f0', valueHex: '0x00000000', decimal: 0, label: 'حاجز المتغيرات [Stack Buffer]', type: 'local_var' }
    ],
    executionSteps: [
      {
        stepIndex: 0,
        instructionIndex: 0,
        registers: {
          rax: 0x0, rbx: 0x0, rcx: 0x401200, rdx: 0x0, rsi: 0x7fffffffe000, rdi: 0x7fffffffe000,
          rbp: 0x7fffffffe100, rsp: 0x7fffffffe0d8, rip: 0x00401121,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0d8', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'RBP المحفوظ [Saved RBP]', isRsp: true, type: 'saved_rbp' },
          { address: '0x7fffffffe0e0', valueHex: '0x00401030', decimal: 4198448, label: 'عنوان الرجوع [RIP Return]', type: 'ret_addr' }
        ],
        highlightCLine: 6,
        explanationAr: 'تم تنفيذ push rbp: نزل مؤشر المكدس RSP بمقدار 8 بايت وخُزن فيه RBP السابق.',
        explanationEn: 'Executed push rbp: decremented RSP by 8 and saved previous RBP.'
      },
      {
        stepIndex: 1,
        instructionIndex: 1,
        registers: {
          rax: 0x0, rbx: 0x0, rcx: 0x401200, rdx: 0x0, rsi: 0x7fffffffe000, rdi: 0x7fffffffe000,
          rbp: 0x7fffffffe0d8, rsp: 0x7fffffffe0d8, rip: 0x00401124,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0d8', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'إطار الدالة الحالي [RBP & RSP]', isRbp: true, isRsp: true, type: 'saved_rbp' },
          { address: '0x7fffffffe0e0', valueHex: '0x00401030', decimal: 4198448, label: 'عنوان الرجوع [RIP Return]', type: 'ret_addr' }
        ],
        highlightCLine: 6,
        explanationAr: 'تم تنفيذ mov rbp, rsp: أصبح RBP يطابق قمة المكدس لتحديد إطار المتغيرات المحلية.',
        explanationEn: 'Executed mov rbp, rsp: synchronized base pointer with current stack top.'
      },
      {
        stepIndex: 2,
        instructionIndex: 3,
        registers: {
          rax: 0x0, rbx: 0x0, rcx: 0x401200, rdx: 0x0, rsi: 0x7fffffffe0b8, rdi: 0x00403010,
          rbp: 0x7fffffffe0d8, rsp: 0x7fffffffe0b8, rip: 0x0040112F,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0b8', valueHex: '0x584554524f56', decimal: 97061732049750, label: 'نص المدخل ["VORTEX-88"]', isRsp: true, type: 'local_var' },
          { address: '0x7fffffffe0d8', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'إطار الدالة [RBP]', isRbp: true, type: 'saved_rbp' }
        ],
        highlightCLine: 11,
        explanationAr: 'تحميل عنوان النص الثابت في RDI، ومدخل المستخدم في RSI تمهيداً للمقارنة.',
        explanationEn: 'Loaded static key address in RDI and user buffer in RSI for strcmp.'
      },
      {
        stepIndex: 3,
        instructionIndex: 6,
        registers: {
          rax: 0x00000000, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x7fffffffe0b8, rdi: 0x00403010,
          rbp: 0x7fffffffe0d8, rsp: 0x7fffffffe0b8, rip: 0x00401138,
          flags: { zf: true, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0b8', valueHex: '0x584554524f56', decimal: 97061732049750, label: 'نص المدخل ["VORTEX-88"]', isRsp: true, type: 'local_var' },
          { address: '0x7fffffffe0d8', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'إطار الدالة [RBP]', isRbp: true, type: 'saved_rbp' }
        ],
        highlightCLine: 11,
        explanationAr: 'تم تنفيذ test eax, eax بعد أن أعادت دالة strcmp القيمة 0 (تطابق تام). ارتفعت راية الصفر ZF = 1!',
        explanationEn: 'Executed test eax, eax. Since input matched key, strcmp returned 0 and ZF became 1.'
      },
      {
        stepIndex: 4,
        instructionIndex: 7,
        registers: {
          rax: 0x00000000, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x7fffffffe0b8, rdi: 0x00403010,
          rbp: 0x7fffffffe0d8, rsp: 0x7fffffffe0b8, rip: 0x00401150,
          flags: { zf: true, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0b8', valueHex: '0x584554524f56', decimal: 97061732049750, label: 'نص المدخل ["VORTEX-88"]', isRsp: true, type: 'local_var' },
          { address: '0x7fffffffe0d8', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'إطار الدالة [RBP]', isRbp: true, type: 'saved_rbp' }
        ],
        highlightCLine: 12,
        explanationAr: 'قفزة شرطية ناجحة je 0x00401150 لأن ZF=1! تم تجاوز كتلة الرفض والانتقال مباشرة لكتلة التصريح.',
        explanationEn: 'Branch taken! Because ZF=1, RIP jumped over rejection directly into ACCESS GRANTED.'
      },
      {
        stepIndex: 5,
        instructionIndex: 14,
        registers: {
          rax: 0x00000000, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x0, rdi: 0x0,
          rbp: 0x7fffffffe100, rsp: 0x7fffffffe0e0, rip: 0x00401162,
          flags: { zf: true, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe0e0', valueHex: '0x00401030', decimal: 4198448, label: 'عنوان الرجوع [RIP Return]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 17,
        output: '[+] ACCESS GRANTED: Welcome Operator',
        explanationAr: 'طُبعت رسالة النجاح، ونُفذ أمر leave لإلغاء إطار المكدس، وأصبح البرنامج مستعداً للـ ret بقيمة 0 في EAX.',
        explanationEn: 'Printed authorization string, stack unwound via leave, ready for ret with EAX=0.'
      }
    ]
  },
  {
    id: 'xor_cipher_stream',
    titleAr: 'تفكيك خوارزمية تشفير XOR وتحليل الحلقات التكرارية',
    titleEn: 'XOR Stream Cipher Decompilation & Loop Analysis',
    category: 'cryptography',
    difficulty: 'متوسط',
    descriptionAr: 'خوارزمية تشفير بايت-بايت شائعة في البرمجيات الخبيثة لإخفاء النصوص الثابتة وسلاسل الـ C2. يتم تفكيك الحلقة ودراسة عملية XOR العكسية.',
    descriptionEn: 'A byte-wise XOR loop frequently observed in malware loaders to conceal C2 domains and config strings. Reverse-engineers the symmetric inversion principle.',
    cCode: `// Reconstructed C Decompilation of String Decryption Loop
void xor_decrypt_payload(char *buffer, unsigned char key) {
    // Key: 0x5A ('Z')
    while (*buffer != '\\0') {
        *buffer = *buffer ^ key; // Invert byte with symmetric XOR
        buffer++;
    }
}

// In the binary: Encrypted bytes = {0x0E, 0x3F, 0x2E, 0x3E, 0x3F, 0x00}
// Decrypted text reveals: "4admin"`,
    instructions: [
      {
        address: '0x00402010',
        bytesHex: '55',
        mnemonic: 'push',
        operands: 'rbp',
        explanationAr: 'حفظ إطار المكدس.',
        explanationEn: 'Prologue: save RBP.',
        affectsLineC: 2
      },
      {
        address: '0x00402011',
        bytesHex: '48 89 E5',
        mnemonic: 'mov',
        operands: 'rbp, rsp',
        explanationAr: 'تثبيت إطار المكدس.',
        explanationEn: 'Establish base pointer frame.',
        affectsLineC: 2
      },
      {
        address: '0x00402014',
        bytesHex: '48 89 7D F8',
        mnemonic: 'mov',
        operands: '[rbp - 0x8], rdi',
        explanationAr: 'تخزين مؤشر مصفوفة البايتات المشفرة في المتغير المحلي.',
        explanationEn: 'Store buffer pointer argument on stack.',
        affectsLineC: 2
      },
      {
        address: '0x00402018',
        bytesHex: '89 75 F4',
        mnemonic: 'mov',
        operands: '[rbp - 0xc], esi',
        explanationAr: 'تخزين مفتاح التشفير (0x5A) في الذاكرة المحلية.',
        explanationEn: 'Store cipher key (0x5A) in local variable.',
        affectsLineC: 2
      },
      {
        address: '0x0040201B',
        bytesHex: 'EB 19',
        mnemonic: 'jmp',
        operands: '0x00402036',
        jumpTarget: '0x00402036',
        explanationAr: 'قفزة تمهيدية لفحص شرط الحلقة (while condition) قبل بدء المعالجة.',
        explanationEn: 'Compiler optimization: jump to loop condition test first.',
        affectsLineC: 4
      },
      {
        address: '0x0040201D',
        bytesHex: '48 8B 45 F8',
        mnemonic: 'mov',
        operands: 'rax, [rbp - 0x8]',
        explanationAr: 'جلب مؤشر البايت الحالي إلى السجل RAX.',
        explanationEn: 'Load current byte buffer pointer into RAX.',
        affectsLineC: 5
      },
      {
        address: '0x00402021',
        bytesHex: '0F B6 00',
        mnemonic: 'movzx',
        operands: 'eax, byte ptr [rax]',
        explanationAr: 'قراءة البايت المشفر الحالي وتوسيعه بالأصفار في EAX.',
        explanationEn: 'Zero-extend read current encrypted byte into EAX.',
        affectsLineC: 5
      },
      {
        address: '0x00402024',
        bytesHex: '33 45 F4',
        mnemonic: 'xor',
        operands: 'eax, [rbp - 0xc]',
        explanationAr: 'العملية السحرية: تطبيق XOR بين البايت ومفتاح 0x5A لفك التشفير!',
        explanationEn: 'Core operation: XOR byte with key 0x5A, restoring original ASCII.',
        affectsLineC: 5
      },
      {
        address: '0x00402027',
        bytesHex: '88 02',
        mnemonic: 'mov',
        operands: 'byte ptr [rdx], al',
        explanationAr: 'كتابة البايت المفكوك مجدداً في موقعه في الذاكرة.',
        explanationEn: 'Write decrypted plaintext byte back into buffer.',
        affectsLineC: 5
      },
      {
        address: '0x00402029',
        bytesHex: '48 83 45 F8 01',
        mnemonic: 'add',
        operands: 'qword ptr [rbp - 0x8], 1',
        explanationAr: 'زيادة المؤشر بمقدار 1 بايت للانتقال للحرف التالي.',
        explanationEn: 'Increment buffer pointer to next character.',
        affectsLineC: 6
      },
      {
        address: '0x00402036',
        bytesHex: '80 38 00',
        mnemonic: 'cmp',
        operands: 'byte ptr [rax], 0x0',
        explanationAr: 'فحص نهاية السلسلة: هل وصلنا للبايت الصفري النول (Null Terminator \\0)؟',
        explanationEn: 'Loop condition: compare byte against null terminator \\0.',
        affectsLineC: 4
      },
      {
        address: '0x00402039',
        bytesHex: '75 E2',
        mnemonic: 'jne',
        operands: '0x0040201D',
        jumpTarget: '0x0040201D',
        explanationAr: 'إذا لم تكن نهاية النص (ZF = 0) كرر الحلقة للبايت التالي.',
        explanationEn: 'Loop continuation: branch back to decode block if byte != 0.',
        affectsLineC: 4
      },
      {
        address: '0x0040203B',
        bytesHex: '5D C3',
        mnemonic: 'pop rbp; ret',
        operands: '',
        explanationAr: 'انتهاء فك كامل النص والعودة للبرنامج الرئيسي.',
        explanationEn: 'Decryption finished; restore RBP and return.',
        affectsLineC: 8
      }
    ],
    cfgNodes: [
      {
        id: 'xor_init',
        title: 'Initial Setup & Jump to Condition',
        blockType: 'entry',
        x: 200,
        y: 20,
        instructions: [
          { address: '0x00402010', bytesHex: '55', mnemonic: 'push', operands: 'rbp', explanationAr: '', explanationEn: '' },
          { address: '0x00402018', bytesHex: '89 75 F4', mnemonic: 'mov', operands: '[rbp-0xc], 0x5A', explanationAr: '', explanationEn: '' },
          { address: '0x0040201B', bytesHex: 'EB 19', mnemonic: 'jmp', operands: '0x00402036', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'xor_cond'
      },
      {
        id: 'xor_cond',
        title: 'Loop Condition: Check *buffer != \\0',
        blockType: 'condition',
        x: 200,
        y: 190,
        instructions: [
          { address: '0x00402036', bytesHex: '80 38 00', mnemonic: 'cmp', operands: 'byte ptr [rax], 0x0', explanationAr: '', explanationEn: '' },
          { address: '0x00402039', bytesHex: '75 E2', mnemonic: 'jne', operands: '0x0040201D', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'xor_body',
        falseBranch: 'xor_done'
      },
      {
        id: 'xor_body',
        title: 'Decode Byte: *buffer ^= Key',
        blockType: 'normal',
        x: 60,
        y: 350,
        instructions: [
          { address: '0x00402021', bytesHex: '0F B6 00', mnemonic: 'movzx', operands: 'eax, byte ptr [rax]', explanationAr: '', explanationEn: '' },
          { address: '0x00402024', bytesHex: '33 45 F4', mnemonic: 'xor', operands: 'eax, 0x5A', explanationAr: '', explanationEn: '' },
          { address: '0x00402029', bytesHex: '48 83..', mnemonic: 'add', operands: 'ptr, 1', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'xor_cond'
      },
      {
        id: 'xor_done',
        title: 'Decryption Loop Completed',
        blockType: 'exit',
        x: 340,
        y: 350,
        instructions: [
          { address: '0x0040203B', bytesHex: '5D C3', mnemonic: 'pop rbp; ret', operands: '', explanationAr: '', explanationEn: '' }
        ]
      }
    ],
    initialRegisters: {
      rax: 0x00000000,
      rbx: 0x00000000,
      rcx: 0x00000000,
      rdx: 0x7fffffffe100,
      rsi: 0x0000005A,
      rdi: 0x7fffffffe100,
      rbp: 0x7fffffffe080,
      rsp: 0x7fffffffe060,
      rip: 0x00402010,
      flags: { zf: false, cf: false, sf: false, of: false }
    },
    initialStack: [
      { address: '0x7fffffffe060', valueHex: '0x004018A0', decimal: 4200608, label: 'عنوان الرجوع [Caller Ret]', type: 'ret_addr' },
      { address: '0x7fffffffe068', valueHex: '0x7fffffffe100', decimal: 140737488347392, label: 'مؤشر النص المشفر', type: 'arg' },
      { address: '0x7fffffffe070', valueHex: '0x0000005A', decimal: 90, label: 'مفتاح XOR = 0x5A', type: 'local_var' }
    ],
    executionSteps: [
      {
        stepIndex: 0,
        instructionIndex: 4,
        registers: {
          rax: 0x7fffffffe100, rbx: 0x0, rcx: 0x0, rdx: 0x7fffffffe100, rsi: 0x5A, rdi: 0x7fffffffe100,
          rbp: 0x7fffffffe080, rsp: 0x7fffffffe060, rip: 0x00402036,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe060', valueHex: '0x004018A0', decimal: 4200608, label: 'عنوان الرجوع [Caller Ret]', isRsp: true, type: 'ret_addr' },
          { address: '0x7fffffffe070', valueHex: '0x0000005A', decimal: 90, label: 'مفتاح XOR = 0x5A', type: 'local_var' }
        ],
        highlightCLine: 4,
        explanationAr: 'فحص البايت الأول المشفر (0x0E): لا يساوي الصفر، إذن شرط الحلقة متحقق.',
        explanationEn: 'Testing first encrypted byte (0x0E): non-zero, entering loop body.'
      },
      {
        stepIndex: 1,
        instructionIndex: 7,
        registers: {
          rax: 0x00000034, rbx: 0x0, rcx: 0x0, rdx: 0x7fffffffe100, rsi: 0x5A, rdi: 0x7fffffffe100,
          rbp: 0x7fffffffe080, rsp: 0x7fffffffe060, rip: 0x00402027,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe060', valueHex: '0x004018A0', decimal: 4200608, label: 'عنوان الرجوع [Caller Ret]', isRsp: true, type: 'ret_addr' },
          { address: '0x7fffffffe070', valueHex: '0x0000005A', decimal: 90, label: 'مفتاح XOR = 0x5A', type: 'local_var' }
        ],
        highlightCLine: 5,
        explanationAr: 'عملية XOR: تم حساب (0x0E ^ 0x5A = 0x34). هذا هو الحرف "4" في جدول ASCII!',
        explanationEn: 'Calculated 0x0E XOR 0x5A = 0x34 ("4" in ASCII). Plaintext recovered!'
      },
      {
        stepIndex: 2,
        instructionIndex: 9,
        registers: {
          rax: 0x7fffffffe101, rbx: 0x0, rcx: 0x0, rdx: 0x7fffffffe101, rsi: 0x5A, rdi: 0x7fffffffe100,
          rbp: 0x7fffffffe080, rsp: 0x7fffffffe060, rip: 0x00402036,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe060', valueHex: '0x004018A0', decimal: 4200608, label: 'عنوان الرجوع [Caller Ret]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 6,
        explanationAr: 'تقدم المؤشر إلى البايت الثاني (0x3F). بعد XOR مع 0x5A يعطي 0x65 الحرف "a".',
        explanationEn: 'Pointer advanced to byte 2 (0x3F). Decrypts to 0x65 ("a").'
      },
      {
        stepIndex: 3,
        instructionIndex: 12,
        registers: {
          rax: 0x7fffffffe106, rbx: 0x0, rcx: 0x0, rdx: 0x7fffffffe106, rsi: 0x5A, rdi: 0x7fffffffe100,
          rbp: 0x7fffffffe080, rsp: 0x7fffffffe060, rip: 0x0040203B,
          flags: { zf: true, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffe060', valueHex: '0x004018A0', decimal: 4200608, label: 'عنوان الرجوع [Caller Ret]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 8,
        output: 'Decrypted Payload String: "4admin"',
        explanationAr: 'تمت قراءة بايت الصفر \\0، وارتفعت راية الصفر ZF=1 لتنتهي الحلقة بعد استعادة النص الأصلي كاملاً: "4admin".',
        explanationEn: 'Null terminator encountered, ZF=1, loop terminated. Successfully decrypted string: "4admin".'
      }
    ]
  },
  {
    id: 'anti_debug_peb',
    titleAr: 'تفكيك آليات الحماية من التنقيح (Anti-Debugging via PEB)',
    titleEn: 'Anti-Debugging Reversing: PEB.BeingDebugged Inspection',
    category: 'anti_debug',
    difficulty: 'متقدم',
    descriptionAr: 'تقنية شهيرة تستخدمها ملفات المالوير لفحص حقل BeingDebugged في كتلة بيئة العملية (PEB) لاكتشاف تشغيلها داخل x64dbg أو Cheat Engine أو IDA.',
    descriptionEn: 'The classic anti-analysis check querying the Process Environment Block (PEB) BeingDebugged flag to detect active debuggers and trigger evasion behavior.',
    cCode: `// Reconstructed Malware Evasion Routine
#include <windows.h>
#include <winternl.h>

int check_debugger_presence() {
    // Direct assembly access to GS register on x64
    // GS:[0x60] points to the Process Environment Block (PEB)
    PPEB pPeb = (PPEB)__readgsqword(0x60);
    
    // Offset +2 is the BOOLEAN BeingDebugged flag
    if (pPeb->BeingDebugged) {
        // Anti-analysis reaction: Terminate stealthily or alter behavior
        ExitProcess(0xDEAD);
        return 1;
    }
    
    // Normal malicious execution continues
    return 0;
}`,
    instructions: [
      {
        address: '0x00403000',
        bytesHex: '65 48 8B 04 25 60 00 00 00',
        mnemonic: 'mov',
        operands: 'rax, gs:[0x60]',
        explanationAr: 'قراءة عنوان كتلة PEB في سجل RAX مباشرة من مسجل المقطع GS:[0x60] على معمارية x64.',
        explanationEn: 'Query GS:[0x60] segment selector to retrieve PEB base address on x64.',
        affectsLineC: 8
      },
      {
        address: '0x00403009',
        bytesHex: '0F B6 40 02',
        mnemonic: 'movzx',
        operands: 'eax, byte ptr [rax + 0x2]',
        explanationAr: 'قراءة بايت حقل BeingDebugged الواقع عند الإزاحة +2 من بداية بنية PEB.',
        explanationEn: 'Read byte at PEB offset +0x02 (the BeingDebugged boolean flag).',
        affectsLineC: 11
      },
      {
        address: '0x0040300D',
        bytesHex: '85 C0',
        mnemonic: 'test',
        operands: 'eax, eax',
        explanationAr: 'فحص القيمة: إذا كانت 1 فالمنقح موجود؛ وإلا فالبرنامج يعمل طبيعياً.',
        explanationEn: 'Test BeingDebugged value. If non-zero, a debugger is actively attached.',
        affectsLineC: 11
      },
      {
        address: '0x0040300F',
        bytesHex: '75 05',
        mnemonic: 'jnz',
        operands: '0x00403016',
        jumpTarget: '0x00403016',
        explanationAr: 'إذا اكتشف المنقح (BeingDebugged != 0) اقفز فوراً لمسار الإلغاء والإنهاء.',
        explanationEn: 'Branch to defense evasion/exit routine if debugger detected.',
        affectsLineC: 11
      },
      {
        address: '0x00403011',
        bytesHex: '31 C0 C3',
        mnemonic: 'xor eax, eax; ret',
        operands: '',
        explanationAr: 'مسار الأمان: تصفير السجل EAX=0 والعودة لتنفيذ البرنامج الأصلي.',
        explanationEn: 'Benign branch: Zero EAX (clean environment) and return.',
        affectsLineC: 18
      },
      {
        address: '0x00403016',
        bytesHex: 'B9 AD DE 00 00',
        mnemonic: 'mov',
        operands: 'ecx, 0xDEAD',
        explanationAr: 'مسار التخريب والإنهاء: تحميل كود الخطأ 0xDEAD واستدعاء ExitProcess.',
        explanationEn: 'Evasion branch: Load exit code 0xDEAD and terminate.',
        affectsLineC: 13
      }
    ],
    cfgNodes: [
      {
        id: 'peb_query',
        title: 'Query GS:[0x60] -> PEB',
        blockType: 'entry',
        x: 200,
        y: 20,
        instructions: [
          { address: '0x00403000', bytesHex: '65 48..', mnemonic: 'mov', operands: 'rax, gs:[0x60]', explanationAr: '', explanationEn: '' },
          { address: '0x00403009', bytesHex: '0F B6..', mnemonic: 'movzx', operands: 'eax, [rax+0x2]', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'peb_check'
      },
      {
        id: 'peb_check',
        title: 'Check BeingDebugged Flag',
        blockType: 'condition',
        x: 200,
        y: 190,
        instructions: [
          { address: '0x0040300D', bytesHex: '85 C0', mnemonic: 'test', operands: 'eax, eax', explanationAr: '', explanationEn: '' },
          { address: '0x0040300F', bytesHex: '75 05', mnemonic: 'jnz', operands: '0x00403016', explanationAr: '', explanationEn: '' }
        ],
        trueBranch: 'peb_detected',
        falseBranch: 'peb_clean'
      },
      {
        id: 'peb_clean',
        title: 'No Debugger (Proceed Cleanly)',
        blockType: 'exit',
        x: 80,
        y: 340,
        instructions: [
          { address: '0x00403011', bytesHex: '31 C0 C3', mnemonic: 'xor eax, eax; ret', operands: '', explanationAr: '', explanationEn: '' }
        ]
      },
      {
        id: 'peb_detected',
        title: 'Debugger Found (Evasion Exit)',
        blockType: 'exit',
        x: 320,
        y: 340,
        instructions: [
          { address: '0x00403016', bytesHex: 'B9 AD DE..', mnemonic: 'mov', operands: 'ecx, 0xDEAD', explanationAr: '', explanationEn: '' }
        ]
      }
    ],
    initialRegisters: {
      rax: 0x00000000,
      rbx: 0x00000000,
      rcx: 0x00000000,
      rdx: 0x00000000,
      rsi: 0x00000000,
      rdi: 0x00000000,
      rbp: 0x7fffffffe000,
      rsp: 0x7fffffffdfe0,
      rip: 0x00403000,
      flags: { zf: false, cf: false, sf: false, of: false }
    },
    initialStack: [
      { address: '0x7fffffffdfe0', valueHex: '0x00401500', decimal: 4199680, label: 'عنوان الرجوع [RIP Return]', type: 'ret_addr' }
    ],
    executionSteps: [
      {
        stepIndex: 0,
        instructionIndex: 0,
        registers: {
          rax: 0x00007ff81000, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x0, rdi: 0x0,
          rbp: 0x7fffffffe000, rsp: 0x7fffffffdfe0, rip: 0x00403009,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffdfe0', valueHex: '0x00401500', decimal: 4199680, label: 'عنوان الرجوع [RIP Return]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 8,
        explanationAr: 'تمت قراءة عنوان PEB من مقطع GS:[0x60] وتخزينه في RAX = 0x7ff81000.',
        explanationEn: 'Retrieved process PEB structure address into RAX = 0x7ff81000.'
      },
      {
        stepIndex: 1,
        instructionIndex: 1,
        registers: {
          rax: 0x00000001, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x0, rdi: 0x0,
          rbp: 0x7fffffffe000, rsp: 0x7fffffffdfe0, rip: 0x0040300D,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffdfe0', valueHex: '0x00401500', decimal: 4199680, label: 'عنوان الرجوع [RIP Return]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 11,
        explanationAr: 'قراءة البايت [RAX+2]: القيمة = 1! هذا يعني أن هناك منقح نشط يراقب العملية (Debugger Attached).',
        explanationEn: 'Read byte [RAX+2]: Value is 1 (True). BeingDebugged flag is active!'
      },
      {
        stepIndex: 2,
        instructionIndex: 2,
        registers: {
          rax: 0x00000001, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x0, rdi: 0x0,
          rbp: 0x7fffffffe000, rsp: 0x7fffffffdfe0, rip: 0x0040300F,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffdfe0', valueHex: '0x00401500', decimal: 4199680, label: 'عنوان الرجوع [RIP Return]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 11,
        explanationAr: 'فحص test eax, eax: بما أن القيمة 1 فـ ZF = 0 (ليست صفراً).',
        explanationEn: 'Test operation: Since EAX is 1, Zero Flag ZF remains 0 (False).'
      },
      {
        stepIndex: 3,
        instructionIndex: 3,
        registers: {
          rax: 0x00000001, rbx: 0x0, rcx: 0x0, rdx: 0x0, rsi: 0x0, rdi: 0x0,
          rbp: 0x7fffffffe000, rsp: 0x7fffffffdfe0, rip: 0x00403016,
          flags: { zf: false, cf: false, sf: false, of: false }
        },
        stack: [
          { address: '0x7fffffffdfe0', valueHex: '0x00401500', decimal: 4199680, label: 'عنوان الرجوع [RIP Return]', isRsp: true, type: 'ret_addr' }
        ],
        highlightCLine: 13,
        output: '[!] ANTI-DEBUG TRIGGERED: Evasion code executed (ExitProcess 0xDEAD)',
        explanationAr: 'قفز البرنامج jnz إلى كتلة الهروب وتم إغلاق البرنامج فوراً لخداع محلل البرمجيات الخبيثة!',
        explanationEn: 'Jump taken to evasion block. Program self-terminates to thwart debugger inspection.'
      }
    ]
  }
];
