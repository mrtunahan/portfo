import { useMemo, useState } from 'react';
import * as THREE from 'three';

const SCI_PROJECTS = [
  {
    id: 0,
    shortName: 'Duygu Sınıflandırması',
    program: '2209-A',
    no: '1919B012471683',
    lines: ['Doğal Afet Sonrası', 'Sosyal Medya', 'Duygu Sınıf.'],
    role: 'Akademik Danışman',
    status: 'Destekleniyor',
    year: '2024/1',
    color: '#4ade80',
    bgColor: '#061a0e',
  },
  {
    id: 1,
    shortName: 'Kemik Tümörü Tanısı',
    program: '2209-A',
    no: '1919B012471715',
    lines: ['Kemik Tümörü', 'Görüntülemeden', 'MO Tanısı'],
    role: 'Akademik Danışman',
    status: 'Destekleniyor',
    year: '2024/1',
    color: '#60a5fa',
    bgColor: '#061020',
  },
  {
    id: 2,
    shortName: 'Bitki Hastalık Tespiti',
    program: '2209-A',
    no: '1919B012471699',
    lines: ['Bitki Yaprakları', 'Hastalık Tespit', 'Sistemi'],
    role: 'Akademik Danışman',
    status: 'Destekleniyor',
    year: '2024/1',
    color: '#a78bfa',
    bgColor: '#0e0620',
  },
  {
    id: 3,
    shortName: 'Servis Araç Güvenliği',
    program: 'TEYDEB',
    no: '3220807',
    lines: ['YZ & Görüntü İşleme', 'Servis Araçları', 'Güvenlik Sistemi'],
    role: 'Proje Personeli',
    status: 'Tamamlandı',
    year: '2023–2025',
    color: '#fb923c',
    bgColor: '#1a0804',
  },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeSciCardTex(proj) {
  const W = 256, H = 320;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Arka plan
  ctx.fillStyle = proj.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Üst başlık çubuğu
  ctx.fillStyle = proj.color;
  ctx.fillRect(0, 0, W, 64);

  // Program rozeti (sağ üst)
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, W - 62, 6, 54, 22, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(proj.program, W - 35, 21);

  // Kısa isim
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(proj.shortName, W / 2, 44);

  // Proje numarası
  ctx.fillStyle = 'rgba(180,210,255,0.65)';
  ctx.font = '10px monospace';
  ctx.fillText(proj.no, W / 2, 80);

  // Açıklama satırları
  ctx.fillStyle = 'rgba(200,220,255,0.88)';
  ctx.font = '13px Arial';
  proj.lines.forEach((line, i) => ctx.fillText(line, W / 2, 108 + i * 21));

  // Ayırıcı çizgi
  ctx.strokeStyle = proj.color + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 168); ctx.lineTo(W - 20, 168);
  ctx.stroke();

  // Durum rozeti
  const isDone = proj.status === 'Tamamlandı';
  const badgeColor = isDone ? '#fbbf24' : '#4ade80';
  const badgeText  = isDone ? '✓ TAMAMLANDI' : '● AKTİF';
  const badgeW     = isDone ? 112 : 78;
  ctx.fillStyle = badgeColor + '33';
  roundRect(ctx, W / 2 - badgeW / 2, 178, badgeW, 24, 12);
  ctx.fill();
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 12px Arial';
  ctx.fillText(badgeText, W / 2, 194);

  // Görev
  ctx.fillStyle = 'rgba(180,200,220,0.75)';
  ctx.font = '11px Arial';
  ctx.fillText(proj.role, W / 2, 232);

  // Yıl
  ctx.fillStyle = proj.color + 'cc';
  ctx.font = 'bold 12px Arial';
  ctx.fillText(proj.year, W / 2, 258);

  // Alt şerit
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, H - 34, W, 34);
  ctx.fillStyle = proj.color + 'bb';
  ctx.font = '11px Arial';
  ctx.fillText('Bilimsel Proje', W / 2, H - 14);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function SciProjectCard({ project, position }) {
  const tex = useMemo(() => makeSciCardTex(project), []); // eslint-disable-line
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        scale={hovered ? [1.07, 1.07, 1.07] : [1, 1, 1]}
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
        castShadow
      >
        <boxGeometry args={[0.82, 1.05, 0.04]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.3 : 0.1}
          roughness={0.65}
          toneMapped={false}
        />
      </mesh>
      {hovered && (
        <pointLight position={[0, 0, 0.3]} color={project.color} intensity={0.55} distance={1.5} decay={2} />
      )}
    </group>
  );
}

/* ─── Raf + 4 bilimsel proje kartı ─── */
export default function ScientificShelves() {
  const shelfY = 2.05;
  const wallZ  = -4.9;
  const cx     = 2.4;
  // 4 kart, 1.15 aralıklı, merkez cx=2.4
  const xs     = [cx - 1.725, cx - 0.575, cx + 0.575, cx + 1.725];

  return (
    <group>
      {/* Ahşap raf tahtası */}
      <mesh position={[cx, shelfY - 0.58, wallZ + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.06, 0.22]} />
        <meshStandardMaterial color="#2d1b0e" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Duvar montaj şeridi */}
      <mesh position={[cx, shelfY - 0.51, wallZ + 0.015]}>
        <boxGeometry args={[4.44, 0.07, 0.04]} />
        <meshStandardMaterial color="#1a1008" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Metal braketler */}
      {xs.map((x, i) => (
        <group key={i}>
          <mesh position={[x, shelfY - 0.58, wallZ + 0.12]}>
            <boxGeometry args={[0.04, 0.03, 0.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[x, shelfY - 0.72, wallZ + 0.02]}>
            <boxGeometry args={[0.03, 0.27, 0.03]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Bilimsel proje kartları */}
      {SCI_PROJECTS.map((project, i) => (
        <SciProjectCard
          key={project.id}
          project={project}
          position={[xs[i], shelfY, wallZ + 0.02]}
        />
      ))}
    </group>
  );
}
