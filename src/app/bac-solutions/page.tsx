import { bacSolutionsIndex } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import BacTabsClient from "@/components/BacTabsClient";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function BacSolutionsPage() {
  const { years, subjects, streams } = await bacSolutionsIndex();

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
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            بكالوريا
          </span>
        </nav>

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#7C3AED" }}
          >
            BAC
          </p>
          <h1
            className="font-black text-[#1A1A1A] leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
          >
            مواضيع وحلول{" "}
            <span className="text-[#7C3AED] italic">البكالوريا</span>
          </h1>
          <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
            جميع مواضيع وحلول شهادة البكالوريا منذ 1999 — تصفح حسب السنة، المادة أو الشعبة
          </p>
        </div>

        {/* ─── Tabs (Client) ──────────────────────────────────────── */}
        <BacTabsClient years={years} subjects={subjects} streams={streams} />

      </div>
    </main>
  );
}