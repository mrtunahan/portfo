import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const SKIN     = '#d6a07a';
const SKIN_M   = '#c4895f';
const SKIN_D   = '#8c5a35';
const SKIN_HI  = '#e8b88f';
const SHIRT    = '#2d4a6e';
const SHIRTL   = '#3a5f85';
const PANTS    = '#1a2035';
const PANTS_L  = '#252d44';
const SHOE     = '#1c1410';
const SOLE     = '#0a0808';
const HAIR     = '#1a0e05';
const HAIR_HI  = '#3a1f0a';
const BEARD    = '#2a1208';
const LIP      = '#a85a48';
const LASH     = '#160a04';

/* ─── Procedural textures (CanvasTexture) ─────────────────────────────── */
function makeSkinTextures() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  // Warm gradient base
  const g = ctx.createRadialGradient(size / 2, size / 2, 30, size / 2, size / 2, size * 0.7);
  g.addColorStop(0, '#e0a880');
  g.addColorStop(1, '#b8825e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  // Fine pores
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    ctx.fillStyle = Math.random() < 0.5
      ? `rgba(255,200,160,${Math.random() * 0.06})`
      : `rgba(80,40,20,${Math.random() * 0.08})`;
    ctx.beginPath(); ctx.arc(x, y, Math.random() * 0.9 + 0.2, 0, Math.PI * 2); ctx.fill();
  }
  // A few freckle-like spots
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = `rgba(110,60,30,${0.18 + Math.random() * 0.2})`;
    ctx.beginPath(); ctx.arc(Math.random() * size, Math.random() * size, 0.6 + Math.random() * 1.0, 0, Math.PI * 2); ctx.fill();
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;

  // Bump (grayscale pores)
  const b = document.createElement('canvas');
  b.width = b.height = size;
  const bctx = b.getContext('2d');
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    bctx.fillStyle = Math.random() < 0.5
      ? `rgba(255,255,255,${Math.random() * 0.18})`
      : `rgba(0,0,0,${Math.random() * 0.2})`;
    bctx.beginPath(); bctx.arc(x, y, Math.random() * 1.0 + 0.2, 0, Math.PI * 2); bctx.fill();
  }
  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.anisotropy = 8;
  return { map, bump };
}

