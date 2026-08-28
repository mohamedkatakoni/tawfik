import { educationalMaterial } from "@/scraper";
import Link from "next/link";
import { ArrowLeft, Home, ChevronLeft, BookOpen } from "lucide-react";

type PageProps = {
  params: Promise<{
    primarystage: string;
  }>;
};

// ─── Stage metadata ──────────────────────────────────────────────────────────

export const dynamic = 'force-static'; // Forces absolute static caching
export const revalidate = 259200; 

const stageNames: Record<string, string> = {
  "first-primary": "السنة الأولى إبتدائي",
  "second-primary": "السنة الثانية إبتدائي",
  "third-primary": "السنة الثالثة إبتدائي",
  "fourth-primary": "السنة الرابعة إبتدائي",
  "fifth-primary": "السنة الخامسة إبتدائي",
};

// Stage-specific accent colors (matches Design System)
const stageMeta: Record<string, { bg: string; color: string; eyebrow: string }> = {
  "first-primary":  { bg: "#D1FAE5", color: "#065F46", eyebrow: "السنة الأولى" },
  "second-primary": { bg: "#DBEAFE", color: "#1E40AF", eyebrow: "السنة الثانية" },
  "third-primary":  { bg: "#FEF3C7", color: "#92400E", eyebrow: "السنة الثالثة" },
  "fourth-primary": { bg: "#EDE9FE", color: "#4C1D95", eyebrow: "السنة الرابعة" },
  "fifth-primary":  { bg: "#FCE7F3", color: "#9D174D", eyebrow: "السنة الخامسة" },
};

// Material accent colors — each material gets its own tinted card background
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

export default async function PrimaryStagePage({ params }: PageProps) {
  const { primarystage } = await params;
  const materials = await educationalMaterial("ens-pri", primarystage);
  const data = materials.filter(el => !el.text.includes("شهادة"))
  const stageName = stageNames[primarystage] || primarystage;
  const meta = stageMeta[primarystage] ?? { bg: "#EDE9FE", color: "#4C1D95", eyebrow: stageName };

  return (
    <main
      className="min-h-screen font-['Tajawal']"
      style={{ background: "#F7F3EC" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* ─── Breadcrumb ───────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "#AAA" }}>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#7C3AED] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link
            href="/ens-pri"
            className="hover:text-[#7C3AED] transition-colors"
          >
            التعليم الابتدائي
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {stageName}
          </span>
        </nav>

        {/* ─── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: "#7C3AED" }}
          >
            {meta.eyebrow}
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

        {/* ─── Materials Grid ───────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {data.map((material) => {
    const colors = materialColors[material.link] ?? {
      bg: "#EDE9FE",
      text: "#5B21B6",
    };

    return (
      <Link
        key={material.link}
        href={`/ens-pri/${primarystage}/${material.link}`}
        className="group flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300 hover:scale-[1.01]"
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
            className="font-black text-lg leading-tight mb-1 transition-colors"
            style={{ color: colors.text }}
          >
            {material.text}
          </h3>
          <p className="text-xs font-bold opacity-60" style={{ color: colors.text }}>
            {material.numberOfPdfs} ملف
          </p>
        </div>

        {/* Arrow */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-white/60"
          style={{ background: "rgba(255,255,255,0.35)" }}
        >
          <ArrowLeft
            className="w-4 h-4 transition-colors"
            style={{ color: colors.text }}
          />
        </div>
      </Link>
    );
  })}
</div>

        {/* ─── Empty State ──────────────────────────────────────────────── */}
        {data.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: meta.bg }}
            >
              <BookOpen className="w-8 h-8" style={{ color: meta.color }} />
            </div>
            <p className="text-base" style={{ color: "#777" }}>
              لا توجد مواد متاحة حالياً
            </p>
          </div>
        )}

      </div>
    </main>
  );
}