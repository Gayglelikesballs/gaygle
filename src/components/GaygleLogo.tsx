"use client";

import { useState, useEffect } from "react";

const LETTERS = [
  { char: "G", color: "#4285f4" },
  { char: "a", color: "#ea4335" },
  { char: "y", color: "#fbbc05" },
  { char: "g", color: "#4285f4" },
  { char: "l", color: "#34a853" },
  { char: "e", color: "#ea4335" },
];

const GLITCH_CHARS = "!@#$%^&*<>?/\\|{}[]~`";

export default function GaygleLogo({ size = "large" }: { size?: "large" | "small" }) {
  const [glitching, setGlitching] = useState(false);
  const [glitchLetters, setGlitchLetters] = useState(LETTERS.map((l) => l.char));

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      const glitchDuration = 150 + Math.random() * 200;

      // Randomize letters during glitch
      const glitchInterval = setInterval(() => {
        setGlitchLetters(
          LETTERS.map((l) =>
            Math.random() > 0.5
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : l.char
          )
        );
      }, 50);

      setTimeout(() => {
        clearInterval(glitchInterval);
        setGlitchLetters(LETTERS.map((l) => l.char));
        setGlitching(false);
      }, glitchDuration);
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  const fontSize = size === "large" ? "5.5rem" : "1.8rem";
  const letterSpacing = size === "large" ? "-2px" : "-1px";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseEnter={() => setGlitching(true)}
      onMouseLeave={() => {
        setGlitching(false);
        setGlitchLetters(LETTERS.map((l) => l.char));
      }}
    >
      <h1
        style={{
          fontSize,
          fontWeight: 700,
          letterSpacing,
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1,
          position: "relative",
        }}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            style={{
              color: letter.color,
              display: "inline-block",
              transition: "transform 0.1s",
              transform: glitching
                ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`
                : "none",
              textShadow: glitching
                ? `${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px 0 rgba(255,0,0,0.5), ${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px 0 rgba(0,255,0,0.5), ${Math.random() * 6 - 3}px ${Math.random() * 6 - 3}px 0 rgba(0,0,255,0.5)`
                : "none",
              filter: glitching && Math.random() > 0.7 ? "hue-rotate(90deg)" : "none",
            }}
          >
            {glitchLetters[i]}
          </span>
        ))}
      </h1>

      {/* Subtle rainbow underline */}
      <div
        style={{
          height: "3px",
          marginTop: size === "large" ? "8px" : "4px",
          background: "linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000)",
          backgroundSize: "200% 100%",
          animation: "rainbowSlide 3s linear infinite",
          borderRadius: "2px",
          opacity: 0.6,
        }}
      />

      <style jsx>{`
        @keyframes rainbowSlide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
