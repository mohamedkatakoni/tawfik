// src/app/pdf/[pdfurl]/page.tsx
import type { Metadata } from "next";
import { pdfIfarem } from "@/scraper";
import Link from "next/link";
import SecondaryHeader from "@/components/SecondaryHeader";
import DownloadButton from "@/components/DownloadButton";
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  Home,
} from "lucide-react";

type PageProps = {
  params: Promise<{ pdfurl: string }>;
};

export const dynamic = "force-static";
export const revalidate = 259200;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pdfurl } = await params;
  const { description } = await pdfIfarem(pdfurl);

  const title = description || "ملف PDF";
  const seoDescription = `تصفح وحمّل مجاناً: ${title}. مواضيع وحلول وفروض محلولة على موقع توفيق — المنصة التعليمية الجزائرية.`;

  return {
    title,
    description: seoDescription,
    openGraph: {
      title: `${title} | توفيق`,
      description: seoDescription,
      type: "article",
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `/pdf/${pdfurl}` },
  };
}

/* Base64URL encode (browser-safe) */
function toBase64Url(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default async function PdfPage({ params }: PageProps) {
  const { pdfurl } = await params;
  const {
    viewerUrl,
    pdfFileUrl,
    description,
    urlDownload,
    realtedItems,
    examsList,
  } = await pdfIfarem(pdfurl);

  // ── Brave-safe proxy URL (no ?url=https://… pattern) ──
  const proxiedUrl = pdfFileUrl
    ? `/api/pdf-proxy?r=${toBase64Url(pdfFileUrl)}`
    : null;

  const documentSchema = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: description || "ملف PDF",
    description: `${description} — متاح مجاناً على موقع توفيق`,
    inLanguage: "ar",
    encodingFormat: "application/pdf",
    isAccessibleForFree: true,
    publisher: { "@type": "EducationalOrganization", name: "توفيق" },
  };

  return (
    <main className="min-h-screen font-['Tajawal']" style={{ background: "#F7F3EC" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(documentSchema) }}
      />

      <SecondaryHeader />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold truncate max-w-xs" style={{ color: "#7C3AED" }}>
            {description || "ملف PDF"}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
            عرض الملف
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {description || "ملف PDF"}
          </h1>
        </div>

        {/* PDF Viewer */}
        <div
          className="rounded-3xl overflow-hidden mb-4"
          style={{ background: "#fff", border: "1.5px solid #E8E2D8" }}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid #E8E2D8" }}
          >
            <span
              className="flex items-center gap-1.5 text-xs font-bold font-['Tajawal']"
              style={{ color: "#AAA" }}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF Viewer
            </span>

            <a
              href={viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold hover:text-[#6D28D9] transition-colors font-['Tajawal']"
              style={{ color: "#7C3AED" }}
            >
              <ExternalLink className="w-3 h-3" />
              فتح في تبويب جديد
            </a>
          </div>

          {/* iframe */}
          <div className="relative w-full" style={{ height: "75vh" }}>
            {proxiedUrl ? (
            <iframe
    src={proxiedUrl}
    className="w-full h-full border-0"
    title={description || "PDF Viewer"}
    allow="fullscreen"
    // sandbox removed — proxy CSP already handles security
  />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "#EDE9FE" }}
                >
                  <FileText className="w-7 h-7" style={{ color: "#7C3AED" }} />
                </div>
                <p className="font-bold text-[#1A1A1A] font-['Tajawal']">
                  لا يمكن عرض الملف هنا
                </p>
                <p className="text-sm font-['Tajawal']" style={{ color: "#999" }}>
                  جرب فتحه في تبويب جديد
                </p>
                {viewerUrl && (
                  <a
                    href={viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white font-['Tajawal']"
                    style={{ background: "#7C3AED" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح الملف
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div
          className="flex items-center justify-between gap-4 p-4 rounded-2xl mb-8 flex-wrap"
          style={{ background: "#fff", border: "1.5px solid #E8E2D8" }}
        >
          <div>
            <p className="font-black text-[#1A1A1A] text-sm font-['Tajawal']">
              {description || "ملف PDF"}
            </p>
            <p className="text-xs font-['Tajawal'] mt-0.5" style={{ color: "#AAA" }}>
              مجاني — بدون تسجيل
            </p>
          </div>

          <div className="flex items-center gap-3">
            {viewerUrl && (
              <a
                href={viewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 text-sm font-bold font-['Tajawal'] transition-colors hover:border-[#7C3AED] hover:text-[#7C3AED]"
                style={{ borderColor: "#E8E2D8", color: "#555" }}
              >
                <ExternalLink className="w-4 h-4" />
                فتح
              </a>
            )}
            {urlDownload && (
              <DownloadButton
                url={urlDownload}
                fileName={`tawfik-${pdfurl}.pdf`}
              />
            )}
          </div>
        </div>

        {/* Related Exams */}
        {examsList.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#7C3AED" }}>
              اختبارات ومواضيع ذات صلة
            </p>
            <div className="space-y-2">
              {examsList.map((exam, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl"
                  style={{ background: "#fff", border: "1.5px solid #E8E2D8" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "#FEF3C7" }}
                  >
                    <FileText className="w-4 h-4" style={{ color: "#92400E" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1A1A1A] font-['Tajawal'] leading-relaxed">
                      {exam.text}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-['Tajawal']" style={{ color: "#999" }}>
                        {exam.year}
                      </span>
                      {exam.hasSolution ? (
                        <span className="text-[10px] font-bold font-['Tajawal'] flex items-center gap-0.5" style={{ color: "#065F46" }}>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          مع الحل
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold font-['Tajawal'] flex items-center gap-0.5" style={{ color: "#9D174D" }}>
                          <XCircle className="w-2.5 h-2.5" />
                          بدون حل
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/pdf/${exam.pathOfPdf}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:bg-[#6D28D9] shrink-0 font-['Tajawal']"
                    style={{ background: "#7C3AED" }}
                  >
                    <Eye className="w-3 h-3" />
                    عرض
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Items */}
        {realtedItems.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#7C3AED" }}>
              مواد ذات صلة
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {realtedItems.map((item, i) => (
                <Link
                  key={i}
                  href={`/pdf/${item.pathOfPdf}`}
                  className="group flex items-center gap-3 p-3.5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: "#fff", border: "1.5px solid #E8E2D8" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                    style={{ background: "#F7F3EC" }}
                  >
                    <img
                      src={item.img}
                      alt={item.text}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="flex-1 text-xs font-bold text-[#1A1A1A] font-['Tajawal'] leading-relaxed group-hover:text-[#7C3AED] transition-colors min-w-0">
                    {item.text}
                  </p>
                  <ChevronLeft
                    className="w-4 h-4 shrink-0 group-hover:text-[#7C3AED] transition-colors"
                    style={{ color: "#CCC" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-[11px] font-['Tajawal'] mt-4" style={{ color: "#CCC" }}>
          مشكلة في العرض؟{" "}
          <a
            href={viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline"
            style={{ color: "#7C3AED" }}
          >
            افتح الملف في تبويب جديد
          </a>
        </p>
      </div>
    </main>
  );
}