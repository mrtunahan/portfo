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
  const width = interpolate([0.15, 0.75, 1.2], [0, 150, 260], Easing.easeInOutCubic)(localTime);
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
  const enter = Easing.easeOutBack(clamp((localTime - 0.9) / 0.55, 0, 1));
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
  const progress = clamp(localTime / 1.6, 0, 1);
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
  const x = interpolate([0, 0.5, 1.2, 1.7], [120, 250, 470, 720], Easing.easeInOutSine)(localTime);
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

function MetricCard({ x, y, label, value, accent, delay }) {
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
      <div style={{ position:'absolute', left:x+18, top:y+84, color:accent, fontSize:12, fontWeight:700, opacity }}>anlık süreç görünürlüğü</div>
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
      duration={14}
      background={BG}
      persistKey="offline-asistan-demo"
      loop={false}
      autoplay
    >
      <AnimatedBackground />

      <Sprite start={0} end={4}>
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

      <Sprite start={3.2} end={7.2}>
        <TextSprite
          text="Akış ve Yönetim Paneli"
          x={480}
          y={46}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.04em"
          entryDur={0.35}
          exitDur={0.35}
        />
        <FakeScreen />
        <FlowBeam />
        <MetricCard x={116} y={388} label="Aktif Süreç" value="12+" accent="#4ade80" delay={0.3} />
        <MetricCard x={380} y={388} label="Belge Tipi" value="4" accent="#f59e0b" delay={0.45} />
        <MetricCard x={644} y={388} label="Rol Bazlı" value="Yetkili" accent="#a78bfa" delay={0.6} />
      </Sprite>

      <Sprite start={6.8} end={10.9}>
        <TextSprite
          text="Temel Modüller"
          x={480}
          y={54}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.35}
          exitDur={0.35}
        />
        <ModuleCard x={100} title="Erasmus" subtitle="Yurt dışı başvuru ve evrak takibi tek akışta." tag="Uluslararası" delay={0.1} />
        <ModuleCard x={294} title="Staj" subtitle="Zorunlu ve isteğe bağlı staj evrak yönetimi." tag="Kariyer" delay={0.25} />
        <ModuleCard x={488} title="Muafiyet" subtitle="Ders eşleştirme ve onay süreci merkezi görünüm." tag="Akademik" delay={0.4} />
        <ModuleCard x={682} title="Sınav" subtitle="Programlama, yayınlama ve duyuru yönetimi." tag="Planlama" delay={0.55} />
      </Sprite>

      <Sprite start={10.3} end={13}>
        <TextSprite
          text="Teknoloji Yığını"
          x={480}
          y={60}
          size={24}
          color={ACCENT}
          align="center"
          weight={800}
          letterSpacing="0.05em"
          entryDur={0.35}
          exitDur={0.35}
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
        <TechChip x={448} y={376} label="React" color="#61dafb" delay={0.15} />
        <TechChip x={590} y={376} label="Vite" color="#a78bfa" delay={0.25} />
        <TechChip x={732} y={376} label="Tailwind" color="#38bdf8" delay={0.35} />
        <TechChip x={448} y={430} label="Node.js" color="#86efac" delay={0.45} />
        <TechChip x={590} y={430} label="Express" color="#d1d5db" delay={0.55} />
        <TechChip x={732} y={430} label="MongoDB" color="#4ade80" delay={0.65} />
      </Sprite>

      <Sprite start={12.3} end={14}>
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
          exitDur={0.28}
        />
        <ClosingPanel />
      </Sprite>
    </Stage>
  );
}
