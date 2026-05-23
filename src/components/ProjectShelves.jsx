import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { PROJECTS } from '../data/projects';

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
  const W = 256, H = 320;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Arka plan
  ctx.fillStyle = project.bgColor;
  ctx.fillRect(0, 0, W, H);

  // Üst başlık çubuğu
  ctx.fillStyle = project.color;
  ctx.fillRect(0, 0, W, 72);

  // Numara rozeti
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, W - 36, 8, 28, 22, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`0${project.id + 1}`, W - 22, 24);

  // Proje adı
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 19px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(project.name, W / 2, 46);

  // Açıklama
  ctx.fillStyle = 'rgba(200,225,255,0.82)';
  ctx.font = '14px Arial';
  project.cardDesc.forEach((line, i) => ctx.fillText(line, W / 2, 104 + i * 22));

  // Ayırıcı
  ctx.strokeStyle = project.color + '66';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 156); ctx.lineTo(W - 20, 156);
  ctx.stroke();

  // Durum rozeti
  const isLive = project.status === 'live';
  const badgeColor = isLive ? '#4ade80' : '#fbbf24';
  const badgeText  = isLive ? '● LIVE' : '⚙ GELİŞTİRMEDE';
  const badgeW     = isLive ? 78 : 128;
  ctx.fillStyle = badgeColor + '33';
  roundRect(ctx, W / 2 - badgeW / 2, 170, badgeW, 26, 13);
  ctx.fill();
  ctx.fillStyle = badgeColor;
  ctx.font = 'bold 13px Arial';
  ctx.fillText(badgeText, W / 2, 188);

  // URL
  if (project.displayUrl) {
    ctx.fillStyle = 'rgba(148,163,184,0.75)';
    ctx.font = '11px monospace';
    ctx.fillText(project.displayUrl, W / 2, 236);
  }

  // Tıkla ipucu
  ctx.fillStyle = project.color + 'cc';
  ctx.font = '12px Arial';
  ctx.fillText('▶  Detayları Gör', W / 2, 298);

  return new THREE.CanvasTexture(c);
}

/* ─── Tek proje kartı ─── */
function ProjectCard({ project, position, onSelect }) {
  const tex = useMemo(() => makeCardTex(project), []); // eslint-disable-line
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        scale={hovered ? [1.07, 1.07, 1.07] : [1, 1, 1]}
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={() =>  { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onSelect(project); }}
        castShadow
      >
        <boxGeometry args={[0.92, 1.15, 0.04]} />
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

/* ─── Raf + 3 proje kartı ─── */
export default function ProjectShelves({ onSelect }) {
  const shelfY = 2.05;
  const wallZ  = -4.9;
  const xs     = [-3.85, -2.4, -0.95];
  const cx     = -2.4;   // raf merkezi x

  return (
    <group>
      {/* Ahşop raf tahtası */}
      <mesh position={[cx, shelfY - 0.63, wallZ + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 0.06, 0.22]} />
        <meshStandardMaterial color="#2d1b0e" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Duvar montaj şeridi */}
      <mesh position={[cx, shelfY - 0.56, wallZ + 0.015]}>
        <boxGeometry args={[4.14, 0.07, 0.04]} />
        <meshStandardMaterial color="#1a1008" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Metal braketler */}
      {xs.map((x, i) => (
        <group key={i}>
          <mesh position={[x, shelfY - 0.63, wallZ + 0.12]}>
            <boxGeometry args={[0.04, 0.03, 0.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[x, shelfY - 0.78, wallZ + 0.02]}>
            <boxGeometry args={[0.03, 0.28, 0.03]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Proje kartları */}
      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={[xs[i], shelfY, wallZ + 0.02]}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
