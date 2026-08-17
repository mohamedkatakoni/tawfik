"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GraduationCap, ArrowLeft } from "lucide-react";
import LenisProvider from "@/components/LenisProvider";

// ─── Animation helpers ───────────────────────────────────────────────────────

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number , number , number , number], delay },
});

const upView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number , number , number , number], delay },
});

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الابتدائي", href: "/ens-pri" },
  { label: "المتوسط", href: "/ens-cm" },
  { label: "الثانوي", href: "/ens-sec" },
  { label: "البكالوريا", href: "/bac-solutions" },
];

const stages = [
  {
    id: "high",
    href: "/ens-sec",
    title: "التعليم الثانوي",
    sub: "HIGH SCHOOL",
    overlay: "rgba(76, 29, 149, 0.55)",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&h=480&fit=crop&q=80",
    offset: false,
  },
  {
    id: "middle",
    href: "/ens-cm",
    title: "التعليم المتوسط",
    sub: "MIDDLE SCHOOL",
    overlay: "rgba(120, 53, 15, 0.55)",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=540&fit=crop&q=80",
    offset: true,
  },
  {
    id: "primary",
    href: "/ens-pri",
    title: "التعليم الابتدائي",
    sub: "PRIMARY SCHOOL",
    overlay: "rgba(6, 78, 59, 0.50)",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=700&h=480&fit=crop&q=80",
    offset: false,
  },
];

const stats = [
  { val: "+50", label: "مادة دراسية" },
  { val: "+10K", label: "اختبار وفرض" },
  { val: "+100K", label: "طالب يستفيد" },
  { val: "100%", label: "مجاني بالكامل" },
];

const features = [
  { icon: "📚", title: "دروس مفصلة", desc: "شرح كامل لكل مادة بأسلوب واضح", bg: "#EDE9FE", color: "#5B21B6" },
  { icon: "📝", title: "اختبارات وفروض", desc: "مع التصحيح النموذجي الكامل", bg: "#FEF3C7", color: "#B45309" },
  { icon: "🎓", title: "مواضيع الشهادات", desc: "BEM والبكالوريا من سنوات سابقة", bg: "#FCE7F3", color: "#9D174D" },
  { icon: "📖", title: "كتب مدرسية", desc: "ملخصات لكل المراحل الدراسية", bg: "#D1FAE5", color: "#065F46" },
];

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-50 bg-[#F7F3EC]/95 backdrop-blur-sm border-b border-[#E8E2D8]"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black font-['Tajawal'] text-[#1A1A1A]">
            توفيق<span className="text-[#7C3AED]">.</span>
          </span>
        </Link>

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

        <Link
          href="/ens-pri"
          className="hidden lg:flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-sm font-bold font-['Tajawal'] hover:bg-[#6D28D9] transition-colors"
        >
          ابدأ الآن
        </Link>
      </div>
    </motion.header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-[#F7F3EC] pt-14 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.p
            {...up(0.05)}
            className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] font-['Tajawal'] mb-4"
          >
            الموقع الأول للتحضير في الجزائر
          </motion.p>

          <motion.h1
            {...up(0.15)}
            className="font-black font-['Tajawal'] text-[#1A1A1A] leading-[1.15] mb-5"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4.2rem)" }}
          >
            تفوقك الدراسي
            <br />
            <span className="text-[#7C3AED] italic">يبدأ</span> من هنا!
          </motion.h1>

          <motion.p
            {...up(0.22)}
            className="text-lg text-[#777] font-['Tajawal'] mb-8 max-w-xl mx-auto leading-relaxed"
          >
            دروس واختبارات وفروض لكل المراحل — من الابتدائي حتى البكالوريا.
            مجاني 100% وبدون تسجيل.
          </motion.p>

          <motion.div
            {...up(0.3)}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/ens-pri"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#7C3AED] text-white font-black font-['Tajawal'] text-base hover:bg-[#6D28D9] transition-all hover:scale-[1.02] shadow-lg shadow-violet-200"
            >
              ابدأ التعلم الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              href="/bac-solutions"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold font-['Tajawal'] text-base hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              مواضيع البكالوريا
            </Link>
          </motion.div>

          <motion.div
            {...up(0.38)}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-[#999] font-['Tajawal']"
          >
            <span>✓ مجاني 100%</span>
            <span>✓ بدون تسجيل</span>
            <span>✓ محتوى مُحدَّث</span>
          </motion.div>
        </div>

        {/* Color-block cards */}
        <div className="grid grid-cols-3 gap-4" style={{ height: 340 }}>
          {stages.map((stage, i) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 + i * 0.1 }}
              className={stage.offset ? "-mt-8" : ""}
              style={{ height: stage.offset ? "calc(100% + 2rem)" : "100%" }}
            >
              <Link
                href={stage.href}
                className="group relative rounded-3xl overflow-hidden block w-full h-full"
              >
                {/* Photo */}
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Color tint */}
                <div className="absolute inset-0" style={{ background: stage.overlay }} />
                {/* Bottom gradient — text always readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                {/* Text */}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-white/75 font-['Tajawal'] mb-1.5">
                    {stage.sub}
                  </p>
                  <p className="text-xl font-black text-white font-['Tajawal'] leading-snug">
                    {stage.title}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="bg-[#F7F3EC] py-6">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          {...upView(0)}
          className="bg-[#1A1A1A] rounded-3xl px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} {...upView(i * 0.07)} className="flex items-center gap-3">
              <div className="w-1 h-10 rounded-full bg-[#7C3AED] shrink-0" />
              <div>
                <p className="text-2xl font-black text-white font-['Tajawal']">{s.val}</p>
                <p className="text-xs text-[#666] font-['Tajawal']">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Why Section ─────────────────────────────────────────────────────────────

