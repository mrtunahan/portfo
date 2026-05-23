import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

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

function M({ c, r = 0.85, m = 0 }) {
  return <meshStandardMaterial color={c} roughness={r} metalness={m} />;
}
// Sub-surface-ish skin: lower roughness, slight emissive tint for warmth.
function Skin({ c = SKIN, r = 0.62 }) {
  return <meshStandardMaterial color={c} roughness={r} metalness={0} emissive={'#3a1a0a'} emissiveIntensity={0.06} />;
}

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

    // ── Universal "alive" sub-systems ──────────────────────────────────────
    // Blinking: brief closure every few seconds.
    a.nextBlink -= dt;
    if (a.nextBlink <= 0 && a.blinkUntil < 0) {
      a.blinkUntil = 0.14;
      a.nextBlink = 2.2 + Math.random() * 3.0;
    }
    let lidOpen = 1;
    if (a.blinkUntil > 0) {
      a.blinkUntil -= dt;
      // Triangle wave 1 → 0 → 1 across the blink window.
      const u = clamp01(a.blinkUntil / 0.14);
      lidOpen = u < 0.5 ? u * 2 : 2 - u * 2;
      lidOpen = 1 - (1 - lidOpen); // identity, but keeps shape readable
      lidOpen = Math.max(0.06, 1 - Math.pow(1 - lidOpen, 1.6));
      if (a.blinkUntil <= 0) a.blinkUntil = -1;
    }
    if (leftEyeRef.current)  leftEyeRef.current.scale.y  = lidOpen;
    if (rightEyeRef.current) rightEyeRef.current.scale.y = lidOpen;

    // Subtle breathing — drives chest scale and a tiny head lift.
    const breath = Math.sin(now * 1.25);
    if (chestRef.current) {
      const s = 1 + breath * 0.018;
      chestRef.current.scale.set(s, 1 + breath * 0.01, s);
    }

    // Slow random "glance" target update for idle / reading micro-movements.
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

    // ── Phase logic ────────────────────────────────────────────────────────
    if (a.phase === 'idle') {
      // Gentle body bob, slow weight shift, glance + breathing.
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
      // Brows lift occasionally with breathing peaks.
      if (leftBrowRef.current && rightBrowRef.current) {
        const lift = Math.max(0, breath) * 0.006;
        leftBrowRef.current.position.y  = 0.042 + lift;
        rightBrowRef.current.position.y = 0.042 + lift;
      }
      // Jaw barely opens on inhale.
      if (jawRef.current) jawRef.current.position.y = -0.075 - Math.max(0, breath) * 0.004;

      if (a.t >= a.idleDur) next('rising');

    } else if (a.phase === 'rising') {
      const k = easeInOut(clamp01(a.t / DUR_RISE));
      wk.position.set(0, lerp(0, SHELF_LOCAL[1], k), lerp(0, RISE_Z, k));
      wk.rotation.y = 0;
      // Brace forward as he pushes off the sofa.
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
      // Bob from feet pushing off — twice per stride.
      wk.position.y = SHELF_LOCAL[1] + Math.abs(Math.sin(a.t * 6.5)) * 0.022;
      wk.position.z = lerp(RISE_Z, SHELF_LOCAL[2], k);
      wk.rotation.y = ROT_WALK_TO;
      stepLegs(a.t, 0.38);
      swingArms(a.t, 0.62);
      if (upperBodyRef.current) {
        upperBodyRef.current.rotation.x = -0.08;
        upperBodyRef.current.rotation.z = Math.sin(a.t * 6.5) * 0.05; // hip sway
      }
      if (headRef.current) {
        headRef.current.rotation.x = -0.04 + Math.sin(a.t * 13) * 0.014; // tiny vertical head bob
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
        // Head down for the book + slow left/right reading scan + tiny nods.
        const scan = Math.sin(a.t * 1.6) * 0.18;
        const nod  = Math.sin(a.t * 0.9) * 0.03;
        headRef.current.rotation.x = lerp(0, -0.34, ki) + nod;
        headRef.current.rotation.y = scan * ki;
        headRef.current.rotation.z = Math.sin(a.t * 0.7) * 0.015;
      }
      if (rightArmRef.current) {
        // Reach up to the spine of the book, then drift hand to chin/beard
        // for a contemplative stroke once we're past 60% of read time.
        const drift = clamp01((a.t - a.readDur * 0.6) / 1.2);
        const baseX = lerp(0, -0.55, ki);
        const baseZ = lerp(0, -0.55 * drift, 1);
        const baseY = lerp(0, -0.45 * drift, 1);
        rightArmRef.current.rotation.x = baseX + Math.sin(a.t * 1.4) * 0.05 * drift;
        rightArmRef.current.rotation.z = baseZ;
        rightArmRef.current.rotation.y = baseY;
      }
      if (leftArmRef.current) {
        // Left arm lifts slightly, as if holding the page.
        leftArmRef.current.rotation.x = lerp(0, -0.35, ki);
        leftArmRef.current.rotation.z = lerp(0, -0.1, ki);
      }
      // Jaw moves subtly as if mouthing the words.
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

  return (
    <group position={position} {...props}>
      <group ref={walkRef}>
        <group ref={bobRef}>

          {/* SOL BACAK */}
          <group ref={leftLegRef}>
            <mesh position={[-0.13, 0.5, 0.12]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.078, 0.24, 8, 12]} /><M c={PANTS} r={0.82} />
            </mesh>
            <mesh position={[-0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.082, 14, 10]} /><M c={PANTS_L} r={0.8} />
            </mesh>
            <mesh position={[-0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.067, 0.3, 8, 12]} /><M c={PANTS} r={0.82} />
            </mesh>
            <group position={[-0.13, 0.066, 0.64]}>
              <mesh castShadow><boxGeometry args={[0.13, 0.09, 0.26]} /><M c={SHOE} r={0.4} m={0.15} /></mesh>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={SHOE} r={0.4} m={0.15} />
              </mesh>
              <mesh position={[0, -0.044, 0]}><boxGeometry args={[0.136, 0.014, 0.28]} /><M c={SOLE} r={0.95} /></mesh>
            </group>
          </group>

          {/* SAĞ BACAK */}
          <group ref={rightLegRef}>
            <mesh position={[0.13, 0.5, 0.12]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.078, 0.24, 8, 12]} /><M c={PANTS} r={0.82} />
            </mesh>
            <mesh position={[0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.082, 14, 10]} /><M c={PANTS_L} r={0.8} />
            </mesh>
            <mesh position={[0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.067, 0.3, 8, 12]} /><M c={PANTS} r={0.82} />
            </mesh>
            <group position={[0.13, 0.066, 0.64]}>
              <mesh castShadow><boxGeometry args={[0.13, 0.09, 0.26]} /><M c={SHOE} r={0.4} m={0.15} /></mesh>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={SHOE} r={0.4} m={0.15} />
              </mesh>
              <mesh position={[0, -0.044, 0]}><boxGeometry args={[0.136, 0.014, 0.28]} /><M c={SOLE} r={0.95} /></mesh>
            </group>
          </group>

          {/* ÜST GÖVDE */}
          <group position={[0, 0.5, -0.07]} ref={upperBodyRef}>
            {/* Pelvis */}
            <mesh position={[0, 0.04, 0.07]} castShadow>
              <boxGeometry args={[0.44, 0.18, 0.28]} /><M c={PANTS} r={0.82} />
            </mesh>

            {/* Chest / Torso (breathing scale lives here) */}
            <group ref={chestRef} position={[0, 0.14, 0]}>
              <mesh position={[0, 0.17, 0]} castShadow>
                <boxGeometry args={[0.44, 0.38, 0.27]} /><M c={SHIRT} r={0.78} />
              </mesh>
              {/* Belt area / hem */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.37, 0.1, 0.272]} /><M c={SHIRT} r={0.78} />
              </mesh>
              {/* Button placket */}
              <mesh position={[0, 0.17, 0.137]}>
                <boxGeometry args={[0.016, 0.3, 0.005]} /><M c={SHIRTL} r={0.65} />
              </mesh>
              {/* Tiny buttons */}
              {[0.27, 0.18, 0.09, 0.0].map((y, i) => (
                <mesh key={i} position={[0, y, 0.14]}>
                  <cylinderGeometry args={[0.0055, 0.0055, 0.003, 10]} />
                  <meshStandardMaterial color="#1a2436" roughness={0.4} metalness={0.3} />
                </mesh>
              ))}
              {/* Collar */}
              <mesh position={[0, 0.36, 0.1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.12, 0.06, 0.04]} /><M c={SHIRTL} r={0.6} />
              </mesh>
            </group>

            {/* Shoulders (matte) */}
            <mesh position={[-0.26, 0.44, 0]} castShadow>
              <sphereGeometry args={[0.1, 14, 10]} /><M c={SHIRT} r={0.78} />
            </mesh>

            {/* Sol kol — omuz pivot grubu */}
            <group ref={leftArmRef} position={[-0.26, 0.44, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.1, 14, 10]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[-0.03, -0.09, 0.02]} rotation={[0.2, 0, 0.1]} castShadow>
                <capsuleGeometry args={[0.054, 0.22, 8, 12]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[-0.06, -0.23, 0.13]}>
                <sphereGeometry args={[0.057, 12, 8]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[-0.08, -0.32, 0.23]} rotation={[0.72, 0, 0.06]} castShadow>
                <capsuleGeometry args={[0.044, 0.18, 8, 10]} /><Skin /></mesh>
              <mesh position={[-0.08, -0.4, 0.31]} castShadow>
                <boxGeometry args={[0.066, 0.074, 0.052]} /><Skin /></mesh>
              <mesh position={[-0.115, -0.4, 0.3]} rotation={[0, 0, 0.5]}>
                <capsuleGeometry args={[0.016, 0.025, 4, 6]} /><Skin /></mesh>
            </group>

            {/* Sağ kol — omuz pivot grubu */}
            <group ref={rightArmRef} position={[0.26, 0.44, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.1, 14, 10]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[0.03, -0.09, 0.02]} rotation={[0.28, 0, -0.1]} castShadow>
                <capsuleGeometry args={[0.054, 0.22, 8, 12]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[0.07, -0.24, 0.14]}>
                <sphereGeometry args={[0.057, 12, 8]} /><M c={SHIRT} r={0.78} />
              </mesh>
              <mesh position={[0.09, -0.33, 0.25]} rotation={[0.65, 0, -0.08]} castShadow>
                <capsuleGeometry args={[0.044, 0.18, 8, 10]} /><Skin /></mesh>
              <mesh position={[0.10, -0.41, 0.32]} castShadow>
                <boxGeometry args={[0.066, 0.074, 0.052]} /><Skin /></mesh>
              <mesh position={[0.135, -0.41, 0.31]} rotation={[0, 0, -0.5]}>
                <capsuleGeometry args={[0.016, 0.025, 4, 6]} /><Skin /></mesh>
            </group>

            {/* Boyun */}
            <mesh position={[0, 0.56, 0.01]} castShadow>
              <cylinderGeometry args={[0.063, 0.078, 0.1, 14]} /><Skin /></mesh>
            {/* Adem elması */}
            <mesh position={[0, 0.555, 0.06]}>
              <sphereGeometry args={[0.012, 8, 6]} /><Skin c={SKIN_M} /></mesh>

            {/* KAFA */}
            <group position={[0, 0.74, 0.02]} ref={headRef}>
              {/* Cranium (slightly elongated) */}
              <mesh castShadow scale={[1, 1.04, 1.02]}>
                <sphereGeometry args={[0.135, 28, 22]} /><Skin /></mesh>
              {/* Jawline / chin */}
              <mesh position={[0, -0.062, 0.058]}>
                <sphereGeometry args={[0.1, 20, 16]} /><Skin /></mesh>
              {/* Cheekbones */}
              <mesh position={[-0.082, -0.012, 0.078]}>
                <sphereGeometry args={[0.062, 14, 10]} /><Skin c={SKIN_HI} r={0.58} /></mesh>
              <mesh position={[0.082, -0.012, 0.078]}>
                <sphereGeometry args={[0.062, 14, 10]} /><Skin c={SKIN_HI} r={0.58} /></mesh>
              {/* Temples (a touch darker) */}
              <mesh position={[-0.13, 0.012, 0.012]} rotation={[0, 0.25, 0]}>
                <sphereGeometry args={[0.036, 12, 8]} /><Skin c={SKIN_M} r={0.78} /></mesh>
              <mesh position={[0.13, 0.012, 0.012]} rotation={[0, -0.25, 0]}>
                <sphereGeometry args={[0.036, 12, 8]} /><Skin c={SKIN_M} r={0.78} /></mesh>
              {/* Ears */}
              <mesh position={[-0.137, -0.01, -0.005]} rotation={[0, 0.4, 0.1]}>
                <sphereGeometry args={[0.024, 10, 8]} /><Skin c={SKIN_M} /></mesh>
              <mesh position={[0.137, -0.01, -0.005]} rotation={[0, -0.4, -0.1]}>
                <sphereGeometry args={[0.024, 10, 8]} /><Skin c={SKIN_M} /></mesh>
              {/* Nose bridge + tip + nostrils */}
              <mesh position={[0, 0.022, 0.122]} rotation={[0.18, 0, 0]}>
                <capsuleGeometry args={[0.012, 0.05, 6, 8]} /><Skin c={SKIN_M} /></mesh>
              <mesh position={[0, -0.012, 0.134]}>
                <sphereGeometry args={[0.026, 14, 10]} /><Skin c={SKIN_M} /></mesh>
              <mesh position={[-0.013, -0.022, 0.131]}>
                <sphereGeometry args={[0.008, 8, 6]} />
                <meshStandardMaterial color="#3a1a0a" roughness={0.95} /></mesh>
              <mesh position={[0.013, -0.022, 0.131]}>
                <sphereGeometry args={[0.008, 8, 6]} />
                <meshStandardMaterial color="#3a1a0a" roughness={0.95} /></mesh>

              {/* Brows */}
              <mesh ref={leftBrowRef} position={[-0.063, 0.042, 0.118]} rotation={[0.08, 0.06, 0.16]}>
                <boxGeometry args={[0.06, 0.012, 0.012]} /><M c={HAIR} r={0.95} />
              </mesh>
              <mesh ref={rightBrowRef} position={[0.063, 0.042, 0.118]} rotation={[0.08, -0.06, -0.16]}>
                <boxGeometry args={[0.06, 0.012, 0.012]} /><M c={HAIR} r={0.95} />
              </mesh>

              {/* Eye sockets — slight shadow */}
              <mesh position={[-0.062, 0.018, 0.108]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.032, 12, 10]} />
                <meshStandardMaterial color="#5a3a26" roughness={0.95} transparent opacity={0.45} />
              </mesh>
              <mesh position={[0.062, 0.018, 0.108]} scale={[1, 0.7, 0.5]}>
                <sphereGeometry args={[0.032, 12, 10]} />
                <meshStandardMaterial color="#5a3a26" roughness={0.95} transparent opacity={0.45} />
              </mesh>

              {/* Sol göz (blink-able) */}
              <group ref={leftEyeRef} position={[-0.062, 0.03, 0]}>
                <mesh position={[0, 0, 0.116]}>
                  <sphereGeometry args={[0.027, 16, 12]} />
                  <meshStandardMaterial color="#f4f1ec" roughness={0.18} />
                </mesh>
                <mesh position={[0, 0, 0.142]}>
                  <circleGeometry args={[0.018, 18]} />
                  <meshStandardMaterial color="#3d2a12" roughness={0.45} />
                </mesh>
                <mesh position={[0, 0, 0.1435]}>
                  <circleGeometry args={[0.0085, 16]} />
                  <meshStandardMaterial color="#0a0805" />
                </mesh>
                <mesh position={[0.007, 0.008, 0.1445]}>
                  <circleGeometry args={[0.004, 10]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.08} />
                </mesh>
                {/* Upper eyelash */}
                <mesh position={[0, 0.024, 0.124]} rotation={[0.32, 0, 0]}>
                  <boxGeometry args={[0.056, 0.005, 0.006]} /><M c={LASH} r={1} />
                </mesh>
                {/* Lower lid bag (subtle) */}
                <mesh position={[0, -0.02, 0.12]}>
                  <boxGeometry args={[0.05, 0.006, 0.004]} /><Skin c={SKIN_M} r={0.85} />
                </mesh>
              </group>

              {/* Sağ göz (blink-able) */}
              <group ref={rightEyeRef} position={[0.062, 0.03, 0]}>
                <mesh position={[0, 0, 0.116]}>
                  <sphereGeometry args={[0.027, 16, 12]} />
                  <meshStandardMaterial color="#f4f1ec" roughness={0.18} />
                </mesh>
                <mesh position={[0, 0, 0.142]}>
                  <circleGeometry args={[0.018, 18]} />
                  <meshStandardMaterial color="#3d2a12" roughness={0.45} />
                </mesh>
                <mesh position={[0, 0, 0.1435]}>
                  <circleGeometry args={[0.0085, 16]} />
                  <meshStandardMaterial color="#0a0805" />
                </mesh>
                <mesh position={[0.007, 0.008, 0.1445]}>
                  <circleGeometry args={[0.004, 10]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.08} />
                </mesh>
                <mesh position={[0, 0.024, 0.124]} rotation={[0.32, 0, 0]}>
                  <boxGeometry args={[0.056, 0.005, 0.006]} /><M c={LASH} r={1} />
                </mesh>
                <mesh position={[0, -0.02, 0.12]}>
                  <boxGeometry args={[0.05, 0.006, 0.004]} /><Skin c={SKIN_M} r={0.85} />
                </mesh>
              </group>

              {/* Ağız (jaw drives subtle open/close) */}
              <group ref={jawRef} position={[0, -0.075, 0.118]}>
                <mesh position={[0, 0.013, 0.002]}>
                  <boxGeometry args={[0.05, 0.008, 0.008]} /><M c={LIP} r={0.85} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.048, 0.006, 0.008]} />
                  <meshStandardMaterial color="#3a0e08" roughness={0.95} />
                </mesh>
                <mesh position={[0, -0.013, -0.002]}>
                  <sphereGeometry args={[0.022, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><Skin c={SKIN_M} /></mesh>
              </group>

              {/* Sakal */}
              <mesh position={[0, -0.025, 0.124]}><boxGeometry args={[0.078, 0.014, 0.014]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0, -0.092, 0.098]} rotation={[0.14, 0, 0]}>
                <boxGeometry args={[0.132, 0.07, 0.024]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[-0.076, -0.04, 0.102]} rotation={[0.05, 0.14, 0]}>
                <boxGeometry args={[0.05, 0.078, 0.018]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0.076, -0.04, 0.102]} rotation={[0.05, -0.14, 0]}>
                <boxGeometry args={[0.05, 0.078, 0.018]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[-0.032, -0.054, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0.032, -0.054, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><M c={BEARD} r={1} /></mesh>
              {/* Stubble fluff: small spheres along jawline */}
              {[[-0.094,-0.05,0.08],[0.094,-0.05,0.08],[-0.07,-0.095,0.1],[0.07,-0.095,0.1],[0,-0.108,0.105],[-0.04,-0.108,0.108],[0.04,-0.108,0.108]].map(([x,y,z],i)=>(
                <mesh key={i} position={[x,y,z]}><sphereGeometry args={[0.013,8,6]} /><M c={BEARD} r={1} /></mesh>
              ))}

              {/* Saç */}
              <mesh position={[0, 0.09, -0.01]}>
                <sphereGeometry args={[0.14, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} /><M c={HAIR} r={0.95} />
              </mesh>
              <mesh position={[0, 0.11, 0.075]}>
                <sphereGeometry args={[0.09, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} /><M c={HAIR} r={0.95} />
              </mesh>
              <mesh position={[-0.1, 0.06, -0.01]}>
                <sphereGeometry args={[0.076, 12, 10]} /><M c={HAIR} r={0.95} />
              </mesh>
              <mesh position={[0.1, 0.06, -0.01]}>
                <sphereGeometry args={[0.076, 12, 10]} /><M c={HAIR} r={0.95} />
              </mesh>
              {/* Hair highlights — slightly lighter spheres on top */}
              {[[-0.04,0.18,0.02,0.03],[0.04,0.18,0.02,0.03],[0,0.185,-0.02,0.028]].map(([x,y,z,r],i)=>(
                <mesh key={'hl'+i} position={[x,y,z]}><sphereGeometry args={[r,8,6]} /><M c={HAIR_HI} r={0.9} /></mesh>
              ))}
              {[[-0.055,0.168,0.025,0.038],[0.052,0.172,0.018,0.036],[0,0.178,-0.025,0.04],[-0.09,0.148,-0.015,0.036],[0.09,0.148,-0.015,0.036],[0.002,0.135,0.085,0.034],[-0.042,0.156,0.068,0.033],[0.042,0.156,0.064,0.033]].map(([x,y,z,r],i)=>(
                <mesh key={i} position={[x,y,z]}><sphereGeometry args={[r,8,6]} /><M c={HAIR} r={0.95} /></mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
