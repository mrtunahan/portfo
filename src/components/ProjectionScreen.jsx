import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { PROJECTS } from '../data/projects';

/* ─── Proje detay dokusu ─── */
function makeProjectDetailTex(project) {
  const W = 640, H = 400;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Arka plan degradesi
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0a0f1e');
  grad.addColorStop(1, '#0d1520');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Üst renk şeridi
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, W, 6);

  // Sol kenar vurgu
  ctx.fillStyle = project.color + '33';
  ctx.fillRect(0, 0, 8, H);

  // Proje adı
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(project.name, W / 2, 68);

  // URL veya alt bilgi
  if (project.displayUrl) {
    ctx.fillStyle = project.color;
    ctx.font = '16px monospace';
    ctx.fillText('🌐  ' + project.url, W / 2, 105);
  } else if (project.subTitle) {
    ctx.fillStyle = project.color + 'dd';
    ctx.font = 'bold 15px Arial';
    ctx.fillText(project.subTitle, W / 2, 105);
  } else {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('🚧  Geliştirme Aşamasında', W / 2, 105);
  }

  // Ayırıcı çizgi
  ctx.strokeStyle = project.color + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 124); ctx.lineTo(W - 50, 124);
  ctx.stroke();

  // Açıklama satırları
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px Arial';
  project.screenDesc.forEach((line, i) => ctx.fillText(line, W / 2, 160 + i * 30));

  // Tech stack başlığı
  ctx.fillStyle = project.color + 'aa';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('TECH STACK', W / 2, 268);

  ctx.fillStyle = project.color;
  ctx.font = '15px monospace';
  ctx.fillText(project.tech, W / 2, 294);

  // Durum rozeti
  const isActive = project.status === 'live' || project.status === 'active';
  const statusColor = isActive ? '#4ade80' : '#fbbf24';
  const statusText  = isActive ? '● AKTİF' : project.status === 'done' ? '✓ TAMAMLANDI' : '⚙ GELİŞTİRMEDE';
  ctx.fillStyle = statusColor;
  ctx.font = 'bold 14px Arial';
  ctx.fillText(statusText, W / 2, 344);

  // Alt ayırıcı
  ctx.strokeStyle = project.color + '33';
  ctx.beginPath();
  ctx.moveTo(50, 354); ctx.lineTo(W - 50, 354);
  ctx.stroke();

  // Sıra numarası
  ctx.fillStyle = project.color + '88';
  ctx.font = '12px monospace';
  ctx.fillText(project.displayLabel || `PROJECT 0${project.id + 1} / 03`, W / 2, 380);

  return new THREE.CanvasTexture(c);
}

/* ─── Projeksiyon dokusu (kod editörü teması) ─── */
function makeScreenTex() {
  const W = 640, H = 400;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // IDE arka planı
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);

  // Başlık çubuğu
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 0, W, 30);

  // macOS trafik ışıkları
  ['#ff5f57', '#ffbd2e', '#28c840'].forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(16 + i * 22, 15, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });
  ctx.fillStyle = '#6e7681';
  ctx.font = '12px monospace';
  ctx.fillText('App.tsx  —  portfolio', 215, 19);

  // Satır numarası + kod
  const lines = [
    ['#8b949e', '// Portfolio — Tunahan Korkmaz'],
    ['#ff7b72', "import React from 'react'"],
    ['#ff7b72', "import { Scene3D } from './3d'"],
    ['#e6edf3', ''],
    ['#d2a8ff', 'export default function App() {'],
    ['#79c0ff', '  return ('],
    ['#e6edf3', '    <main className="portfolio">'],
    ['#a5d6ff', '      <Scene3D scene="room" />'],
    ['#e6edf3', '    </main>'],
    ['#79c0ff', '  )'],
    ['#d2a8ff', '}'],
  ];

  lines.forEach(([color, text], i) => {
    ctx.fillStyle = '#3d4450';
    ctx.font = '13px "Courier New"';
    ctx.fillText(String(i + 1).padStart(2, ' '), 8, 56 + i * 26);
    ctx.fillStyle = color;
    ctx.fillText(text, 42, 56 + i * 26);
  });

  // Yanıp sönen cursor (statik)
  ctx.fillStyle = '#e6edf3';
  ctx.fillRect(42, 354, 9, 16);

  return new THREE.CanvasTexture(c);
}

