import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

// ─── Change this to your real domain ─────────────────────────────────────────
const SITE_URL = "https://morafik.dz";
const SITE_NAME = "توفيق";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // Required for absolute URLs in OG/Twitter images
  metadataBase: new URL(SITE_URL),

  // Title: default for homepage, template for sub-pages
  // Sub-pages just do: export const metadata = { title: "السنة الرابعة ابتدائي" }
  // and it becomes: "السنة الرابعة ابتدائي | توفيق"
  title: {
    default: "توفيق | دروس واختبارات وفروض لجميع المراحل في الجزائر",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "موقع توفيق — المنصة التعليمية الجزائرية المجانية. دروس، فروض محلولة، اختبارات للتعليم الابتدائي والمتوسط والثانوي. مواضيع وحلول شهادة BEM والبكالوريا BAC من 1996 حتى اليوم. بدون تسجيل.",

  keywords: [
    // Arabic core
    "توفيق",
    "الجزائر",
    "تعليم جزائر",
    "دروس",
    "اختبارات",
    "فروض محلولة",
    // BAC
    "بكالوريا",
    "باكالوريا",
    "مواضيع بكالوريا",
    "حلول بكالوريا",
    "بكالوريا جزائر",
    "BAC algérie",
    "sujets bac",
    // BEM
    "BEM",
    "شهادة التعليم المتوسط",
    "مواضيع BEM",
    "حلول BEM",
    // Stages
    "تعليم ابتدائي",
    "تعليم متوسط",
    "تعليم ثانوي",
    "السنة الأولى ثانوي",
    "السنة الثانية ثانوي",
    "السنة الثالثة ثانوي",
    // Materials
    "رياضيات",
    "فيزياء",
    "لغة عربية",
    "لغة فرنسية",
    "علوم طبيعية",
    // Long tail
    "فروض مع الحلول",
    "اختبارات محلولة",
    "تحضير للامتحانات",
    "مراجعة بكالوريا",
    "eddirasa",
  ],

  authors: [{ name: "Tawfik", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Tell Google to index everything and follow all links
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph — for Facebook, WhatsApp sharing previews
  // Create a 1200×630px image at /public/og-image.jpg
  openGraph: {
    title: "توفيق | دروس واختبارات وفروض لجميع المراحل في الجزائر",
    description:
      "المنصة التعليمية الجزائرية المجانية — دروس، فروض محلولة، مواضيع وحلول BAC و BEM. بدون تسجيل.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_DZ",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "توفيق — الموقع التعليمي الجزائري",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "توفيق | دروس واختبارات وفروض في الجزائر",
    description:
      "المنصة التعليمية الجزائرية المجانية — دروس، فروض محلولة، مواضيع وحلول BAC و BEM.",
    images: ["/og-image.jpg"],
  },

  // Canonical URL — prevents duplicate content penalty
  alternates: {
    canonical: SITE_URL,
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
// This helps Google understand your site and can unlock rich results in search.

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "منصة تعليمية جزائرية مجانية تقدم دروساً واختبارات وفروضاً لجميع المراحل الدراسية",
  inLanguage: "ar",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "موقع توفيق — منصة تعليمية جزائرية مجانية تقدم دروساً واختبارات وفروضاً للتعليم الابتدائي والمتوسط والثانوي، بالإضافة إلى مواضيع وحلول شهادتي BEM والبكالوريا.",
  areaServed: {
    "@type": "Country",
    name: "Algeria",
  },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
  },
  teaches: [
    "التعليم الابتدائي",
    "التعليم المتوسط",
    "التعليم الثانوي",
    "البكالوريا",
    "BEM",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "محتوى تعليمي مجاني",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Course", name: "دروس التعليم الابتدائي" } },
      { "@type": "Offer", itemOffered: { "@type": "Course", name: "دروس التعليم المتوسط" } },
      { "@type": "Offer", itemOffered: { "@type": "Course", name: "دروس التعليم الثانوي" } },
      { "@type": "Offer", itemOffered: { "@type": "Course", name: "مواضيع وحلول البكالوريا" } },
      { "@type": "Offer", itemOffered: { "@type": "Course", name: "مواضيع وحلول BEM" } },
    ],
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} scroll-smooth `} data-scroll-behavior="smooth">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${tajawal.className} antialiased bg-[#F7F3EC]`}>
      <Analytics/>
        {children}
      </body>
    </html>
  );
}