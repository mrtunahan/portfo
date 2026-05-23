import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AuroraPainting({ position = [0, 0, 0], rotation = [0, 0, 0], width = 1.6, height = 1.0, isLightOn }) {
  const materialRef = useRef();
  const frameWidth = 0.04;

  // Canvas texture for aurora
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state) => {
    const canvas = texture.image;
    const ctx = canvas.getContext('2d');
    const t = state.clock.elapsedTime;

    // Gece gökyüzü gradyan
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, '#020010');
    skyGrad.addColorStop(0.3, '#050520');
    skyGrad.addColorStop(0.6, '#0a0a30');
    skyGrad.addColorStop(1, '#1a1a3e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Yıldızlar — statik
    const starSeed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((starSeed * (i + 1) * 7919) % canvas.width);
      const sy = ((starSeed * (i + 1) * 6271) % (canvas.height * 0.7));
      const brightness = 0.3 + Math.sin(t * 2 + i) * 0.15;
      const size = ((i % 3) === 0) ? 1.5 : 1;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      ctx.fillRect(sx, sy, size, size);
    }

    // Aurora katmanları
    const drawAurora = (yOffset, color1, color2, speed, amplitude, thickness) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let layer = 0; layer < 3; layer++) {
        const grad = ctx.createLinearGradient(0, yOffset - thickness, 0, yOffset + thickness);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, color1);
        grad.addColorStop(0.5, color2);
        grad.addColorStop(0.7, color1);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 2) {
          const wave1 = Math.sin(x * 0.008 + t * speed + layer) * amplitude;
          const wave2 = Math.sin(x * 0.015 + t * speed * 0.7 + layer * 2) * (amplitude * 0.5);
          const wave3 = Math.sin(x * 0.003 + t * speed * 0.3) * (amplitude * 0.8);
          const y = yOffset + wave1 + wave2 + wave3;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    };

    // Yeşil ana aurora
    drawAurora(
      canvas.height * 0.35,
      'rgba(0, 255, 120, 0.12)',
      'rgba(80, 255, 180, 0.18)',
      0.4, 30, 80
    );

    // Mavi-mor aurora
    drawAurora(
      canvas.height * 0.28,
      'rgba(80, 100, 255, 0.08)',
      'rgba(150, 80, 255, 0.12)',
      0.3, 25, 60
    );

    // Pembe üst katman
    drawAurora(
      canvas.height * 0.2,
      'rgba(255, 80, 180, 0.05)',
      'rgba(200, 100, 255, 0.08)',
      0.5, 15, 40
    );

    // Dikey ışık sütunları (curtain effect)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 12; i++) {
      const x = (canvas.width / 12) * i + Math.sin(t * 0.3 + i * 0.8) * 20;
      const curtainAlpha = 0.03 + Math.sin(t * 0.5 + i * 1.2) * 0.02;
      const curtainGrad = ctx.createLinearGradient(x, 0, x, canvas.height * 0.6);
      curtainGrad.addColorStop(0, `rgba(100, 255, 180, ${curtainAlpha})`);
      curtainGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = curtainGrad;
      ctx.fillRect(x - 15, 0, 30, canvas.height * 0.6);
    }
    ctx.restore();

    // Dağ silueti — alt kenar
    ctx.fillStyle = '#0a0a15';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    const peaks = [
      [0, 0.82], [0.08, 0.75], [0.15, 0.8], [0.22, 0.7], [0.32, 0.78],
      [0.4, 0.72], [0.48, 0.76], [0.55, 0.68], [0.62, 0.74], [0.7, 0.71],
      [0.78, 0.77], [0.85, 0.73], [0.92, 0.79], [1, 0.82],
    ];
    peaks.forEach(([px, py]) => {
      ctx.lineTo(px * canvas.width, py * canvas.height);
    });
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Göl yansıması — dağların altında
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.scale(1, -0.15);
    ctx.translate(0, -canvas.height * 5.2);
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    texture.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Altın çerçeve */}
      {/* Üst */}
      <mesh position={[0, height / 2 + frameWidth / 2, 0]} castShadow>
        <boxGeometry args={[width + frameWidth * 2, frameWidth, 0.035]} />
        <meshStandardMaterial color="#8B7535" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Alt */}
      <mesh position={[0, -height / 2 - frameWidth / 2, 0]} castShadow>
        <boxGeometry args={[width + frameWidth * 2, frameWidth, 0.035]} />
        <meshStandardMaterial color="#8B7535" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Sol */}
      <mesh position={[-width / 2 - frameWidth / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, height + frameWidth * 2, 0.035]} />
        <meshStandardMaterial color="#8B7535" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Sağ */}
      <mesh position={[width / 2 + frameWidth / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameWidth, height + frameWidth * 2, 0.035]} />
        <meshStandardMaterial color="#8B7535" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Tablo canvas — animasyonlu aurora */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={isLightOn ? 0.3 : 0.05}
          roughness={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Tablo üstü spot ışık */}
      <spotLight
        position={[0, 0.8, 0.5]}
        target-position={[0, 0, 0]}
        angle={0.6}
        penumbra={0.8}
        intensity={isLightOn ? 3 : 0}
        color="#ffeedd"
        distance={3}
        decay={2}
      />
    </group>
  );
}