/* ─── Tavan-perde ipi ─── */
function HangRope({ from, to }) {
  const geo = useMemo(() => {
    const mid = new THREE.Vector3(
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2 - 0.07,  // doğal sarkan eğri
      (from[2] + to[2]) / 2,
    );
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      mid,
      new THREE.Vector3(...to),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.005, 5, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#6b4226" roughness={0.95} />
    </mesh>
  );
}

/* ─── Projektör modeli ─── */
function Projector({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Gövde */}
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.09, 0.28]} />
        <meshStandardMaterial color="#232323" roughness={0.35} metalness={0.55} />
      </mesh>

      {/* Üst havalandırma izgarası */}
      {[-0.05, 0, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 0.047, 0.02]}>
          <boxGeometry args={[0.016, 0.004, 0.18]} />
          <meshStandardMaterial color="#141414" roughness={0.7} />
        </mesh>
      ))}

      {/* Lens haznesi */}
      <mesh position={[0, 0, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.042, 0.05, 0.055, 16]} />
        <meshStandardMaterial color="#111" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Lens camı (mavi parlak) */}
      <mesh position={[0, 0, 0.185]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.008, 16]} />
        <meshStandardMaterial
          color="#88aaff"
          roughness={0}
          metalness={0.1}
          transparent
          opacity={0.78}
          emissive="#aaccff"
          emissiveIntensity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Güç LED (yeşil) */}
      <mesh position={[0.07, 0.047, 0.07]}>
        <sphereGeometry args={[0.007, 8, 8]} />
        <meshStandardMaterial color="#33ff66" emissive="#33ff66" emissiveIntensity={1.3} toneMapped={false} />
      </mesh>

      {/* Marka butonu (mavi) */}
      <mesh position={[-0.05, 0.047, 0.07]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial color="#4488ff" emissive="#4488ff" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>

      {/* Ayaklar */}
      {[[-0.07, -0.08], [-0.07, 0.08], [0.07, -0.08], [0.07, 0.08]].map(([fx, fz], i) => (
        <mesh key={i} position={[fx, -0.048, fz]}>
          <cylinderGeometry args={[0.01, 0.012, 0.008, 8]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Ana bileşen ─── */
export default function ProjectionScreen({ isLightOn, selectedProject, onClose, onDemoPlay }) {
  const codeTex = useMemo(() => makeScreenTex(), []);
  const projectTextures = useMemo(() => PROJECTS.map(p => makeProjectDetailTex(p)), []);

  const activeTex = selectedProject !== null
    ? projectTextures[selectedProject.id]
    : codeTex;

  // Ekran — odanın sol tarafı, halıyla aynı hizada (z ≈ -0.5)
  const SX = -4.05;  // sol duvara yakın
  const SY = 2.35;   // dikey merkez
  const SZ = -0.8;   // halının merkez z'siyle hizalı
  const SW = 1.9;    // genişlik (Z ekseni boyunca, perde 90° döndürülmüş)
  const SH = 1.2;    // yükseklik

  const screenTopY = SY + SH / 2 + 0.03;
  const CEIL_Y = 5.88;

  // İp bağlantı noktaları (sol/sağ kenar)
  const rAstart = [SX, CEIL_Y, SZ + SW * 0.3];
  const rAend   = [SX, screenTopY, SZ + SW * 0.3];
  const rBstart = [SX, CEIL_Y, SZ - SW * 0.3];
  const rBend   = [SX, screenTopY, SZ - SW * 0.3];

  // Projektör — sehpa üstü (sehpa world: [0,0,0.3], yüzey y≈0.37)
  const PX = 0.05, PY = 0.43, PZ = 0.08;

  // Projektörün ekrana bakış açısı
  const dx = SX - PX;
  const dz = SZ - PZ;
  const projRotY = Math.atan2(dx, dz);
  const projRotX = -Math.atan2(SY - PY, Math.sqrt(dx * dx + dz * dz)) * 0.75;

  // Proje seçiliyken ekran emisyon yoğunluğu daha yüksek
  const emissiveInt = selectedProject !== null
    ? (isLightOn ? 0.55 : 0.85)
    : (isLightOn ? 0.4  : 0.72);

  // X butonu 3D konumu: ekranın sağ-üst köşesi (izleyici sağı = dünya -z)
  const closeBtnPos = [SX + 0.03, screenTopY - 0.14, SZ - SW / 2 + 0.16];

  return (
    <group>
      {/* Tavan kancaları */}
      {[rAstart, rBstart].map((p, i) => (
        <mesh key={i} position={[p[0], CEIL_Y - 0.012, p[2]]}>
          <cylinderGeometry args={[0.013, 0.013, 0.024, 8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* İpler (tavandan perdeye) */}
      <HangRope from={rAstart} to={rAend} />
      <HangRope from={rBstart} to={rBend} />

      {/* Üst rulolu çubuk */}
      <mesh position={[SX, screenTopY, SZ]}>
        <boxGeometry args={[0.038, 0.038, SW + 0.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* Projeksiyon yüzeyi — +x yönüne bakar */}
      <mesh position={[SX, SY, SZ]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial
          map={activeTex}
          emissiveMap={activeTex}
          emissive="#ffffff"
          emissiveIntensity={emissiveInt}
          roughness={0.88}
          toneMapped={false}
        />
      </mesh>

      {/* Arka panel (koyu) */}
      <mesh position={[SX - 0.007, SY, SZ]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.9} />
      </mesh>

      {/* Çerçeve kenarları */}
      <mesh position={[SX, screenTopY - 0.018, SZ]}>
        <boxGeometry args={[0.024, 0.026, SW + 0.02]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[SX, SY - SH / 2 + 0.01, SZ]}>
        <boxGeometry args={[0.024, 0.026, SW + 0.02]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[SX, SY, SZ + SW / 2 + 0.01]}>
        <boxGeometry args={[0.024, SH + 0.02, 0.026]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[SX, SY, SZ - SW / 2 - 0.01]}>
        <boxGeometry args={[0.024, SH + 0.02, 0.026]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Ekran parlaması */}
      <pointLight
        position={[SX + 0.6, SY, SZ]}
        color={selectedProject ? selectedProject.color : '#8fb3ff'}
        intensity={isLightOn ? 1.1 : 2.0}
        distance={5.5}
        decay={2}
      />

      {/* Projektör lens parlaması */}
      <pointLight
        position={[PX, PY + 0.02, PZ + 0.16]}
        color="#99bbff"
        intensity={isLightOn ? 0.28 : 0.5}
        distance={2.5}
        decay={2}
      />

      {/* Projektör modeli */}
      <Projector position={[PX, PY, PZ]} rotation={[projRotX, projRotY, 0]} />

      {/* Proje seçiliyken: X kapat butonu + URL butonu */}
      {selectedProject !== null && (
        <Html position={closeBtnPos} zIndexRange={[200, 0]} style={{ pointerEvents: 'all' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {/* X butonu */}
            <button
              onClick={onClose}
              title="Kapat"
              style={{
                width: '34px', height: '34px',
                borderRadius: '50%',
                background: 'rgba(220,50,50,0.92)',
                color: '#fff',
                border: '1px solid rgba(255,120,120,0.5)',
                cursor: 'pointer',
                fontSize: '17px',
                fontWeight: 'bold',
                lineHeight: 1,
                boxShadow: '0 0 12px rgba(255,50,50,0.55)',
                userSelect: 'none',
              }}
            >
              ✕
            </button>

            {/* Siteyi Aç butonu (sadece URL varsa) */}
            {selectedProject.url && (
              <button
                onClick={() => window.open(selectedProject.url, '_blank')}
                title="Siteyi Aç"
                style={{
                  padding: '5px 10px',
                  borderRadius: '12px',
                  background: `${selectedProject.color}dd`,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 10px ${selectedProject.color}88`,
                  userSelect: 'none',
                }}
              >
                ↗ Siteyi Aç
              </button>
            )}

            {/* Demo Oynat butonu — demosu olan projeler için */}
            {(selectedProject.id === 0 || selectedProject.id === 2) && (
              <button
                onClick={onDemoPlay}
                title="Demo Oynat"
                style={{
                  padding: '5px 10px',
                  borderRadius: '12px',
                  background: `${selectedProject.color}dd`,
                  color: '#fff',
                  border: `1px solid ${selectedProject.color}88`,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 10px ${selectedProject.color}88`,
                  userSelect: 'none',
                }}
              >
                ▶ Demo Oynat
              </button>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
