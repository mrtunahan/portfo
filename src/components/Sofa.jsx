import { useMemo } from 'react';
import * as THREE from 'three';

export default function Sofa({ position = [0, 0, 0], ...props }) {
  const cushionColor = '#2d1810';
  const frameColor = '#1a0e08';
  const leatherMat = useMemo(() => ({
    color: cushionColor,
    roughness: 0.7,
    metalness: 0.05,
  }), []);
  const frameMat = useMemo(() => ({
    color: frameColor,
    roughness: 0.4,
    metalness: 0.2,
  }), []);

  return (
    <group position={position} {...props}>
      {/* Koltuk tabanı / frame */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.15, 0.95]} />
        <meshStandardMaterial {...frameMat} />
      </mesh>

      {/* Oturma yastığı — sol */}
      <mesh position={[-0.65, 0.38, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.2, 0.85]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Oturma yastığı — orta */}
      <mesh position={[0, 0.38, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.2, 0.85]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Oturma yastığı — sağ */}
      <mesh position={[0.65, 0.38, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.2, 0.85]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Sırtlık */}
      <mesh position={[0, 0.7, -0.38]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.55, 0.18]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Sırtlık yastıkları — sol */}
      <mesh position={[-0.65, 0.72, -0.26]} castShadow>
        <boxGeometry args={[0.75, 0.45, 0.08]} />
        <meshStandardMaterial color="#3a2015" roughness={0.8} />
      </mesh>

      {/* Sırtlık yastıkları — orta */}
      <mesh position={[0, 0.72, -0.26]} castShadow>
        <boxGeometry args={[0.75, 0.45, 0.08]} />
        <meshStandardMaterial color="#3a2015" roughness={0.8} />
      </mesh>

      {/* Sırtlık yastıkları — sağ */}
      <mesh position={[0.65, 0.72, -0.26]} castShadow>
        <boxGeometry args={[0.75, 0.45, 0.08]} />
        <meshStandardMaterial color="#3a2015" roughness={0.8} />
      </mesh>

      {/* Sol kolçak */}
      <mesh position={[-1.38, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.45, 0.95]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Sağ kolçak */}
      <mesh position={[1.38, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.45, 0.95]} />
        <meshStandardMaterial {...leatherMat} />
      </mesh>

      {/* Ayaklar */}
      {[[-1.1, 0.05, 0.35], [1.1, 0.05, 0.35], [-1.1, 0.05, -0.35], [1.1, 0.05, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
          <meshStandardMaterial color="#0f0905" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
