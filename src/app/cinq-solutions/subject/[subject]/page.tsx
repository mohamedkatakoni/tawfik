import { cinqSubjectScraper } from "@/scraper/finals";
import SecondaryHeader from "@/components/SecondaryHeader";
import Link from "next/link";
import {
  Home,
  ChevronLeft,
  FileText,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

type PageProps = {
  params: Promise<{ subject: string }>;
};

const subjectNames: Record<string, string> = {
  mathematics: "الرياضيات",
  arabic: "اللغة العربية",
  french: "اللغة الفرنسية",
  "remedial-session": "الدورة الاستدراكية",
};

export const dynamic = "force-static";
export const revalidate = 259200;

export default async function CinqSubjectPage({ params }: PageProps) {
  const { subject } = await params;
  const data = await cinqSubjectScraper(subject);
  const subjectName = subjectNames[subject] || subject;

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
          <Link href="/ens-pri" className="hover:text-[#7C3AED] transition-colors">
            التعليم الابتدائي
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/cinq-solutions" className="hover:text-[#7C3AED] transition-colors">
            مواضيع وحلول السنة الخامسة
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {subjectName}
          </span>
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
            {data.title || `مواضيع شهادة التعليم الابتدائي ${subjectName}`}
          </h1>
          {data.description && (
            <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* ─── Summary Bar ────────────────────────────────────────── */}
        {data.summary && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-6" style={{ background: "#fff" }}>
            <BookOpen className="w-4 h-4 shrink-0" style={{ color: "#7C3AED" }} />
            <span className="text-xs font-bold" style={{ color: "#555" }}>
              {data.summary}
            </span>
          </div>
        )}

        {/* ─── Section Title ──────────────────────────────────────── */}
        <h2 className="font-black text-sm text-[#1A1A1A] mb-3">المواضيع حسب السنة</h2>

        {/* ─── Years List ─────────────────────────────────────────── */}
        <div className="space-y-2">
          {data.years.map((yearBlock, yearIndex) => {
            const yearNumber = yearBlock.yearTitle.match(/\d{4}/)?.[0] || "";

            return (
              <div
                key={yearIndex}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#fff" }}
              >
                {yearBlock.subjects.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-3 p-3.5"
                  >
                    {/* Year badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
                      style={{ background: "#7C3AED" }}
                    >
                      {yearNumber}
                    </div>

                    {/* Icon + title */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${item.color}1A` }}
                      >
                        {item.icon ? (
                          <img src={item.icon} alt="" width={22} height={22} loading="lazy" />
                        ) : (
                          <BookOpen className="w-4 h-4" style={{ color: item.color }} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#1A1A1A] leading-snug truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: "#AAA" }}>
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.topic && (
                        <Link
                          href={`/pdf/${item.topic.path}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
                          style={{ background: item.color }}
                        >
                          <FileText className="w-3 h-3" />
                          {item.topic.text}
                        </Link>
                      )}
                      {item.correction && (
                        <Link
                          href={`/pdf/${item.correction.path}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:scale-[1.02] border font-['Tajawal']"
                          style={{
                            color: item.color,
                            borderColor: `${item.color}40`,
                            background: `${item.color}0A`,
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item.correction.text}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ─── Empty State ────────────────────────────────────────── */}
        {data.years.length === 0 && (
          <div className="text-center py-14">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#EDE9FE" }}
            >
              <BookOpen className="w-6 h-6" style={{ color: "#4C1D95" }} />
            </div>
            <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>
              لا توجد مواضيع متاحة حالياً
            </p>
          </div>
        )}

      </div>
    </main>
  );
}