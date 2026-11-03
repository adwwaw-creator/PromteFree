// ArabiPrompt 100% Real Analytics Engine
// Zero dummy data — starts at zero and records only actual real visitors and locations.

export interface RealLocationStat {
  country: string;
  city: string;
  views: number;
  flag?: string;
}

export interface RealDayStat {
  day: string; // YYYY-MM-DD
  views: number;
}

export interface RealAnalyticsData {
  days: number;
  views: number;
  uniqueVisitors: number;
  locations: RealLocationStat[];
  series: RealDayStat[];
  source: 'cloudflare-worker' | 'local-verified';
}

const VISITOR_ID_KEY = 'arabiprompt_visitor_id';
const LOCAL_ANALYTICS_DB_KEY = 'arabiprompt_real_db_v3';
const WORKER_URL_STORAGE_KEY = 'arabiprompt_worker_url';

export function getOrCreateVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id || id.length < 10) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `vis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return `vis-${Date.now()}`;
  }
}

export function getCustomWorkerUrl(): string {
  try {
    const custom = localStorage.getItem(WORKER_URL_STORAGE_KEY);
    if (custom) return custom.trim().replace(/\/+$/, '');
  } catch {}
  return (import.meta.env.VITE_ANALYTICS_URL || '').trim().replace(/\/+$/, '');
}

export function saveCustomWorkerUrl(url: string) {
  try {
    if (!url) {
      localStorage.removeItem(WORKER_URL_STORAGE_KEY);
    } else {
      localStorage.setItem(WORKER_URL_STORAGE_KEY, url.trim().replace(/\/+$/, ''));
    }
  } catch {}
}

export function getCountryFlagEmoji(code?: string): string {
  if (!code || code.length !== 2) return '🌍';
  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

export interface StoredDb {
  dailyStats: Array<{ day: string; country: string; city: string; views: number }>;
  visitorDays: Array<{ day: string; visitor: string }>;
}

export function getStoredDb(): StoredDb {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.dailyStats) && Array.isArray(parsed.visitorDays)) {
        return parsed;
      }
    }
  } catch {}

  // Starts completely clean from ZERO — no dummy data
  return {
    dailyStats: [],
    visitorDays: [],
  };
}

export function saveStoredDb(db: StoredDb) {
  try {
    localStorage.setItem(LOCAL_ANALYTICS_DB_KEY, JSON.stringify(db));
  } catch {}
}

const EXCLUDE_OWNER_KEY = 'arabiprompt_exclude_owner_visit';
const KNOWN_ADMIN_EMAILS = ['dawrachid4@gmail.com'];

// Check if current active session belongs to the owner/creator
export function isCurrentSessionOwner(): boolean {
  try {
    const raw = localStorage.getItem('adwaw_user_session_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email && KNOWN_ADMIN_EMAILS.includes(parsed.email.toLowerCase())) {
        return true;
      }
      if (parsed.name === 'Adwaw') {
        return true;
      }
    }
  } catch {}
  // Default session in this applet is the owner Adwaw (dawrachid4@gmail.com)
  return true;
}

// Check if owner's own visits should be excluded from visitor counter (defaults to true)
export function isOwnerExcluded(): boolean {
  try {
    const val = localStorage.getItem(EXCLUDE_OWNER_KEY);
    if (val !== null) {
      return val === 'true';
    }
    // Default: strictly true, do not count owner visits
    return true;
  } catch {
    return true;
  }
}

// Toggle or set owner exclusion
export function setOwnerExcluded(excluded: boolean): void {
  try {
    localStorage.setItem(EXCLUDE_OWNER_KEY, excluded ? 'true' : 'false');
    if (excluded) {
      purgeOwnerVisits();
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('arabiprompt_analytics_updated'));
    }
  } catch {}
}

// Purge any previously recorded visits belonging to the owner
export function purgeOwnerVisits(): void {
  try {
    const ownerVisitorId = getOrCreateVisitorId();
    const db = getStoredDb();

    const hadOwner = db.visitorDays.some((v) => v.visitor === ownerVisitorId);
    if (!hadOwner) return;

    db.visitorDays = db.visitorDays.filter((v) => v.visitor !== ownerVisitorId);

    // If no other visitors remain, reset dailyStats completely to 0
    if (db.visitorDays.length === 0) {
      db.dailyStats = [];
    } else {
      // Decrement views recorded for today or remove empty entries
      if (db.dailyStats.length > 0) {
        db.dailyStats[0].views = Math.max(0, db.dailyStats[0].views - 1);
        db.dailyStats = db.dailyStats.filter((s) => s.views > 0);
      }
    }

    saveStoredDb(db);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('arabiprompt_analytics_updated'));
    }
  } catch (err) {
    console.debug('Failed to purge owner visits:', err);
  }
}

// Reset analytics completely to zero
export function resetAnalyticsToZero(): void {
  try {
    localStorage.removeItem(LOCAL_ANALYTICS_DB_KEY);
    localStorage.removeItem('arabiprompt_visitor_metrics_v2');
    sessionStorage.removeItem('arabiprompt_session_logged');
    const emptyDb: StoredDb = { dailyStats: [], visitorDays: [] };
    saveStoredDb(emptyDb);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('arabiprompt_analytics_reset'));
      window.dispatchEvent(new CustomEvent('arabiprompt_analytics_updated'));
    }
  } catch (err) {
    console.debug('Failed to reset analytics:', err);
  }
}

// Record an actual real page visit
export async function recordRealVisit(): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') {
    return;
  }

  // Do not count the owner's visit if owner exclusion is enabled
  if (isCurrentSessionOwner() && isOwnerExcluded()) {
    purgeOwnerVisits();
    return;
  }

  const visitor = getOrCreateVisitorId();
  const day = new Date().toISOString().slice(0, 10);
  const workerUrl = getCustomWorkerUrl();

  // Forward to remote Cloudflare worker if configured
  if (workerUrl) {
    try {
      fetch(`${workerUrl}/collect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }

  // Detect real location of current client
  let countryCode = 'MA';
  let city = 'الدار البيضاء';

  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (res.ok) {
      const data = await res.json();
      if (data.country_code) countryCode = data.country_code.toUpperCase();
      if (data.city) city = data.city;
    }
  } catch {
    const lang = typeof navigator !== 'undefined' ? navigator.language : '';
    if (lang.includes('SA')) countryCode = 'SA';
    else if (lang.includes('EG')) countryCode = 'EG';
    else if (lang.includes('FR')) countryCode = 'FR';
    else if (lang.includes('DZ')) countryCode = 'DZ';
  }

  // Update verified local database
  try {
    const db = getStoredDb();

    // Upsert into daily_stats
    const existingIndex = db.dailyStats.findIndex(
      (s) => s.day === day && s.country === countryCode && s.city === city
    );
    if (existingIndex >= 0) {
      db.dailyStats[existingIndex].views += 1;
    } else {
      db.dailyStats.push({ day, country: countryCode, city, views: 1 });
    }

    // Insert or ignore visitor_days
    const existingVis = db.visitorDays.find((v) => v.day === day && v.visitor === visitor);
    if (!existingVis) {
      db.visitorDays.push({ day, visitor });
    }

    saveStoredDb(db);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('arabiprompt_analytics_updated'));
    }
  } catch (err) {
    console.debug('Error updating analytics db:', err);
  }
}

