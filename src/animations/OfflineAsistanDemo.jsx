import {
  Stage,
  Sprite,
  TextSprite,
  ImageSprite,
  useSprite,
  clamp,
  Easing,
  interpolate,
} from './AnimCore';

const ACCENT = '#00b4d8';
const ACCENT_SOFT = '#90e0ef';
const BG = '#020a18';
const PANEL = 'rgba(3, 16, 38, 0.82)';
const PANEL_BORDER = 'rgba(0, 180, 216, 0.18)';
const GRID = 'rgba(0, 180, 216, 0.06)';

function AnimatedBackground() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 24%, rgba(0,180,216,0.16), transparent 28%), radial-gradient(circle at 82% 18%, rgba(144,224,239,0.12), transparent 24%), radial-gradient(circle at 50% 82%, rgba(0,73,143,0.25), transparent 34%), linear-gradient(180deg, #03122c 0%, #020a18 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          opacity: 0.9,
        }}
      />
    </>
  );
}

function GlowOrb({ x, y, size, color, delay = 0 }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const enter = clamp((localTime - delay) / 0.8, 0, 1);
  const fade = 1 - clamp((localTime - exitStart) / 0.45, 0, 1);
  const pulse = 0.92 + Math.sin((localTime + delay) * 2.4) * 0.06;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}66 0%, ${color}10 55%, transparent 70%)`,
        filter: 'blur(10px)',
        opacity: enter * fade,
        transform: `scale(${pulse})`,
      }}
    />
  );
}

function HeroLine() {
  const { localTime, duration } = useSprite();
  const width = interpolate([0.15, 0.95, 1.6], [0, 180, 290], Easing.easeInOutCubic)(localTime);
  const exitStart = Math.max(0, duration - 0.5);
  const opacity = 1 - clamp((localTime - exitStart) / 0.4, 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 228,
        width,
        height: 2,
        transform: 'translateX(-50%)',
        background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
        borderRadius: 99,
        opacity,
      }}
    />
  );
}

function LivePill() {
  const { localTime, duration } = useSprite();
  const enter = Easing.easeOutBack(clamp((localTime - 1.1) / 0.6, 0, 1));
  const exitStart = Math.max(0, duration - 0.45);
  const exit = clamp((localTime - exitStart) / 0.4, 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        top: 376,
        left: '50%',
        transform: `translateX(-50%) scale(${0.65 + enter * 0.35})`,
        opacity: enter * (1 - exit),
        padding: '7px 18px',
        borderRadius: 999,
        background: 'rgba(74, 222, 128, 0.12)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        color: '#4ade80',
        fontSize: 13,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#4ade80',
          boxShadow: '0 0 10px rgba(74, 222, 128, 0.9)',
        }}
      />
      LIVE · offlineasistan.com.tr
    </div>
  );
}

function Panel({ x, y, width, height, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        background: PANEL,
        border: `1px solid ${PANEL_BORDER}`,
        borderRadius: 18,
        boxShadow: '0 18px 40px rgba(0, 0, 0, 0.28)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function FakeScreen() {
  const { localTime } = useSprite();
  const progress = clamp(localTime / 2.4, 0, 1);
  const barWidth = interpolate([0, 0.5, 1], [0, 120, 210], Easing.easeInOutCubic)(progress);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: 96,
        width: 800,
        height: 340,
      }}
    >
      <Panel x={0} y={0} width={800} height={340}>
        <div style={{ height: 40, borderBottom: `1px solid ${PANEL_BORDER}`, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
          <div style={{ marginLeft: 12, fontSize: 12, letterSpacing: '0.06em', color: 'rgba(144,224,239,0.5)' }}>OFFLINE ASISTAN DASHBOARD</div>
        </div>
        <div style={{ display: 'flex', height: 'calc(100% - 40px)' }}>
          <div style={{ width: 168, borderRight: `1px solid ${PANEL_BORDER}`, padding: 18 }}>
            {['Erasmus', 'Staj', 'Muafiyet', 'Sınav Programı'].map((item, index) => (
              <div
                key={item}
                style={{
                  marginBottom: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: index === 1 ? 'rgba(0,180,216,0.14)' : 'rgba(255,255,255,0.03)',
                  color: index === 1 ? ACCENT : 'rgba(255,255,255,0.72)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: 18, position: 'relative' }}>
            <div style={{ color: ACCENT_SOFT, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Başvuru Durumu</div>
            <div style={{ color: '#f8fbff', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Staj Belgesi Onay Akışı</div>
            <div style={{ width: 210, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ width: barWidth, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${ACCENT}, #48cae4)` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Başvuru', 'Tamamlandı'],
                ['Danışman', 'Onay Bekliyor'],
                ['Bölüm', 'İnceleniyor'],
                ['Arşiv', 'Senkronize'],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${PANEL_BORDER}` }}>
                  <div style={{ color: 'rgba(144,224,239,0.42)', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ color: '#eef8ff', fontSize: 16, fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function FlowBeam() {
  const { localTime, duration } = useSprite();
  const x = interpolate([0, 1.0, 2.2, 3.2], [120, 250, 470, 720], Easing.easeInOutSine)(localTime);
  const exitStart = Math.max(0, duration - 0.45);
  const opacity = 1 - clamp((localTime - exitStart) / 0.4, 0, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        top: 282,
        width: 640,
        height: 2,
        background: 'linear-gradient(90deg, rgba(0,180,216,0.05), rgba(0,180,216,0.26), rgba(0,180,216,0.05))',
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: x,
          top: -5,
          width: 16,
          height: 12,
          borderRadius: 12,
          background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(144,224,239,0.9), rgba(255,255,255,0))',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}

function MetricCard({ x, y, label, value, accent, delay, hint }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const entryT = Easing.easeOutCubic(clamp((localTime - delay) / 0.7, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = localTime > delay ? clamp((localTime - delay) / 0.4, 0, 1) * (1 - exitT) : 0;
  const rise = (1 - entryT) * 24;
  return (
    <>
      <div style={{ position:'absolute', left:x, top:y, width:200, height:118, background:'rgba(3,16,38,0.82)', borderRadius:18, border:`1px solid ${accent}33`, boxShadow:`0 20px 40px ${accent}18`, opacity, transform:`translateY(${rise}px)`, willChange:'transform,opacity' }} />
      <div style={{ position:'absolute', left:x+18, top:y+20, color:'rgba(144,224,239,0.45)', fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', opacity }}>{label}</div>
      <div style={{ position:'absolute', left:x+18, top:y+50, color:'#f4fbff', fontSize:28, fontWeight:800, opacity }}>{value}</div>
      <div style={{ position:'absolute', left:x+18, top:y+84, color:accent, fontSize:12, fontWeight:700, opacity }}>{hint || 'anlık süreç görünürlüğü'}</div>
    </>
  );
}

function ModuleCard({ x, title, subtitle, tag, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const entryT = Easing.easeOutBack(clamp((localTime - delay) / 0.55, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = localTime > delay ? clamp((localTime - delay) / 0.3, 0, 1) * (1 - exitT) : 0;
  const rise = (1 - entryT) * 28;
  const scale = 0.9 + entryT * 0.1;
  return (
    <>
      <div style={{ position:'absolute', left:x, top:150, width:176, height:210, background:'rgba(3,16,38,0.82)', borderRadius:18, border:`1px solid ${PANEL_BORDER}`, boxShadow:'0 18px 34px rgba(0,0,0,0.24)', opacity, transform:`translateY(${rise}px) scale(${scale})`, transformOrigin:'center bottom', willChange:'transform,opacity' }} />
      <div style={{ position:'absolute', left:x+18, top:172, padding:'6px 10px', borderRadius:999, background:'rgba(0,180,216,0.1)', color:ACCENT, fontSize:11, fontWeight:700, opacity }}>{tag}</div>
      <div style={{ position:'absolute', left:x+18, top:218, color:'#f0fbff', fontSize:22, fontWeight:800, opacity }}>{title}</div>
      <div style={{ position:'absolute', left:x+18, top:258, width:138, color:'rgba(144,224,239,0.62)', fontSize:13, lineHeight:1.5, opacity }}>{subtitle}</div>
    </>
  );
}

function TechChip({ x, y, label, color, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const t      = Easing.easeOutElastic(clamp((localTime - delay) / 0.7, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.4, 0, 1);
  const scale  = localTime > delay ? 0.6 + t * 0.4 : 0;
  const opacity = localTime > delay ? Math.min(1, (localTime - delay) / 0.25) * (1 - exitT) : 0;
  return (
    <>
      <div style={{ position:'absolute', left:x, top:y, width:130, height:44, background:`${color}14`, borderRadius:12, border:`1px solid ${color}44`, opacity, transform:`scale(${scale})`, transformOrigin:'center', willChange:'transform,opacity' }} />
      <div style={{ position:'absolute', left:x+18, top:y+13, color, fontSize:14, fontWeight:700, fontFamily:'"JetBrains Mono", ui-monospace, monospace', opacity }}>{label}</div>
    </>
  );
}

/* ─────────── NEW: Belge Akış Süreci (Workflow diagram) ─────────── */
function FlowNode({ x, title, status, delay, accent }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const entryT = Easing.easeOutBack(clamp((localTime - delay) / 0.55, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = localTime > delay ? clamp((localTime - delay) / 0.3, 0, 1) * (1 - exitT) : 0;
  const rise = (1 - entryT) * 22;
  return (
    <>
      <div style={{
        position:'absolute', left:x, top:200, width:170, height:170,
        background:'rgba(3,16,38,0.82)',
        border:`1px solid ${accent}44`,
        borderRadius:20,
        boxShadow:`0 18px 40px ${accent}22`,
        opacity, transform:`translateY(${rise}px)`,
      }} />
      <div style={{
        position:'absolute', left:x+58, top:222, width:54, height:54,
        borderRadius:'50%',
        background:`radial-gradient(circle, ${accent}40, ${accent}10 70%)`,
        border:`1px solid ${accent}66`,
        opacity, transform:`translateY(${rise}px)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: accent, fontSize: 22, fontWeight: 800,
        fontFamily:'"JetBrains Mono", ui-monospace, monospace',
      }}>
        {title.charAt(0)}
      </div>
      <div style={{
        position:'absolute', left:x, top:296, width:170,
        textAlign:'center', color:'#f0fbff', fontSize:16, fontWeight:800,
        opacity, transform:`translateY(${rise}px)`,
      }}>{title}</div>
      <div style={{
        position:'absolute', left:x, top:320, width:170,
        textAlign:'center', color: accent, fontSize:11, fontWeight:700,
        letterSpacing:'0.08em', textTransform:'uppercase',
        opacity, transform:`translateY(${rise}px)`,
      }}>{status}</div>
    </>
  );
}

