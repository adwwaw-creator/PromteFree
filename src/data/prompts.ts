import { PromptCategory } from '../types';

export interface CategoryCardItem {
  id: PromptCategory;
  icon: string;
  ar: string;
  en: string;
  fr: string;
  sampleIdeaAr: string;
  sampleIdeaFr: string;
  sampleIdeaEn: string;
}

export const dawaiCategoryCards: CategoryCardItem[] = [
  {
    id: 'code',
    icon: '💻',
    ar: 'البرمجة والوكلاء',
    en: 'Code & Agents',
    fr: 'Code & Agents',
    sampleIdeaAr: 'وكيل أتمتة برمجية ذكي (PR Babysitter) يراقب طلبات السحب وفشل الـ CI ويرسل تنبيهات',
    sampleIdeaFr: 'Agent autonome DevOps (PR Babysitter) pour surveiller les Pull Requests et logs CI/CD',
    sampleIdeaEn: 'Autonomous DevOps agent (PR Babysitter) tracking pull requests, CI logs, and reviews',
  },
  {
    id: 'image',
    icon: '🖼️',
    ar: 'الصور',
    en: 'Images',
    fr: 'Images',
    sampleIdeaAr: 'تصميم بوستر سينمائي عالي الدقة لشخصية خيال علمي',
    sampleIdeaFr: 'Poster cinématographique ultra-détaillé de science-fiction',
    sampleIdeaEn: 'Cinematic high-resolution sci-fi character concept poster',
  },
  {
    id: 'video',
    icon: '🎬',
    ar: 'الفيديو',
    en: 'Video',
    fr: 'Vidéo',
    sampleIdeaAr: 'سيناريو فيديو إعلاني قصير مدته 30 ثانية لمنتج تقني مبتكر',
    sampleIdeaFr: 'Scénario vidéo court de 30 secondes pour un produit innovant',
    sampleIdeaEn: '30-second commercial video storyboard for an innovative tech product',
  },
  {
    id: 'research',
    icon: '📚',
    ar: 'البحث',
    en: 'Research',
    fr: 'Recherche',
    sampleIdeaAr: 'بحث تحليلي شامل حول مستقبل الذكاء الاصطناعي التوليدي والأنظمة الذاتية',
    sampleIdeaFr: 'Rapport analytique complet sur l’avenir de l’IA générative et des agents autonomes',
    sampleIdeaEn: 'Comprehensive research analysis on generative AI and autonomous agents',
  },
  {
    id: 'music',
    icon: '🎵',
    ar: 'الموسيقى',
    en: 'Music',
    fr: 'Musique',
    sampleIdeaAr: 'تأليف كلمات ولحن لأغنية هادئة تمزج بين الآلات الشرقية والمودرن',
    sampleIdeaFr: 'Paroles et composition pour une mélodie douce fusion orientale et moderne',
    sampleIdeaEn: 'Lyrics and composition for an ambient track blending traditional and modern soundscapes',
  },
  {
    id: 'marketing',
    icon: '📣',
    ar: 'التسويق',
    en: 'Marketing',
    fr: 'Marketing',
    sampleIdeaAr: 'خطة إطلاق حملة تسويقية رقمية لعلامة تجارية مع نصوص إعلانات جذابة',
    sampleIdeaFr: 'Campagne de lancement marketing numérique avec copywritings percutants',
    sampleIdeaEn: 'Digital marketing launch campaign strategy with high-converting copy',
  },
  {
    id: 'health',
    icon: '🩺',
    ar: 'الصحة والطب',
    en: 'Health & Medicine',
    fr: 'Santé & Médecine',
    sampleIdeaAr: 'دليل توعوي طبي مبني على البراهين حول التغذية العلاجية وإدارة التوتر',
    sampleIdeaFr: 'Guide d’information médicale fondé sur les preuves sur la nutrition et la gestion du stress',
    sampleIdeaEn: 'Evidence-based health guide on clinical nutrition and stress management',
  },
  {
    id: 'education',
    icon: '🎓',
    ar: 'التعليم',
    en: 'Education & Pedagogy',
    fr: 'Éducation & Pédagogie',
    sampleIdeaAr: 'خطة درس تعليمي تفاعلي مع أهداف SMART وتمايز بيداغوجي وفق سلم بلوم',
    sampleIdeaFr: 'Plan de cours interactif avec objectifs SMART et grille critériée Bloom',
    sampleIdeaEn: 'Interactive lesson plan with SMART objectives, scaffolding, and Bloom rubric',
  },
];
