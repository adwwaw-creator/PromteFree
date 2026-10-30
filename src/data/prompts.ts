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
    ar: 'البرمجة',
    en: 'Code',
    fr: 'Code',
    sampleIdeaAr: 'تطبيق ويب متكامل مع معمارية برمجيات نظيفة Clean Architecture',
    sampleIdeaFr: 'Application web complète avec Clean Architecture et TypeScript strict',
    sampleIdeaEn: 'Full-stack web application with Clean Architecture and strict TypeScript',
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
];
