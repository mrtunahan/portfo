import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── 12 vintage sector colours (clockwise from XII) ───────────────── */
const SECTOR_COLORS = [
  '#c8b48a', // XII
  '#8b4a38', // I  – dark burgundy
  '#d4c4a4', // II – cream
  '#98bca8', // III – sage green
  '#e0d0b0', // IV – warm cream
  '#c8a880', // V  – tan
  '#5a2a18', // VI – dark maroon
  '#d4a898', // VII – dusty rose
  '#a8b8c0', // VIII – dusty blue
  '#ece4cc', // IX – off-white
  '#90ac90', // X  – muted green
  '#b89080', // XI – dusty pink
];

/* ── draw the full clock face onto ctx ────────────────────────────── */
function drawClock(canvas, ctx) {
  const S  = canvas.width;           // 512
  const cx = S / 2, cy = S / 2;
  const R  = S / 2 - 6;              // outer clock radius

  ctx.clearRect(0, 0, S, S);

  /* outer dark ring */
  ctx.beginPath();
  ctx.arc(cx, cy, R + 5, 0, Math.PI * 2);
  ctx.fillStyle = '#1e0c04';
  ctx.fill();

  /* 12 coloured sectors */
  for (let i = 0; i < 12; i++) {
    const a0 = (i * 30 - 90) * (Math.PI / 180);
    const a1 = ((i + 1) * 30 - 90) * (Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a0, a1);
    ctx.closePath();
    ctx.fillStyle = SECTOR_COLORS[i];
    ctx.fill();
    /* thin divider lines */
    ctx.strokeStyle = 'rgba(30,12,4,0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  /* inner cream circle (wood-look) */
  const IR = R * 0.44;
  const woodGrad = ctx.createRadialGradient(cx - 12, cy - 12, 0, cx, cy, IR);
  woodGrad.addColorStop(0, '#f4e8d0');
  woodGrad.addColorStop(0.6, '#e8d8b8');
  woodGrad.addColorStop(1, '#d8c8a8');
  ctx.beginPath();
  ctx.arc(cx, cy, IR, 0, Math.PI * 2);
  ctx.fillStyle = woodGrad;
  ctx.fill();
  ctx.strokeStyle = '#3a1a08';
  ctx.lineWidth = 2;
  ctx.stroke();

  /* minute tick marks on outer rim */
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const isH = i % 5 === 0;
    const r1  = R - 2;
    const r2  = isH ? R - 16 : R - 9;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = '#1e0c04';
    ctx.lineWidth = isH ? 2.5 : 1;
    ctx.stroke();
  }

  /* Roman numerals */
  const ROMANS = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
  const numR = R * 0.76;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const nx = cx + Math.cos(angle) * numR;
    const ny = cy + Math.sin(angle) * numR;
    const big = i === 0 || i === 3 || i === 6 || i === 9;
    ctx.font = `bold ${big ? 26 : 21}px 'Times New Roman', serif`;
    ctx.fillStyle = '#1e0c04';
    ctx.fillText(ROMANS[i], nx, ny);
  }

  /* ── KarateKin Travel logo (centre) ─────────────────────────────── */
  const logoR = IR - 10;

  /* sky-blue gradient background */
  const logoGrad = ctx.createRadialGradient(cx, cy - logoR * 0.25, 0, cx, cy, logoR);
  logoGrad.addColorStop(0, '#56d0f5');
  logoGrad.addColorStop(1, '#0078b6');
  ctx.beginPath();
  ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
  ctx.fillStyle = logoGrad;
  ctx.fill();

  /* globe latitude/longitude lines */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1;
  for (let r = 18; r <= logoR; r += 18) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx, cy - logoR); ctx.lineTo(cx, cy + logoR);
  ctx.moveTo(cx - logoR, cy); ctx.lineTo(cx + logoR, cy);
  for (let a = 30; a < 180; a += 30) {
    const rad = a * Math.PI / 180;
    ctx.moveTo(cx + Math.cos(rad) * logoR, cy + Math.sin(rad) * logoR);
    ctx.lineTo(cx - Math.cos(rad) * logoR, cy - Math.sin(rad) * logoR);
  }
  ctx.stroke();
  ctx.restore();

  /* yellow chevron banner */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, logoR, 0, Math.PI * 2);
  ctx.clip();
  const bannerY = cy + 8;
  ctx.beginPath();
  ctx.moveTo(cx - logoR, bannerY - 10);
  ctx.lineTo(cx, bannerY - 18);
  ctx.lineTo(cx + logoR, bannerY - 10);
  ctx.lineTo(cx + logoR, bannerY + 10);
  ctx.lineTo(cx, bannerY + 2);
  ctx.lineTo(cx - logoR, bannerY + 10);
  ctx.closePath();
  ctx.fillStyle = '#ffd700';
  ctx.fill();
  ctx.restore();

  /* logo text */
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillStyle = '#1e3a5f';
  ctx.fillText('KARATEKIN', cx, cy - 10);
  ctx.fillText('TRAVEL', cx, cy + 8);

  /* sub text */
  ctx.font = '9px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('ÇANKIRI KARATEKİN ÜNİVERSİTESİ', cx, cy + logoR - 14);

  /* "2024" small badge */
  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText('2024', cx, cy - logoR + 14);

  /* ── Clock hands ─────────────────────────────────────────────────── */
  const now  = new Date();
  const sec  = now.getSeconds();
  const min  = now.getMinutes();
  const hr12 = now.getHours() % 12;

  const secA  = (sec  / 60) * 2 * Math.PI;
  const minA  = ((min + sec / 60) / 60) * 2 * Math.PI;
  const hrA   = ((hr12 + min / 60) / 12) * 2 * Math.PI;

  function drawHand(angle, length, width, color, shadow = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle - Math.PI / 2);
    if (shadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    ctx.beginPath();
    ctx.moveTo(-width / 2, length * 0.12);
    ctx.lineTo(-width / 4, -length);
    ctx.lineTo(width / 4, -length);
    ctx.lineTo(width / 2, length * 0.12);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /* hour */
  drawHand(hrA,  R * 0.42, 9, '#1a1005', true);
  /* minute */
  drawHand(minA, R * 0.60, 6, '#1a1005', true);
  /* second */
  drawHand(secA, R * 0.65, 2.5, '#cc2200');
  /* counter-weight */
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(secA - Math.PI / 2 + Math.PI);
  ctx.beginPath();
  ctx.moveTo(-2.5, 0); ctx.lineTo(2.5, 0);
  ctx.lineTo(1.5, R * 0.14); ctx.lineTo(-1.5, R * 0.14);
  ctx.closePath();
  ctx.fillStyle = '#cc2200';
  ctx.fill();
  ctx.restore();

  /* centre caps */
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1005';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = '#cc2200';
  ctx.fill();
}

/* ── React component ─────────────────────────────────────────────── */
export default function WallClock({
  position = [5.92, 3.1, -0.8],
  rotation = [0, -Math.PI / 2, 0],
  size = 0.78,
}) {
  const canvasRef  = useRef(null);
  const ctxRef     = useRef(null);
  const lastSecRef = useRef(-1);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    canvasRef.current = canvas;
    ctxRef.current    = ctx;
    drawClock(canvas, ctx);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(() => {
    const sec = new Date().getSeconds();
    if (sec !== lastSecRef.current) {
      lastSecRef.current = sec;
      drawClock(canvasRef.current, ctxRef.current);
      texture.needsUpdate = true;
    }
  });

  const half = size / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* dark outer frame ring */}
      <mesh position={[0, 0, -0.005]}>
        <circleGeometry args={[half + 0.032, 64]} />
        <meshStandardMaterial color="#1e0c04" roughness={0.55} metalness={0.25} />
      </mesh>
      {/* clock face */}
      <mesh>
        <circleGeometry args={[half, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* subtle glass sheen */}
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[half - 0.01, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
