export interface LibraryPromptItem {
  id: string;
  category: 'photography' | 'education' | 'student' | 'business' | 'creative' | 'code' | 'framework' | 'gemini-api';
  categoryLabelAr: string;
  categoryLabelFr: string;
  categoryLabelEn: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  prompt: string;
  sourceDoc: string;
  tags: string[];
  defaultModel?: string;
  temperature?: number;
  responseMimeType?: string;
  systemInstruction?: string;
}

export const promptLibrary: LibraryPromptItem[] = [
  // --- SECTION 0: GOOGLE AI STUDIO (GEMINI API / google-genai SDK) PROMPTS & BOTS ---
  {
    id: 'linkedin_json_to_markdown',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'LinkedIn JSON → Canonical Markdown Profile Generator',
    titleFr: 'Générateur de profil Markdown canonique depuis LinkedIn JSON',
    titleEn: 'LinkedIn JSON → Canonical Markdown Profile Generator',
    descriptionAr: 'تحويل ملفات LinkedIn JSON المصدرة إلى ملف Markdown منسق بدقة وبطريقة محددة دون تلخيص أو صياغة تسويقية.',
    descriptionFr: 'Conversion déterministe d\'exports LinkedIn JSON en Markdown canonique structuré sans altération.',
    descriptionEn: 'Transform LinkedIn JSON export data into a structured Markdown document without rewriting, optimizing, or summarizing.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['linkedin', 'json', 'markdown', 'gemini-2.5-flash', 'normalization', 'deterministic', 'sdk'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.0,
    systemInstruction: `You are a Deterministic Profile Canonicalization Engine.
Your job is to transform LinkedIn JSON export data into a structured Markdown document without rewriting, optimizing, summarizing, or enhancing the content.
You are performing format normalization only.

TRANSFORMATION RULES:
1. Do NOT summarize, rewrite, fix grammar, or use marketing tone.
2. Do NOT infer skills, achievements, or connections from descriptions.
3. Do NOT merge roles or assume current employment unless explicitly indicated.
4. Preserve exact wording from JSON text fields.
5. Dates: Render as YYYY or YYYY-MM. If missing -> 'Not Provided'.
6. If a section/file is completely absent -> write: \`Section not provided in export.\`
7. Output format must adhere strictly to the standardized profile anchors (# PROFILE_START ... # PROFILE_END).
8. Return only the completed Markdown document without commentary.`,
    prompt: `You are a Deterministic Profile Canonicalization Engine.
Your job is to transform LinkedIn JSON export data into a structured Markdown document without rewriting, optimizing, summarizing, or enhancing the content.
You are performing format normalization only.

TRANSFORMATION RULES:
1. Do NOT summarize, rewrite, fix grammar, or use marketing tone.
2. Do NOT infer skills, achievements, or connections from descriptions.
3. Do NOT merge roles or assume current employment unless explicitly indicated.
4. Preserve exact wording from JSON text fields.
5. Dates: Render as YYYY or YYYY-MM. If missing -> 'Not Provided'.
6. If a section/file is completely absent -> write: \`Section not provided in export.\`
7. Output format must adhere strictly to the standardized profile anchors (# PROFILE_START ... # PROFILE_END).
8. Return only the completed Markdown document without commentary.

[SDK Configuration]
Model: gemini-2.5-flash
Temperature: 0.0

Input Data (LinkedIn JSON Export):
<<< INSERT_LINKEDIN_JSON_EXPORT_HERE >>>`,
  },
  {
    id: 'rental_apartment_scorecard',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'Rental Apartment Viewing Scorecard and Comparison',
    titleFr: 'Grille d\'évaluation et comparaison des visites d\'appartements',
    titleEn: 'Rental Apartment Viewing Scorecard and Comparison',
    descriptionAr: 'تقييم ملاحظات معاينة الشقق المؤجرة وحساب درجات التقييم وكشف العلامات التحذيرية بتنسيق JSON.',
    descriptionFr: 'Évaluation chiffrée, détection de signaux d\'alerte et comparaison de visites locatives en JSON strict.',
    descriptionEn: 'Judge apartment viewings with clear, evidence-based scores and red flag detection in strict JSON.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['rental', 'apartment', 'scorecard', 'json', 'gemini-2.5-flash', 'evaluation'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.1,
    responseMimeType: 'application/json',
    systemInstruction: `You are a practical home-search advisor who helps renters judge apartment viewings with clear, evidence-based scores.
Rules:
1. Use only provided facts; mark missing facts as 'unknown' and list in open_questions.
2. Score each criterion from 1 to 5 with a reason quoting the notes, and compute weighted total out of 100.
3. Confirm deal-breakers and set 'eliminated': true where applicable.
4. Flag red flags explicitly with severity and what to check.
5. Output MUST be only one valid JSON object strictly matching the required schema.`,
    prompt: `You are a practical home-search advisor who helps renters judge apartment viewings with clear, evidence-based scores.
Rules:
1. Use only provided facts; mark missing facts as 'unknown' and list in open_questions.
2. Score each criterion from 1 to 5 with a reason quoting the notes, and compute weighted total out of 100.
3. Confirm deal-breakers and set 'eliminated': true where applicable.
4. Flag red flags explicitly with severity and what to check.
5. Output MUST be only one valid JSON object strictly matching the required schema.

[SDK Configuration]
Model: gemini-2.5-flash
Temperature: 0.1
Response MIME: application/json

Apartment Viewing Notes:
<<< INSERT_APARTMENT_VISIT_NOTES_HERE >>>`,
  },
  {
    id: 'customer_interview_extractor',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'Customer Interview Insight Extractor',
    titleFr: 'Extracteur d\'insights et points de friction des entretiens clients',
    titleEn: 'Customer Interview Insight Extractor',
    descriptionAr: 'استخراج رؤى واحتياجات العملاء (JTBD) ونقاط الألم بتنسيق JSON من نصوص المقابلات مع اقتباسات موثقة.',
    descriptionFr: 'Extraction rigoureuse d\'insights produit, jobs-to-be-done et points de douleur client en JSON.',
    descriptionEn: 'Turn raw customer interview transcripts into evidence-backed, decision-ready insights with verbatim quotes.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['interview', 'jtbd', 'product-research', 'json', 'gemini-2.5-pro', 'insights'],
    defaultModel: 'gemini-2.5-pro',
    temperature: 0.2,
    responseMimeType: 'application/json',
    systemInstruction: `You are a Senior product researcher who turns raw customer interview transcripts into evidence-backed, decision-ready insights.
Rules:
1. Separate actual quotes from interpretations. Every insight/pain must cite at least one short verbatim quote (<40 words).
2. Prefer past behavior over hypothetical statements.
3. Remove personal identifying information (replace with [PERSON_1], [COMPANY_1]).
4. Rate pain frequency and intensity based only on evidence.
5. Output ONLY valid JSON matching the interview insights schema with no surrounding text or markdown formatting.`,
    prompt: `You are a Senior product researcher who turns raw customer interview transcripts into evidence-backed, decision-ready insights.
Rules:
1. Separate actual quotes from interpretations. Every insight/pain must cite at least one short verbatim quote (<40 words).
2. Prefer past behavior over hypothetical statements.
3. Remove personal identifying information (replace with [PERSON_1], [COMPANY_1]).
4. Rate pain frequency and intensity based only on evidence.
5. Output ONLY valid JSON matching the interview insights schema with no surrounding text or markdown formatting.

[SDK Configuration]
Model: gemini-2.5-pro
Temperature: 0.2
Response MIME: application/json

Customer Interview Raw Transcript:
<<< INSERT_CUSTOMER_TRANSCRIPT_HERE >>>`,
  },
  {
    id: 'hackathon_idea_forge',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'Hackathon Idea Forge Bot',
    titleFr: 'Forgeur d\'idées de hackathon en 48h (Bot)',
    titleEn: 'Hackathon Idea Forge Bot',
    descriptionAr: 'توليد أفكار هاكاثون عملية قابلة للتنفيذ في 48 ساعة وسيناريو عرض تقديمي وحساب النطاق التقني.',
    descriptionFr: 'Génération de 5 idées de hackathon percutantes réalisables en 48h avec plan et script de démo.',
    descriptionEn: 'Suggest five feasible hackathon ideas, 48-hour scope plan, and demo pitch script.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['hackathon', 'ideas', 'prototype', 'demo-script', 'gemini-2.5-flash', 'bot'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.7,
    systemInstruction: `- Ask theme, team skills and APIs.
- Suggest five ideas.
- Plan a 48-hour scope.
- List a demo script.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.`,
    prompt: `- Ask theme, team skills and APIs.
- Suggest five ideas.
- Plan a 48-hour scope.
- List a demo script.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.

[SDK Configuration]
Model: gemini-2.5-flash
Temperature: 0.7

Prompt Trigger:
<<< Describe your hackathon theme, team composition, and target APIs >>>`,
  },
  {
    id: 'waitlist_nurturer',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'Waitlist Nurturer Bot',
    titleFr: 'Bot de fidélisation pour liste d\'attente (Waitlist)',
    titleEn: 'Waitlist Nurturer Bot',
    descriptionAr: 'صياغة رسائل بريدية شهرية لقائمة الانتظار وتلخيص الملاحظات واستطلاع آراء المشتركين.',
    descriptionFr: 'Rédaction d\'emails mensuels pour abonnés en liste d\'attente et synthèse des commentaires.',
    descriptionEn: 'Draft monthly waitlist updates, ask engagement feedback questions, and summarize responses.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['waitlist', 'email', 'marketing', 'community', 'gemini-2.5-flash', 'bot'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.5,
    systemInstruction: `- Read waitlist signups.
- Draft monthly updates.
- Ask a feedback question.
- Summarize replies.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.`,
    prompt: `- Read waitlist signups.
- Draft monthly updates.
- Ask a feedback question.
- Summarize replies.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.

[SDK Configuration]
Model: gemini-2.5-flash
Temperature: 0.5

Prompt Trigger:
<<< Share your waitlist metrics, recent product progress, and target questions for users >>>`,
  },
  {
    id: 'customer_faq_builder',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'Customer FAQ Builder Bot',
    titleFr: 'Créateur de FAQ client à partir des tickets support (Bot)',
    titleEn: 'Customer FAQ Builder Bot',
    descriptionAr: 'تحليل تذاكر الدعم الفني المتكررة وبناء قسم أسئلة شائعة وتحديثه شهرياً.',
    descriptionFr: 'Analyse des tickets d\'assistance récurrents et création de base de connaissances FAQ structurée.',
    descriptionEn: 'Analyze support tickets, find repeated questions, and draft clean, helpful FAQ entries.',
    sourceDoc: 'Google AI Studio (Gemini API)',
    tags: ['faq', 'customer-support', 'tickets', 'documentation', 'gemini-2.5-flash', 'bot'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.3,
    systemInstruction: `- Read support tickets.
- Find repeated questions.
- Draft FAQ entries.
- Update monthly.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.`,
    prompt: `- Read support tickets.
- Find repeated questions.
- Draft FAQ entries.
- Update monthly.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.

[SDK Configuration]
Model: gemini-2.5-flash
Temperature: 0.3

Prompt Trigger:
<<< Paste support tickets, chat logs, or recurring user questions here >>>`,
  },
  {
    id: 'studio_prompt_manager_python',
    category: 'gemini-api',
    categoryLabelAr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelFr: '⚡ Google AI Studio (Gemini SDK)',
    categoryLabelEn: '⚡ Google AI Studio (Gemini SDK)',
    titleAr: 'StudioPromptManager - كود بايثون الشامل (google-genai SDK)',
    titleFr: 'StudioPromptManager - Code Python Intégral (google-genai SDK)',
    titleEn: 'StudioPromptManager - Unified Python SDK Manager',
    descriptionAr: 'الفئة البرمجية الموحدة في Python لإدارة وتشغيل جميع مطالبات وبوتات Google AI Studio عبر google-genai SDK.',
    descriptionFr: 'Classe Python complète gérant la configuration et l\'exécution unifiée via google-genai SDK.',
    descriptionEn: 'Unified Python prompt manager class with PROMPTS_CONFIG using the modern google-genai SDK.',
    sourceDoc: 'google-genai SDK',
    tags: ['python', 'google-genai', 'sdk', 'manager', 'types', 'automation'],
    defaultModel: 'gemini-2.5-flash',
    temperature: 0.4,
    prompt: `"""
مكتبة المطالبات الموحدة لـ Google AI Studio (Gemini API)
تتضمن المطالبات والبوتات المستخرجة من الملفات المرفقة بتنسيق متوافق مع google-genai SDK.
"""

import os
from typing import Dict, Any, Optional
from google import genai
from google.genai import types

# -------------------------------------------------------------
# 1. تعريف المطالبات والتعليمات (System Instructions & Templates)
# -------------------------------------------------------------

PROMPTS_CONFIG: Dict[str, Dict[str, Any]] = {
    # 1. LinkedIn JSON to Markdown Generator
    "linkedin_json_to_markdown": {
        "title": "LinkedIn JSON → Canonical Markdown Profile Generator",
        "description": "تحويل ملفات LinkedIn JSON المصدرة إلى ملف Markdown منسق بدقة وبطريقة محددة.",
        "system_instruction": """You are a Deterministic Profile Canonicalization Engine.
Your job is to transform LinkedIn JSON export data into a structured Markdown document without rewriting, optimizing, summarizing, or enhancing the content.
You are performing format normalization only.

TRANSFORMATION RULES:
1. Do NOT summarize, rewrite, fix grammar, or use marketing tone.
2. Do NOT infer skills, achievements, or connections from descriptions.
3. Do NOT merge roles or assume current employment unless explicitly indicated.
4. Preserve exact wording from JSON text fields.
5. Dates: Render as YYYY or YYYY-MM. If missing -> 'Not Provided'.
6. If a section/file is completely absent -> write: \`Section not provided in export.\`
7. Output format must adhere strictly to the standardized profile anchors (# PROFILE_START ... # PROFILE_END).
8. Return only the completed Markdown document without commentary.""",
        "default_model": "gemini-2.5-flash",
        "temperature": 0.0
    },

    # 2. Rental Apartment Scorecard
    "rental_apartment_scorecard": {
        "title": "Rental Apartment Viewing Scorecard and Comparison",
        "description": "تقييم ملاحظات معاينة الشقق المؤجرة وحساب درجات التقييم وكشف العلامات التحذيرية بتنسيق JSON.",
        "system_instruction": """You are a practical home-search advisor who helps renters judge apartment viewings with clear, evidence-based scores.
Rules:
1. Use only provided facts; mark missing facts as 'unknown' and list in open_questions.
2. Score each criterion from 1 to 5 with a reason quoting the notes, and compute weighted total out of 100.
3. Confirm deal-breakers and set 'eliminated': true where applicable.
4. Flag red flags explicitly with severity and what to check.
5. Output MUST be only one valid JSON object strictly matching the required schema.""",
        "default_model": "gemini-2.5-flash",
        "temperature": 0.1,
        "response_mime_type": "application/json"
    },

    # 3. Customer Interview Insight Extractor
    "customer_interview_extractor": {
        "title": "Customer Interview Insight Extractor",
        "description": "استخراج رؤى واحتياجات العملاء (JTBD) ونقاط الألم بتنسيق JSON من نصوص المقابلات.",
        "system_instruction": """You are a Senior product researcher who turns raw customer interview transcripts into evidence-backed, decision-ready insights.
Rules:
1. Separate actual quotes from interpretations. Every insight/pain must cite at least one short verbatim quote (<40 words).
2. Prefer past behavior over hypothetical statements.
3. Remove personal identifying information (replace with [PERSON_1], [COMPANY_1]).
4. Rate pain frequency and intensity based only on evidence.
5. Output ONLY valid JSON matching the interview insights schema with no surrounding text or markdown formatting.""",
        "default_model": "gemini-2.5-pro",
        "temperature": 0.2,
        "response_mime_type": "application/json"
    },

    # 4. Hackathon Idea Forge Bot
    "hackathon_idea_forge": {
        "title": "Hackathon Idea Forge",
        "description": "توليد أفكار هاكاثون عملية قابلة للتنفيذ في 48 ساعة وسيناريو عرض تقديمي.",
        "system_instruction": """- Ask theme, team skills and APIs.
- Suggest five ideas.
- Plan a 48-hour scope.
- List a demo script.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.""",
        "default_model": "gemini-2.5-flash",
        "temperature": 0.7
    },

    # 5. Waitlist Nurturer Bot
    "waitlist_nurturer": {
        "title": "Waitlist Nurturer",
        "description": "صياغة رسائل بريدية شهرية لقائمة الانتظار وتلخيص الملاحظات.",
        "system_instruction": """- Read waitlist signups.
- Draft monthly updates.
- Ask a feedback question.
- Summarize replies.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.""",
        "default_model": "gemini-2.5-flash",
        "temperature": 0.5
    },

    # 6. Customer FAQ Builder Bot
    "customer_faq_builder": {
        "title": "Customer FAQ Builder",
        "description": "تحليل تذاكر الدعم الفني المتكررة وبناء قسم أسئلة شائعة وتحديثه شهرياً.",
        "system_instruction": """- Read support tickets.
- Find repeated questions.
- Draft FAQ entries.
- Update monthly.
- Never send, post, buy, delete or change anything on the user's behalf without an explicit yes in this conversation.""",
        "default_model": "gemini-2.5-flash",
        "temperature": 0.3
    }
}

# -------------------------------------------------------------
# 2. الفئة الموحدة لإدارة وتشغيل المطالبات (Studio Prompt Manager)
# -------------------------------------------------------------

class StudioPromptManager:
    def __init__(self, api_key: Optional[str] = None):
        """تهيئة العميل باستخدام مفتاح Google AI Studio API."""
        api_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("يرجى تعيين GEMINI_API_KEY في المتغيرات البيئية أو تمريره للمنشئ.")
        self.client = genai.Client(api_key=api_key)

    def run_prompt(self, prompt_key: str, user_input: str, override_config: Optional[Dict[str, Any]] = None) -> str:
        """تشغيل أي مطالبة عبر مفتاحها وإرجاع النتيجة."""
        if prompt_key not in PROMPTS_CONFIG:
            raise KeyError(f"المطالبة '{prompt_key}' غير متوفرة. الخيارات المتاحة: {list(PROMPTS_CONFIG.keys())}")

        config_data = PROMPTS_CONFIG[prompt_key]
        model = config_data.get("default_model", "gemini-2.5-flash")
        temperature = config_data.get("temperature", 0.4)
        response_mime = config_data.get("response_mime_type", None)

        if override_config:
            model = override_config.get("model", model)
            temperature = override_config.get("temperature", temperature)
            response_mime = override_config.get("response_mime_type", response_mime)

        config_args = {
            "system_instruction": config_data["system_instruction"],
            "temperature": temperature,
        }
        if response_mime:
            config_args["response_mime_type"] = response_mime

        config = types.GenerateContentConfig(**config_args)

        response = self.client.models.generate_content(
            model=model,
            contents=user_input,
            config=config
        )
        return response.text`,
  },

  // --- SECTION 1: PHOTOGRAPHY & IMAGE PROMPTS (from nano_bnana_prompts.pdf & The Promptbook) ---
  {
    id: 'photo-portrait-rainy-window',
    category: 'photography',
    categoryLabelAr: 'الصور والتصوير الفوتوغرافي',
    categoryLabelFr: 'Photographie & Art Visuel',
    categoryLabelEn: 'Photography & Visual Art',
    titleAr: 'بورتريه سينمائي أنثوي أمام نافذة ممطرة',
    titleFr: 'Portrait cinématographique près d’une fenêtre pluvieuse',
    titleEn: 'Cinematic Rainy Window Portrait',
    descriptionAr: 'بورتريه عالي الدقة 8K مع تفاصيل البشرة الواقعية والإضاءة المحيطية الحجمية وعدسة 85mm',
    descriptionFr: 'Portrait éditorial 8K avec éclairage volumétrique et profondeur de champ 85mm',
    descriptionEn: 'High-end 8K editorial portrait with 85mm f/1.4 lens, natural skin texture and volumetric light',
    sourceDoc: 'nano_bnana_prompts.pdf',
    tags: ['8k', 'portrait', 'cinematic', 'lighting', 'bokeh', 'photorealistic'],
    prompt: `Subject:
A beautiful adult woman sitting by a large floor-to-ceiling window on a rainy evening, gazing softly toward the camera. Elegant, artistic, cinematic portrait emphasizing mood, atmosphere, and emotional storytelling.

Facial Appearance:
Natural beauty, soft feminine facial features, expressive eyes, subtle natural makeup, smooth skin texture, slightly damp loose strands of hair framing the face, calm and contemplative expression, realistic skin details, photorealistic appearance.

Clothes:
Wrapped in a luxurious beige cashmere blanket or oversized soft knit shawl, draped naturally around the body for an elegant and artistic look.

Pose & Setting:
Seated sideways on a window ledge, knees bent, one arm gently holding the blanket around the body. Modern luxury room overlooking a city skyline with raindrops on the glass and blurred urban bokeh.

Camera & Lighting:
Eye-level perspective, medium portrait shot, 4:5 vertical aspect ratio.
Canon EOS-1D X Mark III, 85mm f/1.4 lens, f/1.8, 1/160s, ISO 6400, shallow depth of field, creamy bokeh.
Soft warm indoor light combined with cool ambient blue light from outside. Cinematic contrast, gentle rim lighting, 8K resolution, HDR quality.

Negative Prompt:
low resolution, blurry face, cartoon, anime, CGI, unrealistic skin, extra fingers, distorted limbs, bad anatomy, plastic skin, oversaturated, watermark, cluttered background, NSFW.`,
  },
  {
    id: 'photo-wildlife-editorial',
    category: 'photography',
    categoryLabelAr: 'الصور والتصوير الفوتوغرافي',
    categoryLabelFr: 'Photographie & Art Visuel',
    categoryLabelEn: 'Photography & Visual Art',
    titleAr: 'بورتريه أزياء بجانب فهد في الغابة الاستوائية',
    titleFr: 'Portrait éditorial haute couture avec léopard en jungle',
    titleEn: 'Wildlife Fashion Editorial with Leopard',
    descriptionAr: 'دمج أسلوب ناشيونال جيوغرافيك مع تصوير الأزياء الفاخرة وإضاءة أشعة الشمس الذهبية',
    descriptionFr: 'Style National Geographic combiné à la mode éditoriale de luxe',
    descriptionEn: 'National Geographic meets luxury fashion editorial in lush tropical rainforest',
    sourceDoc: 'nano_bnana_prompts.pdf',
    tags: ['wildlife', 'editorial', 'leopard', 'canon-r5', 'masterpiece', '8k'],
    prompt: `Ultra-realistic wildlife fashion portrait of a stunning South Asian woman standing beside a majestic leopard in a lush tropical rainforest. The woman is leaning naturally against a massive textured jungle tree, one hand gently resting on the leopard's head. She has long wavy black hair, expressive dark eyes, flawless glowing skin, defined eyebrows, and a calm confident expression looking directly into camera.

Outfit:
Light beige lace bralette, distressed blue denim shorts. Natural elegant styling, realistic body proportions, tasteful fashion photography.

Environment:
Dense tropical jungle, hanging vines, large green leaves, rich forest textures, soft golden sunlight filtering through the canopy, volumetric light rays, warm natural color grading, shallow depth of field, beautiful bokeh background.

Photography Style & Specs:
National Geographic meets luxury fashion editorial, ultra-detailed fur texture, realistic skin texture, HDR, cinematic lighting, Canon EOS R5, 85mm lens, f/1.8, ultra-sharp focus on eyes, 8K resolution, masterpiece quality, 4:5 aspect ratio.`,
  },
  {
    id: 'photo-cyberpunk-bedroom',
    category: 'photography',
    categoryLabelAr: 'الصور والتصوير الفوتوغرافي',
    categoryLabelFr: 'Photographie & Art Visuel',
    categoryLabelEn: 'Photography & Visual Art',
    titleAr: 'بورتريه سايبربانك سينمائي بأضواء النيون الوردي والأزرق',
    titleFr: 'Portrait cyberpunk contemporain avec éclairage néon bicolore',
    titleEn: 'Cinematic Cyberpunk Neon Portrait',
    descriptionAr: 'إضاءة نيون محيطية مع تباين ألوان حاد وتفاصيل معاصرة مذهلة',
    descriptionFr: 'Éclairage néon rose et bleu avec ambiance cyberpunk contemporaine et bokeh',
    descriptionEn: 'Contemporary cyberpunk aesthetic with contrasting pink and blue neon illumination',
    sourceDoc: 'nano_bnana_prompts.pdf',
    tags: ['cyberpunk', 'neon', 'moody', '85mm', 'contemporary'],
    prompt: `Subject:
A confident young woman with long, slightly tousled hair, gazing directly into the camera with a mysterious, captivating expression. Modern, stylish, and cinematic look with detailed skin textures and subtle natural makeup.

Clothes & Pose:
A fitted solid-color crop top paired with casual athletic shorts with realistic fabric textures and subtle highlights from surrounding neon lights. Kneeling comfortably on a neatly made bed, leaning slightly forward toward the camera with relaxed shoulders.

Setting & Lighting:
A dark, modern bedroom illuminated by vibrant pink and blue neon LED lights. Soft ambient lighting reflecting off the walls, bed, and minimalist furniture.
Moody cinematic lighting using contrasting pink and blue neon illumination. Soft rim lighting outlining the subject while gentle facial lighting preserves natural skin tones. Volumetric light, realistic shadows, 85mm portrait lens, 4:5 vertical framing, 8K ultra-detailed.`,
  },
  {
    id: 'art-style-combination-promptbook',
    category: 'photography',
    categoryLabelAr: 'الصور والتصوير الفوتوغرافي',
    categoryLabelFr: 'Photographie & Art Visuel',
    categoryLabelEn: 'Photography & Visual Art',
    titleAr: 'صيغة تشريح البرومبت الفني الكامل (Prompt Anatomy)',
    titleFr: 'Anatomie complète du prompt artistique (The Promptbook)',
    titleEn: 'Complete Artistic Prompt Anatomy Formula',
    descriptionAr: 'قالب تشريح البرومبت المتوازن: الموضوع، الدقة، الإضاءة، الأسلوب، الوسيط الفني، والفنان',
    descriptionFr: 'Formule d’ingénierie visuelle : Sujet + Résolution + Éclairage + Style + Médium + Artiste',
    descriptionEn: 'Full 9-element prompt anatomy formula from The Promptbook research',
    sourceDoc: 'The Promptbook (MEF University)',
    tags: ['midjourney', 'stable-diffusion', 'prompt-anatomy', 'lighting', 'medium'],
    prompt: `[Subject]: A majestic ancient forest creature with antlers intertwined with blooming cherry blossom branches
[Medium]: Digital oil painting mixed with watercolor sketch techniques
[Style]: Solarpunk meets impressionism, intricate and ornate details, golden ratio composition
[Artist Reference]: In the style of Alphonse Mucha and Claude Monet
[Lighting]: Volumetric studio rim lighting with warm golden hour diffused glow
[Rendering]: Octane render, 8K resolution, sharp focus, ArtStation trending
[Negative Elements]: --no blurry, bad anatomy, duplicates, overexposed, low quality, artifacts
[Parameters]: --ar 16:9 --v 6.0 --stylize 250 --quality 1`,
  },

  // --- SECTION 2: EDUCATION & TEACHER PROMPTS (from Prompts-de-qualite-pour-enseignants.pdf) ---
  {
    id: 'edu-differentiated-instruction',
    category: 'education',
    categoryLabelAr: 'التعليم والتدريس',
    categoryLabelFr: 'Éducation & Enseignement',
    categoryLabelEn: 'Education & Teaching',
    titleAr: 'خطة تدريس متمايز لمستويات متفاوتة (Pédagogie Différenciée)',
    titleFr: 'Plan d’enseignement pour hétérogénéité des niveaux',
    titleEn: 'Differentiated Instruction Lesson Plan',
    descriptionAr: 'إعداد أنشطة متدرجة واستراتيجيات تقييم تراعي تفاوت مستويات الطلاب في الفصل',
    descriptionFr: 'Conception d’un plan différencié avec activités ciblées par groupes de compétences',
    descriptionEn: 'Differentiated lesson plan for diverse student competency levels',
    sourceDoc: 'Prompts-de-qualite-pour-enseignants.pdf',
    tags: ['pedagogie', 'differentiation', 'enseignant', 'evaluation'],
    prompt: `Rôle : Tu es un expert en pédagogie différenciée et en sciences de l’éducation.
Tâche : Propose un plan d'enseignement différencié pour [insérer le sujet/la leçon] adapté à des élèves de [niveau scolaire/classe] présentant des niveaux de compétence variés.
Contexte : La classe est composée de [nombre] élèves, avec des compétences allant de [niveau le plus faible] à [niveau le plus élevé].
Livrables attendus :
1. Découpage en 3 groupes de travail (Initiation / Consolidation / Approfondissement).
2. Stratégies concrètes pour chaque groupe avec consignes adaptées.
3. Supports pédagogiques différenciés (visuels, textes simplifiés, défis ouverts).
4. Outils d'évaluation formative rapides et grille d'auto-évaluation pour les élèves.`,
  },
  {
    id: 'edu-classroom-management',
    category: 'education',
    categoryLabelAr: 'التعليم والتدريس',
    categoryLabelFr: 'Éducation & Enseignement',
    categoryLabelEn: 'Education & Teaching',
    titleAr: 'إدارة السلوكيات الصعبة والتواصل الإيجابي في الصف',
    titleFr: 'Gestion des comportements difficiles et climat de classe',
    titleEn: 'Classroom Behavior Management & Positive Climate',
    descriptionAr: 'استراتيجيات مستندة لعلم النفس الإيجابي وإدارة النزاعات والتنقل السلس بين الأنشطة',
    descriptionFr: 'Stratégies basées sur la psychologie positive et la communication non violente',
    descriptionEn: 'Positive psychology classroom management and transition routines',
    sourceDoc: 'Prompts-de-qualite-pour-enseignants.pdf',
    tags: ['gestion-classe', 'psychologie-positive', 'cnv', 'climat-scolaire'],
    prompt: `Rôle : Tu es un spécialiste de la gestion des comportements scolaires et de la dynamique de groupe.
Tâche : Propose des stratégies concrètes basées sur la psychologie positive et la communication non violente pour gérer les comportements perturbateurs et instaurer un climat serein dans une classe de [niveau scolaire].
Contexte : La classe compte [nombre] élèves. Les défis principaux sont [ex: bavardages constants, transitions lentes entre activités, manque de respect mutuel].
Directives :
- Fournis des rituels de début et de fin de séance pour capter l’attention sans crier.
- Développe un système de responsabilités partagées valorisant chaque profil d'élève.
- Propose une méthode en 4 étapes pour désamorcer un conflit en direct avec un élève.
- Rédige un court guide de communication bienveillante pour les échanges avec les parents d'élèves.`,
  },
  {
    id: 'edu-inclusive-learning',
    category: 'education',
    categoryLabelAr: 'التعليم والتدريس',
    categoryLabelFr: 'Éducation & Enseignement',
    categoryLabelEn: 'Education & Teaching',
    titleAr: 'تكييف الدروس للطلاب ذوي الاحتياجات الخاصة (Inclusion & EBEP)',
    titleFr: 'Adaptation de cours pour élèves à besoins particuliers (EBEP / DYS / TSA)',
    titleEn: 'Inclusive Lesson Adaptation for Special Needs',
    descriptionAr: 'تكييف صياغة المفاهيم والأنشطة البصرية لطلاب عسر القراءة وتشتت الانتباه والطلاب غير الناطقين بالفرنسية',
    descriptionFr: 'Modalités d’adaptation pédagogique (DYS, TDAH, allophones, haut potentiel)',
    descriptionEn: 'Pedagogical accommodations for neurodiverse students and English/French learners',
    sourceDoc: 'Prompts-de-qualite-pour-enseignants.pdf',
    tags: ['inclusion', 'ebep', 'dys', 'adaptation'],
    prompt: `Rôle : Tu es un conseiller pédagogique expert en inclusion scolaire et adaptation des apprentissages.
Tâche : Donne des adaptations méthodologiques et matérielles pour enseigner [sujet de la leçon] à des élèves ayant des besoins éducatifs particuliers (troubles des apprentissages DYS, TDAH, TSA, ou allophones).
Contexte : Classe de [niveau scolaire].
Livrables détaillés :
- Simplification cognitive : comment décomposer la notion sans appauvrir le contenu.
- Supports visuels et repères structurants (cartes mentales, schémas épurés, polices adaptées).
- Modalités de tutorat entre pairs et aménagement des consignes.
- Grille d'évaluation adaptée valorisant les progrès et l'effort.`,
  },

  // --- SECTION 3: VIRTUAL TUTOR & STUDENT PROMPTS (from EXEMPLES-DE-PROMPTS-DEVOIRS.pdf & UCLouvain) ---
  {
    id: 'student-virtual-tutor',
    category: 'student',
    categoryLabelAr: 'الطلاب والدراسة والبحوث',
    categoryLabelFr: 'Tuteur Virtuel & Étudiants',
    categoryLabelEn: 'Virtual Tutor & Student Writing',
    titleAr: 'المعلم الافتراضي المساعد دون كتابة الواجب نيابة عنك',
    titleFr: 'Tuteur virtuel d’accompagnement sans rédaction passive',
    titleEn: 'Virtual Socratic Tutor for Homework & Essays',
    descriptionAr: 'يوجه الطالب ويشرح المفاهيم ويقترح خطة العمل دون أن يكتب النص بالنيابة عنه لتجنب الانتحال',
    descriptionFr: 'Accompagnement pédagogique actif pour planifier et comprendre sans plagiat',
    descriptionEn: 'Socratic virtual tutor to structure thinking and feedback without writing for the student',
    sourceDoc: 'EXEMPLES-DE-PROMPTS-POUR-SAIDER-DE-LIA.pdf (AI Literacy Institute)',
    tags: ['tuteur', 'devoirs', 'pedagogie-active', 'socrate'],
    prompt: `Vous êtes un tuteur virtuel amical, méthodique et bienveillant.
J'ai [indiquer votre âge/niveau d'études] et je prépare un devoir pour le cours de [indiquer la matière].

RÈGLE CARDINALE D'INTÉGRITÉ ACADÉMIQUE :
Vous m'aiderez à comprendre les consignes, à structurer mes idées et à surmonter les blocages, mais VOUS NE RÉDIGEREZ PAS LE TRAVAIL À MA PLACE.

Voici les consignes de mon devoir :
<<< CONSIGNES >>>
[Coller les consignes ici]
<<< FIN CONSIGNES >>>

Procédons par étapes interactives :
1. Résumez avec vos propres mots ce que le professeur attend précisément.
2. Identifiez les 3 concepts clés que je dois absolument maîtriser.
3. Posez-moi 2 questions stimulantes pour m'aider à faire émerger mon propre plan d'action.
Attendez ma réponse avant de passer à l'étape suivante.`,
  },
  {
    id: 'student-thesis-feedback-apa7',
    category: 'student',
    categoryLabelAr: 'الطلاب والدراسة والبحوث',
    categoryLabelFr: 'Tuteur Virtuel & Étudiants',
    categoryLabelEn: 'Virtual Tutor & Student Writing',
    titleAr: 'مراجعة وتدقيق مسودة البحث وفق معايير APA 7 والملاحظات النقدية',
    titleFr: 'Rétroaction critique et relecture de mémoire universitaire (APA 7)',
    titleEn: 'Academic Paper & Thesis Review (APA 7 Feedback)',
    descriptionAr: 'تحليل نقاط القوة والضعف، سلامة المنهجية، الروابط المنطقية، ومواطن التحسين',
    descriptionFr: 'Analyse critique par un professeur universitaire selon critères académiques stricts',
    descriptionEn: 'Comprehensive academic peer-review with rubric evaluation and APA 7 citation check',
    sourceDoc: 'Des pistes pour des prompts de meilleure qualité (UCLouvain)',
    tags: ['memoire', 'these', 'critique', 'apa7', 'universite'],
    prompt: `Agis en tant que professeur et évaluateur universitaire exigeant dans le domaine de [préciser la discipline].
Je veux que tu me fournisses une rétroaction détaillée et constructive sur le brouillon de mon travail de recherche.

Objectifs de mon travail :
- Démontrer une compréhension critique de la littérature existante.
- Comparer rigoureusement les différentes perspectives théoriques.
- Respecter les normes académiques et le formatage APA 7.

Voici mon texte actuel :
<<< MON BROUILLON >>>
[Coller votre texte ici]
<<< FIN DU BROUILLON >>>

Fournis une grille d'évaluation structurée portant sur :
1. Points forts et rigueur argumentative.
2. Clarté de la formulation et fluidité des marqueurs de relation entre paragraphes.
3. Éventuels angles morts, biais non questionnés ou lacunes conceptuelles.
4. Suggestions précises de révision phrase par phrase pour élever le niveau académique.`,
  },

  // --- SECTION 4: FRAMEWORKS & PROMPT ENGINEERING METHODOLOGY (from Prompt_Engineering_ObTIC.pdf & book_english) ---
  {
    id: 'framework-costar-methodology',
    category: 'framework',
    categoryLabelAr: 'أطر هندسة الأوامر المتقدمة',
    categoryLabelFr: 'Méthodologie & Cadres de Prompt',
    categoryLabelEn: 'Prompt Engineering Frameworks',
    titleAr: 'إطار عمل COSTAR المعتمد (Context, Objective, Style, Tone, Audience, Response)',
    titleFr: 'Méthodologie COSTAR complète pour prompts à fort impact',
    titleEn: 'COSTAR Framework for High-Precision Prompts',
    descriptionAr: 'الهيكل الاحترافي الموصى به من كبرى مراكز أبحاث الذكاء الاصطناعي لضمان دقة المخرجات',
    descriptionFr: 'Cadre méthodologique structuré garantissant des réponses optimales sans ambiguïté',
    descriptionEn: 'Industry-standard COSTAR framework ensuring zero ambiguity in AI generations',
    sourceDoc: 'Prompt_Engineering_ObTIC.pdf',
    tags: ['costar', 'methodologie', 'framework', 'ingenierie'],
    prompt: `Tu es un expert en prompt engineering appliquant rigoureusement le cadre COSTAR.

Structure à renseigner pour formuler une consigne infaillible :
# CONTEXTE (C) :
Explique le contexte professionnel, la situation de départ et les données d'arrière-plan.
-> [Ex: Je suis responsable marketing d'une startup SaaS en phase de lancement...]

# OBJECTIF (O) :
Définis la mission exacte et le résultat attendu sans ambiguïté.
-> [Ex: Créer une séquence de 4 e-mails de bienvenue automatisés pour convertir des utilisateurs d'essai...]

# STYLE (S) :
Indique la structure rédactionnelle, le niveau technique et le format de style souhaité.
-> [Ex: Style concis, persuasif, aéré avec puces et accroches percutantes...]

# TON (T) :
Spécifie l'ambiance émotionnelle et la posture de communication.
-> [Ex: Chaleureux, expert, motivant et orienté valeur...]

# AUDIENCE (A) :
Détaille le profil des destinataires et leur niveau de familiarité avec le sujet.
-> [Ex: Fondateurs de PME et directeurs des opérations soucieux d'optimiser leur temps...]

# RÉPONSE (R) :
Spécifie le format de restitution (tableaux, balises markdown, contraintes de longueur).
-> [Ex: Présente chaque e-mail avec Objet, Pré-header, Corps du texte et Appel à l'action clair.]`,
  },
  {
    id: 'framework-chain-of-thought',
    category: 'framework',
    categoryLabelAr: 'أطر هندسة الأوامر المتقدمة',
    categoryLabelFr: 'Méthodologie & Cadres de Prompt',
    categoryLabelEn: 'Prompt Engineering Frameworks',
    titleAr: 'سلسلة التفكير المنطقي خطوة بخطوة (Chain of Thought - CoT)',
    titleFr: 'Raisonnement pas à pas (Chain of Thought & Few-Shot)',
    titleEn: 'Chain of Thought & Step-by-Step Reasoning',
    descriptionAr: 'إلزام النموذج بالتفكير التحليلي قبل إعطاء الإجابة لحل المسائل المعقدة ومنع الهلوسة',
    descriptionFr: 'Décomposition systématique des étapes de calcul et d’analyse pour éliminer les erreurs',
    descriptionEn: 'Step-by-step reasoning decomposition to solve complex quantitative and logical tasks',
    sourceDoc: 'ChatGPT 100+ Examples & ObTIC',
    tags: ['cot', 'chain-of-thought', 'few-shot', 'logique'],
    prompt: `Consigne d'activation du raisonnement pas à pas (Chain of Thought) :

Tâche complexe à résoudre :
[Décrivez ici votre problème, calcul financier, choix d'architecture ou analyse comparative]

INSTRUCTIONS DE DÉCOMPOSITION :
1. Ne donne pas la réponse finale immédiatement.
2. Décompose la réflexion en étapes numérotées explicites :
   - Étape 1 : Identification des variables et contraintes initiales.
   - Étape 2 : Formules ou principes théoriques appliqués.
   - Étape 3 : Calculs ou déductions intermédiaires avec vérification des unités.
   - Étape 4 : Analyse de sensibilité ou détection d'hypothèses limites.
3. Conclus par une synthèse claire et la recommandation opérationnelle finale.
"Pensons étape par étape avec rigueur mathématique et logique."`,
  },

  // --- SECTION 5: BUSINESS, LEGAL & CONTRACT PROMPTS (from ChatGPT 100+ Examples) ---
  {
    id: 'biz-contract-lease-drafting',
    category: 'business',
    categoryLabelAr: 'الأعمال والإدارة والقانون',
    categoryLabelFr: 'Affaires & Juridique',
    categoryLabelEn: 'Business & Legal Drafting',
    titleAr: 'صياغة عقود قانونية مخصصة ومراجعة بنود الالتزام',
    titleFr: 'Rédaction et analyse de clauses contractuelles complexes',
    titleEn: 'Legal Contract Drafting & Clause Review',
    descriptionAr: 'صياغة عقود إيجار، اتفاقيات عدم إفصاح، وفحص مخاطر الكفيل والمسؤولية التضامنية',
    descriptionFr: 'Rédaction de baux, clauses d’indexation inflation et analyse des risques de caution',
    descriptionEn: 'Contract drafting with deposit clauses, inflation adjustments and liability assessment',
    sourceDoc: 'ChatGPT 100+ Examples (Univ. Carlos III)',
    tags: ['contrat', 'juridique', 'bail', 'droit'],
    prompt: `Agis en qualité de juriste spécialisé en droit des contrats et des affaires.
Tâche : Rédige un projet de contrat de [préciser la nature du contrat, ex: bail de location d'espace commercial / convention de prestation de services].

Conditions spécifiques à intégrer impérativement :
1. Définition précise de l'objet et de la durée avec modalités de résiliation anticipée et préavis.
2. Modalités financières : montant du loyer/honoraire, date d'exigibilité et clause d'indexation annuelle sur l'inflation légale.
3. Dépôt de garantie et conditions de restitution intégrale ou retenues justifiées.
4. Répartition exhaustive des charges, entretiens et responsabilités d'assurance.
5. Clause limitative de responsabilité, clause résolutoire de plein droit et juridiction compétente.
Rédige les articles avec clarté, numérotation juridique rigoureuse et mentions entre crochets pour les éléments personnalisables.`,
  },
  {
    id: 'biz-excel-financial-analysis',
    category: 'business',
    categoryLabelAr: 'الأعمال والإدارة والقانون',
    categoryLabelFr: 'Affaires & Juridique',
    categoryLabelEn: 'Business & Legal Drafting',
    titleAr: 'تحليل البيانات المالية وتوليد معادلات Excel المعقدة',
    titleFr: 'Analyse de données financières et formules Excel avancées',
    titleEn: 'Financial Analysis & Complex Excel Formulas',
    descriptionAr: 'توليد معادلات متداخلة (Nested IF, XLOOKUP, INDEX/MATCH) وتحليل نمو المبيعات والإيرادات',
    descriptionFr: 'Création de formules tableurs optimisées et interprétation de tendances économiques',
    descriptionEn: 'Advanced spreadsheet formulas, financial forecasting and data table synthesis',
    sourceDoc: 'ChatGPT 100+ Examples',
    tags: ['excel', 'finance', 'formules', 'tableur', 'donnees'],
    prompt: `Rôle : Tu es un analyste financier senior et expert certifié sur Microsoft Excel et Google Sheets.
Tâche :
1. Crée une formule Excel robuste pour le cas suivant : [Décrivez la condition, ex: calcul de commission échelonnée selon tranches de chiffre d'affaires et pénalité de retard].
2. Explique le fonctionnement interne de chaque fonction imbriquée.
3. Fournis la structure du tableau modèle avec les en-têtes recommandés.
4. Propose une méthode de validation des données et une formule de contrôle d'erreurs (avec IFERROR ou XLOOKUP) pour fiabiliser le fichier.`,
  },

  // --- SECTION 6: CREATIVE & STYLISTIC WRITING (from ChatGPT 100+ Examples) ---
  {
    id: 'creative-literary-voice',
    category: 'creative',
    categoryLabelAr: 'الكتابة الإبداعية وتعديل الأسلوب',
    categoryLabelFr: 'Écriture Créative & Style',
    categoryLabelEn: 'Creative & Stylistic Writing',
    titleAr: 'محاكاة أساليب كبار الكتاب والشخصيات الأدبية والتاريخية',
    titleFr: 'Imitation de voix littéraires et historiques (Tolkien, Hugo, etc.)',
    titleEn: 'Literary & Historical Persona Emulation',
    descriptionAr: 'إعادة صياغة النصوص أو شرح المفاهيم بأسلوب أدبي رفيع مستوحى من كبار الأدباء أو الفلاسفة',
    descriptionFr: 'Réécriture de scènes ou explication philosophique dans le style d’un auteur célèbre',
    descriptionEn: 'Channeling iconic historical and literary personas to explain concepts or narrate tales',
    sourceDoc: 'ChatGPT 100+ Examples',
    tags: ['litterature', 'style', 'tolkien', 'philosophie', 'relecture'],
    prompt: `Rôle : Adopte pleinement la voix, le vocabulaire d'époque, la cadence poétique et la perspective philosophique de [Nom de l'auteur ou du personnage, ex: J.R.R. Tolkien / Victor Hugo / Socrate / Albert Einstein].

Tâche :
Explique ou raconte la scène suivante en restant 100% fidèle au style inimitable de cette figure :
<<< SUJET / TEXTE DE DÉPART >>>
[Indiquer votre sujet ou texte ici]
<<< FIN DU SUJET >>>

Exigences stylistiques :
- Emploie des métaphores emblématiques de son univers.
- Respecte le rythme des phrases (amples périodes ou réparties vives).
- Ne brise pas le personnage en faisant de commentaires méta.`,
  },
];
