import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 60;

export default function DustParticles({ isLightOn }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Lamba çevresinde yoğunlaşan dağılım
      positions[i * 3] = (Math.random() - 0.5) * 5;       // x
      positions[i * 3 + 1] = Math.random() * 3 + 0.3;     // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;   // z

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      sizes[i] = Math.random() * 0.03 + 0.01;
    }

    return { positions, velocities, sizes };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const posArray = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Yavaş hareket
      posArray[idx] += velocities[idx] + Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0003;
      posArray[idx + 1] += velocities[idx + 1] + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.7) * 0.0002;
      posArray[idx + 2] += velocities[idx + 2] + Math.cos(state.clock.elapsedTime * 0.4 + i * 0.5) * 0.0003;

      // Sınırlar içinde tut
      if (posArray[idx] > 3) posArray[idx] = -3;
      if (posArray[idx] < -3) posArray[idx] = 3;
      if (posArray[idx + 1] > 3.5) posArray[idx + 1] = 0.3;
      if (posArray[idx + 1] < 0.3) posArray[idx + 1] = 3.5;
      if (posArray[idx + 2] > 2.5) posArray[idx + 2] = -2.5;
      if (posArray[idx + 2] < -2.5) posArray[idx + 2] = 2.5;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Işık açılınca partiküller görünür
    if (materialRef.current) {
      const targetOpacity = isLightOn ? 0.4 : 0;
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        delta * 2
      );
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.025}
        color="#ffeecc"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
