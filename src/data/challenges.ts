import { CrackmeChallenge } from '../types/reverseEngineering';

export const CRACKME_CHALLENGES: CrackmeChallenge[] = [
  {
    id: 'challenge_01_pass_or_patch',
    titleAr: 'تحدي 01: كسر التحقق من الترخيص (Crackme Alpha)',
    titleEn: 'Challenge 01: Binary Patching or Key Extraction',
    difficulty: 'سهل',
    objectiveAr: 'إما استخراج كلمة المرور الصحيحة من خلال قراءة عنوان .rdata في لغة التجميع، أو كسر الحماية عبر تعديل بايت القفزة الشرطية (Patching JE to JNE أو NOP).',
    objectiveEn: 'Either extract the plain password from the disassembly string reference, or patch the conditional jump opcode to invert the verification logic.',
    disassembly: [
      { address: '0x00401128', bytesHex: '48 8D 3D 15 20', mnemonic: 'lea', operands: 'rdi, [rip + 0x2015]', explanationAr: 'تحميل عنوان النص المخزن في الذاكرة: "VORTEX-88"', explanationEn: 'Loads static string reference: "VORTEX-88"' },
      { address: '0x00401133', bytesHex: 'E8 78 02 00 00', mnemonic: 'call', operands: 'strcmp@plt', explanationAr: 'مقارنة مدخل المستخدم مع المفتاح', explanationEn: 'Compare user input with static key' },
      { address: '0x00401138', bytesHex: '85 C0', mnemonic: 'test', operands: 'eax, eax', explanationAr: 'فحص ناتج المقارنة (EAX == 0؟)', explanationEn: 'Test return code' },
      { address: '0x0040113A', bytesHex: '74 14', mnemonic: 'je', operands: '0x00401150', explanationAr: 'بايت 0x74 (JE): إذا تطابق اقفز للنجاح. هدف التعديل الثنائي!', explanationEn: 'Opcode 0x74 (JE): Target for binary patching!' }
    ],
    hintAr: 'انظر إلى البايت 0x74 عند العنوان 0x0040113A. هذا هو أمر JE (Jump if Equal). إذا استبدلته بـ 0x75 (JNE) أو 0x90 (NOP)، سيقبل البرنامج أي مدخل خاطئ!',
    hintEn: 'Look at opcode 0x74 (JE). Inverting it to 0x75 (JNE) or NOPing with 0x90 will grant access on any wrong input.',
    solutionType: 'input_key',
    validKeys: ['VORTEX-88', 'vortex-88'],
    patchableAddress: '0x0040113A',
    originalByte: '74',
    patchedByteExpected: '75',
    decompiledSnippet: `if (strcmp(input, "VORTEX-88") == 0) {
    grant_access(); // 0x00401150
} else {
    deny_access();  // 0x0040113C
}`,
    explanationAfterSolveAr: 'أحسنت! في الهندسة العكسية الكلاسيكية، يواجه المحلل هذا النمط باستمرار: إما استخراج النص الثابت "VORTEX-88" أو تعديل بايت التجميع من JE (0x74) إلى JNE (0x75) أو NOP (0x90 0x90) لجعل البرنامج يقبل أي ترخيص.',
    explanationAfterSolveEn: 'Superb! In classical reverse engineering, this dual approach defines the discipline: static string recovery versus runtime branch flipping.'
  },
  {
    id: 'challenge_02_serial_keygen',
    titleAr: 'تحدي 02: فك خوارزمية السيريال (Keygen Math Reversal)',
    titleEn: 'Challenge 02: Serial Keygen Math Reversal',
    difficulty: 'متوسط',
    objectiveAr: 'حلل الشيفرة الرياضية المسترجعة واكتشف سيريالاً صالحاً يطابق خوارزمية التحقق: يجب أن يبدأ بـ "REV-" ومجموع قيم حروفه العددية في ASCII يساوي 420.',
    objectiveEn: 'Reverse-engineer the arithmetic validation: Key must start with "REV-" followed by 3 characters whose ASCII sum matches exactly 215.',
    disassembly: [
      { address: '0x00402100', bytesHex: '81 7D F8 A4 01', mnemonic: 'cmp', operands: 'dword ptr [rbp-8], 420', explanationAr: 'مقارنة المجموع التراكمي بالأصل 420 (0x1A4)', explanationEn: 'Compare accumulated ASCII sum against 420' },
      { address: '0x00402107', bytesHex: '74 08', mnemonic: 'je', operands: 'valid_key_block', explanationAr: 'إذا طابق المجموع 420، يتم تفعيل النسخة', explanationEn: 'Jump to licensed valid block if sum == 420' }
    ],
    hintAr: 'جرب المفتاح "REV-zzz" أو "REV-kqq" أو "REV-snn" - الحروف بعد الشرطة يجب أن يكون مجموع كود ASCII الخاص بها مساوياً للقيمة المطلوبة.',
    hintEn: 'Valid key example: REV-zzz, REV-kqq, or REV-snn. Inspect character ASCII integer sums.',
    solutionType: 'input_key',
    validKeys: ['REV-zzz', 'REV-ZZZ', 'REV-kqq', 'REV-snn', 'REV-opq', 'REV-777', 'REV-999'],
    decompiledSnippet: `int validate_license(char *serial) {
    if (strncmp(serial, "REV-", 4) != 0) return 0;
    int sum = 0;
    for (int i = 0; serial[i]; i++) sum += (int)serial[i];
    return (sum == 420 || sum == 570); // Mathematical validation
}`,
    explanationAfterSolveAr: 'ممتاز! هذا يمثل صناعة مولدات المفاتيح (Keygens) التي كانت شائعة في التسعينيات وبدايات الألفية، حيث كان المهندسون يعكسون معادلة التحقق الرياضية لتوليد مفاتيح غير محدودة دون لمس الملف الثنائي.',
    explanationAfterSolveEn: 'Excellent! This exemplifies classic Keygenning: analyzing the arithmetic verification matrix to synthesize infinite valid serials mathematically.'
  },
  {
    id: 'challenge_03_antidebug_patch',
    titleAr: 'تحدي 03: تحييد آلية الهروب من التحليل (Anti-Debug Patch)',
    titleEn: 'Challenge 03: Neutralizing Anti-Debug Evasion',
    difficulty: 'تحدي قوي',
    objectiveAr: 'يقوم الملف الخبيث بالتحقق من وجود المنقح. قم بتبديل بايت القفزة JNZ (0x75) ببايت NOP (0x90) لمنعه من التدمير الذاتي وكشف رابط السيرفر المخفي.',
    objectiveEn: 'Malware sample queries PEB.BeingDebugged. Patch the JNZ branch opcode (0x75) to NOPs (0x90) to force execution into the hidden C2 string handler.',
    disassembly: [
      { address: '0x00403009', bytesHex: '0F B6 40 02', mnemonic: 'movzx', operands: 'eax, [rax+2]', explanationAr: 'قراءة حقل BeingDebugged', explanationEn: 'Read BeingDebugged flag' },
      { address: '0x0040300D', bytesHex: '85 C0', mnemonic: 'test', operands: 'eax, eax', explanationAr: 'هل المنقح نشط؟', explanationEn: 'Check if debugger active' },
      { address: '0x0040300F', bytesHex: '75 05', mnemonic: 'jnz', operands: '0x00403016', explanationAr: 'بايت 0x75: قفزة للهروب والإنهاء. قم بتعديلها إلى 0x90!', explanationEn: 'Byte 0x75: branch to evasion abort. Patch with 0x90!' }
    ],
    hintAr: 'اضغط على زر "تطبيق الباتش 0x90 NOP" لتجاوز قفزة الهروب والسماح للبرنامج بإظهار خادم القيادة والتحكم (C2).',
    hintEn: 'Click "Apply 0x90 NOP Patch" to bypass the evasive abort and expose the hidden Command & Control beacon.',
    solutionType: 'patch_byte',
    patchableAddress: '0x0040300F',
    originalByte: '75',
    patchedByteExpected: '90',
    decompiledSnippet: `if (PEB->BeingDebugged) {
    ExitProcess(0xDEAD); // Anti-debugger crash
}
// Hidden payload below:
reveal_c2_server("https://shadow-command.telemetry.dark/beacon");`,
    explanationAfterSolveAr: 'تم التحييد بنجاح! تم استبدال القفزة بتعليمة NOP (No Operation)، مما جعل المنقح يواصل التنفيذ بسلاسة واستخراج عنوان C2: https://shadow-command.telemetry.dark/beacon دون أن يكتشف البرنامج وجودك.',
    explanationAfterSolveEn: 'Neutralized! Bypassed with NOP instruction, allowing execution to continue undisturbed and exfiltrating the protected C2 URL.'
  }
];
