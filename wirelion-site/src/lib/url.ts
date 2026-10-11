/** Absolute site URL. Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time. */
const host = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = host
  ? host.startsWith("http")
    ? host
    : `https://${host}`
  : "http://localhost:3000";
