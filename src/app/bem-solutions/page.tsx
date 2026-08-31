import type { Metadata } from "next";
import { bemSolutionsIndex } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import BemTabsClient from "@/components/BemTabsClient";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 259200;

const SITE_URL = "https://tawfikdz.online";

export const metadata: Metadata = {
  title: "مواضيع وحلول شهادة التعليم المتوسط BEM الجزائر | توفيق",
  description:
    "أرشيف كامل لمواضيع وحلول شهادة التعليم المتوسط BEM في الجزائر — تصفح حسب السنة أو المادة. رياضيات، لغة عربية، لغة فرنسية، علوم، تاريخ وجغرافيا. مجاناً بدون تسجيل.",
  keywords: [
    "مواضيع BEM", "حلول BEM", "شهادة التعليم المتوسط", "BEM الجزائر",
    "brevet algérie", "سجل BEM", "مواضيع التعليم المتوسط",
    "حلول شهادة التعليم المتوسط", "BEM 2024", "BEM 2023",
    "مواضيع رياضيات BEM", "مواضيع لغة عربية BEM", "توفيق",
  ],
  alternates: {
    canonical: `${SITE_URL}/bem-solutions`,
  },
  openGraph: {
    title: "مواضيع وحلول شهادة التعليم المتوسط BEM الجزائر | توفيق",
    description:
      "أرشيف كامل لمواضيع وحلول BEM في الجزائر — حسب السنة والمادة. مجاناً بدون تسجيل.",
    url: `${SITE_URL}/bem-solutions`,
    siteName: "توفيق",
    locale: "ar_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مواضيع وحلول BEM الجزائر | توفيق",
    description:
      "أرشيف كامل لمواضيع وحلول شهادة التعليم المتوسط — tawfikdz.online",
  },
};

export default async function BemSolutionsPage() {
  const { years, subjects } = await bemSolutionsIndex();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية",        item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "التعليم المتوسط", item: `${SITE_URL}/ens-cm` },
      { "@type": "ListItem", position: 3, name: "مواضيع وحلول BEM", item: `${SITE_URL}/bem-solutions` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "مواضيع وحلول شهادة التعليم المتوسط BEM",
    description:
      "أرشيف منظم لمواضيع وحلول شهادة التعليم المتوسط في الجزائر حسب السنة والمادة",
    url: `${SITE_URL}/bem-solutions`,
    inLanguage: "ar",
    isPartOf: { "@type": "WebSite", name: "توفيق", url: SITE_URL },
    about: {
      "@type": "EducationalOccupationalCredential",
      name: "شهادة التعليم المتوسط BEM",
      credentialCategory: "degree",
      recognizedBy: {
        "@type": "Organization",
        name: "وزارة التربية الوطنية الجزائرية",
      },
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
          <Link href="/" className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors">
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" aria-hidden="true" />
          <Link href="/ens-cm" className="hover:text-[#7C3AED] transition-colors">
            التعليم المتوسط
          </Link>
          <ChevronLeft className="w-3 h-3" aria-hidden="true" />
          <span className="font-semibold" style={{ color: "#7C3AED" }} aria-current="page">
            مواضيع وحلول BEM
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
            الأرشيف الرسمي
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            مواضيع وحلول شهادة{" "}
            <span className="text-[#7C3AED] italic">التعليم المتوسط</span>
          </h1>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "#777" }}>
            أرشيف منظم لمواضيع وحلول شهادة التعليم المتوسط في الجزائر حسب السنة والمادة.
          </p>
        </div>

        {/* ─── Tabs (Client) ──────────────────────────────────────── */}
        <BemTabsClient years={years} subjects={subjects} />

      </div>
    </main>
  );
}