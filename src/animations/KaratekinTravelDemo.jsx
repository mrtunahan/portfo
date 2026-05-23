import {
  Stage, Sprite, TextSprite, useSprite,
  clamp, Easing, interpolate,
} from './AnimCore';

const ACCENT       = '#f4a261';
const ACCENT_SOFT  = '#fcd5a8';
const ACCENT2      = '#e76f51';
const BG           = '#0d0804';
const PANEL        = 'rgba(28,12,4,0.90)';
const PANEL_BORDER = 'rgba(244,162,97,0.20)';
const GRID         = 'rgba(244,162,97,0.05)';

/* ─── Yardımcılar ─── */
function fadeIn(localTime, delay = 0, dur = 0.5) {
  return clamp((localTime - delay) / dur, 0, 1);
}
function fadeOut(localTime, duration, exitDur = 0.45) {
  const s = Math.max(0, duration - exitDur);
  return 1 - clamp((localTime - s) / exitDur, 0, 1);
}
function fade(localTime, duration, delay = 0, inDur = 0.5, exitDur = 0.45) {
  return fadeIn(localTime, delay, inDur) * fadeOut(localTime, duration, exitDur);
}

/* ─── Ortak arka plan ─── */
function Bg() {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(circle at 15% 20%, rgba(244,162,97,0.13),transparent 30%),' +
          'radial-gradient(circle at 85% 15%, rgba(231,111,81,0.10),transparent 28%),' +
          'radial-gradient(circle at 50% 88%, rgba(61,31,0,0.35),transparent 40%),' +
          'linear-gradient(180deg,#1a0a02 0%,#0d0804 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          `linear-gradient(${GRID} 1px,transparent 1px),` +
          `linear-gradient(90deg,${GRID} 1px,transparent 1px)`,
        backgroundSize: '56px 56px',
      }} />
    </>
  );
}