function FlowArrow({ x, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const grow = clamp((localTime - delay) / 0.5, 0, 1);
  const exitT = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = grow * (1 - exitT);
  return (
    <div style={{
      position:'absolute', left:x, top:284, width:46, height:2,
      background:`linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
      transform:`scaleX(${grow})`, transformOrigin:'left center',
      opacity,
    }}>
      <div style={{
        position:'absolute', right:-2, top:-3,
        width:8, height:8,
        borderRight:`2px solid ${ACCENT}`,
        borderTop:`2px solid ${ACCENT}`,
        transform:'rotate(45deg)',
      }} />
    </div>
  );
}

function FlowPulse({ delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const start = delay;
  const period = 2.6;
  const t = ((localTime - start) % period) / period;
  const inWindow = localTime > start && localTime < exitStart;
  if (!inWindow) return null;
  // 4 stations at x = 100, 312, 524, 736 (center of nodes at x+85)
  const positions = [185, 397, 609, 821];
  const segs = positions.length - 1;
  const segT = t * segs;
  const segIdx = clamp(Math.floor(segT), 0, segs - 1);
  const localSeg = segT - segIdx;
  const px = positions[segIdx] + (positions[segIdx+1] - positions[segIdx]) * localSeg;
  const opacity = Math.sin(t * Math.PI) * 0.9;
  return (
    <div style={{
      position:'absolute', left:px - 8, top:276, width:16, height:16,
      borderRadius:'50%',
      background:`radial-gradient(circle, ${ACCENT_SOFT}, ${ACCENT}00 70%)`,
      boxShadow:`0 0 18px ${ACCENT}cc`,
      opacity, pointerEvents:'none',
    }}/>
  );
}

/* ─────────── NEW: Rol Bazlı Yetkilendirme ─────────── */
function RoleCard({ x, role, color, badge, perms, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const entryT = Easing.easeOutCubic(clamp((localTime - delay) / 0.6, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = localTime > delay ? clamp((localTime - delay) / 0.3, 0, 1) * (1 - exitT) : 0;
  const rise = (1 - entryT) * 26;
  return (
    <>
      <div style={{
        position:'absolute', left:x, top:130, width:226, height:316,
        background:'rgba(3,16,38,0.84)',
        border:`1px solid ${color}44`,
        borderRadius:20,
        boxShadow:`0 20px 44px ${color}22`,
        opacity, transform:`translateY(${rise}px)`,
      }} />
      <div style={{
        position:'absolute', left:x+18, top:148,
        padding:'5px 10px', borderRadius:999,
        background:`${color}1f`, color, fontSize:11, fontWeight:700,
        letterSpacing:'0.06em', textTransform:'uppercase',
        opacity, transform:`translateY(${rise}px)`,
      }}>{badge}</div>
      <div style={{
        position:'absolute', left:x+18, top:188, color:'#f3fbff',
        fontSize:24, fontWeight:800, opacity, transform:`translateY(${rise}px)`,
      }}>{role}</div>
      <div style={{
        position:'absolute', left:x+18, top:226, width:190,
        opacity, transform:`translateY(${rise}px)`,
      }}>
        {perms.map((p, i) => (
          <div key={p} style={{
            display:'flex', alignItems:'center', gap:10,
            color:'rgba(225,245,255,0.78)',
            fontSize:13, marginBottom:10,
          }}>
            <span style={{
              width:6, height:6, borderRadius:'50%',
              background:color, boxShadow:`0 0 8px ${color}99`,
              flexShrink:0,
            }}/>
            {p}
          </div>
        ))}
      </div>
    </>
  );
}

/* ─────────── NEW: Anlık Bildirim Akışı ─────────── */
function Toast({ y, delay, color, title, body }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.6);
  const entryT = Easing.easeOutBack(clamp((localTime - delay) / 0.5, 0, 1));
  const exitT  = clamp((localTime - exitStart) / 0.45, 0, 1);
  const opacity = localTime > delay ? clamp((localTime - delay) / 0.3, 0, 1) * (1 - exitT) : 0;
  const slide = (1 - entryT) * 70;
  return (
    <div style={{
      position:'absolute', left: 520 + slide, top:y, width:360,
      background:'rgba(3,16,38,0.88)',
      border:`1px solid ${color}55`,
      borderRadius:14,
      padding:'14px 18px',
      boxShadow:`0 16px 36px ${color}22`,
      opacity,
      display:'flex', gap:12, alignItems:'flex-start',
    }}>
      <div style={{
        width:34, height:34, flexShrink:0,
        borderRadius:'50%',
        background:`${color}22`,
        border:`1px solid ${color}66`,
        display:'flex', alignItems:'center', justifyContent:'center',
        color, fontSize:16, fontWeight:800,
      }}>!</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:'#f4fbff', fontSize:14, fontWeight:700, marginBottom:4 }}>{title}</div>
        <div style={{ color:'rgba(144,224,239,0.68)', fontSize:12 }}>{body}</div>
      </div>
      <div style={{
        color:'rgba(144,224,239,0.4)', fontSize:11,
        fontFamily:'"JetBrains Mono", ui-monospace, monospace',
      }}>az önce</div>
    </div>
  );
}

function SocketPulse({ x, y }) {
  const { localTime } = useSprite();
  const pulse = (Math.sin(localTime * 3.2) + 1) / 2;
  return (
    <>
      <div style={{
        position:'absolute', left:x, top:y, width:14, height:14,
        borderRadius:'50%', background:'#4ade80',
        boxShadow:`0 0 ${10 + pulse * 18}px rgba(74,222,128,${0.6 + pulse * 0.3})`,
      }}/>
      <div style={{
        position:'absolute', left:x - 4, top:y - 4, width:22, height:22,
        borderRadius:'50%',
        border:'1px solid rgba(74,222,128,0.55)',
        opacity: 1 - pulse,
        transform:`scale(${1 + pulse * 1.4})`,
      }}/>
    </>
  );
}

function CodeStream() {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const exitT = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = (1 - exitT) * 0.9;
  const lines = [
    "io.emit('belge:onaylandi', { id: 42 })",
    "→ danışman.notify  ✓",
    "→ öğrenci.notify   ✓",
    "→ arşiv.sync       ✓",
  ];
  return (
    <div style={{
      position:'absolute', left:80, top:140, width:380, height:300,
      background:'rgba(3,16,38,0.86)',
      border:`1px solid ${PANEL_BORDER}`,
      borderRadius:18,
      padding:'18px 22px',
      fontFamily:'"JetBrains Mono", ui-monospace, monospace',
      color:'rgba(144,224,239,0.85)',
      fontSize:13,
      lineHeight:1.7,
      opacity,
      overflow:'hidden',
    }}>
      <div style={{ color:'rgba(144,224,239,0.45)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
        Socket.IO Akışı
      </div>
      {lines.map((line, i) => {
        const showAt = 0.4 + i * 0.55;
        const lineOpacity = clamp((localTime - showAt) / 0.3, 0, 1);
        const dy = (1 - lineOpacity) * 8;
        return (
          <div key={i} style={{
            opacity: lineOpacity,
            transform:`translateY(${dy}px)`,
            color: i === 0 ? '#90e0ef' : '#4ade80',
            marginBottom: 6,
            whiteSpace:'nowrap',
          }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

function ClosingPanel() {
  const { localTime } = useSprite();
  const entryT = Easing.easeOutCubic(clamp((localTime - 0.12) / 0.8, 0, 1));
  const opacity = clamp((localTime - 0.12) / 0.5, 0, 1);
  const rise = (1 - entryT) * 26;
  return (
    <>
      <div style={{ position:'absolute', left:250, top:252, width:460, height:148, background:'rgba(3,16,38,0.84)', borderRadius:20, border:`1px solid ${PANEL_BORDER}`, boxShadow:'0 24px 48px rgba(0,0,0,0.28)', opacity, transform:`translateY(${rise}px)`, willChange:'transform,opacity' }} />
      <div style={{ position:'absolute', left:290, top:282, color:'rgba(144,224,239,0.5)', fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:700, opacity }}>Full-Stack Web Uygulaması</div>
      <div style={{ position:'absolute', left:290, top:315, color:'#f4fbff', fontSize:30, fontWeight:800, opacity }}>offlineasistan.com.tr</div>
      <div style={{ position:'absolute', left:290, top:356, color:ACCENT_SOFT, fontSize:13, opacity }}>Erasmus · Staj · Sınav Programı · Muafiyet</div>
    </>
  );
}

export default function OfflineAsistanDemo() {
  return (
    <Stage
      width={960}
      height={540}
      duration={60}
      background={BG}
      persistKey="offline-asistan-demo"
      loop={false}
      autoplay
    >
      <AnimatedBackground />

      {/* 1) Hero — 0 → 7 */}
      <Sprite start={0} end={7}>
        <GlowOrb x={80} y={120} size={220} color="#00b4d8" delay={0.05} />
        <GlowOrb x={720} y={90} size={180} color="#90e0ef" delay={0.2} />
        <TextSprite
          text="Offline Asistan"
          x={480}
          y={138}
          size={74}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="-0.03em"
          entryDur={0.65}
          exitDur={0.42}
        />
        <HeroLine />
        <TextSprite
          text="Çankırı Karatekin Üniversitesi"
          x={480}
          y={252}
          size={20}
          color={ACCENT_SOFT}
          align="center"
          weight={600}
          letterSpacing="0.08em"
          entryDur={0.75}
          exitDur={0.36}
        />
        <TextSprite
          text="Belge süreçlerini tek panelden dijitalleştiren öğrenci otomasyonu"
          x={480}
          y={298}
          size={14}
          color="rgba(144,224,239,0.56)"
          align="center"
          weight={500}
          letterSpacing="0.01em"
          entryDur={0.95}
          exitDur={0.32}
        />
        <LivePill />
      </Sprite>

      {/* 2) Akış ve Yönetim Paneli — 6.5 → 14.5 */}
      <Sprite start={6.5} end={14.5}>
        <TextSprite
          text="Akış ve Yönetim Paneli"
          x={480}
          y={46}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.04em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <FakeScreen />
        <FlowBeam />
        <MetricCard x={116} y={388} label="Aktif Süreç" value="12+" accent="#4ade80" delay={0.4} />
        <MetricCard x={380} y={388} label="Belge Tipi" value="4" accent="#f59e0b" delay={0.65} />
        <MetricCard x={644} y={388} label="Rol Bazlı" value="Yetkili" accent="#a78bfa" delay={0.9} />
      </Sprite>

      {/* 3) Temel Modüller — 14 → 22 */}
      <Sprite start={14} end={22}>
        <TextSprite
          text="Temel Modüller"
          x={480}
          y={54}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <ModuleCard x={100} title="Erasmus" subtitle="Yurt dışı başvuru ve evrak takibi tek akışta." tag="Uluslararası" delay={0.2} />
        <ModuleCard x={294} title="Staj" subtitle="Zorunlu ve isteğe bağlı staj evrak yönetimi." tag="Kariyer" delay={0.45} />
        <ModuleCard x={488} title="Muafiyet" subtitle="Ders eşleştirme ve onay süreci merkezi görünüm." tag="Akademik" delay={0.7} />
        <ModuleCard x={682} title="Sınav" subtitle="Programlama, yayınlama ve duyuru yönetimi." tag="Planlama" delay={0.95} />
      </Sprite>

      {/* 4) NEW: Belge Akış Süreci — 21.5 → 31 */}
      <Sprite start={21.5} end={31}>
        <GlowOrb x={650} y={60} size={260} color="#00b4d8" delay={0.1} />
        <TextSprite
          text="Belge Akış Süreci"
          x={480}
          y={68}
          size={26}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <TextSprite
          text="Her başvuru tek bir akışta uçtan uca takip edilir"
          x={480}
          y={112}
          size={13}
          color="rgba(144,224,239,0.58)"
          align="center"
          weight={500}
          letterSpacing="0.04em"
          entryDur={0.6}
          exitDur={0.35}
        />
        <FlowNode x={100} title="Öğrenci"  status="Başvuru"  accent="#4ade80" delay={0.3} />
        <FlowArrow x={278}  delay={0.85} />
        <FlowNode x={312} title="Danışman" status="Onay"     accent="#f59e0b" delay={1.0} />
        <FlowArrow x={490}  delay={1.55} />
        <FlowNode x={524} title="Bölüm"    status="İnceleme" accent="#a78bfa" delay={1.7} />
        <FlowArrow x={702}  delay={2.25} />
        <FlowNode x={736} title="Arşiv"    status="Senkron"  accent={ACCENT} delay={2.4} />
        <FlowPulse delay={3.4} />
      </Sprite>

      {/* 5) NEW: Rol Bazlı Yetkilendirme — 30.5 → 40 */}
      <Sprite start={30.5} end={40}>
        <TextSprite
          text="Rol Bazlı Yetkilendirme"
          x={480}
          y={56}
          size={26}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <TextSprite
          text="Her kullanıcı kendi sorumluluğundaki ekranı görür"
          x={480}
          y={98}
          size={13}
          color="rgba(144,224,239,0.58)"
          align="center"
          weight={500}
          letterSpacing="0.04em"
          entryDur={0.6}
          exitDur={0.35}
        />
        <RoleCard
          x={80} delay={0.3}
          role="Öğrenci"
          badge="Başvuru"
          color="#4ade80"
          perms={['Belge başvurusu oluştur', 'Durum takibi', 'Bildirim alma']}
        />
        <RoleCard
          x={326} delay={0.55}
          role="Danışman"
          badge="Onay"
          color="#f59e0b"
          perms={['Başvuru inceleme', 'Onay / red işlemleri', 'Geri bildirim yazma']}
        />
        <RoleCard
          x={572} delay={0.8}
          role="Bölüm"
          badge="Akademik"
          color="#a78bfa"
          perms={['Süreç onayı', 'Toplu işlem', 'Raporlama']}
        />
        <RoleCard
          x={818 - 80} delay={1.05}
          role="Yönetici"
          badge="Admin"
          color={ACCENT}
          perms={['Kullanıcı yönetimi', 'Sistem ayarları', 'Tam erişim']}
        />
      </Sprite>

      {/* 6) NEW: Anlık Bildirim Akışı — 39.5 → 48 */}
      <Sprite start={39.5} end={48}>
        <TextSprite
          text="Anlık Bildirim Akışı"
          x={480}
          y={56}
          size={26}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <TextSprite
          text="Socket.IO ile her değişiklik anında ilgili tarafa düşer"
          x={480}
          y={98}
          size={13}
          color="rgba(144,224,239,0.58)"
          align="center"
          weight={500}
          letterSpacing="0.04em"
          entryDur={0.6}
          exitDur={0.35}
        />
        <CodeStream />
        <SocketPulse x={420} y={154} />
        <TextSprite
          text="connected"
          x={440}
          y={148}
          size={11}
          color="#4ade80"
          weight={700}
          letterSpacing="0.1em"
          entryDur={0.5}
          exitDur={0.3}
        />
        <Toast y={150} delay={0.5} color="#4ade80"  title="Yeni Başvuru"     body="Ahmet K. — Staj belgesi gönderildi" />
        <Toast y={230} delay={1.4} color="#f59e0b"  title="Onay Bekliyor"    body="Danışman onayı gerekiyor"           />
        <Toast y={310} delay={2.3} color="#a78bfa"  title="Bölüm Onayı"      body="Belge bölüm tarafından incelendi"   />
        <Toast y={390} delay={3.2} color={ACCENT}   title="Arşivlendi"       body="Süreç tamamlandı, arşive aktarıldı"  />
      </Sprite>

      {/* 7) Teknoloji Yığını — 47.5 → 55 */}
      <Sprite start={47.5} end={55}>
        <TextSprite
          text="Teknoloji Yığını"
          x={480}
          y={60}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.4}
          exitDur={0.4}
        />
        <ImageSprite
          x={94}
          y={122}
          width={316}
          height={228}
          radius={20}
          placeholder={{ label: 'admin panel preview' }}
          kenBurns
          kenBurnsScale={1.05}
        />
        <Panel x={444} y={122} width={424} height={228}>
          <div style={{ padding: 22 }}>
            <div style={{ color: 'rgba(144,224,239,0.46)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Mimari</div>
            <div style={{ color: '#f3fbff', fontSize: 30, fontWeight: 800, marginBottom: 10 }}>Modern Full-Stack</div>
            <div style={{ color: 'rgba(144,224,239,0.62)', fontSize: 14, lineHeight: 1.6, width: 350 }}>
              React tabanlı yönetim paneli, Node.js ve Express servis katmanı, MongoDB veri yapısı ve gerçek zamanlı iletişim için Socket.IO.
            </div>
          </div>
        </Panel>
        <TechChip x={448} y={376} label="React"    color="#61dafb" delay={0.25} />
        <TechChip x={590} y={376} label="Vite"     color="#a78bfa" delay={0.4}  />
        <TechChip x={732} y={376} label="Tailwind" color="#38bdf8" delay={0.55} />
        <TechChip x={448} y={430} label="Node.js"  color="#86efac" delay={0.7}  />
        <TechChip x={590} y={430} label="Express"  color="#d1d5db" delay={0.85} />
        <TechChip x={732} y={430} label="MongoDB"  color="#4ade80" delay={1.0}  />
      </Sprite>

      {/* 8) Closing — 54.5 → 60 */}
      <Sprite start={54.5} end={60}>
        <GlowOrb x={300} y={220} size={360} color="#00b4d8" delay={0} />
        <TextSprite
          text="Offline Asistan"
          x={480}
          y={166}
          size={46}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="-0.03em"
          entryDur={0.45}
          exitDur={0.4}
        />
        <ClosingPanel />
      </Sprite>
    </Stage>
  );
}
