import React, { useEffect, useState } from 'react';
import {
  fetchRealAnalytics,
  RealAnalyticsData,
  getCustomWorkerUrl,
  saveCustomWorkerUrl,
  getOrCreateVisitorId,
  resetAnalyticsToZero,
  isOwnerExcluded,
  setOwnerExcluded,
  purgeOwnerVisits,
} from '../utils/realAnalytics';
import { SupportedLanguage } from '../types';
import {
  BarChart3,
  Users,
  Eye,
  MapPin,
  RefreshCw,
  Server,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface AdminAnalyticsProps {
  lang: SupportedLanguage;
  onResetToZero?: () => void;
  ownerExcluded?: boolean;
  onToggleOwnerExclusion?: (exclude: boolean) => void;
}

export function AdminAnalytics({
  lang,
  onResetToZero,
  ownerExcluded: propOwnerExcluded,
  onToggleOwnerExclusion: propToggleOwnerExclusion,
}: AdminAnalyticsProps) {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<RealAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [workerUrlInput, setWorkerUrlInput] = useState<string>(getCustomWorkerUrl());
  const [isSavedUrl, setIsSavedUrl] = useState<boolean>(false);
  const [visitorId, setVisitorId] = useState<string>('');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);
  const [localOwnerExcluded, setLocalOwnerExcluded] = useState<boolean>(() => isOwnerExcluded());

  const ownerExcluded = propOwnerExcluded !== undefined ? propOwnerExcluded : localOwnerExcluded;

  const handleToggleOwnerExclusion = (val: boolean) => {
    if (propToggleOwnerExclusion) {
      propToggleOwnerExclusion(val);
    } else {
      setOwnerExcluded(val);
      setLocalOwnerExcluded(val);
      if (val) {
        purgeOwnerVisits();
      }
    }
    loadData(days);
  };

  const isRtl = lang === 'ar';

  const loadData = async (selectedDays: number) => {
    setIsLoading(true);
    try {
      const stats = await fetchRealAnalytics(selectedDays);
      setData(stats);
    } catch (err) {
      console.error('Failed to load real analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setVisitorId(getOrCreateVisitorId());
    loadData(days);
  }, [days]);

  const handleSaveWorkerUrl = () => {
    saveCustomWorkerUrl(workerUrlInput);
    setIsSavedUrl(true);
    setTimeout(() => setIsSavedUrl(false), 3000);
    loadData(days);
  };

  const handleConfirmReset = () => {
    resetAnalyticsToZero();
    if (onResetToZero) onResetToZero();
    setShowConfirmReset(false);
    loadData(days);
  };

  return (
    <div className="w-full flex flex-col gap-4 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Controls: Period selector + Refresh + Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111728] p-3.5 rounded-2xl border border-[#232f4e]">
        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="period-select" className="text-xs font-semibold text-slate-300">
            {lang === 'ar' ? 'الفترة الزمنية:' : 'Période:'}
          </label>
          <select
            id="period-select"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-[#1b253e] border border-[#2e3e68] text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
          >
            <option value={1}>{lang === 'ar' ? 'اليوم (24 ساعة)' : 'Aujourd’hui (24h)'}</option>
            <option value={7}>{lang === 'ar' ? 'آخر 7 أيام' : '7 derniers jours'}</option>
            <option value={30}>{lang === 'ar' ? 'آخر 30 يوماً' : '30 derniers jours'}</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Reset to Zero Button */}
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
            title={lang === 'ar' ? 'إعادة ضبط العداد والبدء من الصفر' : 'Remettre le compteur à 0'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'ar' ? 'إعادة الحساب من الصفر' : 'Remise à zéro'}</span>
          </button>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-mono">
            {data?.source === 'cloudflare-worker' ? 'Cloudflare D1' : (lang === 'ar' ? 'عداد حقيقي 100%' : '100% Real Counter')}
          </span>

          <button
            onClick={() => loadData(days)}
            className="p-1.5 rounded-xl bg-[#1b253e] hover:bg-[#253354] text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#2e3e68]"
            title={lang === 'ar' ? 'تحديث الإحصائيات' : 'Actualiser'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Banner */}
      {showConfirmReset && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-rose-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'هل تريد بالتأكيد تصفير العداد ومسح سجل الزيارات للبدء من الصفر؟'
                : 'Voulez-vous vraiment réinitialiser le compteur à zéro et effacer l’historique ?'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              {lang === 'ar' ? 'نعم، صفّر العداد الآن' : 'Confirmer la remise à 0'}
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

      {/* Owner Exclusion Shield Banner */}
      <div className="p-3.5 rounded-2xl bg-[#0f172a] border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
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
                ownerExcluded
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {ownerExcluded
                  ? (lang === 'ar' ? 'مُفعّل (غير محسوب)' : 'Actif (non compté)')
                  : (lang === 'ar' ? 'غير مُفعّل' : 'Inactif')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {ownerExcluded
                ? (lang === 'ar' ? '✅ دخولك وتصفحك مستثنى تماماً ولا يُسجّل في عداد الزوار أو المتصلين.' : 'Vos propres visites et sessions ne sont pas comptabilisées.')
                : (lang === 'ar' ? '⚠️ يتم احتساب زياراتك حالياً كزائر.' : 'Vos visites sont comptabilisées.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleToggleOwnerExclusion(!ownerExcluded)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer shrink-0 border ${
            ownerExcluded
              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
          }`}
        >
          {ownerExcluded
            ? (lang === 'ar' ? 'حمايتي مفعّلة (مستثنى)' : 'Protection active')
            : (lang === 'ar' ? 'استثناء دخولي الآن' : 'Exclure mes visites')}
        </button>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Page Views */}
        <div className="bg-[#131b2e] border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'مشاهدات الصفحات الحقيقية' : 'Vues réelles'}</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {isLoading ? '...' : (data?.views || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lang === 'ar' ? `خلال ${days} يوم الماضية` : `Sur les ${days} derniers jours`}
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-[#131b2e] border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'زوار فريدون حقيقيون' : 'Visiteurs uniques'}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
            {isLoading ? '...' : (data?.uniqueVisitors || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            {lang === 'ar' ? 'أجهزة ومتصفحات حقيقية' : 'Navigateurs uniques réels'}
          </div>
        </div>

        {/* Locations Count */}
        <div className="bg-[#131b2e] border border-purple-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">{lang === 'ar' ? 'المواقع المسجلة فعلياً' : 'Villes & Pays réels'}</span>
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
            {isLoading ? '...' : (data?.locations.length || 0)}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">
            {lang === 'ar' ? 'مدن ودول تم رصدها' : 'Emplacements géolocalisés'}
          </div>
        </div>
      </div>

      {/* Daily Visits Timeline (Visual Bar Chart) */}
      {data && data.series.length > 0 && (
        <div className="bg-[#111728] border border-[#232f4e] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'سجل الزيارات اليومية الحقيقية' : 'Historique des visites'}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {data.series.length} {lang === 'ar' ? 'أيام' : 'jours'}
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="flex items-end gap-1.5 sm:gap-2 h-28 pt-4 pb-1 overflow-x-auto scrollbar-thin">
            {data.series.map((item) => {
              const maxViews = Math.max(...data.series.map((s) => s.views), 1);
              const heightPct = Math.max(8, Math.round((item.views / maxViews) * 100));
              const shortDate = item.day.slice(5); // MM-DD
              return (
                <div key={item.day} className="flex-1 min-w-[28px] max-w-[42px] flex flex-col items-center gap-1 group h-full justify-end">
                  <span className="text-[9px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-t-md hover:brightness-125 transition-all cursor-pointer"
                    style={{ height: `${item.views === 0 ? 4 : heightPct}%` }}
                    title={`${item.day}: ${item.views} ${lang === 'ar' ? 'مشاهدة' : 'vues'}`}
                  />
                  <span className="text-[9px] font-mono text-slate-400 truncate">
                    {shortDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visitor Locations Table (الدولة، المدينة، المشاهدات) */}
      <div className="bg-[#111728] border border-[#232f4e] rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'مواقع الزوار الفعلية (Visitor Locations)' : 'Emplacements des visiteurs'}</span>
          </h4>
          <span className="text-xs text-slate-400">
            {data?.locations.length || 0} {lang === 'ar' ? 'موقع' : 'lieux'}
          </span>
        </div>

        <div className="overflow-x-auto max-h-56 scrollbar-thin">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-[#232f4e] text-slate-400 text-[11px] font-semibold">
                <th className="py-2 px-3 text-start">{lang === 'ar' ? 'الدولة' : 'Pays'}</th>
                <th className="py-2 px-3 text-start">{lang === 'ar' ? 'المدينة' : 'Ville'}</th>
                <th className="py-2 px-3 text-end">{lang === 'ar' ? 'المشاهدات' : 'Vues'}</th>
                <th className="py-2 px-3 text-end">{lang === 'ar' ? 'النسبة' : '%'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c263e]">
              {data && data.locations.length > 0 ? (
                data.locations.map((loc, idx) => {
                  const pct = data.views > 0 ? Math.round((loc.views / data.views) * 100) : 0;
                  return (
                    <tr key={`${loc.country}-${loc.city}-${idx}`} className="hover:bg-[#162035]/60 transition-colors">
                      <td className="py-2 px-3 font-medium text-slate-200 flex items-center gap-1.5">
                        <span className="text-base">{loc.flag || '🌍'}</span>
                        <span>{loc.country}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">{loc.city}</td>
                      <td className="py-2 px-3 text-end font-mono font-bold text-cyan-300">{loc.views}</td>
                      <td className="py-2 px-3 text-end font-mono text-slate-400 text-[11px]">{pct}%</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    {lang === 'ar' ? 'العداد حالياً في الصفر — لم تسجل زيارات بعد' : 'Le compteur est à zéro — aucune visite enregistrée'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cloudflare Worker Integration Config Box (From ZIP starter) */}
      <div className="bg-[#0f1525] border border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 text-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">
              {lang === 'ar' ? 'ربط Cloudflare Worker & D1 (من ملف ZIP المرفق)' : 'Liaison Cloudflare Worker & D1'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {visitorId ? `ID: ${visitorId.slice(0, 8)}...` : ''}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          {lang === 'ar'
            ? 'يقوم التطبيق بتسجيل وحساب الزيارات الحقيقية تلقائياً. إذا قمت بنشر الـ Worker المرفق في arabiprompt-analytics على Cloudflare، أدخل رابطه هنا للربط المباشر مع قاعدة D1:'
            : 'L’application enregistre automatiquement les visites. Si vous avez déployé le Worker Cloudflare inclus, entrez son URL ici :'}
        </p>

        <div className="flex items-center gap-2">
          <input
            type="url"
            value={workerUrlInput}
            onChange={(e) => setWorkerUrlInput(e.target.value)}
            placeholder="https://arabiprompt-analytics.your-subdomain.workers.dev"
            className="flex-1 bg-[#162035] border border-[#2b3a5e] text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-mono"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleSaveWorkerUrl}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-semibold transition-all shrink-0 cursor-pointer"
          >
            {lang === 'ar' ? 'حفظ ورصد' : 'Enregistrer'}
          </button>
        </div>

        {isSavedUrl && (
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تم حفظ رابط Worker بنجاح' : 'URL enregistrée avec succès'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
