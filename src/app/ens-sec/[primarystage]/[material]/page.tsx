import { specificMaterialPdfsHighSchool } from "@/scraper";
import Link from "next/link";


export const dynamic = 'force-static';
export const revalidate = 259200;

// ─── Metadata ───────────────────────────────────────────────────────────────

const stageNames: Record<string, string> = {
  "1as": "السنة الأولى ثانوي",
  "2as": "السنة الثانية ثانوي",
  "3as": "السنة الثالثة ثانوي",
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
  physics: "الفيزياء",
  philosophy: "الفلسفة",
  "management-economy": "التسيير والاقتصاد",
  engineering: "علوم المهندس",
  technology: "التكنولوجيا",
  science: "علوم الطبيعة",
  spanish: "اللغة الإسبانية",
  german: "اللغة الألمانية",
  italian: "اللغة الإيطالية",
};


const stageMeta: Record<string, { bg: string; color: string; eyebrow:string }> = {
  "1as": { bg: "#DBEAFE", color: "#1E40AF" , eyebrow:"السنة الأولى ثانوي"},
  "2as": { bg: "#FEF3C7", color: "#92400E",eyebrow: "السنة الثانية ثانوي"},
  "3as": { bg: "#EDE9FE", color: "#4C1D95" , eyebrow: "السنة الثالثة ثانوي"},
};
const materialColors: Record<string, { bg: string; text: string }> = {
  "mathematics":       { bg: "#D1FAE5", text: "#065F46" },
  "arabic":            { bg: "#FEF3C7", text: "#92400E" },
  "islamic":           { bg: "#E0F2FE", text: "#0369A1" },
  "science-technologie": { bg: "#EDE9FE", text: "#5B21B6" },
  "civic":             { bg: "#FCE7F3", text: "#9D174D" },
  "french":            { bg: "#DBEAFE", text: "#1E40AF" },
  "english":           { bg: "#FEF9C3", text: "#854D0E" },
  "history-geography": { bg: "#FFEDD5", text: "#9A3412" },
  "amazigh":           { bg: "#CCFBF1", text: "#115E59" },
  "physics":           { bg: "#DBEAFE", text: "#1E40AF" },
  "philosophy":        { bg: "#EDE9FE", text: "#5B21B6" },
  "management-economy": { bg: "#D1FAE5", text: "#065F46" },
  "engineering":       { bg: "#E0F2FE", text: "#0369A1" },
  "technology":        { bg: "#CCFBF1", text: "#115E59" },
  "science":           { bg: "#FCE7F3", text: "#9D174D" },
  "spanish":           { bg: "#FEF3C7", text: "#92400E" },
  "german":            { bg: "#FEF9C3", text: "#854D0E" },
  "italian":           { bg: "#D1FAE5", text: "#065F46" },
};
// Tab accent colors
const tabColors: Record<string, { bg: string; color: string }> = {
  "علمي": { bg: "#DBEAFE", color: "#1E40AF" },
  "أدبي": { bg: "#FEF3C7", color: "#92400E" },
  "تقني رياضي": { bg: "#D1FAE5", color: "#065F46" },
  "رياضيات": { bg: "#EDE9FE", color: "#4C1D95" },
  "default": { bg: "#F7F3EC", color: "#1A1A1A" },
};

function getTabMeta(tabTitle: string) {
  if (tabTitle.includes("علمي")) return tabColors["علمي"];
  if (tabTitle.includes("أدبي")) return tabColors["أدبي"];
  if (tabTitle.includes("تقني")) return tabColors["تقني رياضي"];
  if (tabTitle.includes("رياضيات")) return tabColors["رياضيات"];
  return tabColors["default"];
}

// ─── Page ────────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{
    primarystage: string;
    material: string;
  }>;
};

import { educationalMaterial } from "@/scraper";


// ─── Page ────────────────────────────────────────────────────────────────────

import { specificMaterialPdfs } from "@/scraper";

import { getSolutionExist, getCategoryIcon } from "@/utils";
import {
  Home,
  ChevronLeft,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FolderOpen,
  ClipboardCheck,
  BookOpen,
  Library,
  FolderArchive,
  PenTool,
  ArrowLeft,
} from "lucide-react";





// Design System Color Mapping for Sections
const sectionStyles: Record<string, { bg: string; text: string; icon: any; accent: string }> = {
  assessments: { bg: "#FCE7F3", text: "#9D174D", icon: ClipboardCheck, accent: "#F9A8D4" },
  learning: { bg: "#A7F3D0", text: "#065F46", icon: BookOpen, accent: "#6EE7B7" },
  practice: { bg: "#FEF3C7", text: "#B45309", icon: PenTool, accent: "#FCD34D" },
  books: { bg: "#DBEAFE", text: "#1E40AF", icon: Library, accent: "#93C5FD" },
  files: { bg: "#EDE9FE", text: "#5B21B6", icon: FolderArchive, accent: "#C4B5FD" },
  default: { bg: "#F3F4F6", text: "#374151", icon: FileText, accent: "#D1D5DB" },
};



