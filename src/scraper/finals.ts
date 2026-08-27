import * as cheerio from "cheerio";

export async function finalbac(stage:string) {
    const url = `https://eddirasa.com/${stage}/`;
    const $ = await cheerio.fromURL(url);

    const list: { numberOfPdfs: string; text: string; link: string }[] = [];
    const cinqSelector = `#sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div > div:nth-child(13) > a`
    const bacbem = `#sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div.row.g-3 > div:nth-child(1) > a`
    let sec = stage === "ens-pri/fifth-primary" ? cinqSelector : bacbem
    $(sec).each((_ ,el)=>{
        const href = $(el).attr("href")!;
        const path = href.split("/").filter(Boolean).pop();
        const obj = {
            numberOfPdfs:$(el).find(`span.ed-category-count > strong`).text()
                .trim(),

            text: $(el).find("span.ed-category-label").text().trim(),
            link: path || "",
        }
        list.push(obj)
    })
    return list
}


export async function cinqEmeYearScraper(year: string) {
    // Ensure single trailing slash
    const url = `https://eddirasa.com/ens-pri/fifth-primary/cinq-solutions/cinq-${year}/`;
    const $ = await cheerio.fromURL(url);

    // Get title from breadcrumb or header
    const title = $("h1.ed-breadcrumb-title").text().trim() || $("header.bac-archive-head h2").text().trim();

    // Get description from the paragraph inside the header
    // We clone it and remove inner divs/spans to avoid grabbing injected ad text
    const descClone = $("header.bac-archive-head p").first().clone();
    descClone.find("div, span, a").remove();
    const description = descClone.text().trim();

    const subjects: {
        subject: string;
        exam: { text: string; path: string };
        correction: { text: string; path: string } | null;
    }[] = [];

    // Target the new accordion layout
    $(".bac-smart-subject").each((_, el) => {
        // 1. Subject Name
        const subject = $(el).find(".bac-smart-copy strong").first().text().trim();
        
        // 2. Exam (Topic) Link
        const examLink = $(el).find("a.bac-smart-action.is-topic").first();
        const examPath = examLink.attr("href") || "";
        const examText = examLink.find("strong").text().trim() || "الموضوع";

        // 3. Correction Link
        let correction: { text: string; path: string } | null = null;
        const corrLink = $(el).find("a.bac-smart-action.is-correction").first();
        
        if (corrLink.length > 0) {
            const corrPath = corrLink.attr("href") || "";
            const corrText = corrLink.find("strong").text().trim() || "التصحيح";
            if (corrPath) {
                correction = { text: corrText, path: corrPath };
            }
        }

        if (subject && examPath) {
            subjects.push({
                subject,
                exam: { text: examText, path: examPath },
                correction,
            });
        }
    });

    return { title, description, subjects };
}

// just for cinq eme — NEW structure (bac-year-grid / bac-subject-hub-grid)
export async function finalStageExamsCinqEme() {
    const url = "https://eddirasa.com/ens-pri/fifth-primary/cinq-solutions/";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
        $(".ed-breadcrumb-title").text().trim() ||
        $(".bac-archive-head h2").text().trim();
    const description = $(".bac-archive-head p").first().text().trim();

    // ── Tab: حسب السنة ─────────────────────────────────────────────
    const years: { year: string; title: string; slug: string }[] = [];
    $(".bac-year-card").each((_, el) => {
        const href = $(el).attr("href") || "";
        years.push({
            year: $(el).find(".bac-year-icon").text().trim(),
            title: $(el).find("strong").text().trim(),
            slug: href.split("/").filter(Boolean).pop() || "",
        });
    });

    // ── Tab: حسب المادة ────────────────────────────────────────────
    const subjects: {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
        slug: string;
    }[] = [];
    $(".bac-subject-hub-card").each((_, el) => {
        const style = $(el).find(".bac-subject-icon").attr("style") || "";
        const href = $(el).attr("href") || "";
        subjects.push({
            title: $(el).find("strong").text().trim(),
            subtitle: $(el).find("small").text().trim(),
            icon: $(el).find("img").attr("src") || "",
            color:
                style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
                "#7C3AED",
            slug: href.split("/").filter(Boolean).pop() || "",
        });
    });

    return { title, description, years, subjects };
}

export async function cinqSubjectScraper(subject: string) {
    const url = `https://eddirasa.com/ens-pri/fifth-primary/cinq-solutions/subject/${subject}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Title (h2) — clean text
    const title = $(".bac-archive-head h2").text().trim();

    // Description — remove google annotations
    const pClone = $(".bac-archive-head > p").first().clone();
    pClone.find(".google-anno-skip, .google-anno, a, div").remove();
    const description = pClone.text().trim();

    // Results summary
    const summary = $(".bac-results-summary").text().trim();

    // Years sections
    const years: {
        yearTitle: string;
        subjects: {
            title: string;
            subtitle: string;
            icon: string;
            color: string;
            topic: { path: string; text: string } | null;
            correction: { path: string; text: string } | null;
        }[];
    }[] = [];

    $("section.bac-subject-year").each((_, sec) => {
        const yearTitle = $(sec).find("h3").first().text().trim();

        const subjects = $(sec)
            .find(".bac-smart-subject")
            .map((_, el) => {
                const $el = $(el);
                const iconEl = $el.find("summary .bac-subject-icon");
                const style = iconEl.attr("style") || "";

                let topic: { path: string; text: string } | null = null;
                let correction: { path: string; text: string } | null = null;

                $el.find(".bac-smart-action").each((_, a) => {
                    const $a = $(a);
                    const path =
                        ($a.attr("href") || "").split("/").filter(Boolean).pop() || "";
                    const text = $a.find("strong").text().trim();

                    if ($a.hasClass("is-correction")) {
                        correction = { path, text };
                    } else if ($a.hasClass("is-topic")) {
                        // handles both normal topic AND "is-combined" (الموضوع مع التصحيح)
                        topic = { path, text };
                    }
                });

                return {
                    title: $el.find("summary .bac-smart-copy strong").text().trim(),
                    subtitle: $el.find("summary .bac-smart-copy small").text().trim(),
                    icon: iconEl.find("img").attr("src") || "",
                    color:
                        style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
                        "#7C3AED",
                    topic,
                    correction,
                };
            })
            .get();

        if (yearTitle && subjects.length > 0) {
            years.push({ yearTitle, subjects });
        }
    });

    return { title, description, summary, years };
}