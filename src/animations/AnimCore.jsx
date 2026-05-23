import {
  useState, useEffect, useMemo, useRef,
  useContext, useCallback, createContext,
} from 'react';

/* ─── Easing ─── */
export const Easing = {
  linear:        t => t,

  easeInQuad:    t => t * t,
  easeOutQuad:   t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,

  easeInCubic:    t => t*t*t,
  easeOutCubic:   t => (--t)*t*t+1,
  easeInOutCubic: t => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,

  easeInQuart:    t => t*t*t*t,
  easeOutQuart:   t => 1-(--t)*t*t*t,
  easeInOutQuart: t => t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,

  easeInExpo:    t => t===0 ? 0 : Math.pow(2, 10*(t-1)),
  easeOutExpo:   t => t===1 ? 1 : 1 - Math.pow(2,-10*t),
  easeInOutExpo: t => {
    if (t===0) return 0; if (t===1) return 1;
    if (t<0.5) return 0.5*Math.pow(2,20*t-10);
    return 1 - 0.5*Math.pow(2,-20*t+10);
  },

  easeInSine:    t => 1-Math.cos(t*Math.PI/2),
  easeOutSine:   t => Math.sin(t*Math.PI/2),
  easeInOutSine: t => -(Math.cos(Math.PI*t)-1)/2,

  easeOutBack: t => {
    const c1=1.70158, c3=c1+1;
    return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2);
  },
  easeInBack: t => {
    const c1=1.70158, c3=c1+1;
    return c3*t*t*t - c1*t*t;
  },
  easeInOutBack: t => {
    const c1=1.70158, c2=c1*1.525;
    return t < 0.5
      ? (Math.pow(2*t,2)*((c2+1)*2*t - c2)) / 2
      : (Math.pow(2*t-2,2)*((c2+1)*(t*2-2) + c2) + 2) / 2;
  },

  easeOutElastic: t => {
    const c4=(2*Math.PI)/3;
    if (t===0) return 0; if (t===1) return 1;
    return Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1;
  },
};

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Multi-keyframe interpolation (Popmotion-style)
export function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length-1]) return output[output.length-1];
    for (let i = 0; i < input.length-1; i++) {
      if (t >= input[i] && t <= input[i+1]) {
        const span = input[i+1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? (ease[i] || Easing.linear) : ease;
        return output[i] + (output[i+1] - output[i]) * easeFn(local);
      }
    }
    return output[output.length-1];
  };
}

// Single-segment tween
export function animate({ from=0, to=1, start=0, end=1, ease=Easing.easeInOutCubic }={}) {
  return t => {
    if (t <= start) return from;
    if (t >= end)   return to;
    return from + (to-from) * ease((t-start)/(end-start));
  };
}

/* ─── Timeline Context ─── */
export const TimelineContext = createContext({ time:0, duration:10, playing:false });
export const useTime     = () => useContext(TimelineContext).time;
export const useTimeline = () => useContext(TimelineContext);

/* ─── Sprite Context ─── */
export const SpriteContext = createContext({ localTime:0, progress:0, duration:0, visible:true });
export const useSprite = () => useContext(SpriteContext);

export function Sprite({ start=0, end=Infinity, children, keepMounted=false }) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;
  const dur       = isFinite(end) ? end - start : Infinity;
  const localTime = Math.max(0, time - start);
  const progress  = dur>0 && isFinite(dur) ? clamp(localTime/dur,0,1) : 0;
  const value = { localTime, progress, duration:dur, visible };
  return (
    <SpriteContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </SpriteContext.Provider>
  );
}

/* ─── TextSprite ─── */
export function TextSprite({
  text, x=0, y=0, size=48, color='#111',
  font='Inter, system-ui, sans-serif', weight=600,
  entryDur=0.45, exitDur=0.35,
  entryEase=Easing.easeOutBack, exitEase=Easing.easeInCubic,
  align='left', letterSpacing='-0.01em',
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity=1, ty=0;
  if (localTime < entryDur) {
    const t = entryEase(clamp(localTime/entryDur,0,1));
    opacity=t; ty=(1-t)*16;
  } else if (localTime > exitStart && isFinite(duration)) {
    const t = exitEase(clamp((localTime-exitStart)/exitDur,0,1));
    opacity=1-t; ty=-t*8;
  }
  const translateX = align==='center' ? '-50%' : align==='right' ? '-100%' : '0';
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      transform:`translate(${translateX},${ty}px)`,
      opacity, fontFamily:font, fontSize:size, fontWeight:weight,
      color, letterSpacing, whiteSpace:'pre', lineHeight:1.1,
      willChange:'transform,opacity', pointerEvents:'none',
    }}>
      {text}
    </div>
  );
}

