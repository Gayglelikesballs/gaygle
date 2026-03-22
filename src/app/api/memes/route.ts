import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ images: [] });
  }

  try {
    // Bing image search for memes
    const MAX_IMAGES = 60;

    // Run multiple image searches in parallel for more variety
    const queries = [
      `${query} meme funny`,
      `${query} meme`,
      `${query} funny reaction`,
      `${query} shitpost`,
      `${query} cursed image`,
      `${query} dank meme`,
    ];

    const fetchImages = async (q: string, count: number) => {
      const url = `https://www.bing.com/images/search?q=${encodeURIComponent(q)}&count=${count}&setlang=en&mkt=en-US&safeSearch=off`;
      const r = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      });
      const html = await r.text();
      const imgs: string[] = [];
      const murlMatches = html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&]*?)&quot;/g);
      for (const match of murlMatches) {
        const imgUrl = match[1].replace(/&amp;/g, "&");
        if (imgUrl && !imgUrl.includes("bing.com")) {
          imgs.push(imgUrl);
        }
      }
      if (imgs.length === 0) {
        const turlMatches = html.matchAll(/turl&quot;:&quot;(https?:\/\/[^&]*?)&quot;/g);
        for (const match of turlMatches) {
          imgs.push(match[1].replace(/&amp;/g, "&"));
        }
      }
      return imgs;
    };

    const results = await Promise.allSettled(
      queries.map((q) => fetchImages(q, 20))
    );

    // Deduplicate and collect
    const seen = new Set<string>();
    const images: string[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") {
        for (const img of r.value) {
          if (!seen.has(img) && images.length < MAX_IMAGES) {
            seen.add(img);
            images.push(img);
          }
        }
      }
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
