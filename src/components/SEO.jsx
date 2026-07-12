import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * SEO Component — handles all meta tags, OG, Twitter Card, canonical, and JSON-LD schemas.
 * Props:
 *  - title, description, keywords, link (canonical URL)
 *  - image (OG image URL)
 *  - type ("website" | "video.movie" | "video.tv_show" | "video.other")
 *  - schema — primary JSON-LD schema object (Movie / TVSeries / WebSite)
 *  - breadcrumbs — array of { name, url } for BreadcrumbList
 *  - name — site name
 */
export default function SEO({
  title,
  description,
  keywords,
  link,
  image,
  type = "website",
  schema,
  breadcrumbs,
  name,
}) {
  const siteName = name || import.meta.env.VITE_SITENAME || "Filmy4uhd";
  const canonicalUrl = link || "https://filmy4uhd.com";
  const ogImage = image || "https://filmy4uhd.com/og-image.jpg";

  // Build BreadcrumbList schema
  const breadcrumbSchema = breadcrumbs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": item.url,
        })),
      }
    : null;

  return (
    <Helmet>
      {/* ── Basic Meta ─────────────────────────────────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content={siteName} />

      {/* ── Open Graph ─────────────────────────────────────────────────── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ───────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@filmy4uhd" />

      {/* ── Primary JSON-LD Schema ─────────────────────────────────────── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* ── BreadcrumbList Schema ──────────────────────────────────────── */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}
