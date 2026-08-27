import { bacSubjectScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  FileText,
  CheckCircle2,
  Check,
  Calendar,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

type PageProps = {
  params: Promise<{ subject: string }>;
};

const subjectNames: Record<string, string> = {
  mathematics: "الرياضيات",
  physics: "العلوم الفيزيائية",
  sciences: "علوم الطبيعة والحياة",
  arabic: "اللغة العربية",
  "history-geography": "التاريخ والجغرافيا",
  islamic: "العلوم الإسلامية",
  philosophy: "الفلسفة",
  french: "اللغة الفرنسية",
  english: "اللغة الإنجليزية",
  tamazight: "اللغة الأمازيغية",
  "process-engineering": "هندسة الطرائق",
  "civil-engineering": "الهندسة المدنية",
  "electrical-engineering": "الهندسة الكهربائية",
  "mechanical-engineering": "الهندسة الميكانيكية",
  law: "القانون",
  "accounting-management": "التسيير المحاسبي",
  "economics-management": "الاقتصاد",
  german: "اللغة الألمانية",
  spanish: "اللغة الإسبانية",
  italian: "اللغة الإيطالية",
};

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function BacSubjectPage({ params }: PageProps) {
  const { subject } = await params;
  const data = await bacSubjectScraper(subject);
  const subjectName = subjectNames[subject] || subject;

  const totalTopics = data.years.reduce(
    (sum, y) => sum + y.subjects.length,
    0,
  );

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
          <span className="font-semibold truncate" style={{ color: "#7C3AED" }}>
            {subjectName}
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            {data.icon && (
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${data.color}1A` }}
              >
                <img src={data.icon} alt="" width={30} height={30} loading="lazy" />
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: "#7C3AED" }}
              >
                الأرشيف الرسمي
              </p>
              <h1
                className="font-black text-[#1A1A1A] leading-tight"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)" }}
              >
                {data.title}
              </h1>
            </div>
          </div>
          {data.description && (
            <p className="text-xs max-w-lg leading-relaxed" style={{ color: "#777" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* ─── Stats Bar ──────────────────────────────────────────── */}
        <div
          className="flex items-center gap-4 p-3 rounded-xl mb-6"
          style={{ background: "#fff" }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: data.color }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {data.years.length} سنة
            </span>
          </div>
          <div className="w-px h-4" style={{ background: "#E8E2D8" }} />
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: data.color }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {totalTopics} موضوع
            </span>
          </div>
          {data.summary && (
            <>
              <div className="w-px h-4 hidden sm:block" style={{ background: "#E8E2D8" }} />
              <span
                className="text-[11px] hidden sm:inline font-['Tajawal']"
                style={{ color: "#777" }}
              >
                {data.summary}
              </span>
            </>
          )}
        </div>

        {/* ─── Years List ─────────────────────────────────────────── */}
        <div className="space-y-4">
          {data.years.map((yearBlock, yearIndex) => (
            <details
              key={yearIndex}
              className="group rounded-2xl overflow-hidden"
              style={{ background: "#fff" }}
              open={yearIndex === 0}
            >
              {/* ── Year Header ────────────────────────────────────── */}
              <summary className="flex items-center gap-3 p-3.5 cursor-pointer list-none hover:bg-[#FAF8F4] transition-colors select-none">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: data.color }}
                >
                  <Calendar className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-[#1A1A1A] font-['Tajawal'] leading-snug">
                    {yearBlock.year}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "#AAA" }}>
                    {yearBlock.subjects.length} شعب
                  </p>
                </div>

                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0"
                  style={{ background: "#F7F3EC" }}
                >
                  <ChevronLeft
                    className="w-4 h-4 transition-transform group-open:rotate-90"
                    style={{ color: "#CCC" }}
                  />
                </div>
              </summary>

              {/* ─── Year Content ──────────────────────────────────── */}
              <div className="px-3.5 pb-3.5">
                <div
                  className="border-t pt-2.5 space-y-1.5"
                  style={{ borderColor: "#E8E2D8" }}
                >
                  {yearBlock.subjects.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors hover:bg-[#FAF8F4]"
                      style={{ background: "#F7F3EC" }}
                    >
                      {/* Subtitle Badge */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[9px] font-black"
                        style={{
                          background: `${data.color}1A`,
                          color: data.color,
                        }}
                      >
                        <BookOpen className="w-3 h-3" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#1A1A1A] font-['Tajawal'] leading-relaxed truncate">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-[10px] font-['Tajawal'] mt-0.5" style={{ color: "#999" }}>
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.topic && (
                          <Link
                            href={`/pdf${item.topic.path}`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
                            style={{ background: data.color }}
                          >
                            <FileText className="w-3 h-3" />
                            الموضوع
                          </Link>
                        )}

                        {item.correction && (
                          <Link
                            href={`/pdf${item.correction.path}`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02] border font-['Tajawal']"
                            style={{
                              color: data.color,
                              borderColor: `${data.color}40`,
                              background: `${data.color}0A`,
                            }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            التصحيح
                          </Link>
                        )}

                        {item.detailedCorrection && (
                          <Link
                            href={`/pdf${item.detailedCorrection.path}`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02] border font-['Tajawal']"
                            style={{
                              color: "#065F46",
                              borderColor: "#065F4640",
                              background: "#A7F3D033",
                            }}
                          >
                            <Check className="w-3 h-3" />
                            المفصل
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* ─── Empty State ─────────────────────────────────────────── */}
        {data.years.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: `${data.color}1A` }}
            >
              <BookOpen className="w-6 h-6" style={{ color: data.color }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد مواضيع متاحة حالياً
            </p>
          </div>
        )}

        {/* ─── Back Link ───────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#E8E2D8" }}>
          <Link
            href="/bac-solutions"
            className="inline-flex items-center gap-2 text-xs font-bold hover:text-[#7C3AED] transition-colors"
            style={{ color: "#777" }}
          >
            <ArrowLeft className="w-3 h-3 rotate-180" />
            العودة إلى جميع المواد
          </Link>
        </div>

      </div>
    </main>
  );
}