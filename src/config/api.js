/**
 * Central API Configuration
 * Ensures fallback to live Koyeb API backend even if legacy env vars are present on hosting platforms.
 */
export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_BASE_URL;
  if (!envUrl || envUrl.includes("old-emelia")) {
    return "https://screeching-cherye-filmy4uhd-b60bef55.koyeb.app";
  }
  return envUrl;
};

export const BASE_URL = getBaseUrl();