function makeShirtTextures() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = SHIRT; ctx.fillRect(0, 0, size, size);
  // Cotton weave: tiny crosshatched lines
  ctx.lineWidth = 0.6;
  for (let y = 0; y < size; y += 2) {
    ctx.strokeStyle = `rgba(80,110,150,${0.07 + Math.random() * 0.05})`;
    ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(size, y + 0.5); ctx.stroke();
  }
  for (let x = 0; x < size; x += 2) {
    ctx.strokeStyle = `rgba(20,30,55,${0.06 + Math.random() * 0.04})`;
    ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, size); ctx.stroke();
  }
  // Wear / wrinkles
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.06})`;
    ctx.lineWidth = 0.4 + Math.random() * 0.7;
    ctx.beginPath();
    let cx = Math.random() * size, cy = Math.random() * size;
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 3; s++) {
      cx += (Math.random() - 0.5) * 60;
      cy += (Math.random() - 0.5) * 60;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2.5, 2.5);
  map.anisotropy = 8;

  const b = document.createElement('canvas');
  b.width = b.height = size;
  const bctx = b.getContext('2d');
  bctx.fillStyle = '#808080'; bctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    bctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.06})`;
    bctx.beginPath(); bctx.moveTo(0, y + 0.5); bctx.lineTo(size, y + 0.5); bctx.stroke();
  }
  for (let x = 0; x < size; x += 2) {
    bctx.strokeStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.06})`;
    bctx.beginPath(); bctx.moveTo(x + 0.5, 0); bctx.lineTo(x + 0.5, size); bctx.stroke();
  }
  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(2.5, 2.5);
  bump.anisotropy = 8;
  return { map, bump };
}

function makeDenimTextures() {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = PANTS; ctx.fillRect(0, 0, size, size);
  // Twill diagonal weave
  ctx.lineWidth = 0.7;
  for (let i = -size; i < size * 2; i += 2) {
    ctx.strokeStyle = `rgba(60,80,120,${0.07 + Math.random() * 0.05})`;
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + size, size); ctx.stroke();
  }
  for (let i = -size; i < size * 2; i += 2) {
    ctx.strokeStyle = `rgba(10,15,30,${0.06 + Math.random() * 0.05})`;
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - size, size); ctx.stroke();
  }
  // Speckles
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(3, 3);
  map.anisotropy = 8;
  return { map };
}

/* ─── Body silhouettes via ExtrudeGeometry ────────────────────────────── */
function tapereTorsoGeometry() {
  const s = new THREE.Shape();
  // Centered shape — X = left-right, Y from -0.19 (hem) to +0.19 (shoulders).
  // Shoulders wider at top, waist nipped, hem flared a touch.
  s.moveTo(-0.205, -0.190);
  s.bezierCurveTo(-0.220, -0.130, -0.215, -0.050, -0.190,  0.030);
  s.lineTo(-0.220,  0.190);
  s.lineTo( 0.220,  0.190);
  s.lineTo( 0.190,  0.030);
  s.bezierCurveTo( 0.215, -0.050,  0.220, -0.130,  0.205, -0.190);
  s.lineTo(-0.205, -0.190);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.27,
    bevelEnabled: true,
    bevelSize: 0.05,
    bevelThickness: 0.05,
    bevelSegments: 8,
    curveSegments: 24,
  });
}

function pelvisGeometry() {
  const s = new THREE.Shape();
  // Centered hip shape — Y from -0.09 to +0.09.
  s.moveTo(-0.220, -0.090);
  s.bezierCurveTo(-0.240, -0.030, -0.230,  0.050, -0.210,  0.090);
  s.lineTo( 0.210,  0.090);
  s.bezierCurveTo( 0.230,  0.050,  0.240, -0.030,  0.220, -0.090);
  s.lineTo(-0.220, -0.090);
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSize: 0.04,
    bevelThickness: 0.04,
    bevelSegments: 6,
    curveSegments: 18,
  });
}

/* ─── Neck via LatheGeometry (smooth tapered cylinder) ────────────────── */
function neckGeometry() {
  const pts = [
    new THREE.Vector2(0.000, 0.000),
    new THREE.Vector2(0.072, 0.000),
    new THREE.Vector2(0.066, 0.025),
    new THREE.Vector2(0.060, 0.055),
    new THREE.Vector2(0.058, 0.085),
    new THREE.Vector2(0.063, 0.100),
    new THREE.Vector2(0.000, 0.100),
  ];
  return new THREE.LatheGeometry(pts, 28);
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function clamp01(t) { return Math.min(Math.max(t, 0), 1); }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function lerp(a, b, t) { return a + (b - a) * t; }

const SHELF_LOCAL  = [4.4, -0.08, -2.5];
const RISE_Z       =  0.18;
const DUR_WALK     =  2.8;
const DUR_RISE     =  0.9;
const DUR_SIT      =  0.9;
const ROT_WALK_TO  =  2.09;
const ROT_WALK_BCK = -1.05;
const ROT_AT_SHELF =  1.951;

export default function SittingMan({ position = [0, 0, 0], ...props }) {
  const walkRef       = useRef();
  const bobRef        = useRef();
  const leftLegRef    = useRef();
  const rightLegRef   = useRef();
  const upperBodyRef  = useRef();
  const chestRef      = useRef();
  const headRef       = useRef();
  const jawRef        = useRef();
  const leftArmRef    = useRef();
  const rightArmRef   = useRef();
  const leftEyeRef    = useRef();
  const rightEyeRef   = useRef();
  const leftBrowRef   = useRef();
  const rightBrowRef  = useRef();

  // Shared geometry + textures
  const skinTex   = useMemo(makeSkinTextures,  []);
  const shirtTex  = useMemo(makeShirtTextures, []);
  const denimTex  = useMemo(makeDenimTextures, []);
  const torsoGeo  = useMemo(tapereTorsoGeometry, []);
  const pelvisGeo = useMemo(pelvisGeometry,    []);
  const neckGeo   = useMemo(neckGeometry,      []);

  const A = useRef({
    phase: 'idle',
    t: 0, prev: -1,
    idleDur: 8 + Math.random() * 5,
    readDur: 0,
    nextBlink: 1.5 + Math.random() * 2.5,
    blinkUntil: -1,
    nextGlance: 4 + Math.random() * 3,
    glanceY: 0,
    glanceX: 0,
    targetGlanceY: 0,
    targetGlanceX: 0,
  });

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const a = A.current;
    if (a.prev < 0) { a.prev = now; return; }
    const dt = now - a.prev;
    a.prev = now;
    a.t += dt;
    const wk = walkRef.current;
    if (!wk) return;

    function next(p) { a.phase = p; a.t = 0; }

    // Blinking
    a.nextBlink -= dt;
    if (a.nextBlink <= 0 && a.blinkUntil < 0) {
      a.blinkUntil = 0.14;
      a.nextBlink = 2.2 + Math.random() * 3.0;
    }
    let lidOpen = 1;
    if (a.blinkUntil > 0) {
      a.blinkUntil -= dt;
      const u = clamp01(a.blinkUntil / 0.14);
      const tri = u < 0.5 ? u * 2 : 2 - u * 2;
      lidOpen = Math.max(0.06, 1 - Math.pow(1 - tri, 1.6));
      if (a.blinkUntil <= 0) a.blinkUntil = -1;
    }
    if (leftEyeRef.current)  leftEyeRef.current.scale.y  = lidOpen;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = lidOpen;

    // Breathing
    const breath = Math.sin(now * 1.25);
    if (chestRef.current) {
      const s = 1 + breath * 0.018;
      chestRef.current.scale.set(s, 1 + breath * 0.01, s);
    }

    // Random glance targets
    a.nextGlance -= dt;
    if (a.nextGlance <= 0) {
      a.targetGlanceY = (Math.random() - 0.5) * 0.22;
      a.targetGlanceX = (Math.random() - 0.5) * 0.12;
      a.nextGlance = 3 + Math.random() * 4;
    }
    a.glanceY = lerp(a.glanceY, a.targetGlanceY, 1 - Math.pow(0.001, dt));
    a.glanceX = lerp(a.glanceX, a.targetGlanceX, 1 - Math.pow(0.001, dt));

    function stepLegs(t, amp = 0.32) {
      const sw = Math.sin(t * 6.5) * amp;
      if (leftLegRef.current)  leftLegRef.current.rotation.x  =  sw;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -sw;
    }
    function swingArms(t, amp = 0.55) {
      const sw = Math.sin(t * 6.5) * amp;
      if (leftArmRef.current)  leftArmRef.current.rotation.x  = -sw;
      if (rightArmRef.current) rightArmRef.current.rotation.x =  sw;
    }
    function straightLegs() {
      if (leftLegRef.current)  leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
    function relaxArms() {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        leftArmRef.current.rotation.z = 0;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.z = 0;
      }
    }
    function resetPose() {
      straightLegs();
      relaxArms();
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = 0;
        upperBodyRef.current.rotation.z = 0;
      }
    }

    if (a.phase === 'idle') {
      if (bobRef.current) bobRef.current.position.y = Math.sin(now * 1.15) * 0.005 + breath * 0.004;
      wk.position.set(0, 0, 0); wk.rotation.y = 0;
      resetPose();
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.z = Math.sin(now * 0.45) * 0.018;
      }
      if (headRef.current) {
        headRef.current.rotation.y = a.glanceY + Math.sin(now * 0.32) * 0.04;
        headRef.current.rotation.x = a.glanceX + Math.sin(now * 0.27) * 0.02 - breath * 0.012;
        headRef.current.rotation.z = Math.sin(now * 0.38) * 0.012;
      }
      if (leftBrowRef.current && rightBrowRef.current) {
        const lift = Math.max(0, breath) * 0.006;
        leftBrowRef.current.position.y  = 0.042 + lift;
        rightBrowRef.current.position.y = 0.042 + lift;
      }
      if (jawRef.current) jawRef.current.position.y = -0.075 - Math.max(0, breath) * 0.004;
      if (a.t >= a.idleDur) next('rising');

    } else if (a.phase === 'rising') {
      const k = easeInOut(clamp01(a.t / DUR_RISE));
      wk.position.set(0, lerp(0, SHELF_LOCAL[1], k), lerp(0, RISE_Z, k));
      wk.rotation.y = 0;
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = Math.sin(k * Math.PI) * -0.12;
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(k * Math.PI) * -0.06;
        headRef.current.rotation.y = 0;
        headRef.current.rotation.z = 0;
      }
      if (a.t >= DUR_RISE) next('walk_to');

    } else if (a.phase === 'walk_to') {
      const k = easeInOut(clamp01(a.t / DUR_WALK));
      wk.position.x = lerp(0, SHELF_LOCAL[0], k);
      wk.position.y = SHELF_LOCAL[1] + Math.abs(Math.sin(a.t * 6.5)) * 0.022;
      wk.position.z = lerp(RISE_Z, SHELF_LOCAL[2], k);
      wk.rotation.y = ROT_WALK_TO;
      stepLegs(a.t, 0.38);
      swingArms(a.t, 0.62);
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = -0.08;
        upperBodyRef.current.rotation.z = Math.sin(a.t * 6.5) * 0.05;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.04 + Math.sin(a.t * 13) * 0.014;
        headRef.current.rotation.y = Math.sin(a.t * 3.1) * 0.05;
        headRef.current.rotation.z = -Math.sin(a.t * 6.5) * 0.025;
      }
      if (a.t >= DUR_WALK) { a.readDur = 4 + Math.random() * 2.5; next('reading'); }

    } else if (a.phase === 'reading') {
      wk.position.set(...SHELF_LOCAL); wk.rotation.y = ROT_AT_SHELF;
      const ki = easeInOut(clamp01(a.t / 0.55));
      straightLegs();
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = lerp(0, -0.16, ki);
        upperBodyRef.current.rotation.z = Math.sin(a.t * 0.6) * 0.02;
      }
      if (headRef.current) {
        const scan = Math.sin(a.t * 1.6) * 0.18;
        const nod  = Math.sin(a.t * 0.9) * 0.03;
        headRef.current.rotation.x = lerp(0, -0.34, ki) + nod;
        headRef.current.rotation.y = scan * ki;
        headRef.current.rotation.z = Math.sin(a.t * 0.7) * 0.015;
      }
      if (rightArmRef.current) {
        const drift = clamp01((a.t - a.readDur * 0.6) / 1.2);
        const baseX = lerp(0, -0.55, ki);
        const baseZ = lerp(0, -0.55 * drift, 1);
        const baseY = lerp(0, -0.45 * drift, 1);
        rightArmRef.current.rotation.x = baseX + Math.sin(a.t * 1.4) * 0.05 * drift;
        rightArmRef.current.rotation.z = baseZ;
        rightArmRef.current.rotation.y = baseY;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = lerp(0, -0.35, ki);
        leftArmRef.current.rotation.z = lerp(0, -0.1, ki);
      }
      if (jawRef.current) {
        jawRef.current.position.y = -0.075 - Math.max(0, Math.sin(a.t * 4.5)) * 0.005 * ki;
      }
      if (a.t >= a.readDur) next('walk_back');

    } else if (a.phase === 'walk_back') {
      const k = easeInOut(clamp01(a.t / DUR_WALK));
      wk.position.x = lerp(SHELF_LOCAL[0], 0, k);
      wk.position.y = SHELF_LOCAL[1] + Math.abs(Math.sin(a.t * 6.5)) * 0.022;
      wk.position.z = lerp(SHELF_LOCAL[2], RISE_Z, k);
      wk.rotation.y = ROT_WALK_BCK;
      stepLegs(a.t, 0.38);
      swingArms(a.t, 0.62);
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = -0.08;
        upperBodyRef.current.rotation.z = Math.sin(a.t * 6.5) * 0.05;
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.04 + Math.sin(a.t * 13) * 0.014;
        headRef.current.rotation.y = Math.sin(a.t * 3.1) * 0.05;
        headRef.current.rotation.z = -Math.sin(a.t * 6.5) * 0.025;
      }
      if (a.t >= DUR_WALK) next('sitting');

    } else if (a.phase === 'sitting') {
      const k = easeInOut(clamp01(a.t / DUR_SIT));
      wk.position.set(0, lerp(SHELF_LOCAL[1], 0, k), lerp(RISE_Z, 0, k));
      wk.rotation.y = 0;
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = lerp(-0.08, 0, k) + Math.sin(k * Math.PI) * -0.06;
        upperBodyRef.current.rotation.z = 0;
      }
      if (headRef.current) {
        headRef.current.rotation.x = lerp(-0.04, 0, k);
        headRef.current.rotation.y = lerp(headRef.current.rotation.y, 0, k);
        headRef.current.rotation.z = 0;
      }
      relaxArms();
      straightLegs();
      if (a.t >= DUR_SIT) { next('idle'); a.idleDur = 8 + Math.random() * 5; }
    }
  });

  /* ─── Reusable material elements ─────────────────────────────────────── */
  // Skin: subsurface-style with transmission + clearcoat
  const SkinMat = ({ tone = SKIN }) => (
    <meshPhysicalMaterial
      map={skinTex.map}
      bumpMap={skinTex.bump}
      bumpScale={0.025}
      color={tone}
      roughness={0.55}
      metalness={0}
      clearcoat={0.25}
      clearcoatRoughness={0.45}
      transmission={0.06}
      thickness={0.4}
      ior={1.4}
      sheen={0.15}
      sheenRoughness={0.7}
      sheenColor="#e0a070"
      emissive="#3a1a0a"
      emissiveIntensity={0.04}
    />
  );

  // Shirt: cotton with sheen
  const ShirtMat = ({ tone = SHIRT }) => (
    <meshPhysicalMaterial
      map={shirtTex.map}
      bumpMap={shirtTex.bump}
      bumpScale={0.04}
      color={tone}
      roughness={0.78}
      metalness={0}
      sheen={0.4}
      sheenRoughness={0.55}
      sheenColor="#4a6a8a"
      clearcoat={0.06}
      clearcoatRoughness={0.7}
    />
  );

  // Pants: denim with twill
  const PantsMat = ({ tone = PANTS }) => (
    <meshPhysicalMaterial
      map={denimTex.map}
      color={tone}
      roughness={0.85}
      metalness={0}
      sheen={0.2}
      sheenRoughness={0.7}
      sheenColor="#3a4a70"
    />
  );

  // Hair: deep, slightly glossy
  const HairMat = ({ tone = HAIR }) => (
    <meshPhysicalMaterial
      color={tone}
      roughness={0.55}
      metalness={0.05}
      clearcoat={0.5}
      clearcoatRoughness={0.35}
      sheen={0.5}
      sheenRoughness={0.5}
      sheenColor="#5a3010"
    />
  );

  // Shoe: smooth leather
  const ShoeMat = () => (
    <meshPhysicalMaterial
      color={SHOE}
      roughness={0.35}
      metalness={0.1}
      clearcoat={0.6}
      clearcoatRoughness={0.25}
    />
  );

  return (
    <group position={position} {...props}>
      <group ref={walkRef}>
        <group ref={bobRef}>

          {/* SOL BACAK — denim with sheen */}
          <group ref={leftLegRef}>
            <mesh position={[-0.13, 0.5, 0.12]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.078, 0.24, 10, 16]} /><PantsMat />
            </mesh>
            <mesh position={[-0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.082, 18, 14]} /><PantsMat tone={PANTS_L} />
            </mesh>
            <mesh position={[-0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.067, 0.3, 10, 16]} /><PantsMat />
            </mesh>
            <group position={[-0.13, 0.066, 0.64]}>
              <RoundedBox args={[0.13, 0.09, 0.26]} radius={0.025} smoothness={4} creaseAngle={0.5} castShadow>
                <ShoeMat />
              </RoundedBox>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><ShoeMat />
              </mesh>
              <mesh position={[0, -0.044, 0]}>
                <boxGeometry args={[0.136, 0.014, 0.28]} />
                <meshStandardMaterial color={SOLE} roughness={0.95} />
              </mesh>
            </group>
          </group>

          {/* SAĞ BACAK */}
          <group ref={rightLegRef}>
            <mesh position={[0.13, 0.5, 0.12]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.078, 0.24, 10, 16]} /><PantsMat />
            </mesh>
            <mesh position={[0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.082, 18, 14]} /><PantsMat tone={PANTS_L} />
            </mesh>
            <mesh position={[0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.067, 0.3, 10, 16]} /><PantsMat />
            </mesh>
            <group position={[0.13, 0.066, 0.64]}>
              <RoundedBox args={[0.13, 0.09, 0.26]} radius={0.025} smoothness={4} creaseAngle={0.5} castShadow>
                <ShoeMat />
              </RoundedBox>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><ShoeMat />
              </mesh>
              <mesh position={[0, -0.044, 0]}>
                <boxGeometry args={[0.136, 0.014, 0.28]} />
                <meshStandardMaterial color={SOLE} roughness={0.95} />
              </mesh>
            </group>
          </group>

          {/* ÜST GÖVDE */}
          <group position={[0, 0.5, -0.07]} ref={upperBodyRef}>

            {/* Pelvis — extruded shape, centered on its own origin.
                Original box was at [0, 0.04, 0.07] with size [0.44, 0.18, 0.28],
                so we offset by Y +0.04 and Z -0.07 (extrude grows along +Z). */}
            <mesh
              geometry={pelvisGeo}
              position={[0, 0.04, -0.07]}
              castShadow
              receiveShadow
            >
              <PantsMat />
            </mesh>

            {/* Chest / torso — extruded silhouette (breathing).
                chestRef sits at chest center (y = 0.31 in upper-body local). */}
            <group ref={chestRef} position={[0, 0.31, 0]}>
              <mesh geometry={torsoGeo} position={[0, 0, -0.135]} castShadow receiveShadow>
                <ShirtMat />
              </mesh>
              {/* Button placket strip (down the front, centered vertically) */}
              <mesh position={[0, 0, 0.139]}>
                <boxGeometry args={[0.018, 0.32, 0.004]} />
                <meshPhysicalMaterial color={SHIRTL} roughness={0.6} sheen={0.4} sheenRoughness={0.5} sheenColor="#5a7a9a" />
              </mesh>
              {/* Buttons */}
              {[-0.12, -0.04, 0.04, 0.12].map((y, i) => (
                <mesh key={i} position={[0, y, 0.143]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.006, 0.006, 0.003, 16]} />
                  <meshPhysicalMaterial color="#1a2436" roughness={0.35} metalness={0.45} clearcoat={0.8} clearcoatRoughness={0.2} />
                </mesh>
              ))}
              {/* Collar — sits above shoulders (chest top is at y +0.19) */}
              <RoundedBox args={[0.13, 0.06, 0.045]} radius={0.012} smoothness={4} creaseAngle={0.5} position={[0, 0.19, 0.105]} rotation={[0.2, 0, 0]}>
                <ShirtMat tone={SHIRTL} />
              </RoundedBox>
            </group>

            {/* Shoulders */}
            <mesh position={[-0.26, 0.44, 0]} castShadow>
              <sphereGeometry args={[0.1, 18, 14]} /><ShirtMat />
            </mesh>

            {/* Sol kol */}
            <group ref={leftArmRef} position={[-0.26, 0.44, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.1, 18, 14]} /><ShirtMat />
              </mesh>
              <mesh position={[-0.03, -0.09, 0.02]} rotation={[0.2, 0, 0.1]} castShadow>
                <capsuleGeometry args={[0.054, 0.22, 10, 16]} /><ShirtMat />
              </mesh>
              <mesh position={[-0.06, -0.23, 0.13]}>
                <sphereGeometry args={[0.057, 16, 12]} /><ShirtMat />
              </mesh>
              <mesh position={[-0.08, -0.32, 0.23]} rotation={[0.72, 0, 0.06]} castShadow>
                <capsuleGeometry args={[0.044, 0.18, 10, 14]} /><SkinMat />
              </mesh>
              <RoundedBox
                args={[0.066, 0.074, 0.06]}
                radius={0.022} smoothness={4} creaseAngle={0.5}
                position={[-0.08, -0.4, 0.31]}
                castShadow
              >
                <SkinMat />
              </RoundedBox>
              <mesh position={[-0.115, -0.4, 0.3]} rotation={[0, 0, 0.5]}>
                <capsuleGeometry args={[0.016, 0.025, 4, 8]} /><SkinMat />
              </mesh>
            </group>

            {/* Sağ kol */}
            <group ref={rightArmRef} position={[0.26, 0.44, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.1, 18, 14]} /><ShirtMat />
              </mesh>
              <mesh position={[0.03, -0.09, 0.02]} rotation={[0.28, 0, -0.1]} castShadow>
                <capsuleGeometry args={[0.054, 0.22, 10, 16]} /><ShirtMat />
              </mesh>
              <mesh position={[0.07, -0.24, 0.14]}>
                <sphereGeometry args={[0.057, 16, 12]} /><ShirtMat />
              </mesh>
              <mesh position={[0.09, -0.33, 0.25]} rotation={[0.65, 0, -0.08]} castShadow>
                <capsuleGeometry args={[0.044, 0.18, 10, 14]} /><SkinMat />
              </mesh>
              <RoundedBox
                args={[0.066, 0.074, 0.06]}
                radius={0.022} smoothness={4} creaseAngle={0.5}
                position={[0.10, -0.41, 0.32]}
                castShadow
              >
                <SkinMat />
              </RoundedBox>
              <mesh position={[0.135, -0.41, 0.31]} rotation={[0, 0, -0.5]}>
                <capsuleGeometry args={[0.016, 0.025, 4, 8]} /><SkinMat />
              </mesh>
            </group>

            {/* Boyun — lathe-turned tapered cylinder */}
            <mesh geometry={neckGeo} position={[0, 0.51, 0.01]} castShadow>
              <SkinMat />
            </mesh>
            {/* Adam's apple */}
            <mesh position={[0, 0.555, 0.06]}>
              <sphereGeometry args={[0.013, 12, 10]} /><SkinMat tone={SKIN_M} />
            </mesh>

            {/* KAFA */}
            <group position={[0, 0.74, 0.02]} ref={headRef}>
              {/* Cranium */}
              <mesh castShadow scale={[1, 1.04, 1.02]}>
                <sphereGeometry args={[0.135, 36, 28]} /><SkinMat />
              </mesh>
              {/* Jawline */}
              <mesh position={[0, -0.062, 0.058]}>
                <sphereGeometry args={[0.1, 24, 20]} /><SkinMat />
              </mesh>
              {/* Cheekbones */}
              <mesh position={[-0.082, -0.012, 0.078]}>
                <sphereGeometry args={[0.062, 18, 14]} /><SkinMat tone={SKIN_HI} />
              </mesh>
              <mesh position={[0.082, -0.012, 0.078]}>
                <sphereGeometry args={[0.062, 18, 14]} /><SkinMat tone={SKIN_HI} />
              </mesh>
              {/* Temples */}
              <mesh position={[-0.13, 0.012, 0.012]} rotation={[0, 0.25, 0]}>
                <sphereGeometry args={[0.036, 14, 10]} /><SkinMat tone={SKIN_M} />
              </mesh>
              <mesh position={[0.13, 0.012, 0.012]} rotation={[0, -0.25, 0]}>
                <sphereGeometry args={[0.036, 14, 10]} /><SkinMat tone={SKIN_M} />
              </mesh>
              {/* Ears */}
              <mesh position={[-0.137, -0.01, -0.005]} rotation={[0, 0.4, 0.1]}>
                <sphereGeometry args={[0.024, 12, 10]} /><SkinMat tone={SKIN_M} />
              </mesh>
              <mesh position={[0.137, -0.01, -0.005]} rotation={[0, -0.4, -0.1]}>
                <sphereGeometry args={[0.024, 12, 10]} /><SkinMat tone={SKIN_M} />
              </mesh>
              {/* Nose */}
              <mesh position={[0, 0.022, 0.122]} rotation={[0.18, 0, 0]}>
                <capsuleGeometry args={[0.012, 0.05, 8, 12]} /><SkinMat tone={SKIN_M} />
              </mesh>
              <mesh position={[0, -0.012, 0.134]}>
                <sphereGeometry args={[0.026, 16, 12]} /><SkinMat tone={SKIN_M} />
              </mesh>
              <mesh position={[-0.013, -0.022, 0.131]}>
                <sphereGeometry args={[0.008, 10, 8]} />
                <meshStandardMaterial color="#3a1a0a" roughness={0.95} />
              </mesh>
              <mesh position={[0.013, -0.022, 0.131]}>
                <sphereGeometry args={[0.008, 10, 8]} />
                <meshStandardMaterial color="#3a1a0a" roughness={0.95} />
              </mesh>

              {/* Brows */}
              <mesh ref={leftBrowRef} position={[-0.063, 0.042, 0.118]} rotation={[0.08, 0.06, 0.16]}>
                <boxGeometry args={[0.06, 0.012, 0.012]} /><HairMat />
              </mesh>
              <mesh ref={rightBrowRef} position={[0.063, 0.042, 0.118]} rotation={[0.08, -0.06, -0.16]}>
                <boxGeometry args={[0.06, 0.012, 0.012]} /><HairMat />
              </mesh>

              {/* Eye sockets */}
              <mesh position={[-0.062, 0.018, 0.108]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.032, 14, 12]} />
                <meshStandardMaterial color="#5a3a26" roughness={0.95} transparent opacity={0.45} />
              </mesh>
              <mesh position={[0.062, 0.018, 0.108]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.032, 14, 12]} />
                <meshStandardMaterial color="#5a3a26" roughness={0.95} transparent opacity={0.45} />
              </mesh>

              {/* Sol göz */}
              <group ref={leftEyeRef} position={[-0.062, 0.03, 0]}>
                <mesh position={[0, 0, 0.116]}>
                  <sphereGeometry args={[0.027, 20, 16]} />
                  <meshPhysicalMaterial color="#f4f1ec" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
                </mesh>
                <mesh position={[0, 0, 0.142]}>
                  <circleGeometry args={[0.018, 24]} />
                  <meshPhysicalMaterial color="#3d2a12" roughness={0.4} clearcoat={1} clearcoatRoughness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.1435]}>
                  <circleGeometry args={[0.0085, 20]} />
                  <meshStandardMaterial color="#0a0805" />
                </mesh>
                <mesh position={[0.007, 0.008, 0.1445]}>
                  <circleGeometry args={[0.004, 12]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.04} />
                </mesh>
                <mesh position={[0, 0.024, 0.124]} rotation={[0.32, 0, 0]}>
                  <boxGeometry args={[0.056, 0.005, 0.006]} /><HairMat tone={LASH} />
                </mesh>
                <mesh position={[0, -0.02, 0.12]}>
                  <boxGeometry args={[0.05, 0.006, 0.004]} /><SkinMat tone={SKIN_M} />
                </mesh>
              </group>

              {/* Sağ göz */}
              <group ref={rightEyeRef} position={[0.062, 0.03, 0]}>
                <mesh position={[0, 0, 0.116]}>
                  <sphereGeometry args={[0.027, 20, 16]} />
                  <meshPhysicalMaterial color="#f4f1ec" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
                </mesh>
                <mesh position={[0, 0, 0.142]}>
                  <circleGeometry args={[0.018, 24]} />
                  <meshPhysicalMaterial color="#3d2a12" roughness={0.4} clearcoat={1} clearcoatRoughness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0.1435]}>
                  <circleGeometry args={[0.0085, 20]} />
                  <meshStandardMaterial color="#0a0805" />
                </mesh>
                <mesh position={[0.007, 0.008, 0.1445]}>
                  <circleGeometry args={[0.004, 12]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.04} />
                </mesh>
                <mesh position={[0, 0.024, 0.124]} rotation={[0.32, 0, 0]}>
                  <boxGeometry args={[0.056, 0.005, 0.006]} /><HairMat tone={LASH} />
                </mesh>
                <mesh position={[0, -0.02, 0.12]}>
                  <boxGeometry args={[0.05, 0.006, 0.004]} /><SkinMat tone={SKIN_M} />
                </mesh>
              </group>

              {/* Ağız */}
              <group ref={jawRef} position={[0, -0.075, 0.118]}>
                <mesh position={[0, 0.013, 0.002]}>
                  <boxGeometry args={[0.05, 0.008, 0.008]} />
                  <meshPhysicalMaterial color={LIP} roughness={0.5} clearcoat={0.6} clearcoatRoughness={0.3} sheen={0.4} sheenRoughness={0.4} sheenColor="#cc6050" />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.048, 0.006, 0.008]} />
                  <meshStandardMaterial color="#3a0e08" roughness={0.95} />
                </mesh>
                <mesh position={[0, -0.013, -0.002]}>
                  <sphereGeometry args={[0.022, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><SkinMat tone={SKIN_M} />
                </mesh>
              </group>

              {/* Sakal */}
              <mesh position={[0, -0.025, 0.124]}><boxGeometry args={[0.078, 0.014, 0.014]} /><HairMat tone={BEARD} /></mesh>
              <mesh position={[0, -0.092, 0.098]} rotation={[0.14, 0, 0]}>
                <boxGeometry args={[0.132, 0.07, 0.024]} /><HairMat tone={BEARD} />
              </mesh>
              <mesh position={[-0.076, -0.04, 0.102]} rotation={[0.05, 0.14, 0]}>
                <boxGeometry args={[0.05, 0.078, 0.018]} /><HairMat tone={BEARD} />
              </mesh>
              <mesh position={[0.076, -0.04, 0.102]} rotation={[0.05, -0.14, 0]}>
                <boxGeometry args={[0.05, 0.078, 0.018]} /><HairMat tone={BEARD} />
              </mesh>
              <mesh position={[-0.032, -0.054, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><HairMat tone={BEARD} /></mesh>
              <mesh position={[0.032, -0.054, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><HairMat tone={BEARD} /></mesh>
              {[[-0.094,-0.05,0.08],[0.094,-0.05,0.08],[-0.07,-0.095,0.1],[0.07,-0.095,0.1],[0,-0.108,0.105],[-0.04,-0.108,0.108],[0.04,-0.108,0.108]].map(([x,y,z],i)=>(
                <mesh key={i} position={[x,y,z]}><sphereGeometry args={[0.013,10,8]} /><HairMat tone={BEARD} /></mesh>
              ))}

              {/* Saç */}
              <mesh position={[0, 0.09, -0.01]}>
                <sphereGeometry args={[0.14, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.56]} /><HairMat />
              </mesh>
              <mesh position={[0, 0.11, 0.075]}>
                <sphereGeometry args={[0.09, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.58]} /><HairMat />
              </mesh>
              <mesh position={[-0.1, 0.06, -0.01]}>
                <sphereGeometry args={[0.076, 16, 12]} /><HairMat />
              </mesh>
              <mesh position={[0.1, 0.06, -0.01]}>
                <sphereGeometry args={[0.076, 16, 12]} /><HairMat />
              </mesh>
              {[[-0.04,0.18,0.02,0.03],[0.04,0.18,0.02,0.03],[0,0.185,-0.02,0.028]].map(([x,y,z,r],i)=>(
                <mesh key={'hl'+i} position={[x,y,z]}><sphereGeometry args={[r,10,8]} /><HairMat tone={HAIR_HI} /></mesh>
              ))}
              {[[-0.055,0.168,0.025,0.038],[0.052,0.172,0.018,0.036],[0,0.178,-0.025,0.04],[-0.09,0.148,-0.015,0.036],[0.09,0.148,-0.015,0.036],[0.002,0.135,0.085,0.034],[-0.042,0.156,0.068,0.033],[0.042,0.156,0.064,0.033]].map(([x,y,z,r],i)=>(
                <mesh key={i} position={[x,y,z]}><sphereGeometry args={[r,10,8]} /><HairMat /></mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

