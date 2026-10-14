/**
 * playerLauncher.js
 * Universal Player Launcher & Direct Downloader
 * 
 * Strict requirement:
 * - Online streaming ALWAYS redirects to NextPlayer app (com.nextplayer.pro)
 * - If NextPlayer is not installed, automatically redirects to Google Play Store to install it
 * - Direct download triggers an immediate file download
 */

export const NEXTPLAYER_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.nextplayer.pro";
export const MX_PLAY_LINK = "https://play.google.com/store/apps/details?id=com.mxtech.videoplayer.ad";
export const VLC_PLAY_LINK = "https://play.google.com/store/apps/details?id=org.videolan.vlc";

/**
 * Launch NextPlayer via Android Intent with automatic Play Store fallback
 * @param {string} directStreamUrl - Direct video stream URL (http/https)
 * @param {string} title - Media title for the player display
 */
export function launchNextPlayer(directStreamUrl, title = "Online Stream") {
  if (!directStreamUrl) return;

  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  const encodedTitle = encodeURIComponent(title);
  const isHttps = directStreamUrl.startsWith("https");
  const scheme = isHttps ? "https" : "http";
  const cleanUrl = directStreamUrl.replace(/^https?:\/\//, "");
  const packageName = "com.nextplayer.pro";
  const playStoreUrl = NEXTPLAYER_PLAY_LINK;
  const encodedFallback = encodeURIComponent(playStoreUrl);

  if (isAndroid) {
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;type=video/*;package=${packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodedFallback};end`;

    const start = Date.now();
    setTimeout(() => {
      // If the app wasn't opened and page remains visible after 1.5s, redirect to Play Store
      if (Date.now() - start < 2500 && !document.hidden) {
        window.location.href = playStoreUrl;
      }
    }, 1500);

    window.location.href = intentUrl;
    return;
  }

  // Desktop (Windows / Mac) fallback
  // Open direct stream or offer external app
  window.open(directStreamUrl, "_blank", "noopener,noreferrer");
}

/**
 * Launch MX Player via Android Intent
 */
export function launchMxPlayer(directStreamUrl, title = "Online Stream") {
  if (!directStreamUrl) return;

  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  const encodedTitle = encodeURIComponent(title);
  const isHttps = directStreamUrl.startsWith("https");
  const scheme = isHttps ? "https" : "http";
  const cleanUrl = directStreamUrl.replace(/^https?:\/\//, "");
  const packageName = "com.mxtech.videoplayer.ad";
  const playStoreUrl = MX_PLAY_LINK;
  const encodedFallback = encodeURIComponent(playStoreUrl);

  if (isAndroid) {
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;type=video/*;package=${packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodedFallback};end`;

    const start = Date.now();
    setTimeout(() => {
      if (Date.now() - start < 2500 && !document.hidden) {
        window.location.href = playStoreUrl;
      }
    }, 1500);

    window.location.href = intentUrl;
    return;
  }

  window.open(directStreamUrl, "_blank", "noopener,noreferrer");
}

/**
 * Launch VLC Player
 */
export function launchVlcPlayer(directStreamUrl, title = "Online Stream") {
  if (!directStreamUrl) return;

  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
  const encodedTitle = encodeURIComponent(title);
  const isHttps = directStreamUrl.startsWith("https");
  const scheme = isHttps ? "https" : "http";
  const cleanUrl = directStreamUrl.replace(/^https?:\/\//, "");
  const packageName = "org.videolan.vlc";
  const playStoreUrl = VLC_PLAY_LINK;
  const encodedFallback = encodeURIComponent(playStoreUrl);

  if (isAndroid) {
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;type=video/*;package=${packageName};S.title=${encodedTitle};S.browser_fallback_url=${encodedFallback};end`;

    const start = Date.now();
    setTimeout(() => {
      if (Date.now() - start < 2500 && !document.hidden) {
        window.location.href = playStoreUrl;
      }
    }, 1500);

    window.location.href = intentUrl;
    return;
  }

  // Desktop VLC protocol
  window.location.href = `vlc://${directStreamUrl}`;
  setTimeout(() => {
    window.open(directStreamUrl, "_blank", "noopener,noreferrer");
  }, 1200);
}

/**
 * Trigger Instant Direct File Download
 * @param {string} url - Download URL
 * @param {string} filename - Optional file name
 */
export function triggerDirectDownload(url, filename = "") {
  if (!url) return;
  const downloadUrl = url.includes("dl=1")
    ? url
    : (url.includes("?") ? `${url}&dl=1` : `${url}?dl=1`);

  const a = document.createElement("a");
  a.href = downloadUrl;
  if (filename) a.download = filename;
  a.setAttribute("target", "_blank");
  a.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try { document.body.removeChild(a); } catch {}
  }, 300);
}
