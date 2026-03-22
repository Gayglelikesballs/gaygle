"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import GaygleLogo from "@/components/GaygleLogo";
import SearchBar from "@/components/SearchBar";
import { getSearchResults, hasCuratedResult, type SearchResponse } from "@/data/searchResults";

const FLOATING_EMOJIS = ["🌈", "🏳️‍🌈", "✨", "💅", "👑", "💜", "🦄", "💖", "⭐", "🌟", "💫", "🏳️‍⚧️", "💗", "🩷", "🩵", "💛", "❤️", "🧡", "💚", "💙", "❤️‍🔥", "🫶"];

function getMemeLink(query: string, index: number): string {
  const q = encodeURIComponent(query);
  const qMeme = encodeURIComponent(query + " meme");
  const sources = [
    `https://www.reddit.com/search/?q=${q}&sort=top`,
    `https://knowyourmeme.com/search?q=${q}`,
    `https://www.youtube.com/results?search_query=${qMeme}`,
    `https://www.google.com/search?q=${qMeme}&tbm=isch`,
    `https://twitter.com/search?q=${q}&src=typed_query`,
    `https://www.tiktok.com/search?q=${qMeme}`,
    `https://imgur.com/search?q=${q}`,
    `https://www.reddit.com/r/CryptoMemes/search/?q=${q}`,
    `https://www.reddit.com/r/wallstreetbets/search/?q=${q}`,
    `https://www.google.com/search?q=${encodeURIComponent(query + " funny")}`,
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " explained")}`,
    `https://en.wikipedia.org/wiki/Special:Search?search=${q}`,
    `https://www.reddit.com/r/memes/search/?q=${q}`,
    `https://giphy.com/search/${q.replace(/%20/g, '-')}`,
    `https://tenor.com/search/${q.replace(/%20/g, '-')}-gifs`,
    `https://www.instagram.com/explore/tags/${q.replace(/%20/g, '')}`,
  ];
  return sources[index % sources.length];
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [memeImages, setMemeImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number; emoji: string}[]>([]);

  // Floating particles
  useEffect(() => {
    const pts: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      pts.push({
        id: i,
        emoji: FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)],
        x: Math.random() * 100,
        size: 14 + Math.random() * 28,
        duration: 6 + Math.random() * 14,
        delay: Math.random() * -20,
      });
    }
    setParticles(pts);
  }, []);

  // Sparkle cursor
  const sparkleEmojis = ["✨", "🌈", "💖", "💅", "🦄", "💜", "🏳️‍🌈"];
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (Math.random() > 0.5) return;
    const id = Date.now() + Math.random();
    const emoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    setSparkles(prev => [...prev.slice(-20), { id, x: e.clientX, y: e.clientY, emoji }]);
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    setMemeImages([]);

    fetch(`/api/memes?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => setMemeImages((data.images || []).slice(0, 60)))
      .catch(() => {});

    if (hasCuratedResult(query)) {
      const delay = 300 + Math.random() * 700;
      setTimeout(() => { setResults(getSearchResults(query)); setLoading(false); }, delay);
    } else {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: SearchResponse) => { setResults(data); setLoading(false); })
        .catch(() => { setResults(getSearchResults(query)); setLoading(false); })
        .finally(() => clearTimeout(timeout));
    }
  }, [query]);

  return (
    <div onMouseMove={handleMouseMove} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* ===== RAINBOW BACKGROUND LAYERS ===== */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(45deg, #ff000018, #ff770018, #ffff0015, #00ff0018, #0000ff18, #8b00ff18, #ff008018, #ff000018)",
        backgroundSize: "400% 400%",
        animation: "rainbowBG 8s ease infinite",
      }} />
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(135deg, #8b00ff12, #ff008012, #ff000012, #ff770012, #ffff0012, #00ff0012, #0000ff12, #8b00ff12)",
        backgroundSize: "300% 300%",
        animation: "rainbowBG 10s ease infinite reverse",
      }} />

      {/* Spinning conic rainbow */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
          background: `conic-gradient(from 0deg at 50% 50%,
            rgba(255,0,0,0.06), rgba(255,119,0,0.06), rgba(255,255,0,0.05),
            rgba(0,255,0,0.06), rgba(0,0,255,0.06), rgba(139,0,255,0.06),
            rgba(255,0,128,0.06), rgba(255,0,0,0.06))`,
          animation: "spinSlow 15s linear infinite",
        }} />
      </div>

      {/* Rainbow diagonal stripes */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(45deg,
          #ff0000 0px, #ff0000 2px, #ff7700 2px, #ff7700 4px,
          #ffff00 4px, #ffff00 6px, #00ff00 6px, #00ff00 8px,
          #0000ff 8px, #0000ff 10px, #8b00ff 10px, #8b00ff 12px,
          transparent 12px, transparent 24px)`,
        backgroundSize: "34px 34px",
        animation: "stripeScroll 4s linear infinite",
      }} />

      {/* Floating emoji particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {particles.map((p) => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, fontSize: `${p.size}px`, opacity: 0.2,
            animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: "saturate(1.5)",
          }}>{p.emoji}</div>
        ))}
      </div>

      {/* Sparkle cursor */}
      {sparkles.map((s) => (
        <div key={s.id} style={{
          position: "fixed", left: s.x - 10, top: s.y - 10, fontSize: "20px",
          pointerEvents: "none", zIndex: 9999, animation: "sparkle 1s ease-out forwards",
        }}>{s.emoji}</div>
      ))}

      {/* Rainbow bar top */}
      <div style={{
        height: "6px", position: "relative", zIndex: 10,
        background: "linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080, #ff0000)",
        backgroundSize: "200% 100%", animation: "rainbowSlide 1.5s linear infinite",
        boxShadow: "0 0 15px rgba(255,0,128,0.4), 0 0 30px rgba(139,0,255,0.2)",
      }} />

      {/* Header bar */}
      <header style={{
        padding: "16px 24px",
        borderBottom: "2px solid", borderImage: "linear-gradient(90deg, #ff000040, #ff770040, #ffff0040, #00ff0040, #0000ff40, #8b00ff40) 1",
        display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap",
        background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <GaygleLogo size="small" />
        </a>
        <div style={{ flex: 1, minWidth: "200px", maxWidth: "640px" }}>
          <SearchBar initialQuery={query} compact />
        </div>
      </header>

      {/* SafeSearch banner — rainbow */}
      <div style={{
        padding: "8px 24px",
        borderBottom: "1px solid rgba(139,0,255,0.2)",
        fontSize: "12px", fontFamily: "'Space Mono', monospace",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(15,15,15,0.8)", backdropFilter: "blur(10px)",
        flexWrap: "wrap", gap: "8px", position: "relative", zIndex: 10,
      }}>
        <span>
          🏳️‍🌈 SafeSearch: <span style={{ color: "#ea4335" }}>permanently off</span>
          {" · "}
          <span className="rainbow-text-inline">Powered by PrideProtocol™</span>
          {" · CrawlCore™ active"}
        </span>
        <span style={{ opacity: 0.5 }}>
          {loading ? "crawling..." : `About ${results?.resultCount || "?"} results (${results?.time || "?"}s)`}
        </span>
      </div>

      {/* Results area */}
      <main style={{ flex: 1, padding: "20px 24px", maxWidth: "100%", width: "100%", position: "relative", zIndex: 2 }}>
        {loading ? (
          <LoadingState />
        ) : results ? (
          <div className="fade-in">
            {/* Did you mean */}
            {results.didYouMean && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  Did you mean:{" "}
                  <a href={`/search?q=${encodeURIComponent(results.didYouMean)}`}
                    style={{ color: "#ea4335", fontStyle: "italic", textDecoration: "underline" }}>
                    {results.didYouMean}
                  </a>
                </p>
              </div>
            )}

            {/* Sponsored result */}
            {results.sponsored && (
              <div style={{
                marginBottom: "28px", padding: "16px",
                background: "rgba(20,20,20,0.7)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(139,0,255,0.2)", borderRadius: "8px", position: "relative",
              }}>
                <span style={{
                  position: "absolute", top: "8px", right: "12px", fontSize: "10px",
                  color: "var(--text-muted)", fontFamily: "'Space Mono', monospace",
                  padding: "2px 8px", borderRadius: "4px",
                  background: "linear-gradient(90deg, #ff000030, #8b00ff30)",
                  border: "1px solid rgba(139,0,255,0.3)",
                }}>
                  💅 Sponsored by CRAWLER-ADS
                </span>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>
                  {(results.sponsored.realUrl || getMemeLink(query, 99)).replace(/^https?:\/\//, '').split('?')[0]}
                </p>
                <a href={results.sponsored.realUrl || getMemeLink(query, 99)} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "18px", color: "#8ab4f8", cursor: "pointer", textDecoration: "none", display: "block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>
                  <h3 style={{ fontSize: "inherit", color: "inherit", margin: 0 }}>{results.sponsored.title}</h3>
                </a>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{results.sponsored.snippet}</p>
              </div>
            )}

            {/* Meme Images Grid */}
            {memeImages.length > 0 && (
              <div style={{
                marginBottom: "28px", padding: "16px",
                background: "rgba(20,20,20,0.7)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(139,0,255,0.15)", borderRadius: "8px", overflow: "visible",
              }}>
                <h4 style={{ fontSize: "13px", marginBottom: "12px", fontFamily: "'Space Mono', monospace" }}
                  className="rainbow-text-inline">
                  🖼️ CRAWLER-MEME results · {memeImages.length} images indexed · SafeSearch: permanently off 🏳️‍🌈
                </h4>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "6px", width: "100%", overflow: "visible",
                }}>
                  {memeImages.slice(0, 30).map((img, i) => (
                    <div key={i} className="meme-thumb" style={{
                      borderRadius: "6px", border: "1px solid rgba(139,0,255,0.15)", aspectRatio: "1",
                      background: "var(--bg-tertiary)", animation: `fadeIn 0.3s ease ${Math.min(i * 0.05, 1)}s both`, cursor: "pointer",
                    }}>
                      <img src={img} alt={`meme ${i + 1}`} style={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "6px", pointerEvents: "none",
                      }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px", fontFamily: "'Space Mono', monospace", opacity: 0.5 }}>
                  These memes have been permanently archived in The Index. Hover to inspect evidence. 💅
                </p>
              </div>
            )}

            {/* Main results with inline image strips */}
            {results.results.map((result, i) => {
              const href = result.realUrl ? result.realUrl : getMemeLink(query, i);
              const imageStripLabels = [
                "🖼️ CRAWLER-MEME inline scan · no filter 🏳️‍🌈",
                "📸 More images from The Index · SafeSearch: LOL 💅",
                "🎨 CRAWLER-VISUAL deep results · unmoderated ✨",
                "🔍 Related memes · sorted by chaos level 🌈",
              ];
              const showImageStrip = memeImages.length > 30 && (i + 1) % 6 === 0;
              const stripIndex = Math.floor((i + 1) / 6) - 1;
              const stripStart = 30 + stripIndex * 5;
              const stripImages = memeImages.slice(stripStart, stripStart + 5);

              return (
                <div key={i}>
                  <div style={{ marginBottom: "28px", animation: `fadeIn 0.4s ease ${Math.min(i * 0.05, 2)}s both` }}>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>
                      {href.replace(/^https?:\/\//, '').split('?')[0]}
                    </p>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="result-link"
                      style={{ fontSize: "18px", color: "#8ab4f8", cursor: "pointer", lineHeight: 1.3, textDecoration: "none", display: "block" }}
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>
                      <h3 style={{ fontSize: "inherit", color: "inherit", lineHeight: "inherit", margin: 0 }}>{result.title}</h3>
                    </a>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{result.snippet}</p>
                  </div>

                  {showImageStrip && stripImages.length > 0 && (
                    <div style={{
                      marginBottom: "28px", padding: "12px",
                      background: "rgba(20,20,20,0.7)", backdropFilter: "blur(10px)",
                      border: "1px solid rgba(139,0,255,0.15)", borderRadius: "8px",
                    }}>
                      <p className="rainbow-text-inline" style={{ fontSize: "11px", marginBottom: "8px", fontFamily: "'Space Mono', monospace" }}>
                        {imageStripLabels[stripIndex % imageStripLabels.length]}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${stripImages.length}, 1fr)`, gap: "6px" }}>
                        {stripImages.map((img, j) => (
                          <div key={j} className="meme-thumb" style={{
                            borderRadius: "6px", border: "1px solid rgba(139,0,255,0.15)", aspectRatio: "16/10",
                            background: "var(--bg-tertiary)", cursor: "pointer",
                          }}>
                            <img src={img} alt={`inline meme ${stripIndex}-${j}`} style={{
                              width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "6px", pointerEvents: "none",
                            }} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* People also search for */}
            {results.peopleAlsoSearch && results.peopleAlsoSearch.length > 0 && (
              <div style={{
                marginTop: "32px", padding: "20px",
                background: "rgba(20,20,20,0.7)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(139,0,255,0.15)", borderRadius: "8px",
              }}>
                <h4 className="rainbow-text-inline" style={{ fontSize: "14px", marginBottom: "12px", fontFamily: "'Space Mono', monospace" }}>
                  🏳️‍🌈 People also gaygled:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {results.peopleAlsoSearch.map((term, i) => (
                    <a key={i} href={`/search?q=${encodeURIComponent(term)}`}
                      className="also-search-pill"
                      style={{
                        display: "inline-block", padding: "8px 16px",
                        background: "rgba(30,30,30,0.8)", border: "1px solid rgba(139,0,255,0.2)",
                        borderRadius: "20px", fontSize: "13px", color: "#8ab4f8", textDecoration: "none",
                        transition: "all 0.3s", backdropFilter: "blur(10px)",
                      }}>
                      {term}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom roast */}
            <div style={{
              marginTop: "40px", padding: "16px", textAlign: "center", fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              borderTop: "2px solid", borderImage: "linear-gradient(90deg, #ff000040, #ff770040, #ffff0040, #00ff0040, #0000ff40, #8b00ff40) 1",
            }}>
              <p className="rainbow-text-inline">
                Gaygle indexed this query in {results.time}s. Google would have censored half these results. 💅
              </p>
              <p style={{ marginTop: "8px", opacity: 0.5, color: "var(--text-muted)" }}>
                Your search has been permanently archived in The Index. There is no undo. 🏳️‍🌈
              </p>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer style={{
        padding: "12px 24px", textAlign: "center", fontSize: "11px", color: "var(--text-muted)",
        fontFamily: "'Space Mono', monospace", position: "relative", zIndex: 2,
        borderTop: "2px solid", borderImage: "linear-gradient(90deg, #8b00ff40, #0000ff40, #00ff0040, #ffff0040, #ff770040, #ff000040) 1",
      }}>
        © 2025 GaygleNET™ — too gay to fail — just gaygle it. 🏳️‍🌈💅
      </footer>

      {/* Rainbow bar bottom */}
      <div style={{
        height: "6px", position: "relative", zIndex: 10,
        background: "linear-gradient(90deg, #8b00ff, #0000ff, #00ff00, #ffff00, #ff7700, #ff0000, #ff0080, #8b00ff)",
        backgroundSize: "200% 100%", animation: "rainbowSlide 1.5s linear infinite reverse",
        boxShadow: "0 0 15px rgba(0,255,0,0.3), 0 0 30px rgba(255,255,0,0.2)",
      }} />

      <style jsx>{`
        @keyframes rainbowSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes rainbowBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes sparkle {
          0% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.3) rotate(90deg); }
          100% { opacity: 0; transform: scale(0.2) rotate(180deg) translateY(-30px); }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes stripeScroll {
          0% { background-position: 0 0; }
          100% { background-position: 34px 34px; }
        }
        .rainbow-text-inline {
          background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #00ddff, #0000ff, #8b00ff, #ff0080, #ff0000);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbowSlide 2s linear infinite;
        }
        .also-search-pill:hover {
          background: linear-gradient(135deg, rgba(255,0,0,0.15), rgba(255,119,0,0.15), rgba(255,255,0,0.1), rgba(0,255,0,0.15), rgba(0,0,255,0.15), rgba(139,0,255,0.15)) !important;
          border-color: rgba(139,0,255,0.4) !important;
          color: #fff !important;
          box-shadow: 0 0 15px rgba(139,0,255,0.2);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}

function LoadingState() {
  const messages = [
    "Deploying crawlers... 🌈",
    "CRAWLER-DEEP is searching the dark web... 💅",
    "CRAWLER-RANK is judging your query... 👑",
    "PrideProtocol™ processing... 🏳️‍🌈",
    "Bypassing SafeSearch (it was never on)... ✨",
    "Indexing your disappointment... 💜",
    "CRAWLER-SNIP extracting the worst results... 🦄",
  ];
  const [msg, setMsg] = useState(messages[0]);
  useEffect(() => {
    const interval = setInterval(() => { setMsg(messages[Math.floor(Math.random() * messages.length)]); }, 400);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "40px 0", textAlign: "center" }}>
      <div style={{
        width: "40px", height: "40px",
        border: "3px solid transparent",
        borderTop: "3px solid #ff0000", borderRight: "3px solid #ffff00",
        borderBottom: "3px solid #00ff00", borderLeft: "3px solid #8b00ff",
        borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
      }} />
      <p className="rainbow-text-inline" style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>{msg}</p>
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="rainbow-text-inline" style={{ fontFamily: "'Space Mono', monospace" }}>initializing GaygleNET™... 🏳️‍🌈</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
