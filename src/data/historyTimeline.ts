import { HistoryMilestone } from '../types/reverseEngineering';

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: 'milestone-ww2-radar',
    year: '1944',
    period: 'الحرب العالمية الثانية',
    titleAr: 'تفكيك رادارات العدو وصواريخ V-2',
    titleEn: 'Reverse Engineering WWII Radar & V-2 Rockets',
    category: 'عسكري',
    summaryAr: 'بدايات الهندسة العكسية المنهجية حين قام المهندسون بتفكيك أجهزة رادار "فوبرتال" الألمانية وصواريخ V-2 لفهم دارات التوجيه والتغذية الراجعة.',
    summaryEn: 'Early systematic reverse engineering as allied engineers dissected captured German radar units and V-2 rockets to reconstruct guidance circuits.',
    fullStoryAr: `خلال الحرب العالمية الثانية، شكل استرداد معدات العدو نقطة تحول كبرى. عندما سقطت طائرات لوفتفافه أو بقايا صواريخ V-2، شُكلت لجان متخصصة من علماء الفيزياء والمهندسين. قاموا بتفكيك المكونات الإلكترونية والميكانيكية، وقياس سمك السبائك، ورسم مخططات الدارات الكهربائية بصورة معكوسة (Schematic Reconstruction). كشفت هذه العمليات أسرار الصمامات المفرغة وتوجيه الجيروسكوب، مما ساعد في تصميم أنظمة تشويش دفاعية مضادة.`,
    fullStoryEn: `During WWII, analyzing captured enemy hardware established rigorous reverse engineering. Teams dissected electronic guidance components and telemetry systems without access to original blueprints, reconstructing complete schematics and metallurgical properties.`,
    keyTechniqueAr: 'إعادة بناء المخططات الهندسية من العتاد الفيزيائي وفحص دارات التغذية الراجعة.',
    keyTechniqueEn: 'Physical teardown, circuit trace reconstruction, and component metallurgical profiling.',
    legalLessonAr: 'كانت محكومة بالسرية العسكرية وقوانين الحرب ولم تكن خاضعة بعد لقوانين الملكية الفكرية المدنية.',
    legalLessonEn: 'Governed by military intelligence and wartime doctrine prior to civilian copyright law.'
  },
  {
    id: 'milestone-tu4-bomber',
    year: '1947',
    period: 'بدايات الحرب الباردة',
    titleAr: 'استنساخ قاذفة B-29 السوفيتية (Tu-4)',
    titleEn: 'Tupolev Tu-4: Bolt-by-Bolt Aircraft Reverse Engineering',
    category: 'عسكري',
    summaryAr: 'أمر ستالين المهندس أندريه توبوليف باستنساخ ثلاث قاذفات أمريكية هبطت اضطرارياً في سيبيريا بدقة متناهية وصولاً إلى أرقام المقاييس الإمبراطورية.',
    summaryEn: 'Stalin ordered the exact 1:1 reverse engineering of three Boeing B-29 Superfortresses that made emergency landings in Soviet territory.',
    fullStoryAr: `في أواخر عام 1944، هبطت ثلاث قاذفات قنابل أمريكية متطورة من طراز Boeing B-29 في الأراضي السوفيتية بعد قصف اليابان. رفض الاتحاد السوفيتي إعادتها، وأصدر ستالين توجيهاً صارماً: "اصنعوا نسخة مطابقة تماماً دون تغيير مسمار واحد". تطلب هذا هندسة عكسية لأكثر من 100,000 قطعة ومحرك Wright R-3350 المكبسي، فضلاً عن تحويل القياسات من النظام الإمبراطوري (الإنش) إلى النظام المتري، وهو ما كان تحدياً صناعياً هائلاً دشن عصر الهندسة العكسية الصناعية الشاملة.`,
    fullStoryEn: `Engineers led by Andrei Tupolev completely disassembled the aircraft, measuring every part and metallurgical alloy, yielding the Tu-4 bomber and launching Soviet industrial-scale reverse engineering.`,
    keyTechniqueAr: 'الهندسة العكسية للمقاييس والمواد (Dimensional Metrology & Metallurgy Reverse Engineering).',
    keyTechniqueEn: 'High-precision dimensional metrology, material conversion, and modular tooling reproduction.',
    legalLessonAr: 'تأكيد على أن امتلاك القطعة الفيزيائية يمكن أن يفشي كامل التصميم في غياب الحماية التقنية.',
    legalLessonEn: 'Demonstrated that physical possession allows complete architecture recovery unless physically obfuscated.'
  },
  {
    id: 'milestone-clean-room-bios',
    year: '1982',
    period: 'ثورة الحواسب الشخصية',
    titleAr: 'الغرفة النظيفة واستنساخ IBM PC BIOS',
    titleEn: 'The Clean Room Design of the IBM PC BIOS',
    category: 'صناعي',
    summaryAr: 'ابتكار شركة Phoenix Technologies لطريقة "الغرفة النظيفة" (Clean Room) لفك تشفير نظام إدخال/إخراج IBM وكتابة بديل متوافق قانونياً 100% دون انتهاك حقوق النشر.',
    summaryEn: 'Phoenix Technologies pioneered the clean-room technique to engineer a legal IBM PC-compatible BIOS, giving birth to the modern PC clone industry.',
    fullStoryAr: `عندما أطلقت IBM حاسبها الشخصي عام 1981، استخدمت معالجات Intel وقطعاً تجارية، لكنها احتفظت بحقوق نشر برنامج الـ BIOS (نظام الإدخال والإخراج الأساسي). لمنع انتهاك حقوق الطبع، ابتكرت شركة Phoenix Technologies أسلوب "الغرفة النظيفة":
فريق أ (الغرفة القذرة Dirty Room): مهندسون قرؤوا كود الـ BIOS المفكك من IBM، وكتبوا فقط مواصفات وظيفية دقيقة باللغة الإنجليزية المجردة (مثال: "إذا استدعي المقاطعة 10h بقيمة AH=00h، يتم تغيير نمط الشاشة").
فريق ب (الغرفة النظيفة Clean Room): مهندسون لم يروا كود IBM قط في حياتهم، أخذوا وثيقة المواصفات وكتبوا كود تجميع جديد بالكامل ينفذ نفس الوظائف. 
أثبتت هذه التقنية قانونيتها في المحاكم وأطلقت سوق الحواسب المتوافقة كلياً (Compaq, Dell, HP).`,
    fullStoryEn: `By segregating engineers who analyzed IBM binary code from those who wrote new code from behavioral specifications, Phoenix created a legally bulletproof BIOS clone that sparked the open PC ecosystem.`,
    keyTechniqueAr: 'تقنية الغرفة النظيفة ثنائية الفريق (Two-Team Clean Room Reverse Engineering).',
    keyTechniqueEn: 'Dual-team clean-room protocol isolating functional specification from implementation.',
    legalLessonAr: 'حكمت المحاكم بأن "الوظيفة والتشغيل البيني" لا تحتكر بحقوق النشر، بينما كود التعبير الحرفي هو المحمي.',
    legalLessonEn: 'Established the legal doctrine that interoperability specifications are not copyrightable, only literal expression is.'
  },
  {
    id: 'milestone-sega-accolade',
    year: '1992',
    period: 'ألعاب الفيديو والجيل الرابع',
    titleAr: 'قضية Sega ضد Accolade وتشريع التفكيك',
    titleEn: 'Sega v. Accolade: Legalizing Disassembly for Interoperability',
    category: 'ألعاب وبرمجيات',
    summaryAr: 'حكم قضائي تاريخي قضى بأن تفكيك البرمجيات (Disassembly) لأجل تحقيق التشغيل البيني والتوافق مع منصات الألعاب يُعد استخداماً عادلاً (Fair Use) قانونياً.',
    summaryEn: 'A landmark 9th Circuit ruling determined that disassembling machine code to understand interface specifications constitutes lawful fair use.',
    fullStoryAr: `أرادت شركة Accolade صنع ألعاب تعمل على منصة Sega Genesis دون دفع رسوم ترخيص باهظة لشركة Sega. قام مهندسو Accolade بشراء أجهزة سيجا، وتوصيل محلل منطقي (Logic Analyzer) بدبابيس المعالج Motorola 68000، وفك شفرة ألعاب سيجا لاستخراج كود التحقق من الخرطوشة (TMSS - TradeMark Security System). رفعت سيجا دعوى انتهاك حقوق النشر.
قضت محكمة الاستئناف الأمريكية للدائرة التاسعة بحكم تاريخي: الهندسة العكسية عبر فك الشيفرة (Disassembly) تُعد "استخداماً عادلاً" إذا كان الهدف الوحيد هو الوصول إلى العناصر الوظيفية اللازمة للتشغيل البيني المستقل.`,
    fullStoryEn: `Accolade reverse-engineered the Genesis console to create compatible cartridges. The US Court of Appeals ruled that disassembly is permissible fair use when necessary to achieve interoperability.`,
    keyTechniqueAr: 'التحليل الديناميكي للإشارات وفك شيفرة المعالج بواسطة محلل المنطق (Bus Sniffing & Disassembly).',
    keyTechniqueEn: 'Bus protocol analysis, microcode disassembly, and security handshake identification.',
    legalLessonAr: 'تثبيت مبدأ الاستخدام العادل (Fair Use) للهندسة العكسية في صناعة البرمجيات عالمياً.',
    legalLessonEn: 'Cemented the precedent that software disassembly is protected under Fair Use for interoperability.'
  },
  {
    id: 'milestone-decss',
    year: '1999',
    period: 'عصر الوسائط الرقمية',
    titleAr: 'تفكيك تشفير أقراص DVD وخوارزمية DeCSS',
    titleEn: 'DeCSS: Reversing CSS Encryption for Linux DVD Playback',
    category: 'أمن سيبراني',
    summaryAr: 'فك المراهق النرويجي جون لي يوهانسن شفرة مشغل DVD احتكاري لكتابة DeCSS لتمكين تشغيل أقراص الأفلام على نظام لينكس مفتوح المصدر.',
    summaryEn: 'Norwegian teenager Jon Lech Johansen reverse-engineered a software DVD player binary to expose the weak CSS encryption algorithm.',
    fullStoryAr: `في أواخر التسعينات، لم تكن أقراص DVD تعمل على أنظمة لينكس لعدم توفر مشغلات مرخصة. قام الشاب جون لي يوهانسن (Jon Johansen) بتفكيك ملف تنفيذي لمشغل أقراص DVD من شركة Xing Technology، مستخدماً أدوات تصحيح الأخطاء. اكتشف أن مفتاح التشفير الرئيسي كان مخزناً في الذاكرة دون حماية، وأن خوارزمية CSS (Content Scramble System) اعتمدت على مفاتيح ضعيفة الحجم (40 بت). كتب برنامج DeCSS ونشره، مما أثار نزاعاً دولياً حول قانون الألفية الرقمية (DMCA). تمت تبرئته في النرويج لأن شراء القرص يعطي المشتري حق تشغيله على عتاده.`,
    fullStoryEn: `Disassembling a proprietary Windows DVD player exposed an unprotected master key and 40-bit cipher weakness, sparking the worldwide debate over DRM, interoperability, and freedom to analyze binaries.`,
    keyTechniqueAr: 'تحليل الذاكرة الثنائية واستخراج المفاتيح المشفرة من مقاطع البيانات الثابتة (.rdata).',
    keyTechniqueEn: 'Static string/key hunting, debugger memory inspection, and LFSR cipher analysis.',
    legalLessonAr: 'احتدام النقاش حول حرية التعبير التقني والتشفير مقابل قيود منع الالتفاف (Anti-circumvention laws).',
    legalLessonEn: 'Catalyzed global debate between consumer hardware rights and anti-circumvention provisions.'
  },
  {
    id: 'milestone-stuxnet',
    year: '2010',
    period: 'الحروب السيبرانية المعاصرة',
    titleAr: 'تشريح دودة Stuxnet وفك شيفرة أجهزة الطرد المركزي',
    titleEn: 'Stuxnet: Reverse Engineering the First Cyber Weapon',
    category: 'أمن سيبراني',
    summaryAr: 'قضى خبراء الهندسة العكسية في Symantec و Kaspersky أشهراً في تفكيك كود Stuxnet المعقد، كاشفين عن استهدافه المباشر لأجهزة Siemens PLC وأجهزة الطرد النووي.',
    summaryEn: 'Security researchers spent months reverse-engineering Stuxnet assembly, discovering its targeted manipulation of industrial Siemens PLCs.',
    fullStoryAr: `في عام 2010، ظهرت دودة غامضة كانت تعيد تشغيل أجهزة الحواسيب في محطات صناعية. تمكن باحثو الهندسة العكسية (مثل ليام أومورتشو في سيمانتيك) عبر برامج IDA Pro من تفكيك أكثر من نصف مليون سطر من لغة التجميع x86. اكتشفوا أن الدودة تحتوي على 4 ثغرات يوم-صفر (Zero-Day exploits)، وتتحقق من وجود متحكمات منطقية قابلة للبرمجة (Siemens S7-300 PLC)، وتقوم بحقن شيفرة تعبث بتردد دوران محركات الطرد المركزي مع إرسال قراءات وهمية للمشغلين. مثّل هذا الحدث تتويجاً للهندسة العكسية كأهم سلاح استخباري ودفاعي سيبراني في العالم.`,
    fullStoryEn: `Reverse engineers uncovered four zero-day vulnerabilities, driver rootkits, and PLC frequency manipulation payloads within Stuxnet, cementing binary analysis as critical national infrastructure defense.`,
    keyTechniqueAr: 'التحليل الساكن المتقدم (Deep Static Analysis)، وتتبع سلاسل الاستدعاءات المعقدة ومكافحة التمويه (Deobfuscation).',
    keyTechniqueEn: 'Static disassembly via IDA Pro, call graph tracking, multi-layer unpacking, and PLC bytecode reversing.',
    legalLessonAr: 'أصبحت الهندسة العكسية حجر الزاوية في إثبات المسؤولية الجنائية والسيبرانية للدول والجهات المهاجمة.',
    legalLessonEn: 'Proved reverse engineering is the vital instrument for cyber attribution and forensic accountability.'
  },
  {
    id: 'milestone-wannacry',
    year: '2017',
    period: 'الإنقاذ عبر الهندسة العكسية',
    titleAr: 'إيقاف فدية WannaCry عبر تفكيك الشيفرة واستخراج الـ Kill-Switch',
    titleEn: 'WannaCry: Halting Global Ransomware via Kill-Switch Discovery',
    category: 'أمن سيبراني',
    summaryAr: 'تمكن الباحث ماركوس هاتشينز (MalwareTech) خلال ساعات من تفكيك عينة برمجية الفدية WannaCry واكتشاف نطاق ويب لم يسجل كان يُستخدم كمفتاح إيقاف ذاتي.',
    summaryEn: 'Security researcher Marcus Hutchins disassembled a live WannaCry ransomware sample and registered an unregistered sinkhole domain, neutralizing the outbreak.',
    fullStoryAr: `في مايو 2017، اجتاحت برمجية WannaCry أكثر من 200 ألف حاسوب في 150 دولة، معطلة مستشفيات بريطانيا ومحطات القطار العالمية مستغلة ثغرة EternalBlue. حصل الباحث الشاب ماركوس هاتشينز على عينة ثنائية وفتحها في بيئة تحليل منعزلة (Sandbox) ومفكك شفرات. أثناء فحص نداءات الشبكة (InternetOpenUrlA في Assembly)، لاحظ أن البرنامج يتحقق مما إذا كان نطاق طويل عشوائي (.com) يستجيب. إذا كان النطاق غير مسجل يكمل التشفير، أما إذا رد النطاق فإنه يتوقف (آلية لاكتشاف بيئات التحليل الافتراضية). قام بتسجيل النطاق مقابل 10 دولارات، فأنقذ مئات الآلاف من الأجهزة من التشفير.`,
    fullStoryEn: `By examining imports and branch conditions in x86 disassembly, Hutchins spotted an anti-sandbox domain check. Registering that sinkhole domain halted the infection worldwide.`,
    keyTechniqueAr: 'تحليل الواردات واستدعاءات واجهات Win32 API والتحكم بالتدفق الشرطي في Assembly.',
    keyTechniqueEn: 'Win32 API import auditing, conditional jump analysis, and dynamic network sinkholing.',
    legalLessonAr: 'توضيح القيمة الإنسانية والعملية الفورية لمهارات الهندسة العكسية الدفاعية السريعة.',
    legalLessonEn: 'Highlighted the indispensable value of immediate defensive reverse engineering in halting cyber disasters.'
  }
];

