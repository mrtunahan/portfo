


import React from 'react';

// animations.jsx
// Reusable animation starter: Stage, Timeline, Sprite, easing helpers.
// Usage (in an HTML file that loads React + Babel):
//
//   <Stage width={1280} height={720} duration={10} background="#f6f4ef">
//     <MyScene />
//   </Stage>
//
// Inside <Stage>, any child can call useTime() to read the current
// playhead (seconds). Or wrap content in <Sprite start={1} end={4}>...</Sprite>
// to only render during that window -- children receive a `localTime` and
// `progress` via the useSprite() hook.
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: (t) => t,

  // Quad
  easeInQuad:    (t) => t * t,
  easeOutQuad:   (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic:    (t) => t * t * t,
  easeOutCubic:   (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quart
  easeInQuart:    (t) => t * t * t * t,
  easeOutQuart:   (t) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  // Expo
  easeInExpo:  (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },

  // Sine
  easeInSine:    (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine:   (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // Back (overshoot)
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // Elastic
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return (t) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({ from = 0, to = 1, start = 0, end = 1, ease = Easing.easeInOutCubic }) {
  return (t) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({ time: 0, duration: 10, playing: false });

const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// ── Sprite ──────────────────────────────────────────────────────────────────
// Renders children only when the playhead is inside [start, end]. Provides
// a sub-context with `localTime` (seconds since start) and `progress` (0..1).
//
//   <Sprite start={2} end={5}>
//     {({ localTime, progress }) => <Thing x={progress * 100} />}
//   </Sprite>
//
// Or as a plain wrapper — children can call useSprite() themselves.

const SpriteContext = React.createContext({ localTime: 0, progress: 0, duration: 0 });
const useSprite = () => React.useContext(SpriteContext);

function Sprite({ start = 0, end = Infinity, children, keepMounted = false }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress = duration > 0 && isFinite(duration)
    ? clamp(localTime / duration, 0, 1)
    : 0;

  const value = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Sample sprite components ────────────────────────────────────────────────

// TextSprite: fades/slides text in on entry, holds, then fades out on exit.
// Props: text, x, y, size, color, font, entryDur, exitDur, align
function TextSprite({
  text,
  x = 0, y = 0,
  size = 48,
  color = '#111',
  font = 'Inter, system-ui, sans-serif',
  weight = 600,
  entryDur = 0.45,
  exitDur = 0.35,
  entryEase = Easing.easeOutBack,
  exitEase = Easing.easeInCubic,
  align = 'left',
  letterSpacing = '-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let ty = 0;

  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    ty = (1 - t) * 16;
  } else if (localTime > exitStart) {
    const t = exitEase(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    ty = -t * 8;
  }

  const translateX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(${translateX}, ${ty}px)`,
      opacity,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing,
      whiteSpace: 'pre',
      lineHeight: 1.1,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ImageSprite: scales + fades in; optional Ken Burns drift during hold.
function ImageSprite({
  src,
  x = 0, y = 0,
  width = 400, height = 300,
  entryDur = 0.6,
  exitDur = 0.4,
  kenBurns = false,
  kenBurnsScale = 1.08,
  radius = 12,
  fit = 'cover',
  placeholder = null, // {label: string} for striped placeholder
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime / entryDur, 0, 1));
    opacity = t;
    scale = 0.96 + 0.04 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInCubic(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = (kenBurns ? kenBurnsScale : 1) + 0.02 * t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime - entryDur) / holdSpan : 0;
    scale = 1 + (kenBurnsScale - 1) * holdT;
  }

  const content = placeholder ? (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'repeating-linear-gradient(135deg, #e9e6df 0 10px, #dcd8cf 10px 20px)',
      color: '#6b6458',
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 13,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
  );

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      borderRadius: radius,
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }}>
      {content}
    </div>
  );
}

// RectSprite: simple rectangle that animates position/size/color via props.
// Useful demo primitive — takes a `render` fn for per-frame customization.
function RectSprite({
  x = 0, y = 0,
  width = 100, height = 100,
  color = '#111',
  radius = 8,
  entryDur = 0.4,
  exitDur = 0.3,
  render, // optional: (ctx) => style overrides
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);

  let opacity = 1;
  let scale = 1;

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime / entryDur, 0, 1));
    opacity = clamp(localTime / entryDur, 0, 1);
    scale = 0.4 + 0.6 * t;
  } else if (localTime > exitStart) {
    const t = Easing.easeInQuad(clamp((localTime - exitStart) / exitDur, 0, 1));
    opacity = 1 - t;
    scale = 1 - 0.15 * t;
  }

  const overrides = render ? render(spriteCtx) : {};

  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width, height,
      background: color,
      borderRadius: radius,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      willChange: 'transform, opacity',
      ...overrides,
    }} />
  );
}


function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  persistKey = 'animstage',
  children,
}) {
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);

  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try { localStorage.setItem(persistKey + ':t', String(time)); } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(
        el.clientWidth / width,
        (el.clientHeight - barH) / height
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { next = duration; setPlaying(false); }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = React.useMemo(
    () => ({ time: displayTime, duration, playing, setTime, setPlaying }),
    [displayTime, duration, playing]
  );

  return (
    <div
      ref={stageRef}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Canvas area — vertically centered in remaining space */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        <div
          ref={canvasRef}
          style={{
            width, height,
            background,
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            flexShrink: 0,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

      {/* Playback bar — stacked below canvas, never overlapping */}
      <PlaybackBar
        time={displayTime}
        actualTime={time}
        duration={duration}
        playing={playing}
        onPlayPause={() => setPlaying(p => !p)}
        onReset={() => { setTime(0); }}
        onSeek={(t) => setTime(t)}
        onHover={(t) => setHoverTime(t)}
      />
    </div>
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const timeFromEvent = React.useCallback((e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);

  const onTrackMove = (e) => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };

  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };

  const onTrackDown = (e) => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e) => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor((total * 100) % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',

      borderRadius: 8,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0,
    }}>
      <IconButton onClick={onReset} title="Return to start (0)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title="Play/pause (space)">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
          </svg>
        )}
      </IconButton>

      {/* Current time: fixed width so it doesn't thrash */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'right',
        color: '#f6f4ef',
      }}>
        {fmt(time)}
      </div>

      {/* Scrub track */}
      <div
        ref={trackRef}
        onMouseMove={onTrackMove}
        onMouseLeave={onTrackLeave}
        onMouseDown={onTrackDown}
        style={{
          flex: 1,
          height: 22,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 4,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: 0, width: `${pct}%`, height: 4,
          background: 'oklch(72% 0.12 250)',
          borderRadius: 2,
        }}/>
        <div style={{
          position: 'absolute',
          left: `${pct}%`, top: '50%',
          width: 12, height: 12,
          marginLeft: -6, marginTop: -6,
          background: '#fff',
          borderRadius: 6,
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}/>
      </div>

      {/* Duration: fixed width */}
      <div style={{
        fontFamily: mono,
        fontSize: 12,
        fontVariantNumeric: 'tabular-nums',
        width: 64, textAlign: 'left',
        color: 'rgba(246,244,239,0.55)',
      }}>
        {fmt(duration)}
      </div>
    </div>
  );
}

function IconButton({ children, onClick, title }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        color: '#f6f4ef',
        cursor: 'pointer',
        padding: 0,
        transition: 'background 120ms',
      }}
    >
      {children}
    </button>
  );
}


Object.assign(window, {
  Easing, interpolate, animate, clamp,
  TimelineContext, useTime, useTimeline,
  Sprite, SpriteContext, useSprite,
  TextSprite, ImageSprite, RectSprite,
  Stage, PlaybackBar,
});

/* ══════════════════════════════════════════════════════════════════════
   Offline Asistan — Full Demo  (7 sahne, 60 s)
   Palette: #00b4d8 primary, #03045e bg, #0077b6 dark, #48cae4 accent
   ══════════════════════════════════════════════════════════════════════ */

const P   = '#00b4d8';
const PDK = '#0077b6';
const PAC = '#48cae4';
const BG2 = '#030d1a';
const SUC = '#4ade80';
const WRN = '#fbbf24';
const PRP = '#7c3aed';
const TXT = '#1e293b';
const SFT = '#64748b';
const GRY = '#f0f4ff';
const GRID_C = 'rgba(0,180,216,0.06)';

/* ── Animated background ─────────────────────────────────────────── */
function ABg() {
  return (
    <>
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(circle at 18% 20%, rgba(0,180,216,0.20) 0%, transparent 32%),' +
                   'radial-gradient(circle at 84% 16%, rgba(0,119,182,0.16) 0%, transparent 28%),' +
                   'radial-gradient(circle at 50% 88%, rgba(72,202,228,0.11) 0%, transparent 34%),' +
                   'linear-gradient(180deg,#040f24 0%,#030d1a 100%)',
      }}/>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(${GRID_C} 1px,transparent 1px),linear-gradient(90deg,${GRID_C} 1px,transparent 1px)`,
        backgroundSize:'56px 56px',
      }}/>
    </>
  );
}

/* ── Glow orb ────────────────────────────────────────────────────── */
function Orb({ x, y, size, color, delay=0 }) {
  const { localTime, duration } = useSprite();
  const exit = Math.max(0, duration - 0.5);
  const enter = clamp((localTime - delay) / 0.8, 0, 1);
  const fade  = 1 - clamp((localTime - exit) / 0.45, 0, 1);
  const pulse = 0.93 + Math.sin((localTime + delay) * 2.3) * 0.06;
  return (
    <div style={{
      position:'absolute', left:x, top:y, width:size, height:size,
      borderRadius:'50%',
      background:`radial-gradient(circle,${color}55 0%,${color}0d 55%,transparent 70%)`,
      filter:'blur(12px)',
      opacity:enter * fade, transform:`scale(${pulse})`,
    }}/>
  );
}

/* ── Browser frame ───────────────────────────────────────────────── */
function Browser({ x, y, w=480, h=330, delay=0, children }) {
  const { localTime, duration } = useSprite();
  const exit = Math.max(0, duration - 0.6);
  const t  = Easing.easeOutCubic(clamp((localTime - delay) / 0.55, 0, 1));
  const et = clamp((localTime - exit) / 0.45, 0, 1);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      width:w, height:h + 32,
      borderRadius:12, overflow:'hidden',
      boxShadow:'0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(0,180,216,0.22)',
      opacity:t * (1 - et), transform:`translateY(${(1-t)*30}px)`,
    }}>
      <div style={{
        height:32, background:'#0d1b2a',
        display:'flex', alignItems:'center', padding:'0 12px', gap:6,
        borderBottom:'1px solid rgba(0,180,216,0.14)',
      }}>
        {['#ef4444','#fbbf24','#4ade80'].map(c => (
          <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
        ))}
        <div style={{
          flex:1, marginLeft:8, background:'rgba(0,180,216,0.07)',
          border:'1px solid rgba(0,180,216,0.14)', borderRadius:4,
          padding:'3px 10px', fontSize:9, color:'rgba(200,230,255,0.45)',
        }}>offlineasistan.com.tr</div>
      </div>
      <div style={{ position:'relative', width:w, height:h, overflow:'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ── Sidebar helper ──────────────────────────────────────────────── */
function Sidebar({ active=0 }) {
  const items = ['Dashboard','Erasmus','Staj','Sınav Prog.','Muafiyet','Ayarlar'];
  return (
    <div style={{ width:138, background:'#03045e', padding:'16px 0', display:'flex', flexDirection:'column', gap:2, flexShrink:0 }}>
      <div style={{ padding:'0 14px 16px', color:'#fff', fontWeight:800, fontSize:14, lineHeight:1.3 }}>
        Offline<br/><span style={{ color:P }}>Asistan</span>
      </div>
      {items.map((item,i) => (
        <div key={item} style={{
          padding:'8px 14px', fontSize:11,
          fontWeight: i===active ? 700 : 500,
          color: i===active ? '#fff' : 'rgba(255,255,255,0.5)',
          background: i===active ? 'rgba(0,180,216,0.2)' : 'transparent',
          borderLeft: i===active ? `3px solid ${P}` : '3px solid transparent',
        }}>{item}</div>
      ))}
    </div>
  );
}

/* ── Screen: Dashboard ───────────────────────────────────────────── */
function DashScreen() {
  const { localTime } = useSprite();
  const cards = [
    { label:'Erasmus Başvurusu', val:'24', color:P,   sub:'+3 bu hafta' },
    { label:'Aktif Staj',        val:'58', color:PRP, sub:'+12 bu hafta' },
    { label:'Sınav Programı',    val:'142',color:WRN, sub:'Güncellendi' },
    { label:'Muafiyet Talebi',   val:'37', color:SUC, sub:'+5 bu hafta' },
  ];
  const acts = [
    { user:'Ali K.',   act:'Erasmus başvurusu gönderildi', ago:'2 dk',  dot:P   },
    { user:'Selin A.', act:'Staj defteri onaylandı',       ago:'5 dk',  dot:SUC },
    { user:'Mert Y.',  act:'Muafiyet talebi oluşturuldu',  ago:'11 dk', dot:WRN },
  ];
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:'sans-serif' }}>
      <Sidebar active={0}/>
      <div style={{ flex:1, padding:16, background:GRY, overflow:'hidden' }}>
        <div style={{ fontSize:15, fontWeight:800, color:'#03045e', marginBottom:12 }}>Genel Bakış</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          {cards.map((c,i) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.15 - i*0.12)/0.5, 0, 1));
            return (
              <div key={c.label} style={{
                background:'#fff', borderRadius:10, padding:'10px 12px',
                boxShadow:'0 3px 10px rgba(0,0,0,0.06)',
                borderLeft:`3px solid ${c.color}`,
                opacity:op, transform:`translateY(${(1-op)*12}px)`,
              }}>
                <div style={{ fontSize:9, color:SFT, fontWeight:600, marginBottom:3 }}>{c.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:c.color }}>{c.val}</div>
                <div style={{ fontSize:9, color:'#9ca3af', marginTop:2 }}>{c.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:TXT, marginBottom:6 }}>Son Aktiviteler</div>
        {acts.map((a,i) => {
          const op = Easing.easeOutCubic(clamp((localTime - 0.7 - i*0.15)/0.4, 0, 1));
          return (
            <div key={i} style={{
              display:'flex', gap:8, alignItems:'center',
              padding:'5px 0', borderBottom:'1px solid #f3f4f6',
              opacity:op,
            }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:a.dot, flexShrink:0 }}/>
              <span style={{ flex:1, fontSize:10, color:SFT }}>
                <b style={{ color:TXT }}>{a.user}</b> — {a.act}
              </span>
              <span style={{ fontSize:9, color:'#9ca3af' }}>{a.ago}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Screen: Erasmus ─────────────────────────────────────────────── */
function ErasmusScreen() {
  const { localTime } = useSprite();
  const steps = ['Başvuru','Belge','Danışman','Dekanlık','Rektörlük','Tamam'];
  const active = Math.min(5, Math.floor(localTime * 1.2));
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:'sans-serif' }}>
      <Sidebar active={1}/>
      <div style={{ flex:1, padding:16, background:GRY, overflow:'hidden' }}>
        <div style={{ fontSize:15, fontWeight:800, color:'#03045e', marginBottom:10 }}>Erasmus Başvuru Takibi</div>
        {/* Stepper */}
        <div style={{ display:'flex', alignItems:'flex-start', marginBottom:12 }}>
          {steps.map((s,i) => (
            <React.Fragment key={s}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                <div style={{
                  width:20, height:20, borderRadius:'50%',
                  background: i <= active ? P : '#dde1ea',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:9, color:'#fff', fontWeight:800, transition:'background 300ms',
                }}>{i < active ? '✓' : i+1}</div>
                <div style={{ fontSize:7, color: i <= active ? '#03045e' : '#9ca3af', fontWeight:600, textAlign:'center', width:46 }}>{s}</div>
              </div>
              {i < steps.length-1 && (
                <div style={{ flex:1, height:2, background: i < active ? P : '#dde1ea', marginTop:9, transition:'background 300ms' }}/>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Form */}
        <div style={{ background:'#fff', borderRadius:10, padding:12, boxShadow:'0 3px 10px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:TXT, marginBottom:8 }}>Başvuru Bilgileri</div>
          {[['Öğrenci No','20190001'],['Hedef Üniversite','Erasmus Partner Uni'],['Program','Bilgisayar Müh.'],['Dönem','2026 Güz']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <div style={{ fontSize:9, color:SFT, width:110, fontWeight:600, paddingTop:2 }}>{k}</div>
              <div style={{ flex:1, background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:4, padding:'3px 8px', fontSize:10, color:TXT }}>{v}</div>
            </div>
          ))}
          <button style={{
            marginTop:4, width:'100%', padding:'8px 0',
            background:`linear-gradient(90deg,${PDK},${P})`,
            color:'#fff', border:'none', borderRadius:6, fontSize:10, fontWeight:700,
          }}>Belgelerimi Gönder</button>
        </div>
      </div>
    </div>
  );
}

/* ── Screen: Staj ────────────────────────────────────────────────── */
function StajScreen() {
  const { localTime } = useSprite();
  const entries = [
    { date:'19 May', title:'Proje toplantısına katıldım',   h:8, ok:true  },
    { date:'20 May', title:'API entegrasyonu tamamlandı',   h:9, ok:true  },
    { date:'21 May', title:'Test ortamı kurulumu yapıldı',  h:7, ok:false },
  ];
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:'sans-serif' }}>
      <Sidebar active={2}/>
      <div style={{ flex:1, padding:16, background:GRY, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#03045e' }}>Staj Defteri</div>
          <div style={{ fontSize:9, background:P, color:'#fff', borderRadius:10, padding:'3px 10px', fontWeight:700 }}>Aktif Staj</div>
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          {[['42','Toplam Saat'],['3','Onaylı Gün'],['92%','Devam']].map(([v,l]) => (
            <div key={l} style={{ flex:1, background:'#fff', borderRadius:8, padding:'8px 6px', textAlign:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:16, fontWeight:800, color:PDK }}>{v}</div>
              <div style={{ fontSize:8, color:SFT, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:TXT, marginBottom:6 }}>Günlük Girişler</div>
        {entries.map((e,i) => {
          const op = Easing.easeOutCubic(clamp((localTime - 0.25 - i*0.2)/0.5, 0, 1));
          return (
            <div key={i} style={{
              display:'flex', gap:8, background:'#fff', borderRadius:8, padding:'8px 10px', marginBottom:5,
              boxShadow:'0 2px 6px rgba(0,0,0,0.04)', borderLeft:`3px solid ${e.ok ? SUC : WRN}`,
              opacity:op, transform:`translateX(${(1-op)*18}px)`,
            }}>
              <div style={{ fontSize:9, color:SFT, fontWeight:700, width:36 }}>{e.date}</div>
              <div style={{ flex:1, fontSize:10, color:TXT }}>{e.title}</div>
              <div style={{ fontSize:9, color:'#9ca3af' }}>{e.h}s</div>
              <div style={{ fontSize:9, color: e.ok ? SUC : WRN, fontWeight:700 }}>{e.ok ? 'Onaylı' : 'Bekliyor'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Screen: Sınav Programı ──────────────────────────────────────── */
function SinavScreen() {
  const { localTime } = useSprite();
  const rows = [
    { code:'CS301', name:'Veri Yapıları',  date:'26 May', time:'09:00', room:'A101', type:'Vize',  tc:WRN      },
    { code:'CS402', name:'Yapay Zekâ',     date:'28 May', time:'13:30', room:'B204', type:'Final', tc:'#ef4444' },
    { code:'MATH2', name:'Sayısal Analiz', date:'30 May', time:'10:00', room:'C102', type:'Vize',  tc:WRN      },
    { code:'CS310', name:'Ağ Güvenliği',   date:'02 Haz', time:'14:00', room:'A203', type:'Final', tc:'#ef4444' },
  ];
  return (
    <div style={{ display:'flex', height:'100%', fontFamily:'sans-serif' }}>
      <Sidebar active={3}/>
      <div style={{ flex:1, padding:16, background:GRY, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#03045e' }}>Sınav Programı</div>
          <div style={{ fontSize:9, color:SFT }}>Mayıs – Haziran 2026</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {rows.map((r,i) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.2 - i*0.14)/0.5, 0, 1));
            return (
              <div key={r.code} style={{
                display:'flex', gap:10, alignItems:'center',
                background:'#fff', borderRadius:8, padding:'8px 12px',
                boxShadow:'0 2px 6px rgba(0,0,0,0.05)', borderLeft:`3px solid ${r.tc}`,
                opacity:op, transform:`translateY(${(1-op)*14}px)`,
              }}>
                <div style={{ width:48 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:TXT }}>{r.date}</div>
                  <div style={{ fontSize:9, color:SFT }}>{r.time}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:TXT }}>{r.name}</div>
                  <div style={{ fontSize:9, color:'#9ca3af' }}>{r.code} · {r.room}</div>
                </div>
                <div style={{
                  fontSize:8, fontWeight:700, color:'#fff',
                  background:r.tc, borderRadius:4, padding:'2px 7px',
                }}>{r.type}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Feature card (floating callout) ────────────────────────────── */
function FCard({ x, y, title, body, accent=P, delay=0 }) {
  const { localTime, duration } = useSprite();
  const exit = Math.max(0, duration - 0.5);
  const t  = Easing.easeOutBack(clamp((localTime - delay) / 0.55, 0, 1));
  const et = clamp((localTime - exit) / 0.4, 0, 1);
  const op = (localTime > delay ? clamp((localTime - delay)/0.3, 0, 1) : 0) * (1 - et);
  return (
    <div style={{
      position:'absolute', left:x, top:y, width:210,
      padding:'12px 14px',
      background:'rgba(3,4,30,0.86)',
      border:`1px solid ${accent}44`,
      borderRadius:12,
      boxShadow:`0 14px 34px ${accent}1a`,
      opacity:op, transform:`translateY(${(1-t)*22}px)`,
    }}>
      <div style={{ color:'#e8f4ff', fontSize:12, fontWeight:800, marginBottom:5 }}>{title}</div>
      <div style={{ color:'rgba(200,230,255,0.62)', fontSize:11, lineHeight:1.5 }}>{body}</div>
    </div>
  );
}

/* ── Tech chip ───────────────────────────────────────────────────── */
function TChip({ x, y, label, color, delay }) {
  const { localTime, duration } = useSprite();
  const exit = Math.max(0, duration - 0.5);
  const t  = Easing.easeOutElastic(clamp((localTime - delay) / 0.7, 0, 1));
  const et = clamp((localTime - exit) / 0.4, 0, 1);
  const sc = localTime > delay ? 0.6 + t * 0.4 : 0;
  const op = (localTime > delay ? clamp((localTime - delay)/0.3, 0, 1) : 0) * (1 - et);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      padding:'7px 14px',
      background:`${color}18`,
      border:`1.5px solid ${color}66`,
      borderRadius:20,
      fontSize:11, fontWeight:700, color,
      opacity:op, transform:`scale(${sc})`,
      whiteSpace:'nowrap',
    }}>{label}</div>
  );
}

/* ── Live pill ───────────────────────────────────────────────────── */
function LivePill({ x, y, delay=0 }) {
  const { localTime, duration } = useSprite();
  const exit = Math.max(0, duration - 0.5);
  const t  = Easing.easeOutBack(clamp((localTime - delay) / 0.6, 0, 1));
  const et = clamp((localTime - exit) / 0.4, 0, 1);
  const op = (localTime > delay ? clamp((localTime - delay)/0.3, 0, 1) : 0) * (1 - et);
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      display:'flex', alignItems:'center', gap:6,
      padding:'6px 14px',
      background:'rgba(74,222,128,0.12)',
      border:'1.5px solid rgba(74,222,128,0.4)',
      borderRadius:20,
      opacity:op, transform:`scale(${0.7 + t*0.3})`,
    }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:SUC }}/>
      <span style={{ fontSize:10, fontWeight:700, color:SUC }}>CANLI — offlineasistan.com.tr</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DEFAULT EXPORT
   ══════════════════════════════════════════════════════════════════ */
export default function OfflineAsistanDemo() {
  return (
    <Stage
      width={960} height={540}
      duration={60} background={BG2}
      loop={false} autoplay
      persistKey="offline-asistan-demo"
    >

      {/* 1 · Hero — 0 → 8 */}
      <Sprite start={0} end={8}>
        <ABg/>
        <Orb x={80}  y={60}  size={320} color={P}   delay={0}   />
        <Orb x={680} y={220} size={280} color={PDK} delay={0.3} />
        <TextSprite text="Offline Asistan"
          x={480} y={130} size={54} color={P}
          align="center" weight={800} letterSpacing="0.03em"
          entryDur={0.5} exitDur={0.4} />
        <TextSprite text="Üniversite Belge Süreçleri Otomasyonu"
          x={480} y={204} size={18} color="rgba(200,230,255,0.75)"
          align="center" weight={500} entryDur={0.6} exitDur={0.4} />
        <TextSprite text="Erasmus · Staj · Sınav Programı · Muafiyet"
          x={480} y={246} size={13} color="rgba(0,180,216,0.62)"
          align="center" weight={600} entryDur={0.7} exitDur={0.4} />
        <LivePill x={364} y={294} delay={0.85} />
        <TextSprite text="React · Vite · Node.js · Express · MongoDB · Socket.IO"
          x={480} y={374} size={12} color="rgba(200,230,255,0.32)"
          align="center" entryDur={1.0} exitDur={0.4} />
      </Sprite>

      {/* 2 · Dashboard — 7.5 → 16 */}
      <Sprite start={7.5} end={16}>
        <ABg/>
        <Orb x={700} y={40}  size={260} color={P}   delay={0}   />
        <Orb x={40}  y={290} size={220} color={PRP} delay={0.2} />
        <TextSprite text="Merkezi Kontrol Paneli"
          x={480} y={36} size={22} color={P}
          align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />
        <Browser x={232} y={62} w={496} h={336} delay={0.3}>
          <DashScreen/>
        </Browser>
        <FCard x={12} y={150} delay={0.7} accent={P}
          title="Anlık İstatistikler"
          body="Erasmus, staj, sınav ve muafiyet süreçleri tek ekranda özet."
        />
        <FCard x={738} y={150} delay={0.9} accent={PRP}
          title="Gerçek Zamanlı"
          body="Socket.IO ile canlı güncelleme; bildirimler sayfayı yenilemeden gelir."
        />
      </Sprite>

      {/* 3 · Erasmus — 15.5 → 24 */}
      <Sprite start={15.5} end={24}>
        <ABg/>
        <Orb x={780} y={50}  size={250} color={P}   delay={0}   />
        <Orb x={30}  y={300} size={200} color={PAC} delay={0.2} />
        <TextSprite text="Erasmus Başvuru Takibi"
          x={480} y={36} size={22} color={P}
          align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />
        <Browser x={232} y={62} w={496} h={336} delay={0.3}>
          <ErasmusScreen/>
        </Browser>
        <FCard x={12} y={130} delay={0.7} accent={P}
          title="Adım Adım Takip"
          body="Başvurudan onaya her aşama görsel zaman çizelgesiyle izlenir."
        />
        <FCard x={738} y={130} delay={0.9} accent={WRN}
          title="Belge Yönetimi"
          body="Gerekli belgeler otomatik listelenir; eksikler anında uyarılır."
        />
        <FCard x={738} y={300} delay={1.1} accent={SUC}
          title="Çok Kademeli Onay"
          body="Danışman → Dekanlık → Rektörlük zinciri otomatik yönlendirilir."
        />
      </Sprite>

      {/* 4 · Staj — 23.5 → 32 */}
      <Sprite start={23.5} end={32}>
        <ABg/>
        <Orb x={40}  y={40}  size={250} color={PRP} delay={0}   />
        <Orb x={740} y={260} size={210} color={P}   delay={0.2} />
        <TextSprite text="Staj Yönetimi"
          x={480} y={36} size={22} color={P}
          align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />
        <Browser x={232} y={62} w={496} h={336} delay={0.3}>
          <StajScreen/>
        </Browser>
        <FCard x={12} y={140} delay={0.7} accent={PRP}
          title="Dijital Staj Defteri"
          body="Günlük giriş, saat takibi ve danışman onayı tek platformda."
        />
        <FCard x={738} y={200} delay={0.9} accent={SUC}
          title="Devam Takibi"
          body="Devam yüzdesi ve eksik günler otomatik hesaplanır, bildirim gider."
        />
      </Sprite>

      {/* 5 · Sınav Programı — 31.5 → 40 */}
      <Sprite start={31.5} end={40}>
        <ABg/>
        <Orb x={790} y={90}  size={260} color={WRN} delay={0}   />
        <Orb x={30}  y={260} size={200} color={P}   delay={0.2} />
        <TextSprite text="Sınav Programı"
          x={480} y={36} size={22} color={P}
          align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />
        <Browser x={232} y={62} w={496} h={336} delay={0.3}>
          <SinavScreen/>
        </Browser>
        <FCard x={12} y={140} delay={0.7} accent={WRN}
          title="Otomatik Program"
          body="Bölüm veritabanından sınav takvimi, çakışma kontrolü dahil."
        />
        <FCard x={738} y={200} delay={0.9} accent={P}
          title="Kişisel Takvim"
          body="Sınavlar tek tıkla Google / Apple takvimine aktarılabilir."
        />
      </Sprite>

      {/* 6 · Teknoloji Yığını — 39.5 → 50 */}
      <Sprite start={39.5} end={50}>
        <ABg/>
        <Orb x={380} y={180} size={420} color={P} delay={0} />
        <TextSprite text="Teknoloji Yığını"
          x={480} y={36} size={22} color={P}
          align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />

        <TextSprite text="Frontend"
          x={480} y={114} size={13} color="rgba(200,230,255,0.42)"
          align="center" entryDur={0.5} exitDur={0.4} />
        <TChip x={118} y={132} label="React"        color={P}       delay={0.4} />
        <TChip x={252} y={132} label="Vite"         color={PAC}     delay={0.5} />
        <TChip x={358} y={132} label="Tailwind CSS" color="#38bdf8" delay={0.6} />
        <TChip x={528} y={132} label="Socket.IO UI" color="#e879f9" delay={0.7} />

        <TextSprite text="Backend"
          x={480} y={210} size={13} color="rgba(200,230,255,0.42)"
          align="center" entryDur={0.6} exitDur={0.4} />
        <TChip x={118} y={228} label="Node.js"  color={SUC}     delay={0.6} />
        <TChip x={252} y={228} label="Express"  color="#94a3b8" delay={0.7} />
        <TChip x={380} y={228} label="Socket.IO" color="#e879f9" delay={0.8} />
        <TChip x={514} y={228} label="JWT Auth" color={WRN}     delay={0.9} />

        <TextSprite text="Veritabanı & Altyapı"
          x={480} y={306} size={13} color="rgba(200,230,255,0.42)"
          align="center" entryDur={0.7} exitDur={0.4} />
        <TChip x={182} y={324} label="MongoDB"  color="#4ade80" delay={0.8} />
        <TChip x={332} y={324} label="Mongoose" color="#fb923c" delay={0.9} />
        <TChip x={476} y={324} label="Nginx"    color="#22d3ee" delay={1.0} />

        <TextSprite text="React · Vite · Node.js · Express · MongoDB · Socket.IO"
          x={480} y={406} size={11} color="rgba(200,230,255,0.25)"
          align="center" entryDur={1.1} exitDur={0.4} />
      </Sprite>

      {/* 7 · Kapanış — 49.5 → 60 */}
      <Sprite start={49.5} end={60}>
        <ABg/>
        <Orb x={70}  y={70}  size={360} color={P}   delay={0}   />
        <Orb x={610} y={260} size={270} color={PDK} delay={0.3} />
        <TextSprite text="Offline Asistan"
          x={480} y={140} size={54} color={P}
          align="center" weight={800} letterSpacing="0.03em"
          entryDur={0.5} exitDur={0.5} />
        <TextSprite text="Üniversite süreçlerini dijitalleştiren Full-Stack platform"
          x={480} y={214} size={16} color="rgba(200,230,255,0.7)"
          align="center" weight={500} entryDur={0.6} exitDur={0.5} />
        <LivePill x={364} y={262} delay={0.75} />
        <TextSprite text="Erasmus · Staj · Sınav Programı · Muafiyet"
          x={480} y={358} size={13} color="rgba(0,180,216,0.52)"
          align="center" entryDur={0.95} exitDur={0.5} />
      </Sprite>

    </Stage>
  );
}


