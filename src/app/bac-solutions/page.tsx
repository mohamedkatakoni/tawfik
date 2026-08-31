import type { Metadata } from "next";
import { bacSolutionsIndex } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import BacTabsClient from "@/components/BacTabsClient";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

const SITE_URL = "https://tawfikdz.online";

export const metadata: Metadata = {
  title: "مواضيع وحلول البكالوريا الجزائر | توفيق",
  description:
    "جميع مواضيع وحلول شهادة البكالوريا الجزائرية منذ 1999 حتى اليوم — تصفح حسب السنة، المادة، أو الشعبة. رياضيات، فيزياء، لغة عربية، لغة فرنسية وأكثر. مجاناً بدون تسجيل.",
  keywords: [
    "مواضيع بكالوريا", "حلول بكالوريا", "بكالوريا جزائر", "BAC algérie",
    "sujets bac", "correction bac", "بكالوريا 2024", "بكالوريا 2023",
    "شعبة علوم تجريبية", "شعبة رياضيات", "شعبة آداب وفلسفة",
    "مواضيع الفيزياء بكالوريا", "مواضيع الرياضيات بكالوريا", "توفيق",
  ],
  alternates: {
    canonical: `${SITE_URL}/bac-solutions`,
  },
  openGraph: {
    title: "مواضيع وحلول البكالوريا الجزائر | توفيق",
    description:
      "جميع مواضيع وحلول شهادة البكالوريا منذ 1999 — حسب السنة والمادة والشعبة. مجاناً بدون تسجيل.",
    url: `${SITE_URL}/bac-solutions`,
    siteName: "توفيق",
    locale: "ar_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مواضيع وحلول البكالوريا الجزائر | توفيق",
    description:
      "جميع مواضيع وحلول شهادة البكالوريا منذ 1999. مجاناً بدون تسجيل — tawfikdz.online",
  },
};

export default async function BacSolutionsPage() {
  const { years, subjects, streams } = await bacSolutionsIndex();

  // JSON-LD: ItemList of BAC years for Google rich results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "مواضيع وحلول البكالوريا", item: `${SITE_URL}/bac-solutions` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "مواضيع وحلول البكالوريا الجزائرية",
    description: "جميع مواضيع وحلول شهادة البكالوريا الجزائرية منذ 1999 — حسب السنة والمادة والشعبة",
    url: `${SITE_URL}/bac-solutions`,
    inLanguage: "ar",
    isPartOf: { "@type": "WebSite", name: "توفيق", url: SITE_URL },
    about: {
      "@type": "EducationalOccupationalCredential",
      name: "شهادة البكالوريا",
      credentialCategory: "degree",
      recognizedBy: { "@type": "Organization", name: "وزارة التربية الوطنية الجزائرية" },
    },
  };

  return (
    <main
      className="min-h-screen font-['Tajawal']"
      style={{ background: "#F7F3EC" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <SecondaryHeader />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* ─── Breadcrumb ─────────────────────────────────────────── */}
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" aria-hidden="true" />
          <span className="font-semibold" style={{ color: "#7C3AED" }} aria-current="page">
            بكالوريا
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            BAC
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            مواضيع وحلول{" "}
            <span className="text-[#7C3AED] italic">البكالوريا</span>
          </h1>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "#777" }}>
            جميع مواضيع وحلول شهادة البكالوريا منذ 1999 — تصفح حسب السنة، المادة أو الشعبة
          </p>
        </div>

        {/* ─── Tabs (Client) ──────────────────────────────────────── */}
        <BacTabsClient years={years} subjects={subjects} streams={streams} />

      </div>
    </main>
  );
}