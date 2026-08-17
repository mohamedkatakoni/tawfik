import { GraduationCap } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الابتدائي", href: "/ens-pri" },
  { label: "المتوسط", href: "/ens-cm" },
  { label: "الثانوي", href: "/ens-sec" },
  { label: "البكالوريا", href: "/bac-solutions" },
];

export default function SecondaryHeader() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm border-b border-[#E8E2D8]"
      style={{ background: "rgba(247, 243, 236, 0.95)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black font-['Tajawal'] text-[#1A1A1A]">
            توفيق<span className="text-[#7C3AED]">.</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-[#666] hover:text-[#7C3AED] transition-colors font-['Tajawal']"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/ens-pri"
          className="hidden lg:flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-sm font-bold font-['Tajawal'] hover:bg-[#6D28D9] transition-colors"
        >
          ابدأ الآن
        </Link>
      </div>
    </header>
  );
}