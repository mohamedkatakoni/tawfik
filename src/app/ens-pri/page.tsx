import { enspri } from "@/scraper";
import Link from "next/link";
import { ArrowLeft, Home, ChevronLeft } from "lucide-react";

// ─── Stage metadata ──────────────────────────────────────────────────────────

export const dynamic = 'force-static'; // Forces absolute static caching
export const revalidate = 259200; 

const stageMeta: Record<string, { num: string; bg: string; color: string }> = {
"preparatory": { num: "0", bg: "#F7F3EC", color: "#1A1A1A" },
  "first-primary":  { num: "1", bg: "#D1FAE5", color: "#065F46" },
  "second-primary": { num: "2", bg: "#DBEAFE", color: "#1E40AF" },
  "third-primary":  { num: "3", bg: "#FEF3C7", color: "#92400E" },
  "fourth-primary": { num: "4", bg: "#EDE9FE", color: "#4C1D95" },
  "fifth-primary":  { num: "5", bg: "#FCE7F3", color: "#9D174D" },
};



// ─── Page ────────────────────────────────────────────────────────────────────

export default async function EnsPriPage() {
  const data = await enspri("ens-pri");

  const stages = data

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
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            التعليم الابتدائي
          </span>
        </nav>

        {/* Page header */}
        <div className="mb-12">
          <p
            className="text-sm font-bold tracking-widest uppercase mb-3"
            style={{ color: "#7C3AED" }}
          >
            Primary School
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-3"
            style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)" }}
          >
            اختر{" "}
            <span className="text-[#7C3AED] italic">سنتك الدراسية</span>
          </h1>
          <p className="text-base max-w-md leading-relaxed" style={{ color: "#777" }}>
            دروس واختبارات وفروض لجميع سنوات التعليم الابتدائي
          </p>
        </div>

        {/* Stages grid */}
   <div className="grid sm:grid-cols-2 gap-4">
  {stages.map((stage, i) => {
    const meta = stageMeta[stage.link] ?? { num: "?", bg: "#EDE9FE", color: "#4C1D95" };
    
    return (
      <Link
        key={stage.link}
        href={`/ens-pri/${stage.link}`}
        className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white border-2 border-transparent hover:border-[#EDE9FE] hover:shadow-lg hover:shadow-violet-100/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
        style={{ minHeight: 140 }}
      >
        {/* Big number watermark in background */}
        <div
          className="absolute left-2 -bottom-3 text-[7rem] font-black leading-none select-none opacity-[0.07] transition-opacity group-hover:opacity-[0.12]"
          style={{ color: meta.color }}
        >
          {meta.num}
        </div>
        
        {/* Top row: colored badge + PDF count */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.num}
          </div>
          
          {stage.numberOfPdfs && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "#F7F3EC", color: "#888" }}
            >
              {stage.numberOfPdfs} ملف
            </span>
          )}
        </div>
        
        {/* Bottom: title + arrow */}
        <div className="relative flex items-end justify-between">
          <div>
            <h3 className="font-black text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors text-lg leading-tight">
              {stage.text}
            </h3>
            <p className="text-xs mt-1" style={{ color: "#AAA" }}>
              دروس واختبارات وفروض
            </p>
          </div>
          
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#EDE9FE] transition-colors"
            style={{ background: "#F7F3EC" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-[#7C3AED] transition-colors" style={{ color: "#CCC" }} />
          </div>
        </div>
      </Link>
    );
  })}
</div>

        {/* Certificate section */}
        {/* {certs.length > 0 && (
          <div className="mt-8 space-y-4">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#AAA" }}
            >
              الشهادات الرسمية
            </p>
            {certs.map((cert) => (
              <Link
                key={cert.link}
                href={`/${cert.link}`}
                className="group relative flex items-center justify-between px-8 py-6 rounded-3xl overflow-hidden transition-all hover:scale-[1.005] block"
                style={{ background: "#1A1A1A" }}
              >
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "#7C3AED" }}
                  >
                    التعليم الابتدائي
                  </p>
                  <h3 className="text-xl font-black text-white leading-tight">
                    {cert.text}
                  </h3>
                </div>
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-colors group-hover:bg-[#6D28D9]"
                  style={{ background: "#7C3AED" }}
                >
                  استعرض
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )} */}

      </div>
    </main>
  );
}