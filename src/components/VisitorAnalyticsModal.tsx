import React, { useState } from 'react';
import {
  X,
  Globe2,
  Users,
  MapPin,
  Activity,
  Sparkles,
  TrendingUp,
  Compass,
  ShieldCheck,
  BarChart3,
  RotateCcw,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { VisitorLocation, CountryStat } from '../hooks/useVisitorAnalytics';
import { AdminAnalytics } from './AdminAnalytics';

interface VisitorAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  totalVisitors: number;
  onlineNow: number;
  visitorLocation: VisitorLocation;
  isLoadingLocation: boolean;
  topCountries: CountryStat[];
  ownerExcluded?: boolean;
  onToggleOwnerExclusion?: (exclude: boolean) => void;
  onRecordVisitManual?: () => void;
  onResetToZero: () => void;
}

export const VisitorAnalyticsModal: React.FC<VisitorAnalyticsModalProps> = ({
  isOpen,
  onClose,
  lang,
  totalVisitors,
  onlineNow,
  visitorLocation,
  isLoadingLocation,
  topCountries,
  ownerExcluded,
  onToggleOwnerExclusion,
  onRecordVisitManual,
  onResetToZero,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'admin'>('overview');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const isRtl = lang === 'ar';

  const handleConfirmReset = () => {
    onResetToZero();
    setShowConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0f1422] border border-[#2b3552] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[90vh] text-white"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f283f] flex items-center justify-between bg-gradient-to-r from-[#111728] via-[#16203a] to-[#111728]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Globe2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {lang === 'ar' ? 'عداد الزوار الفعلي والتوزيع الجغرافي' : 'Compteur Réel des Visiteurs'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {lang === 'ar' ? 'حقيقي 100%' : '100% Real'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'إحصائيات حقيقية تبدأ من الصفر وتسجل الزيارات الفعلية فقط' : 'Statistiques réelles sans données fictives'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Reset Button */}
        <div className="px-5 pt-2 border-b border-[#1f283f] flex items-center justify-between gap-2 bg-[#0c101c] flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'نظرة عامة حقيقية' : 'Aperçu Réel'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'border-cyan-400 text-cyan-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'لوحة تحكم المدير (D1 Admin)' : 'Tableau Admin'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {/* Quick Test Visit Button */}
            {onRecordVisitManual && (
              <button
                type="button"
                onClick={onRecordVisitManual}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                title={lang === 'ar' ? 'تسجيل زيارة وتحديث العداد فوراً' : 'Enregistrer une visite (+1)'}
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? '+1 تجربة زيارة' : '+1 Visite'}</span>
              </button>
            )}

            {/* Reset to Zero Button */}
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
              title={lang === 'ar' ? 'إعادة ضبط العداد والبدء من الصفر' : 'Remettre à 0'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'ar' ? 'إعادة الحساب من الصفر' : 'Remise à 0'}</span>
            </button>
          </div>
        </div>

        {/* Reset Confirmation Banner */}
        {showConfirmReset && (
          <div className="mx-5 my-3 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5 text-rose-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>
                {lang === 'ar'
                  ? 'هل تريد بالتأكيد تصفير العداد والبدء من الصفر مجدداً؟'
                  : 'Voulez-vous vraiment réinitialiser le compteur à zéro ?'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                {lang === 'ar' ? 'نعم، صفّر العداد الآن' : 'Confirmer'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {activeTab === 'admin' ? (
            <AdminAnalytics
              lang={lang}
              onResetToZero={onResetToZero}
              ownerExcluded={ownerExcluded}
              onToggleOwnerExclusion={onToggleOwnerExclusion}
            />
          ) : (
            <>
              {/* Owner Exclusion Shield Status Banner */}
              <div className="p-3.5 rounded-2xl bg-[#101b33] border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex flex-col text-start">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {lang === 'ar' ? 'استثناء دخول مدير الموقع (dawrachid4@gmail.com)' : 'Exclusion du compte administrateur'}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        ownerExcluded !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {ownerExcluded !== false
                          ? (lang === 'ar' ? 'مُفعّل (غير محسوب)' : 'Actif (non compté)')
                          : (lang === 'ar' ? 'غير مُفعّل' : 'Inactif')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {ownerExcluded !== false
                        ? (lang === 'ar' ? '✅ دخولك وتصفحك مستثنى تماماً ولا يُسجّل كزيارة في العداد.' : 'Vos visites personnelles ne sont pas comptées.')
                        : (lang === 'ar' ? '⚠️ يتم احتساب زياراتك حالياً' : 'Vos visites sont comptées')}
                    </p>
                  </div>
                </div>

                {onToggleOwnerExclusion && (
                  <button
                    type="button"
                    onClick={() => onToggleOwnerExclusion(ownerExcluded === false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 border ${
                      ownerExcluded !== false
                        ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {ownerExcluded !== false
                      ? (lang === 'ar' ? 'حمايتي مفعّلة' : 'Protection active')
                      : (lang === 'ar' ? 'استثناء دخولي' : 'Exclure mon entrée')}
                  </button>
                )}
              </div>

              {/* 1. Key Metrics 3-Grid (Pure Real Data) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* Total Visitors */}
                <div className="bg-[#141b2e] border border-sky-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-medium">{lang === 'ar' ? 'إجمالي الزيارات الفعلية' : 'Total Visites Réelles'}</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {totalVisitors.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-1 font-medium">
                    {totalVisitors === 0 ? (lang === 'ar' ? 'العداد في الصفر 0' : 'Compteur à 0') : (lang === 'ar' ? 'رصد دقيق ومباشر' : 'Enregistrement réel')}
                  </div>
                </div>

                {/* Online Now */}
                <div className="bg-[#141b2e] border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-medium">{lang === 'ar' ? 'المتصلون الفعليون' : 'En Ligne Réels'}</span>
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    {onlineNow}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    {lang === 'ar' ? 'الجلسات النشطة حالياً' : 'Sessions actives'}
                  </div>
                </div>

                {/* Real Countries Reached */}
                <div className="bg-[#141b2e] border border-purple-500/30 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-medium">{lang === 'ar' ? 'الدول المسجلة' : 'Pays Enregistrés'}</span>
                    <Compass className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono tracking-tight">
                    {topCountries.length}
                  </div>
                  <div className="text-[10px] text-purple-400 mt-1 font-medium">
                    {topCountries.length === 0 ? (lang === 'ar' ? 'بانتظار رصد الزوار' : 'En attente') : (lang === 'ar' ? 'دول حقيقية رُصدت' : 'Pays détectés')}
                  </div>
                </div>
              </div>

              {/* 2. Detected User Location Card */}
              <div className="bg-gradient-to-r from-[#172342] via-[#1b2b52] to-[#172342] border border-cyan-500/40 rounded-2xl p-3.5 sm:p-4 shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                    {visitorLocation.flag}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {lang === 'ar' ? 'موقعك المكتشف حالياً' : 'Votre Emplacement'}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-1.5 mt-0.5">
                      <span>{visitorLocation.country}</span>
                      <span className="text-slate-400 font-normal text-xs sm:text-sm">({visitorLocation.city})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                      <span>IP: {visitorLocation.ip}</span>
                      {visitorLocation.timezone && <span>• {visitorLocation.timezone}</span>}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end text-end shrink-0">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-medium">
                    {visitorLocation.countryCode}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {lang === 'ar' ? 'اتصال موثّق' : 'Connexion vérifiée'}
                  </span>
                </div>
              </div>

              {/* 3. Top Countries Distribution Breakdown */}
              <div className="bg-[#12192b] border border-[#232f4c] rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-bold text-white">
                      {lang === 'ar' ? 'توزيع الزوار حسب الدول المسجلة فعلياً' : 'Distribution Réelle par Pays'}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {topCountries.length} {lang === 'ar' ? 'دول' : 'pays'}
                  </span>
                </div>

                {topCountries.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-[#0e1320] rounded-xl border border-dashed border-[#2b3552]">
                    <p className="font-semibold text-slate-300">
                      {lang === 'ar' ? 'العداد يبدأ من الصفر (0)' : 'Le compteur démarre à zéro'}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {lang === 'ar'
                        ? 'سيتم تسجيل وإظهار كل دولة بشكل حقيقي مع كل زيارة جديدة تدخل للتطبيق.'
                        : 'Chaque pays sera enregistré lors de chaque visite réelle.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {topCountries.map((country) => (
                      <div key={country.code} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{country.flag}</span>
                            <span className="font-semibold text-slate-200">{country.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-400 text-[11px]">{country.count} {lang === 'ar' ? 'زيارة' : 'visites'}</span>
                            <span className="font-bold text-cyan-400 text-xs min-w-[38px] text-end">{country.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-[#1b253e] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(10, country.percentage))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#1f283f] bg-[#0c101c] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {lang === 'ar' ? 'نظام عداد حقيقي ومحمي الخصوصية' : 'Système de compteur réel'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-semibold transition-all cursor-pointer shadow-sm text-xs"
          >
            {lang === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
