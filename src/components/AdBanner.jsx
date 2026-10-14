import React, { useEffect, useRef } from "react";

/**
 * AdBanner component to dynamically render ads in React pages.
 * Supports:
 *   - Google AdSense Display Ads (using slot prop)
 *   - Generic script / iframe / banner codes via VITE_AD_BANNER_CODE in .env
 */
export default function AdBanner({
  slot = "5754054742",
  className = "my-6",
  style = { display: "block" },
  format = "auto",
}) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-9543073887536718";
  const customAdCode = import.meta.env.VITE_AD_BANNER_CODE;
  const adRef = useRef(null);

  useEffect(() => {
    // If using AdSense, safely push the adsbygoogle array once per element
    if (!customAdCode && slot && adRef.current) {
      const isAlreadyLoaded = adRef.current.getAttribute("data-adsbygoogle-status");
      if (!isAlreadyLoaded) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          // Gracefully caught - adblocker active or already pushed
        }
      }
    }
  }, [slot, customAdCode]);

  // If custom ad HTML is configured (e.g. Adsterra / Hilltop / Monetag scripts or iframe), render it
  if (customAdCode) {
    return (
      <div
        className={`w-full flex justify-center overflow-hidden max-w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: customAdCode }}
      />
    );
  }

  // Fallback to Google AdSense Display ad
  const safeStyle = {
    display: "block",
    minHeight: "90px",
    width: "100%",
    ...style,
    maxWidth: "100%",
  };

  return (
    <div className={`w-full flex justify-center items-center overflow-hidden max-w-full rounded-2xl bg-white/[0.02] border border-white/5 ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={safeStyle}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