export const CORE_PRINCIPLES = [
  {
    titleAr: 'ما هي الهندسة العكسية؟',
    titleEn: 'What is Reverse Engineering?',
    contentAr: 'الهندسة العكسية (Reverse Engineering) هي عملية استنتاج المبادئ التصميمية والمنطق البرمجي لنظام أو برنامج ثنائي، انطلاقاً من المنتج النهائي المترجم (Machine Code أو Bytecode) ودون توفر الشيفرة المصدرية الأصلية.',
    contentEn: 'Reverse Engineering is the process of analyzing a software system to identify its components, interrelationships, and recreate high-level design representations from binary artifacts.'
  },
  {
    titleAr: 'التفكيك (Disassembly) مقابل إعادة التجميع (Decompilation)',
    titleEn: 'Disassembly vs Decompilation',
    contentAr: 'التفكيك يحول البايتات الثنائية (Machine Code مثل 0x55 0x48) إلى أوامر لغة التجميع الحرفية (Assembly مثل push rbp; mov rbp, rsp). أما إلغاء التجميع (Decompiler مثل Hex-Rays أو Ghidra) فيقوم بتحليل تدفق البيانات وأنواع المتغيرات لإعادة بناء شيفرة شبه سي (Pseudo-C) عالية المستوى.',
    contentEn: 'Disassembly converts raw machine bytes into human-readable assembly instructions. Decompilation reconstructs high-level procedural pseudo-code from binary control flow.'
  },
  {
    titleAr: 'التحليل الساكن مقابل التحليل الديناميكي',
    titleEn: 'Static vs Dynamic Analysis',
    contentAr: 'التحليل الساكن (Static Analysis) يفحص الملف الثنائي دون تشغيله (عبر قراءة الهيدرز وتفكيك التعليمات ورسم المخطط البياني للتحكم CFG). التحليل الديناميكي (Dynamic Analysis) يقوم بتشغيل البرنامج داخل بيئة معزولة (Debugger / Sandbox) ومراقبة سجلات المعالج، المكدس، واستدعاءات النظام في الوقت الفعلي.',
    contentEn: 'Static analysis studies the code without execution. Dynamic analysis observes runtime behavior, memory mutations, and system API calls inside a debugger.'
  },
  {
    titleAr: 'الحدود القانونية والأخلاقية (Ethics & Law)',
    titleEn: 'Legal & Ethical Framework',
    contentAr: 'تُعد الهندسة العكسية قانونية وأخلاقية عندما تهدف إلى: سد الثغرات الأمنية (Security Auditing)، تحليل البرمجيات الضارة (Malware Analysis)، تحقيق التوافق والتشغيل البيني (Interoperability)، أو استعادة برمجيات قديمة مهجورة. بينما يُمنع استخدامها لكسر حقوق الملكية الفكرية وسرقة الأسرار التجارية لأغراض تجارية غير مشروعة.',
    contentEn: 'Lawful when conducted for security research, malware defense, interoperability, and education; prohibited when used for piracy or industrial espionage.'
  }
];
