"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const GAYGLE_SUGGESTIONS = [
  "how to mass a memecoin",
  "how to make money (you won't)",
  "how to mass a rugpull (don't)",
  "how to mass my dignity (too late)",
  "is gaygle watching me (always)",
  "just gaygle it",
  "why is my portfolio down again",
  "what did I do to deserve this",
  "wen moon wen lambo wen happiness",
  "gaygle knows what you did last summer",
];

export default function SearchBar({
  initialQuery = "",
  autoFocus = false,
  compact = false,
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  compact?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (query.length < 2) {
      setFilteredSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    // Fetch real suggestions from API
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/suggest?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((real: string[]) => {
          // Mix in 1-2 Gaygle joke suggestions
          const gaygleMatches = GAYGLE_SUGGESTIONS.filter((s) =>
            s.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 1);
          const mixed = [...real.slice(0, 5), ...gaygleMatches].slice(0, 6);
          setFilteredSuggestions(mixed.length > 0 ? mixed : GAYGLE_SUGGESTIONS.slice(0, 4));
        })
        .catch(() => {
          // Fallback to Gaygle jokes only
          const filtered = GAYGLE_SUGGESTIONS.filter((s) =>
            s.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 6);
          setFilteredSuggestions(
            filtered.length > 0 ? filtered : GAYGLE_SUGGESTIONS.slice(0, 4)
          );
        });
    }, 150); // debounce

    setSelectedIndex(-1);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        handleSearch(filteredSuggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleLucky = () => {
    const luckyQueries = [
      "what is gaygle",
      "tell me a secret",
      "how to mass a rugpull",
      "wen moon",
      "wagmi",
      "gm",
    ];
    const lucky = luckyQueries[Math.floor(Math.random() * luckyQueries.length)];
    handleSearch(lucky);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
      handleSearch(filteredSuggestions[selectedIndex]);
    } else {
      handleSearch();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "100%", maxWidth: compact ? "640px" : "580px", position: "relative" }}
      action="/search"
      method="GET"
    >
      {/* Search input container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: compact ? "var(--bg-secondary)" : "var(--bg-tertiary)",
          border: "1px solid var(--border)",
          borderRadius: showSuggestions && filteredSuggestions.length > 0 ? "24px 24px 0 0" : "24px",
          padding: compact ? "8px 16px" : "12px 20px",
          transition: "border-color 0.3s, box-shadow 0.3s",
          boxShadow: showSuggestions ? "0 4px 20px rgba(0,0,0,0.5)" : "none",
        }}
        onFocus={() => setShowSuggestions(true)}
      >
        {/* Search icon */}
        <svg
          width={compact ? "18" : "20"}
          height={compact ? "18" : "20"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9aa0a6"
          strokeWidth="2"
          style={{ flexShrink: 0, marginRight: compact ? "8px" : "12px" }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          name="q"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="just gaygle it..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: compact ? "14px" : "16px",
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{
              background: "none",
              border: "none",
              color: "#9aa0a6",
              cursor: "pointer",
              fontSize: "18px",
              padding: "0 8px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && query.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: compact ? "var(--bg-secondary)" : "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderTop: "1px solid var(--border)",
            borderRadius: "0 0 16px 16px",
            overflow: "hidden",
            zIndex: 100,
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          }}
        >
          {filteredSuggestions.map((suggestion, i) => (
            <div
              key={i}
              onMouseDown={() => handleSearch(suggestion)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: selectedIndex === i ? "rgba(255,255,255,0.05)" : "transparent",
                fontSize: "14px",
                color: "var(--text-primary)",
                transition: "background 0.15s",
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span style={{ color: "#9aa0a6", fontSize: "12px" }}>🔍</span>
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Buttons (only on homepage) */}
      {!compact && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => handleSearch()}
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#303134";
              e.currentTarget.style.borderColor = "#555";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Gaygle Search
          </button>
          <button
            onClick={handleLucky}
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#303134";
              e.currentTarget.style.borderColor = "#555";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            I&apos;m Feeling Lucky
          </button>
        </div>
      )}
    </form>
  );
}
