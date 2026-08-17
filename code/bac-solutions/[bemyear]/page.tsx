import { bacScraper } from "@/scraper";
import SecondaryHeader from "@/components/SecondaryHeader";
import BacTabGroup from "@/components/BacTabGroup";
import Link from "next/link";
import { Home, ChevronLeft } from "lucide-react";

export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Page ────────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ bemyear: string }>;
};

export default async function BacYearPage({ params }: PageProps) {
  const { bemyear } = await params;
  const { tabGroups } = await bacScraper(bemyear);

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
          <Link href="/bac-solutions" className="hover:text-[#7C3AED] transition-colors">
            شهادة البكالوريا
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>
            {bemyear}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
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
            مواضيع وحلول بكالوريا {bemyear}
          </h1>
          <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
            جميع الشعب — اختر التبويب المناسب
          </p>
        </div>

        {/* Tab Groups */}
        <div className="space-y-6">
          {tabGroups.map((group) => (
            <BacTabGroup key={group.groupIndex} group={group} />
          ))}
        </div>

        {tabGroups.length === 0 && (
          <div className="text-center py-14">
            <p className="text-xs font-['Tajawal']" style={{ color: "#999" }}>
              لا توجد مواضيع متاحة
            </p>
          </div>
        )}

      </div>
    </main>
  );
}