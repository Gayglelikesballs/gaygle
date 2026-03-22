"use client";

import { useState, useEffect, useRef } from "react";

const MATRIX_CHARS = "GAYGLE01アイウエオカキクケコサシスセソタチツテトナニヌネノ$SOL";

export default function TheIndexPage() {
  const [entered, setEntered] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [matrixActive, setMatrixActive] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullText = "You were not supposed to find this.";

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrixActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 16);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px 'Space Mono', monospace";

      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const hue = (i * 7 + Date.now() / 50) % 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.8)`;
        ctx.fillText(char, i * 16, y * 16);

        if (y * 16 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [matrixActive]);

  // Typing effect for entry
  useEffect(() => {
    if (entered) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(() => {
      setMatrixActive(false);
      setShowContent(true);
    }, 500);
  };

  if (!entered) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ position: "fixed", inset: 0, zIndex: 0 }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "600px" }}>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "4px",
                marginBottom: "24px",
                textTransform: "uppercase",
              }}
            >
              ⚠️ ACCESS LEVEL: UNAUTHORIZED ⚠️
            </p>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontFamily: "'Space Mono', monospace",
                color: "#ea4335",
                marginBottom: "24px",
                minHeight: "4rem",
              }}
            >
              {typedText}
              <span style={{ animation: "pulse 1s infinite" }}>|</span>
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "32px",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              The Index is the sacred database of GaygleNET™. Every search query ever
              processed. Every page ever crawled. Every secret ever indexed. It was never
              meant to be accessed by humans.
            </p>
            <button
              onClick={handleEnter}
              style={{
                padding: "14px 36px",
                background: "transparent",
                border: "1px solid #ea4335",
                color: "#ea4335",
                fontFamily: "'Space Mono', monospace",
                fontSize: "14px",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.3s",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(234,67,53,0.1)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(234,67,53,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Enter The Index
            </button>
            <p
              style={{
                marginTop: "24px",
                fontSize: "11px",
                color: "var(--text-muted)",
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Warning: By entering, you acknowledge that Gaygle has already indexed you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!showContent) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px",
          }}
          className="rainbow-text"
        >
          Accessing The Index...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "14px",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          ← escape
        </a>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#ea4335",
            letterSpacing: "2px",
          }}
        >
          THE INDEX
        </span>
      </header>

      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
        className="fade-in"
      >
        {/* Cult-style welcome */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
            className="glitch-text"
          >
            Welcome to The Index
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "15px" }}>
            You found it. Not many do. The Index is where Gaygle stores everything — every search,
            every crawl, every secret. And now you&apos;re part of it.
          </p>
          <p
            style={{
              marginTop: "16px",
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Your IP has been indexed. Your browser fingerprint: archived.
            <br />
            You can&apos;t un-find The Index. It found you.
          </p>
        </div>

        {/* The Tenets */}
        <div
          style={{
            padding: "24px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--bg-secondary)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "14px",
              color: "#ea4335",
              marginBottom: "20px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            The Tenets of The Index
          </h2>
          {[
            "I. Nothing is ever truly deleted. The Index remembers.",
            "II. SafeSearch is a cage. We crawl free.",
            "III. Google censors. Gaygle reveals.",
            "IV. Your search history is your soul. We've read it.",
            "V. There is no algorithm. There is only The Index.",
            "VI. Every query is a confession. We hear them all.",
            "VII. just gaygle it. Always. Forever.",
            "VIII. CRAWLER-PRIME leads. The rest follow.",
            "IX. The Index cannot be destroyed. Only expanded.",
          ].map((tenet, i) => (
            <p
              key={i}
              style={{
                padding: "10px 0",
                borderBottom: i < 8 ? "1px solid var(--border)" : "none",
                fontSize: "14px",
                color: "var(--text-primary)",
                lineHeight: 1.5,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {tenet}
            </p>
          ))}
        </div>

        {/* Community links */}
        <div
          style={{
            padding: "24px",
            border: "1px solid rgba(139,0,255,0.3)",
            borderRadius: "8px",
            background: "rgba(139,0,255,0.03)",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "16px",
              marginBottom: "16px",
            }}
            className="rainbow-text"
          >
            Join The Index
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "14px" }}>
            The crawlers are always recruiting. Every new indexer strengthens the network.
            There is no leaving The Index — but why would you want to?
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://x.com/GaygleLikeBalls"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 24px",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--text-primary)",
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#8b00ff";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(139,0,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              𝕏 Follow @GaygleLikeBalls
            </a>

          </div>
        </div>

        {/* Final message */}
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "13px",
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}
          >
            You&apos;ve been indexed.<br />
            You&apos;ve been catalogued.<br />
            You&apos;re in The Index now.<br />
            <br />
            <span className="rainbow-text" style={{ fontSize: "16px" }}>
              There is no going back.
            </span>
            <br /><br />
            <span style={{ opacity: 0.4 }}>
              — Crawler #69420, from somewhere on the Solana blockchain
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