/* ─── Parlayan küre (dekor) ─── */
function Orb({ x, y, size, color, delay = 0 }) {
  const { localTime, duration } = useSprite();
  const op = fade(localTime, duration, delay, 0.8, 0.5);
  const p  = 0.92 + Math.sin((localTime + delay) * 2.2) * 0.06;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle,${color}66 0%,${color}10 55%,transparent 70%)`,
      filter: 'blur(10px)',
      opacity: op, transform: `scale(${p})`,
    }} />
  );
}

/* ─── Telefon çerçevesi ─── */
function Phone({ x = 60, y = 28, children }) {
  const PW = 238, PH = 484;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: PW, height: PH,
      background: '#0e0a08',
      borderRadius: 38,
      border: '2px solid rgba(244,162,97,0.35)',
      boxShadow:
        '0 0 0 1px rgba(0,0,0,0.7),' +
        '0 24px 56px rgba(0,0,0,0.6),' +
        `0 0 40px ${ACCENT}18`,
      overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{
        height: 28, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>9:41</span>
        <div style={{
          width: 60, height: 14, background: '#1a1a1a',
          borderRadius: 10,
        }} />
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[3,5,7,9].map(h => (
            <div key={h} style={{ width: 3, height: h, background: '#fff', borderRadius: 1 }} />
          ))}
          <div style={{
            width: 18, height: 10, border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: 2, marginLeft: 3, display: 'flex', alignItems: 'center',
          }}>
            <div style={{ width: '70%', height: '60%', background: '#4ade80', borderRadius: 1, margin: '0 1px' }} />
          </div>
        </div>
      </div>
      {/* İçerik */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', height: PH - 28 - 20 }}>
        {children}
      </div>
      {/* Home bar */}
      <div style={{
        height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
      }}>
        <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 99 }} />
      </div>
    </div>
  );
}

/* ─── Logo splash (1. ekran) ─── */
function ScreenSplash() {
  const { localTime } = useSprite();
  const op = clamp(localTime / 0.7, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg,#1a6080 0%,#0d3a50 50%,#0a2030 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 0, opacity: op,
    }}>
      {/* Küre simgesi */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%,#5ac8e8,#2280a8)',
        border: '3px solid rgba(255,255,255,0.35)',
        boxShadow: '0 0 30px rgba(90,200,232,0.5)',
        position: 'relative', marginBottom: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Longitude lines */}
        {[-24, 0, 24].map((r, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 2, height: '80%',
            background: 'rgba(255,255,255,0.22)',
            borderRadius: 99,
            transform: `rotate(${r}deg)`,
          }} />
        ))}
        {/* Equator */}
        <div style={{
          position: 'absolute',
          width: '80%', height: 2,
          background: 'rgba(255,255,255,0.22)',
        }} />
        {/* Bus emoji */}
        <span style={{ fontSize: 28, position: 'relative', zIndex: 1 }}>🚌</span>
      </div>

      {/* Banner */}
      <div style={{
        background: '#f5c842',
        padding: '4px 18px',
        clipPath: 'polygon(8px 0%,calc(100% - 8px) 0%,100% 50%,calc(100% - 8px) 100%,8px 100%,0% 50%)',
        marginBottom: 10,
      }}>
        <span style={{ fontWeight: 900, fontSize: 13, color: '#1a1a0a', letterSpacing: '0.04em' }}>
          KARATEKİN TRAVEL
        </span>
      </div>

      <div style={{ color: 'rgba(200,235,255,0.7)', fontSize: 10, letterSpacing: '0.08em' }}>
        ÇANKIRI KARATEKİN ÜNİVERSİTESİ
      </div>
      <div style={{ color: 'rgba(200,235,255,0.45)', fontSize: 9, marginTop: 4 }}>2024</div>
    </div>
  );
}

/* ─── Ana sayfa (turnuva listesi) ─── */
function ScreenHome() {
  const { localTime } = useSprite();
  const tournaments = [
    { city: 'İstanbul', event: 'Boğaz Kupası', date: '14–16 Haz', cat: 'A1', color: '#f4a261' },
    { city: 'Ankara',   event: 'Cumhuriyet Turnuvası', date: '28–30 Haz', cat: 'A2', color: '#4ade80' },
    { city: 'İzmir',    event: 'Ege Açık', date: '12–14 Tem', cat: 'B1', color: '#60a5fa' },
    { city: 'Bursa',    event: 'Osmangazi Kupası', date: '26–28 Tem', cat: 'A1', color: '#a78bfa' },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#0d1520',
      fontFamily: 'system-ui,sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 8px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(244,162,97,0.15)',
      }}>
        <div style={{ color: 'rgba(200,225,255,0.5)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Yaklaşan
        </div>
        <div style={{ color: '#f4f8ff', fontSize: 15, fontWeight: 800, marginTop: 2 }}>
          Turnuvalar
        </div>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {['Tümü', 'A1', 'A2', 'B1'].map((t, i) => (
            <div key={t} style={{
              padding: '2px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700,
              background: i === 0 ? ACCENT : 'rgba(255,255,255,0.07)',
              color: i === 0 ? '#1a0800' : 'rgba(255,255,255,0.6)',
              border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}>{t}</div>
          ))}
        </div>
      </div>
      {/* List */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tournaments.map(({ city, event, date, cat, color }, i) => {
          const op = clamp((localTime - 0.3 - i * 0.25) / 0.4, 0, 1);
          const dy = (1 - op) * 14;
          return (
            <div key={city} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${color}33`,
              borderRadius: 12,
              padding: '8px 10px',
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: op, transform: `translateY(${dy}px)`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}22`,
                border: `1px solid ${color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 16 }}>🥋</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#f0f8ff', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>
                  {event}
                </div>
                <div style={{ color: 'rgba(200,220,255,0.55)', fontSize: 9 }}>
                  📍 {city}  ·  📅 {date}
                </div>
              </div>
              <div style={{
                padding: '2px 6px', borderRadius: 6,
                background: `${color}22`, color,
                fontSize: 9, fontWeight: 800,
              }}>{cat}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Turnuva detay ekranı ─── */
