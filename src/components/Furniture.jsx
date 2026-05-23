import { useMemo } from 'react';
import * as THREE from 'three';

function makeKaratekinCupTex() {
  const W = 512, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // ─ Arka plan: gök mavisi
  ctx.fillStyle = '#4ab5d0';
  ctx.fillRect(0, 0, W, H);

  // ─ Logo merkezi (canvas ortası)
  const cx = W / 2, cy = H / 2;
  const R = H * 0.42;

  // Dış çember
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // İç dolgu (biraz daha koyu mavi)
  ctx.fillStyle = '#3a9ec8';
  ctx.beginPath();
  ctx.arc(cx, cy, R - 5, 0, Math.PI * 2);
  ctx.fill();

  // Küre çizgileri
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  // Ekvator
  ctx.beginPath();
  ctx.ellipse(cx, cy - 4, R * 0.56, R * 0.14, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Boylamlar
  for (let a = -1; a <= 1; a++) {
    ctx.beginPath();
    ctx.ellipse(cx + a * R * 0.28, cy - 4, R * 0.18, R * 0.52, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Küre dış däire
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy - 4, R * 0.52, 0, Math.PI * 2);
  ctx.stroke();

  // Sarı şerit (banner)
  const bannerY = cy + 10;
  ctx.fillStyle = '#f5c842';
  const bw = R * 1.52, bh = 26;
  ctx.beginPath();
  ctx.moveTo(cx - bw / 2 + 10, bannerY - bh / 2);
  ctx.lineTo(cx + bw / 2 - 10, bannerY - bh / 2);
  ctx.lineTo(cx + bw / 2, bannerY);
  ctx.lineTo(cx + bw / 2 - 10, bannerY + bh / 2);
  ctx.lineTo(cx - bw / 2 + 10, bannerY + bh / 2);
  ctx.lineTo(cx - bw / 2, bannerY);
  ctx.closePath();
  ctx.fill();

  // KARATEKIN TRAVEL
  ctx.fillStyle = '#1a1a0a';
  ctx.font = 'bold 17px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('KARATEKIN TRAVEL', cx, bannerY + 6);

  // Üst yazı (çevre)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Arial';
  const arcText = 'CANKIRI KARATEKIN UNIVERSITESI';
  const arcR = R - 14;
  const totalAngle = Math.PI * 1.1;
  const startA = -Math.PI / 2 - totalAngle / 2;
  for (let i = 0; i < arcText.length; i++) {
    const angle = startA + (i / (arcText.length - 1)) * totalAngle;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * arcR, cy + Math.sin(angle) * arcR);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(arcText[i], 0, 0);
    ctx.restore();
  }

  // Alt — 2024
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('2024', cx, cy + R * 0.82);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* KarateKin Travel logolu bardak */
function CupWithLogo({ position }) {
  const tex = useMemo(() => makeKaratekinCupTex(), []);
  return (
    <group position={position}>
      {/* Bardak gövdesi */}
      <mesh castShadow>
        <cylinderGeometry args={[0.038, 0.032, 0.09, 32]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.3}
          metalness={0.05}
          toneMapped={false}
        />
      </mesh>
      {/* Bardak iç (koyu) */}
      <mesh position={[0, 0.042, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.004, 16]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.8} />
      </mesh>
      {/* Kahve yüzeyi */}
      <mesh position={[0, 0.040, 0]}>
        <circleGeometry args={[0.033, 16]} />
        <meshStandardMaterial color="#3d1e08" roughness={0.6} />
      </mesh>
      {/* Kulp */}
      <mesh position={[0.048, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.018, 0.005, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#4ab5d0" roughness={0.3} metalness={0.05} />
      </mesh>
    </group>
  );
}

/* Koltuk önündeki cam sehpa */
export function CoffeeTable({ position = [0, 0, 0], ...props }) {
  const chrome   = <meshStandardMaterial color="#b0b8c4" roughness={0.08} metalness={0.92} />;
  const chromeDk = <meshStandardMaterial color="#707880" roughness={0.12} metalness={0.88} />;

  const TW = 1.55, TD = 0.82, TY = 0.42;   // masa genişlik / derinlik / yükseklik
  const lx = TW / 2 - 0.06;                 // ayak x ofseti
  const lz = TD / 2 - 0.06;                 // ayak z ofseti

  return (
    <group position={position} {...props}>

      {/* ── Cam yüzey ── */}
      <mesh position={[0, TY, 0]} castShadow receiveShadow>
        <boxGeometry args={[TW, 0.018, TD]} />
        <meshPhysicalMaterial
          color="#cce4f5"
          transparent opacity={0.22}
          roughness={0.0} metalness={0.05}
          reflectivity={1} clearcoat={1} clearcoatRoughness={0.0}
          envMapIntensity={2.0}
          side={2}
        />
      </mesh>

      {/* Cam kenar şeridi (görünürlük için) */}
      {[
        [0,       TY, TD / 2,  TW + 0.004, 0.018, 0.006],
        [0,       TY, -TD / 2, TW + 0.004, 0.018, 0.006],
        [TW / 2,  TY, 0,       0.006, 0.018, TD],
        [-TW / 2, TY, 0,       0.006, 0.018, TD],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#a8cce0" roughness={0.0} metalness={0.15} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* ── Krom ayaklar ── */}
      {[[-lx, TY / 2, lz], [lx, TY / 2, lz], [-lx, TY / 2, -lz], [lx, TY / 2, -lz]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.018, 0.018, TY, 10]} />
          {chrome}
        </mesh>
      ))}

      {/* Ayak tabanları */}
      {[[-lx, 0.015, lz], [lx, 0.015, lz], [-lx, 0.015, -lz], [lx, 0.015, -lz]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.032, 0.032, 0.010, 10]} />
          {chromeDk}
        </mesh>
      ))}

      {/* ── Alt cam raf ── */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[TW - 0.18, 0.010, TD - 0.18]} />
        <meshPhysicalMaterial
          color="#cce4f5"
          transparent opacity={0.18}
          roughness={0.0} metalness={0.05}
          clearcoat={1} clearcoatRoughness={0.0}
          side={2}
        />
      </mesh>

      {/* ── Kitaplar ── */}
      <mesh position={[-0.38, TY + 0.024, 0.06]} rotation={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.22, 0.045, 0.165]} />
        <meshStandardMaterial color="#1a2744" roughness={0.9} />
      </mesh>
      <mesh position={[-0.35, TY + 0.063, 0.04]} rotation={[0, -0.12, 0]} castShadow>
        <boxGeometry args={[0.20, 0.036, 0.155]} />
        <meshStandardMaterial color="#3d1a1a" roughness={0.9} />
      </mesh>

      {/* ── Bardak (KarateKin Travel logolu) ── */}
      <CupWithLogo position={[0.42, TY + 0.009, -0.12]} />
    </group>
  );
}

