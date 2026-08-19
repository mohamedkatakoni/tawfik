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

/* ─── main scraper ─── */
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

  return {
    viewerUrl: iframeUrl,
    pdfFileUrl: (() => {
      try {
        return new URL(iframeUrl).searchParams.get("file");
      } catch {
        return null;
      }
    })(),
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
    const selector = "#the-post > div > div.entry > div.toggle.tie-sc-close";
    const url = `https://eddirasa.com/cinq-solutions`;
    const $ = await cheerio.fromURL(url);
    const list: {
        title: string;
        numberOfMaterial: string;
        linksOfPdfs: {
            text: string;
            pathOfPdf: string;
            year: string;
            hasSolution: boolean;
        }[];
    }[] = [];
    $(selector).each((i, el) => {
        const semiList: {
            text: string;
            pathOfPdf: string;
            year: string;
            hasSolution: boolean;
        }[] = [];
        $(el)
            .find("div.toggle-content > div ")
            .each((_, ele) => {
                const href = $(ele)
                    .find("div.btn-group > a.btn.btn-outline-secondary")
                    .attr("href")!;
                const path = href.split("/").filter(Boolean).pop();
                const semiItem = {
                    text: $(ele)
                        .find("div.btn-group > a.btn.btn-outline-secondary")
                        .text()
                        .trim()!,
                    pathOfPdf: path || "",
                    year: $(ele)
                        .find("div.btn-group > a.btn.btn-secondary")
                        .text()
                        .trim()!,
                    hasSolution:
                        $(ele).find(
                            "div.btn-group > a.btn.btn-secondary span.fa.fa-times",
                        ).length === 0,
                };
                semiList.push(semiItem);
                // btn btn-secondary active
            });
        const item = {
            title: $(el).find("h3 > a > button.b-eddirasa").text().trim(),
            numberOfMaterial: $(el)
                .find("h3 > a > button.c-eddirasa > span")
                .text()
                .trim(),
            linksOfPdfs: semiList,
        };
        list.push(item);
    });
    const titlePage = $("#the-post > div > h1").text().trim()!;
    const description = $("#the-post > div > div.entry > p:nth-child(1)")
        .text()
        .trim()!;
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