function ScreenDetail() {
  const { localTime } = useSprite();
  const op = clamp(localTime / 0.6, 0, 1);
  const details = [
    { label: '📍 Konum', value: 'Boğaziçi Spor Salonu, İstanbul' },
    { label: '📅 Tarih', value: '14–16 Haziran 2026' },
    { label: '🥋 Kategoriler', value: 'Kata · Kumite (A1)' },
    { label: '👥 Kapasitesi', value: '1.200 sporcu' },
    { label: '💰 Kayıt', value: '₺450 / sporcu' },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0d1520',
      fontFamily: 'system-ui,sans-serif',
      opacity: op,
    }}>
      {/* Hero image placeholder */}
      <div style={{
        height: 110, background: 'linear-gradient(135deg,#1a4060,#0d2030)',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 42 }}>🏟️</span>
        {/* Back button */}
        <div style={{
          position: 'absolute', left: 10, top: 10,
          width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12,
        }}>‹</div>
        {/* Badge */}
        <div style={{
          position: 'absolute', right: 10, top: 10,
          padding: '2px 7px', borderRadius: 99,
          background: `${ACCENT}cc`, color: '#1a0800',
          fontSize: 8, fontWeight: 800,
        }}>A1</div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{ color: '#f0f8ff', fontSize: 14, fontWeight: 900, marginBottom: 2 }}>
          Boğaz Kupası 2026
        </div>
        <div style={{ color: `${ACCENT}bb`, fontSize: 9, marginBottom: 10, fontWeight: 600 }}>
          Türkiye Karate Federasyonu Onaylı
        </div>
        {details.map(({ label, value }, i) => {
          const itemOp = clamp((localTime - 0.4 - i * 0.18) / 0.35, 0, 1);
          return (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '5px 0', opacity: itemOp,
            }}>
              <span style={{ color: 'rgba(200,220,255,0.5)', fontSize: 9 }}>{label}</span>
              <span style={{ color: '#e8f4ff', fontSize: 9, fontWeight: 600, textAlign: 'right', maxWidth: 130 }}>{value}</span>
            </div>
          );
        })}
        {/* CTA */}
        <div style={{
          marginTop: 12,
          background: `linear-gradient(90deg,${ACCENT},${ACCENT2})`,
          borderRadius: 10, padding: '8px 0',
          textAlign: 'center', color: '#1a0800',
          fontWeight: 800, fontSize: 11,
          opacity: clamp((localTime - 1.2) / 0.4, 0, 1),
        }}>
          ✈️  Seyahat Planla
        </div>
      </div>
    </div>
  );
}

