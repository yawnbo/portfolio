import React from "react";
import { BtopBox, useTheme } from "./App.jsx";

type NavLink = { href: string; label: string };

const DEFAULT_LINKS: NavLink[] = [
  { href: "https://yawnbo.com", label: "home" },
  { href: "https://movies.yawnbo.com/main", label: "movies/tv" },
  { href: "https://sports.yawnbo.com/explore", label: "sports" },
];

function SteamSmileAscii({
  color,
  cols = 22,
  rows = 11,
}: {
  color: string;
  cols?: number;
  rows?: number;
}) {
  const [art, setArt] = React.useState<string>("");

  React.useEffect(() => {
    const RAMP = " .:-=+*#%@█";
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cols, rows);
      ctx.drawImage(img, 0, 0, cols, rows);
      const data = ctx.getImageData(0, 0, cols, rows).data;
      let out = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const lum = Math.pow(
            (data[i] + data[i + 1] + data[i + 2]) / 3 / 255,
            0.7,
          );
          const idx = Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length));
          out += RAMP[idx];
        }
        if (y < rows - 1) out += "\n";
      }
      setArt(out);
    };
    img.src = "/steamsmile.svg";
  }, [cols, rows]);

  return (
    <pre
      style={{
        fontFamily: "var(--mono)",
        fontSize: 5,
        lineHeight: 0.65,
        letterSpacing: 0,
        color,
        margin: 0,
        whiteSpace: "pre",
        userSelect: "none",
      }}
    >
      {art}
    </pre>
  );
}

function HeaderLink({
  href,
  children,
  color,
  hoverColor,
}: {
  href: string;
  children: React.ReactNode;
  color: string;
  hoverColor: string;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? hoverColor : color,
        textDecoration: "none",
        transition: "color 0.15s ease",
      }}
    >
      {children}
    </a>
  );
}

export function Header({ navLinks = DEFAULT_LINKS }: { navLinks?: NavLink[] }) {
  const t: any = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 720);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const divider = <span style={{ color: t.fg3, opacity: 0.5 }}>│</span>;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "2%",
          right: "1%",
          left: "51%",
          zIndex: 100,
          fontFamily: "var(--mono)",
          fontSize: 12,
        }}
      >
        <BtopBox
          titles={[{ label: "nav" }, { label: "@yawnbo" }]}
          width="100%"
          borderColor={t.fg3}
          bg={t.bgHard}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              minHeight: 42,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <a
                href="/"
                aria-label="home"
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <SteamSmileAscii color={t.accent} />
              </a>
              {!isMobile && divider}
              {!isMobile && (
                <nav style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {navLinks.map((l) => (
                    <HeaderLink
                      key={l.href}
                      href={l.href}
                      color={t.fg3}
                      hoverColor={t.fg}
                    >
                      {l.label}
                    </HeaderLink>
                  ))}
                </nav>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                title="search"
                style={{
                  background: "none",
                  border: `1px solid ${t.bg3}`,
                  color: t.fgDim,
                  cursor: "pointer",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 3,
                  letterSpacing: "0.08em",
                }}
              >
                ⌕ /search
              </button>
              {!isMobile && divider}
              {!isMobile && (
                <HeaderLink href="/signin" color={t.fg3} hoverColor={t.fg}>
                  sign in
                </HeaderLink>
              )}
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="menu"
                  style={{
                    background: "none",
                    border: "none",
                    color: t.fg3,
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    padding: "2px 6px",
                  }}
                >
                  {mobileOpen ? "[ x ]" : "[ ≡ ]"}
                </button>
              )}
            </div>
          </div>
        </BtopBox>
      </div>

      {isMobile && mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `${t.bgHard}ee`,
            backdropFilter: "blur(6px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            fontFamily: "var(--mono)",
            fontSize: 20,
          }}
          onClick={() => setMobileOpen(false)}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ color: t.fg, textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/signin"
            style={{ color: t.fg3, textDecoration: "none", marginTop: 12 }}
          >
            sign in
          </a>
        </div>
      )}
    </>
  );
}
