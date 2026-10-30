import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSenseBannerProps {
  slot?: string;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slot,
  className = '',
  format = 'auto',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only push if not already processed by AdSense
    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        const adElement = adRef.current;
        if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      }
    } catch (err) {
      console.debug('AdSense banner notice:', err);
    }
  }, []);

  return (
    <div
      className={`rounded-2xl bg-[#14161f] border border-[#272a38] p-2.5 sm:p-3 text-center overflow-hidden transition-all shadow-md relative flex flex-col justify-between ${className}`}
      dir="ltr"
    >
      <div className="flex items-center justify-between pb-1 px-1 mb-1 border-b border-[#232635] text-[10px] text-slate-400">
        <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase">
          Google AdSense
        </span>
        <span className="px-1.5 py-0.2 rounded bg-[#1e2230] text-slate-400 font-sans text-[9px]">
          إعلان / Ad
        </span>
      </div>

      <div className="min-h-[65px] flex items-center justify-center overflow-hidden w-full relative">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '65px', width: '100%' }}
          data-ad-client="ca-pub-3312377428939400"
          {...(slot ? { 'data-ad-slot': slot } : {})}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdSenseBanner;
