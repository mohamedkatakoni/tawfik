import * as cheerio from "cheerio";
import { getGoogleDocsIframeUrl } from "@/utils";
export async function enspri(stage: string) {
    // this function scrape the ens-pri , ens-cm and ens-sec page and return the stages ( educational levels )
    const url = `https://eddirasa.com/${stage}/`;
    const $ = await cheerio.fromURL(url);
    // console.log($.html());
    const list: { numberOfPdfs: string; text: string; link: string }[] = [];
    $(
        "#sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div > div > a",
    ).each((i, el) => {
        const href = $(el).attr("href")!;
        const path = href.split("/").filter(Boolean).pop();
        // #sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div > div:nth-child(3) > a > span.ed-category-count > strong
        const item = {
            numberOfPdfs: $(el)
                .find(`span.ed-category-count > strong`)
                .text()
                .trim(),

            text: $(el).find("span.ed-category-label").text().trim(),
            link: path || "",
        };
        list.push(item);
    });
    return list;
}

export async function educationalMaterial(stage: string, level: string) {
    const url = `https://eddirasa.com/${stage}/${level}`;
    const $ = await cheerio.fromURL(url);
    const list: {
        numberOfPdfs: string;
        img: string;
        link: string;
        text: string;
    }[] = [];
    $(
        "#sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div > div > a",
    ).each((_, el) => {
        const href = $(el).attr("href")!;
        const path = href.split("/").filter(Boolean).pop();
        const item = {
            numberOfPdfs: $(el)
                .find(`span.ed-category-count > strong`)
                .text()
                .trim(),
            link: path || "",
            img: $(el).find("span.ed-category-icon img").attr("src")!,
            text: $(el).find("span.ed-category-label").text().trim()!,
        };
        list.push(item);
    });
    return list;
}

// export async function specificMaterialPdfs(
//     stage: string,
//     level: string,
//     material: string,
// ) {
//     const selector = "#the-post > div > div.entry > div.toggle.tie-sc-close";
//     const url = `https://eddirasa.com/${stage}/${level}/${material}`;
//     const $ = await cheerio.fromURL(url);
//     const list: {
//         title: string;
//         numberOfMaterial: string;
//         linksOfPdfs: {
//             text: string;
//             pathOfPdf: string;
//             year: string;
//             hasSolution: boolean;
//         }[];
//     }[] = [];
//     $(selector).each((i, el) => {
//         const semiList: {
//             text: string;
//             pathOfPdf: string;
//             year: string;
//             hasSolution: boolean;
//         }[] = [];
//         $(el)
//             .find("div.toggle-content > div ")
//             .each((_, ele) => {
//                 const href =
//                     $(ele)
//                         .find("div.btn-group > a.btn.btn-outline-secondary")
//                         .attr("href") || "";
//                 const path = href.split("/").filter(Boolean).pop() || "";
//                 const semiItem = {
//                     text: $(ele)
//                         .find("div.btn-group > a.btn.btn-outline-secondary")
//                         .text()
//                         .trim()!,
//                     pathOfPdf: path || "",
//                     year: $(ele)
//                         .find("div.btn-group > a.btn.btn-secondary")
//                         .text()
//                         .trim()!,
//                     hasSolution:
//                         $(ele).find(
//                             "div.btn-group > a.btn.btn-secondary span.fa.fa-times",
//                         ).length === 0,
//                 };
//                 semiList.push(semiItem);
//                 // btn btn-secondary active
//             });
//         const item = {
//             title: $(el).find("h3 > a > button.b-eddirasa").text().trim(),
//             numberOfMaterial: $(el)
//                 .find("h3 > a > button.c-eddirasa > span")
//                 .text()
//                 .trim(),
//             linksOfPdfs: semiList,
//         };
//         list.push(item);
//     });

//     return list;
// }

export async function subCategoryPdfs(
    stage: string,
    level: string,
    material: string,
    pdfsMaterial: string,
) {
    const url =
        `https://eddirasa.com/${stage}/${level}/${material}/${pdfsMaterial}/`.replace(
            /([^:]\/)\/+/g,
            "$1",
        );

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const pageTitle = $(".ed-breadcrumb-title").text().trim();
    const pageDescription = $(
        ".page-description, .tag-description-custom, .ed-global-description",
    )
        .first()
        .text()
        .trim();

    const result: {
        title: string;
        description: string;
        itemsByYear: {
            year: string;
            items: {
                title: string;
                path: string;
                year: string;
                hasSolution: boolean;
                image: string;
            }[];
        }[];
    } = {
        title: pageTitle,
        description: pageDescription,
        itemsByYear: [],
    };

    $(".ed-legacy-year-block").each((_, yearBlock) => {
        const year = $(yearBlock).attr("data-year") || "";
        const items: {
            title: string;
            path: string;
            year: string;
            hasSolution: boolean;
            image: string;
        }[] = [];

        $(yearBlock)
            .find(".ed-legacy-row")
            .each((_, row) => {
                const title =
                    $(row).find(".ed-legacy-title").text().trim() ||
                    $(row).attr("data-title") ||
                    $(row).attr("title") ||
                    "";

                const href = $(row).attr("href") || "";
                const path = href.split("/").filter(Boolean).pop() || "";
                const itemYear =
                    $(row).find(".ed-legacy-year").text().trim() || year;

                const hasSolution =
                    $(row).hasClass("has-solution") ||
                    $(row).attr("data-solution") === "1" ||
                    $(row).find(".ed-legacy-solution i.bi-check-circle-fill")
                        .length > 0;

                // NEW: thumbnail image for gallery view
                const image =
                    $(row).find("img[data-ed-card-image]").attr("src") ||
                    $(row).find("img[data-ed-card-image]").attr("data-src") ||
                    "";

                items.push({ title, path, year: itemYear, hasSolution, image });
            });

        if (year && items.length > 0) {
            result.itemsByYear.push({ year, items });
        }
    });

    return result;
}

