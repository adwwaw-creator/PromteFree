import { useState, useEffect, useCallback } from 'react';
import {
  getStoredDb,
  resetAnalyticsToZero,
  recordRealVisit,
  getCountryFlagEmoji,
  getOrCreateVisitorId,
  isCurrentSessionOwner,
  isOwnerExcluded,
  setOwnerExcluded,
  purgeOwnerVisits,
} from '../utils/realAnalytics';

export interface VisitorLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  ip: string;
  flag: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface CountryStat {
  code: string;
  name: string;
  flag: string;
  count: number;
  percentage: number;
}

export interface RecentVisitor {
  id: string;
  country: string;
  city: string;
  flag: string;
  actionAr: string;
  actionEn: string;
  timeAgoAr: string;
  timeAgoEn: string;
}

export function getCountryFlag(countryCode?: string): string {
  return getCountryFlagEmoji(countryCode);
}

export function useVisitorAnalytics() {
  const [visitorLocation, setVisitorLocation] = useState<VisitorLocation>({
    country: 'المغرب',
    countryCode: 'MA',
    city: 'الدار البيضاء',
    region: 'المنطقة الحضرية',
    ip: '105.158.***.***',
    flag: '🇲🇦',
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [ownerExcluded, setOwnerExcludedState] = useState<boolean>(() => isOwnerExcluded());

  // Read actual real totals from verified database (strictly excluding the owner/admin)
  const getRealCounts = useCallback(() => {
    const db = getStoredDb();
    const ownerId = getOrCreateVisitorId();
    const shouldExcludeOwner = isCurrentSessionOwner() && isOwnerExcluded();

    // Filter out owner's visitor id if excluded
    const activeVisitors = shouldExcludeOwner
      ? db.visitorDays.filter((v) => v.visitor !== ownerId)
      : db.visitorDays;

    const uniqueSet = new Set(activeVisitors.map((v) => v.visitor));
    const uniqueCount = uniqueSet.size;

    // If owner is excluded and no other external visitor has entered, views are strictly 0
    let totalViews = 0;
    if (!shouldExcludeOwner || uniqueCount > 0) {
      totalViews = db.dailyStats.reduce((sum, item) => sum + item.views, 0);
    }

    // Aggregate top real countries
    const countryMap = new Map<string, number>();
    if (totalViews > 0) {
      for (const stat of db.dailyStats) {
        const prev = countryMap.get(stat.country) || 0;
        countryMap.set(stat.country, prev + stat.views);
      }
    }

    const countries: CountryStat[] = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => {
        const percentage = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
        return {
          code,
          name: code,
          flag: getCountryFlagEmoji(code),
          count,
          percentage,
        };
      });

    return {
      totalViews,
      uniqueCount,
      countries,
      // Active online is at least 1 when views > 0 (current session viewing site), or 0 when reset
      online: totalViews > 0 ? Math.max(1, uniqueCount) : 0,
    };
  }, []);

  const [metrics, setMetrics] = useState(getRealCounts);

  const refreshMetrics = useCallback(() => {
    setMetrics(getRealCounts());
  }, [getRealCounts]);

  // Record a manual or test visit
  const recordVisitManual = useCallback(async (countryCode?: string, city?: string) => {
    await recordRealVisit(countryCode, city);
    refreshMetrics();
  }, [refreshMetrics]);

  // Toggle owner exclusion setting
  const toggleOwnerExclusion = useCallback((exclude: boolean) => {
    setOwnerExcluded(exclude);
    setOwnerExcludedState(exclude);
    if (exclude) {
      purgeOwnerVisits();
    }
    setMetrics(getRealCounts());
  }, [getRealCounts]);

  // Handle resetting counter to zero
  const resetCounter = useCallback(() => {
    resetAnalyticsToZero();
    setMetrics({
      totalViews: 0,
      uniqueCount: 0,
      countries: [],
      online: 0,
    });
  }, []);

  // Fetch real client geolocation on mount
  useEffect(() => {
    let isMounted = true;

    async function detectLocation() {
      setIsLoadingLocation(true);
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!res.ok) throw new Error('Primary geo failed');
        const data = await res.json();

        if (isMounted && data) {
          const code = (data.country_code || 'MA').toUpperCase();
          const flag = getCountryFlagEmoji(code);
          const detectedLoc: VisitorLocation = {
            country: data.country || 'المغرب',
            countryCode: code,
            city: data.city || 'الدار البيضاء',
            region: data.region || 'المنطقة الحضرية',
            ip: data.ip ? data.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.***.***') : '105.158.***.***',
            flag,
            latitude: data.latitude ? parseFloat(data.latitude) : undefined,
            longitude: data.longitude ? parseFloat(data.longitude) : undefined,
            timezone: data.timezone,
          };
          setVisitorLocation(detectedLoc);
        }
      } catch (err) {
        console.debug('Geolocation fallback used:', err);
      } finally {
        if (isMounted) setIsLoadingLocation(false);
      }
    }

    detectLocation();

    // Listen for real database updates & resets
    const handleUpdate = () => refreshMetrics();
    window.addEventListener('arabiprompt_analytics_updated', handleUpdate);
    window.addEventListener('arabiprompt_analytics_reset', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('arabiprompt_analytics_updated', handleUpdate);
      window.removeEventListener('arabiprompt_analytics_reset', handleUpdate);
    };
  }, [refreshMetrics]);

  return {
    visitorLocation,
    isLoadingLocation,
    totalVisitors: metrics.totalViews,
    uniqueVisitors: metrics.uniqueCount,
    onlineNow: metrics.online,
    topCountries: metrics.countries,
    ownerExcluded,
    toggleOwnerExclusion,
    resetCounter,
    recordVisitManual,
    refreshMetrics,
  };
}
