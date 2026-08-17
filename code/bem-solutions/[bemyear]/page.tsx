import { bemYearScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  FileText,
  Eye,
  BookOpen,
} from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Page ────────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ bemyear: string }>;
};

export default async function BemYearPage({ params }: PageProps) {
  const { bemyear } = await params;
  const { title, description, subjects } = await bemYearScraper(bemyear);

  return (
    <main
      className="min-h-screen font-['Tajawal']"
      style={{ background: "#F7F3EC" }}
    >
      <SecondaryHeader />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/bem-solutions" className="hover:text-[#7C3AED] transition-colors">
            شهادة التعليم المتوسط
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {title}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            BEM
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-3"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {title}
          </h1>
          {description.map((p, i) => (
            <p key={i} className="text-xs leading-relaxed mb-1" style={{ color: "#777" }}>
              {p}
            </p>
          ))}
        </div>

        {/* Subjects Table */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "#fff" }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-3 gap-4 p-4 text-center font-bold font-['Tajawal'] text-xs"
            style={{ background: "#F7F3EC", borderBottom: "1px solid #E8E2D8" }}
          >
            <div>المادة</div>
            <div>الموضوع</div>
            <div>التصحيح</div>
          </div>

          {/* Table Rows */}
          {subjects.map((s, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 p-4 items-center text-center transition-colors hover:bg-[#FAF8F4]"
              style={index !== subjects.length - 1 ? { borderBottom: "1px solid #F0EBE3" } : {}}
            >
              {/* Subject Name */}
              <div className="font-bold text-[#1A1A1A] font-['Tajawal'] text-xs">
                {s.subject}
              </div>

              {/* Exam Link */}
              <Link
                href={`/pdf/${s.exam.path}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
                style={{ background: "#7C3AED" }}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{s.exam.text}</span>
              </Link>

              {/* Correction Link */}
              {s.correction ? (
                <Link
                  href={`/pdf/${s.correction.path}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
                  style={{ background: "#065F46" }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{s.correction.text}</span>
                </Link>
              ) : (
                <span className="text-xs font-['Tajawal']" style={{ color: "#999" }}>—</span>
              )}
            </div>
          ))}

          {subjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xs font-['Tajawal']" style={{ color: "#999" }}>
                لا توجد مواد متاحة
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}