export async function specificMaterialPdfs(
    stage: string,
    level: string,
    material: string,
) {
    const url = `https://eddirasa.com/${stage}/${level}/${material}/`.replace(
        /([^:]\/)\/+/g,
        "$1",
    );

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const list: {
        categoryTitle: string;
        groupType: string; // New: to map with Design System colors
        items: {
            title: string;
            numberOfMaterial: string;
            path: string;
        }[];
    }[] = [];

    $(".ed-tag-group").each((i, el) => {
        const categoryTitle = $(el)
            .find(".ed-tag-group-title strong")
            .text()
            .trim();

        // Extract group type from classes (assessments, learning, practice, books, files)
        const classes = $(el).attr("class") || "";
        let groupType = "default";
        if (classes.includes("assessments")) groupType = "assessments";
        else if (classes.includes("learning")) groupType = "learning";
        else if (classes.includes("practice")) groupType = "practice";
        else if (classes.includes("books")) groupType = "books";
        else if (classes.includes("files")) groupType = "files";

        const items: {
            title: string;
            numberOfMaterial: string;
            path: string;
        }[] = [];

        $(el)
            .find(".ed-tag-card")
            .each((_, card) => {
                const title = $(card).find(".ed-tag-title").text().trim();
                const numberOfMaterial =
                    $(card).attr("data-count") ||
                    $(card).find(".ed-tag-count strong").text().trim() ||
                    "0";
                const path = $(card).attr("href") || "";

                if (title && path) {
                    items.push({ title, numberOfMaterial, path });
                }
            });

        if (categoryTitle && items.length > 0) {
            list.push({ categoryTitle, groupType, items });
        }
    });

    return list;
}
// src/lib/scraper.ts  (or wherever pdfIfarem lives)


