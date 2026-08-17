"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, FileText } from "lucide-react";
import type { bacScraper } from "@/scraper";

type BacData = Awaited<ReturnType<typeof bacScraper>>;
type TabGroupData = BacData["tabGroups"][number];

export default function BacTabGroup({ group }: { group: TabGroupData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = group.tabs[activeIndex];

  if (!activeTab) return null;

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 font-['Tajawal']">
        {group.tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all font-['Tajawal']"
            style={
              index === activeIndex
                ? { background: "#7C3AED", color: "#fff" }
                : { background: "#fff", color: "#1A1A1A" }
            }
          >
            {tab.tabTitle}
          </button>
        ))}
      </div>

      {/* Table Title */}
      {activeTab.tableTitle && (
        <div className="mb-3">
          <span
            className="inline-block px-3 py-1 rounded-lg text-[11px] font-bold font-['Tajawal']"
            style={{ background: "#FCE7F3", color: "#9D174D" }}
          >
            {activeTab.tableTitle}
          </span>
        </div>
      )}

      {/* Subjects Table */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{ background: "#fff" }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-3 gap-4 p-4 text-center font-bold font-['Tajawal'] text-xs"
          style={{ background: "#F7F3EC", borderBottom: "1px solid #E8E2D8" }}
        >
          <div>المادة</div>
          <div>الموضوع</div>
          <div>التصحيح</div>
        </div>

        {activeTab.rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 p-4 items-center text-center transition-colors hover:bg-[#FAF8F4]"
            style={index !== activeTab.rows.length - 1 ? { borderBottom: "1px solid #F0EBE3" } : {}}
          >
            {/* Subject Name */}
            <div className="font-bold text-[#1A1A1A] font-['Tajawal'] text-xs">
              {row.subject}
            </div>

            {/* Exam Link */}
            <Link
              href={`/pdf/${row.exam.path}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
              style={{ background: "#7C3AED" }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{row.exam.text}</span>
            </Link>

            {/* Correction Link */}
            {row.correction ? (
              <Link
                href={`/pdf/${row.correction.path}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] font-['Tajawal']"
                style={{ background: "#065F46" }}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{row.correction.text}</span>
              </Link>
            ) : (
              <span className="text-xs font-['Tajawal']" style={{ color: "#999" }}>—</span>
            )}
          </div>
        ))}

        {activeTab.rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xs font-['Tajawal']" style={{ color: "#999" }}>
              لا توجد مواد متاحة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}