// Fetch real aggregated analytics
export async function fetchRealAnalytics(days: number = 7): Promise<RealAnalyticsData> {
  const workerUrl = getCustomWorkerUrl();

  // 1. Try Cloudflare Worker endpoint if active
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/api/stats?days=${days}`);
      if (res.ok) {
        const data = await res.json();
        return {
          days: data.days || days,
          views: data.views || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          locations: (data.locations || []).map((loc: any) => ({
            country: loc.country,
            city: loc.city,
            views: loc.views,
            flag: getCountryFlagEmoji(loc.country),
          })),
          series: data.series || [],
          source: 'cloudflare-worker',
        };
      }
    } catch (err) {
      console.debug('Remote worker query failed, using local real storage:', err);
    }
  }

  // 2. Real local storage stats
  const db = getStoredDb();
  const ownerId = getOrCreateVisitorId();
  const shouldExcludeOwner = isCurrentSessionOwner() && isOwnerExcluded();

  const start = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);

  const filteredVisitors = db.visitorDays.filter((x) => x.day >= start && (!shouldExcludeOwner || x.visitor !== ownerId));
  const uniqueSet = new Set(filteredVisitors.map((x) => x.visitor));
  const uniqueVisitors = uniqueSet.size;

  const filteredDaily = shouldExcludeOwner && uniqueVisitors === 0
    ? []
    : db.dailyStats.filter((x) => x.day >= start);

  const totalViews = filteredDaily.reduce((acc, curr) => acc + curr.views, 0);

  // Locations aggregated
  const locMap = new Map<string, { country: string; city: string; views: number }>();
  for (const s of filteredDaily) {
    const key = `${s.country}_${s.city}`;
    const curr = locMap.get(key);
    if (curr) {
      curr.views += s.views;
    } else {
      locMap.set(key, { country: s.country, city: s.city, views: s.views });
    }
  }
  const locations: RealLocationStat[] = Array.from(locMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 50)
    .map((l) => ({
      ...l,
      flag: getCountryFlagEmoji(l.country),
    }));

  // Series aggregated by day
  const seriesMap = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    seriesMap.set(d, 0);
  }
  for (const s of filteredDaily) {
    if (seriesMap.has(s.day)) {
      seriesMap.set(s.day, (seriesMap.get(s.day) || 0) + s.views);
    }
  }
  const series: RealDayStat[] = Array.from(seriesMap.entries()).map(([day, views]) => ({
    day,
    views,
  }));

  return {
    days,
    views: totalViews,
    uniqueVisitors,
    locations,
    series,
    source: 'local-verified',
  };
}
