"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  BookOpen,
  Network,
  Archive,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

type YearItem = { year: string; title: string; slug: string; isLegacy: boolean };
type SubjectItem = { title: string; subtitle: string; icon: string; color: string; slug: string };
type StreamItem = { title: string; slug: string };

const streamPalette = [
  { bg: "#A7F3D0", text: "#065F46" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#F3F4F6", text: "#374151" },
];

export default function BacTabsClient({
  years,
  subjects,
  streams,
}: {
  years: YearItem[];
  subjects: SubjectItem[];
  streams: StreamItem[];
}) {
  const [tab, setTab] = useState<"year" | "subject" | "stream">("subject");

  const modernYears = years.filter((y) => !y.isLegacy);
  const legacyYears = years.filter((y) => y.isLegacy);

  const tabs = [
    { id: "year" as const, label: "حسب السنة", icon: Calendar, count: years.length },
    { id: "subject" as const, label: "حسب المادة", icon: BookOpen, count: subjects.length },
    { id: "stream" as const, label: "حسب الشعبة", icon: Network, count: streams.length },
  ];

  return (
    <>
      {/* ─── Tab Switcher (dark pill) ─────────────────────────────── */}
      <div
        className="rounded-2xl p-1.5 flex items-center gap-1.5 mb-8"
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
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {modernYears.map((y,ind) => (
              <YearCard key={`${y.slug}-${ind}`} item={y} />
            ))}
          </div>

          {legacyYears.length > 0 && (
            <>
              <div className="flex items-center gap-4 my-8">
                <div className="h-px flex-1" style={{ background: "#E8E2D8" }} />
                <span
                  className="flex items-center gap-1.5 text-xs font-bold"
                  style={{ color: "#999" }}
                >
                  <Archive className="w-3.5 h-3.5" />
                  مواضيع النظام القديم
                </span>
                <div className="h-px flex-1" style={{ background: "#E8E2D8" }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {legacyYears.map((y) => (
                  <YearCard key={y.slug} item={y} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Subjects Panel ───────────────────────────────────────── */}
      {tab === "subject" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/bac-solutions/subject/${s.slug}`}
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

      {/* ─── Streams Panel ────────────────────────────────────────── */}
      {tab === "stream" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {streams.map((s, i) => {
            const c = streamPalette[i % streamPalette.length];
            return (
              <Link
                key={s.slug}
                href={`/bac-solutions/stream/${s.slug}`}
                className="group flex items-center gap-3 bg-white rounded-2xl p-4 hover:scale-[1.01] transition-all"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: c.bg }}
                >
                  <GraduationCap className="w-5 h-5" style={{ color: c.text }} />
                </span>

                <strong className="flex-1 min-w-0 font-black text-sm text-[#1A1A1A] group-hover:text-[#7C3AED] transition-colors truncate">
                  {s.title}
                </strong>

                <ArrowLeft
                  className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1"
                  style={{ color: c.text }}
                />
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function YearCard({ item }: { item: YearItem }) {
  return (
    <Link
      href={`/bac-solutions/year/${item.year}`}
      className="group bg-white rounded-2xl p-3 text-center hover:scale-[1.02] transition-all"
    >
      <div
        className="w-full rounded-xl py-2.5 mb-2 font-black text-base"
        style={{
          background: item.isLegacy ? "#F3F4F6" : "#EDE9FE",
          color: item.isLegacy ? "#6B7280" : "#5B21B6",
        }}
      >
        {item.year}
      </div>
      <p
        className="text-[10px] font-bold leading-snug"
        style={{ color: item.isLegacy ? "#999" : "#1A1A1A" }}
      >
        {item.title}
      </p>
    </Link>
  );
}