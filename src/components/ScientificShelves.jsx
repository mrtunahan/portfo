import { useMemo, useState } from 'react';
import * as THREE from 'three';

const SCI_PROJECTS = [
  {
    id: 10,
    shortName: 'Duygu Sınıflandırması',
    name: 'Duygu Sınıflandırması',
    program: '2209-A',
    no: '1919B012471683',
    lines: ['Doğal Afet Sonrası', 'Sosyal Medya', 'Duygu Sınıf.'],
    screenDesc: [
      '2209-A Programı · No: 1919B012471683',
      'Doğal Afet Sonrası Sosyal Medya',
      'Duygu Sınıflandırma Sistemi',
    ],
    tech: 'Python · TensorFlow · NLP · BERT',
    url: null, displayUrl: null,
    subTitle: '2209-A Programı · Akademik Danışman',
    displayLabel: 'BİLİMSEL 01 / 04',
    role: 'Akademik Danışman',
    status: 'active',
    year: '2024/1',
    color: '#4ade80',
    bgColor: '#061a0e',
  },
  {
    id: 11,
    shortName: 'Kemik Tümörü Tanısı',
    name: 'Kemik Tümörü Tanısı',
    program: '2209-A',
    no: '1919B012471715',
    lines: ['Kemik Tümörü', 'Görüntülemeden', 'MO Tanısı'],
    screenDesc: [
      '2209-A Programı · No: 1919B012471715',
      'MR/BT Görüntülemeden Otomatik',
      'Kemik Tümörü Tanı Sistemi',
    ],
    tech: 'Python · PyTorch · CNN · OpenCV',
    url: null, displayUrl: null,
    subTitle: '2209-A Programı · Akademik Danışman',
    displayLabel: 'BİLİMSEL 02 / 04',
    role: 'Akademik Danışman',
    status: 'active',
    year: '2024/1',
    color: '#60a5fa',
    bgColor: '#061020',
  },
  {
    id: 12,
    shortName: 'Bitki Hastalık Tespiti',
    name: 'Bitki Hastalık Tespiti',
    program: '2209-A',
    no: '1919B012471699',
    lines: ['Bitki Yaprakları', 'Hastalık Tespit', 'Sistemi'],
    screenDesc: [
      '2209-A Programı · No: 1919B012471699',
      'Bitki Yapraklarından Görüntü İşleme',
      'ile Hastalık Tespit Sistemi',
    ],
    tech: 'Python · YOLOv8 · OpenCV · Flask',
    url: null, displayUrl: null,
    subTitle: '2209-A Programı · Akademik Danışman',
    displayLabel: 'BİLİMSEL 03 / 04',
    role: 'Akademik Danışman',
    status: 'active',
    year: '2024/1',
    color: '#a78bfa',
    bgColor: '#0e0620',
  },
  {
    id: 13,
    shortName: 'Servis Araç Güvenliği',
    name: 'Servis Araç Güvenliği',
    program: 'TEYDEB',
    no: '3220807',
    lines: ['YZ & Görüntü İşleme', 'Servis Araçları', 'Güvenlik Sistemi'],
    screenDesc: [
      'TEYDEB · No: 3220807 · 2023–2025',
      'YZ & Görüntü İşleme ile Servis',
      'Araçları Güvenlik Sistemi',
    ],
    tech: 'Python · TensorFlow · OpenCV · ROS',
    url: null, displayUrl: null,
    subTitle: 'TEYDEB · Proje Personeli · 2023–2025',
    displayLabel: 'BİLİMSEL 04 / 04',
    role: 'Proje Personeli',
    status: 'done',
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
  const W = 512, H = 640;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Arka plan
  ctx.fillStyle = proj.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Üst başlık şeridi
  ctx.fillStyle = proj.color;
  ctx.fillRect(0, 0, W, 128);
  const hg = ctx.createLinearGradient(0, 0, 0, 128);
  hg.addColorStop(0, 'rgba(255,255,255,0.18)');
  hg.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, 128);

  // Program rozeti
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  roundRect(ctx, W - 92, 10, 78, 34, 7);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 17px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(proj.program, W - 53, 32);

  // Kısa isim
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 7;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(proj.shortName, W / 2, 88);
  ctx.shadowBlur = 0;

  // Proje numarası
  ctx.fillStyle = 'rgba(180,210,255,0.72)';
  ctx.font = '15px monospace';
  ctx.fillText(proj.no, W / 2, 158);

  // Açıklama satırları
  ctx.fillStyle = 'rgba(215,232,255,0.94)';
  ctx.font = '22px Arial';
  proj.lines.forEach((line, i) => ctx.fillText(line, W / 2, 208 + i * 38));

  // Ayırıcı
  ctx.strokeStyle = proj.color + '77';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 334); ctx.lineTo(W - 24, 334);
  ctx.stroke();

  // Durum rozeti
  const isDone = proj.status === 'Tamamlandı';
  const badgeColor = isDone ? '#fbbf24' : '#4ade80';
  const badgeText  = isDone ? '✓ TAMAMLANDI' : '● AKTİF';
  const badgeW     = isDone ? 192 : 128;
  ctx.fillStyle = badgeColor + '22';
  roundRect(ctx, W / 2 - badgeW / 2, 350, badgeW, 46, 23);
  ctx.fill();
  ctx.strokeStyle = badgeColor + '99';
  ctx.lineWidth = 1.5;
  roundRect(ctx, W / 2 - badgeW / 2, 350, badgeW, 46, 23);
  ctx.stroke();
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 20px Arial';
  ctx.fillText(badgeText, W / 2, 379);

  // Görev
  ctx.fillStyle = 'rgba(185,210,235,0.88)';
  ctx.font = '18px Arial';
  ctx.fillText(proj.role, W / 2, 456);

  // Yıl
  ctx.fillStyle = proj.color + 'ff';
  ctx.font = 'bold 22px Arial';
  ctx.fillText(proj.year, W / 2, 508);

  // Alt şerit
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fillRect(0, H - 58, W, 58);
  ctx.fillStyle = proj.color + 'cc';
  ctx.font = '18px Arial';
  ctx.fillText('Bilimsel Proje', W / 2, H - 20);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function SciProjectCard({ project, position, onSelect }) {
  const tex = useMemo(() => makeSciCardTex(project), []); // eslint-disable-line
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        scale={hovered ? [1.07, 1.07, 1.07] : [1, 1, 1]}
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(project); }}
        castShadow
      >
        <boxGeometry args={[0.82, 1.05, 0.04]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.20 : 0.05}
          roughness={0.65}
          toneMapped={false}
        />
      </mesh>
      {hovered && (
        <pointLight position={[0, 0, 0.3]} color={project.color} intensity={0.55} distance={1.5} decay={2} />
      )}

      {/* Duvar lambası fikstürü — kartın üstünde */}
      <mesh position={[0, 0.68, 0.04]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.22, 0.055, 0.11]} />
        <meshStandardMaterial color="#111111" emissive="#ffa030" emissiveIntensity={1.8} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Alt yansıtıcı */}
      <mesh position={[0, 0.655, 0.095]} rotation={[0.7, 0, 0]}>
        <boxGeometry args={[0.18, 0.008, 0.055]} />
        <meshStandardMaterial color="#888" emissive="#ffcc60" emissiveIntensity={2} metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Kart spot ışığı */}
      <pointLight
        position={[0, 0.52, 0.4]}
        color="#fff4e0"
        intensity={5}
        distance={2.6}
        decay={2}
      />
    </group>
  );
}

/* ─── Raf + 4 bilimsel proje kartı ─── */
export default function ScientificShelves({ onSelect }) {
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
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
