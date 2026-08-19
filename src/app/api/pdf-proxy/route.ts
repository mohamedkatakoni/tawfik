// src/app/api/pdf-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTNAME = "eddirasa.com";

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

/* Base64URL decode */
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

export async function GET(req: NextRequest) {
  // ── support BOTH ?r= (new) and ?url= (old / legacy) ──
  const encoded = req.nextUrl.searchParams.get("r");
  const rawUrl = req.nextUrl.searchParams.get("url");

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

  // ── stream back with headers that ALLOW iframe display ──
  const headers = new Headers({
    "Content-Type":
      upstream.headers.get("content-type") ?? "application/pdf",
    "Content-Security-Policy": "frame-ancestors 'self'",
    "X-Frame-Options": "SAMEORIGIN",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    // CRITICAL: force inline display so the browser renders it instead of downloading
    "Content-Disposition": "inline",
  });

  return new NextResponse(upstream.body, { status: 200, headers });
}