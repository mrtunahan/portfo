import {
  Stage,
  Sprite,
  TextSprite,
  useSprite,
  clamp,
  Easing,
  interpolate,
} from './AnimCore';

/* ── Palette (mirrors the KaratekinTravel mockups) ────────────────────── */
const PRIMARY      = '#0093d9';   // sky blue (header / primary buttons)
const PRIMARY_DARK = '#0078b6';
const ACCENT       = '#f4a261';   // project warm tone
const ACCENT_DEEP  = '#e76f51';
const SUCCESS      = '#4ade80';
const DANGER       = '#ef4444';
const BG           = '#1c0d04';   // stage backdrop (deep warm)
const PANEL        = 'rgba(20, 12, 6, 0.78)';
const PANEL_BORDER = 'rgba(244, 162, 97, 0.18)';
const GRID         = 'rgba(244, 162, 97, 0.06)';
const TEXT         = '#1a2235';
const TEXT_SOFT    = '#5b6675';
const GRAY_L       = '#f5f7fb';
const GRAY         = '#e6ebf3';

/* ─────────── Animated stage background ─────────────────────────────── */
function AnimatedBackground() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 22%, rgba(244,162,97,0.22), transparent 30%), radial-gradient(circle at 82% 18%, rgba(231,111,81,0.15), transparent 26%), radial-gradient(circle at 50% 86%, rgba(0,147,217,0.18), transparent 36%), linear-gradient(180deg, #2a160a 0%, #140804 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          opacity: 0.85,
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
        left: x, top: y, width: size, height: size,
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
        left: '50%', top: 228, width, height: 2,
        transform: 'translateX(-50%)',
        background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
        borderRadius: 99,
        opacity,
      }}
    />
  );
}

/* ─────────── Phone mockup frame ──────────────────────────────────────── */
function PhoneFrame({
  x, y,
  width = 230, height = 470,
  delay = 0,
  slideFrom = 'right',
  tilt = 0,
  children,
}) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.55);
  const entryT = Easing.easeOutCubic(clamp((localTime - delay) / 0.7, 0, 1));
  const exitT = clamp((localTime - exitStart) / 0.45, 0, 1);
  const opacity = (localTime > delay ? clamp((localTime - delay) / 0.4, 0, 1) : 0) * (1 - exitT);
  const slideX = slideFrom === 'right' ? (1 - entryT) * 50 : -(1 - entryT) * 50;
  const slideY = (1 - entryT) * 14;

  return (
    <div
      style={{
        position: 'absolute',
        left: x, top: y, width, height,
        opacity,
        transform: `translate(${slideX}px, ${slideY}px) rotate(${tilt}deg)`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          borderRadius: 38,
          background: '#1a1d2e',
          padding: 6,
          boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 40px rgba(244,162,97,0.12)',
        }}
      >
        <div
          style={{
            width: '100%', height: '100%',
            borderRadius: 32,
            background: '#fff',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: 'absolute', top: 6, left: '50%',
              width: 70, height: 16,
              background: '#1a1d2e', borderRadius: 10,
              transform: 'translateX(-50%)', zIndex: 5,
            }}
          />
          {/* Status bar */}
          <div
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 18px', fontSize: 9, fontWeight: 700,
              color: TEXT, zIndex: 4, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            }}
          >
            <span>9:41</span>
            <span style={{ flex: 1 }} />
            <span>5G ▮▮▮</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, paddingTop: 24, overflow: 'hidden' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Reusable SVG illustrations ──────────────────────────────── */
function PaperPlaneIcon({ size = 64, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M58 6 L6 28 L26 36 L38 56 Z" fill={color} opacity="0.95" />
      <path d="M26 36 L58 6 L34 44 Z" fill={color} opacity="0.6" />
    </svg>
  );
}