/* Duvar rafı / Shelf */
export function WallShelf({ position = [0, 0, 0], ...props }) {
  return (
    <group position={position} {...props}>
      {/* Raf tahtası */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.03, 0.25]} />
        <meshStandardMaterial color="#1a1208" roughness={0.5} />
      </mesh>

      {/* Raf destekleri */}
      <mesh position={[-0.45, -0.08, 0.1]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.45, -0.08, 0.1]} castShadow>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Rafta kitaplar */}
      {[
        { pos: [-0.4, 0.1, 0], size: [0.04, 0.18, 0.14], color: '#8b2500' },
        { pos: [-0.34, 0.09, 0], size: [0.035, 0.16, 0.14], color: '#1e3a5f' },
        { pos: [-0.29, 0.11, 0], size: [0.04, 0.2, 0.14], color: '#2d4a22' },
        { pos: [-0.23, 0.08, 0], size: [0.03, 0.14, 0.14], color: '#4a3728' },
        { pos: [0.1, 0.08, 0], size: [0.04, 0.14, 0.14], color: '#3a1a3a' },
        { pos: [0.15, 0.1, 0], size: [0.035, 0.18, 0.14], color: '#1a3a3a' },
        { pos: [0.2, 0.09, 0], size: [0.04, 0.16, 0.14], color: '#4a2a10' },
      ].map((book, i) => (
        <mesh key={i} position={book.pos} castShadow>
          <boxGeometry args={book.size} />
          <meshStandardMaterial color={book.color} roughness={0.85} />
        </mesh>
      ))}

      {/* Küçük saksı bitki */}
      <group position={[0.35, 0.06, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.07, 8]} />
          <meshStandardMaterial color="#5a3a2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#1a3a1a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* Çerçeve / Picture Frame */
export function PictureFrame({ position = [0, 0, 0], rotation = [0, 0, 0], size = [0.6, 0.45], ...props }) {
  const [w, h] = size;
  const frameWidth = 0.025;

  return (
    <group position={position} rotation={rotation} {...props}>
      {/* Çerçeve */}
      {/* Üst */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w + frameWidth * 2, frameWidth, 0.02]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Alt */}
      <mesh position={[0, -h / 2, 0]} castShadow>
        <boxGeometry args={[w + frameWidth * 2, frameWidth, 0.02]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Sol */}
      <mesh position={[-w / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, h, 0.02]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Sağ */}
      <mesh position={[w / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, h, 0.02]} />
        <meshStandardMaterial color="#1a1208" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* İç yüzey — "resim" */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#1a2030" roughness={0.8} />
      </mesh>
    </group>
  );
}