function WhySection() {
  return (
    <section className="bg-[#F7F3EC] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div {...upView(0)} className="lg:w-1/2">
            <p className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] font-['Tajawal'] mb-4">
              لماذا توفيق؟
            </p>
            <h2
              className="font-black font-['Tajawal'] text-[#1A1A1A] leading-tight mb-5"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              كل ما تحتاجه
              <br />
              لتحقيق{" "}
              <span className="text-[#7C3AED] italic">التفوق!</span>
            </h2>
            <p className="text-[#777] font-['Tajawal'] text-base max-w-sm mb-8 leading-relaxed">
              دروس وفروض واختبارات محلولة لكل المراحل، مرتبة وسهلة الوصول — كل شيء في مكان واحد.
            </p>
            <Link
              href="/ens-pri"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1A1A1A] text-white font-bold font-['Tajawal'] hover:bg-[#333] transition-colors"
            >
              اكتشف المحتوى
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...upView(0.05 + i * 0.08)}
                className="p-5 rounded-3xl"
                style={{ background: f.bg }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black font-['Tajawal'] mb-1 text-base" style={{ color: f.color }}>
                  {f.title}
                </h3>
                <p className="text-sm font-['Tajawal'] text-[#555] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Exams Section ───────────────────────────────────────────────────────────

function ExamsSection() {
  return (
    <section className="bg-[#F7F3EC] pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...upView(0)} className="mb-10">
          <p className="text-sm font-bold tracking-widest uppercase text-[#7C3AED] font-['Tajawal'] mb-2">
            الشهادات الرسمية
          </p>
          <h2
            className="font-black font-['Tajawal'] text-[#1A1A1A]"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
          >
            مواضيع <span className="text-[#7C3AED]">وحلول</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div {...upView(0.05)}>
            <Link
              href="/bem-solutions"
              className="group relative rounded-3xl overflow-hidden h-72 flex flex-col justify-between p-8 block hover:scale-[1.01] transition-transform"
              style={{ background: "#1A1A1A" }}
            >
              <img
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&h=400&fit=crop&q=80"
                alt="BEM"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-500"
              />
              <div className="relative">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold font-['Tajawal']">
                  شهادة التعليم المتوسط
                </span>
              </div>
              <div className="relative">
                <h3 className="text-3xl font-black text-white font-['Tajawal'] leading-tight mb-4">
                  مواضيع وحلول
                  <br />
                  <span className="text-[#FCD34D]">BEM</span>
                </h3>
                <div className="inline-flex items-center gap-2 text-white/80 font-bold font-['Tajawal'] text-sm group-hover:gap-3 transition-all">
                  استعرض الكل <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div {...upView(0.12)}>
            <Link
              href="/bac-solutions"
              className="group relative rounded-3xl overflow-hidden h-72 flex flex-col justify-between p-8 block hover:scale-[1.01] transition-transform"
              style={{ background: "#4C1D95" }}
            >
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=700&h=400&fit=crop&q=80"
                alt="BAC"
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
              />
              <div className="relative">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold font-['Tajawal']">
                  شهادة البكالوريا
                </span>
              </div>
              <div className="relative">
                <h3 className="text-3xl font-black text-white font-['Tajawal'] leading-tight mb-4">
                  مواضيع وحلول
                  <br />
                  <span className="text-[#C4B5FD]">البكالوريا BAC</span>
                </h3>
                <div className="inline-flex items-center gap-2 text-white/80 font-bold font-['Tajawal'] text-sm group-hover:gap-3 transition-all">
                  من 1996 حتى الآن <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div {...upView(0.1)} className="mt-5">
          <Link
            href="/cinq-solutions"
            className="group relative rounded-3xl overflow-hidden flex items-center justify-between px-10 py-8 hover:scale-[1.005] transition-transform block"
            style={{ background: "#A7F3D0" }}
          >
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=220&fit=crop&q=80"
              alt="ابتدائي"
              className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity"
            />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-[#065F46] font-['Tajawal'] mb-1">
                التعليم الابتدائي
              </p>
              <h3 className="text-2xl font-black text-[#1A1A1A] font-['Tajawal']">
                مواضيع وحلول شهادة التعليم الابتدائي
              </h3>
            </div>
            <div className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-white font-bold font-['Tajawal'] text-sm group-hover:bg-[#333] transition-colors whitespace-nowrap shrink-0">
              استعرض <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      title: "الابتدائي",
      links: [
        { label: "السنة الأولى", href: "/ens-pri/first-primary" },
        { label: "السنة الثانية", href: "/ens-pri/second-primary" },
        { label: "السنة الثالثة", href: "/ens-pri/third-primary" },
        { label: "السنة الرابعة", href: "/ens-pri/fourth-primary" },
        { label: "السنة الخامسة", href: "/ens-pri/fifth-primary" },
      ],
    },
    {
      title: "المتوسط",
      links: [
        { label: "السنة الأولى", href: "/ens-cm/1am" },
        { label: "السنة الثانية", href: "/ens-cm/2am" },
        { label: "السنة الثالثة", href: "/ens-cm/3am" },
        { label: "السنة الرابعة", href: "/ens-cm/4am" },
      ],
    },
    {
      title: "الثانوي",
      links: [
        { label: "السنة الأولى", href: "/ens-sec/1as" },
        { label: "السنة الثانية", href: "/ens-sec/2as" },
        { label: "السنة الثالثة", href: "/ens-sec/3as" },
        { label: "مواضيع البكالوريا", href: "/bac-solutions" },
      ],
    },
  ];

  return (
    <footer className="bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white font-['Tajawal']">
                توفيق<span className="text-[#7C3AED]">.</span>
              </span>
            </div>
            <p className="text-sm text-[#555] font-['Tajawal'] leading-relaxed">
              المنصة الأولى في الجزائر للتحضير الدراسي. مجاني 100% وبدون تسجيل.
            </p>
            <p className="mt-4 text-xs text-[#444] font-['Tajawal']">صنع بـ ❤️ للطلاب الجزائريين</p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold font-['Tajawal'] mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[#555] font-['Tajawal'] hover:text-[#A78BFA] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[#222] flex items-center justify-between">
          <p className="text-sm text-[#444] font-['Tajawal']">© 2026 موقع توفيق. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <LenisProvider>
      <main className="bg-[#F7F3EC]">
        <Header />
        <Hero />
        <StatsBar />
        <WhySection />
        <ExamsSection />
        <Footer />
      </main>
    </LenisProvider>
  );
}