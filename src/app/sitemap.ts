import type { MetadataRoute } from "next";
import { bacSolutionsIndex, bemSolutionsIndex } from "@/scraper";
import { finalStageExamsCinqEme } from "@/scraper/finals";

// ─── Config ──────────────────────────────────────────────────────────────────
const SITE_URL = "https://tawfikdz.online/";

// Static stage slugs — match the stageMeta keys in your page files
const PRI_STAGES = ["preparatory", "first-primary", "second-primary", "third-primary", "fourth-primary", "fifth-primary"];
const CM_STAGES  = ["1am", "2am", "3am", "4am"];
const SEC_STAGES = ["1as", "2as", "3as"];

// Sub-pages per section (static paths that always exist under every stage)
const PRI_SUBS = ["books", "exercises", "notes", "resources"];
const CM_SUBS  = ["notes", "pedagogy", "resources", "textbooks"];
const SEC_SUBS = ["books", "external-books", "notes", "pedagogy", "textbooks"];

// ─── Helper ───────────────────────────────────────────────────────────────────
type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

function entry(
  path: string,
  priority: number,
  changeFrequency: Freq = "weekly"
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── 1. Fetch dynamic data from the scrapers (same calls your pages use) ────
  const [bacData, bemData, cinqData] = await Promise.allSettled([
    bacSolutionsIndex(),
    bemSolutionsIndex(),
    finalStageExamsCinqEme(),
  ]);

  const bacYears    = bacData.status    === "fulfilled" ? bacData.value.years    : [];
  const bacSubjects = bacData.status    === "fulfilled" ? bacData.value.subjects : [];
  const bacStreams   = bacData.status   === "fulfilled" ? bacData.value.streams  : [];
  const bemYears    = bemData.status    === "fulfilled" ? bemData.value.years    : [];
  const bemSubjects = bemData.status    === "fulfilled" ? bemData.value.subjects : [];
  const cinqYears   = cinqData.status   === "fulfilled" ? cinqData.value.years   : [];
  const cinqSubjects = cinqData.status  === "fulfilled" ? cinqData.value.subjects : [];

  // ── 2. Static root pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    entry("/",               1.0, "daily"),
    entry("/ens-pri",        0.9, "weekly"),
    entry("/ens-cm",         0.9, "weekly"),
    entry("/ens-sec",        0.9, "weekly"),
    entry("/bac-solutions",  0.95, "weekly"),
    entry("/bem-solutions",  0.9,  "weekly"),
    entry("/cinq-solutions", 0.85, "weekly"),
    // Section-level static pages
    entry("/ens-pri/pedagogy",          0.7, "monthly"),
    entry("/ens-pri/school-supplies",   0.6, "monthly"),
    entry("/ens-cm/school-supplies",    0.6, "monthly"),
    entry("/ens-cm/lessons",            0.7, "weekly"),
    entry("/ens-sec/school-supplies",   0.6, "monthly"),
  ];

  // ── 3. Primary education stages + sub-pages ───────────────────────────────
  const priPages: MetadataRoute.Sitemap = PRI_STAGES.flatMap((stage) => [
    entry(`/ens-pri/${stage}`, 0.8),
    ...PRI_SUBS.map((sub) => entry(`/ens-pri/${stage}/${sub}`, 0.65)),
  ]);

  // ── 4. Middle school stages + sub-pages ───────────────────────────────────
  const cmPages: MetadataRoute.Sitemap = CM_STAGES.flatMap((stage) => [
    entry(`/ens-cm/${stage}`, 0.8),
    ...CM_SUBS.map((sub) => entry(`/ens-cm/${stage}/${sub}`, 0.65)),
  ]);

  // ── 5. Secondary school stages + sub-pages ────────────────────────────────
  const secPages: MetadataRoute.Sitemap = SEC_STAGES.flatMap((stage) => [
    entry(`/ens-sec/${stage}`, 0.8),
    ...SEC_SUBS.map((sub) => entry(`/ens-sec/${stage}/${sub}`, 0.65)),
  ]);

  // ── 6. BAC — years, subjects, streams (dynamically scraped) ───────────────
  const bacPages: MetadataRoute.Sitemap = [
    // /bac-solutions/year/[year]
    ...bacYears.map(({ slug }) =>
      entry(`/bac-solutions/year/${slug}`, 0.85)
    ),
    // /bac-solutions/subject/[subject]
    ...bacSubjects.map(({ slug }) =>
      entry(`/bac-solutions/subject/${slug}`, 0.8)
    ),
    // /bac-solutions/stream/[branch]
    ...bacStreams.map(({ slug }) =>
      entry(`/bac-solutions/stream/${slug}`, 0.75)
    ),
    // /bac-solutions/[bemyear]  (legacy year pages)
    ...bacYears
      .filter((y) => y.isLegacy)
      .map(({ slug }) => entry(`/bac-solutions/${slug}`, 0.7)),
  ];

  // ── 7. BEM — years and subjects (dynamically scraped) ─────────────────────
  const bemPages: MetadataRoute.Sitemap = [
    // /bem-solutions/year/[year]
    ...bemYears.map(({ slug }) =>
      entry(`/bem-solutions/year/${slug}`, 0.85)
    ),
    // /bem-solutions/subject/[subject]
    ...bemSubjects.map(({ slug }) =>
      entry(`/bem-solutions/subject/${slug}`, 0.8)
    ),
  ];

  // ── 8. Cinq-ème — years and subjects (dynamically scraped) ────────────────
  const cinqPages: MetadataRoute.Sitemap = [
    ...cinqYears.map(({ slug }) =>
      entry(`/cinq-solutions/year/${slug}`, 0.8)
    ),
    ...cinqSubjects.map(({ slug }) =>
      entry(`/cinq-solutions/subject/${slug}`, 0.75)
    ),
  ];

  return [
    ...staticPages,
    ...priPages,
    ...cmPages,
    ...secPages,
    ...bacPages,
    ...bemPages,
    ...cinqPages,
  ];
}