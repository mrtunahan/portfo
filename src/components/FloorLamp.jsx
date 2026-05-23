import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloorLamp({ isLightOn, position = [0, 0, 0], ...props }) {
  const shadeRef = useRef();
  const bulbRef = useRef();
  
  const emissiveTarget = useMemo(() => new THREE.Color('#ffddaa'), []);
  const emissiveOff = useMemo(() => new THREE.Color('#000000'), []);

  useFrame((_, delta) => {
    if (shadeRef.current) {
      const target = isLightOn ? 2.0 : 0;
      shadeRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        shadeRef.current.emissiveIntensity,
        target,
        delta * 3
      );
    }
    if (bulbRef.current) {
      const target = isLightOn ? 5 : 0;
      bulbRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        bulbRef.current.emissiveIntensity,
        target,
        delta * 3
      );
    }
  });

  const metalColor = '#2a2a2a';

  return (
    <group position={position} {...props}>
      {/* Taban — ağır dairesel ayak */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.04, 16]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Direk — alt bölüm */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 1.05, 8]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Direk — üst bölüm (hafif eğik) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.025, 0.45, 8]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Abajur / Shade — konik silindir */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.2, 0.28, 16, 1, true]} />
        <meshStandardMaterial
          ref={shadeRef}
          color="#3d3020"
          roughness={0.6}
          emissive="#ffddaa"
          emissiveIntensity={0}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Abajur üst kapak */}
      <mesh position={[0, 1.64, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial
          color="#3d3020"
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ampul */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial
          ref={bulbRef}
          color="#fff8e8"
          emissive="#ffddaa"
          emissiveIntensity={0}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Dekoratif halka — direk ortası */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <torusGeometry args={[0.035, 0.008, 8, 16]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}
