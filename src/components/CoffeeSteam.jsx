import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STEAM_COUNT = 24;

export default function CoffeeSteam({ position = [0, 0, 0], isLightOn }) {
  const meshRef = useRef();
  const materialRef = useRef();

  const { basePositions, speeds, offsets, scales } = useMemo(() => {
    const basePositions = new Float32Array(STEAM_COUNT * 3);
    const speeds = new Float32Array(STEAM_COUNT);
    const offsets = new Float32Array(STEAM_COUNT);
    const scales = new Float32Array(STEAM_COUNT);

    for (let i = 0; i < STEAM_COUNT; i++) {
      // Bardağın ağız çapı içinde rastgele başlangıç
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.025;
      basePositions[i * 3] = Math.cos(angle) * radius;
      basePositions[i * 3 + 1] = 0;
      basePositions[i * 3 + 2] = Math.sin(angle) * radius;

      speeds[i] = 0.12 + Math.random() * 0.1;
      offsets[i] = Math.random() * Math.PI * 2;
      scales[i] = 0.8 + Math.random() * 0.5;
    }

    return { basePositions, speeds, offsets, scales };
  }, []);

  const positions = useMemo(() => new Float32Array(STEAM_COUNT * 3), []);
  const sizes = useMemo(() => new Float32Array(STEAM_COUNT), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < STEAM_COUNT; i++) {
      const idx = i * 3;
      // Her partikül kendi döngüsünde yukarı çıkar ve tekrar başlar
      const cycleTime = (t * speeds[i] + offsets[i]) % 1.0;

      // Yükselme
      const height = cycleTime * 0.45;
      // Yanlara doğru hafif salınım
      const sway = Math.sin(t * 1.5 + offsets[i]) * 0.015 * cycleTime;
      const swayZ = Math.cos(t * 1.2 + offsets[i] * 1.3) * 0.012 * cycleTime;

      positions[idx] = basePositions[idx] + sway;
      positions[idx + 1] = height;
      positions[idx + 2] = basePositions[idx + 2] + swayZ;

      // Boyut: başta küçük, yükseldikçe büyür, sonra küçülür
      const sizeAlpha = cycleTime < 0.3
        ? cycleTime / 0.3
        : 1.0 - (cycleTime - 0.3) / 0.7;
      sizes[i] = sizeAlpha * 0.018 * scales[i];
    }

    meshRef.current.geometry.attributes.position.array.set(positions);
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.attributes.size.array.set(sizes);
    meshRef.current.geometry.attributes.size.needsUpdate = true;

    // Duman sadece ışık açıkken görünür
    if (materialRef.current) {
      const targetOpacity = isLightOn ? 0.35 : 0;
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        0.02
      );
    }
  });

  return (
    <points ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STEAM_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={STEAM_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.02}
        color="#e8ddd0"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
