import { finalStageExamsBem } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  ArrowLeft,
  Calendar,
  BookOpen,
} from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function BacSolutionsPage() {
  const { list } = await finalStageExamsBem("bac-solutions");

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
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            بكالوريا
          </span>
        </nav>

        {/* Header */}
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
          <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
            جميع مواضيع وحلول شهادة البكالوريا منذ 1996
          </p>
        </div>

        {/* Years List */}
        <div className="space-y-2 max-w-2xl">
          {list.map((item, index) => (
            <Link
              key={index}
              href={`/bac-solutions/${item.urlbem}`}
              className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white transition-all hover:scale-[1.01]"
            >
              {/* Arrow (left side for RTL) */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[#FAF8F4] shrink-0"
                style={{ background: "#F7F3EC" }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "#CCC" }} />
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs text-[#1A1A1A] font-['Tajawal'] group-hover:text-[#7C3AED] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: "#AAA" }}>
                  <Calendar className="w-3 h-3" />
                  سنة {item.year}
                </p>
              </div>

              {/* Year Badge (right side) */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                style={{ background: "#4C1D95" }}
              >
                {item.year}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#4C1D95" }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد سنوات متاحة حالياً
            </p>
          </div>
        )}

      </div>
    </main>
  );
}