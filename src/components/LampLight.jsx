import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LampLight({ isLightOn, position = [1.8, 1.5, -1], ...props }) {
  const lightRef = useRef();
  const ambientRef = useRef();

  useFrame((_, delta) => {
    const lerpSpeed = delta * 3;

    if (lightRef.current) {
      const target = isLightOn ? 50 : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        target,
        lerpSpeed
      );
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={position}
        intensity={0}
        color="#ffddaa"
        distance={20}
        decay={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
        shadow-radius={4}
        {...props}
      />
      {/* İkincil dolgu ışığı — odanın diğer tarafını hafif aydınlatır */}
      <pointLight
        position={[position[0] - 1, position[1] + 0.5, position[2] + 1]}
        intensity={isLightOn ? 12 : 0}
        color="#ffeedd"
        distance={15}
        decay={1.5}
      />
    </>
  );
}
