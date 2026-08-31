// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// ─── Bot fingerprints ──────────────────────────────────────────────────────────

// Known scraper UA substrings (case-insensitive)
const BLOCKED_UA_PATTERNS = [
  // HTTP libraries — the most common scraper signatures
  "python-requests",
  "python-httpx",
  "python-urllib",
  "aiohttp",
  "httpx",
  "axios",          // axios default UA on Node
  "node-fetch",
  "got/",
  "superagent",
  "undici",
  // Cheerio doesn't set a UA itself but scrapers using it often send these
  "curl/",
  "wget/",
  "libcurl",
  "java/",
  "okhttp",
  "apache-httpclient",
  "go-http-client",
  "ruby",
  "perl",
  "php/",
  "guzzle",
  // Generic bots
  "scrapy",
  "playwright",
  "puppeteer",
  "selenium",
  "phantomjs",
  "headlesschrome",
  "cfnetwork",        // sometimes used by automated tools
];

// Headers that real browsers always send but scrapers usually skip
const REQUIRED_BROWSER_HEADERS = [
  "accept-language",  // always present in real browsers
  "accept",           // always present in real browsers
];

// ─── Detection logic ───────────────────────────────────────────────────────────

function isScraper(req: NextRequest): { blocked: boolean; reason: string } {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();

  // 1. Missing User-Agent — dead giveaway
  if (!ua || ua.length < 10) {
    return { blocked: true, reason: "missing-ua" };
  }

  // 2. Known scraper UA
  const matchedUA = BLOCKED_UA_PATTERNS.find((p) => ua.includes(p.toLowerCase()));
  if (matchedUA) {
    return { blocked: true, reason: `ua-match:${matchedUA}` };
  }

  // 3. Missing required browser headers
  for (const header of REQUIRED_BROWSER_HEADERS) {
    if (!req.headers.get(header)) {
      return { blocked: true, reason: `missing-header:${header}` };
    }
  }

  // 4. Axios/Node default Accept header — "application/json, text/plain, */*"
  const accept = req.headers.get("accept") || "";
  if (accept === "application/json, text/plain, */*") {
    return { blocked: true, reason: "axios-accept" };
  }

  // 5. Cheerio/scraper pattern: no sec-fetch-* headers but claims to be Chrome
  // Real Chrome always sends sec-fetch-dest + sec-fetch-mode on page navigations
  const secFetchDest = req.headers.get("sec-fetch-dest");
  const secFetchMode = req.headers.get("sec-fetch-mode");
  const isClaimingChrome = ua.includes("chrome") || ua.includes("firefox") || ua.includes("safari");
  if (isClaimingChrome && !secFetchDest && !secFetchMode) {
    return { blocked: true, reason: "fake-browser-ua" };
  }

  return { blocked: false, reason: "" };
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: API routes your own frontend calls, static assets, Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/pdf-proxy") || // your own proxy — already validated inside
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sw.js" ||
    pathname === "/ads.txt" ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|gif|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  const { blocked, reason } = isScraper(req);

  if (blocked) {
    // Log for your own debugging (visible in Vercel logs)
    console.warn(`[anti-scrape] blocked ${req.method} ${pathname} | reason: ${reason} | ua: ${req.headers.get("user-agent")?.slice(0, 80)}`);

    // Return 403 with a plain message — don't leak your detection logic
    return new NextResponse("Access denied", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        // Prevent caching of the block response
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files Next.js handles itself
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};