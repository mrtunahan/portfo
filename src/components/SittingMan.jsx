import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SKIN   = '#c8906a';
const SKIN_D = '#a0703a';
const SHIRT  = '#2d4a6e';
const SHIRTL = '#3a5f85';
const PANTS  = '#1a2035';
const SHOE   = '#1c1410';
const SOLE   = '#0a0808';
const HAIR   = '#190e04';
const BEARD  = '#241005';
const LIP    = '#9a4a3a';

function M({ c, r = 0.85, m = 0 }) {
  return <meshStandardMaterial color={c} roughness={r} metalness={m} />;
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
  const walkRef      = useRef();
  const bobRef       = useRef();
  const leftLegRef   = useRef();
  const rightLegRef  = useRef();
  const upperBodyRef = useRef();
  const headRef      = useRef();
  const rightArmRef  = useRef();

  const A = useRef({
    phase: 'idle',
    t: 0, prev: -1,
    idleDur: 8 + Math.random() * 5,
    readDur: 0,
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
    function stepLegs(t) {
      const sw = Math.sin(t * 7) * 0.22;
      if (leftLegRef.current)  leftLegRef.current.rotation.x  =  sw;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -sw;
    }
    function straightLegs() {
      if (leftLegRef.current)  leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }
    function resetPose() {
      straightLegs();
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = 0;
      if (headRef.current) { headRef.current.rotation.x = 0; headRef.current.rotation.y = 0; }
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }

    if (a.phase === 'idle') {
      if (bobRef.current) bobRef.current.position.y = Math.sin(now * 1.15) * 0.004;
      wk.position.set(0, 0, 0); wk.rotation.y = 0;
      resetPose();
      if (a.t >= a.idleDur) next('rising');

    } else if (a.phase === 'rising') {
      const k = easeInOut(clamp01(a.t / DUR_RISE));
      wk.position.set(0, lerp(0, SHELF_LOCAL[1], k), lerp(0, RISE_Z, k));
      wk.rotation.y = 0;
      if (a.t >= DUR_RISE) next('walk_to');

    } else if (a.phase === 'walk_to') {
      const k = easeInOut(clamp01(a.t / DUR_WALK));
      wk.position.x = lerp(0, SHELF_LOCAL[0], k);
      wk.position.y = SHELF_LOCAL[1] + Math.sin(a.t * 6.5) * 0.016;
      wk.position.z = lerp(RISE_Z, SHELF_LOCAL[2], k);
      wk.rotation.y = ROT_WALK_TO;
      stepLegs(a.t);
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = -0.07;
      if (a.t >= DUR_WALK) { a.readDur = 4 + Math.random() * 2.5; next('reading'); }

    } else if (a.phase === 'reading') {
      wk.position.set(...SHELF_LOCAL); wk.rotation.y = ROT_AT_SHELF;
      const ki = easeInOut(clamp01(a.t / 0.55));
      straightLegs();
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = lerp(0, -0.14, ki);
      if (headRef.current) { headRef.current.rotation.x = lerp(0, -0.32, ki); headRef.current.rotation.y = 0; }
      if (rightArmRef.current) rightArmRef.current.rotation.x = lerp(0, -0.5, ki);
      if (a.t >= a.readDur) next('walk_back');

    } else if (a.phase === 'walk_back') {
      const k = easeInOut(clamp01(a.t / DUR_WALK));
      wk.position.x = lerp(SHELF_LOCAL[0], 0, k);
      wk.position.y = SHELF_LOCAL[1] + Math.sin(a.t * 6.5) * 0.016;
      wk.position.z = lerp(SHELF_LOCAL[2], RISE_Z, k);
      wk.rotation.y = ROT_WALK_BCK;
      stepLegs(a.t);
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = -0.07;
      if (headRef.current) { headRef.current.rotation.x = 0; headRef.current.rotation.y = 0; }
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (a.t >= DUR_WALK) next('sitting');

    } else if (a.phase === 'sitting') {
      const k = easeInOut(clamp01(a.t / DUR_SIT));
      wk.position.set(0, lerp(SHELF_LOCAL[1], 0, k), lerp(RISE_Z, 0, k));
      wk.rotation.y = 0;
      if (upperBodyRef.current) upperBodyRef.current.rotation.x = lerp(-0.07, 0, k);
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
              <capsuleGeometry args={[0.076, 0.24, 6, 8]} /><M c={PANTS} />
            </mesh>
            <mesh position={[-0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.08, 10, 8]} /><M c={PANTS} />
            </mesh>
            <mesh position={[-0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.3, 6, 8]} /><M c={PANTS} />
            </mesh>
            <group position={[-0.13, 0.066, 0.64]}>
              <mesh castShadow><boxGeometry args={[0.13, 0.09, 0.26]} /><M c={SHOE} r={0.5} m={0.1} /></mesh>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={SHOE} r={0.5} m={0.1} />
              </mesh>
              <mesh position={[0, -0.044, 0]}><boxGeometry args={[0.136, 0.014, 0.28]} /><M c={SOLE} r={0.9} /></mesh>
            </group>
          </group>

          {/* SAĞ BACAK */}
          <group ref={rightLegRef}>
            <mesh position={[0.13, 0.5, 0.12]} rotation={[Math.PI / 2.1, 0, 0]} castShadow>
              <capsuleGeometry args={[0.076, 0.24, 6, 8]} /><M c={PANTS} />
            </mesh>
            <mesh position={[0.13, 0.42, 0.35]} castShadow>
              <sphereGeometry args={[0.08, 10, 8]} /><M c={PANTS} />
            </mesh>
            <mesh position={[0.13, 0.19, 0.52]} rotation={[-0.18, 0, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.3, 6, 8]} /><M c={PANTS} />
            </mesh>
            <group position={[0.13, 0.066, 0.64]}>
              <mesh castShadow><boxGeometry args={[0.13, 0.09, 0.26]} /><M c={SHOE} r={0.5} m={0.1} /></mesh>
              <mesh position={[0, 0, 0.1]} castShadow>
                <sphereGeometry args={[0.062, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={SHOE} r={0.5} m={0.1} />
              </mesh>
              <mesh position={[0, -0.044, 0]}><boxGeometry args={[0.136, 0.014, 0.28]} /><M c={SOLE} r={0.9} /></mesh>
            </group>
          </group>

          {/* ÜST GÖVDE */}
          <group position={[0, 0.5, -0.07]} ref={upperBodyRef}>
            <mesh position={[0, 0.04, 0.07]} castShadow>
              <boxGeometry args={[0.44, 0.18, 0.28]} /><M c={PANTS} />
            </mesh>
            <mesh position={[0, 0.31, 0]} castShadow>
              <boxGeometry args={[0.44, 0.38, 0.27]} /><M c={SHIRT} r={0.75} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.37, 0.1, 0.272]} /><M c={SHIRT} r={0.75} />
            </mesh>
            <mesh position={[0, 0.31, 0.137]}>
              <boxGeometry args={[0.016, 0.3, 0.005]} /><M c={SHIRTL} r={0.7} />
            </mesh>
            <mesh position={[0, 0.5, 0.1]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.12, 0.06, 0.04]} /><M c={SHIRTL} r={0.65} />
            </mesh>
            <mesh position={[-0.26, 0.44, 0]} castShadow>
              <sphereGeometry args={[0.1, 10, 8]} /><M c={SHIRT} r={0.75} />
            </mesh>

            {/* Sol kol */}
            <mesh position={[-0.29, 0.35, 0.02]} rotation={[0.2, 0, 0.1]} castShadow>
              <capsuleGeometry args={[0.054, 0.22, 6, 8]} /><M c={SHIRT} r={0.75} />
            </mesh>
            <mesh position={[-0.32, 0.21, 0.13]}>
              <sphereGeometry args={[0.057, 8, 6]} /><M c={SHIRT} r={0.75} />
            </mesh>
            <mesh position={[-0.34, 0.12, 0.23]} rotation={[0.72, 0, 0.06]} castShadow>
              <capsuleGeometry args={[0.043, 0.18, 6, 6]} /><M c={SKIN} />
            </mesh>
            <mesh position={[-0.34, 0.04, 0.31]} castShadow>
              <boxGeometry args={[0.066, 0.074, 0.052]} /><M c={SKIN} />
            </mesh>
            <mesh position={[-0.375, 0.04, 0.3]} rotation={[0, 0, 0.5]}>
              <capsuleGeometry args={[0.016, 0.025, 4, 4]} /><M c={SKIN} />
            </mesh>

            {/* Sağ kol — omuz pivot'u üzerinden ref */}
            <group ref={rightArmRef} position={[0.26, 0.44, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.1, 10, 8]} /><M c={SHIRT} r={0.75} />
              </mesh>
              <mesh position={[0.03, -0.09, 0.02]} rotation={[0.28, 0, -0.1]} castShadow>
                <capsuleGeometry args={[0.054, 0.22, 6, 8]} /><M c={SHIRT} r={0.75} />
              </mesh>
              <mesh position={[0.07, -0.24, 0.14]}>
                <sphereGeometry args={[0.057, 8, 6]} /><M c={SHIRT} r={0.75} />
              </mesh>
              <mesh position={[0.09, -0.33, 0.25]} rotation={[0.65, 0, -0.08]} castShadow>
                <capsuleGeometry args={[0.043, 0.18, 6, 6]} /><M c={SKIN} />
              </mesh>
              <mesh position={[0.10, -0.41, 0.32]} castShadow>
                <boxGeometry args={[0.066, 0.074, 0.052]} /><M c={SKIN} />
              </mesh>
              <mesh position={[0.135, -0.41, 0.31]} rotation={[0, 0, -0.5]}>
                <capsuleGeometry args={[0.016, 0.025, 4, 4]} /><M c={SKIN} />
              </mesh>
            </group>

            {/* Boyun */}
            <mesh position={[0, 0.56, 0.01]} castShadow>
              <cylinderGeometry args={[0.063, 0.078, 0.1, 10]} /><M c={SKIN} />
            </mesh>

            {/* KAFA */}
            <group position={[0, 0.74, 0.02]} ref={headRef}>
              <mesh castShadow><sphereGeometry args={[0.135, 16, 14]} /><M c={SKIN} /></mesh>
              <mesh position={[0, -0.065, 0.055]}><sphereGeometry args={[0.1, 12, 10]} /><M c={SKIN} /></mesh>
              <mesh position={[-0.088, -0.018, 0.072]}><sphereGeometry args={[0.07, 8, 6]} /><M c={SKIN} /></mesh>
              <mesh position={[0.088, -0.018, 0.072]}><sphereGeometry args={[0.07, 8, 6]} /><M c={SKIN} /></mesh>
              <mesh position={[-0.138, 0.005, 0.005]} rotation={[0, 0.25, 0]}><sphereGeometry args={[0.036, 8, 6]} /><M c={SKIN_D} r={0.9} /></mesh>
              <mesh position={[0.138, 0.005, 0.005]} rotation={[0, -0.25, 0]}><sphereGeometry args={[0.036, 8, 6]} /><M c={SKIN_D} r={0.9} /></mesh>
              <mesh position={[0, -0.012, 0.128]}><sphereGeometry args={[0.025, 8, 6]} /><M c={SKIN_D} r={0.9} /></mesh>
              <mesh position={[0, 0.01, 0.12]}><sphereGeometry args={[0.018, 8, 6]} /><M c={SKIN_D} r={0.9} /></mesh>
              <mesh position={[-0.063, 0.09, 0.115]} rotation={[0.08, 0.08, 0.2]}><boxGeometry args={[0.058, 0.016, 0.012]} /><M c={HAIR} r={1} /></mesh>
              <mesh position={[0.063, 0.09, 0.115]} rotation={[0.08, -0.08, -0.2]}><boxGeometry args={[0.058, 0.016, 0.012]} /><M c={HAIR} r={1} /></mesh>
              {/* Sol göz */}
              <mesh position={[-0.062, 0.03, 0.116]}><sphereGeometry args={[0.027, 10, 8]} /><meshStandardMaterial color="#eeebe6" roughness={0.15} /></mesh>
              <mesh position={[-0.062, 0.03, 0.14]}><circleGeometry args={[0.017, 14]} /><meshStandardMaterial color="#3d2a12" roughness={0.4} /></mesh>
              <mesh position={[-0.062, 0.03, 0.1415]}><circleGeometry args={[0.009, 14]} /><meshStandardMaterial color="#060606" /></mesh>
              <mesh position={[-0.055, 0.037, 0.1425]}><circleGeometry args={[0.004, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.1} /></mesh>
              <mesh position={[-0.062, 0.042, 0.133]} rotation={[0.28, 0, 0]}><boxGeometry args={[0.054, 0.011, 0.009]} /><M c={SKIN_D} r={0.8} /></mesh>
              {/* Sağ göz */}
              <mesh position={[0.062, 0.03, 0.116]}><sphereGeometry args={[0.027, 10, 8]} /><meshStandardMaterial color="#eeebe6" roughness={0.15} /></mesh>
              <mesh position={[0.062, 0.03, 0.14]}><circleGeometry args={[0.017, 14]} /><meshStandardMaterial color="#3d2a12" roughness={0.4} /></mesh>
              <mesh position={[0.062, 0.03, 0.1415]}><circleGeometry args={[0.009, 14]} /><meshStandardMaterial color="#060606" /></mesh>
              <mesh position={[0.069, 0.037, 0.1425]}><circleGeometry args={[0.004, 8]} /><meshStandardMaterial color="#ffffff" roughness={0.1} /></mesh>
              <mesh position={[0.062, 0.042, 0.133]} rotation={[0.28, 0, 0]}><boxGeometry args={[0.054, 0.011, 0.009]} /><M c={SKIN_D} r={0.8} /></mesh>
              {/* Ağız */}
              <mesh position={[0, -0.062, 0.12]}><boxGeometry args={[0.052, 0.013, 0.01]} /><M c={LIP} r={0.9} /></mesh>
              <mesh position={[0, -0.075, 0.118]}><sphereGeometry args={[0.022, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} /><M c={SKIN_D} r={0.9} /></mesh>
              {/* Sakal */}
              <mesh position={[0, -0.028, 0.126]}><boxGeometry args={[0.076, 0.018, 0.014]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0, -0.088, 0.1]} rotation={[0.12, 0, 0]}><boxGeometry args={[0.13, 0.068, 0.024]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[-0.073, -0.04, 0.102]} rotation={[0.05, 0.14, 0]}><boxGeometry args={[0.052, 0.075, 0.018]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0.073, -0.04, 0.102]} rotation={[0.05, -0.14, 0]}><boxGeometry args={[0.052, 0.075, 0.018]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[-0.03, -0.052, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><M c={BEARD} r={1} /></mesh>
              <mesh position={[0.03, -0.052, 0.118]}><boxGeometry args={[0.03, 0.03, 0.015]} /><M c={BEARD} r={1} /></mesh>
              {/* Saç */}
              <mesh position={[0, 0.09, -0.01]}><sphereGeometry args={[0.138, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.56]} /><M c={HAIR} r={1} /></mesh>
              <mesh position={[0, 0.11, 0.075]}><sphereGeometry args={[0.088, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.58]} /><M c={HAIR} r={1} /></mesh>
              <mesh position={[-0.1, 0.06, -0.01]}><sphereGeometry args={[0.074, 8, 6]} /><M c={HAIR} r={1} /></mesh>
              <mesh position={[0.1, 0.06, -0.01]}><sphereGeometry args={[0.074, 8, 6]} /><M c={HAIR} r={1} /></mesh>
              {[[-0.055,0.168,0.025,0.038],[0.052,0.172,0.018,0.036],[0,0.178,-0.025,0.04],[-0.09,0.148,-0.015,0.036],[0.09,0.148,-0.015,0.036],[0.002,0.135,0.085,0.034],[-0.042,0.156,0.068,0.033],[0.042,0.156,0.064,0.033]].map(([x,y,z,r],i)=>(
                <mesh key={i} position={[x,y,z]}><sphereGeometry args={[r,6,5]} /><M c={HAIR} r={1} /></mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
