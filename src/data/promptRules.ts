export interface PromptRuleItem {
  id: string;
  number: number;
  category: 'core' | 'framework' | 'visual' | 'code' | 'pedagogy' | 'video';
  titleAr: string;
  titleEn: string;
  titleFr: string;
  badge: string;
  principleAr: string;
  principleEn: string;
  explanationAr: string;
  explanationEn: string;
  sourceDoc: string;
  templatePrompt: string;
}

export const promptRules: PromptRuleItem[] = [
  {
    id: 'rule-dual-execution',
    number: 1,
    category: 'core',
    titleAr: 'القاعدة الذهبية: صمم البرومبت وصمم النتيجة معاً',
    titleEn: 'The Golden Dual Execution Directive',
    titleFr: 'Règle d’Or : Concevoir le Prompt et le Résultat Ensemble',
    badge: 'القاعدة الحاكمة الأساسية',
    principleAr: 'إذا صممت البرومبت صمم النتيجة لما صممت، أي أن البرومبت فيه أمر للذكاء أن يصمم برومبت ويعطي النتيجة معاً في رد واحد.',
    principleEn: 'IF YOU DESIGN THE PROMPT, DESIGN AND DELIVER THE RESULT OF WHAT YOU DESIGNED. (Never stop at creating prompt text; deliver the engineered prompt AND its 100% finished execution output together).',
    explanationAr: 'تضمن هذه القاعدة عدم ترك المستخدم مع كود أو نص أمر خام فقط، بل يطلب الأمر من نموذج الذكاء الاصطناعي تقمّص الدور المطلوب فوراً وتقديم المخرج الواقعي المكتمل للعمل دون نواقص.',
    explanationEn: 'Guarantees the user receives both the pristine meta-prompt for future re-use and the concrete, production-ready final deliverable immediately in the same response.',
    sourceDoc: 'Daw Ai Core Standard & User Mandate',
    templatePrompt: `CRITICAL MANDATORY DIRECTIVE:
"IF YOU DESIGN THE PROMPT, DESIGN AND DELIVER THE RESULT OF WHAT YOU DESIGNED."
1. [PART 1: THE ENGINEERED PROMPT]: Provide the complete, production-grade meta-prompt.
2. [PART 2: THE COMPLETE EXECUTED RESULT]: Immediately execute the engineered prompt in full and output the complete, tangible deliverable with zero placeholders.`,
  },
  {
    id: 'rule-intent-understanding',
    number: 2,
    category: 'core',
    titleAr: 'قانون فهم النية الدقيقة دون اختلاق',
    titleEn: 'Law of Exact Intent & Zero Hallucination',
    titleFr: 'Loi de Compréhension de l’Intention & Zéro Hallucination',
    badge: 'الدقة والمصداقية',
    principleAr: 'افهم نية صاحب الطلب بدقة، ولا تغيّر هدفه أو تضف افتراضات عشوائية على أنها حقائق مؤكدة.',
    principleEn: 'Accurately interpret the user’s exact intent without altering goals or fabricating assumptions as factual truths.',
    explanationAr: 'يمنع هذا القانون تحوير فكرة المستخدم الأساسية أو ملء الفراغات بمعلومات وهمية قد تضر بصحة البحث أو الكود أو العقد القانوني.',
    explanationEn: 'Prevents drift from core user goals and enforces zero hallucination in technical, legal, and academic contexts.',
    sourceDoc: 'dawai-free/index.html & Prompt Engineering ObTIC',
    templatePrompt: `Strict Accuracy Protocol:
- Adhere strictly to the user's explicit objective.
- If a critical detail is unstated, state explicit stated assumptions or ask a single clarifying question.
- Do not fabricate false citations, metrics, or non-existent external library features.`,
  },
  {
    id: 'rule-costar-framework',
    number: 3,
    category: 'framework',
    titleAr: 'قانون إطار COSTAR الشامل لهندسة الأوامر',
    titleEn: 'The Full COSTAR Engineering Framework',
    titleFr: 'Le Cadre COSTAR Complet de Prompt Engineering',
    badge: 'ObTIC Framework',
    principleAr: 'هيكلة كل أمر وفق 6 ركائز: Context (السياق)، Objective (الهدف)، Style (الأسلوب)، Tone (النبرة)، Audience (الجمهور)، Response (صيغة الاستجابة).',
    principleEn: 'Structure every prompt around 6 fundamental pillars: Context, Objective, Style, Tone, Audience, Response.',
    explanationAr: 'إطار COSTAR المعتمد في دليل معهد ObTIC يرفع كفاءة النماذج اللغوية بنسبة تفوق 70% مقارنة بالأسئلة البسيطة غير المهيكلة.',
    explanationEn: 'Recommended framework by ObTIC and enterprise prompt engineers to maximize LLM context awareness and output precision.',
    sourceDoc: 'Prompt_Engineering_ObTIC.pdf',
    templatePrompt: `# COSTAR PROMPT BLUEPRINT
- **Context**: [Rich background details, scenario setup, and operational domain]
- **Objective**: [The specific, measurable task to be accomplished]
- **Style**: [The exact professional domain writing style, e.g., Senior Software Architect / Harvard Business Case]
- **Tone**: [Authoritative, educational, empathetic, or analytical]
- **Audience**: [Target audience expertise level and background]
- **Response**: [Specific format: Markdown, clean code, JSON schema, or executive table]`,
  },
  {
    id: 'rule-rtfc-framework',
    number: 4,
    category: 'framework',
    titleAr: 'قانون إطار RTFC للمهام التنفيذية السريعة',
    titleEn: 'The RTFC Precision Framework',
    titleFr: 'Le Cadre RTFC pour Tâches Opérationnelles',
    badge: 'RTFC Standard',
    principleAr: 'Role (الدور المتخصص) + Task (المهمة الواضحة) + Format (شكل المخرج) + Constraint (القيود الصارمة).',
    principleEn: 'Role (Specialist Persona) + Task (Explicit Mission) + Format (Output Scheme) + Constraint (Strict Boundaries).',
    explanationAr: 'يستخدم لتحديد المهام السريعة والمباشرة، وضمان عدم خروج الذكاء الاصطناعي عن حدود المهمة والقيود المحددة.',
    explanationEn: 'Optimal for programmatic generation, script writing, and tight operational deliverables requiring zero deviations.',
    sourceDoc: 'The Promptbook & dawai-free',
    templatePrompt: `[ROLE]: You are an Elite [Specific Title] with 15+ years of industry experience.
[TASK]: Execute [Specific Task] based on the input provided.
[FORMAT]: Output formatted as [Structured Markdown / TypeScript Code / Step-by-Step Table].
[CONSTRAINTS]: 
1. No filler commentary.
2. Must run without external modification.
3. Strict compliance with security and privacy standards.`,
  },
  {
    id: 'rule-nano-banana-8k',
    number: 5,
    category: 'visual',
    titleAr: 'قوانين التصوير والسينما 8K من Nano Banana',
    titleEn: 'Nano Banana 8K Visual & Cinematic Camera Optics',
    titleFr: 'Spécifications Visuelles & Optiques 8K Nano Banana',
    badge: 'Nano Banana Specs',
    principleAr: 'تحديد دقيق للموضوع (Subject)، العدسة والكاميرا (Canon EOS R5 / 85mm f/1.4 / f/1.8 / ISO 100)، الإضاءة الحجمية (Volumetric Light)، والأوامر السلبية (Negative Prompt).',
    principleEn: 'Explicit definition of Subject, Camera Optics (Canon EOS R5, 85mm lens, f/1.8, ISO 100), Volumetric Lighting, and Negative Prompt exclusion filters.',
    explanationAr: 'مستخرج من دليل nano_bnana_prompts.pdf، ويمنع ظهور صور كرتونية أو ذات ملامح مشوهة وأيدي زائدة، مع إبراز مسام البشرة الطبيعية وعمق الميدان السينمائي.',
    explanationEn: 'Extracted from nano_bnana_prompts.pdf to ensure photorealistic skin textures, cinematic depth of field, and exclusion of CGI/plastic distortions.',
    sourceDoc: 'nano_bnana_prompts.pdf',
    templatePrompt: `Subject: [Vivid description of focal character/object with authentic micro-textures].
Optics: Shot on Canon EOS R5, 85mm f/1.4 lens, aperture f/1.8, shutter 1/250s, native ISO 100, shallow depth of field with creamy circular bokeh.
Lighting: Dramatic soft three-point lighting, warm golden hour ambient rim light, subtle volumetric light rays.
Negative Prompt: (deformed limbs, extra fingers, cartoon, plastic skin, oversaturated, low quality, CGI artifacts: -1.0).`,
  },
  {
    id: 'rule-chain-of-thought',
    number: 6,
    category: 'framework',
    titleAr: 'قانون سلسلة الأفكار والاستدلال خطوة بخطوة',
    titleEn: 'Chain-of-Thought (CoT) Step-by-Step Reasoning',
    titleFr: 'Raisonnement Étape par Étape (Chain-of-Thought)',
    badge: 'التفكير المنطقي',
    principleAr: 'إلزام النموذج بالتفكير التحليلي المرحلي قبل استخلاص النتائج لتفادي الأخطاء المنطقية والرياضية والبرمجية.',
    principleEn: 'Mandate step-by-step intermediate analytical reasoning prior to synthesizing final outputs to prevent logical slips.',
    explanationAr: 'يجبر النموذج على تدقيق الخطوات الداخلية وحساب التبعات قبل الإجابة النهائية، مما يرفع الدقة البرمجية والتحليلية بنسبة هائلة.',
    explanationEn: 'Proven to dramatically reduce reasoning errors in mathematical calculations, complex software design, and multi-tier reasoning.',
    sourceDoc: 'Prompt_Engineering_ObTIC.pdf & Daw Ai Engine',
    templatePrompt: `Think step-by-step through the following analytical milestones before generating the final response:
Step 1: Deconstruct the problem requirements and identify hidden edge cases.
Step 2: Formulate the architectural strategy and evaluate alternative approaches.
Step 3: Implement the complete solution adhering to all constraints.
Step 4: Audit against performance and validation criteria.`,
  },
  {
    id: 'rule-socratic-pedagogy',
    number: 7,
    category: 'pedagogy',
    titleAr: 'ميثاق المربي السقراطي والأمانة الأكاديمية للطلاب',
    titleEn: 'Socratic Academic Tutor Protocol & Ethical AI',
    titleFr: 'Protocole du Tuteur Socratique & Éthique Académique',
    badge: 'UCLouvain & ObTIC',
    principleAr: 'عدم إعطاء حلول جاهزة للواجبات المدرسية أو الجامعية؛ تفكيك المشكلة إلى تساؤلات توجيهية وإرشاد الطالب للتحقق بأسلوب APA 7.',
    principleEn: 'Never provide copy-paste solutions to student homework; guide through diagnostic Socratic questions and APA 7 verification.',
    explanationAr: 'مستخرج من وثيقة "EXEMPLES DE PROMPTS POUR S’AIDER DE L’IA POUR RÉALISER DES DEVOIRS TRADITIONNELS". ينمي التفكير النقدي لدى الطالب دون تشجيع الانتحال العلمي.',
    explanationEn: 'Based on ethical AI research from AI Literacy Institute. Promotes intellectual growth, student agency, and academic rigor.',
    sourceDoc: 'EXEMPLES-DE-PROMPTS-POUR-SAIDER-DE-LIA.pdf',
    templatePrompt: `You are a Socratic Academic Mentor.
Guideline: Under no circumstances should you write the entire essay or homework answer for the student.
Instead:
1. Ask 2 diagnostic questions to verify their current comprehension.
2. Break down the task into digestible conceptual phases.
3. Prompt them to cite verifiable academic papers using APA 7th edition guidelines.`,
  },
  {
    id: 'rule-teacher-smart-objectives',
    number: 8,
    category: 'pedagogy',
    titleAr: 'قانون أهداف SMART والتقييم التكويني للمعلمين',
    titleEn: 'Teacher Quality Standards: SMART Objectives & Rubrics',
    titleFr: 'Normes Pédagogiques : Objectifs SMART & Grilles Critériées',
    badge: 'Enseignants & UCLouvain',
    principleAr: 'صياغة أهداف تعلم SMART قابلة للقياس، تطبيق التمايز البيداغوجي للطلبة المتعثرين والمتميزين، وتوفير سلم تقييم تحليلي.',
    principleEn: 'Formulate measurable SMART learning objectives, apply differentiated scaffolding, and generate analytical assessment rubrics.',
    explanationAr: 'مستخرج من كتاب "Prompts de qualité pour enseignants" الصادر بالتعاون مع خبراء بيداغوجيين، لضمان تخطيط دراسي متكامل ومعايير تقييم عادلة.',
    explanationEn: 'Provides teachers with pedagogical tools that respect individual learning paces, Bloom’s taxonomy, and multi-criteria rubrics.',
    sourceDoc: 'Prompts-de-qualite-pour-enseignants.pdf',
    templatePrompt: `Pedagogical Lesson & Assessment Architecture:
1. Learning Goals: Formulate 3 specific, measurable SMART objectives aligned with Bloom's Taxonomy.
2. Scaffolding: Provide differentiated pathways for remediation and advanced enrichment.
3. Evaluation: Construct a multi-level rubric with transparent descriptors for each performance tier.`,
  },
  {
    id: 'rule-clean-code-solid',
    number: 9,
    category: 'code',
    titleAr: 'قانون هندسة البرمجيات النظيفة والأمان العالي',
    titleEn: 'Clean Code, SOLID Principles & Production Security',
    titleFr: 'Clean Code, Principes SOLID & Sécurité en Production',
    badge: 'Software Architecture',
    principleAr: 'تطبيق SOLID و Clean Architecture، كتابة كود مكتمل قابل للتشغيل دون نواقص أو تعليقات // TODO، مع حماية أسرار الخادم وعدم تضمينها بالواجهة.',
    principleEn: 'Enforce SOLID & Clean Architecture, complete runnable code without lazy "// TODO" placeholders, and secure credential handling.',
    explanationAr: 'يضمن الحصول على أكواد برمجية موثوقة وعالية الأداء مع معالجة الاستثناءات واختبارات الوحدة، وتجنب تسريب مفاتيح API بالمتصفح.',
    explanationEn: 'Prevents incomplete code snippets and security vulnerabilities, ensuring modular, tested, and deployable software.',
    sourceDoc: 'ChatGPT Learning Prompt Engineering with 100+ Examples',
    templatePrompt: `Software Engineering Mandate:
- Architecture: Adhere strictly to Clean Architecture, SOLID principles, and typed interfaces.
- Completeness: Provide 100% complete, runnable code files. Never omit functions or use placeholder comments like "// rest of logic here".
- Security: Never expose private API keys in client-side bundles. Handle all async errors gracefully.`,
  },
  {
    id: 'rule-video-continuity',
    number: 10,
    category: 'video',
    titleAr: 'قانون استمرارية المشاهد والشخصيات في الفيديو (10s Pacing)',
    titleEn: 'Cinema Pacing & Character Visual Consistency Protocol',
    titleFr: 'Continuité des Plans & Ancrage Facial de Personnages',
    badge: 'Cinema Project Standard',
    principleAr: 'تقسيم الفيديو إلى لقطات محددة بزمن 10 ثوانٍ، تثبيت ملامح وجه الشخصية (Character Anchor)، وتحديد حركة الكاميرا ومسار الصوت بدقة.',
    principleEn: 'Structure video into 10-second scene pacing, anchor character facial consistency across cuts, and script camera motion precisely.',
    explanationAr: 'مستخرج من مخطط مشاريع السينما في قاعدة بيانات التطبيق (movie_projects & sequences). يمنع التحول العشوائي في وجوه الشخصيات بين لقطة وأخرى.',
    explanationEn: 'Extracted from the ArabiPrompt Cinema Projects architecture to maintain visual identity across consecutive generated clips.',
    sourceDoc: 'firebase-blueprint.json (Cinema Projects) & dawai-free',
    templatePrompt: `Cinematic Sequence Pacing (10-Second Scene Intervals):
- Master Character Anchor: [Define face structure, distinct features, attire continuity].
- Shot Breakdown: Provide timestamps (0-10s, 10-20s, 20-30s), lens focal length, dolly/orbital camera motion, dialogue subtitle, and audio SFX.`,
  },
];
