import { useMemo, useState } from 'react';
import * as THREE from 'three';
import ShelfDeck from './ShelfDeck';
import { useProjects } from '../data/store';

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

function makeCardTex(project) {
  const W = 512, H = 640;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  ctx.fillStyle = project.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Üst başlık şeridi
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, W, 140);
  const hg = ctx.createLinearGradient(0, 0, 0, 140);
  hg.addColorStop(0, 'rgba(255,255,255,0.18)');
  hg.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, 140);

  // Numara rozeti
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  roundRect(ctx, W - 60, 14, 46, 34, 7);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`0${(project.id ?? 0) + 1}`, W - 37, 37);

  // Proje adı
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(project.name, W / 2, 95);
  ctx.shadowBlur = 0;

  // Açıklama
  ctx.fillStyle = 'rgba(215,235,255,0.94)';
  ctx.font = '22px Arial';
  (project.cardDesc || []).forEach((line, i) => ctx.fillText(line, W / 2, 198 + i * 38));

  // Ayırıcı
  const dg = ctx.createLinearGradient(24, 0, W - 24, 0);
  dg.addColorStop(0, 'transparent');
  dg.addColorStop(0.3, project.color + 'bb');
  dg.addColorStop(0.7, project.color + 'bb');
  dg.addColorStop(1, 'transparent');
  ctx.strokeStyle = dg;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 296); ctx.lineTo(W - 24, 296);
  ctx.stroke();

  // Durum rozeti
  const isLive = project.status === 'live';
  const badgeColor = isLive ? '#4ade80' : '#fbbf24';
  const badgeText  = isLive ? '● LIVE' : '⚙ GELİŞTİRMEDE';
  const badgeW     = isLive ? 130 : 210;
  ctx.fillStyle = badgeColor + '22';
  roundRect(ctx, W / 2 - badgeW / 2, 316, badgeW, 48, 24);
  ctx.fill();
  ctx.strokeStyle = badgeColor + '99';
  ctx.lineWidth = 1.5;
  roundRect(ctx, W / 2 - badgeW / 2, 316, badgeW, 48, 24);
  ctx.stroke();
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 22px Arial';
  ctx.fillText(badgeText, W / 2, 348);

  if (project.displayUrl) {
    ctx.fillStyle = 'rgba(160,180,200,0.85)';
    ctx.font = '17px monospace';
    ctx.fillText(project.displayUrl, W / 2, 450);
  }

  // CTA
  ctx.fillStyle = project.color + 'ee';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('▶  Detayları Gör', W / 2, 606);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function ProjectCard({ project, position, onSelect }) {
  const tex = useMemo(() => makeCardTex(project), [project]);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        scale={hovered ? [1.07, 1.07, 1.07] : [1, 1, 1]}
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={() =>  { setHovered(false); document.body.style.cursor = 'default'; }}
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

export default function ProjectShelves({ onSelect }) {
  const [projects] = useProjects();
  return (
    <ShelfDeck
      cx={-2.4}
      items={projects}
      renderCard={({ item, position, key }) => (
        <ProjectCard key={key} project={item} position={position} onSelect={onSelect} />
      )}
    />
  );
}
