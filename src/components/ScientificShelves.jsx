import { useMemo, useState } from 'react';
import * as THREE from 'three';
import ShelfDeck from './ShelfDeck';
import { useScientificProjects } from '../data/store';

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
  ctx.fillText(proj.program || '', W - 53, 32);

  // Kısa isim
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 7;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(proj.shortName || '', W / 2, 88);
  ctx.shadowBlur = 0;

  // Proje numarası
  ctx.fillStyle = 'rgba(180,210,255,0.72)';
  ctx.font = '15px monospace';
  ctx.fillText(proj.no || '', W / 2, 158);

  // Açıklama satırları
  ctx.fillStyle = 'rgba(215,232,255,0.94)';
  ctx.font = '22px Arial';
  (proj.lines || []).forEach((line, i) => ctx.fillText(line, W / 2, 208 + i * 38));

  // Ayırıcı
  ctx.strokeStyle = proj.color + '77';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 334); ctx.lineTo(W - 24, 334);
  ctx.stroke();

  // Durum rozeti
  const isDone = proj.status === 'done' || proj.status === 'Tamamlandı';
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
  ctx.fillText(proj.role || '', W / 2, 456);

  // Yıl
  ctx.fillStyle = proj.color + 'ff';
  ctx.font = 'bold 22px Arial';
  ctx.fillText(proj.year || '', W / 2, 508);

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
  const tex = useMemo(() => makeSciCardTex(project), [project]);
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
        <boxGeometry args={[0.92, 1.15, 0.04]} />
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
      <mesh position={[0, 0.74, 0.04]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.24, 0.055, 0.12]} />
        <meshStandardMaterial color="#111111" emissive="#ffa030" emissiveIntensity={1.8} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Alt yansıtıcı */}
      <mesh position={[0, 0.715, 0.1]} rotation={[0.7, 0, 0]}>
        <boxGeometry args={[0.2, 0.008, 0.06]} />
        <meshStandardMaterial color="#888" emissive="#ffcc60" emissiveIntensity={2} metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Kart spot ışığı */}
      <pointLight
        position={[0, 0.58, 0.42]}
        color="#fff4e0"
        intensity={5}
        distance={2.6}
        decay={2}
      />
    </group>
  );
}

export default function ScientificShelves({ onSelect }) {
  const [projects] = useScientificProjects();
  return (
    <ShelfDeck
      cx={2.4}
      items={projects}
      renderCard={({ item, position, key }) => (
        <SciProjectCard key={key} project={item} position={position} onSelect={onSelect} />
      )}
    />
  );
}
