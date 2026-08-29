// src/app/api/pdf-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

const ALLOWED_HOSTNAME = "eddirasa.com";
const SITE_NAME = "تawfikdz.online | توفيق";

function isAllowedUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === "https:" &&
      (hostname === ALLOWED_HOSTNAME || hostname.endsWith(`.${ALLOWED_HOSTNAME}`))
    );
  } catch {
    return false;
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeBase64Url(str: string): string {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/") + padding;
  return Buffer.from(base64, "base64").toString("utf-8");
}

async function fetchPdfWithRetry(pdfUrl: string, retries = 3): Promise<Response> {
  const headers: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/pdf,application/octet-stream,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://eddirasa.com/",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
  };

  for (let i = 0; i < retries; i++) {
    const res = await fetch(pdfUrl, { headers, redirect: "follow" });
    if (res.ok) return res;

    if (res.status === 503 && i < retries - 1) {
      const retryAfter = Number(res.headers.get("retry-after")) || 3;
      await sleep(retryAfter * 1000);
      continue;
    }
    return res;
  }
  throw new Error("Max retries exceeded");
}

function cleanFilename(title: string): string {
  return title
    .replace(/eddirasa\.com/gi, "")
    .replace(/https?:\/\//g, "")
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Inject Title, Author, Creator into PDF metadata so the browser
 * PDF viewer toolbar shows the real document name instead of "pdf-proxy".
 * Falls back to the original bytes if pdf-lib fails for any reason.
 */
async function injectPdfMetadata(
  bytes: Uint8Array,
  title: string
): Promise<Uint8Array> {
  try {
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    pdf.setTitle(title);
    pdf.setAuthor(SITE_NAME);
    pdf.setCreator(SITE_NAME);
    pdf.setProducer(SITE_NAME);
    // Keep existing Subject if any, otherwise set it
    if (!pdf.getSubject()) pdf.setSubject(title);
    return await pdf.save();
  } catch {
    // Encrypted or malformed PDF — return as-is, at least the filename is right
    return bytes;
  }
}

export async function GET(req: NextRequest) {
  const encoded = req.nextUrl.searchParams.get("r");
  const rawUrl = req.nextUrl.searchParams.get("url");
  const encodedTitle = req.nextUrl.searchParams.get("t");

  let pdfUrl: string;
  if (encoded) {
    try {
      pdfUrl = decodeBase64Url(encoded);
    } catch {
      return new NextResponse("Invalid `r` param", { status: 400 });
    }
  } else if (rawUrl) {
    pdfUrl = decodeURIComponent(rawUrl);
  } else {
    return new NextResponse("Missing `r` or `url` param", { status: 400 });
  }

  if (!isAllowedUrl(pdfUrl)) {
    return new NextResponse("URL not allowed", { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetchPdfWithRetry(pdfUrl);
  } catch (err) {
    console.error("[pdf-proxy] fetch error:", err);
    return new NextResponse("Failed to fetch PDF", { status: 502 });
  }

  if (!upstream.ok) {
    return new NextResponse(`Upstream returned ${upstream.status}`, {
      status: 502,
    });
  }

  // ── Decode the document title ─────────────────────────────────────────────
  let docTitle = "توفيق - tawfikdz.online";
  let filename = "tawfik.pdf";

  if (encodedTitle) {
    try {
      const raw = decodeBase64Url(encodedTitle);
      const clean = cleanFilename(raw);
      if (clean) {
        docTitle = `${clean} | tawfikdz.online`;
        filename = `توفيق - ${clean}.pdf`;
      }
    } catch {}
  }

  // ── Fetch all bytes then patch the PDF metadata ───────────────────────────
  const originalBytes = new Uint8Array(await upstream.arrayBuffer());
  const patchedBytes = await injectPdfMetadata(originalBytes, docTitle);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Security-Policy": "frame-ancestors 'self'",
    "X-Frame-Options": "SAMEORIGIN",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "Content-Length": String(patchedBytes.byteLength),
    // RFC 5987 UTF-8 filename — used for Save As dialog
    "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
  });

  return new NextResponse(Buffer.from(patchedBytes), { status: 200, headers });
}