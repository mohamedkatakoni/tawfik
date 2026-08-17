"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  LayoutGrid,
  ArrowDownUp,
  RotateCcw,
  Calendar,
  ChevronLeft,
  FileText,
  FolderOpen,
} from "lucide-react";

type Item = {
  title: string;
  path: string;
  year: string;
  hasSolution: boolean;
  image?: string;
};

type YearBlock = { year: string; items: Item[] };

const VISITED_KEY = "tawfik-visited";

export default function SubCategoryClient({
  itemsByYear,
  meta,
}: {
  itemsByYear: YearBlock[];
  meta: { bg: string; color: string };
}) {
  const [query, setQuery] = useState("");
  const [onlySolution, setOnlySolution] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [reversed, setReversed] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [closedYears, setClosedYears] = useState<string[]>([]);

  // Load visited items from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(VISITED_KEY);
      if (raw) setVisited(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  const markVisited = (path: string) => {
    setVisited((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      try {
        localStorage.setItem(VISITED_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const toggleYear = (year: string) =>
    setClosedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );

  const resetFilters = () => {
    setQuery("");
    setOnlySolution(false);
    setOnlyUnread(false);
    setReversed(false);
  };

  // Apply search + filters + sort
  const filtered = useMemo(() => {
    const q = query.trim();
    let blocks = itemsByYear
      .map((block) => {
        let items = block.items.filter((item) => {
          if (q && !item.title.includes(q)) return false;
          if (onlySolution && !item.hasSolution) return false;
          if (onlyUnread && visited.has(item.path)) return false;
          return true;
        });
        if (reversed) items = [...items].reverse();
        return { ...block, items };
      })
      .filter((b) => b.items.length > 0);
    if (reversed) blocks = [...blocks].reverse();
    return blocks;
  }, [itemsByYear, query, onlySolution, onlyUnread, reversed, visited]);

  const totalShown = filtered.reduce((s, b) => s + b.items.length, 0);

  return (
    <>
      {/* ─── Tools Bar (dark pill) ─────────────────────────────────── */}
      <div
        className="rounded-2xl p-2.5 mb-4 flex flex-wrap items-center gap-2"
        style={{ background: "#1A1A1A" }}
      >
        <label className="flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl bg-white/10">
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المحتوى"
            className="w-full bg-transparent outline-none text-xs font-['Tajawal'] text-white placeholder:text-white/40"
          />
        </label>

        <ToolBtn active={onlySolution} onClick={() => setOnlySolution((v) => !v)} title="إظهار التي تحتوي على حل فقط">
          <CheckCircle2 className="w-3.5 h-3.5" /> حل
        </ToolBtn>

        <ToolBtn active={onlyUnread} onClick={() => setOnlyUnread((v) => !v)} title="إظهار غير المتصفحة فقط">
          <EyeOff className="w-3.5 h-3.5" /> غير مقروء
        </ToolBtn>

        <ToolBtn active={gallery} onClick={() => setGallery((v) => !v)} title="عرض كمعرض صور">
          <LayoutGrid className="w-3.5 h-3.5" /> معرض
        </ToolBtn>

        <ToolBtn active={reversed} onClick={() => setReversed((v) => !v)} title="ترتيب معاكس">
          <ArrowDownUp className="w-3.5 h-3.5" /> ترتيب
        </ToolBtn>

        <ToolBtn active={false} onClick={resetFilters} title="مسح التصفية">
          <RotateCcw className="w-3.5 h-3.5" /> مسح
        </ToolBtn>
      </div>

      <p className="text-[11px] mb-3 font-['Tajawal']" style={{ color: "#999" }}>
        {totalShown} نتيجة
      </p>

      {/* ─── List View ─────────────────────────────────────────────── */}
      {!gallery && (
        <div className="space-y-4">
          {filtered.map((block) => {
            const closed = closedYears.includes(block.year);
            return (
              <div key={block.year} className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
                <button
                  type="button"
                  onClick={() => toggleYear(block.year)}
                  className="w-full flex items-center gap-3 p-3.5 cursor-pointer select-none hover:bg-[#FAF8F4] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: meta.color }}>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-bold text-xs text-[#1A1A1A] leading-snug">سنة {block.year}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: "#AAA" }}>{block.items.length} ملف</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#F7F3EC" }}>
                    <ChevronLeft className={`w-4 h-4 transition-transform ${closed ? "" : "rotate-90"}`} style={{ color: "#CCC" }} />
                  </div>
                </button>

                {!closed && (
                  <div className="px-3.5 pb-3.5">
                    <div className="border-t pt-2.5 space-y-1.5" style={{ borderColor: "#E8E2D8" }}>
                      {block.items.map((item, i) => (
                        <Link
                          key={i}
                          href={`/pdf/${item.path}`}
                          onClick={() => markVisited(item.path)}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors hover:bg-[#FAF8F4]"
                          style={{ background: "#F7F3EC" }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                            <FileText className="w-3 h-3" style={{ color: meta.color }} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[11px] font-bold leading-relaxed truncate ${visited.has(item.path) ? "opacity-50" : ""}`}
                              style={{ color: "#1A1A1A" }}
                            >
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px]" style={{ color: "#999" }}>{item.year}</span>
                              {item.hasSolution ? (
                                <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: "#065F46" }}>
                                  <CheckCircle2 className="w-2.5 h-2.5" /> مع الحل
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: "#999" }}>
                                  <XCircle className="w-2.5 h-2.5" /> بدون حل
                                </span>
                              )}
                              {visited.has(item.path) && (
                                <span className="text-[10px] flex items-center gap-0.5" style={{ color: "#AAA" }}>
                                  <Eye className="w-2.5 h-2.5" /> مقروء
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shrink-0" style={{ background: "#7C3AED" }}>
                            عرض
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Gallery View ──────────────────────────────────────────── */}
      {gallery && (
        <div className="space-y-6">
          {filtered.map((block) => (
            <div key={block.year}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ background: meta.color }}>
                  <Calendar className="w-3 h-3" />
                </div>
                <h3 className="text-xs font-bold" style={{ color: "#1A1A1A" }}>سنة {block.year}</h3>
                <span className="text-[10px]" style={{ color: "#999" }}>({block.items.length})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {block.items.map((item, i) => (
                  <Link
                    key={i}
                    href={`/pdf/${item.path}`}
                    onClick={() => markVisited(item.path)}
                    className="rounded-xl overflow-hidden bg-white hover:scale-[1.02] transition-transform"
                  >
                    <div className="aspect-[4/3] overflow-hidden" style={{ background: meta.bg }}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-6 h-6" style={{ color: meta.color }} />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className={`text-[10px] font-bold leading-relaxed line-clamp-2 ${visited.has(item.path) ? "opacity-50" : ""}`} style={{ color: "#1A1A1A" }}>
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold" style={{ background: "#F7F3EC", color: "#777" }}>
                          {item.year}
                        </span>
                        {item.hasSolution && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold text-white" style={{ background: "#065F46" }}>
                            الحل
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── No Results ────────────────────────────────────────────── */}
      {totalShown === 0 && (
        <div className="text-center py-14">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: meta.bg }}>
            <FolderOpen className="w-6 h-6" style={{ color: meta.color }} />
          </div>
          <p className="text-xs font-['Tajawal']" style={{ color: "#777" }}>لا توجد نتائج مطابقة.</p>
        </div>
      )}
    </>
  );
}

function ToolBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold font-['Tajawal'] transition-colors ${
        active ? "bg-[#7C3AED] text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}