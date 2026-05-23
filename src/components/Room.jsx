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

export default function Room({ isLightOn }) {
  const wallMaterialRef = useRef();
  
  // Oda boyutları
  const width = 12;
  const height = 6;
  const depth = 10;

  const wallColor    = useMemo(() => new THREE.Color('#040810'), []);
  const wallColorLit  = useMemo(() => new THREE.Color('#0c2018'), []);
  const woodTex       = useMemo(() => makeWoodFloorTex(), []);
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

      {/* Arka duvar */}
      <mesh
        ref={backWallRef}
        position={[0, height / 2, -depth / 2]}
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.85} />
      </mesh>

      {/* Sol duvar */}
      <mesh
        ref={leftWallRef}
        rotation={[0, Math.PI / 2, 0]}
        position={[-width / 2, height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.85} />
      </mesh>

      {/* Sağ duvar */}
      <mesh
        ref={rightWallRef}
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2, height / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.85} />
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
