"use client";

import { useState, useEffect, useCallback } from "react";
import GaygleLogo from "@/components/GaygleLogo";
import SearchBar from "@/components/SearchBar";

const FOOTER_MESSAGES = [
  "SafeSearch: permanently off 💅",
  "Powered by PrideProtocol™ 🏳️‍🌈",
  "I've indexed your search history 👀",
  "Crawler #69420 is watching 🌈",
  "GaygleNET™ — the gayest search engine alive",
  "0 results found for your heterosexuality",
  "Google could never look this good 💅",
  "slaying the search game since 2025 👑",
  "serving results and serving looks 💁‍♀️",
  "every search is a pride parade 🏳️‍🌈",
  "too gay to fail 💜",
  "the closet is empty. we're all out here. 🌈",
  "this website is gayer than your uncle's roommate 💅",
];

const SUBHEADINGS = [
  "the world's gayest search engine ✨",
  "Google but she came out 🏳️‍🌈",
  "Google but she ate and left no crumbs 👑",
  "no straight answers. ever. 🏳️‍🌈",
  "she indexes, she ranks, she slays 💜",
  "if Google went to pride 🌈",
  "born this way, deployed on Solana 💅",
  "the search engine your parents warned you about ✨",
  "making the internet fruity one search at a time 🦄",
  "heterosexuality not found (404) 🏳️‍🌈",
  "this is what peak performance looks like 💅👑",
];

const TRENDING = [
  "how to mass a coin",
  "why is my portfolio down",
  "best memecoin to buy",
  "what is gaygle",
  "solana price prediction",
  "is crypto a scam",
  "wen moon",
  "how to mass a rugpull",
];

