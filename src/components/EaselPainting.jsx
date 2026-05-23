import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function EaselPainting({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const photo = useTexture('/profile-photo.png');
  photo.colorSpace = THREE.SRGBColorSpace;

  // Tuval boyutları
  const W = 0.72;
  const H = 1.00;

  const woodColor  = '#6b4120';
  const woodRough  = 0.88;
  const legRadius  = [0.011, 0.015]; // [üst, alt]
  const spread     = 0.28;           // ön ayaklar arası yatay mesafe

  // ─── Ön ayaklar ───
  // Üst: (y=1.94, z=0)   Alt: (y=0, z=0.46)
  const fTopY = 1.94, fTopZ = 0.00;
  const fBotY = 0.00, fBotZ = 0.46;
  const fLen  = Math.sqrt((fTopY - fBotY) ** 2 + (fTopZ - fBotZ) ** 2);
  const fRx   = Math.atan2(fTopZ - fBotZ, fTopY - fBotY);   // ≈ -0.233 rad
  const fCy   = (fTopY + fBotY) / 2;
  const fCz   = (fTopZ + fBotZ) / 2;

  // ─── Arka ayak ───
  // Üst: (y=1.90, z=0.04)  Alt: (y=0, z=-0.50)
  const bTopY = 1.90, bTopZ = 0.04;
  const bBotY = 0.00, bBotZ = -0.50;
  const bLen  = Math.sqrt((bTopY - bBotY) ** 2 + (bTopZ - bBotZ) ** 2);
  const bRx   = Math.atan2(bTopZ - bBotZ, bTopY - bBotY);   // ≈ +0.277 rad
  const bCy   = (bTopY + bBotY) / 2;
  const bCz   = (bTopZ + bBotZ) / 2;

  // Y yüksekliğinde ön ayağın z konumu (lineer interpolasyon)
  const frontZ = (y) => fBotZ + (y / fTopY) * (fTopZ - fBotZ);

  // Dayama çıtası (ledge) ve tuval merkezi
  const ledgeY    = 1.14;
  const ledgeZ    = frontZ(ledgeY) + 0.014;
  const canvasCY  = ledgeY + H / 2 + 0.025;
  const canvasCZ  = frontZ(canvasCY) + 0.08;  // bacakların önünde
  const canvasRx  = fRx * 0.65;   // tuval de ön ayaklarla hafif eğimli

  const wMat = (
    <meshStandardMaterial color={woodColor} roughness={woodRough} metalness={0.02} />
  );

  return (
    <group position={position} rotation={rotation}>

      {/* ─── Ön sol ayak ─── */}
      <mesh position={[-spread / 2, fCy, fCz]} rotation={[fRx, 0, 0]}>
        <cylinderGeometry args={[legRadius[0], legRadius[1], fLen, 8]} />
        {wMat}
      </mesh>

      {/* ─── Ön sağ ayak ─── */}
      <mesh position={[spread / 2, fCy, fCz]} rotation={[fRx, 0, 0]}>
        <cylinderGeometry args={[legRadius[0], legRadius[1], fLen, 8]} />
        {wMat}
      </mesh>

      {/* ─── Arka ayak ─── */}
      <mesh position={[0, bCy, bCz]} rotation={[bRx, 0, 0]}>
        <cylinderGeometry args={[legRadius[0], legRadius[1], bLen, 8]} />
        {wMat}
      </mesh>

      {/* ─── Enine bağlantı çıtası (ön ayaklar) ─── */}
      <mesh position={[0, 0.68, frontZ(0.68)]}>
        <boxGeometry args={[spread + 0.04, 0.017, 0.016]} />
        {wMat}
      </mesh>

      {/* ─── Dayama çıtası (resim altta buraya yaslanır) ─── */}
      <mesh position={[0, ledgeY, ledgeZ]}>
        <boxGeometry args={[W + 0.16, 0.023, 0.056]} />
        {wMat}
      </mesh>

      {/* ─── Tuval grubu ─── */}
      <group position={[0, canvasCY, canvasCZ]} rotation={[canvasRx, 0, 0]}>

        {/* Keten zemin (canvas rengi) */}
        <mesh position={[0, 0, -0.011]}>
          <planeGeometry args={[W + 0.065, H + 0.065]} />
          <meshStandardMaterial color="#ddd0a8" roughness={1.0} metalness={0} />
        </mesh>

        {/* Resim — boyama efekti (yüksek roughness) */}
        <mesh>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial
            map={photo}
            roughness={0.91}
            metalness={0.0}
            toneMapped={false}
          />
        </mesh>

        {/* Kasnak çerçevesi — üst */}
        <mesh position={[0, H / 2 + 0.014, 0.004]}>
          <boxGeometry args={[W + 0.064, 0.028, 0.020]} />
          {wMat}
        </mesh>
        {/* alt */}
        <mesh position={[0, -(H / 2 + 0.014), 0.004]}>
          <boxGeometry args={[W + 0.064, 0.028, 0.020]} />
          {wMat}
        </mesh>
        {/* sol */}
        <mesh position={[-(W / 2 + 0.014), 0, 0.004]}>
          <boxGeometry args={[0.028, H + 0.002, 0.020]} />
          {wMat}
        </mesh>
        {/* sağ */}
        <mesh position={[W / 2 + 0.014, 0, 0.004]}>
          <boxGeometry args={[0.028, H + 0.002, 0.020]} />
          {wMat}
        </mesh>

      </group>

    </group>
  );
}