function SailIllustration({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none">
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9d29d" />
          <stop offset="1" stopColor="#f4a261" />
        </linearGradient>
        <linearGradient id="sea1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0093d9" />
          <stop offset="1" stopColor="#005f8a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="130" height="80" fill="url(#sky1)" rx="14" />
      <rect x="0" y="80" width="130" height="50" fill="url(#sea1)" />
      <circle cx="98" cy="34" r="14" fill="#fff" opacity="0.7" />
      <path d="M58 92 L72 50 L84 92 Z" fill="#fff" />
      <path d="M64 92 L58 50 L50 92 Z" fill="#f4a261" />
      <rect x="40" y="92" width="50" height="6" fill="#3a1d0a" rx="2" />
      <path d="M0 100 Q32 95 65 100 T130 100 L130 130 L0 130 Z" fill="#0078b6" opacity="0.55" />
    </svg>
  );
}

function MountainIllustration({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none">
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd3a5" />
          <stop offset="1" stopColor="#f8a05e" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="130" height="130" fill="url(#sky2)" rx="14" />
      <circle cx="92" cy="44" r="16" fill="#fff8e6" />
      <path d="M0 110 L28 60 L52 95 L80 50 L110 90 L130 70 L130 130 L0 130 Z" fill="#3d1f00" />
      <path d="M0 120 L24 80 L46 105 L70 80 L96 110 L130 95 L130 130 L0 130 Z" fill="#5a2e0d" opacity="0.85" />
    </svg>
  );
}

function BalloonIllustration({ size = 130 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none">
      <defs>
        <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb98a" />
          <stop offset="1" stopColor="#e76f51" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="130" height="130" fill="url(#sky3)" rx="14" />
      <ellipse cx="38" cy="46" rx="22" ry="26" fill="#f4a261" />
      <ellipse cx="38" cy="46" rx="8" ry="26" fill="#e76f51" />
      <rect x="32" y="72" width="12" height="8" fill="#3a1d0a" rx="1" />
      <ellipse cx="90" cy="62" rx="14" ry="17" fill="#0093d9" />
      <ellipse cx="90" cy="62" rx="5" ry="17" fill="#0078b6" />
      <rect x="86" y="80" width="8" height="6" fill="#3a1d0a" rx="1" />
      <path d="M0 100 L130 90 L130 130 L0 130 Z" fill="#3d1f00" opacity="0.7" />
    </svg>
  );
}

/* ─────────── Phone screen contents ───────────────────────────────────── */

function SplashScreen() {
  const { localTime } = useSprite();
  const planeBob = Math.sin(localTime * 1.6) * 4;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #0093d9 0%, #0078b6 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      paddingTop: 24,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: 22,
        background: 'rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${planeBob}px)`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      }}>
        <PaperPlaneIcon size={50} color="#fff" />
      </div>
      <div style={{ marginTop: 22, color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
        Karatekin Travel
      </div>
      <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}>
        MOBILE APP
      </div>
    </div>
  );
}

function OnboardingScreen({ Illustration, title, highlight, subtitle, page = 0 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '18px 22px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <Illustration size={150} />
      </div>
      <div style={{ marginTop: 28, color: TEXT, fontSize: 19, fontWeight: 800, lineHeight: 1.25 }}>
        {title}{' '}
        <span style={{ color: ACCENT }}>{highlight}</span>
      </div>
      <div style={{ marginTop: 12, color: TEXT_SOFT, fontSize: 11, lineHeight: 1.55 }}>
        {subtitle}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: i === page ? 18 : 6, height: 6,
            borderRadius: 3,
            background: i === page ? PRIMARY : '#d4dbe6',
            transition: 'width 200ms',
          }}/>
        ))}
      </div>
      <button style={{
        width: '100%', padding: '11px 0', borderRadius: 8,
        background: PRIMARY, color: '#fff',
        border: 'none', fontSize: 13, fontWeight: 700,
      }}>
        Devam Et
      </button>
    </div>
  );
}

function LoginScreen() {
  const { localTime } = useSprite();
  const focusPulse = 0.6 + Math.sin(localTime * 3) * 0.4;
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '24px 22px' }}>
      <div style={{ color: TEXT, fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>
        Şimdi <span style={{ color: PRIMARY }}>Giriş Yap!</span>
      </div>
      <div style={{ marginTop: 4, color: TEXT_SOFT, fontSize: 10 }}>Hesabınla devam et</div>

      <div style={{ marginTop: 22 }}>
        <div style={{ color: TEXT_SOFT, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 5 }}>E-POSTA</div>
        <div style={{
          height: 36, background: GRAY_L, borderRadius: 8,
          padding: '0 12px', display: 'flex', alignItems: 'center',
          fontSize: 11, color: TEXT, border: `1px solid ${PRIMARY}${Math.round(focusPulse * 255).toString(16).padStart(2,'0')}`,
        }}>
          tunahankorkmaz6@gmail.com
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ color: TEXT_SOFT, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 5 }}>ŞİFRE</div>
        <div style={{
          height: 36, background: GRAY_L, borderRadius: 8,
          padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 11, color: TEXT,
        }}>
          <span style={{ letterSpacing: 4 }}>{'••••••••'}</span>
          <span style={{ fontSize: 10, color: TEXT_SOFT }}>👁</span>
        </div>
      </div>

      <div style={{ marginTop: 8, textAlign: 'right', color: PRIMARY, fontSize: 10, fontWeight: 600 }}>
        Şifremi Unuttum?
      </div>

      <button style={{
        marginTop: 18, width: '100%', padding: '11px 0', borderRadius: 8,
        background: PRIMARY, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
      }}>
        Giriş Yap
      </button>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, color: TEXT_SOFT, fontSize: 10 }}>
        <div style={{ flex: 1, height: 1, background: GRAY }} />
        veya
        <div style={{ flex: 1, height: 1, background: GRAY }} />
      </div>

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {['#4267B2', '#1DA1F2', '#DB4437'].map((c, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: c, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 800,
          }}>{['f', 't', 'G'][i]}</div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 18, left: 22, right: 22, textAlign: 'center', fontSize: 10, color: TEXT_SOFT }}>
        Hesabın yok mu? <span style={{ color: PRIMARY, fontWeight: 700 }}>Kayıt Ol</span>
      </div>
    </div>
  );
}

