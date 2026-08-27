"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, BookOpen, ArrowLeft } from "lucide-react";

type YearItem = { year: string; title: string; slug: string };
type SubjectItem = {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  slug: string;
};

export default function CinqTabsClient({
  years,
  subjects,
}: {
  years: YearItem[];
  subjects: SubjectItem[];
}) {
  const [tab, setTab] = useState<"year" | "subject">("subject");

  return (
    <>
      {/* ─── Tab Switcher (dark pill) ─────────────────────────────── */}
      <div
        className="rounded-2xl p-1.5 flex items-center gap-1.5 mb-8 max-w-md mx-auto"
        style={{ background: "#1A1A1A" }}
      >
        <button
          type="button"
          onClick={() => setTab("year")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold font-['Tajawal'] transition-colors ${
            tab === "year"
              ? "bg-[#7C3AED] text-white"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          حسب السنة
        </button>
        <button
          type="button"
          onClick={() => setTab("subject")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold font-['Tajawal'] transition-colors ${
            tab === "subject"
              ? "bg-[#7C3AED] text-white"
              : "text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          حسب المادة
        </button>
      </div>

      {/* ─── Panel: السنوات ───────────────────────────────────────── */}
      {tab === "year" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {years.map((y) => (
            <Link
              key={y.slug}
              href={`/cinq-solutions/year/${y.year}`}
              className="group bg-white rounded-2xl p-4 text-center hover:scale-[1.02] transition-all"
            >
              <span
                className="block w-14 h-14 mx-auto rounded-2xl items-center justify-center font-black text-lg mb-2 flex"
                style={{ background: "#EDE9FE", color: "#5B21B6" }}
              >
                {y.year}
              </span>
              <p
                className="text-[11px] font-bold leading-snug group-hover:text-[#7C3AED] transition-colors"
                style={{ color: "#1A1A1A" }}
              >
                {y.title}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* ─── Panel: المواد ────────────────────────────────────────── */}
      {tab === "subject" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/cinq-solutions/subject/${s.slug}`}
              className="group flex items-center gap-4 bg-white rounded-2xl p-4 hover:scale-[1.01] transition-all"
            >
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${s.color}1A` }}
              >
                {s.icon ? (
                  <img src={s.icon} alt="" width={30} height={30} loading="lazy" />
                ) : (
                  <BookOpen className="w-5 h-5" style={{ color: s.color }} />
                )}
              </span>
              <span className="flex-1 min-w-0 text-right">
                <strong
                  className="block font-black text-sm group-hover:text-[#7C3AED] transition-colors"
                  style={{ color: "#1A1A1A" }}
                >
                  {s.title}
                </strong>
                <small className="block text-[11px] mt-0.5" style={{ color: "#999" }}>
                  {s.subtitle}
                </small>
              </span>
              <ArrowLeft
                className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1"
                style={{ color: s.color }}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}