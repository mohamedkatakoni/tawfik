import type { MetadataRoute } from "next";

const SITE_URL = "https://tawfikdz.online/";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all standard crawlers on all public pages
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",  // internal routes — no value for crawlers
          "/pdf/",  // raw PDF viewer — individual PDFs already covered via sitemaps
        ],
      },
      {
        // Block AI training crawlers
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Google-Extended",
          "Bytespider",
          "Amazonbot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}