const TOUR_CARDS = [
  { name: 'Amasra Turu',     city: 'Bartın',     price: '₺1.450', img: 'linear-gradient(135deg, #f4a261, #e76f51)' },
  { name: 'Kapadokya Turu',  city: 'Nevşehir',   price: '₺2.890', img: 'linear-gradient(135deg, #f9c97b, #c4581c)' },
  { name: 'Karadeniz Yaylaları', city: 'Rize',  price: '₺3.250', img: 'linear-gradient(135deg, #4ade80, #186a3b)' },
  { name: 'Pamukkale',       city: 'Denizli',    price: '₺1.890', img: 'linear-gradient(135deg, #b8e8ff, #0093d9)' },
];

function HomeScreen() {
  const { localTime } = useSprite();
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fafbff', overflow: 'hidden' }}>
      {/* Hero header */}
      <div style={{
        padding: '14px 18px 12px',
        background: 'linear-gradient(160deg, #f4a261 0%, #e76f51 100%)',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
          <span style={{ opacity: 0.85 }}>Hoş geldin,</span>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4, lineHeight: 1.1 }}>
          Güzel Dünyamızı
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2, lineHeight: 1.1, color: '#fff8e6' }}>
          keşfedin!
        </div>
        <div style={{
          marginTop: 12, background: 'rgba(255,255,255,0.95)',
          borderRadius: 22, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          color: TEXT_SOFT, fontSize: 11,
        }}>
          <span style={{ color: PRIMARY }}>⌕</span>
          Nereye gitmek istersin?
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: TEXT, fontSize: 12, fontWeight: 800 }}>Öne Çıkan Geziler</span>
          <span style={{ color: PRIMARY, fontSize: 9, fontWeight: 700 }}>Tümü →</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          {TOUR_CARDS.slice(0, 2).map((t, i) => {
            const cardT = clamp((localTime - 0.3 - i * 0.15) / 0.5, 0, 1);
            const op = Easing.easeOutCubic(cardT);
            return (
              <div key={t.name} style={{
                flex: 1, minWidth: 0,
                borderRadius: 12, overflow: 'hidden',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                opacity: op, transform: `translateY(${(1 - op) * 16}px)`,
              }}>
                <div style={{ height: 78, background: t.img }} />
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: TEXT }}>{t.name}</div>
                  <div style={{ fontSize: 9, color: TEXT_SOFT, marginTop: 2 }}>{t.city}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT_DEEP, marginTop: 4 }}>{t.price}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <span style={{ color: TEXT, fontSize: 12, fontWeight: 800 }}>Önerilen</span>
          <span style={{ color: PRIMARY, fontSize: 9, fontWeight: 700 }}>Tümü →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOUR_CARDS.slice(2).map((t, i) => {
            const cardT = clamp((localTime - 0.8 - i * 0.18) / 0.5, 0, 1);
            const op = Easing.easeOutCubic(cardT);
            return (
              <div key={t.name} style={{
                display: 'flex', gap: 8, background: '#fff',
                borderRadius: 10, padding: 6,
                boxShadow: '0 3px 8px rgba(0,0,0,0.04)',
                opacity: op, transform: `translateX(${(1 - op) * 22}px)`,
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: t.img }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: TEXT }}>{t.name}</div>
                  <div style={{ fontSize: 9, color: TEXT_SOFT, marginTop: 1 }}>{t.city}</div>
                  <div style={{ fontSize: 9, color: ACCENT_DEEP, fontWeight: 700, marginTop: 2 }}>{t.price}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom tab bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 46, background: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        fontSize: 16,
      }}>
        <span style={{ fontSize: 9, color: PRIMARY, fontWeight: 700 }}>Ana Sayfa</span>
        <span style={{ fontSize: 9, color: TEXT_SOFT, fontWeight: 700 }}>Ara</span>
        <span style={{
          width: 32, height: 32, borderRadius: '50%',
          background: ACCENT, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: -16, fontSize: 16,
          boxShadow: '0 4px 12px rgba(244,162,97,0.5)',
        }}>+</span>
        <span style={{ fontSize: 9, color: TEXT_SOFT, fontWeight: 700 }}>Favoriler</span>
        <span style={{ fontSize: 9, color: TEXT_SOFT, fontWeight: 700 }}>Profil</span>
      </div>
    </div>
  );
}