/* ─── helpers ─── */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  opts?: RequestInit,
  retries = 3
): Promise<Response> {
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua":
      '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    ...(opts?.headers as Record<string, string>),
  };

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { ...opts, headers, redirect: "follow" });
      if (res.ok) return res;

      // honour eddirasa's Retry-After header
      if (res.status === 503 && i < retries - 1) {
        const retryAfter =
          Number(res.headers.get("retry-after")) || Math.pow(2, i);
        await sleep(retryAfter * 1000);
        continue;
      }
      throw new Error(`Upstream HTTP ${res.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(1000 * (i + 1));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function pdfIfarem(pdfurl: string) {
  const selector = "#articleFileFrame";
  const url = `https://eddirasa.com/${pdfurl}`;

  const res = await fetchWithRetry(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const iframeUrl = $(selector).attr("src") ?? "";
  const description = $(
    "#sitePage > main > div > nav > ol > li.breadcrumb-item.active > h1"
  )
    .text()
    .trim();

  const urlDownload = $(
    "#the-post > div > div.entry > div.btn-group > a.btn.btn-danger"
  ).attr("href");

  const examsList: {
    text: string;
    year: string;
    hasSolution: boolean;
    pathOfPdf: string;
  }[] = [];

  const realtedItems: { img: string; text: string; pathOfPdf: string }[] = [];

  if ($("#related_posts > div.post-listing > div.item-list-exams").length !== 0) {
    $("#related_posts > div.post-listing > div.item-list-exams").each(
      (_, ele) => {
        const href = $(ele)
          .find("div.btn-group > a.btn.btn-outline-secondary")
          .attr("href")!;
        const path = href.split("/").filter(Boolean).pop();
        const item = {
          text: $(ele)
            .find("div.btn-group > a.btn.btn-outline-secondary")
            .text()
            .trim(),
          pathOfPdf: path || "",
          year: $(ele)
            .find("div.btn-group > a.btn.btn-secondary")
            .text()
            .trim(),
          hasSolution:
            $(ele).find(
              "div.btn-group > a.btn.btn-secondary span.fa.fa-times"
            ).length === 0,
        };
        examsList.push(item);
      }
    );
  } else {
    $("#related_posts > div.post-listing > div.related-item").each((_, el) => {
      const href = $(el).find("h3 > a").attr("href")!;
      const path = href.split("/").filter(Boolean).pop() || "";
      const item = {
        text: $(el).find("h3 a").text().trim(),
        pathOfPdf: path,
        img: $(el).find("img").attr("src")!,
      };
      realtedItems.push(item);
    });
  }

  // ── resolve the 'file' param: absolute OR relative ──
  let pdfFileUrl: string | null = null;
  try {
    const viewer = new URL(iframeUrl);
    const rawFile = viewer.searchParams.get("file");
    if (rawFile) {
      pdfFileUrl = rawFile.startsWith("http")
        ? rawFile
        : new URL(rawFile, "https://eddirasa.com").href;
    }
  } catch {
    pdfFileUrl = null;
  }

  return {
    viewerUrl: iframeUrl,
    pdfFileUrl,
    description,
    urlDownload,
    realtedItems,
    examsList,
  };
}

function extractPdfFileUrl(viewerUrl: string): string | null {
  try {
    return new URL(viewerUrl).searchParams.get("file");
  } catch {
    return null;
  }
}
// export async function pdfIfarem(pdfurl: string) {
//     const selector = "#articleFileFrame";
//     // #the-post > div > div.entry > div:nth-child(6) > iframe
//     const url = `https://eddirasa.com/${pdfurl}`;

//     const $ = await cheerio.fromURL(url);
//     const iframeUrl = $(selector).attr("src")!;
//     const description = $(
//         "#sitePage > main > div > nav > ol > li.breadcrumb-item.active > h1",
//     )
//         .text()
//         .trim();
//     const urlDownload = $(
//         "#the-post > div > div.entry > div.btn-group > a.btn.btn-danger",
//     ).attr("href");
//     const examsList: {
//         text: string;
//         year: string;
//         hasSolution: boolean;
//         pathOfPdf: string;
//     }[] = [];
//     const realtedItems: { img: string; text: string; pathOfPdf: string }[] = [];

//     if (
//         $("#related_posts > div.post-listing > div.item-list-exams").length !==
//         0
//     ) {
//         $("#related_posts > div.post-listing > div.item-list-exams").each(
//             (_, ele) => {
//                 const href = $(ele)
//                     .find("div.btn-group > a.btn.btn-outline-secondary")
//                     .attr("href")!;
//                 const path = href.split("/").filter(Boolean).pop();
//                 const item = {
//                     text: $(ele)
//                         .find("div.btn-group > a.btn.btn-outline-secondary")
//                         .text()
//                         .trim()!,
//                     pathOfPdf: path || "",
//                     year: $(ele)
//                         .find("div.btn-group > a.btn.btn-secondary")
//                         .text()
//                         .trim()!,
//                     hasSolution:
//                         $(ele).find(
//                             "div.btn-group > a.btn.btn-secondary span.fa.fa-times",
//                         ).length === 0,
//                 };
//                 examsList.push(item);
//             },
//         );
//     } else {
//         $("#related_posts > div.post-listing > div.related-item").each(
//             (_, el) => {
//                 const href = $(el).find("h3 > a").attr("href")!;
//                 const path = href.split("/").filter(Boolean).pop() || "";
//                 const item = {
//                     text: $(el).find("h3 a").text().trim(),
//                     pathOfPdf: path,
//                     img: $(el).find("img").attr("src")!,
//                 };
//                 realtedItems.push(item);
//             },
//         );
//     }
//    const rawViewerUrl = $(selector).attr("src") ?? "";

//   return {
//     viewerUrl: iframeUrl,                          // raw eddirasa viewer URL
//     pdfFileUrl: (() => {                           // actual .pdf file URL
//       try { return new URL(iframeUrl).searchParams.get("file"); }
//       catch { return null; }
//     })(),
//     description,
//     urlDownload,
//     realtedItems,
//     examsList,
//   };
// }

// just for  cinq eme
export async function finalStageExamsCinqEme() {
    const url = `https://eddirasa.com/ens-pri/fifth-primary/cinq-solutions/`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract page title and description using the new site structure
    const titlePage = $(".ed-breadcrumb-title, h1.name.post-title").first().text().trim();
    const description = $(".page-description, .tag-description-custom, .ed-global-description, div.entry > p").first().text().trim();

    const list: {
        year: string;
        items: {
            text: string;
            pathOfPdf: string;
            year: string;
            hasSolution: boolean;
        }[];
    }[] = [];

    // The new structure groups items by year blocks
    const yearBlocks = $(".ed-legacy-year-block");

    if (yearBlocks.length > 0) {
        yearBlocks.each((_, yearBlock) => {
            const year = $(yearBlock).attr("data-year") || "سنوات أخرى";
            const items: {
                text: string;
                pathOfPdf: string;
                year: string;
                hasSolution: boolean;
            }[] = [];

            $(yearBlock).find(".ed-legacy-row").each((_, row) => {
                const href = $(row).attr("href") || "";
                const path = href.split("/").filter(Boolean).pop() || "";
                
                const text = $(row).attr("data-title") || $(row).attr("title") || $(row).find(".ed-legacy-title").text().trim();
                const itemYear = $(row).attr("data-year") || $(row).find(".ed-legacy-year").text().trim() || year;
                
                // Check for solution using the new classes and data attributes
                const hasSolution = $(row).hasClass("has-solution") || 
                                    $(row).attr("data-solution") === "1" || 
                                    $(row).find(".ed-legacy-solution i.bi-check-circle-fill").length > 0;

                if (path) {
                    items.push({ text, pathOfPdf: path, year: itemYear, hasSolution });
                }
            });

            if (items.length > 0) {
                list.push({ year, items });
            }
        });
    } else {
        // Fallback: If the page just outputs a flat list of rows without year blocks
        const items: {
            text: string;
            pathOfPdf: string;
            year: string;
            hasSolution: boolean;
        }[] = [];

        $(".ed-legacy-row").each((_, row) => {
            const href = $(row).attr("href") || "";
            const path = href.split("/").filter(Boolean).pop() || "";
            
            const text = $(row).attr("data-title") || $(row).attr("title") || $(row).find(".ed-legacy-title").text().trim();
            const itemYear = $(row).attr("data-year") || $(row).find(".ed-legacy-year").text().trim() || "";
            
            const hasSolution = $(row).hasClass("has-solution") || 
                                $(row).attr("data-solution") === "1" || 
                                $(row).find(".ed-legacy-solution i.bi-check-circle-fill").length > 0;

            if (path) {
                items.push({ text, pathOfPdf: path, year: itemYear, hasSolution });
            }
        });

        if (items.length > 0) {
            list.push({ year: "الكل", items });
        }
    }

    return { list, description, titlePage };
}
// just for bem
export async function finalStageExamsBem(stage: string) {
    const selector = "#the-post > div > div.entry > table > tbody > tr";
    const url = `https://eddirasa.com/${stage}/`;
    const $ = await cheerio.fromURL(url);
    const list: {
        title: string;
        year: string;
        urlbem: string;
    }[] = [];
    const data = $(selector).toArray().slice(1);

    data.forEach((ele) => {
        const href = $(ele).find("td:nth-child(2) a").attr("href")!;
        const path = href.split("/").filter(Boolean).pop() || "";
        const item = {
            year: $(ele).find("td:nth-child(1)").text().trim(),
            urlbem: path,
            title: $(ele).find("td:nth-child(2) a").text().trim(),
        };
        list.push(item);
    });
    return { list };
}

export async function bemYearScraper(bemyear: string) {
    const url = `https://eddirasa.com/${bemyear}/`;
    const $ = await cheerio.fromURL(url);

    // Get title from h1
    const title = $("h1.name.post-title.entry-title").text().trim();

    // Get description paragraphs (before the table)
    const description: string[] = [];
    $("div.entry > p").each((_, el) => {
        const text = $(el).text().trim();
        // Filter out empty text, ads, and jQuery scripts
        if (
            text &&
            !text.includes("adsbygoogle") &&
            !text.includes("jQuery") &&
            !text.includes("document.ready") &&
            !text.includes("tabs-nav") &&
            !text.includes("function($)") &&
            text.length > 10
        ) {
            description.push(text);
        }
    });

    // Parse table rows
    const subjects: {
        subject: string;
        exam: { text: string; path: string };
        correction: { text: string; path: string } | null;
    }[] = [];

    $("div.entry table tbody tr").each((_, tr) => {
        const tds = $(tr).find("td");
        if (tds.length < 2) return; // Skip header row

        const subject = $(tds[0]).text().trim();

        // Exam link (second td)
        const examLink = $(tds[1]).find("a").first();
        const examHref = examLink.attr("href") || "";
        const examPath = examHref.split("/").filter(Boolean).pop() || "";
        const examText = examLink.text().trim() || $(tds[1]).text().trim();

        // Correction link (third td)
        let correction: { text: string; path: string } | null = null;
        if (tds.length >= 3) {
            const corrLink = $(tds[2]).find("a").first();
            const corrHref = corrLink.attr("href") || "";
            const corrPath = corrHref.split("/").filter(Boolean).pop() || "";
            const corrText = corrLink.text().trim() || $(tds[2]).text().trim();
            if (corrPath) {
                correction = { text: corrText, path: corrPath };
            }
        }

        if (examPath) {
            subjects.push({
                subject,
                exam: { text: examText, path: examPath },
                correction,
            });
        }
    });

    return { title, description, subjects };
}

// just for bac

// In your scraper/index.ts file, add this function:

export async function specificMaterialPdfsHighSchool(
    stage: string,
    level: string,
    material: string,
) {
    const url = `https://eddirasa.com/${stage}/${level}/${material}`;
    const $ = await cheerio.fromURL(url);

    // Result structure: each tab group contains tabs, each tab contains categories
    const tabGroups: {
        groupIndex: number;
        tabs: {
            tabTitle: string;
            tableTitle: string;
            hasTable: boolean;
            tableRows: {
                subject: string;
                exam: { text: string; path: string };
                correction: { text: string; path: string } | null;
            }[];
            categories: {
                title: string;
                numberOfMaterial: string;
                linksOfPdfs: {
                    text: string;
                    pathOfPdf: string;
                    year: string;
                    hasSolution: boolean;
                }[];
            }[];
        }[];
    }[] = [];

    // Find all post-tabs containers
    $("div.entry div.post-tabs").each((groupIndex, groupEl) => {
        const tabs: {
            tabTitle: string;
            tableTitle: string;
            hasTable: boolean;
            tableRows: {
                subject: string;
                exam: { text: string; path: string };
                correction: { text: string; path: string } | null;
            }[];
            categories: {
                title: string;
                numberOfMaterial: string;
                linksOfPdfs: {
                    text: string;
                    pathOfPdf: string;
                    year: string;
                    hasSolution: boolean;
                }[];
            }[];
        }[] = [];

        // Get tab titles from ul.tabs-nav
        const tabTitles: string[] = [];
        $(groupEl)
            .find("ul.tabs-nav li")
            .each((_, li) => {
                tabTitles.push($(li).text().trim());
            });

        // Get tab content from div.pane
        $(groupEl)
            .find("div.pane")
            .each((paneIndex, paneEl) => {
                const tabTitle = tabTitles[paneIndex] || `Tab ${paneIndex + 1}`;

                // Get the table title (red bold text above table)
                const tableTitle =
                    $(paneEl).find("strong span").first().text().trim() || "";

                // Parse table rows if they exist
                const tableRows: {
                    subject: string;
                    exam: { text: string; path: string };
                    correction: { text: string; path: string } | null;
                }[] = [];
                let hasTable = false;

                $(paneEl)
                    .find("table tbody tr")
                    .each((_, tr) => {
                        const tds = $(tr).find("td");
                        if (tds.length < 2) return;

                        hasTable = true;
                        const subject = $(tds[0]).text().trim();

                        const examLink = $(tds[1]).find("a").first();
                        const examHref = examLink.attr("href") || "";
                        const examPath =
                            examHref.split("/").filter(Boolean).pop() || "";
                        const examText =
                            examLink.text().trim() || $(tds[1]).text().trim();

                        let correction: { text: string; path: string } | null =
                            null;
                        if (tds.length >= 3) {
                            const corrLink = $(tds[2]).find("a").first();
                            const corrHref = corrLink.attr("href") || "";
                            const corrPath =
                                corrHref.split("/").filter(Boolean).pop() || "";
                            const corrText =
                                corrLink.text().trim() ||
                                $(tds[2]).text().trim();
                            if (corrPath) {
                                correction = { text: corrText, path: corrPath };
                            }
                        }

                        if (examPath) {
                            tableRows.push({
                                subject:
                                    subject ||
                                    tableRows[tableRows.length - 1]?.subject ||
                                    "",
                                exam: { text: examText, path: examPath },
                                correction,
                            });
                        }
                    });

                // Parse toggle categories (PDF lists) inside this pane
                const categories: {
                    title: string;
                    numberOfMaterial: string;
                    linksOfPdfs: {
                        text: string;
                        pathOfPdf: string;
                        year: string;
                        hasSolution: boolean;
                    }[];
                }[] = [];

                $(paneEl)
                    .find("div.toggle.tie-sc-close")
                    .each((_, toggleEl) => {
                        const semiList: {
                            text: string;
                            pathOfPdf: string;
                            year: string;
                            hasSolution: boolean;
                        }[] = [];

                        $(toggleEl)
                            .find("div.toggle-content > div")
                            .each((_, ele) => {
                                const href = $(ele)
                                    .find(
                                        "div.btn-group > a.btn.btn-outline-secondary",
                                    )
                                    .attr("href");
                                if (!href) return;

                                const path = href
                                    .split("/")
                                    .filter(Boolean)
                                    .pop();
                                const semiItem = {
                                    text: $(ele)
                                        .find(
                                            "div.btn-group > a.btn.btn-outline-secondary",
                                        )
                                        .text()
                                        .trim(),
                                    pathOfPdf: path || "",
                                    year: $(ele)
                                        .find(
                                            "div.btn-group > a.btn.btn-secondary",
                                        )
                                        .text()
                                        .trim(),
                                    hasSolution:
                                        $(ele).find(
                                            "div.btn-group > a.btn.btn-secondary span.fa.fa-times",
                                        ).length === 0,
                                };
                                semiList.push(semiItem);
                            });

                        const categoryTitle = $(toggleEl)
                            .find("h3 > a > button.b-eddirasa")
                            .text()
                            .trim();
                        const numberOfMaterial = $(toggleEl)
                            .find("h3 > a > button.c-eddirasa > span")
                            .text()
                            .trim();

                        if (categoryTitle || semiList.length > 0) {
                            categories.push({
                                title: categoryTitle,
                                numberOfMaterial:
                                    numberOfMaterial || String(semiList.length),
                                linksOfPdfs: semiList,
                            });
                        }
                    });

                tabs.push({
                    tabTitle,
                    tableTitle,
                    hasTable,
                    tableRows,
                    categories,
                });
            });

        if (tabs.length > 0) {
            tabGroups.push({ groupIndex, tabs });
        }
    });

    return { tabGroups };
}

export async function bacScraper(urlPath: string) {
    const url = `https://eddirasa.com/${urlPath}/`;
    const $ = await cheerio.fromURL(url);

    // Each "post-tabs" block is a group of tabs
    const tabGroups: {
        groupIndex: number;
        tabs: {
            tabTitle: string;
            tableTitle: string;
            rows: {
                subject: string;
                exam: { text: string; path: string };
                correction: { text: string; path: string } | null;
            }[];
        }[];
    }[] = [];

    // Find all post-tabs containers
    $("div.entry div.post-tabs").each((groupIndex, groupEl) => {
        const tabs: {
            tabTitle: string;
            tableTitle: string;
            rows: {
                subject: string;
                exam: { text: string; path: string };
                correction: { text: string; path: string } | null;
            }[];
        }[] = [];

        // Get tab titles from ul.tabs-nav
        const tabTitles: string[] = [];
        $(groupEl)
            .find("ul.tabs-nav li")
            .each((_, li) => {
                tabTitles.push($(li).text().trim());
            });

        // Get tab content from div.pane
        $(groupEl)
            .find("div.pane")
            .each((paneIndex, paneEl) => {
                const tabTitle = tabTitles[paneIndex] || `Tab ${paneIndex + 1}`;

                // Get the table title (red bold text above table)
                const tableTitle =
                    $(paneEl).find("strong span").first().text().trim() ||
                    tabTitle;

                const rows: {
                    subject: string;
                    exam: { text: string; path: string };
                    correction: { text: string; path: string } | null;
                }[] = [];

                // Tracks a subject cell that spans multiple <tr> rows
                // (e.g. rowspan="5" on "التكنولوجيا"). When active, the
                // following rows do NOT repeat the subject cell, so the
                // first <td> in those rows is actually the exam cell.
                let pendingSubject = "";
                let rowspanRemaining = 0;

                // Parse each table row
                $(paneEl)
                    .find("table tbody tr")
                    .each((_, tr) => {
                        const tds = $(tr).find("td");
                        if (tds.length === 0) return; // header row (th only)

                        let subject = "";
                        let cellIndex = 0;

                        const firstTd = $(tds[0]);
                        const rowspanAttr = firstTd.attr("rowspan");

                        if (rowspanAttr) {
                            // This row declares/owns a subject cell that spans
                            // multiple rows. Remember it for the rows below.
                            subject = firstTd.text().trim();
                            pendingSubject = subject;
                            rowspanRemaining =
                                (parseInt(rowspanAttr, 10) || 1) - 1;
                            cellIndex = 1;

                            if (tds.length <= 1) {
                                // Subject-only row (no exam/correction here),
                                // e.g. the first row of the التكنولوجيا group.
                                return;
                            }
                        } else if (rowspanRemaining > 0) {
                            // Inside an active rowspan group: the subject
                            // column is merged from above, so the first cell
                            // here is the exam cell, not the subject.
                            subject = pendingSubject;
                            rowspanRemaining--;
                            cellIndex = 0;
                        } else {
                            // Normal row: first cell is the subject.
                            subject = firstTd.text().trim();
                            cellIndex = 1;
                        }

                        // Exam link
                        const examTd = tds[cellIndex];
                        if (!examTd) return;
                        const examLink = $(examTd).find("a").first();
                        const examHref = examLink.attr("href") || "";
                        const examPath =
                            examHref.split("/").filter(Boolean).pop() || "";
                        const examText =
                            examLink.text().trim() || $(examTd).text().trim();

                        // Correction link (next cell, might not exist)
                        let correction: { text: string; path: string } | null =
                            null;
                        const corrTd = tds[cellIndex + 1];
                        if (corrTd) {
                            const corrLink = $(corrTd).find("a").first();
                            const corrHref = corrLink.attr("href") || "";
                            const corrPath =
                                corrHref.split("/").filter(Boolean).pop() || "";
                            const corrText =
                                corrLink.text().trim() ||
                                $(corrTd).text().trim();
                            if (corrPath) {
                                correction = { text: corrText, path: corrPath };
                            }
                        }

                        if (examPath) {
                            rows.push({
                                subject,
                                exam: { text: examText, path: examPath },
                                correction,
                            });
                        }
                    });

                tabs.push({ tabTitle, tableTitle, rows });
            });

        if (tabs.length > 0) {
            tabGroups.push({ groupIndex, tabs });
        }
    });

    return { tabGroups };
}



export async function bacSolutionsIndex() {
    const url = "https://eddirasa.com/ens-sec/3as/bac-solutions/";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // ── Tab 1: Years (حسب السنة) ─────────────────────────────────────
    const years: {
        year: string;
        title: string;
        slug: string; // Internal slug like "2026"
        isLegacy: boolean;
    }[] = [];

    $(".bac-year-card").each((_, el) => {
        const year = $(el).find(".bac-year-icon").text().trim();
        const href = $(el).attr("href") || "";
        
        // Extract year slug from path
        // e.g., "/ens-sec/3as/bac-solutions/bac-2026/" → "2026"
        // e.g., "/bac-2007/" → "2007"
        const pathParts = href.split("/").filter(Boolean);
        const yearSegment = pathParts.find(p => p.startsWith("bac-")) || "";
        const slug = yearSegment.replace("bac-", "") || year;

        years.push({
            year,
            title: $(el).find("strong").text().trim(),
            slug,
            isLegacy: $(el).hasClass("bac-legacy-year-card"),
        });
    });

    // ── Tab 2: Subjects (حسب المادة) ─────────────────────────────────
    const subjects: {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
        slug: string; // Internal slug like "mathematics"
    }[] = [];

    $(".bac-subject-hub-card").each((_, el) => {
        const style = $(el).find(".bac-subject-icon").attr("style") || "";
        const href = $(el).attr("href") || "";
        
        // Extract subject slug from path
        // e.g., "/ens-sec/3as/bac-solutions/subject/mathematics/" → "mathematics"
        const pathParts = href.split("/").filter(Boolean);
        const subjectIndex = pathParts.indexOf("subject");
        const slug = subjectIndex >= 0 ? pathParts[subjectIndex + 1] : "";

        subjects.push({
            title: $(el).find("strong").text().trim(),
            subtitle: $(el).find("small").text().trim(),
            icon: $(el).find("img").attr("src") || "",
            color:
                style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
                "#7C3AED",
            slug,
        });
    });

    // ── Tab 3: Streams (حسب الشعبة) ──────────────────────────────────
    const streams: { 
        title: string; 
        slug: string; // Internal slug like "sciences"
    }[] = [];

    $(".bac-stream-card").each((_, el) => {
        const href = $(el).attr("href") || "";
        
        // Extract stream slug from path
        // e.g., "/ens-sec/3as/bac-solutions/stream/sciences/" → "sciences"
        const pathParts = href.split("/").filter(Boolean);
        const streamIndex = pathParts.indexOf("stream");
        const slug = streamIndex >= 0 ? pathParts[streamIndex + 1] : "";

        streams.push({
            title: $(el).find("strong").text().trim(),
            slug,
        });
    });

    return { years, subjects, streams };
}

export async function bacYearScraper(year: string) {
    const url = `https://eddirasa.com/ens-sec/3as/bac-solutions/bac-${year}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title from breadcrumb
    const title = $(".ed-breadcrumb-title").text().trim();
    
    // Extract description from header
    const description = $(".bac-archive-head p").first().text().trim();

    // Extract streams
    const streams: {
        title: string;
        subtitle: string;
        path: string;
        slug: string;
    }[] = [];

    $(".bac-stream-card").each((_, el) => {
        const title = $(el).find("strong").text().trim();
        const subtitle = $(el).find("small").text().trim();
        const href = $(el).attr("href") || "";
        
        // Extract slug from path (e.g., "sciences" from "/ens-sec/3as/bac-solutions/bac-2026/sciences/")
        const pathParts = href.split("/").filter(Boolean);
        const slug = pathParts[pathParts.length - 1] || "";

        streams.push({
            title,
            subtitle,
            path: href,
            slug,
        });
    });

    return { title, description, year, streams };
}



export async function bacStreamScraper(year: string, stream: string) {
    const url = `https://eddirasa.com/ens-sec/3as/bac-solutions/bac-${year}/${stream}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $(".ed-breadcrumb-title").text().trim();
    const description = $(".bac-archive-head > p").first().text().trim();

    const subjects: {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
        topic: { path: string; text: string } | null;
        correction: { path: string; text: string } | null;
        detailedCorrection: { path: string; text: string } | null;
    }[] = [];

    $(".bac-smart-subject").each((_, el) => {
        const $el = $(el);
        const title = $el.find("summary .bac-smart-copy strong").text().trim();
        const subtitle = $el.find("summary .bac-smart-copy small").text().trim();

        const iconEl = $el.find("summary .bac-subject-icon");
        const icon = iconEl.find("img").attr("src") || "";
        const colorMatch = iconEl.attr("style")?.match(/--subject-color:\s*([^;"]+)/);
        const color = colorMatch?.[1]?.trim() || "#7C3AED";

        let topic = null;
        let correction = null;
        let detailedCorrection = null;

        $el.find(".bac-smart-action").each((__, action) => {
            const $action = $(action);
            const path = $action.attr("href") || "";
            const text = $action.find("strong").text().trim();

            if ($action.hasClass("is-detailed-correction")) {
                detailedCorrection = { path, text };
            } else if ($action.hasClass("is-correction")) {
                correction = { path, text };
            } else if ($action.hasClass("is-topic")) {
                topic = { path, text };
            }
        });

        if (title) {
            subjects.push({ title, subtitle, icon, color, topic, correction, detailedCorrection });
        }
    });

    return { title, description, year, stream, subjects };
}



export async function bacSubjectScraper(subject: string) {
    const url = `https://eddirasa.com/ens-sec/3as/bac-solutions/subject/${subject}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract header info
    const title = $(".bac-archive-head h2").text().trim();
    const description = $(".bac-archive-head p").first().text().trim();
    const summary = $(".bac-results-summary").text().trim();

    // Extract icon color and image (from first subject card)
    const firstIcon = $(".bac-smart-subject summary .bac-subject-icon").first();
    const colorMatch = firstIcon.attr("style")?.match(/--subject-color:\s*([^;"]+)/);
    const color = colorMatch?.[1]?.trim() || "#7C3AED";
    const icon = firstIcon.find("img").attr("src") || "";

    // Extract subjects grouped by year
    const years: {
        year: string;
        subjects: {
            title: string;
            subtitle: string;
            topic: { path: string; text: string } | null;
            correction: { path: string; text: string } | null;
            detailedCorrection: { path: string; text: string } | null;
        }[];
    }[] = [];

    $(".bac-subject-year").each((_, yearSection) => {
        const year = $(yearSection).find("h3").first().text().trim();

        const subjects: {
            title: string;
            subtitle: string;
            topic: { path: string; text: string } | null;
            correction: { path: string; text: string } | null;
            detailedCorrection: { path: string; text: string } | null;
        }[] = [];

        $(yearSection).find(".bac-smart-subject").each((__, item) => {
            const $item = $(item);
            const title = $item.find("summary strong").text().trim();
            const subtitle = $item.find("summary small").text().trim();

            let topic = null;
            let correction = null;
            let detailedCorrection = null;

            $item.find(".bac-smart-action").each((___, action) => {
                const $action = $(action);
                const path = $action.attr("href") || "";
                const text = $action.find("strong").text().trim();

                if ($action.hasClass("is-detailed-correction")) {
                    detailedCorrection = { path, text };
                } else if ($action.hasClass("is-correction")) {
                    correction = { path, text };
                } else if ($action.hasClass("is-topic")) {
                    topic = { path, text };
                }
            });

            if (title) {
                subjects.push({ title, subtitle, topic, correction, detailedCorrection });
            }
        });

        if (year && subjects.length > 0) {
            years.push({ year, subjects });
        }
    });

    return { title, description, summary, color, icon, years };
}


export async function bacStreamScraperbranch(branch: string) {
    const url = `https://eddirasa.com/ens-sec/3as/bac-solutions/stream/${branch}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $(".bac-archive-head h2").text().trim();
    const description = $(".bac-archive-head p").first().text().trim();

    const years: {
        year: string;
        title: string;
        path: string;
    }[] = [];

    $(".bac-stream-year-card").each((_, el) => {
        const year = $(el).find(".bac-stream-year-icon").text().trim();
        const title = $(el).find("strong").text().trim();
        const href = $(el).attr("href") || "";

        // Extract year slug from path
        const pathParts = href.split("/").filter(Boolean);
        const yearSlug = pathParts.find(p => p.startsWith("bac-")) || "";

        years.push({
            year,
            title,
            path: yearSlug,
        });
    });

    return { title, description, years, branch };
}


export async function bemSolutionsIndex() {
    const url = "https://eddirasa.com/ens-cm/4am/bem-solutions/";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // ── Tab 1: Years (حسب السنة) ─────────────────────────────────────
    const years: {
        year: string;
        title: string;
        slug: string; // e.g. "bem-2026" → يطابق route [bemyear]
    }[] = [];

    $(".bac-year-card").each((_, el) => {
        const href = $(el).attr("href") || "";
        const slug = href.split("/").filter(Boolean).pop() || "";

        years.push({
            year: $(el).find(".bac-year-icon").text().trim(),
            title: $(el).find("strong").text().trim(),
            slug,
        });
    });

    // ── Tab 2: Subjects (حسب المادة) ─────────────────────────────────
    const subjects: {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
        slug: string;
        path: string;
    }[] = [];

    $(".bac-subject-hub-card").each((_, el) => {
        const style = $(el).find(".bac-subject-icon").attr("style") || "";
        const href = $(el).attr("href") || "";
        const pathParts = href.split("/").filter(Boolean);
        const subjectIndex = pathParts.indexOf("subject");

        subjects.push({
            title: $(el).find("strong").text().trim(),
            subtitle: $(el).find("small").text().trim(),
            icon: $(el).find("img").attr("src") || "",
            color:
                style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
                "#7C3AED",
            slug: subjectIndex >= 0 ? pathParts[subjectIndex + 1] : "",
            path: href,
        });
    });

    return { years, subjects };
}



export async function bemYearSubjectsScraper(year: string) {
    const url = `https://eddirasa.com/ens-cm/4am/bem-solutions/bem-${year}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $(".bac-archive-head h2").text().trim();
    const description = $(".bac-archive-head p").first().text().trim();
    const sectionTitle = $(".bac-section-title span").first().text().trim();

    const subjects: {
        title: string;
        subtitle: string;
        icon: string;
        color: string;
        topic: { path: string; text: string } | null;
        correction: { path: string; text: string } | null;
        detailedCorrection: { path: string; text: string } | null;
    }[] = [];

    $(".bac-smart-subject").each((_, el) => {
        const $el = $(el);
        const subjectTitle = $el.find("summary .bac-smart-copy strong").text().trim();
        const subtitle = $el.find("summary .bac-smart-copy small").text().trim();
        const iconEl = $el.find("summary .bac-subject-icon");
        const icon = iconEl.find("img").attr("src") || "";
        const color =
            iconEl.attr("style")?.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
            "#7C3AED";

        let topic: { path: string; text: string } | null = null;
        let correction: { path: string; text: string } | null = null;
        let detailedCorrection: { path: string; text: string } | null = null;

        $el.find(".bac-smart-action").each((_, action) => {
            const $action = $(action);
            const path = $action.attr("href")?.split("/").filter(Boolean).pop() || "";
            const text = $action.find("strong").text().trim();

            if ($action.hasClass("is-detailed-correction")) {
                detailedCorrection = { path, text };
            } else if ($action.hasClass("is-correction")) {
                correction = { path, text };
            } else if ($action.hasClass("is-topic")) {
                topic = { path, text };
            }
        });

        if (subjectTitle) {
            subjects.push({ title: subjectTitle, subtitle, icon, color, topic, correction, detailedCorrection });
        }
    });

    return { title, description, sectionTitle, subjects };
}


export async function bemSubjectScraper(subject: string) {
    const url = `https://eddirasa.com/ens-cm/4am/bem-solutions/subject/${subject}/`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Title (h2) — clean
    const title = $(".bac-archive-head h2").text().trim();

    // Description (p) — remove google annotations
    const pClone = $(".bac-archive-head p").first().clone();
    pClone.find(".google-anno-skip, .google-anno, a").remove();
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

    $("section.bac-subject-year").each((_, section) => {
        const yearTitle = $(section).find("h3").first().text().trim();

        const subjects: {
            title: string;
            subtitle: string;
            icon: string;
            color: string;
            topic: { path: string; text: string } | null;
            correction: { path: string; text: string } | null;
        }[] = [];

        $(section).find(".bac-smart-subject").each((_, el) => {
            const $el = $(el);
            const subjectTitle = $el.find("summary .bac-smart-copy strong").text().trim();
            const subtitle = $el.find("summary .bac-smart-copy small").text().trim();
            const iconEl = $el.find("summary .bac-subject-icon");
            const icon = iconEl.find("img").attr("src") || "";
            const color =
                iconEl.attr("style")?.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() ||
                "#7C3AED";

            let topic: { path: string; text: string } | null = null;
            let correction: { path: string; text: string } | null = null;

            $el.find(".bac-smart-action").each((_, action) => {
                const $action = $(action);
                const path = $action.attr("href")?.split("/").filter(Boolean).pop() || "";
                const text = $action.find("strong").text().trim();

                if ($action.hasClass("is-correction")) {
                    correction = { path, text };
                } else if ($action.hasClass("is-topic")) {
                    topic = { path, text };
                }
            });

            if (subjectTitle) {
                subjects.push({ title: subjectTitle, subtitle, icon, color, topic, correction });
            }
        });

        if (yearTitle && subjects.length > 0) {
            years.push({ yearTitle, subjects });
        }
    });

    return { title, description, summary, years };
}




// ─── Generic archive scrapers (BEM / CINQ) ──────────────────────────────────

export async function archiveIndex(base: string) {
    const url = `https://eddirasa.com/${base}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const $ = cheerio.load(await response.text());

    const title = $(".ed-breadcrumb-title").text().trim();
    const pClone = $(".bac-archive-head > p").first().clone();
    pClone.find(".google-anno-skip, .google-anno").remove();
    const description = pClone.text().trim();

    const years = $(".bac-year-card").map((_, el) => ({
        year: $(el).find(".bac-year-icon").text().trim(),
        title: $(el).find("strong").text().trim(),
        slug: ($(el).attr("href") || "").split("/").filter(Boolean).pop() || "",
    })).get();

    const subjects = $(".bac-subject-hub-card").map((_, el) => {
        const style = $(el).find(".bac-subject-icon").attr("style") || "";
        return {
            title: $(el).find("strong").text().trim(),
            subtitle: $(el).find("small").text().trim(),
            icon: $(el).find("img").attr("src") || "",
            color: style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() || "#7C3AED",
            slug: ($(el).attr("href") || "").split("/").filter(Boolean).pop() || "",
        };
    }).get();

    return { title, description, years, subjects };
}

export async function archiveYear(base: string, yearSlug: string) {
    const url = `https://eddirasa.com/${base}/${yearSlug}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const $ = cheerio.load(await response.text());

    const title = $(".bac-archive-head h2").text().trim();
    const pClone = $(".bac-archive-head > p").first().clone();
    pClone.find(".google-anno-skip, .google-anno").remove();
    const description = pClone.text().trim();

    const subjects = $(".bac-smart-subject").map((_, el) => {
        const $el = $(el);
        const iconEl = $el.find("summary .bac-subject-icon");
        const style = iconEl.attr("style") || "";

        let topic: { path: string; text: string } | null = null;
        let correction: { path: string; text: string } | null = null;
        $el.find(".bac-smart-action").each((_, a) => {
            const $a = $(a);
            const path = ($a.attr("href") || "").split("/").filter(Boolean).pop() || "";
            const text = $a.find("strong").text().trim();
            if ($a.hasClass("is-correction")) correction = { path, text };
            else if ($a.hasClass("is-topic")) topic = { path, text };
        });

        return {
            title: $el.find("summary .bac-smart-copy strong").text().trim(),
            subtitle: $el.find("summary .bac-smart-copy small").text().trim(),
            icon: iconEl.find("img").attr("src") || "",
            color: style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() || "#7C3AED",
            topic,
            correction,
        };
    }).get();

    return { title, description, subjects };
}

export async function archiveSubject(base: string, subjectSlug: string) {
    const url = `https://eddirasa.com/${base}/subject/${subjectSlug}/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const $ = cheerio.load(await response.text());

    const title = $(".bac-archive-head h2").text().trim();
    const summary = $(".bac-results-summary").text().trim();

    const years = $("section.bac-subject-year").map((_, sec) => ({
        year: $(sec).find("h3").first().text().trim(),
        items: $(sec).find(".bac-smart-subject").map((_, el) => {
            const $el = $(el);
            const iconEl = $el.find("summary .bac-subject-icon");
            const style = iconEl.attr("style") || "";

            let topic: { path: string; text: string } | null = null;
            let correction: { path: string; text: string } | null = null;
            $el.find(".bac-smart-action").each((_, a) => {
                const $a = $(a);
                const path = ($a.attr("href") || "").split("/").filter(Boolean).pop() || "";
                const text = $a.find("strong").text().trim();
                if ($a.hasClass("is-correction")) correction = { path, text };
                else if ($a.hasClass("is-topic")) topic = { path, text };
            });

            return {
                title: $el.find("summary .bac-smart-copy strong").text().trim(),
                subtitle: $el.find("summary .bac-smart-copy small").text().trim(),
                icon: iconEl.find("img").attr("src") || "",
                color: style.match(/--subject-color:\s*([^;"]+)/)?.[1]?.trim() || "#7C3AED",
                topic,
                correction,
            };
        }).get(),
    })).get();

    return { title, summary, years };
}