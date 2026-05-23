import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function PhotoFrame({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 0.9,
  height = 1.35,
}) {
  const photo = useTexture('/profile-photo.png');
  photo.colorSpace = THREE.SRGBColorSpace;

  const frameThickness = 0.03;
  const frameDepth = 0.008;
  const frameMat = (
    <meshStandardMaterial color="#c9a84c" roughness={0.25} metalness={0.7} />
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Beyaz paspartu arka plan */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[width + frameThickness, height + frameThickness]} />
        <meshStandardMaterial color="#f0ece4" roughness={1} metalness={0} />
      </mesh>

      {/* Fotoğraf */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={photo}
          roughness={0.5}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* Çerçeve — üst */}
      <mesh position={[0, height / 2 + frameThickness / 2, 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        {frameMat}
      </mesh>

      {/* Çerçeve — alt */}
      <mesh position={[0, -(height / 2 + frameThickness / 2), 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        {frameMat}
      </mesh>

      {/* Çerçeve — sol */}
      <mesh position={[-(width / 2 + frameThickness / 2), 0, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        {frameMat}
      </mesh>

      {/* Çerçeve — sağ */}
      <mesh position={[width / 2 + frameThickness / 2, 0, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        {frameMat}
      </mesh>
    </group>
  );
}