function TourDetailScreen() {
  const { localTime } = useSprite();
  const barWidth = interpolate([0, 1.4], [0, 142], Easing.easeInOutCubic)(localTime);
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden' }}>
      {/* Hero image */}
      <div style={{
        height: 160,
        background: 'linear-gradient(160deg, #f4a261 0%, #e76f51 50%, #c4581c 100%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 36, left: 14,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>←</div>
        <div style={{
          position: 'absolute', top: 36, right: 14,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
        }}>♡</div>
        {/* Stylized waves */}
        <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} viewBox="0 0 230 30" preserveAspectRatio="none">
          <path d="M0 20 Q60 8 115 18 T230 14 L230 30 L0 30 Z" fill="#fff" />
        </svg>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <div style={{ color: TEXT, fontSize: 16, fontWeight: 800 }}>Amasra Turu</div>
        <div style={{ color: TEXT_SOFT, fontSize: 10, marginTop: 2 }}>Bartın · 2 Gün 1 Gece</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} style={{ color: i <= 4 ? '#f5b400' : '#ddd', fontSize: 11 }}>★</span>
          ))}
          <span style={{ color: TEXT_SOFT, fontSize: 9, marginLeft: 4 }}>4.8 · 124 yorum</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {[
            { label: 'Otobüs' },
            { label: 'Otel' },
            { label: 'Yemek' },
            { label: 'Rehber' },
          ].map((it) => (
            <div key={it.label} style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              background: GRAY_L,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 12 }}>{it.ico}</span>
              <span style={{ fontSize: 8, color: TEXT_SOFT, fontWeight: 700 }}>{it.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: TEXT, fontWeight: 700 }}>Tur Hakkında</div>
        <div style={{ marginTop: 6, fontSize: 9, color: TEXT_SOFT, lineHeight: 1.55 }}>
          Karadeniz'in incisi Amasra'yı keşfetmeye hazır mısın? Tarihi sokakları, mavi
          koylar ve eşsiz lezzetler seni bekliyor.
        </div>

        <div style={{ marginTop: 14, padding: '8px 10px', background: GRAY_L, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: TEXT_SOFT, fontWeight: 700, marginBottom: 4 }}>
            <span>Doluluk</span><span>{Math.round(barWidth / 1.6)}%</span>
          </div>
          <div style={{ height: 5, background: '#fff', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: barWidth, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DEEP})` }} />
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 12, left: 14, right: 14,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div>
          <div style={{ fontSize: 8, color: TEXT_SOFT, fontWeight: 700 }}>KİŞİ BAŞI</div>
          <div style={{ fontSize: 16, color: ACCENT_DEEP, fontWeight: 800 }}>₺1.450</div>
        </div>
        <div style={{
          flex: 1, marginLeft: 8, padding: '10px 0',
          background: PRIMARY, color: '#fff',
          borderRadius: 10, textAlign: 'center',
          fontSize: 12, fontWeight: 700,
          boxShadow: '0 4px 14px rgba(0,147,217,0.45)',
        }}>
          Rezerve Et →
        </div>
      </div>
    </div>
  );
}

function CalendarScreen() {
  const { localTime } = useSprite();
  // Highlight a date range progressively
  const days = Array.from({ length: 35 }, (_, i) => i - 2); // grid offset
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 18px', background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: TEXT, fontSize: 13, fontWeight: 800 }}>Takvim</span>
        <span style={{ color: PRIMARY, fontSize: 11 }}>✕</span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: TEXT_SOFT, fontSize: 12 }}>‹</span>
        <span style={{ color: TEXT, fontSize: 13, fontWeight: 800 }}>Haziran 2026</span>
        <span style={{ color: TEXT_SOFT, fontSize: 12 }}>›</span>
      </div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', color: TEXT_SOFT, fontSize: 9, fontWeight: 700, paddingBottom: 4 }}>{d}</div>
        ))}
        {days.map((d, i) => {
          const day = d + 1;
          const valid = day >= 1 && day <= 30;
          const startDay = 14, endDay = 17;
          const rangeReveal = clamp(localTime / 1.2, 0, 1);
          const inRange = valid && day >= startDay && day <= Math.round(startDay + (endDay - startDay) * rangeReveal);
          const isStart = day === startDay;
          const isEnd = day === Math.round(startDay + (endDay - startDay) * rangeReveal);
          return (
            <div key={i} style={{
              aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              color: !valid ? '#d4dbe6' : inRange ? '#fff' : TEXT,
              background: inRange ? (isStart || isEnd ? PRIMARY : 'rgba(0,147,217,0.3)') : 'transparent',
              borderRadius: isStart ? '6px 0 0 6px' : isEnd ? '0 6px 6px 0' : inRange ? 0 : 6,
            }}>
              {valid ? day : ''}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 18, padding: 12, background: GRAY_L, borderRadius: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TEXT_SOFT, fontWeight: 700 }}>
          <span>Giriş</span><span>Çıkış</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 13, color: TEXT, fontWeight: 800 }}>
          <span>14 Haz</span>
          <span style={{ color: TEXT_SOFT, fontWeight: 500 }}>→</span>
          <span>17 Haz</span>
        </div>
      </div>
      <button style={{
        position: 'absolute', bottom: 18, left: 18, right: 18,
        padding: '11px 0', borderRadius: 8,
        background: PRIMARY, color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
      }}>
        Tarihleri Onayla
      </button>
    </div>
  );
}

function PaymentScreen() {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 18px', background: '#fff' }}>
      <div style={{ color: TEXT, fontSize: 13, fontWeight: 800 }}>Ödeme Bilgileri</div>
      <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #2d3a5f, #1a2235)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
          <span style={{ opacity: 0.7 }}>VISA</span>
          <span style={{ opacity: 0.7 }}>★★★★</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 13, letterSpacing: 2, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          5283 •••• •••• 4942
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 8, opacity: 0.6 }}>KART SAHİBİ</div>
            <div style={{ fontSize: 10, fontWeight: 700 }}>TUNAHAN KORKMAZ</div>
          </div>
          <div>
            <div style={{ fontSize: 8, opacity: 0.6 }}>S.TAR</div>
            <div style={{ fontSize: 10, fontWeight: 700 }}>05/29</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, fontSize: 11, color: TEXT, fontWeight: 700 }}>Sipariş Özeti</div>
      {[
        ['Amasra Turu', '₺1.450'],
        ['Tur Sigortası', '₺75'],
        ['Hizmet Bedeli', '₺25'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: TEXT_SOFT }}>
          <span>{k}</span><span style={{ color: TEXT, fontWeight: 700 }}>{v}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px dashed ${GRAY}`, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: TEXT, fontWeight: 800 }}>Toplam</span>
        <span style={{ fontSize: 14, color: ACCENT_DEEP, fontWeight: 800 }}>₺1.550</span>
      </div>
      <button style={{
        position: 'absolute', bottom: 18, left: 18, right: 18,
        padding: '11px 0', borderRadius: 8,
        background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DEEP})`,
        color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
        boxShadow: '0 6px 18px rgba(231,111,81,0.5)',
      }}>
        Ödemeyi Tamamla
      </button>
    </div>
  );
}

function TicketScreen() {
  const { localTime } = useSprite();
  const reveal = clamp(localTime / 0.6, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(160deg, #4ade80 0%, #16a34a 100%)',
      padding: '24px 18px', color: '#fff',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto', fontSize: 26, fontWeight: 800,
        transform: `scale(${reveal})`,
      }}>
        ✓
      </div>
      <div style={{ marginTop: 12, textAlign: 'center', fontSize: 16, fontWeight: 800 }}>Rezervasyon Onaylandı!</div>
      <div style={{ marginTop: 4, textAlign: 'center', fontSize: 10, opacity: 0.85 }}>QR kodunu rehbere göster</div>

      <div style={{ marginTop: 18, background: '#fff', borderRadius: 14, padding: 14, color: TEXT }}>
        {/* QR */}
        <div style={{
          width: 96, height: 96, margin: '0 auto',
          background: '#fff', position: 'relative',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 1.5, height: '100%' }}>
            {Array.from({ length: 100 }).map((_, i) => {
              const row = Math.floor(i / 10), col = i % 10;
              const corner = (row < 3 && col < 3) || (row < 3 && col > 6) || (row > 6 && col < 3);
              const cornerInner = (row >= 1 && row <= 1 && col >= 1 && col <= 1) || (row === 1 && col === 8) || (row === 8 && col === 1);
              const seed = (i * 9301 + 49297) % 233280;
              const on = corner || cornerInner || (seed % 5 < 2);
              return <div key={i} style={{ background: on ? '#1a2235' : 'transparent' }}/>;
            })}
          </div>
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: TEXT, fontWeight: 800 }}>Amasra Turu</div>
        <div style={{ marginTop: 2, textAlign: 'center', fontSize: 9, color: TEXT_SOFT }}>14 Haziran 2026 · 08:00</div>
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${GRAY}`, display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
          <div>
            <div style={{ color: TEXT_SOFT, fontWeight: 700 }}>YOLCU</div>
            <div style={{ color: TEXT, fontWeight: 800 }}>T. Korkmaz</div>
          </div>
          <div>
            <div style={{ color: TEXT_SOFT, fontWeight: 700 }}>KOLTUK</div>
            <div style={{ color: TEXT, fontWeight: 800 }}>14A</div>
          </div>
          <div>
            <div style={{ color: TEXT_SOFT, fontWeight: 700 }}>KOD</div>
            <div style={{ color: ACCENT_DEEP, fontWeight: 800 }}>KT4942</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatScreen() {
  const { localTime } = useSprite();
  const messages = [
    { from: 'them', text: 'Merhaba! Amasra Turu için sorularınız var mı?', t: 0.2 },
    { from: 'me',   text: 'Otelde kahvaltı dahil mi acaba?',                 t: 0.9 },
    { from: 'them', text: 'Evet, sabah kahvaltısı ve akşam yemeği dahildir.', t: 1.6 },
    { from: 'me',   text: 'Harika! Rezervasyon yapıyorum 🙏',                t: 2.4 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f5f7fb' }}>
      <div style={{
        padding: '12px 16px', background: '#fff',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${GRAY}`,
      }}>
        <span style={{ color: PRIMARY, fontSize: 14 }}>←</span>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DEEP})` }} />
        <div>
          <div style={{ fontSize: 11, color: TEXT, fontWeight: 800 }}>Karatekin Tur</div>
          <div style={{ fontSize: 9, color: SUCCESS, fontWeight: 700 }}>● Çevrimiçi</div>
        </div>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => {
          const t = clamp((localTime - m.t) / 0.4, 0, 1);
          if (t <= 0) return null;
          const op = Easing.easeOutCubic(t);
          const dy = (1 - op) * 10;
          return (
            <div key={i} style={{
              alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
              maxWidth: '78%',
              background: m.from === 'me' ? PRIMARY : '#fff',
              color: m.from === 'me' ? '#fff' : TEXT,
              padding: '7px 12px',
              borderRadius: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              fontSize: 10, lineHeight: 1.4,
              opacity: op, transform: `translateY(${dy}px)`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {m.text}
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 10, background: '#fff', borderTop: `1px solid ${GRAY}`,
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <div style={{ flex: 1, background: GRAY_L, borderRadius: 18, padding: '6px 12px', fontSize: 10, color: TEXT_SOFT }}>
          Mesaj yaz...
        </div>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>→</div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f5f7fb' }}>
      <div style={{
        height: 130, background: `linear-gradient(160deg, ${ACCENT}, ${ACCENT_DEEP})`,
        position: 'relative',
      }} />
      <div style={{
        position: 'absolute', top: 84, left: '50%', transform: 'translateX(-50%)',
        width: 72, height: 72, borderRadius: '50%',
        background: '#fff', padding: 3,
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'linear-gradient(135deg, #b8e8ff, #0093d9)',
        }}/>
      </div>
      <div style={{ marginTop: 84, textAlign: 'center', color: TEXT, fontSize: 14, fontWeight: 800 }}>Tunahan</div>
      <div style={{ textAlign: 'center', color: TEXT_SOFT, fontSize: 10 }}>Premium Üye · 5 Tur</div>

      <div style={{ display: 'flex', gap: 6, padding: '14px 14px 0', justifyContent: 'space-around' }}>
        {[['12', 'Tur'], ['28', 'Şehir'], ['4.9', 'Puan']].map(([n, l]) => (
          <div key={l} style={{ flex: 1, padding: 10, background: '#fff', borderRadius: 10, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 14, color: ACCENT_DEEP, fontWeight: 800 }}>{n}</div>
            <div style={{ fontSize: 9, color: TEXT_SOFT, fontWeight: 700 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 14px 0' }}>
        {[
          ['Profil Bilgileri'],
          ['Ödeme Yöntemleri'],
          ['Favori Turlar'],
          ['Bildirimler'],
          ['Ayarlar'],
        ].map(([ico, label]) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', background: '#fff',
            borderRadius: 8, marginBottom: 4,
            fontSize: 10, color: TEXT, fontWeight: 600,
          }}>
            <span style={{ fontSize: 12 }}>{ico}</span>
            <span style={{ flex: 1 }}>{label}</span>
            <span style={{ color: TEXT_SOFT }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Feature callout card ────────────────────────────────────── */
function FeatureCard({ x, y, title, body, icon, accent = ACCENT, delay = 0 }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const entryT = Easing.easeOutBack(clamp((localTime - delay) / 0.55, 0, 1));
  const exitT = clamp((localTime - exitStart) / 0.4, 0, 1);
  const opacity = (localTime > delay ? clamp((localTime - delay) / 0.3, 0, 1) : 0) * (1 - exitT);
  const rise = (1 - entryT) * 22;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: 240,
      padding: '14px 16px',
      background: 'rgba(20, 12, 6, 0.84)',
      border: `1px solid ${accent}44`,
      borderRadius: 14,
      boxShadow: `0 16px 38px ${accent}22`,
      opacity, transform: `translateY(${rise}px)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ color: '#fff7ee', fontSize: 13, fontWeight: 800 }}>{title}</div>
      </div>
      <div style={{ color: 'rgba(255,236,210,0.66)', fontSize: 11, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

/* ─────────── Tech chip (reused style) ────────────────────────────────── */
function TechChip({ x, y, label, color, delay }) {
  const { localTime, duration } = useSprite();
  const exitStart = Math.max(0, duration - 0.5);
  const t = Easing.easeOutElastic(clamp((localTime - delay) / 0.7, 0, 1));
  const exitT = clamp((localTime - exitStart) / 0.4, 0, 1);
  const scale = localTime > delay ? 0.6 + t * 0.4 : 0;
  const opacity = localTime > delay ? Math.min(1, (localTime - delay) / 0.25) * (1 - exitT) : 0;
  return (
    <>
      <div style={{
        position: 'absolute', left: x, top: y, width: 138, height: 46,
        background: `${color}14`, borderRadius: 12,
        border: `1px solid ${color}44`,
        opacity, transform: `scale(${scale})`, transformOrigin: 'center',
      }}/>
      <div style={{
        position: 'absolute', left: x + 18, top: y + 14, color,
        fontSize: 14, fontWeight: 700,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace', opacity,
      }}>{label}</div>
    </>
  );
}

/* ─────────── Closing panel ───────────────────────────────────────────── */
function ClosingPanel() {
  const { localTime } = useSprite();
  const entryT = Easing.easeOutCubic(clamp((localTime - 0.12) / 0.8, 0, 1));
  const opacity = clamp((localTime - 0.12) / 0.5, 0, 1);
  const rise = (1 - entryT) * 26;
  return (
    <>
      <div style={{
        position: 'absolute', left: 250, top: 252, width: 460, height: 148,
        background: 'rgba(20, 12, 6, 0.86)', borderRadius: 20,
        border: `1px solid ${PANEL_BORDER}`,
        boxShadow: '0 24px 48px rgba(0,0,0,0.32)',
        opacity, transform: `translateY(${rise}px)`,
      }} />
      <div style={{
        position: 'absolute', left: 290, top: 282,
        color: 'rgba(255,236,210,0.55)', fontSize: 12,
        letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, opacity,
      }}>Mobile App · React Native</div>
      <div style={{
        position: 'absolute', left: 290, top: 315,
        color: '#fff7ee', fontSize: 30, fontWeight: 800, opacity,
      }}>KaratekinTravel</div>
      <div style={{
        position: 'absolute', left: 290, top: 356,
        color: ACCENT, fontSize: 13, opacity,
      }}>Keşfet · Rezerve Et · Yola Çık</div>
    </>
  );
}

/* ─────────── Main demo ───────────────────────────────────────────────── */
export default function KaratekinTravelDemo() {
  return (
    <Stage
      width={960}
      height={540}
      duration={60}
      background={BG}
      persistKey="karatekin-travel-demo"
      loop={false}
      autoplay
    >
      <AnimatedBackground />

      {/* 1) Hero — 0 → 7 */}
      <Sprite start={0} end={7}>
        <GlowOrb x={80} y={120} size={220} color={ACCENT} delay={0.05} />
        <GlowOrb x={720} y={90} size={180} color={ACCENT_DEEP} delay={0.2} />
        <TextSprite
          text="KaratekinTravel"
          x={480} y={138} size={66}
          color={ACCENT} align="center" weight={800}
          letterSpacing="-0.03em"
          entryDur={0.65} exitDur={0.42}
        />
        <HeroLine />
        <TextSprite
          text="Karatekin Üniversitesi · Mobil Seyahat Asistanı"
          x={480} y={252} size={18}
          color="#fff7ee" align="center" weight={600}
          letterSpacing="0.06em"
          entryDur={0.75} exitDur={0.36}
        />
        <TextSprite
          text="Yurt içi turları keşfet, rezerve et ve dijital biletini al"
          x={480} y={296} size={14}
          color="rgba(255,236,210,0.6)" align="center" weight={500}
          letterSpacing="0.01em"
          entryDur={0.95} exitDur={0.32}
        />
        {/* Live pill */}
        <div style={{ position: 'absolute', top: 376, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{
            padding: '7px 18px', borderRadius: 999,
            background: 'rgba(244,162,97,0.15)',
            border: `1px solid ${ACCENT}55`,
            color: ACCENT, fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: ACCENT,
              boxShadow: `0 0 10px ${ACCENT}`,
            }}/>
            React Native · Expo · iOS & Android
          </div>
        </div>
      </Sprite>

      {/* 2) Splash + Onboarding — 6.5 → 14 */}
      <Sprite start={6.5} end={14}>
        <TextSprite
          text="Karşılama Akışı"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <TextSprite
          text="Splash → 3 tanıtım ekranı → giriş"
          x={480} y={78} size={13}
          color="rgba(255,236,210,0.6)" align="center" weight={500}
          letterSpacing="0.04em" entryDur={0.55} exitDur={0.35}
        />
        <PhoneFrame x={130} y={100} delay={0.3} slideFrom="left" tilt={-3}>
          <SplashScreen />
        </PhoneFrame>
        <PhoneFrame x={370} y={92} delay={0.55} tilt={0}>
          <OnboardingScreen
            Illustration={SailIllustration}
            title="Hayat kısa,"
            highlight="dünya geniş!"
            subtitle="Karadeniz'in kıyılarından İç Anadolu'nun bozkırlarına, yeni rotalar seni bekliyor."
            page={0}
          />
        </PhoneFrame>
        <PhoneFrame x={610} y={108} delay={0.8} tilt={3}>
          <OnboardingScreen
            Illustration={MountainIllustration}
            title="Dağları ve"
            highlight="koyları keşfet"
            subtitle="Her bütçeye uygun, organize edilmiş turlarla yeni yerler keşfetmeye hazır ol."
            page={1}
          />
        </PhoneFrame>
      </Sprite>

      {/* 3) Auth — 13.5 → 21 */}
      <Sprite start={13.5} end={21}>
        <TextSprite
          text="Güvenli Kimlik Doğrulama"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={290} y={64} delay={0.3} slideFrom="left">
          <OnboardingScreen
            Illustration={BalloonIllustration}
            title="İnsanlar yola"
            highlight="çıkmaz, yol insanı götürür"
            subtitle="Hesabını oluştur ve yolculuğa başla."
            page={2}
          />
        </PhoneFrame>
        <PhoneFrame x={540} y={64} delay={0.55}>
          <LoginScreen />
        </PhoneFrame>
        <FeatureCard
          x={26} y={234} delay={0.95}
          accent={ACCENT}
          title="E-posta + Sosyal Giriş"
          body="Facebook, Twitter ve Google ile tek dokunuşta giriş; e-posta doğrulama akışı."
        />
      </Sprite>

      {/* 4) Home / Discover — 20.5 → 29 */}
      <Sprite start={20.5} end={29}>
        <TextSprite
          text="Güzel Dünyamızı Keşfet"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={360} y={64} delay={0.3}>
          <HomeScreen />
        </PhoneFrame>
        <FeatureCard
          x={40} y={130} delay={0.7}
          accent={ACCENT}
          title="Kişiselleştirilmiş Öneriler"
          body="Konum, geçmiş rezervasyon ve favorilerine göre öne çıkan turlar."
        />
        <FeatureCard
          x={690} y={130} delay={0.9}
          accent={PRIMARY}
          title="Hızlı Arama"
          body="Şehir, tarih ve bütçeye göre anlık filtreleme; yatay kaydırılabilir kategoriler."
        />
        <FeatureCard
          x={690} y={290} delay={1.1}
          accent={SUCCESS}
          title="Şeffaf Fiyatlar"
          body="Kişi başı fiyat ve doluluk oranı kartın üzerinde; gizli ücret yok."
        />
      </Sprite>

      {/* 5) Tour Detail — 28.5 → 36 */}
      <Sprite start={28.5} end={36}>
        <TextSprite
          text="Tur Detayları"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={360} y={64} delay={0.3}>
          <TourDetailScreen />
        </PhoneFrame>
        <FeatureCard
          x={40} y={130} delay={0.7}
          accent={ACCENT}
          title="Zengin Tur Sayfası"
          body="Galeri, açıklama, içerikler (otobüs, otel, yemek, rehber) ve gerçek yorumlar."
        />
        <FeatureCard
          x={40} y={300} delay={0.95}
          accent="#f5b400"
          title="Yorum ve Puanlama"
          body="Doğrulanmış yolcu yorumları; ortalama puan ve detaylı kırılım."
        />
        <FeatureCard
          x={690} y={200} delay={1.15}
          accent={SUCCESS}
          title="Anlık Doluluk"
          body="Kalan koltuk sayısı ve doluluk oranı canlı güncellenir."
        />
      </Sprite>

      {/* 6) Calendar + Booking — 35.5 → 43 */}
      <Sprite start={35.5} end={43}>
        <TextSprite
          text="Tarih Seç & Rezerve Et"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={360} y={64} delay={0.3}>
          <CalendarScreen />
        </PhoneFrame>
        <FeatureCard
          x={40} y={140} delay={0.7}
          accent={PRIMARY}
          title="Aralık Seçimi"
          body="Giriş ve çıkış tarihini tek bir takvimden seç; aralık görsel olarak vurgulanır."
        />
        <FeatureCard
          x={40} y={310} delay={0.95}
          accent={ACCENT}
          title="Yolcu ve Koltuk"
          body="Kişi sayısı, koltuk tercihi ve iletişim bilgilerini tek formda topla."
        />
      </Sprite>

      {/* 7) Payment + Ticket — 42.5 → 50 */}
      <Sprite start={42.5} end={50}>
        <TextSprite
          text="Ödeme ve Dijital Bilet"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={210} y={64} delay={0.3} slideFrom="left" tilt={-2}>
          <PaymentScreen />
        </PhoneFrame>
        <PhoneFrame x={520} y={64} delay={0.6} tilt={2}>
          <TicketScreen />
        </PhoneFrame>
        <FeatureCard
          x={760} y={220} delay={1.0}
          icon="QR" accent={SUCCESS}
          title="QR Kod Bilet"
          body="Rezervasyon onaylandığında bilet cüzdana eklenir; tarayıcıya gerek yok."
        />
      </Sprite>

      {/* 8) Chat + Profile — 49.5 → 56 */}
      <Sprite start={49.5} end={56}>
        <TextSprite
          text="Mesajlar & Profil"
          x={480} y={42} size={24}
          color={ACCENT} align="center" weight={800}
          letterSpacing="0.05em" entryDur={0.4} exitDur={0.4}
        />
        <PhoneFrame x={210} y={64} delay={0.3} slideFrom="left" tilt={-2}>
          <ChatScreen />
        </PhoneFrame>
        <PhoneFrame x={520} y={64} delay={0.55} tilt={2}>
          <ProfileScreen />
        </PhoneFrame>
        <FeatureCard
          x={760} y={200} delay={1.0}
          accent={PRIMARY}
          title="Anlık Mesajlaşma"
          body="Tur operatörüyle doğrudan iletişim; bildirim destekli, hızlı yanıt."
        />
      </Sprite>

      {/* 9) Closing + Tech — 55.5 → 60 */}
      <Sprite start={55.5} end={60}>
        <GlowOrb x={300} y={220} size={360} color={ACCENT} delay={0} />
        <TextSprite
          text="KaratekinTravel"
          x={480} y={120} size={44}
          color={ACCENT} align="center" weight={800}
          letterSpacing="-0.03em"
          entryDur={0.45} exitDur={0.4}
        />
        <TechChip x={244} y={186} label="React Native"  color="#61dafb" delay={0.3} />
        <TechChip x={400} y={186} label="Expo"          color="#a78bfa" delay={0.45} />
        <TechChip x={556} y={186} label="React Nav"     color="#38bdf8" delay={0.6} />
        <ClosingPanel />
      </Sprite>
    </Stage>
  );
}
