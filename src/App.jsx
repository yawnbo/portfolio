import React from 'react';
import { AsciiMuseum } from './AsciiMuseum.jsx';
import { Header } from './Header.tsx';

const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS || {
  theme: 'gruvbox-dark',
  monoFont: 'JetBrains Mono',
  serifFont: 'Computer Modern Serif',
};

const THEMES = {
  'gruvbox-dark': {
    name: 'Gruvbox Dark',
    bg: '#282828', bgHard: '#1d2021', bgSoft: '#32302f',
    bg1: '#3c3836', bg2: '#504945', bg3: '#665c54', bg4: '#7c6f64',
    fg: '#ebdbb2', fg0: '#fbf1c7', fg2: '#d5c4a1', fg3: '#bdae93', fg4: '#a89984',
    fgDim: '#928374',
    red: '#fb4934', green: '#b8bb26', yellow: '#fabd2f',
    blue: '#83a598', purple: '#d3869b', aqua: '#8ec07c', orange: '#fe8019',
    accent: '#fabd2f', accent2: '#8ec07c',
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    bg: '#1a1b26', bgHard: '#16161e', bgSoft: '#1f2335',
    bg1: '#24283b', bg2: '#292e42', bg3: '#3b4261', bg4: '#545c7e',
    fg: '#c0caf5', fg0: '#d5daf0', fg2: '#a9b1d6', fg3: '#9aa5ce', fg4: '#787c99',
    fgDim: '#565f89',
    red: '#f7768e', green: '#9ece6a', yellow: '#e0af68',
    blue: '#7aa2f7', purple: '#bb9af7', aqua: '#7dcfff', orange: '#ff9e64',
    accent: '#7aa2f7', accent2: '#bb9af7',
  },
  'catppuccin-mocha': {
    name: 'Catppuccin Mocha',
    bg: '#1e1e2e', bgHard: '#181825', bgSoft: '#262637',
    bg1: '#313244', bg2: '#45475a', bg3: '#585b70', bg4: '#6c7086',
    fg: '#cdd6f4', fg0: '#d9e0ee', fg2: '#bac2de', fg3: '#a6adc8', fg4: '#9399b2',
    fgDim: '#7f849c',
    red: '#f38ba8', green: '#a6e3a1', yellow: '#f9e2af',
    blue: '#89b4fa', purple: '#cba6f7', aqua: '#94e2d5', orange: '#fab387',
    accent: '#cba6f7', accent2: '#94e2d5',
  },
  'nord': {
    name: 'Nord',
    bg: '#2e3440', bgHard: '#272c36', bgSoft: '#353b49',
    bg1: '#3b4252', bg2: '#434c5e', bg3: '#4c566a', bg4: '#616e88',
    fg: '#eceff4', fg0: '#eceff4', fg2: '#d8dee9', fg3: '#c8ced8', fg4: '#a5adba',
    fgDim: '#6a7a8f',
    red: '#bf616a', green: '#a3be8c', yellow: '#ebcb8b',
    blue: '#81a1c1', purple: '#b48ead', aqua: '#88c0d0', orange: '#d08770',
    accent: '#88c0d0', accent2: '#b48ead',
  },
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5400/api/v1';

const DOVE_FRAMES = [
`
             ▄▄▄
           ▄█▀ ▀█▄
          █▀ ◐ ◐ ▀█
          ▀█  ▾  █▀
      ▄▄▄▄▄█▌   ▐█▄▄▄▄▄
    ▄█▀▀          ▀▀█▄
  ▄█▀    ▄          ▀█▄
 █▀    ▄█▀            ▀█
▐█   ▄█▀    ██████     █▌
 █▄ █▀     ██████████ ▄█
  ▀█▄      ██████████▄█▀
    ▀█▄▄    ████████▄█▀
       ▀▀█▄▄▄████▄█▀▀
            ██  ██
           ▐█▌  ▐█▌
           ▀▀    ▀▀
`,
`
             ▄▄▄
           ▄█▀ ▀█▄
          █▀ ◐ ◐ ▀█
          ▀█  ▾  █▀
      ▄▄▄▄▄█▌   ▐█▄▄▄▄▄
    ▄█▀▀   ▐█   █▌  ▀▀█▄
   █▀      ▐█   █▌     ▀█
  █▌       ▐█   █▌      █▌
  ▐█       ▐█   █▌     █▌
   █▄      ▐█   █▌    ▄█
    ▀█▄    ▐█   █▌  ▄█▀
      ▀█▄▄▄██   ██▄█▀
          ▐██   ██▌
            ██  ██
           ▐█▌  ▐█▌
           ▀▀    ▀▀
`,
`
             ▄▄▄
           ▄█▀ ▀█▄
          █▀ ◐ ◐ ▀█
          ▀█  ▾  █▀
           █▌   ▐█
           █▌   ▐█
           █▌   ▐█
    ▄▄▄▄▄▄██   ██▄▄▄▄▄▄
  ▄█▀▀▀▀  ▐█   █▌ ▀▀▀▀█▄
 █▀        ▐█   █▌      ▀█
▐█▄        ▐█   █▌      ▄█▌
  ▀█▄▄▄▄▄▄██   ██▄▄▄▄▄█▀
          ▐██   ██▌
            ██  ██
           ▐█▌  ▐█▌
           ▀▀    ▀▀
`,
`
             ▄▄▄
           ▄█▀ ▀█▄
          █▀ ◐ ◐ ▀█
          ▀█  ▾  █▀
      ▄▄▄▄▄█▌   ▐█▄▄▄▄▄
    ▄█▀▀   ▐█   █▌  ▀▀█▄
   █▀      ▐█   █▌     ▀█
  █▌       ▐█   █▌      █▌
  ▐█       ▐█   █▌     █▌
   █▄      ▐█   █▌    ▄█
    ▀█▄    ▐█   █▌  ▄█▀
      ▀█▄▄▄██   ██▄█▀
          ▐██   ██▌
            ██  ██
           ▐█▌  ▐█▌
           ▀▀    ▀▀
`,
];

const ThemeCtx = React.createContext(null);
export const useTheme = () => React.useContext(ThemeCtx);

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

export function BtopBox({ children, titles, width, height, style, borderColor, bg }) {
  const t = useTheme();
  const bc = borderColor || t.fgDim;
  const background = bg || t.bgHard;
  const ref = React.useRef(null);
  const measureRef = React.useRef(null);
  const [cols, setCols] = React.useState(80);
  const [charW, setCharW] = React.useState(7.8);

  const FONT = 13;

  React.useEffect(() => {
    if (!ref.current) return;
    const measure = () => {
      const mw = measureRef.current ? measureRef.current.getBoundingClientRect().width / 100 : 7.8;
      const realCharW = mw > 0 ? mw : 7.8;
      const w = ref.current.offsetWidth;
      setCharW(realCharW);
      setCols(Math.max(4, Math.round(w / realCharW)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const buildTopBorder = () => {
    if (!titles || titles.length === 0) {
      return '╭' + '─'.repeat(Math.max(0, cols - 2)) + '╮';
    }
    let line = '╭─';
    let used = 2;
    titles.forEach((tObj, i) => {
      const label = typeof tObj === 'string' ? tObj : tObj.label;
      const segment = '┐' + label + '┌';
      line += segment;
      used += segment.length;
      if (i < titles.length - 1) {
        line += '──';
        used += 2;
      }
    });
    const remaining = Math.max(0, cols - used - 1);
    line += '─'.repeat(remaining) + '╮';
    return line;
  };

  const topBorder = buildTopBorder();
  const bottomBorder = '╰' + '─'.repeat(Math.max(0, cols - 2)) + '╯';
  const sideCol = '│\n'.repeat(400);

  const borderStyle = {
    fontFamily: 'var(--mono)', fontSize: FONT, lineHeight: 1,
    color: bc, margin: 0, whiteSpace: 'pre', overflow: 'hidden',
    pointerEvents: 'none', userSelect: 'none',
  };

  return (
    <div ref={ref} style={{ width, height, position: 'relative', overflow: 'hidden', ...style }}>
      <pre
        ref={measureRef}
        aria-hidden
        style={{
          ...borderStyle,
          position: 'absolute', visibility: 'hidden',
          left: -99999, top: 0,
        }}
      >{'─'.repeat(100)}</pre>
      <pre style={borderStyle}>{topBorder}</pre>
      <div style={{
        position: 'relative',
        background,
        flex: 1,
        overflow: 'hidden',
        height: height ? `calc(100% - 28px)` : 'auto',
        minHeight: height ? undefined : 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <pre style={{
          ...borderStyle,
          position: 'absolute', left: 0, top: 0, bottom: 0, width: charW,
        }}>{sideCol}</pre>
        <pre style={{
          ...borderStyle,
          position: 'absolute',
          right: 0,
          top: 0, bottom: 0, width: charW,
          textAlign: 'right',
        }}>{sideCol}</pre>
        <div style={{
          padding: `6px ${charW + 6}px`,
          flex: 1, overflow: 'hidden', position: 'relative',
        }}>
          {children}
        </div>
      </div>
      <pre style={borderStyle}>{bottomBorder}</pre>
    </div>
  );
}

function ASCIIDove({ color, scale = 1, speed = 280 }) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % DOVE_FRAMES.length), speed);
    return () => clearInterval(id);
  }, [speed]);
  return (
    <pre style={{
      color: color || '#ebdbb2',
      fontFamily: 'var(--mono)',
      fontSize: 14 * scale,
      lineHeight: 1.15,
      textAlign: 'center',
      margin: 0,
    }}>
      {DOVE_FRAMES[frame]}
    </pre>
  );
}

function NowTile() {
  const t = useTheme();
  const prompt = (
    <>
      <span style={{ color: t.green }}>~</span>
      <span style={{ color: t.fgDim }}> λ </span>
    </>
  );
  return (
    <BtopBox
      titles={[{ label: 'now' }, { label: '~/.now' }]}
      width="100%"
      height="100%"
      borderColor={t.purple}
      bg={t.bgHard}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 12, color: t.fg2,
        lineHeight: 1.5, padding: '2px 4px',
      }}>
        <div style={{ color: t.fgDim }}>
          {prompt}<span style={{ color: t.fg }}>cat ~/.now</span>
        </div>
        <pre style={{
          fontFamily: 'var(--mono)', fontSize: 12, margin: 0,
          color: t.fg2, lineHeight: 1.5, whiteSpace: 'pre',
        }}>
{`  `}<span style={{ color: t.accent }}>reading </span>{`   ·  Tokio source code
  `}<span style={{ color: t.accent }}>playing</span>{`    ·  Cortisol inducing multiplayer games, DMC5 and RE7
  `}<span style={{ color: t.accent }}>working on</span>{` ·  Proxymore, lollipop (soon) and a terrible nvim config
  `}<span style={{ color: t.accent }}>configs</span>{`    ·  Arch+Hyperland, Windows+Glaze, MacOS+yabai (goat) `}

        </pre>
      </div>
    </BtopBox>
  );
}

const buildFallbackGithubLevels = () => {
  const out = [];
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const v =
        Math.sin(w * 0.32 + d * 0.4) * 1.1 +
        Math.cos(d * 0.5 + w * 0.08) * 0.9 +
        Math.sin(w * 0.06) * 1.4;
      const adj = (d === 0 || d === 6) ? v - 0.7 : v;
      out.push(Math.max(0, Math.min(4, Math.floor((adj + 2) * 1.1))));
    }
  }
  return out;
};

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const formatShortDate = (date) => {
  if (!date) return '';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const toGithubGridLevels = (summary, fallbackLevels) => {
  const days = summary?.contributionGraph;
  if (!Array.isArray(days) || days.length === 0) return fallbackLevels;

  const normalized = days
    .map((day) => ({
      date: day.date,
      level: Number.isFinite(day.level) ? day.level : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-365);

  const padding = Array.from({ length: Math.max(0, 371 - normalized.length) }, () => 0);
  return [...padding, ...normalized.map((day) => Math.max(0, Math.min(4, day.level)))].slice(-371);
};

function GithubTile() {
  const t = useTheme();
  const [githubSummary, setGithubSummary] = React.useState(null);
  const [githubError, setGithubError] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/github/summary`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub summary failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setGithubSummary(data);
        setGithubError(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setGithubError(true);
      });

    return () => controller.abort();
  }, []);

  const fallbackLevels = React.useMemo(buildFallbackGithubLevels, []);
  const levels = React.useMemo(() => {
    return toGithubGridLevels(githubSummary, fallbackLevels);
  }, [fallbackLevels, githubSummary]);

  const dateRange = githubSummary?.startDate && githubSummary?.endDate
    ? `${formatShortDate(githubSummary.startDate)}..${formatShortDate(githubSummary.endDate)}`
    : 'last 365d';
  const topLanguages = Array.isArray(githubSummary?.topLanguages)
    ? githubSummary.topLanguages
    : githubSummary?.topLanguage
      ? [githubSummary.topLanguage]
      : [];

  const levelColor = (lvl) => {
    if (lvl === 0) return t.bg2;
    const ramp = [null, `${t.aqua}44`, `${t.aqua}88`, `${t.aqua}cc`, t.green];
    return ramp[lvl];
  };

  const prompt = (
    <>
      <span style={{ color: t.green }}>~</span>
      <span style={{ color: t.fgDim }}> λ </span>
    </>
  );

  return (
    <BtopBox
      titles={[{ label: 'github' }, { label: '@yawnbo' }]}
      width="100%"
      height="100%"
      borderColor={t.green}
      bg={t.bgHard}
    >
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 11, color: t.fg2,
        height: '100%', display: 'flex', flexDirection: 'column',
        gap: 8, padding: '2px 4px',
      }}>
        <div style={{ color: t.fgDim }}>
          {prompt}<span style={{ color: t.fg }}>gh contrib --range {dateRange}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(53, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
          gap: 3,
          width: '100%',
          aspectRatio: '53 / 7',
        }}>
          {levels.map((lvl, i) => (
            <div key={i} style={{
              background: levelColor(lvl),
              borderRadius: 2,
            }} />
          ))}
        </div>

        <div style={{
          display: 'flex', gap: 6, fontSize: 10, color: t.fgDim,
          alignItems: 'center', justifyContent: 'flex-end',
        }}>
          {githubSummary?.totalContributions !== undefined && (
            <span style={{ marginRight: 'auto', color: t.fg3 }}>
              {formatNumber(githubSummary.totalContributions)} contributions
            </span>
          )}
          <span>less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} style={{
              width: 10, height: 10,
              background: levelColor(l), borderRadius: 2,
            }} />
          ))}
          <span>more</span>
        </div>

        <div style={{ color: t.fgDim, marginTop: 'auto' }}>
          {prompt}<span style={{ color: t.fg }}>ls -laS ~/.languages | head -3</span>
        </div>
        <pre style={{
          fontFamily: 'var(--mono)', fontSize: 11, margin: 0,
          color: t.fg2, lineHeight: 1.4, whiteSpace: 'pre',
        }}>
          {topLanguages.length > 0 ? (
            <>
              {topLanguages.slice(0, 3).map((language) => (
                <React.Fragment key={language.name}>
                  {`-rw-r--r--  `}
                  <span style={{ color: t.accent }}>{formatNumber(language.estimatedLines)}</span>
                  {`  yawnbo  `}
                  <span style={{ color: t.orange }}>{language.name.toLowerCase()}</span>
                  {`   `}
                  <span style={{ color: t.fgDim }}>{language.percent}% of total</span>
                  {`\n`}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {`-rw-r--r--  `}
              <span style={{ color: t.accent }}>{githubError ? 'unavailable' : 'loading...'}</span>
              {`  yawnbo  `}
              <span style={{ color: t.orange }}>github</span>
            </>
          )}
        </pre>
      </div>
    </BtopBox>
  );
}

function WelcomeSection() {
  const t = useTheme();
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const vh = window.innerHeight;
  const cameraScrollVh = 1.65;
  const progress = Math.min(1, Math.max(0, scrollY / (vh * cameraScrollVh)));

  const welcomeLeft = lerp(0, 51, progress);
  const welcomeTop = lerp(0, 8, progress);
  const welcomeRight = lerp(0, 1, progress);
  const welcomeBottom = lerp(0, 38, progress);

  const secondaryFade = Math.max(0, (progress - 0.4) / 0.4);
  const secondaryShift = lerp(24, 0, secondaryFade);

  const panel = (sticky) => ({
    position: 'absolute',
    opacity: secondaryFade,
    transform: `translateY(${secondaryShift}px)`,
    pointerEvents: progress < 0.98 ? 'none' : 'auto',
    overflow: 'hidden',
    ...sticky,
  });

  return (
    <div style={{ height: `${(cameraScrollVh + 1) * 100}vh`, position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: t.bg, overflow: 'hidden',
      }}>
        <Header />
        <div style={{
          position: 'absolute',
          left: `${welcomeLeft}%`,
          top: `${welcomeTop}%`,
          right: `${welcomeRight}%`,
          bottom: `${welcomeBottom}%`,
        }}>
          <BtopBox
            titles={progress < 0.3
              ? [{ label: 'welcome' }]
              : [{ label: 'yawnbo' }, { label: '~/home' }]
            }
            width="100%"
            height="100%"
            borderColor={t.accent}
            bg={t.bgHard}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                flex: 1, width: '100%', minHeight: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AsciiMuseum color={t.fg} progress={progress} />
              </div>
              <div style={{
                fontFamily: 'var(--mono)', color: t.fgDim,
                fontSize: lerp(14, 11, progress),
                opacity: lerp(1, 0.8, progress),
                letterSpacing: '0.15em', textAlign: 'center',
              }}>
                {progress < 0.3 ? (
                  <>
                    <span style={{color: t.accent}}>yan bogdanovskyy</span>
                    <span style={{color: t.fgDim}}> // </span>
                    <span style={{color: t.accent2}}>networking · distributed systems · TUI</span>
                  </>
                ) : (
                  <span style={{color: t.accent}}>~/projects</span>
                )}
              </div>
              {progress < 0.15 && (
                <div style={{
                  fontFamily: 'var(--mono)', color: t.fgDim,
                  fontSize: 11, opacity: 1 - progress * 8,
                  letterSpacing: '0.3em',
                }}>
                  ↓ scroll ↓
                </div>
              )}
            </div>
          </BtopBox>
        </div>

        <div style={panel({ left: '51%', right: '1%', top: '63%', bottom: '23%' })}>
          <NowTile />
        </div>

        <div style={panel({ left: '51%', right: '1%', top: '78%', bottom: '2%' })}>
          <GithubTile />
        </div>

        <div style={panel({ left: '1%', top: '2%', bottom: '2%', width: '49%' })}>
          <BtopBox
            titles={[{ label: 'resume' }, { label: 'yan bogdanovskyy' }]}
            width="100%"
            height="100%"
            borderColor={t.fg3}
            bg={t.bg}
          >
            <div style={{ overflow: 'auto', height: '100%', padding: '8px 12px' }}>
              <ResumeContent />
            </div>
          </BtopBox>
        </div>
      </div>
    </div>
  );
}

function ResumeContent() {
  const t = useTheme();

  const section = (text) => (
    <h2 style={{
      fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700,
      color: t.fg, marginTop: 20, marginBottom: 6,
      borderBottom: `1px solid ${t.bg3}`, paddingBottom: 3,
      fontVariant: 'small-caps', letterSpacing: '0.04em',
    }}>{text}</h2>
  );

  const body = {
    fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1.55,
    color: t.fg2,
  };

  const Subheading = ({ title, location, role, dates }) => (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, ...body }}>
        <strong style={{ color: t.fg }}>{title}</strong>
        <span style={{ color: t.fg3 }}>{location}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, ...body, fontSize: 12 }}>
        <em style={{ color: t.fg3 }}>{role}</em>
        <em style={{ color: t.fgDim }}>{dates}</em>
      </div>
    </div>
  );

  const Item = ({ label, children }) => (
    <li style={{ ...body, marginTop: 4, paddingLeft: 4 }}>
      <strong style={{ color: t.fg }}>{label}</strong>
      <span style={{ color: t.fgDim }}>: </span>
      <span>{children}</span>
    </li>
  );

  return (
    <div style={{ color: t.fg, paddingBottom: 24 }}>
      <h1 style={{
        fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 400,
        color: t.fg0, marginBottom: 2, letterSpacing: '0.02em',
      }}>
        Yan Bogdanovskyy
      </h1>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, color: t.fgDim,
        marginBottom: 4, letterSpacing: '0.06em',
      }}>
        <a href="mailto:contact@yawnbo.com" style={{ color: t.fg3, textDecoration: 'none' }}>contact@yawnbo.com</a>
        {' · '}
        <a href="https://yawnbo.com" style={{ color: t.fg3, textDecoration: 'none' }}>yawnbo.com</a>
        {' · '}
        <a href="https://github.com/yawnbo" style={{ color: t.fg3, textDecoration: 'none' }}>github.com/yawnbo</a>
        {' · '}
      </div>

      {section('Education')}
      <Subheading
        title="Bellevue College"
        location="Bellevue, WA"
        role="Associate of Arts and Sciences; GPA: 3.7"
        dates="Sep. 2023 – June 2025"
      />

      {section('Experience')}

      <Subheading
        title="Media Streaming Platform"
        location="Hybrid, LA, Bellevue"
        role="Backend Engineer"
        dates="Jan 2026 – Present"
      />
      <ul style={{ paddingLeft: 16, marginTop: 4 }}>
        <Item label="Streaming Infrastructure">
          Built a high-throughput HLS streaming backend in Rust/Axum with
          multi-tier caching (Cloudflare cache API + Redis) designed to
          outperform origin streaming by speculatively ingesting up to 7 TB
          of data per month before users request it.
        </Item>
        <Item label="Cryptographic Pipeline">
          Full cryptography pipelines for obfuscation and protection using
          ChaCha20, XSalsa20-Poly1305, and AES.
        </Item>
        <Item label="Proxy Management">
          Fully async, self-updating, self-evicting proxy pool for advanced
          routing, error prevention, and bandwidth optimization.
        </Item>
        <Item label="Infrastructure">
          Deployed on Fly.io with Docker multi-stage builds, PostgreSQL,
          Redis, Sentry, and Cloudflare Workers — plus a custom edge server
          implementation for cache normalization and traffic optimization.
        </Item>
      </ul>

      <Subheading
        title="Freelance Streaming, DevOps & Backend"
        location="Remote"
        role="Founder / Lead Developer"
        dates="2024 – Present"
      />
      <ul style={{ paddingLeft: 16, marginTop: 4 }}>
        <Item label="Edge Performance">
          Reduced core-server bandwidth by up to 85% (7 TB+ → ≤ 1 TB) via
          custom edge clusters, Moka in-memory caches, and stripped-down
          origin forks.
        </Item>
        <Item label="Networking Stack">
          HTTP/2 and HTTP/3 support with JA3/4 protection, QUIC/TCP
          bypass via BoringSSL, and sticky proxy pools with shared DNS,
          alt-svc, and cert-validation caches.
        </Item>
        <Item label="Tooling">
          Tokio, Rayon, Axum/Tower, Hyper/H3/Quinn, SQLx, reqwest/wreq;
          orchestrated with k3s; observed via Grafana/Prometheus + Sentry.
        </Item>
      </ul>

      <Subheading
        title="RUSH Hackathon / Startup"
        location="Remote"
        role="Lead Backend Developer"
        dates="2024"
      />
      <ul style={{ paddingLeft: 16, marginTop: 4 }}>
        <Item label="Backend Ownership">
          Built the core business logic and user-auth systems end-to-end.
          Ran deployments, merge-conflict resolution, and CI/CD for the
          React Native frontend.
        </Item>
      </ul>

      <Subheading
        title="Grade Potential Tutoring"
        location="Bellevue, WA"
        role="Tutor"
        dates="Oct. 2024 – Present"
      />
      <ul style={{ paddingLeft: 16, marginTop: 4 }}>
        <Item label="Tutoring">
          Private tutor for students with autism/ADHD across K–12 math,
          early calculus, and biology. Travel to student homes across the
          Bellevue area.
        </Item>
      </ul>

      {section('Projects')}
      <ul style={{ paddingLeft: 16, marginTop: 4 }}>
        <Item label="Proxymore">
          Fork/extension of a Rust CLI MITM proxy for HTTP(S) and WS(S)
          traffic. Added rule-based interception with glob/regex matching
          and request/response rewriting on top of the existing Ratatui
          TUI, WebUI, MITM cert generation, SSE streaming, and cURL/HAR/
          Markdown exports. Hyper · Tokio · Rustls.
        </Item>
        <Item label="Movers">
          Rust CLI for searching and streaming films and TV. TMDb metadata,
          async scraping with reqwest/scraper, XOR stream-URL decryption,
          gzip subtitle support, and FZF-driven selection menus with MPV
          playback and FFmpeg downloads.
        </Item>
        <Item label="Dendranet">
          Full-stack Rust research-paper organizer. Monorepo: Axum REST API
          (PostgreSQL, Redis, OAuth/OIDC), Ratatui TUI with vim-style
          navigation, and a custom WASM rendering backend implementing the
          Ratatui buffer. JWT auth, Prometheus metrics, shared core crate.
        </Item>
        <Item label="LaTeX Notes System">
          Notes framework used across 6+ college courses (Calc 2–4, Linear
          Algebra, Physics 101, CS). 15+ color-coded tcolorbox environments
          for theorems/proofs/exercises, shorthand macros for calculus,
          TikZ/pgfplots, and algorithm2e for pseudocode.
        </Item>
      </ul>

      {section('Skills')}
      <p style={{ ...body, marginTop: 4 }}>
        <strong style={{ color: t.fg }}>Languages</strong>
        <span style={{ color: t.fgDim }}>: </span>
        Rust, Bash, SQL, JavaScript, HTML/CSS, LaTeX.
      </p>
      <p style={{ ...body, marginTop: 2 }}>
        <strong style={{ color: t.fg }}>Technologies</strong>
        <span style={{ color: t.fgDim }}>: </span>
        Tokio, Axum, Hyper, PostgreSQL, Redis, Docker, Fly.io, Cloudflare,
        Sentry, Prometheus.
      </p>
      <p style={{ ...body, marginTop: 2 }}>
        <strong style={{ color: t.fg }}>Tools</strong>
        <span style={{ color: t.fgDim }}>: </span>
        Neovim, Git, SSH, Linux/macOS, Hyprland, tmux.
      </p>
    </div>
  );
}

function BottomTile() {
  const t = useTheme();
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.6, 1] }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      height: '100vh', display: 'flex',
      background: t.bg, position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.98)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        <BtopBox
          titles={[{ label: '~/art' }, { label: 'placeholder' }]}
          width="100%"
          height="100%"
          borderColor={t.accent2}
          bg={t.bgHard}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', flexDirection: 'column',
          }}>
            <ASCIIDove color={t.accent2} scale={3} speed={300} />
            <div style={{
              fontFamily: 'var(--mono)', color: t.fgDim,
              fontSize: 12, marginTop: 24, letterSpacing: '0.2em',
            }}>
              [ placeholder — i have no idea what to put here]
            </div>
          </div>
        </BtopBox>
      </div>
    </div>
  );
}

function TweaksPanel({ visible, currentTheme, onThemeChange }) {
  const t = useTheme();
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 0, zIndex: 9999,
      width: 240,
    }}>
      <BtopBox
        titles={[{ label: 'tweaks' }]}
        width="100%"
        borderColor={t.accent}
        bg={t.bg1}
      >
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: t.fg }}>
          <div style={{ color: t.fgDim, marginBottom: 6, fontSize: 11 }}>theme:</div>
          {Object.entries(THEMES).map(([key, val]) => (
            <div
              key={key}
              onClick={() => onThemeChange(key)}
              style={{
                cursor: 'pointer', padding: '3px 8px', marginBottom: 1,
                background: currentTheme === key ? t.bg3 : 'transparent',
                color: currentTheme === key ? t.accent : t.fg3,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span style={{
                display: 'inline-block', width: 8, height: 8,
                background: val.accent,
              }}/>
              {val.name}
            </div>
          ))}
        </div>
      </BtopBox>
    </div>
  );
}

export function App() {
  const [themeKey, setThemeKey] = React.useState(TWEAK_DEFAULTS.theme || 'gruvbox-dark');
  const [tweaksVisible, setTweaksVisible] = React.useState(false);
  const theme = THEMES[themeKey] || THEMES['gruvbox-dark'];

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const handleThemeChange = (key) => {
    setThemeKey(key);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: key } }, '*');
  };

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--bg', theme.bg);
    r.setProperty('--fg', theme.fg);
    r.setProperty('--fg-dim', theme.fgDim);
    r.setProperty('--mono', `"${TWEAK_DEFAULTS.monoFont}", "JetBrains Mono", monospace`);
    r.setProperty('--serif', `"${TWEAK_DEFAULTS.serifFont}", "Computer Modern Serif", serif`);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.fg;
  }, [theme]);

  return (
    <ThemeCtx.Provider value={theme}>
      <WelcomeSection />
      <BottomTile />
      <TweaksPanel visible={tweaksVisible} currentTheme={themeKey} onThemeChange={handleThemeChange} />
    </ThemeCtx.Provider>
  );
}
