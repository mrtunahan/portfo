import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeWoodFloorTex() {
  const W = 512, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  const plankCols = ['#5c3d1e', '#6b4722', '#57391a', '#634220', '#5e4020', '#68451f'];
  const N = 4;
  const pw = W / N;

  for (let i = 0; i < N; i++) {
    // Tahta rengi
    ctx.fillStyle = plankCols[i % plankCols.length];
    ctx.fillRect(i * pw + 1.5, 0, pw - 1.5, H);

    // Kenar gölgesi
    const g = ctx.createLinearGradient(i * pw, 0, (i + 1) * pw, 0);
    g.addColorStop(0,    'rgba(0,0,0,0.22)');
    g.addColorStop(0.1,  'rgba(0,0,0,0)');
    g.addColorStop(0.9,  'rgba(0,0,0,0)');
    g.addColorStop(1,    'rgba(0,0,0,0.16)');
    ctx.fillStyle = g;
    ctx.fillRect(i * pw + 1.5, 0, pw - 1.5, H);

    // Ahşap damar çizgileri
    for (let s = 0; s < 22; s++) {
      const baseY = (s / 22) * H;
      ctx.beginPath();
      let first = true;
      for (let x = i * pw + 2; x < (i + 1) * pw - 1; x++) {
        const y = baseY + Math.sin(x * 0.09 + i * 2.3 + s * 0.55) * 2.4;
        if (first) { ctx.moveTo(x, y); first = false; }
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(0,0,0,${0.06 + (s % 3) * 0.02})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Staggered tahta eklemi (boylamasına dikim çizgisi)
    const jointY = ((i * H * 0.27) % H);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(i * pw + 1.5, jointY, pw - 1.5, 1.5);
    const jointY2 = (jointY + H * 0.5) % H;
    ctx.fillRect(i * pw + 1.5, jointY2, pw - 1.5, 1.5);

    // Dikiş / gap
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(i * pw, 0, 1.5, H);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 5);
  return tex;
}

function makeBrickWallTex() {
  const W = 512, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1c1008';
  ctx.fillRect(0, 0, W, H);
  const bH = 30, bW = 60, mH = 5, mV = 4;
  const colors = ['#8b3a1a', '#9c4220', '#7e3416', '#a84a22', '#863c1c', '#904018'];
  const rows = Math.ceil(H / (bH + mH)) + 1;
  const cols = Math.ceil(W / (bW + mV)) + 2;
  for (let row = 0; row < rows; row++) {
    const y = row * (bH + mH);
    const offset = (row % 2) * ((bW + mV) / 2);
    for (let col = 0; col < cols; col++) {
      const x = col * (bW + mV) - offset;
      ctx.fillStyle = colors[(row * 5 + col * 3) % colors.length];
      ctx.fillRect(x + mV, y + mH, bW - mV, bH - mH);
      const g = ctx.createLinearGradient(x, y + mH, x, y + bH);
      g.addColorStop(0, 'rgba(255,180,80,0.10)');
      g.addColorStop(0.4, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = g;
      ctx.fillRect(x + mV, y + mH, bW - mV, bH - mH);
      const s = row * 17 + col * 31;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(
          x + mV + (s * (i + 7) * 13) % (bW - mV),
          y + mH + (s * (i + 3) * 7) % (bH - mH),
          5, 1
        );
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2.5);
  return tex;
}

function rrPath(ctx, x, y, w, h, r) {
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

function makeStoneWallTex() {
  const W = 512, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#13100a';
  ctx.fillRect(0, 0, W, H);
  const sColors = ['#5a4e3a', '#6a5840', '#4e4232', '#625648', '#58503c', '#4a3e2c'];
  const bColors = ['#7a3618', '#8a4020', '#6e3016', '#843a1a'];
  const mort = 5;
  let y = 0, ri = 0;
  while (y < H) {
    const isBrick = ri % 3 === 2;
    if (isBrick) {
      const bH = 18;
      let x = (ri % 2) * 22;
      while (x < W) {
        const bW = 42 + (ri * 7 + Math.floor(x / 42) * 11) % 20;
        ctx.fillStyle = bColors[(ri + Math.floor(x / 42) * 3) % bColors.length];
        ctx.fillRect(x + mort, y + mort, bW - mort, bH - mort);
        const g = ctx.createLinearGradient(x, y, x, y + bH);
        g.addColorStop(0, 'rgba(255,140,40,0.08)');
        g.addColorStop(1, 'rgba(0,0,0,0.18)');
        ctx.fillStyle = g;
        ctx.fillRect(x + mort, y + mort, bW - mort, bH - mort);
        x += bW;
      }
      y += bH;
    } else {
      const sH = 52;
      let x = (ri % 2) * -25, ci = 0;
      while (x < W) {
        const s = ri * 23 + ci * 17;
        const sW = 44 + (s * 13) % 42;
        ctx.fillStyle = sColors[s % sColors.length];
        rrPath(ctx, x + mort, y + mort, sW - mort * 2, sH - mort * 2, 4);
        ctx.fill();
        const g = ctx.createLinearGradient(x, y, x, y + sH);
        g.addColorStop(0, 'rgba(255,220,140,0.07)');
        g.addColorStop(1, 'rgba(0,0,0,0.20)');
        ctx.fillStyle = g;
        rrPath(ctx, x + mort, y + mort, sW - mort * 2, sH - mort * 2, 4);
        ctx.fill();
        x += sW; ci++;
      }
      y += sH;
    }
    ri++;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

export default function Room({ isLightOn }) {
  const wallMaterialRef = useRef();
  
  // Oda boyutları
  const width = 12;
  const height = 6;
  const depth = 10;

  const wallColor    = useMemo(() => new THREE.Color('#050302'), []);
  const wallColorLit  = useMemo(() => new THREE.Color('#7a4820'), []);
  const woodTex       = useMemo(() => makeWoodFloorTex(), []);
  const brickTex      = useMemo(() => makeBrickWallTex(), []);
  const stoneTex      = useMemo(() => makeStoneWallTex(), []);
  const floorColor    = useMemo(() => new THREE.Color('#0a0807'), []);
  const floorColorLit = useMemo(() => new THREE.Color('#ffffff'), []);

  const floorRef = useRef();
  const ceilingRef = useRef();
  const backWallRef = useRef();
  const leftWallRef = useRef();
  const rightWallRef = useRef();

  useFrame((_, delta) => {
    const lerpSpeed = delta * 2;
    const targetWall = isLightOn ? wallColorLit : wallColor;
    const targetFloor = isLightOn ? floorColorLit : floorColor;

    [backWallRef, leftWallRef, rightWallRef, ceilingRef].forEach(ref => {
      if (ref.current) {
        ref.current.material.color.lerp(targetWall, lerpSpeed);
      }
    });
    if (floorRef.current) {
      floorRef.current.material.color.lerp(targetFloor, lerpSpeed);
    }
  });

  return (
    <group>
      {/* Zemin — tahta döşeme */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          map={woodTex}
          color="#0a0807"
          roughness={0.78}
          metalness={0}
        />
      </mesh>

      {/* Tavan */}
      <mesh
        ref={ceilingRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.9} />
      </mesh>

      {/* Arka duvar — tuğla */}
      <mesh
        ref={backWallRef}
        position={[0, height / 2, -depth / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={brickTex} color="#080604" roughness={0.94} />
      </mesh>

      {/* Sol duvar — taş+tuğla */}
      <mesh
        ref={leftWallRef}
        rotation={[0, Math.PI / 2, 0]}
        position={[-width / 2, height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial map={stoneTex} color="#080604" roughness={0.95} />
      </mesh>

      {/* Sağ duvar — taş+tuğla */}
      <mesh
        ref={rightWallRef}
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2, height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial map={stoneTex} color="#080604" roughness={0.95} />
      </mesh>

      {/* Zemin süpürgelik / baseboard */}
      <mesh position={[0, 0.05, -depth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[width, 0.1, 0.04]} />
        <meshStandardMaterial color="#080810" roughness={0.5} />
      </mesh>

      {/* Halı / Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.5]} receiveShadow>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#1a1020" roughness={0.95} />
      </mesh>
    </group>
  );
}
