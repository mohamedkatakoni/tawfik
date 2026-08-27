import { bemYearSubjectsScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  FileText,
  CheckCircle2,
  Check,
  BookOpen,
} from "lucide-react";

type PageProps = {
  params: Promise<{ year: string }>;
};

export const dynamic = "force-static";
export const revalidate = 259200;

export default async function BemYearPage({ params }: PageProps) {
  const { year } = await params;
  const data = await bemYearSubjectsScraper(year);

  const totalTopics = data.subjects.filter((s) => s.topic).length;
  const totalCorrections = data.subjects.filter((s) => s.correction).length;

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
          <Link href="/bem-solutions" className="hover:text-[#7C3AED] transition-colors">
            مواضيع وحلول BEM
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>سنة {year}</span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
            الأرشيف الرسمي
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            {data.title || `مواضيع وحلول شهادة التعليم المتوسط ${year}`}
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
              {data.subjects.length} مادة
            </span>
          </div>
          <div className="w-px h-4" style={{ background: "#E8E2D8" }} />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: "#7C3AED" }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {totalTopics} موضوع
            </span>
          </div>
          <div className="w-px h-4" style={{ background: "#E8E2D8" }} />
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: "#065F46" }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>
              {totalCorrections} تصحيح
            </span>
          </div>
        </div>

        {/* ─── Section Title ──────────────────────────────────────── */}
        {data.sectionTitle && (
          <h2 className="font-black text-sm text-[#1A1A1A] mb-4">{data.sectionTitle}</h2>
        )}

        {/* ─── Subjects Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.subjects.map((subject, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex flex-col gap-3">
              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${subject.color}1A` }}
                >
                  {subject.icon ? (
                    <img src={subject.icon} alt="" width={30} height={30} loading="lazy" />
                  ) : (
                    <BookOpen className="w-5 h-5" style={{ color: subject.color }} />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm text-[#1A1A1A] truncate">{subject.title}</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "#999" }}>{subject.subtitle}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {subject.topic && (
                  <Link
                    href={`/pdf/${subject.topic.path}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:scale-[1.02]"
                    style={{ background: subject.color }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {subject.topic.text}
                  </Link>
                )}
                {subject.correction && (
                  <Link
                    href={`/pdf/${subject.correction.path}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-[1.02] border"
                    style={{
                      color: subject.color,
                      borderColor: `${subject.color}40`,
                      background: `${subject.color}0A`,
                    }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {subject.correction.text}
                  </Link>
                )}
                {subject.detailedCorrection && (
                  <Link
                    href={`/pdf/${subject.detailedCorrection.path}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-[1.02] border"
                    style={{ color: "#065F46", borderColor: "#065F4640", background: "#A7F3D033" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {subject.detailedCorrection.text}
                  </Link>
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
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد مواد متاحة لهذه السنة
            </p>
          </div>
        )}

      </div>
    </main>
  );
}