/* ─── ImageSprite ─── */
export function ImageSprite({
  src,
  x=0, y=0, width=400, height=300,
  entryDur=0.6, exitDur=0.4,
  kenBurns=false, kenBurnsScale=1.08,
  radius=12, fit='cover',
  placeholder=null,
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - exitDur);
  let opacity=1, scale=1;

  if (localTime < entryDur) {
    const t = Easing.easeOutCubic(clamp(localTime/entryDur,0,1));
    opacity=t; scale=0.96+0.04*t;
  } else if (localTime > exitStart && isFinite(duration)) {
    const t = Easing.easeInCubic(clamp((localTime-exitStart)/exitDur,0,1));
    opacity=1-t;
    scale=(kenBurns ? kenBurnsScale : 1)+0.02*t;
  } else if (kenBurns) {
    const holdSpan = exitStart - entryDur;
    const holdT = holdSpan > 0 ? (localTime-entryDur)/holdSpan : 0;
    scale=1+(kenBurnsScale-1)*holdT;
  }

  const content = placeholder ? (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'repeating-linear-gradient(135deg,#e9e6df 0 10px,#dcd8cf 10px 20px)',
      color:'#6b6458',
      fontFamily:'"JetBrains Mono",ui-monospace,monospace',
      fontSize:13, letterSpacing:'0.04em', textTransform:'uppercase',
    }}>
      {placeholder.label || 'image'}
    </div>
  ) : (
    <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:fit, display:'block' }} />
  );

  return (
    <div style={{
      position:'absolute', left:x, top:y, width, height,
      opacity, transform:`scale(${scale})`, transformOrigin:'center',
      borderRadius:radius, overflow:'hidden',
      willChange:'transform,opacity',
    }}>
      {content}
    </div>
  );
}

/* ─── RectSprite ─── */
export function RectSprite({
  x=0, y=0,
  width=100, height=100,
  color='#111', radius=8,
  entryDur=0.4, exitDur=0.3,
  render,
}) {
  const spriteCtx = useSprite();
  const { localTime, duration } = spriteCtx;
  const exitStart = Math.max(0, duration - exitDur);
  let opacity=1, scale=1;

  if (localTime < entryDur) {
    const t = Easing.easeOutBack(clamp(localTime/entryDur,0,1));
    opacity=clamp(localTime/entryDur,0,1);
    scale=0.4+0.6*t;
  } else if (localTime > exitStart && isFinite(duration)) {
    const t = Easing.easeInQuad(clamp((localTime-exitStart)/exitDur,0,1));
    opacity=1-t; scale=1-0.15*t;
  }

  const overrides = render ? render(spriteCtx) : {};

  return (
    <div style={{
      position:'absolute', left:x, top:y, width, height,
      background:color, borderRadius:radius,
      opacity, transform:`scale(${scale})`, transformOrigin:'center',
      willChange:'transform,opacity',
      ...overrides,
    }} />
  );
}

/* ─── IconButton ─── */
function IconButton({ children, onClick, title }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center',
        background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.1)', borderRadius:6,
        color:'#f6f4ef', cursor:'pointer', padding:0,
        transition:'background 120ms', flexShrink:0,
      }}
    >
      {children}
    </button>
  );
}

