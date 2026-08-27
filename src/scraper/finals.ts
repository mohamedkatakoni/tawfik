import * as cheerio from "cheerio";

export async function finalbac(stage:string) {
    const url = `https://eddirasa.com/${stage}/`;
    const $ = await cheerio.fromURL(url);

    const list: { numberOfPdfs: string; text: string; link: string }[] = [];
    $(`#sitePage > main > div > section.category-button-grid.category-layout-buttons.mb-4 > div.row.g-3 > div:nth-child(1) > a`).each((_ ,el)=>{
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


