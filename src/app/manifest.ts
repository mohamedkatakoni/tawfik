// src/app/manifest.ts
// Next.js auto-serves this at /manifest.json
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "توفيق | منصة تعليمية جزائرية",
    short_name: "توفيق",
    description:
      "دروس، فروض محلولة، اختبارات لجميع المراحل الدراسية في الجزائر. مواضيع وحلول BAC و BEM. مجاناً بدون تسجيل.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F3EC",
    theme_color: "#7C3AED",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icon.png",       sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png",       sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}