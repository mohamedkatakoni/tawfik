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
  path: string;
};

const yearPalette = [
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#A7F3D0", text: "#065F46" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#FCE7F3", text: "#9D174D" },
];

export default function BemTabsClient({
  years,
  subjects,
}: {
  years: YearItem[];
  subjects: SubjectItem[];
}) {
  const [tab, setTab] = useState<"year" | "subject">("year");

  const tabs = [
    { id: "year" as const, label: "حسب السنة", icon: Calendar, count: years.length },
    { id: "subject" as const, label: "حسب المادة", icon: BookOpen, count: subjects.length },
  ];

  return (
    <>
      {/* ─── Tab Switcher ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-1.5 flex items-center gap-1.5 mb-8 max-w-md mx-auto"
        style={{ background: "#1A1A1A" }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold font-['Tajawal'] transition-colors ${
                active
                  ? "bg-[#7C3AED] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  active ? "bg-white/20" : "bg-white/10"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Years Panel ──────────────────────────────────────────── */}
      {tab === "year" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {years.map((y, i) => {
            const c = yearPalette[i % yearPalette.length];
            return (
              <Link
                key={y.slug}
                href={`/bem-solutions/year/${y.year}`}
                className="group flex items-center gap-4 bg-white rounded-2xl p-4 hover:scale-[1.01] transition-all"
              >
                <span
                  className="w-14 h-12 rounded-xl flex items-center justify-center font-black text-base shrink-0"
                  style={{ background: c.bg, color: c.text }}
                >
                  {y.year}
                </span>
                <span className="flex-1 min-w-0 text-right font-bold text-sm text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors truncate">
                  {y.title}
                </span>
                <ArrowLeft
                  className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1"
                  style={{ color: c.text }}
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* ─── Subjects Panel ───────────────────────────────────────── */}
      {tab === "subject" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/bem-solutions/subject/${s.slug}`}
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
                <strong className="block font-black text-sm text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors truncate">
                  {s.title}
                </strong>
                <small className="block text-[11px] mt-0.5 truncate" style={{ color: "#999" }}>
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