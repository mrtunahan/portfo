import { useMemo, useState, useCallback } from 'react';
import { Html } from '@react-three/drei';

export default function Bookshelf({ position = [0, 0, 0], rotation = [0, 0, 0], isLightOn = false, ...props }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    window.open('https://scholar.google.com/citations?hl=tr&user=tSGTni0AAAAJ', '_blank');
  }, []);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const woodDark = '#1a1208';
  const woodMid = '#241a0e';
  const metalColor = '#1a1a1a';

  // Kitap koleksiyonu — her raf için farklı düzen
  const shelves = useMemo(() => [
    // Alt raf — büyük kitaplar
    {
      y: 0.15,
      books: [
        { x: -0.35, w: 0.045, h: 0.24, color: '#7a1a1a' },
        { x: -0.30, w: 0.04, h: 0.22, color: '#1a3a5f' },
        { x: -0.25, w: 0.05, h: 0.26, color: '#2a4a22' },
        { x: -0.19, w: 0.035, h: 0.20, color: '#5a3a1a' },
        { x: -0.14, w: 0.04, h: 0.23, color: '#3a1a4a' },
        { x: -0.09, w: 0.045, h: 0.25, color: '#1a4a4a' },
        // Boşluk — yatay kitap
        { x: 0.08, w: 0.18, h: 0.04, color: '#4a2a10', flat: true, fy: 0.02 },
        { x: 0.08, w: 0.16, h: 0.035, color: '#2a1a3a', flat: true, fy: 0.06 },
        { x: 0.25, w: 0.04, h: 0.21, color: '#8b4513' },
        { x: 0.30, w: 0.045, h: 0.24, color: '#1a2a5a' },
        { x: 0.36, w: 0.04, h: 0.22, color: '#3a5a2a' },
      ],
    },
    // İkinci raf
    {
      y: 0.52,
      books: [
        { x: -0.36, w: 0.04, h: 0.20, color: '#5a2a2a' },
        { x: -0.31, w: 0.05, h: 0.24, color: '#2a3a6a' },
        { x: -0.25, w: 0.035, h: 0.18, color: '#4a5a2a' },
        { x: -0.20, w: 0.04, h: 0.22, color: '#6a3a1a' },
        { x: -0.15, w: 0.045, h: 0.20, color: '#2a1a4a' },
        // Saksı bitki
        { x: 0.0, plant: true },
        { x: 0.15, w: 0.04, h: 0.23, color: '#1a5a3a' },
        { x: 0.20, w: 0.05, h: 0.25, color: '#5a1a3a' },
        { x: 0.26, w: 0.035, h: 0.19, color: '#3a3a1a' },
        { x: 0.30, w: 0.04, h: 0.22, color: '#1a3a3a' },
        { x: 0.35, w: 0.04, h: 0.21, color: '#4a2a3a' },
      ],
    },
    // Üçüncü raf
    {
      y: 0.89,
      books: [
        { x: -0.34, w: 0.05, h: 0.22, color: '#8b2500' },
        { x: -0.28, w: 0.04, h: 0.19, color: '#1e3a5f' },
        { x: -0.23, w: 0.04, h: 0.24, color: '#2d6a22' },
        { x: -0.18, w: 0.035, h: 0.17, color: '#6a3728' },
        // Fotoğraf çerçevesi
        { x: -0.05, frame: true },
        { x: 0.12, w: 0.04, h: 0.21, color: '#4a1a5a' },
        { x: 0.17, w: 0.05, h: 0.23, color: '#1a5a5a' },
        { x: 0.23, w: 0.035, h: 0.20, color: '#5a4a10' },
        { x: 0.28, w: 0.04, h: 0.22, color: '#2a3a2a' },
        { x: 0.33, w: 0.045, h: 0.25, color: '#6a1a2a' },
      ],
    },
    // Üst raf — daha az kitap
    {
      y: 1.26,
      books: [
        { x: -0.32, w: 0.045, h: 0.20, color: '#3a2a5a' },
        { x: -0.27, w: 0.04, h: 0.22, color: '#5a3a2a' },
        { x: -0.22, w: 0.04, h: 0.18, color: '#1a4a2a' },
        // Küçük heykel / dekoratif obje
        { x: -0.05, decor: true },
        { x: 0.15, w: 0.05, h: 0.24, color: '#2a1a4a' },
        { x: 0.21, w: 0.04, h: 0.20, color: '#5a5a1a' },
        { x: 0.26, w: 0.035, h: 0.22, color: '#1a3a5a' },
      ],
    },
  ], []);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      {...props}
    >
      {/* Ana gövde — arka panel */}
      <mesh position={[0, 0.78, -0.14]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 1.56, 0.02]} />
        <meshStandardMaterial
          color={hovered ? '#1a1408' : '#0f0a05'}
          roughness={0.8}
          emissive={hovered ? '#f59e0b' : '#000000'}
          emissiveIntensity={hovered ? 0.08 : 0}
        />
      </mesh>

      {/* Sol yan panel */}
      <mesh position={[-0.43, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 1.56, 0.3]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>

      {/* Sağ yan panel */}
      <mesh position={[0.43, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 1.56, 0.3]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>

      {/* Üst panel */}
      <mesh position={[0, 1.57, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.025, 0.3]} />
        <meshStandardMaterial color={woodMid} roughness={0.5} />
      </mesh>

      {/* Alt panel (taban) */}
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.025, 0.3]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>

      {/* Raf tahtaları */}
      {shelves.map((shelf, si) => (
        <group key={si}>
          {/* Raf tahtası */}
          <mesh position={[0, shelf.y - 0.015, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.84, 0.02, 0.28]} />
            <meshStandardMaterial color={woodMid} roughness={0.55} />
          </mesh>

          {/* Kitaplar ve dekoratif objeler */}
          {shelf.books.map((item, bi) => {
            if (item.plant) {
              return (
                <group key={bi} position={[item.x, shelf.y, 0.02]}>
                  {/* Saksı */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.04, 0.03, 0.06, 8]} />
                    <meshStandardMaterial color="#6a4530" roughness={0.8} />
                  </mesh>
                  {/* Toprak */}
                  <mesh position={[0, 0.03, 0]}>
                    <cylinderGeometry args={[0.038, 0.038, 0.01, 8]} />
                    <meshStandardMaterial color="#3a2a1a" roughness={1} />
                  </mesh>
                  {/* Yapraklar — küçük küre grubu */}
                  <mesh position={[0, 0.07, 0]} castShadow>
                    <sphereGeometry args={[0.04, 8, 6]} />
                    <meshStandardMaterial color="#1a4a1a" roughness={0.9} />
                  </mesh>
                  <mesh position={[0.02, 0.1, 0.01]} castShadow>
                    <sphereGeometry args={[0.03, 8, 6]} />
                    <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
                  </mesh>
                  <mesh position={[-0.02, 0.09, -0.01]} castShadow>
                    <sphereGeometry args={[0.025, 8, 6]} />
                    <meshStandardMaterial color="#1a5a1a" roughness={0.9} />
                  </mesh>
                </group>
              );
            }

            if (item.frame) {
              return (
                <group key={bi} position={[item.x, shelf.y + 0.08, 0.02]}>
                  {/* Mini çerçeve */}
                  <mesh castShadow>
                    <boxGeometry args={[0.08, 0.1, 0.01]} />
                    <meshStandardMaterial color="#3a3020" roughness={0.4} metalness={0.3} />
                  </mesh>
                  <mesh position={[0, 0, 0.006]}>
                    <planeGeometry args={[0.06, 0.08]} />
                    <meshStandardMaterial color="#2a3040" roughness={0.8} />
                  </mesh>
                  {/* Destek ayak */}
                  <mesh position={[0, -0.04, 0.04]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.04, 0.06, 0.005]} />
                    <meshStandardMaterial color="#3a3020" roughness={0.4} />
                  </mesh>
                </group>
              );
            }

            if (item.decor) {
              return (
                <group key={bi} position={[item.x, shelf.y, 0.02]}>
                  {/* Küçük dekoratif küre — cam biblo */}
                  <mesh position={[0, 0.04, 0]} castShadow>
                    <sphereGeometry args={[0.035, 12, 8]} />
                    <meshStandardMaterial
                      color="#8ab4cc"
                      roughness={0.1}
                      metalness={0.3}
                      transparent
                      opacity={0.7}
                    />
                  </mesh>
                  {/* Taban */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.025, 0.03, 0.015, 8]} />
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.6} />
                  </mesh>
                </group>
              );
            }

            if (item.flat) {
              // Yatay kitap
              return (
                <mesh key={bi} position={[item.x, shelf.y + (item.fy || 0.02), 0]} castShadow>
                  <boxGeometry args={[item.w, item.h, 0.13]} />
                  <meshStandardMaterial color={item.color} roughness={0.85} />
                </mesh>
              );
            }

            // Normal dikey kitap
            return (
              <mesh key={bi} position={[item.x, shelf.y + item.h / 2, 0]} castShadow>
                <boxGeometry args={[item.w, item.h, 0.14]} />
                <meshStandardMaterial color={item.color} roughness={0.85} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