export default async function MaterialPage({ params }: PageProps) {
  const { primarystage, material } = await params;
  const categories = await specificMaterialPdfs("ens-sec", primarystage, material);
  const stageName = stageNames[primarystage] || primarystage;
  const materialName = materialNames[material] || material;

  // Calculate totals
  const totalSections = categories.length;
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalFiles = categories.reduce(
    (sum, cat) => sum + cat.items.reduce((s, item) => s + (parseInt(item.numberOfMaterial || "0", 10) || 0), 0),
    0
  );

  return (
    <main className="min-h-screen font-['Tajawal']" style={{ background: "#F7F3EC" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* ─── Breadcrumb ───────────────────────────────────────────────── */}
        <nav className="flex items-center justify-center gap-3 text-sm mb-10" style={{ color: "#999" }}>
          <Link href="/" className="flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors">
            <Home className="w-4 h-4" />
            <span className="font-semibold">الرئيسية</span>
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/ens-sec" className="font-semibold hover:text-[#7C3AED] transition-colors">المتوسط</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/ens-sec/${primarystage}`} className="font-semibold hover:text-[#7C3AED] transition-colors">
            {stageName}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-black" style={{ color: "#7C3AED" }}>{materialName}</span>
        </nav>

        {/* ─── Hero Header ──────────────────────────────────────────────── */}
        <header className="text-center mb-10">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#7C3AED" }}
          >
            {stageName}
          </p>
          
          <h1
            className="font-black text-[#1A1A1A] leading-[1.1] mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
          >
            {materialName}
          </h1>
          
          <p className="text-base font-medium max-w-lg mx-auto leading-relaxed" style={{ color: "#666" }}>
            مكتبة شاملة تحتوي على <span className="italic" style={{ color: "#7C3AED" }}>{totalItems}</span> قسم و <span className="italic" style={{ color: "#7C3AED" }}>{totalFiles}</span> ملف تعليمي
          </p>
        </header>

        {/* ─── Stats Bar ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <div className="text-center">
            <div className="font-black text-3xl mb-1.5" style={{ color: "#1A1A1A" }}>{totalSections}</div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#999" }}>أقسام</div>
          </div>
          <div className="w-px h-10" style={{ background: "#7C3AED" }}></div>
          <div className="text-center">
            <div className="font-black text-3xl mb-1.5" style={{ color: "#1A1A1A" }}>{totalItems}</div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#999" }}>فروع</div>
          </div>
          <div className="w-px h-10" style={{ background: "#7C3AED" }}></div>
          <div className="text-center">
            <div className="font-black text-3xl mb-1.5" style={{ color: "#1A1A1A" }}>{totalFiles}</div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "#999" }}>ملفات</div>
          </div>
        </div>

        {/* ─── Categories ───────────────────────────────────────────────── */}
        <div className="space-y-6">
          {categories.map((category, catIndex) => {
            const style = sectionStyles[category.groupType] || sectionStyles.default;
            const Icon = style.icon;
            const totalCategoryFiles = category.items.reduce(
              (sum, item) => sum + (parseInt(item.numberOfMaterial || "0", 10) || 0), 0
            );

            return (
              <div
                key={catIndex}
                className="rounded-3xl overflow-hidden"
                style={{ background: style.bg }}
              >
                {/* ─── Category Header ──────────────────────────────────── */}
                <div className="p-6 md:p-7">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "#fff" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: style.text }} />
                      </div>
                      <div className="text-right">
                        <h3 className="font-black text-lg md:text-xl" style={{ color: style.text }}>
                          {category.categoryTitle}
                        </h3>
                        <p className="text-xs font-bold mt-1" style={{ color: style.text, opacity: 0.7 }}>
                          {category.items.length} فروع • {totalCategoryFiles} ملف
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── Category Items Grid ──────────────────────────────── */}
                <div className="px-6 md:px-7 pb-6 md:pb-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.items.map((item, itemIndex) => (
                      item.path.includes("video-lessons") ? null :
                      <Link
                        key={itemIndex}
                        href={item.path}
                        className="group flex items-center justify-between p-4 rounded-xl bg-white/70 hover:bg-white transition-all hover:scale-[1.01]"
                      >
                        <div className="flex-1 min-w-0 text-right pr-3">
                          <span 
                            className="font-bold text-sm block truncate leading-relaxed" 
                            style={{ color: style.text }}
                          >
                            {item.title}
                            {/* {item.path} */}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <FileText className="w-3.5 h-3.5" style={{ color: style.text, opacity: 0.6 }} />
                            <span className="text-xs font-semibold" style={{ color: style.text, opacity: 0.7 }}>
                              {item.numberOfMaterial} ملف
                            </span>
                          </div>
                        </div>
                        <ArrowLeft 
                          className="w-5 h-5 transition-transform group-hover:-translate-x-1 shrink-0" 
                          style={{ color: style.text }} 
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Empty State ──────────────────────────────────────────────── */}
        {categories.length === 0 && (
          <div className="text-center py-24">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "#EDE9FE" }}
            >
              <FileText className="w-7 h-7" style={{ color: "#5B21B6" }} />
            </div>
            <p className="text-base font-bold" style={{ color: "#777" }}>
              لا توجد أقسام متاحة حالياً
            </p>
          </div>
        )}

        
      </div>
    </main>
  );
}