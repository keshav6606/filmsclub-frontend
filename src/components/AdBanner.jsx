import React, { useEffect } from "react";

/**
 * AdBanner component to dynamically render ads in React pages.
 * Supports:
 *   - Google AdSense Display Ads (using slot prop)
 *   - Generic script / iframe / banner codes via VITE_AD_BANNER_CODE in .env
 */
export default function AdBanner({ slot, style = { display: "block" }, format = "auto" }) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT || "ca-pub-9543073887536718";
  const customAdCode = import.meta.env.VITE_AD_BANNER_CODE;

  useEffect(() => {
    // If using AdSense, push the adsbygoogle array
    if (!customAdCode && slot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("Google AdSense adsbygoogle push failed:", e);
      }
    }
  }, [slot, customAdCode]);

  // If the user has configured custom ad HTML (like Adsterra / Hilltop / Monetag scripts or iframe), render it
  if (customAdCode) {
    return (
      <div 
        className="w-full flex justify-center my-6 overflow-hidden max-w-full"
        dangerouslySetInnerHTML={{ __html: customAdCode }}
      />
    );
  }

  // Fallback to Google AdSense Display ad
  return (
    <div className="w-full flex justify-center my-6 overflow-hidden max-w-full">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
