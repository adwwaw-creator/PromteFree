import { useEffect, useRef } from 'react';
import { recordRealVisit, isCurrentSessionOwner, isOwnerExcluded } from '../utils/realAnalytics';

export function VisitorTracker() {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    // If current session is the owner/admin and exclusion is active, do NOT count visit
    if (isCurrentSessionOwner() && isOwnerExcluded()) {
      return;
    }

    // Record real visitor on mount
    recordRealVisit().catch((err) => {
      console.debug('VisitorTracker notice:', err);
    });
  }, []);

  return null;
}
