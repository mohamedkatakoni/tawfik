
import {
  GraduationCap,
  Home,
  ChevronLeft,
  BookOpen,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FolderOpen,
} from "lucide-react";

export function getCategoryColor(title: string): string {
    if (title.includes("تقويم")) return "from-emerald-500 to-teal-600";
    if (title.includes("اختبار") || title.includes("إختبارات") ) return "from-amber-500 to-orange-600";
    if (title.includes("فروض")) return "from-rose-500 to-pink-600";
    if (title.includes("درس") || title.includes("مذكرة"))
        return "from-sky-500 to-cyan-600";
    if (title.includes("كتاب")) return "from-violet-500 to-purple-600";
    if (title.includes("ملف")) return "from-indigo-500 to-blue-600";
    return "from-slate-500 to-slate-600";
}

export function getSolutionExist(title: string): boolean {
    return (
        title.includes("اختبار") ||
        title.includes("إختبارات") ||
        title.includes("تقويم") ||
        title.includes("فروض")
    );
}

export function getCategoryIcon(title: string): React.ReactNode {

  if (title.includes("تقويم")) return <FileText className="w-5 h-5" />;
  if (title.includes("اختبار") || title.includes("إختبارات") ) return <FileText className="w-5 h-5" />;
  if (title.includes("فروض")) return <FileText className="w-5 h-5" />;
  if (title.includes("درس") || title.includes("مذكرة")) return <BookOpen className="w-5 h-5" />;
  if (title.includes("كتاب")) return <BookOpen className="w-5 h-5" />;
  if (title.includes("ملف")) return <FolderOpen className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
}


export const durationRebuildCache = 259200



export function getGoogleDocsIframeUrl(inputUrl: string): string {
  try {
    // Parse the input URL to easily extract query parameters
    const url = new URL(inputUrl);

    // Check if the URL contains a 'file' query parameter (used by PDF.js viewers)
    const fileParam = url.searchParams.get('file');

    // If a 'file' parameter exists, use it. 
    // Note: url.searchParams automatically decodes the URL for us!
    // Otherwise, assume the input URL is the direct link to the PDF.
    const actualPdfUrl = fileParam ?? inputUrl;

    // Google Docs Viewer requires the target URL to be URI-encoded
    const encodedUrl = encodeURIComponent(actualPdfUrl);

    return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
  } catch (error) {
    console.error('Invalid URL provided:', inputUrl, error);
    // Fallback to the original URL if parsing fails
    return inputUrl; 
  }
}