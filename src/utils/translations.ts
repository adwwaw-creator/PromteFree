import { SupportedLanguage, LanguageItem } from '../types';

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇲🇦', dir: 'rtl', locale: 'ar-SA' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr', locale: 'en-US' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', locale: 'fr-FR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', locale: 'es-ES' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', locale: 'de-DE' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr', locale: 'tr-TR' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', locale: 'ja-JP' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr', locale: 'zh-CN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', locale: 'hi-IN' },
];

export const STORAGE_LANG_KEY = 'arabiprompt-lang';
export const LEGACY_STORAGE_LANG_KEY = 'arabi_prompt_lang';

export function getInitialAppLanguage(): SupportedLanguage {
  const supported = new Set<SupportedLanguage>(
    SUPPORTED_LANGUAGES.map((item) => item.code)
  );

  if (typeof window === 'undefined') return 'ar';

  try {
    const saved =
      localStorage.getItem(STORAGE_LANG_KEY) ||
      localStorage.getItem(LEGACY_STORAGE_LANG_KEY) ||
      localStorage.getItem('lang');

    if (saved && supported.has(saved as SupportedLanguage)) {
      return saved as SupportedLanguage;
    }
  } catch {
    // Storage may be unavailable in private browsing
  }

  try {
    const candidates = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];

    for (const candidate of candidates) {
      if (!candidate) continue;
      const code = candidate.split('-')[0].toLowerCase() as SupportedLanguage;
      if (supported.has(code)) return code;
    }
  } catch {
    // Navigator may be unavailable
  }

  return 'ar';
}

export function saveAppLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;

  const item = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  document.documentElement.lang = lang;
  document.documentElement.dir = item.dir;

  try {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    localStorage.setItem(LEGACY_STORAGE_LANG_KEY, lang);
  } catch {
    // Storage quota or disabled
  }
}

export type TranslationKey =
  | 'appName'
  | 'appSubtitle'
  | 'heroGreeting'
  | 'heroQuestionAr'
  | 'heroQuestionSub'
  | 'inputPlaceholder'
  | 'voiceListening'
  | 'voiceSupported'
  | 'voiceMicDenied'
  | 'categoryImage'
  | 'categoryVideo'
  | 'categoryMusic'
  | 'categoryCode'
  | 'categoryPrompts'
  | 'generatePrompt'
  | 'copyPrompt'
  | 'copied'
  | 'executeDirectly'
  | 'newChat'
  | 'promptLibrary'
  | 'promptRules'
  | 'selectModel'
  | 'account'
  | 'signOut'
  | 'signIn'
  | 'settings'
  | 'language'
  | 'history'
  | 'noHistory'
  | 'clearHistory'
  | 'quickTools'
  | 'filterAll'
  | 'filterGemini'
  | 'filterAgents'
  | 'searchPlaceholder'
  | 'bothPromptAndResult'
  | 'promptOnly'
  | 'resultOnly'
  | 'detailShort'
  | 'detailMedium'
  | 'detailDetailed'
  | 'toneFormal'
  | 'toneCreative'
  | 'toneTechnical'
  | 'toneFriendly'
  | 'toneAcademic'
  | 'micStart'
  | 'micStop';