const FLOATING_EMOJIS = ["🌈", "🏳️‍🌈", "✨", "💅", "👑", "💜", "🦄", "💖", "⭐", "🌟", "💫", "🏳️‍⚧️", "💗", "🩷", "🩵", "💛", "❤️", "🧡", "💚", "💙", "💜", "❤️‍🔥", "🫶", "🌈", "🌈", "🏳️‍🌈", "🏳️‍🌈"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

export default function Home() {
  const [footerMsg, setFooterMsg] = useState(FOOTER_MESSAGES[0]);
  const [subheading, setSubheading] = useState(SUBHEADINGS[0]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number; emoji: string}[]>([]);

  useEffect(() => {
    const pts: Particle[] = [];
    for (let i = 0; i < 80; i++) {
      pts.push({
        id: i,
        emoji: FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)],
        x: Math.random() * 100,
        size: 16 + Math.random() * 36,
        duration: 5 + Math.random() * 12,
        delay: Math.random() * -20,
        drift: -60 + Math.random() * 120,
      });
    }
    setParticles(pts);
  }, []);

  useEffect(() => {
    const i1 = setInterval(() => {
      setFooterMsg(FOOTER_MESSAGES[Math.floor(Math.random() * FOOTER_MESSAGES.length)]);
    }, 4000);
    const i2 = setInterval(() => {
      setSubheading(SUBHEADINGS[Math.floor(Math.random() * SUBHEADINGS.length)]);
    }, 5000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);

  const sparkleEmojis = ["✨", "🌈", "💖", "⭐", "💅", "🦄", "💜", "🏳️‍🌈", "👑", "❤️‍🔥"];
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (Math.random() > 0.4) return;
    const id = Date.now() + Math.random();
    const emoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    setSparkles(prev => [...prev.slice(-30), { id, x: e.clientX, y: e.clientY, emoji }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 1200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 7) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setClickCount(0);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ===== LAYER 0: FULL RAINBOW BACKGROUND ===== */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(45deg, #ff000030, #ff770030, #ffff0025, #00ff0030, #0000ff30, #8b00ff30, #ff008030, #ff000030)",
          backgroundSize: "400% 400%",
          animation: "rainbowBG 6s ease infinite",
        }}
      />

      {/* LAYER 0.5: Second rainbow layer going opposite direction */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(135deg, #8b00ff20, #ff008020, #ff000020, #ff770020, #ffff0020, #00ff0020, #0000ff20, #8b00ff20)",
          backgroundSize: "300% 300%",
          animation: "rainbowBG 8s ease infinite reverse",
        }}
      />

      {/* LAYER 1: Spinning conic rainbow — BRIGHT */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `conic-gradient(from 0deg at 50% 50%,
            rgba(255,0,0,0.12),
            rgba(255,119,0,0.12),
            rgba(255,255,0,0.10),
            rgba(0,255,0,0.12),
            rgba(0,0,255,0.12),
            rgba(139,0,255,0.12),
            rgba(255,0,128,0.12),
            rgba(255,0,0,0.12)
          )`,
          animation: "spinSlow 12s linear infinite",
        }} />
      </div>

      {/* LAYER 2: SECOND spinning rainbow going opposite */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          top: "-30%",
          left: "-30%",
          width: "160%",
          height: "160%",
          background: `conic-gradient(from 180deg at 50% 50%,
            rgba(255,0,128,0.08),
            rgba(139,0,255,0.08),
            rgba(0,0,255,0.08),
            rgba(0,255,0,0.08),
            rgba(255,255,0,0.08),
            rgba(255,119,0,0.08),
            rgba(255,0,0,0.08),
            rgba(255,0,128,0.08)
          )`,
          animation: "spinSlow 15s linear infinite reverse",
        }} />
      </div>

      {/* LAYER 3: Rainbow diagonal stripes — MORE VISIBLE */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.08,
        backgroundImage: `repeating-linear-gradient(
          45deg,
          #ff0000 0px, #ff0000 3px,
          #ff7700 3px, #ff7700 6px,
          #ffff00 6px, #ffff00 9px,
          #00ff00 9px, #00ff00 12px,
          #0000ff 12px, #0000ff 15px,
          #8b00ff 15px, #8b00ff 18px,
          transparent 18px, transparent 30px
        )`,
        backgroundSize: "42px 42px",
        animation: "stripeScroll 3s linear infinite",
      }} />

      {/* LAYER 4: Horizontal rainbow bands */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `
          linear-gradient(180deg,
            rgba(255,0,0,0.06) 0%,
            rgba(255,119,0,0.06) 14%,
            rgba(255,255,0,0.05) 28%,
            rgba(0,255,0,0.06) 42%,
            rgba(0,0,255,0.06) 57%,
            rgba(139,0,255,0.06) 71%,
            rgba(255,0,128,0.06) 85%,
            rgba(255,0,0,0.06) 100%
          )
        `,
        animation: "verticalShift 10s ease infinite",
      }} />

      {/* THICK rainbow pride bar at top */}
      <div
        style={{
          height: "8px",
          background: "linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080, #ff0000)",
          backgroundSize: "200% 100%",
          animation: "rainbowSlide 1s linear infinite",
          position: "relative",
          zIndex: 3,
          boxShadow: "0 0 20px rgba(255,0,128,0.5), 0 0 40px rgba(139,0,255,0.3)",
        }}
      />

      {/* 80 floating emoji particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              fontSize: `${p.size}px`,
              opacity: 0.35,
              animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
              filter: "saturate(2) brightness(1.2)",
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Sparkle cursor trail */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          style={{
            position: "fixed",
            left: s.x - 12,
            top: s.y - 12,
            fontSize: "24px",
            pointerEvents: "none",
            zIndex: 9999,
            animation: "sparkle 1.2s ease-out forwards",
            filter: "saturate(2)",
          }}
        >
          {s.emoji}
        </div>
      ))}

      {/* Top bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "12px 24px",
          gap: "16px",
          fontSize: "13px",
          position: "relative",
          zIndex: 3,
        }}
      >
        <a href="/the-index" style={{ color: "var(--text-secondary)" }}>The Index 👁️</a>
        <a href="/about" style={{ color: "var(--text-secondary)" }}>About</a>
        <a href="https://x.com/GaygleLikeBalls" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)" }}>𝕏</a>
        <a
          href="#token"
          style={{
            color: "#fff",
            background: "linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080, #ff0000)",
            backgroundSize: "300% 100%",
            animation: "rainbowSlide 2s linear infinite",
            padding: "8px 18px",
            borderRadius: "20px",
            fontWeight: 700,
            fontSize: "12px",
            textDecoration: "none",
            boxShadow: "0 0 15px rgba(255,0,0,0.3), 0 0 30px rgba(139,0,255,0.3), 0 0 45px rgba(0,0,255,0.2)",
            textShadow: "0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          🏳️‍🌈 Buy $GAYGLE 🌈
        </a>
      </nav>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          marginTop: "-60px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* MASSIVE rainbow glow orb */}
        <div
          style={{
            position: "absolute",
            width: "900px",
            height: "900px",
            borderRadius: "50%",
            background: `radial-gradient(circle,
              rgba(255,0,128,0.15) 0%,
              rgba(139,0,255,0.12) 15%,
              rgba(0,0,255,0.10) 30%,
              rgba(0,255,0,0.10) 45%,
              rgba(255,255,0,0.10) 60%,
              rgba(255,119,0,0.10) 70%,
              rgba(255,0,0,0.08) 80%,
              transparent 95%
            )`,
            animation: "pulseGlow 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Spinning rainbow ring */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            border: "3px solid transparent",
            backgroundImage: `conic-gradient(from 0deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080, #ff0000)`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "spinSlow 6s linear infinite",
            pointerEvents: "none",
            opacity: 0.3,
          }}
        />

        {/* Second spinning ring opposite direction */}
        <div
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            border: "2px solid transparent",
            backgroundImage: `conic-gradient(from 90deg, #ff0080, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080)`,
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "spinSlow 8s linear infinite reverse",
            pointerEvents: "none",
            opacity: 0.25,
          }}
        />

        <div onClick={handleLogoClick} style={{ marginBottom: "12px", position: "relative" }}>
          <GaygleLogo size="large" />
        </div>

        {/* Rainbow gradient subheading */}
        <p
          className="rainbow-sub"
          style={{
            fontSize: "15px",
            fontFamily: "'Space Mono', monospace",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          {subheading}
        </p>

        <SearchBar autoFocus />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={`/search?q=${encodeURIComponent(TRENDING[Math.floor(Math.random() * TRENDING.length)])}`}
            style={{
              padding: "8px 20px",
              background: "rgba(20,20,20,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              textDecoration: "none",
              backdropFilter: "blur(10px)",
            }}
          >
            Gaygle Search
          </a>
          <a
            href={`/search?q=${encodeURIComponent("tell me a secret")}`}
            className="fruity-btn"
            style={{
              padding: "9px 22px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              textDecoration: "none",
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              position: "relative",
            }}
          >
            I&apos;m Feeling Fruity 🌈🏳️‍🌈
          </a>
        </div>

        {/* Trending */}
        <div style={{ marginTop: "40px", textAlign: "center", maxWidth: "600px" }}>
          <p
            style={{
              fontSize: "13px",
              marginBottom: "12px",
              fontFamily: "'Space Mono', monospace",
            }}
            className="rainbow-sub"
          >
            🏳️‍🌈 trending in the index 🏳️‍🌈
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {TRENDING.map((term, i) => (
              <a
                key={i}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="trending-pill"
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  background: "rgba(20,20,20,0.6)",
                  borderRadius: "20px",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {["🌈", "🔥", "💀", "👀", "🚀", "📉", "🌙", "💅"][i % 8]} {term}
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Token section */}
      <section
        id="token"
        style={{
          padding: "40px 20px",
          textAlign: "center",
          borderTop: "2px solid",
          borderImage: "linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff) 1",
          position: "relative",
          zIndex: 2,
        }}
      >
        <p className="rainbow-sub" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px",
          marginBottom: "12px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}>
          🏳️‍🌈✨ $GAYGLE on Solana ✨🏳️‍🌈
        </p>
        <div
          style={{
            display: "inline-block",
            background: "rgba(10,10,10,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "12px 24px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            wordBreak: "break-all",
            maxWidth: "90vw",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => { navigator.clipboard?.writeText("7kPuzXvszyk47b6oQRzfw2b1X9VRgqSZArG8fo6ppump"); }}
        >
          CA: <span style={{ color: "var(--text-primary)" }}>7kPuzXvszyk47b6oQRzfw2b1X9VRgqSZArG8fo6ppump</span> 📋
        </div>

      </section>

      {/* Footer */}
      <footer style={{
        padding: "16px 24px", textAlign: "center", fontSize: "11px", color: "var(--text-muted)",
        fontFamily: "'Space Mono', monospace",
        borderTop: "2px solid",
        borderImage: "linear-gradient(90deg, #8b00ff, #0000ff, #00ff00, #ffff00, #ff7700, #ff0000) 1",
        position: "relative", zIndex: 2,
      }}>
        <p style={{ opacity: 0.7 }}>{footerMsg}</p>
        <p style={{ marginTop: "8px", opacity: 0.4 }}>
          © 2025 GaygleNET™ — Crawler #69420 — Too gay to fail — Not affiliated with Google (they wish) 🏳️‍🌈
        </p>
      </footer>

      {/* THICK rainbow bar bottom with glow */}
      <div style={{
        height: "8px",
        background: "linear-gradient(90deg, #8b00ff, #0000ff, #00ff00, #ffff00, #ff7700, #ff0000, #ff0080, #8b00ff)",
        backgroundSize: "200% 100%",
        animation: "rainbowSlide 1s linear infinite reverse",
        position: "relative", zIndex: 3,
        boxShadow: "0 0 20px rgba(0,255,0,0.4), 0 0 40px rgba(255,255,0,0.3), 0 0 60px rgba(255,0,0,0.2)",
      }} />

      {/* Easter egg */}
      {showEasterEgg && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: "linear-gradient(135deg, rgba(255,0,0,0.4), rgba(255,119,0,0.4), rgba(255,255,0,0.3), rgba(0,255,0,0.4), rgba(0,0,255,0.4), rgba(139,0,255,0.4))",
          backgroundSize: "400% 400%", animation: "rainbowBG 1.5s ease infinite",
          display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(20px)",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "96px", marginBottom: "16px", animation: "spinSlow 1s linear infinite" }}>🏳️‍🌈</p>
            <p className="rainbow-sub" style={{ fontSize: "36px", fontFamily: "'Space Mono', monospace", marginBottom: "16px" }}>
              SLAY BESTIE ✨👑💅
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px" }}>/the-index awaits 🦄</p>
          </div>
        </div>
      )}

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
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        @keyframes sparkle {
          0% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.8; transform: scale(1.5) rotate(90deg); }
          100% { opacity: 0; transform: scale(0.1) rotate(180deg) translateY(-40px); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes stripeScroll {
          0% { background-position: 0 0; }
          100% { background-position: 42px 42px; }
        }
        @keyframes verticalShift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .rainbow-sub {
          background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #00ddff, #0000ff, #8b00ff, #ff0080, #ff0000);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbowSlide 2s linear infinite;
        }
        .fruity-btn {
          background: linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0080, #ff0000);
          background-size: 300% 100%;
          animation: rainbowSlide 2s linear infinite;
          box-shadow: 0 0 15px rgba(255,0,0,0.4), 0 0 30px rgba(139,0,255,0.3), 0 0 45px rgba(0,0,255,0.2);
        }
        .fruity-btn:hover {
          box-shadow: 0 0 25px rgba(255,0,0,0.6), 0 0 50px rgba(139,0,255,0.5), 0 0 75px rgba(0,255,0,0.3) !important;
          transform: scale(1.05);
        }
        .trending-pill {
          transition: all 0.3s ease;
        }
        .trending-pill:hover {
          background: linear-gradient(135deg, rgba(255,0,0,0.2), rgba(255,119,0,0.2), rgba(255,255,0,0.15), rgba(0,255,0,0.2), rgba(0,0,255,0.2), rgba(139,0,255,0.2)) !important;
          border-color: rgba(255,255,255,0.2) !important;
          color: #fff !important;
          box-shadow: 0 0 20px rgba(139,0,255,0.3), 0 0 40px rgba(255,0,128,0.15);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
