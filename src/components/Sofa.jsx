import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

/* ───────── Procedural leather textures ──────────────────────────────── */
function makeLeatherTextures() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Warm base with radial vignette for depth
  const grad = ctx.createRadialGradient(size / 2, size / 2, 60, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0, '#3a2014');
  grad.addColorStop(1, '#160a04');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Pebble grain
  for (let i = 0; i < 16000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.2 + 0.3;
    const light = Math.random() < 0.45;
    ctx.fillStyle = light
      ? `rgba(255,205,165,${Math.random() * 0.08})`
      : `rgba(0,0,0,${Math.random() * 0.12})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft creases — meandering low-alpha strokes
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.08})`;
    ctx.lineWidth = 0.4 + Math.random() * 0.9;
    ctx.beginPath();
    let cx = Math.random() * size;
    let cy = Math.random() * size;
    ctx.moveTo(cx, cy);
    const segs = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < segs; s++) {
      cx += (Math.random() - 0.5) * 80;
      cy += (Math.random() - 0.5) * 80;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Worn highlights — thin warm streaks
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(255,180,130,${0.04 + Math.random() * 0.05})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100);
    ctx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.6, 1.6);
  map.anisotropy = 8;

  // Bump map — grayscale version of the grain
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d');
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 16000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.4 + 0.4;
    const light = Math.random() < 0.5;
    bctx.fillStyle = light
      ? `rgba(255,255,255,${Math.random() * 0.22})`
      : `rgba(0,0,0,${Math.random() * 0.22})`;
    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fill();
  }
  // Bump creases
  for (let i = 0; i < 70; i++) {
    bctx.strokeStyle = `rgba(0,0,0,${0.18 + Math.random() * 0.18})`;
    bctx.lineWidth = 0.4 + Math.random();
    bctx.beginPath();
    let cx = Math.random() * size;
    let cy = Math.random() * size;
    bctx.moveTo(cx, cy);
    const segs = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < segs; s++) {
      cx += (Math.random() - 0.5) * 80;
      cy += (Math.random() - 0.5) * 80;
      bctx.lineTo(cx, cy);
    }
    bctx.stroke();
  }
  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(1.6, 1.6);
  bump.anisotropy = 8;

  return { map, bump };
}

/* ───────── Wooden / brass leg via LatheGeometry ─────────────────────── */
function turnedLegGeometry() {
  // Profile points (x = radius, y = height). Classic turned furniture leg.
  const pts = [
    new THREE.Vector2(0.000, 0.000),
    new THREE.Vector2(0.052, 0.000),
    new THREE.Vector2(0.046, 0.012),
    new THREE.Vector2(0.052, 0.024),
    new THREE.Vector2(0.038, 0.040),
    new THREE.Vector2(0.044, 0.058),
    new THREE.Vector2(0.034, 0.072),
    new THREE.Vector2(0.040, 0.090),
    new THREE.Vector2(0.034, 0.108),
    new THREE.Vector2(0.030, 0.118),
    new THREE.Vector2(0.000, 0.118),
  ];
  return new THREE.LatheGeometry(pts, 32);
}

/* ───────── Chesterfield rolled arm via ExtrudeGeometry ───────────────── */
function rolledArmGeometry(depth = 0.95) {
  const shape = new THREE.Shape();
  // Trace silhouette: start bottom-front, up the front, around the rolled top, down the back
  shape.moveTo(0.00, 0.00);
  shape.lineTo(0.22, 0.00);
  shape.lineTo(0.22, 0.34);
  // Rolled top — half-circle
  shape.absarc(0.11, 0.34, 0.11, 0, Math.PI, false);
  shape.lineTo(0.00, 0.34);
  shape.lineTo(0.00, 0.00);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    bevelSegments: 6,
    curveSegments: 24,
  });
}

/* ───────── Piping / welting along a path via TubeGeometry ────────────── */
function pipingGeometry(points, radius = 0.011) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'catmullrom', 0.0);
  return new THREE.TubeGeometry(curve, Math.max(20, points.length * 6), radius, 12, false);
}

