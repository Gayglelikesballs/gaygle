import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(3000),
      }
    );

    const data = await res.json();
    // data is [query, [suggestions]]
    const suggestions: string[] = (data[1] || []).slice(0, 6);
    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