export const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = {
  ar: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'مصمم البرومات العربي',
    heroGreeting: 'تفضل بالحديث، Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'Demandez ... (اطلب أي برومت)',
    voiceListening: '🎙️ جارٍ الاستماع... تكلّم الآن...',
    voiceSupported: 'ميزة التعرف الصوتي نشطة',
    voiceMicDenied: '⚠️ تم رفض إذن الميكروفون. انقر فوق أيقونة القفل في المتصفح للسماح به.',
    categoryImage: 'Image',
    categoryVideo: 'Vidéo',
    categoryMusic: 'Musique',
    categoryCode: 'Code',
    categoryPrompts: 'Prompts',
    generatePrompt: 'إنشاء برومبت',
    copyPrompt: 'نسخ البرومت',
    copied: 'تم النسخ!',
    executeDirectly: 'تنفيذ البرومت مباشرة',
    newChat: 'محادثة جديدة',
    promptLibrary: 'مكتبة البرومبتات',
    promptRules: 'قوانين هندسة البرومبت',
    selectModel: 'اختيار النموذج أو الوكيل الذكي',
    account: 'حسابك',
    signOut: 'تسجيل الخروج',
    signIn: 'تسجيل الدخول',
    settings: 'الإعدادات والخيارات',
    language: 'اللغة',
    history: 'سجل المحادثات',
    noHistory: 'لا توجد محادثات سابقة حتى الآن',
    clearHistory: 'مسح السجل',
    quickTools: 'أدوات الذكاء الاصطناعي المباشرة',
    filterAll: 'الكل',
    filterGemini: 'عائلة Gemini',
    filterAgents: 'الوكلاء الآخرون',
    searchPlaceholder: 'ابحث في البرومبتات...',
    bothPromptAndResult: 'البرومت والنتيجة معاً',
    promptOnly: 'برومت للنسخ فقط',
    resultOnly: 'تنفيذ النتيجة مباشرة فقط',
    detailShort: 'موجز ومركّز',
    detailMedium: 'متوسط ومتوازن',
    detailDetailed: 'شامل واحترافي',
    toneFormal: 'رسمي واحترافي',
    toneCreative: 'إبداعي وسينمائي',
    toneTechnical: 'تقني ودقيق',
    toneFriendly: 'ودي وسلس',
    toneAcademic: 'أكاديمي وبحثي',
    micStart: 'بدء الإملاء الصوتي',
    micStop: 'إيقاف الإملاء الصوتي',
  },
  en: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'Enterprise Prompt Architect',
    heroGreeting: 'The floor is yours, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'Ask anything or describe your prompt idea...',
    voiceListening: '🎙️ Listening... Speak now...',
    voiceSupported: 'Speech recognition active',
    voiceMicDenied: '⚠️ Microphone access denied. Click the lock icon in your browser to allow access.',
    categoryImage: 'Image',
    categoryVideo: 'Video',
    categoryMusic: 'Music',
    categoryCode: 'Code',
    categoryPrompts: 'Prompts',
    generatePrompt: 'Generate Prompt',
    copyPrompt: 'Copy Prompt',
    copied: 'Copied!',
    executeDirectly: 'Execute Prompt Directly',
    newChat: 'New Chat',
    promptLibrary: 'Prompt Library',
    promptRules: 'Prompt Engineering Rules',
    selectModel: 'Select Model or Autonomous Agent',
    account: 'Account',
    signOut: 'Sign Out',
    signIn: 'Sign In',
    settings: 'Settings & Controls',
    language: 'Language',
    history: 'Chat History',
    noHistory: 'No saved sessions yet',
    clearHistory: 'Clear History',
    quickTools: 'Quick Launch AI Tools',
    filterAll: 'All',
    filterGemini: 'Gemini Models',
    filterAgents: 'Other Agents',
    searchPlaceholder: 'Search prompts...',
    bothPromptAndResult: 'Prompt & Result Both',
    promptOnly: 'Prompt Code Only',
    resultOnly: 'Execution Result Only',
    detailShort: 'Concise & Short',
    detailMedium: 'Balanced & Standard',
    detailDetailed: 'Comprehensive & Deep',
    toneFormal: 'Formal & Professional',
    toneCreative: 'Creative & Cinematic',
    toneTechnical: 'Technical & Strict',
    toneFriendly: 'Friendly & Conversational',
    toneAcademic: 'Academic & Research-grade',
    micStart: 'Start voice dictation',
    micStop: 'Stop voice dictation',
  },
  fr: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'Concepteur de Prompts IA',
    heroGreeting: 'À vous la parole, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'Demandez ...',
    voiceListening: '🎙️ Écoute en cours... Parlez maintenant...',
    voiceSupported: 'Reconnaissance vocale active',
    voiceMicDenied: '⚠️ Accès au micro refusé. Cliquez sur le cadenas dans votre navigateur pour autoriser.',
    categoryImage: 'Image',
    categoryVideo: 'Vidéo',
    categoryMusic: 'Musique',
    categoryCode: 'Code',
    categoryPrompts: 'Prompts',
    generatePrompt: 'Générer le prompt',
    copyPrompt: 'Copier le prompt',
    copied: 'Copié !',
    executeDirectly: 'Exécuter directement',
    newChat: 'Nouvelle discussion',
    promptLibrary: 'Bibliothèque de prompts',
    promptRules: 'Règles de prompting',
    selectModel: 'Sélectionner un modèle ou un agent',
    account: 'Compte',
    signOut: 'Se déconnecter',
    signIn: 'Se connecter',
    settings: 'Paramètres',
    language: 'Langue',
    history: 'Historique des discussions',
    noHistory: 'Aucune discussion enregistrée',
    clearHistory: 'Effacer l’historique',
    quickTools: 'Outils IA en accès rapide',
    filterAll: 'Tous',
    filterGemini: 'Modèles Gemini',
    filterAgents: 'Autres Agents',
    searchPlaceholder: 'Rechercher des prompts...',
    bothPromptAndResult: 'Prompt & Résultat ensemble',
    promptOnly: 'Prompt seul',
    resultOnly: 'Résultat d’exécution seul',
    detailShort: 'Concis & Court',
    detailMedium: 'Moyen & Équilibré',
    detailDetailed: 'Détaillé & Complet',
    toneFormal: 'Formel & Professionnel',
    toneCreative: 'Créatif & Cinématographique',
    toneTechnical: 'Technique & Rigoureux',
    toneFriendly: 'Convivial & Accessible',
    toneAcademic: 'Académique & Analytique',
    micStart: 'Démarrer la dictée vocale',
    micStop: 'Arrêter la dictée vocale',
  },
  es: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'Arquitecto de Prompts IA',
    heroGreeting: 'Te escuchamos, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'Pregunta lo que sea o describe tu idea...',
    voiceListening: '🎙️ Escuchando... Habla ahora...',
    voiceSupported: 'Reconocimiento de voz activo',
    voiceMicDenied: '⚠️ Micrófono bloqueado. Haz clic en el candado del navegador para permitir el acceso.',
    categoryImage: 'Imagen',
    categoryVideo: 'Vídeo',
    categoryMusic: 'Música',
    categoryCode: 'Código',
    categoryPrompts: 'Prompts',
    generatePrompt: 'Crear prompt',
    copyPrompt: 'Copiar prompt',
    copied: '¡Copiado!',
    executeDirectly: 'Ejecutar directamente',
    newChat: 'Nueva conversación',
    promptLibrary: 'Biblioteca de prompts',
    promptRules: 'Reglas de ingeniería de prompts',
    selectModel: 'Seleccionar modelo o agente',
    account: 'Cuenta',
    signOut: 'Cerrar sesión',
    signIn: 'Iniciar sesión',
    settings: 'Ajustes',
    language: 'Idioma',
    history: 'Historial',
    noHistory: 'Sin conversaciones previas',
    clearHistory: 'Borrar historial',
    quickTools: 'Herramientas IA rápidas',
    filterAll: 'Todos',
    filterGemini: 'Modelos Gemini',
    filterAgents: 'Otros Agentes',
    searchPlaceholder: 'Buscar prompts...',
    bothPromptAndResult: 'Prompt y resultado juntos',
    promptOnly: 'Solo prompt',
    resultOnly: 'Solo resultado de ejecución',
    detailShort: 'Breve y conciso',
    detailMedium: 'Medio y equilibrado',
    detailDetailed: 'Detallado y completo',
    toneFormal: 'Formal y profesional',
    toneCreative: 'Creativo y cinematográfico',
    toneTechnical: 'Técnico y riguroso',
    toneFriendly: 'Amigable y cercano',
    toneAcademic: 'Académico y riguroso',
    micStart: 'Iniciar dictado de voz',
    micStop: 'Detener dictado de voz',
  },
  de: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'Enterprise Prompt Architekt',
    heroGreeting: 'Sie haben das Wort, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'Frage etwas oder beschreibe deine Prompt-Idee...',
    voiceListening: '🎙️ Höre zu... Jetzt sprechen...',
    voiceSupported: 'Spracherkennung aktiv',
    voiceMicDenied: '⚠️ Mikrofonzugriff verweigert. Bitte im Browser freigeben.',
    categoryImage: 'Bild',
    categoryVideo: 'Video',
    categoryMusic: 'Musik',
    categoryCode: 'Code',
    categoryPrompts: 'Prompts',
    generatePrompt: 'Prompt erstellen',
    copyPrompt: 'Prompt kopieren',
    copied: 'Kopiert!',
    executeDirectly: 'Direkt ausführen',
    newChat: 'Neuer Chat',
    promptLibrary: 'Prompt-Bibliothek',
    promptRules: 'Prompt-Engineering-Regeln',
    selectModel: 'Modell oder Agent wählen',
    account: 'Konto',
    signOut: 'Abmelden',
    signIn: 'Anmelden',
    settings: 'Einstellungen',
    language: 'Sprache',
    history: 'Verlauf',
    noHistory: 'Bisher keine Chats gespeichert',
    clearHistory: 'Verlauf leeren',
    quickTools: 'KI-Schnellstart-Tools',
    filterAll: 'Alle',
    filterGemini: 'Gemini-Modelle',
    filterAgents: 'Andere Agenten',
    searchPlaceholder: 'Prompts durchsuchen...',
    bothPromptAndResult: 'Prompt & Ergebnis zusammen',
    promptOnly: 'Nur Prompt',
    resultOnly: 'Nur Ausführungsergebnis',
    detailShort: 'Prägnant & Kurz',
    detailMedium: 'Ausgewogen & Standard',
    detailDetailed: 'Umfassend & Tiefgründig',
    toneFormal: 'Formell & Professionell',
    toneCreative: 'Kreativ & Kinematografisch',
    toneTechnical: 'Technisch & Präzise',
    toneFriendly: 'Freundlich & Natürlich',
    toneAcademic: 'Akademisch & Analytisch',
    micStart: 'Sprachdiktat starten',
    micStop: 'Sprachdiktat stoppen',
  },
  tr: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'Kurumsal Prompt Mimarı',
    heroGreeting: 'Söz sizde, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'İstediğinizi sorun veya fikrinizi yazın...',
    voiceListening: '🎙️ Dinleniyor... Şimdi konuşun...',
    voiceSupported: 'Ses tanıma devrede',
    voiceMicDenied: '⚠️ Mikrofon izni engellendi. İzin vermek için tarayıcı kilit simgesine tıklayın.',
    categoryImage: 'Görsel',
    categoryVideo: 'Video',
    categoryMusic: 'Müzik',
    categoryCode: 'Kod',
    categoryPrompts: 'Promptlar',
    generatePrompt: 'Prompt Oluştur',
    copyPrompt: 'Promptu Kopyala',
    copied: 'Kopyalandı!',
    executeDirectly: 'Doğrudan Çalıştır',
    newChat: 'Yeni Sohbet',
    promptLibrary: 'Prompt Kütüphanesi',
    promptRules: 'Prompt Mühendisliği Kuralları',
    selectModel: 'Model veya Ajan Seç',
    account: 'Hesap',
    signOut: 'Çıkış Yap',
    signIn: 'Giriş Yap',
    settings: 'Ayarlar',
    language: 'Dil',
    history: 'Sohbet Geçmişi',
    noHistory: 'Henüz kaydedilmiş sohbet yok',
    clearHistory: 'Geçmişi Temizle',
    quickTools: 'Hızlı Yapay Zeka Araçları',
    filterAll: 'Tümü',
    filterGemini: 'Gemini Modelleri',
    filterAgents: 'Diğer Ajanlar',
    searchPlaceholder: 'Prompt ara...',
    bothPromptAndResult: 'Hem Prompt Hem Sonuç',
    promptOnly: 'Yalnızca Prompt',
    resultOnly: 'Yalnızca Doğrudan Sonuç',
    detailShort: 'Kısa ve Öz',
    detailMedium: 'Dengeli ve Orta',
    detailDetailed: 'Kapsamlı ve Detaylı',
    toneFormal: 'Resmi ve Profesyonel',
    toneCreative: 'Yaratıcı ve Sinematik',
    toneTechnical: 'Teknik ve Kesin',
    toneFriendly: 'Dostça ve Samimi',
    toneAcademic: 'Akademik ve Araştırmacı',
    micStart: 'Sesli dikteyi başlat',
    micStop: 'Sesli dikteyi durdur',
  },
  ja: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'エンタープライズ・プロンプト設計システム',
    heroGreeting: 'どうぞお話しください、Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: '質問やプロンプトのアイデアを入力...',
    voiceListening: '🎙️ 音声を認識中... お話しください...',
    voiceSupported: '音声認識が有効です',
    voiceMicDenied: '⚠️ マイクのアクセスがブロックされています。ブラウザの鍵アイコンをクリックして許可してください。',
    categoryImage: '画像',
    categoryVideo: '動画',
    categoryMusic: '音楽',
    categoryCode: 'コード',
    categoryPrompts: 'プロンプト',
    generatePrompt: 'プロンプトを生成',
    copyPrompt: 'プロンプトをコピー',
    copied: 'コピーしました！',
    executeDirectly: 'プロンプトを直接実行',
    newChat: '新しいチャット',
    promptLibrary: 'プロンプトライブラリ',
    promptRules: 'プロンプト設計原則',
    selectModel: 'モデルまたは自律エージェントの選択',
    account: 'アカウント',
    signOut: 'サインアウト',
    signIn: 'サインイン',
    settings: '設定',
    language: '言語',
    history: 'チャット履歴',
    noHistory: '履歴はまだありません',
    clearHistory: '履歴を消去',
    quickTools: 'AIクイック起動ツール',
    filterAll: 'すべて',
    filterGemini: 'Geminiモデル',
    filterAgents: 'その他のエージェント',
    searchPlaceholder: 'プロンプトを検索...',
    bothPromptAndResult: 'プロンプトと結果の両方',
    promptOnly: 'プロンプトのみ',
    resultOnly: '実行結果のみ',
    detailShort: '簡潔・要約',
    detailMedium: '標準・バランス',
    detailDetailed: '包括的・詳細',
    toneFormal: 'フォーマル・専門的',
    toneCreative: '創造的・シネマティック',
    toneTechnical: '技術的・厳密',
    toneFriendly: '親しみやすい・会話調',
    toneAcademic: '学術的・研究基準',
    micStart: '音声入力を開始',
    micStop: '音声入力を停止',
  },
  zh: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: '企业级提示词架构系统',
    heroGreeting: '请讲，Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: '输入问题或描述您的提示词想法...',
    voiceListening: '🎙️ 正在倾听... 请讲话...',
    voiceSupported: '语音识别已激活',
    voiceMicDenied: '⚠️ 麦克风权限被拒绝。请点击浏览器地址栏锁图标允许访问。',
    categoryImage: '图像',
    categoryVideo: '视频',
    categoryMusic: '音乐',
    categoryCode: '代码',
    categoryPrompts: '提示词',
    generatePrompt: '生成提示词',
    copyPrompt: '复制提示词',
    copied: '已复制！',
    executeDirectly: '直接执行提示词',
    newChat: '新对话',
    promptLibrary: '提示词库',
    promptRules: '提示词工程准则',
    selectModel: '选择模型或智能体',
    account: '账户',
    signOut: '退出登录',
    signIn: '登录',
    settings: '设置',
    language: '语言',
    history: '历史记录',
    noHistory: '暂无保存的历史会话',
    clearHistory: '清除历史',
    quickTools: '快捷 AI 启动工具',
    filterAll: '全部',
    filterGemini: 'Gemini 系列',
    filterAgents: '其他智能体',
    searchPlaceholder: '搜索提示词...',
    bothPromptAndResult: '提示词与执行结果',
    promptOnly: '仅提示词',
    resultOnly: '仅执行结果',
    detailShort: '精简扼要',
    detailMedium: '适中均衡',
    detailDetailed: '全面深入',
    toneFormal: '正式严谨',
    toneCreative: '创意影视',
    toneTechnical: '技术硬核',
    toneFriendly: '亲切友好',
    toneAcademic: '学术研究',
    micStart: '开始语音输入',
    micStop: '停止语音输入',
  },
  hi: {
    appName: 'ArabiPrompt AI Studio',
    appSubtitle: 'उद्यम प्रॉम्प्ट आर्किटेक्ट',
    heroGreeting: 'आपकी बारी, Daw',
    heroQuestionAr: 'ماذا تريد أن تبدع اليوم ؟',
    heroQuestionSub: 'What do you want to create today?',
    inputPlaceholder: 'कुछ भी पूछें या अपना प्रॉम्प्ट विचार लिखें...',
    voiceListening: '🎙️ सुन रहा हूँ... अब बोलें...',
    voiceSupported: 'ध्वनि पहचान सक्रिय है',
    voiceMicDenied: '⚠️ माइक्रोफ़ोन अनुमति अस्वीकृत। अनुमति देने के लिए ब्राउज़र के ताला आइकन पर क्लिक करें।',
    categoryImage: 'चित्र',
    categoryVideo: 'वीडियो',
    categoryMusic: 'संगीत',
    categoryCode: 'कोड',
    categoryPrompts: 'प्रॉम्प्ट्स',
    generatePrompt: 'प्रॉम्प्ट बनाएं',
    copyPrompt: 'प्रॉम्प्ट कॉपी करें',
    copied: 'कॉपी हो गया!',
    executeDirectly: 'सीधे निष्पादित करें',
    newChat: 'नई बातचीत',
    promptLibrary: 'प्रॉम्प्ट लाइब्रेरी',
    promptRules: 'प्रॉम्प्ट इंजीनियरिंग नियम',
    selectModel: 'मॉडल या एजेंट चुनें',
    account: 'खाता',
    signOut: 'साइन आउट',
    signIn: 'साइन इन',
    settings: 'सेटिंग्स',
    language: 'भाषा',
    history: 'बातचीत का इतिहास',
    noHistory: 'अभी कोई बातचीत सहेजी नहीं गई है',
    clearHistory: 'इतिहास साफ़ करें',
    quickTools: 'त्वरित एआई टूल्स',
    filterAll: 'सभी',
    filterGemini: 'Gemini मॉडल',
    filterAgents: 'अन्य एजेंट्स',
    searchPlaceholder: 'प्रॉम्प्ट खोजें...',
    bothPromptAndResult: 'प्रॉम्प्ट और परिणाम दोनों',
    promptOnly: 'केवल प्रॉम्प्ट',
    resultOnly: 'केवल परिणाम',
    detailShort: 'संक्षिप्त व सटीक',
    detailMedium: 'संतुलित व मानक',
    detailDetailed: 'व्यापक व विस्तृत',
    toneFormal: 'औपचारिक व पेशेवर',
    toneCreative: 'रचनात्मक व सिनेमाई',
    toneTechnical: 'तकनीकी व सटीक',
    toneFriendly: 'मित्रवत व सहज',
    toneAcademic: 'शैक्षणिक व विश्लेषणात्मक',
    micStart: 'आवाज़ से इनपुट शुरू करें',
    micStop: 'आवाज़ से इनपुट रोकें',
  },
};

export function t(key: TranslationKey, lang: SupportedLanguage): string {
  const dict = translations[lang] || translations.ar;
  return dict[key] || translations.ar[key] || key;
}

export function getLanguageMetadata(code: SupportedLanguage): LanguageItem {
  return SUPPORTED_LANGUAGES.find((item) => item.code === code) || SUPPORTED_LANGUAGES[0];
}
