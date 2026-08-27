import { bacStreamScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  FileText,
  CheckCircle2,

  BookOpen,
} from "lucide-react";
import {  Check } from 'lucide-react';

type PageProps = {
  params: Promise<{ year: string; subject: string }>;
};

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function BacStreamPage({ params }: PageProps) {
  const { year, subject } = await params;
  const data = await bacStreamScraper(year, subject);
  const total = data.subjects.length;

  return (
    <main className="min-h-screen font-['Tajawal']" style={{ background: "#F7F3EC" }}>
      <SecondaryHeader />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* ─── Breadcrumb ─────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAA" }}>
          <Link href="/" className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors">
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/bac-solutions" className="hover:text-[#7C3AED] transition-colors">
            مواضيع البكالوريا
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href={`/bac-solutions/year/${year}`} className="hover:text-[#7C3AED] transition-colors">
            {year}
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold truncate" style={{ color: "#7C3AED" }}>
            {data.title}
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            بكالوريا {year}
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {data.title}
          </h1>
          {data.description && (
            <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* ─── Stats Bar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-4 p-3 rounded-xl mb-6" style={{ background: "#fff" }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "#7C3AED" }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {total} مادة
            </span>
          </div>
        </div>

        {/* ─── Subjects Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.subjects.map((sub, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${sub.color}1A` }}
                >
                  {sub.icon ? (
                    <img src={sub.icon} alt="" width={30} height={30} loading="lazy" />
                  ) : (
                    <BookOpen className="w-6 h-6" style={{ color: sub.color }} />
                  )}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-base text-[#1A1A1A] mb-1">
                    {sub.title}
                  </h3>
                  {sub.subtitle && (
                    <p className="text-xs" style={{ color: "#999" }}>
                      {sub.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {sub.topic && (
                  <Link
                    href={`/pdf${sub.topic.path}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
                    style={{ background: sub.color }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {sub.topic.text}
                  </Link>
                )}

                {sub.correction && (
                  <Link
                    href={`/pdf${sub.correction.path}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] border-2"
                    style={{
                      color: sub.color,
                      borderColor: sub.color,
                      background: `${sub.color}0A`,
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {sub.correction.text}
                  </Link>
                )}

                {sub.detailedCorrection && (
                  <Link
                    href={`/pdf${sub.detailedCorrection.path}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] border-2"
                    style={{
                      color: "#065F46",
                      borderColor: "#065F46",
                      background: "#A7F3D033",
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {sub.detailedCorrection.text}
                  </Link>
                )}

                {!sub.topic && !sub.correction && !sub.detailedCorrection && (
                  <span className="text-xs" style={{ color: "#999" }}>
                    لا توجد ملفات متاحة
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Empty State ────────────────────────────────────────── */}
        {data.subjects.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#5B21B6" }} />
            </div>
            <p className="text-xs" style={{ color: "#777" }}>
              لا توجد مواد متاحة
            </p>
          </div>
        )}

        {/* ─── Back Link ──────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#E8E2D8" }}>
          <Link
            href={`/bac-solutions/year/${year}`}
            className="inline-flex items-center gap-2 text-xs font-bold hover:text-[#7C3AED] transition-colors"
            style={{ color: "#777" }}
          >
            <ChevronLeft className="w-3 h-3 rotate-180" />
            العودة إلى شعب {year}
          </Link>
        </div>

      </div>
    </main>
  );
}