import { bacYearScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import { Home, ChevronLeft, ArrowLeft, BookOpen } from "lucide-react";

type PageProps = {
  params: Promise<{ year: string }>;
};

const streamPalette = [
  { bg: "#A7F3D0", text: "#065F46" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#F3F4F6", text: "#374151" },
];

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function BacYearPage({ params }: PageProps) {
  const { year } = await params;
  const data = await bacYearScraper(year);

  return (
    <main
      className="min-h-screen font-['Tajawal']"
      style={{ background: "#F7F3EC" }}
    >
      <SecondaryHeader />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* ─── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/bac-solutions" className="hover:text-[#7C3AED] transition-colors">
            مواضيع البكالوريا
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {year}
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            الأرشيف الرسمي
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            مواضيع و حلول{" "}
            <span className="text-[#7C3AED] italic">بكالوريا {year}</span>
          </h1>
          {data.description && (
            <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* ─── Section Title ──────────────────────────────────────── */}
        <div className="mb-6">
          <h2 className="font-black text-base text-[#1A1A1A]">الشعب</h2>
          <p className="text-xs mt-1" style={{ color: "#999" }}>
            اختر الشعبة لتصفح المواد والامتحانات
          </p>
        </div>

        {/* ─── Streams Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.streams.map((stream, i) => {
            const c = streamPalette[i % streamPalette.length];
            return (
              <Link
                key={stream.slug}
                href={`/bac-solutions/year/${year}/${stream.slug}`}
                className="group bg-white rounded-2xl p-4 hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.bg }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: c.text }} />
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {stream.subtitle}
                  </span>
                </div>

                <strong className="block font-black text-sm text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors mb-2">
                  {stream.title}
                </strong>

                <span
                  className="inline-flex items-center gap-1 text-xs font-bold group-hover:gap-2 transition-all"
                  style={{ color: c.text }}
                >
                  عرض المواد
                  <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* ─── Back Link ──────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#E8E2D8" }}>
          <Link
            href="/bac-solutions"
            className="inline-flex items-center gap-2 text-xs font-bold hover:text-[#7C3AED] transition-colors"
            style={{ color: "#777" }}
          >
            <ArrowLeft className="w-3 h-3 rotate-180" />
            العودة إلى جميع السنوات
          </Link>
        </div>

        {/* ─── Empty State ────────────────────────────────────────── */}
        {data.streams.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#5B21B6" }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد شعب متاحة لهذه السنة
            </p>
          </div>
        )}

      </div>
    </main>
  );
}