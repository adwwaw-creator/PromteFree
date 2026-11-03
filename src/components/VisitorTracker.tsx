import { useEffect } from 'react';
import { recordRealVisit, isCurrentSessionOwner, isOwnerExcluded, purgeOwnerVisits } from '../utils/realAnalytics';

export function VisitorTracker() {
  useEffect(() => {
    // If current session is the owner/admin and exclusion is active, do NOT count visit
    if (isCurrentSessionOwner() && isOwnerExcluded()) {
      purgeOwnerVisits();
      return;
    }

    // Record real external visitor on mount
    recordRealVisit().catch((err) => {
      console.debug('VisitorTracker notice:', err);
    });
  }, []);

  return null;
}