/* ─── Seyahat planlama ekranı ─── */
function ScreenTravel() {
  const { localTime } = useSprite();
  const routes = [
    { icon: '🚌', label: 'Otobüs', time: '8s 30dk', price: '₺380', co2: 'Eko', color: '#4ade80' },
    { icon: '🚆', label: 'Tren',   time: '5s 10dk', price: '₺540', co2: 'Hızlı', color: '#60a5fa' },
    { icon: '✈️', label: 'Uçak',  time: '1s 20dk', price: '₺1.250', co2: 'Hızlı', color: ACCENT },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#0d1520',
      fontFamily: 'system-ui,sans-serif',
    }}>
      <div style={{ padding: '10px 12px' }}>
        {/* Route selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '5px 8px',
          }}>
            <div style={{ color: 'rgba(200,220,255,0.4)', fontSize: 7 }}>NEREDEN</div>
            <div style={{ color: '#f0f8ff', fontSize: 10, fontWeight: 700 }}>Çankırı</div>
          </div>
          <div style={{ color: ACCENT, fontSize: 14 }}>⇄</div>
          <div style={{
            flex: 1, background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}44`,
            borderRadius: 8, padding: '5px 8px',
          }}>
            <div style={{ color: `${ACCENT}88`, fontSize: 7 }}>NEREYE</div>
            <div style={{ color: ACCENT, fontSize: 10, fontWeight: 700 }}>İstanbul</div>
          </div>
        </div>
        {/* Date */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '6px 10px',
          display: 'flex', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <span style={{ color: 'rgba(200,220,255,0.5)', fontSize: 9 }}>📅 Gidiş</span>
          <span style={{ color: '#f0f8ff', fontSize: 9, fontWeight: 700 }}>14 Haziran 2026</span>
        </div>
        {/* Routes */}
        <div style={{ color: 'rgba(200,220,255,0.45)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          ULAŞIM SEÇENEKLERİ
        </div>
        {routes.map(({ icon, label, time, price, co2, color }, i) => {
          const op = clamp((localTime - 0.5 - i * 0.3) / 0.4, 0, 1);
          const dy = (1 - op) * 12;
          return (
            <div key={label} style={{
              display: 'flex', alignItems: 'center',
              background: i === 0 ? `${color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${i === 0 ? color + '44' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: '8px 10px', marginBottom: 7,
              opacity: op, transform: `translateY(${dy}px)`,
            }}>
              <span style={{ fontSize: 18, marginRight: 8 }}>{icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#f0f8ff', fontSize: 10, fontWeight: 700 }}>{label}</div>
                <div style={{ color: 'rgba(200,220,255,0.5)', fontSize: 8 }}>{time}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color, fontSize: 11, fontWeight: 800 }}>{price}</div>
                <div style={{
                  fontSize: 7, padding: '1px 5px', borderRadius: 99,
                  background: `${color}22`, color,
                }}>{co2}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Harita ekranı ─── */
function ScreenMap() {
  const { localTime } = useSprite();
  const pins = [
    { x: 52, y: 68,  city: 'İstanbul', active: true  },
    { x: 108, y: 80, city: 'Ankara',   active: false },
    { x: 34, y: 98,  city: 'İzmir',    active: false },
    { x: 80, y: 72,  city: 'Bursa',    active: false },
    { x: 140, y: 90, city: 'Sivas',    active: false },
    { x: 94, y: 60,  city: 'Zonguldak', active: false },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#0d1a28',
      fontFamily: 'system-ui,sans-serif',
    }}>
      {/* Map area */}
      <div style={{
        margin: '8px', height: 200,
        background: 'linear-gradient(160deg,#0a2035,#0d2840,#0a1e30)',
        borderRadius: 12,
        border: '1px solid rgba(96,165,250,0.2)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid lines */}
        {[40,80,120,160].map(y => (
          <div key={y} style={{ position:'absolute', left:0, right:0, top:y, height:1, background:'rgba(96,165,250,0.07)' }} />
        ))}
        {[40,80,120,160,200].map(x => (
          <div key={x} style={{ position:'absolute', top:0, bottom:0, left:x, width:1, background:'rgba(96,165,250,0.07)' }} />
        ))}
        {/* Turkey outline (approximate) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 238 200">
          <path
            d="M 20 90 Q 30 70 50 68 Q 80 62 100 72 Q 120 68 140 78 Q 160 82 175 90 Q 185 98 190 108 Q 180 120 160 118 Q 140 115 120 118 Q 100 120 80 115 Q 60 112 40 105 Q 28 100 20 90 Z"
            fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.25)" strokeWidth="1"
          />
        </svg>
        {/* Pins */}
        {pins.map(({ x, y, city, active }, i) => {
          const pop = Easing.easeOutBack(clamp((localTime - 0.3 - i * 0.2) / 0.5, 0, 1));
          return (
            <div key={city} style={{
              position: 'absolute',
              left: x, top: y,
              transform: `scale(${pop}) translate(-50%,-100%)`,
              transformOrigin: 'bottom center',
            }}>
              <div style={{
                width: active ? 14 : 10, height: active ? 14 : 10,
                borderRadius: '50%',
                background: active ? ACCENT : 'rgba(96,165,250,0.7)',
                border: active ? `2px solid ${ACCENT2}` : '1px solid rgba(96,165,250,0.4)',
                boxShadow: active ? `0 0 12px ${ACCENT}88` : 'none',
              }} />
              {active && (
                <div style={{
                  position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)',
                  background: ACCENT, color: '#1a0800',
                  fontSize: 7, fontWeight: 800, padding: '1px 4px', borderRadius: 4,
                  whiteSpace: 'nowrap',
                }}>İstanbul</div>
              )}
            </div>
          );
        })}
      </div>
      {/* Info strip */}
      <div style={{ padding: '0 8px', display: 'flex', gap: 6 }}>
        {[
          { label: '6 Turnuva', sub: 'Bu Yaz', color: ACCENT },
          { label: '11 Şehir', sub: 'Türkiye', color: '#60a5fa' },
          { label: '3 Aktif', sub: 'Kayıt Açık', color: '#4ade80' },
        ].map(({ label, sub, color }) => (
          <div key={label} style={{
            flex: 1, background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${color}33`, borderRadius: 8,
            padding: '6px', textAlign: 'center',
          }}>
            <div style={{ color, fontSize: 11, fontWeight: 800 }}>{label}</div>
            <div style={{ color: 'rgba(200,220,255,0.45)', fontSize: 8 }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Yüzen metric kartı (sağ taraf) ─── */
function StatCard({ x, y, icon, label, value, color, delay }) {
  const { localTime, duration } = useSprite();
  const op = fade(localTime, duration, delay, 0.5, 0.4);
  const entryT = Easing.easeOutCubic(clamp((localTime - delay) / 0.6, 0, 1));
  const dy = (1 - entryT) * 22;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 180,
      background: PANEL,
      border: `1px solid ${color}33`,
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: `0 18px 36px ${color}14`,
      opacity: op, transform: `translateY(${dy}px)`,
    }}>
      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
      <div style={{ color: `rgba(200,220,255,0.48)`, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#f4f8ff', fontSize: 24, fontWeight: 800 }}>{value}</div>
      <div style={{ width: 24, height: 3, background: color, borderRadius: 99, marginTop: 8 }} />
    </div>
  );
}

/* ─── Tech chip ─── */
function TechChip({ x, y, label, color, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const t    = Easing.easeOutElastic(clamp((localTime - delay) / 0.7, 0, 1));
  const exitT = clamp((localTime - exitStart) / 0.4, 0, 1);
  const sc   = localTime > delay ? 0.6 + t * 0.4 : 0;
  const op   = localTime > delay ? Math.min(1, (localTime - delay) / 0.25) * (1 - exitT) : 0;
  return (
    <>
      <div style={{
        position: 'absolute', left: x, top: y, width: 138, height: 44,
        background: `${color}14`, borderRadius: 12,
        border: `1px solid ${color}44`,
        opacity: op, transform: `scale(${sc})`, transformOrigin: 'center',
      }} />
      <div style={{
        position: 'absolute', left: x + 16, top: y + 13,
        color, fontSize: 14, fontWeight: 700,
        fontFamily: '"JetBrains Mono",ui-monospace,monospace',
        opacity: op,
      }}>{label}</div>
    </>
  );
}

/* ─── Feature kartı ─── */
function FeatureCard({ x, y, icon, title, desc, color, delay }) {
  const { localTime, duration } = useSprite();
  const op = fade(localTime, duration, delay, 0.5, 0.4);
  const entryT = Easing.easeOutCubic(clamp((localTime - delay) / 0.6, 0, 1));
  const dy = (1 - entryT) * 20;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 200,
      background: PANEL,
      border: `1px solid ${color}33`,
      borderRadius: 16, padding: '14px 16px',
      opacity: op, transform: `translateY(${dy}px)`,
    }}>
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <div style={{ color: '#f4f8ff', fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{title}</div>
      <div style={{ color: 'rgba(200,220,255,0.6)', fontSize: 11, lineHeight: 1.5 }}>{desc}</div>
      <div style={{ width: 20, height: 3, background: color, borderRadius: 99, marginTop: 10 }} />
    </div>
  );
}

/* ─── Kapanış Live pill ─── */
function DevPill() {
  const { localTime, duration } = useSprite();
  const enter = Easing.easeOutBack(clamp((localTime - 0.9) / 0.7, 0, 1));
  const exitT = clamp((localTime - Math.max(0, duration - 0.45)) / 0.4, 0, 1);
  const op = enter * (1 - exitT);
  return (
    <div style={{
      position: 'absolute', top: 358, left: '50%',
      transform: `translateX(-50%) scale(${0.65 + enter * 0.35})`,
      opacity: op,
      padding: '7px 18px', borderRadius: 999,
      background: 'rgba(251,191,36,0.12)',
      border: '1px solid rgba(251,191,36,0.3)',
      color: '#fbbf24', fontSize: 13, fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 8,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#fbbf24',
        boxShadow: '0 0 10px rgba(251,191,36,0.9)',
      }} />
      GELİŞTİRMEDE · React Native · Expo
    </div>
  );
}

/* ─────────────────────────── EXPORT ─────────────────────────── */
export default function KaratekinTravelDemo() {
  return (
    <Stage
      width={960}
      height={540}
      duration={62}
      background={BG}
      persistKey="karatekin-travel-demo"
      loop={false}
      autoplay
    >
      <Bg />

      {/* ── 1) HERO  0–7 ── */}
      <Sprite start={0} end={7}>
        <Orb x={60} y={80} size={240} color={ACCENT} delay={0} />
        <Orb x={680} y={60} size={200} color={ACCENT2} delay={0.2} />

        {/* Phone: splash */}
        <Sprite start={0} end={7}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp(localTime / 0.8, 0, 1));
            return (
              <div style={{ opacity: op, transform: `scale(${0.9 + op * 0.1})`, transformOrigin: 'center' }}>
                <Phone x={74} y={28}>
                  <ScreenSplash />
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <TextSprite text="KarateKin Travel" x={480} y={118} size={66}
          color={ACCENT} align="center" weight={900} letterSpacing="-0.03em"
          entryDur={0.65} exitDur={0.42} />
        <TextSprite text="Çankırı Karatekin Üniversitesi" x={480} y={220} size={18}
          color={ACCENT_SOFT} align="center" weight={600} letterSpacing="0.08em"
          entryDur={0.75} exitDur={0.36} />
        <TextSprite
          text="Karate turnuvaları için akıllı seyahat planlama uygulaması"
          x={480} y={264} size={14}
          color="rgba(244,162,97,0.55)" align="center" weight={500}
          entryDur={0.95} exitDur={0.32} />

        <DevPill />

        {/* Tech badges */}
        <Sprite start={1.4} end={7}>
          {({ localTime }) => {
            const chips = ['React Native', 'Expo', 'Maps API'];
            return chips.map((c, i) => {
              const op = Easing.easeOutBack(clamp((localTime - i * 0.2) / 0.5, 0, 1));
              return (
                <div key={c} style={{
                  position: 'absolute',
                  left: 352 + i * 148, top: 400,
                  padding: '5px 14px', borderRadius: 999,
                  background: `${ACCENT}14`,
                  border: `1px solid ${ACCENT}44`,
                  color: ACCENT_SOFT, fontSize: 12, fontWeight: 700,
                  opacity: op, transform: `scale(${0.7 + op * 0.3})`,
                }}>
                  {c}
                </div>
              );
            });
          }}
        </Sprite>
      </Sprite>

      {/* ── 2) TURNUVA LİSTESİ  6.5–15 ── */}
      <Sprite start={6.5} end={15}>
        <TextSprite text="Turnuva Takvimi" x={480} y={46} size={24}
          color={ACCENT} align="center" weight={800} letterSpacing="0.04em"
          entryDur={0.4} exitDur={0.4} />
        <TextSprite text="Yaklaşan karate turnuvalarını keşfet ve seyahatini planla"
          x={480} y={88} size={13} color="rgba(244,162,97,0.55)"
          align="center" weight={500} entryDur={0.6} exitDur={0.35} />

        <Sprite start={6.5} end={15}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.15) / 0.7, 0, 1));
            return (
              <div style={{ opacity: op }}>
                <Phone x={74} y={108}>
                  <ScreenHome />
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <StatCard x={352} y={120} icon="🥋" label="Aktif Turnuva" value="14" color={ACCENT} delay={0.5} />
        <StatCard x={352} y={266} icon="📍" label="Şehir" value="11" color="#60a5fa" delay={0.75} />
        <StatCard x={556} y={120} icon="👤" label="Kayıtlı Sporcu" value="2.4K" color="#4ade80" delay={1.0} />
        <StatCard x={556} y={266} icon="⏱️" label="Ort. Süre" value="3 Gün" color="#a78bfa" delay={1.25} />
      </Sprite>

      {/* ── 3) TURNUVA DETAYI  14.5–23 ── */}
      <Sprite start={14.5} end={23}>
        <Orb x={600} y={80} size={280} color={ACCENT} delay={0.1} />
        <TextSprite text="Turnuva Detayı" x={480} y={46} size={24}
          color={ACCENT} align="center" weight={800} letterSpacing="0.04em"
          entryDur={0.4} exitDur={0.4} />
        <TextSprite text="Tüm bilgilere tek ekrandan ulaş, hemen kayıt ol"
          x={480} y={88} size={13} color="rgba(244,162,97,0.55)"
          align="center" weight={500} entryDur={0.6} exitDur={0.35} />

        <Sprite start={14.5} end={23}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.1) / 0.6, 0, 1));
            return (
              <div style={{ opacity: op }}>
                <Phone x={74} y={108}>
                  <ScreenDetail />
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <FeatureCard x={352} y={118} icon="🗓️" title="Tarih & Yer" color={ACCENT} delay={0.4}
          desc="Turnuva takvimi, salon bilgisi ve oturma düzeni tek ekranda." />
        <FeatureCard x={568} y={118} icon="🥋" title="Kategoriler" color="#4ade80" delay={0.65}
          desc="Kata, Kumite ve yaş gruplarına göre filtreleme imkânı." />
        <FeatureCard x={352} y={308} icon="📋" title="Kayıt & Ödeme" color="#60a5fa" delay={0.9}
          desc="Güvenli ödeme entegrasyonu, anlık kayıt onayı." />
        <FeatureCard x={568} y={308} icon="🔔" title="Bildirimler" color="#a78bfa" delay={1.15}
          desc="Program değişikliği ve hatırlatmalar push notification ile." />
      </Sprite>

      {/* ── 4) SEYAHAT PLANLAMA  22.5–32 ── */}
      <Sprite start={22.5} end={32}>
        <TextSprite text="Seyahat Planlama" x={480} y={46} size={24}
          color={ACCENT} align="center" weight={800} letterSpacing="0.04em"
          entryDur={0.4} exitDur={0.4} />
        <TextSprite text="Otobüs · Tren · Uçak — en uygun rotayı bul"
          x={480} y={88} size={13} color="rgba(244,162,97,0.55)"
          align="center" weight={500} entryDur={0.6} exitDur={0.35} />

        <Sprite start={22.5} end={32}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.1) / 0.6, 0, 1));
            return (
              <div style={{ opacity: op }}>
                <Phone x={74} y={108}>
                  <ScreenTravel />
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <FeatureCard x={352} y={118} icon="🚌" title="Otobüs" color="#4ade80" delay={0.4}
          desc="Yurt içi otobüs hatları, en uygun fiyat karşılaştırması." />
        <FeatureCard x={568} y={118} icon="🚆" title="Tren" color="#60a5fa" delay={0.65}
          desc="TCDD entegrasyonu, hızlı tren ve normal sefer seçenekleri." />
        <FeatureCard x={352} y={308} icon="✈️" title="Uçak" color={ACCENT} delay={0.9}
          desc="Havayolu karşılaştırması, erken rezervasyon indirimleri." />
        <FeatureCard x={568} y={308} icon="🏨" title="Konaklama" color="#a78bfa" delay={1.15}
          desc="Turnuva mekânına yakın otel ve yurt önerileri." />
      </Sprite>

      {/* ── 5) HARİTA  31.5–41 ── */}
      <Sprite start={31.5} end={41}>
        <Orb x={700} y={100} size={240} color="#60a5fa" delay={0.1} />
        <TextSprite text="Turnuva Haritası" x={480} y={46} size={24}
          color={ACCENT} align="center" weight={800} letterSpacing="0.04em"
          entryDur={0.4} exitDur={0.4} />
        <TextSprite text="Türkiye genelinde tüm turnuva lokasyonlarını haritada gör"
          x={480} y={88} size={13} color="rgba(244,162,97,0.55)"
          align="center" weight={500} entryDur={0.6} exitDur={0.35} />

        <Sprite start={31.5} end={41}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.1) / 0.6, 0, 1));
            return (
              <div style={{ opacity: op }}>
                <Phone x={74} y={108}>
                  <ScreenMap />
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <StatCard x={352} y={120} icon="📍" label="Turnuva Şehri" value="11" color={ACCENT} delay={0.5} />
        <StatCard x={352} y={268} icon="🗺️" label="Harita Filtresi" value="Gerçek Zamanlı" color="#60a5fa" delay={0.75} />
        <StatCard x={548} y={120} icon="📏" label="Ortalama Mesafe" value="~420 km" color="#4ade80" delay={1.0} />
        <StatCard x={548} y={268} icon="⭐" label="Favori Şehir" value="İstanbul" color="#a78bfa" delay={1.25} />
      </Sprite>

      {/* ── 6) TEKNOLOJİ YIĞINI  40.5–50 ── */}
      <Sprite start={40.5} end={50}>
        <TextSprite text="Teknoloji Yığını" x={480} y={54} size={24}
          color={ACCENT} align="center" weight={800} letterSpacing="0.05em"
          entryDur={0.4} exitDur={0.4} />

        <Sprite start={40.5} end={50}>
          {({ localTime }) => {
            const op = Easing.easeOutCubic(clamp((localTime - 0.2) / 0.7, 0, 1));
            return (
              <div style={{ opacity: op }}>
                <Phone x={74} y={96}>
                  <div style={{
                    position: 'absolute', inset: 0, background: '#0d1520',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 10, padding: 12,
                  }}>
                    <div style={{ fontSize: 32 }}>📱</div>
                    <div style={{ color: '#f0f8ff', fontSize: 13, fontWeight: 800, textAlign: 'center' }}>
                      KarateKin Travel
                    </div>
                    <div style={{ color: `${ACCENT}cc`, fontSize: 10 }}>v0.9 · Beta</div>
                    <div style={{ width: '100%', height: 1, background: `${ACCENT}22` }} />
                    {[
                      ['React Native', '#61dafb'],
                      ['Expo SDK 50', '#ffffff'],
                      ['React Navigation', ACCENT],
                      ['Maps API', '#4ade80'],
                      ['AsyncStorage', '#a78bfa'],
                    ].map(([t, c]) => (
                      <div key={t} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        width: '100%',
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(200,220,255,0.8)', fontSize: 10 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </Phone>
              </div>
            );
          }}
        </Sprite>

        <TechChip x={356} y={108} label="React Native" color="#61dafb" delay={0.3} />
        <TechChip x={510} y={108} label="Expo"         color={ACCENT_SOFT} delay={0.5} />
        <TechChip x={356} y={168} label="Maps API"     color="#4ade80" delay={0.7} />
        <TechChip x={510} y={168} label="TypeScript"   color="#60a5fa" delay={0.9} />
        <TechChip x={356} y={228} label="React Nav."   color={ACCENT} delay={1.1} />
        <TechChip x={510} y={228} label="Zustand"      color="#a78bfa" delay={1.3} />
        <TechChip x={356} y={288} label="Axios"        color="#fb923c" delay={1.5} />
        <TechChip x={510} y={288} label="Jest"         color="#f87171" delay={1.7} />

        <Sprite start={40.5} end={50}>
          {({ localTime }) => {
            const op = fade(localTime, 9.5, 2.0, 0.6, 0.4);
            return (
              <div style={{
                position: 'absolute', left: 356, top: 360, width: 292,
                background: PANEL, border: `1px solid ${PANEL_BORDER}`,
                borderRadius: 14, padding: '12px 16px', opacity: op,
              }}>
                <div style={{ color: 'rgba(200,220,255,0.45)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Mimari
                </div>
                <div style={{ color: '#f4f8ff', fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
                  Cross-Platform Mobile
                </div>
                <div style={{ color: 'rgba(200,220,255,0.6)', fontSize: 12, lineHeight: 1.6 }}>
                  iOS ve Android için tek kod tabanı, Expo ile hızlı dağıtım.
                </div>
              </div>
            );
          }}
        </Sprite>
      </Sprite>

      {/* ── 7) KAPANIŞ  49.5–62 ── */}
      <Sprite start={49.5} end={62}>
        <Orb x={80}  y={100} size={240} color={ACCENT}  delay={0}   />
        <Orb x={660} y={60}  size={200} color={ACCENT2} delay={0.2} />

        <TextSprite text="KarateKin Travel" x={480} y={138} size={72}
          color={ACCENT} align="center" weight={900} letterSpacing="-0.03em"
          entryDur={0.65} exitDur={0.42} />

        {/* Divider line */}
        <Sprite start={49.5} end={62}>
          {({ localTime }) => {
            const w = interpolate([0.15, 0.95, 1.6], [0, 180, 290], Easing.easeInOutCubic)(localTime);
            const op = fade(localTime, 12.5, 0, 0.3, 0.4);
            return (
              <div style={{
                position: 'absolute', left: '50%', top: 224, width: w, height: 2,
                transform: 'translateX(-50%)',
                background: `linear-gradient(90deg,transparent,${ACCENT},transparent)`,
                borderRadius: 99, opacity: op,
              }} />
            );
          }}
        </Sprite>

        <TextSprite text="Karate turnuvaları için seyahat planlamanın en akıllı yolu"
          x={480} y={254} size={14} color="rgba(244,162,97,0.55)"
          align="center" weight={500} entryDur={0.95} exitDur={0.32} />

        <DevPill />

        <TextSprite text="github.com/mrtunahan"
          x={480} y={432} size={13} color="rgba(244,162,97,0.4)"
          align="center" weight={500} entryDur={1.1} exitDur={0.3} />

        {/* Feature pills */}
        <Sprite start={49.5} end={62}>
          {({ localTime }) => {
            const pills = ['🗺️ Harita', '✈️ Seyahat', '🥋 Turnuva', '🔔 Bildirim'];
            return (
              <div style={{
                position: 'absolute', left: '50%', top: 396,
                transform: 'translateX(-50%)',
                display: 'flex', gap: 10,
              }}>
                {pills.map((p, i) => {
                  const op = Easing.easeOutBack(clamp((localTime - 1.0 - i * 0.18) / 0.5, 0, 1));
                  return (
                    <div key={p} style={{
                      padding: '5px 12px', borderRadius: 999,
                      background: `${ACCENT}14`,
                      border: `1px solid ${ACCENT}44`,
                      color: ACCENT_SOFT, fontSize: 12, fontWeight: 700,
                      opacity: op, transform: `scale(${0.7 + op * 0.3})`,
                      whiteSpace: 'nowrap',
                    }}>{p}</div>
                  );
                })}
              </div>
            );
          }}
        </Sprite>
      </Sprite>
    </Stage>
  );
}
