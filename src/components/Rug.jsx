import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Rug({ position = [0, 0.018, -0.5], width = 5.2, depth = 7.5 }) {
  const tex = useTexture('/rug.png');

  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={tex}
        roughness={0.95}
        metalness={0}
        toneMapped={false}
      />
    </mesh>
  );
}
