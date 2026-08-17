import { educationalMaterial } from "@/scraper";
import Link from "next/link";
import { ArrowLeft, Home, ChevronLeft, BookOpen } from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Stage metadata ──────────────────────────────────────────────────────────

const stageNames: Record<string, string> = {
  "1am": "السنة الأولى متوسط",
  "2am": "السنة الثانية متوسط",
  "3am": "السنة الثالثة متوسط",
  "4am": "السنة الرابعة متوسط",
};

const stageMeta: Record<string, { bg: string; color: string }> = {
  "1am": { bg: "#DBEAFE", color: "#1E40AF" },
  "2am": { bg: "#FEF3C7", color: "#92400E" },
  "3am": { bg: "#EDE9FE", color: "#4C1D95" },
  "4am": { bg: "#FCE7F3", color: "#9D174D" },
};

// Material accent colors
const materialColors: Record<string, { bg: string; text: string }> = {
  "mathematics":       { bg: "#D1FAE5", text: "#065F46" },
  "arabic":            { bg: "#FEF3C7", text: "#92400E" },
  "islamic":           { bg: "#E0F2FE", text: "#0369A1" },
  "science-technologie": { bg: "#EDE9FE", text: "#5B21B6" },
  "civic":             { bg: "#FCE7F3", text: "#9D174D" },
  "french":            { bg: "#DBEAFE", text: "#1E40AF" },
  "english":           { bg: "#FEF9C3", text: "#854D0E" },
  "history-geography": { bg: "#FFEDD5", text: "#9A3412" },
  "amazigh":           { bg: "#CCFBF1", text: "#115E59" },
  "cinq-solutions":    { bg: "#E2E8F0", text: "#334155" },
};

// ─── Page ────────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{
    primarystage: string;
  }>;
};

export default async function MiddleStagePage({ params }: PageProps) {
  const { primarystage } = await params;
  const materials = await educationalMaterial("ens-cm", primarystage);
  const stageName = stageNames[primarystage] || primarystage;
  const meta = stageMeta[primarystage] ?? { bg: "#EDE9FE", color: "#4C1D95" };

  return (
    <main
      className="min-h-screen font-['Tajawal']"
      style={{ background: "#F7F3EC" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/ens-cm" className="hover:text-[#7C3AED] transition-colors">
            التعليم المتوسط
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {stageName}
          </span>
        </nav>

        {/* Page header */}
        <div className="mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: "#7C3AED" }}
          >
            Middle School
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-3"
            style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
          >
            اختر{" "}
            <span className="text-[#7C3AED] italic">مادتك الدراسية</span>
          </h1>
          <p className="text-base max-w-md leading-relaxed" style={{ color: "#777" }}>
            دروس واختبارات وفروض لجميع مواد {stageName}
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {materials.map((material) => {
            const colors = materialColors[material.link] ?? {
              bg: "#EDE9FE",
              text: "#5B21B6",
            };

            return (
              <Link
                key={material.link}
                href={`/ens-cm/${primarystage}/${material.link}`}
                className="group flex flex-col items-center gap-4 p-5 rounded-3xl transition-all duration-300 hover:scale-[1.01] "
                style={{ background: colors.bg }}
              >
                {/* Icon Image */}
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105 bg-gray-400"
               
                >
                  <img
                    src={material.img}
                    alt={material.text}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="text-center">
                  <h3
                    className="font-black text-sm leading-tight mb-1"
                    style={{ color: colors.text }}
                  >
                    {material.text}
                  </h3>
                  <p className="text-[11px] font-bold opacity-60" style={{ color: colors.text }}>
                    دروس واختبارات وفروض
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-white/60"
                  style={{ background: "rgba(255,255,255,0.35)" }}
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: colors.text }} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {materials.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: meta.bg }}
            >
              <BookOpen className="w-8 h-8" style={{ color: meta.color }} />
            </div>
            <p className="text-base font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد مواد متاحة حالياً
            </p>
          </div>
        )}

      </div>
    </main>
  );
}