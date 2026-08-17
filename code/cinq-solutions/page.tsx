import { finalStageExamsCinqEme } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import { getSolutionExist, getCategoryIcon } from "@/utils";
import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FolderOpen,
  Home,
  ChevronLeft,
} from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CinqSolutionsPage() {
  const { list, titlePage, description } = await finalStageExamsCinqEme();

  const validCategories = list.filter((category) => category.linksOfPdfs.length > 0);

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
            شهادة التعليم الابتدائي
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            التعليم الابتدائي
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {titlePage || "مواضيع وحلول شهادة الإبتدائي"}
          </h1>
          {description && (
            <p className="text-xs max-w-2xl leading-relaxed mt-2" style={{ color: "#777" }}>
              {description}
            </p>
          )}
        </div>

        {/* Categories */}
        {validCategories.length > 0 ? (
          <div className="space-y-2">
            {validCategories.map((category, catIndex) => {
              const icon = getCategoryIcon(category.title);
              const pdfCount = category.linksOfPdfs.length;
              const showSolution = getSolutionExist(category.title);

              return (
                <details
                  key={catIndex}
                  className="group rounded-2xl overflow-hidden"
                  style={{ background: "#fff" }}
                >
                  {/* Summary */}
                  <summary className="flex items-center gap-3 p-3.5 cursor-pointer list-none hover:bg-[#FAF8F4] transition-colors select-none">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                      style={{ background: "#065F46" }}
                    >
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-[#1A1A1A] font-['Tajawal'] leading-snug">
                        {category.title}
                      </h3>
                      <p className="text-[11px] mt-0.5" style={{ color: "#AAA" }}>
                        {pdfCount} ملف
                      </p>
                    </div>

                    <div
                      className="hidden sm:flex items-center justify-center min-w-[1.75rem] h-6 px-1.5 rounded-lg text-[11px] font-black text-white shrink-0"
                      style={{ background: "#065F46" }}
                    >
                      {category.numberOfMaterial || pdfCount}
                    </div>

                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "#F7F3EC" }}
                    >
                      <ChevronDown
                        className="w-4 h-4 transition-transform group-open:rotate-180"
                        style={{ color: "#CCC" }}
                      />
                    </div>
                  </summary>

                  {/* Content */}
                  <div className="px-3.5 pb-3.5">
                    <div
                      className="border-t pt-2.5 space-y-1.5"
                      style={{ borderColor: "#E8E2D8" }}
                    >
                      {category.linksOfPdfs.map((pdf, pdfIndex) => (
                        <div
                          key={pdfIndex}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors hover:bg-[#FAF8F4]"
                          style={{ background: "#F7F3EC" }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "#D1FAE5" }}
                          >
                            <FileText className="w-3 h-3" style={{ color: "#065F46" }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-[#1A1A1A] font-['Tajawal'] leading-relaxed truncate">
                              {pdf.text}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-['Tajawal']" style={{ color: "#999" }}>
                                {pdf.year}
                              </span>
                              {showSolution && (
                                <>
                                  {pdf.hasSolution ? (
                                    <span className="text-[10px] font-bold font-['Tajawal'] flex items-center gap-0.5" style={{ color: "#065F46" }}>
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      حل
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold font-['Tajawal'] flex items-center gap-0.5" style={{ color: "#9D174D" }}>
                                      <XCircle className="w-2.5 h-2.5" />
                                      لا حل
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <Link
                            href={`/pdf/${pdf.pathOfPdf}`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-[1.02] shrink-0 font-['Tajawal']"
                            style={{ background: "#7C3AED" }}
                          >
                            <Eye className="w-3 h-3" />
                            عرض
                          </Link>
                        </div>
                      ))}

                      {category.linksOfPdfs.length === 0 && (
                        <div className="text-center py-3">
                          <p className="text-[11px] font-['Tajawal']" style={{ color: "#999" }}>
                            لا توجد ملفات
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#D1FAE5" }}
            >
              <FolderOpen className="w-6 h-6" style={{ color: "#065F46" }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد أقسام متاحة حالياً
            </p>
          </div>
        )}

      </div>
    </main>
  );
}