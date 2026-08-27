import { bacStreamScraperbranch } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import { Home, ChevronLeft, Calendar, BookOpen } from "lucide-react";

type PageProps = {
  params: Promise<{ branch: string }>;
};

const branchNames: Record<string, string> = {
  sciences: "علوم تجريبية",
  mathematics: "رياضيات",
  "technical-mathematics": "تقني رياضي",
  "management-economics": "تسيير واقتصاد",
  "literature-philosophy": "آداب وفلسفة",
  "foreign-languages": "لغات أجنبية",
};

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function BacStreamPage({ params }: PageProps) {
  const { branch } = await params;
  const data = await bacStreamScraperbranch(branch);
  const branchName = branchNames[branch] || branch;

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
          <span className="font-semibold truncate" style={{ color: "#7C3AED" }}>
            {branchName}
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
            مواضيع بكالوريا شعبة{" "}
            <span className="text-[#7C3AED] italic">{branchName}</span>
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
            <Calendar className="w-4 h-4" style={{ color: "#7C3AED" }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {data.years.length} سنة
            </span>
          </div>
          <div className="w-px h-4" style={{ background: "#E8E2D8" }} />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "#7C3AED" }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              شعبة {branchName}
            </span>
          </div>
        </div>

        {/* ─── Section Title ──────────────────────────────────────── */}
        <div className="mb-6">
          <h2 className="font-black text-base text-[#1A1A1A]">المواضيع حسب السنة</h2>
          <p className="text-xs mt-1" style={{ color: "#999" }}>
            اختر السنة لتصفح المواد والامتحانات
          </p>
        </div>

        {/* ─── Years Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {data.years.map((year , ind) => (
            <Link
              key={`${year.path}-${ind}`}
              href={`/bac-solutions/year/${year.year}/${branch}`}
              className="group bg-white rounded-2xl p-4 text-center hover:scale-[1.02] transition-all"
            >
              <div
                className="w-full rounded-xl py-3 mb-3 font-black text-lg"
                style={{ background: "#EDE9FE", color: "#5B21B6" }}
              >
                {year.year}
              </div>
              <p className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors leading-snug">
                {year.title}
              </p>
            </Link>
          ))}
        </div>

        {/* ─── Empty State ────────────────────────────────────────── */}
        {data.years.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#5B21B6" }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد سنوات متاحة لهذه الشعبة
            </p>
          </div>
        )}

        {/* ─── Back Link ──────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#E8E2D8" }}>
          <Link
            href="/bac-solutions"
            className="inline-flex items-center gap-2 text-xs font-bold hover:text-[#7C3AED] transition-colors"
            style={{ color: "#777" }}
          >
            <ChevronLeft className="w-3 h-3 rotate-180" />
            العودة إلى جميع الشعب
          </Link>
        </div>

      </div>
    </main>
  );
}