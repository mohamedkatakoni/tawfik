"use client";

import { Download } from "lucide-react";

interface DownloadButtonProps {
  url: string;
  fileName?: string;
}

export default function DownloadButton({ url, fileName }: DownloadButtonProps) {
  const handleDownload = () => {
    // Use the proxy route instead of fetching directly
    const proxyUrl = `/api/download?url=${encodeURIComponent(url)}`;

    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = fileName || "tawfik-file.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02] transition-all font-['Tajawal'] cursor-pointer"
    >
      <Download className="w-5 h-5" />
      تحميل الملف
    </button>
  );
}