/* ─── PlaybackBar ─── */
export function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const timeFromEvent = useCallback(e => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return clamp((e.clientX-rect.left)/rect.width, 0, 1) * duration;
  }, [duration]);

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = e => onSeek(timeFromEvent(e));
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time/duration)*100 : 0;
  const fmt = t => {
    const m  = Math.floor(t/60);
    const s  = Math.floor(t%60);
    const cs = Math.floor((t*100)%100);
    return `${m}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  };
  const mono = '"JetBrains Mono", ui-monospace, monospace';

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10, padding:'7px 14px',
      background:'rgba(15,15,15,0.95)', borderTop:'1px solid rgba(255,255,255,0.07)',
      width:'100%', maxWidth:700, alignSelf:'center', borderRadius:8,
      color:'#f6f4ef', userSelect:'none', flexShrink:0, boxSizing:'border-box',
    }}>
      <IconButton onClick={onReset} title="Başa al">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </IconButton>
      <IconButton onClick={onPlayPause} title={playing ? 'Duraklat' : 'Oynat'}>
        {playing
          ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="2" width="3" height="10" fill="currentColor"/>
              <rect x="8" y="2" width="3" height="10" fill="currentColor"/>
            </svg>
          : <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 2l9 5-9 5V2z" fill="currentColor"/>
            </svg>
        }
      </IconButton>
      <div style={{ fontFamily:mono, fontSize:11, fontVariantNumeric:'tabular-nums', width:60, textAlign:'right', color:'#f6f4ef' }}>
        {fmt(time)}
      </div>
      <div
        ref={trackRef}
        onMouseMove={e => !dragging && onHover(timeFromEvent(e))}
        onMouseLeave={() => !dragging && onHover(null)}
        onMouseDown={e => { setDragging(true); onSeek(timeFromEvent(e)); }}
        style={{ flex:1, height:22, position:'relative', cursor:'pointer', display:'flex', alignItems:'center' }}
      >
        <div style={{ position:'absolute', left:0, right:0, height:3, background:'rgba(255,255,255,0.12)', borderRadius:2 }} />
        <div style={{ position:'absolute', left:0, width:`${pct}%`, height:3, background:'#00b4d8', borderRadius:2 }} />
        <div style={{
          position:'absolute', left:`${pct}%`, top:'50%',
          width:11, height:11, marginLeft:-5.5, marginTop:-5.5,
          background:'#fff', borderRadius:'50%', boxShadow:'0 2px 4px rgba(0,0,0,0.5)',
        }} />
      </div>
      <div style={{ fontFamily:mono, fontSize:11, fontVariantNumeric:'tabular-nums', width:60, textAlign:'left', color:'rgba(246,244,239,0.4)' }}>
        {fmt(duration)}
      </div>
    </div>
  );
}

/* ─── Stage ─── */
export function Stage({
  width=1280, height=720, duration=10,
  background='#f6f4ef', fps=60, loop=true, autoplay=true,
  persistKey='animstage', children,
}) {
  const [time, setTime] = useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey+':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch { return 0; }
  });
  const [playing, setPlaying] = useState(autoplay);
  const [hoverTime, setHoverTime] = useState(null);
  const [scale, setScale] = useState(1);
  const stageRef  = useRef(null);
  const rafRef    = useRef(null);
  const lastTsRef = useRef(null);

  /* persist time */
  useEffect(() => {
    try { localStorage.setItem(persistKey+':t', String(time)); } catch {}
  }, [time, persistKey]);

  /* auto-scale */
  useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 46;
      const s = Math.min(el.clientWidth/width, (el.clientHeight-barH)/height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [width, height]);

  /* RAF loop */
  useEffect(() => {
    if (!playing) { lastTsRef.current = null; return; }
    const step = ts => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) next = next % duration;
          else { setPlaying(false); return duration; }
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

  /* keyboard */
  useEffect(() => {
    const onKey = e => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space')      { e.preventDefault(); setPlaying(p => !p); }
      else if (e.code === 'ArrowLeft')  setTime(t => clamp(t-(e.shiftKey?1:0.1), 0, duration));
      else if (e.code === 'ArrowRight') setTime(t => clamp(t+(e.shiftKey?1:0.1), 0, duration));
      else if (e.key === '0' || e.code === 'Home') setTime(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = useMemo(() => ({
    time:displayTime, duration, playing, setTime, setPlaying,
  }), [displayTime, duration, playing]);

  return (
    <div
      ref={stageRef}
      style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center',
        background:'#0a0a0a', fontFamily:'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ flex:1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', minHeight:0 }}>
        <div style={{
          width, height, background, position:'relative',
          transform:`scale(${scale})`, transformOrigin:'center',
          flexShrink:0, boxShadow:'0 24px 80px rgba(0,0,0,0.6)',
          overflow:'hidden',
        }}>
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>
      <PlaybackBar
        time={displayTime} duration={duration} playing={playing}
        onPlayPause={() => setPlaying(p => !p)}
        onReset={() => setTime(0)}
        onSeek={t => setTime(t)}
        onHover={t => setHoverTime(t)}
      />
    </div>
  );
}