/* ───────── Component ────────────────────────────────────────────────── */
export default function Sofa({ position = [0, 0, 0], ...props }) {
  const { map: leatherMap, bump: leatherBump } = useMemo(makeLeatherTextures, []);
  const legGeo  = useMemo(turnedLegGeometry, []);
  const armGeo  = useMemo(() => rolledArmGeometry(0.95), []);

  // Piping along the seat cushion top perimeter
  const seatPiping = useMemo(() => {
    // A rounded rectangle outline (top face of one cushion)
    const w = 1.13, d = 0.83, y = 0.11; // half-extents + height above cushion center
    const r = 0.06;
    const pts = [];
    const segs = 10;
    // Corners centered at (±(w/2 - r), ±(d/2 - r))
    const cx = w / 2 - r, cz = d / 2 - r;
    for (let i = 0; i <= segs; i++) {
      const a = -Math.PI / 2 + (i / segs) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, y, -cz + Math.sin(a) * r]);
    }
    for (let i = 0; i <= segs; i++) {
      const a = 0 + (i / segs) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
    }
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI / 2 + (i / segs) * (Math.PI / 2);
      pts.push([-cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]);
    }
    for (let i = 0; i <= segs; i++) {
      const a = Math.PI + (i / segs) * (Math.PI / 2);
      pts.push([-cx + Math.cos(a) * r, y, -cz + Math.sin(a) * r]);
    }
    // close
    pts.push(pts[0]);
    return pipingGeometry(pts, 0.012);
  }, []);

  // Leather material variants
  const seatMat = useMemo(() => (
    <meshPhysicalMaterial
      map={leatherMap}
      bumpMap={leatherBump}
      bumpScale={0.09}
      color="#2a160c"
      roughness={0.6}
      metalness={0.05}
      clearcoat={0.4}
      clearcoatRoughness={0.42}
      sheen={0.35}
      sheenRoughness={0.6}
      sheenColor="#7a4a28"
    />
  ), [leatherMap, leatherBump]);

  const backMat = useMemo(() => (
    <meshPhysicalMaterial
      map={leatherMap}
      bumpMap={leatherBump}
      bumpScale={0.09}
      color="#321a0e"
      roughness={0.6}
      metalness={0.05}
      clearcoat={0.45}
      clearcoatRoughness={0.4}
      sheen={0.4}
      sheenRoughness={0.55}
      sheenColor="#8a5630"
    />
  ), [leatherMap, leatherBump]);

  const frameMat = useMemo(() => (
    <meshPhysicalMaterial
      map={leatherMap}
      bumpMap={leatherBump}
      bumpScale={0.07}
      color="#160a04"
      roughness={0.68}
      metalness={0.05}
      clearcoat={0.3}
      clearcoatRoughness={0.5}
    />
  ), [leatherMap, leatherBump]);

  const pipingMat = (
    <meshPhysicalMaterial
      color="#1c0c05"
      roughness={0.55}
      metalness={0.05}
      clearcoat={0.6}
      clearcoatRoughness={0.35}
    />
  );

  const buttonMat = (
    <meshPhysicalMaterial
      color="#180a04"
      roughness={0.5}
      metalness={0.1}
      clearcoat={0.7}
      clearcoatRoughness={0.3}
    />
  );

  const woodMat = (
    <meshPhysicalMaterial
      color="#2a160a"
      roughness={0.45}
      metalness={0.15}
      clearcoat={0.45}
      clearcoatRoughness={0.35}
    />
  );

  return (
    <group position={position} {...props}>
      {/* Frame / plinth */}
      <RoundedBox
        args={[2.6, 0.18, 0.95]}
        radius={0.045}
        smoothness={4}
        creaseAngle={0.5}
        position={[0, 0.21, 0]}
        castShadow
        receiveShadow
      >
        {frameMat}
      </RoundedBox>

      {/* Seat cushions — pillowy RoundedBoxes with piping */}
      {[-0.85, 0, 0.85].map((x, i) => (
        <group key={'seat' + i} position={[x, 0.4, 0.02]}>
          <RoundedBox args={[0.83, 0.22, 0.84]} radius={0.085} smoothness={5} creaseAngle={0.5} castShadow receiveShadow>
            {seatMat}
          </RoundedBox>
          {/* Top-edge piping */}
          <mesh geometry={seatPiping} castShadow>
            {pipingMat}
          </mesh>
        </group>
      ))}

      {/* Back base — slight backward tilt */}
      <RoundedBox
        args={[2.6, 0.6, 0.22]}
        radius={0.06}
        smoothness={4}
        creaseAngle={0.5}
        position={[0, 0.75, -0.385]}
        rotation={[-0.06, 0, 0]}
        castShadow
        receiveShadow
      >
        {frameMat}
      </RoundedBox>

      {/* Back cushions — taller, soft, button-tufted */}
      {[-0.85, 0, 0.85].map((x, i) => (
        <group key={'back' + i} position={[x, 0.78, -0.255]} rotation={[-0.08, 0, 0]}>
          <RoundedBox args={[0.78, 0.56, 0.2]} radius={0.11} smoothness={5} creaseAngle={0.5} castShadow>
            {backMat}
          </RoundedBox>
          {/* Tufting buttons — 2x3 grid pressed into the front face */}
          {[-0.18, 0.18].map((bx, bi) => (
            [-0.16, 0, 0.16].map((by, byi) => (
              <group key={`b${bi}_${byi}`} position={[bx, by, 0.092]}>
                {/* Recess shadow disc */}
                <mesh position={[0, 0, -0.005]}>
                  <circleGeometry args={[0.022, 24]} />
                  <meshBasicMaterial color="#0a0402" transparent opacity={0.5} />
                </mesh>
                {/* Button itself */}
                <mesh castShadow>
                  <sphereGeometry args={[0.014, 16, 12]} />
                  {buttonMat}
                </mesh>
              </group>
            ))
          ))}
        </group>
      ))}

      {/* Chesterfield rolled arms (ExtrudeGeometry) — left/right */}
      <group position={[-1.42, 0.21, -0.475]}>
        <mesh geometry={armGeo} castShadow receiveShadow>
          {frameMat}
        </mesh>
      </group>
      <group position={[1.42 - 0.22, 0.21, -0.475]}>
        <mesh geometry={armGeo} castShadow receiveShadow>
          {frameMat}
        </mesh>
      </group>

      {/* Arm-roll piping along the top arc — left/right */}
      {[-1.31, 1.31].map((armX, idx) => {
        const points = [];
        const segs = 24;
        // Trace the rolled top arc at each end (front and back of the arm)
        const r = 0.11;
        const yCenter = 0.55;
        // Build a tube that follows: front arc → along the top length → back arc
        // Front arc (z = -0.475 + 0.95 = 0.475 is front face)
        for (let i = 0; i <= segs; i++) {
          const a = Math.PI - (i / segs) * Math.PI;
          points.push([armX, yCenter + Math.sin(a) * r, 0.475 + Math.cos(a) * r]);
        }
        // Back arc (z = -0.475 is back face)
        for (let i = 0; i <= segs; i++) {
          const a = (i / segs) * Math.PI;
          points.push([armX, yCenter + Math.sin(a) * r, -0.475 + Math.cos(a) * r]);
        }
        const geo = pipingGeometry(points, 0.014);
        return <mesh key={'armpipe' + idx} geometry={geo} castShadow>{pipingMat}</mesh>;
      })}

      {/* Turned wooden feet (LatheGeometry) at the four corners */}
      {[[-1.18, 0.36], [1.18, 0.36], [-1.18, -0.36], [1.18, -0.36]].map(([x, z], i) => (
        <mesh key={'foot' + i} geometry={legGeo} position={[x, 0.0, z]} castShadow>
          {woodMat}
        </mesh>
      ))}

      {/* A subtle floor contact shadow disc (helps ground the sofa visually) */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}
