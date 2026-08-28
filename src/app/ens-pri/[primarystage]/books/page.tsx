import { subCategoryPdfs } from "@/scraper";
import Link from "next/link";
import { Home, ChevronLeft, FileText, Calendar } from "lucide-react";
import SubCategoryClient from "./SubCategoryClient";

type PageProps = {
  params: Promise<{
    primarystage: string;
    material: string;
    pdfsmaterial: string;
  }>;
};

const stageNames: Record<string, string> = {
  "first-primary": "السنة الأولى إبتدائي",
  "second-primary": "السنة الثانية إبتدائي",
  "third-primary": "السنة الثالثة إبتدائي",
  "fourth-primary": "السنة الرابعة إبتدائي",
  "fifth-primary": "السنة الخامسة إبتدائي",
};

const materialNames: Record<string, string> = {
  mathematics: "الرياضيات",
  arabic: "اللغة العربية",
  islamic: "التربية الإسلامية",
  "science-technologie": "العلوم والتكنولوجيا",
  civic: "التربية المدنية",
  french: "اللغة الفرنسية",
  english: "اللغة الإنجليزية",
  "history-geography": "التاريخ والجغرافيا",
  amazigh: "اللغة الأمازيغية",
  "cinq-solutions": "مواضيع وحلول",
};

const stageMeta: Record<string, { bg: string; color: string }> = {
  "first-primary": { bg: "#D1FAE5", color: "#065F46" },
  "second-primary": { bg: "#DBEAFE", color: "#1E40AF" },
  "third-primary": { bg: "#FEF3C7", color: "#92400E" },
  "fourth-primary": { bg: "#EDE9FE", color: "#4C1D95" },
  "fifth-primary": { bg: "#FCE7F3", color: "#9D174D" },
};

export const dynamic = 'force-static';
export const revalidate = 259200;

export default async function SubCategoryPage({ params }: PageProps) {
  const { primarystage, material, pdfsmaterial } = await params;
  const urlpath = `https://eddirasa.com/ens-pri/${primarystage}/books/`
  const data = await subCategoryPdfs("ens-pri", undefined, undefined, undefined,urlpath);

  const stageName = stageNames[primarystage] || primarystage;
  const materialName = materialNames[material] || material;
  const meta = stageMeta[primarystage] ?? { bg: "#EDE9FE", color: "#4C1D95" };

  const totalItems = data.itemsByYear.reduce((sum, y) => sum + y.items.length, 0);

  return (
    <main className="min-h-screen font-['Tajawal']" style={{ background: "#F7F3EC" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">

        {/* ─── Breadcrumb (بدون تغيير) ─────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#AAA" }}>
          <Link href="/" className="flex items-cenملفات وأدواتter gap-1 hover:text-[#7C3AED] transition-colors">
            <Home className="w-3 h-3" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href="/ens-pri" className="hover:text-[#7C3AED] transition-colors">الابتدائي</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href={`/ens-pri/${primarystage}`} className="hover:text-[#7C3AED] transition-colors">{stageName}</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link href={`/ens-pri/${primarystage}/${material}`} className="hover:text-[#7C3AED] transition-colors">{materialName}</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-semibold" style={{ color: "#7C3AED" }}>{data.title}</span>
        </nav>

        {/* ─── Header (بدون تغيير) ─────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
            {stageName}
          </p>
          <h1 className="font-black text-[#1A1A1A] leading-tight mb-2" style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>
            {data.title}
          </h1>
          {data.description && (
            <p className="text-xs max-w-md leading-relaxed" style={{ color: "#777" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* ─── Stats Bar (بدون تغيير) ──────────────────────────────── */}
        <div className="flex items-center gap-4 p-3 rounded-xl mb-6" style={{ background: "#fff" }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: meta.color }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>{data.itemsByYear.length} سنوات</span>
          </div>
          <div className="w-px h-4" style={{ background: "#E8E2D8" }} />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: meta.color }} />
            <span className="text-xs font-bold" style={{ color: "#1A1A1A" }}>{totalItems} ملف</span>
          </div>
        </div>

        {/* ─── الأدوات + القائمة (Client Component) ────────────────── */}
        <SubCategoryClient title={data.title} itemsByYear={data.itemsByYear} meta={meta} />

      </div>
    </main>
  );
}