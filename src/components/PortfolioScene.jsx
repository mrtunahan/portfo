import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import Room from './Room';
import Sofa from './Sofa';
import SittingMan from './SittingMan';
import FloorLamp from './FloorLamp';
import LampLight from './LampLight';
import DustParticles from './DustParticles';
import { CoffeeTable, WallShelf, PictureFrame } from './Furniture';
import ContentOverlay from './ContentOverlay';
import AuroraPainting from './AuroraPainting';
import CoffeeSteam from './CoffeeSteam';
import Bookshelf from './Bookshelf';
import EaselPainting from './EaselPainting';
import SocialBoard from './SocialBoard';
import ProjectionScreen from './ProjectionScreen';
import ProjectShelves from './ProjectShelves';
import ScientificShelves from './ScientificShelves';
import Rug from './Rug';
import DemoModal from './DemoModal';

/* ─── Kamera animasyon kontrolörü ─── */
const _PROJ_CAM_POS    = new THREE.Vector3(-1.55, 2.35, -0.8);
const _PROJ_CAM_TARGET = new THREE.Vector3(-4.05, 2.35, -0.8);
const _TMP_M4 = new THREE.Matrix4();
const _TMP_Q  = new THREE.Quaternion();
const _UP     = new THREE.Vector3(0, 1, 0);

/* ─── Akademik duvar plakası ─── */
function AkademikPlaque() {
  const tex = useMemo(() => {
    const W = 512, H = 160;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // Arka plan
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1005');
    bg.addColorStop(1, '#110c04');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Üst/alt çizgi
    ctx.strokeStyle = 'rgba(245,158,11,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(24, 18); ctx.lineTo(W - 24, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, H - 18); ctx.lineTo(W - 24, H - 18); ctx.stroke();

    // Yazı
    ctx.fillStyle = '#f5c67a';
    ctx.font = 'bold 62px Arial';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '8px';
    ctx.fillText('AKADEMİK', W / 2, H / 2 + 22);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    // Sağ duvar x=6, biraz içerde; -Math.PI/2 → içe bakıyor
    <group position={[5.92, 2.55, -2.2]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Ahşap zemin */}
      <mesh>
        <boxGeometry args={[1.4, 0.44, 0.03]} />
        <meshStandardMaterial color="#2a1a08" roughness={0.72} metalness={0.05} />
      </mesh>
      {/* Canvas doku yüzeyi */}
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.34, 0.38]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.18}
          roughness={0.85}
          toneMapped={false}
        />
      </mesh>
      {/* Çerçeve şeritleri */}
      {[
        [0,  0.22,  0.022, 1.4,  0.018, 0.018],
        [0, -0.22,  0.022, 1.4,  0.018, 0.018],
        [ 0.7, 0,   0.022, 0.018, 0.44, 0.018],
        [-0.7, 0,   0.022, 0.018, 0.44, 0.018],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#c9922a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Hafif ışık */}
      <pointLight position={[0, 0, 0.4]} color="#f5c67a" intensity={0.25} distance={2.5} decay={2} />
    </group>
  );
}

/* ─── Projeler duvar plakası ─── */
function ProjelerPlaque() {
  const tex = useMemo(() => {
    const W = 512, H = 160;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // Arka plan
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1005');
    bg.addColorStop(1, '#110c04');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Üst/alt çizgi
    ctx.strokeStyle = 'rgba(245,158,11,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(24, 18); ctx.lineTo(W - 24, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, H - 18); ctx.lineTo(W - 24, H - 18); ctx.stroke();

    // Yazı
    ctx.fillStyle = '#f5c67a';
    ctx.font = 'bold 62px Arial';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '8px';
    ctx.fillText('PROJELER', W / 2, H / 2 + 22);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    // Arka duvar z=-5; 0° rotasyon → yüz +z'ye (izleyiciye) bakıyor
    <group position={[-2.4, 3.25, -4.92]} rotation={[0, 0, 0]}>
      {/* Ahşap zemin */}
      <mesh>
        <boxGeometry args={[1.4, 0.44, 0.03]} />
        <meshStandardMaterial color="#2a1a08" roughness={0.72} metalness={0.05} />
      </mesh>
      {/* Canvas doku yüzeyi */}
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.34, 0.38]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.18}
          roughness={0.85}
          toneMapped={false}
        />
      </mesh>
      {/* Çerçeve şeritleri */}
      {[
        [0,  0.22,  0.022, 1.4,  0.018, 0.018],
        [0, -0.22,  0.022, 1.4,  0.018, 0.018],
        [ 0.7, 0,   0.022, 0.018, 0.44, 0.018],
        [-0.7, 0,   0.022, 0.018, 0.44, 0.018],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#c9922a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Hafif ışık */}
      <pointLight position={[0, 0, 0.4]} color="#f5c67a" intensity={0.25} distance={2.5} decay={2} />
    </group>
  );
}

/* ─── Bilimsel projeler duvar plakası ─── */
function BilimselPlaque() {
  const tex = useMemo(() => {
    const W = 512, H = 160;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1005');
    bg.addColorStop(1, '#110c04');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(245,158,11,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(24, 18); ctx.lineTo(W - 24, 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, H - 18); ctx.lineTo(W - 24, H - 18); ctx.stroke();

    ctx.fillStyle = '#f5c67a';
    ctx.font = 'bold 44px Arial';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('BİLİMSEL PROJELER', W / 2, H / 2 + 16);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group position={[2.4, 3.25, -4.92]} rotation={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.4, 0.44, 0.03]} />
        <meshStandardMaterial color="#2a1a08" roughness={0.72} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.34, 0.38]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.18}
          roughness={0.85}
          toneMapped={false}
        />
      </mesh>
      {[
        [0,  0.22,  0.022, 1.4,  0.018, 0.018],
        [0, -0.22,  0.022, 1.4,  0.018, 0.018],
        [ 0.7, 0,   0.022, 0.018, 0.44, 0.018],
        [-0.7, 0,   0.022, 0.018, 0.44, 0.018],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#c9922a" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0.4]} color="#f5c67a" intensity={0.25} distance={2.5} decay={2} />
    </group>
  );
}

const _DEF_CAM_POS     = new THREE.Vector3(0, 2.2, 4.5);
const _DEF_CAM_TARGET  = new THREE.Vector3(0, 1.2, -1);

function CameraController({ selectedProject, orbitRef }) {
  const returning = useRef(false);
  const prevProject = useRef(null);

  useEffect(() => {
    if (prevProject.current !== null && selectedProject === null) {
      returning.current = true;
    }
    prevProject.current = selectedProject;
  }, [selectedProject]);

  useFrame((state) => {
    if (selectedProject !== null) {
      returning.current = false;
      if (orbitRef.current) orbitRef.current.enabled = false;
      state.camera.position.lerp(_PROJ_CAM_POS, 0.06);
      // Yumuşak rotasyon — anlık lookAt yerine slerp
      _TMP_M4.lookAt(state.camera.position, _PROJ_CAM_TARGET, _UP);
      _TMP_Q.setFromRotationMatrix(_TMP_M4);
      state.camera.quaternion.slerp(_TMP_Q, 0.07);
    } else if (returning.current) {
      if (orbitRef.current) orbitRef.current.enabled = false;
      state.camera.position.lerp(_DEF_CAM_POS, 0.05);
      if (orbitRef.current) {
        orbitRef.current.target.lerp(_DEF_CAM_TARGET, 0.05);
        orbitRef.current.update();
      }
      if (state.camera.position.distanceTo(_DEF_CAM_POS) < 0.2) {
        returning.current = false;
        if (orbitRef.current) orbitRef.current.enabled = true;
      }
    }
  });

  return null;
}

/* Ambient light that lerps smoothly */
function AnimatedAmbient({ isLightOn }) {
  const ref = useRef();

  return (
    <ambientLight
      ref={ref}
      intensity={isLightOn ? 0.6 : 0.03}
    />
  );
}

export default function PortfolioScene() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [flickerInt, setFlickerInt]   = useState(0);
  const [beamInt,    setBeamInt]      = useState(0);
  const orbitRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setIsLightOn(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Karta tıklandığında lambader titrer + projeksiyon ışığı süzülür
  const handleCardSelect = (project) => {
    setSelectedProject(project);

    // Lambader titreme sekansı
    const seq = [0, 75, 150, 230, 310, 400, 480, 560];
    seq.forEach((t, i) => setTimeout(() => setFlickerInt(i % 2 === 0 ? 4.0 : 0), t));
    setTimeout(() => setFlickerInt(0), 630);

    // Projeksiyon ışık süzmesi
    setBeamInt(3.5);
    setTimeout(() => setBeamInt(1.8), 250);
    setTimeout(() => setBeamInt(0.6), 500);
    setTimeout(() => setBeamInt(0),   800);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative bg-black">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2.2, 4.5], fov: 55 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        dpr={[1, 2]}
      >
        {/* Sis efekti — derinlik hissi */}
        <fog attach="fog" args={['#000005', 8, 22]} />

        {/* Ambient ışık */}
        <AnimatedAmbient isLightOn={isLightOn} />

        {/* Lamba nokta ışığı */}
        <LampLight isLightOn={isLightOn} position={[1.8, 1.5, -1.5]} />

        {/* Yarım küre ışığı — tavan + zemin genel aydınlatma */}
        <hemisphereLight
          skyColor="#b1c4e0"
          groundColor="#1a1008"
          intensity={isLightOn ? 0.35 : 0.02}
        />

        <Suspense fallback={null}>
          {/* Oda */}
          <Room isLightOn={isLightOn} />

          {/* Koltuk — odanın ortasında, arka duvara yakın */}
          <Sofa position={[0, 0, -1.5]} />

          {/* Oturan adam — koltuğun ortasında, sol tarafa (ekrana doğru) hafif dönük */}
          <SittingMan position={[0, 0, -1.5]} rotation={[0, -0.38, 0]} />

          {/* Lambader — koltuğun sağında */}
          <FloorLamp isLightOn={isLightOn} position={[1.8, 0, -1.5]} />

          {/* Sehpa — koltuğun önünde */}
          <CoffeeTable position={[0, 0, 0.3]} />

          {/* Kahve dumanı — bardağın tam üstünde */}
          <CoffeeSteam position={[0.42, 0.474, 0.18]} isLightOn={isLightOn} />

          {/* Kitaplık — Akademik plakasının altı, sağ duvar */}
          <Bookshelf
            position={[5.7, 0, -2.2]}
            rotation={[0, -Math.PI / 2, 0]}
            isLightOn={isLightOn}
          />

          {/* Çerçeveler — arka duvarda */}

          {/* Tuval + Şövalye — perdenin sağ yanında, izleyiciye bakar */}
          <EaselPainting
            position={[-3.5, 0, 0.8]}
            rotation={[0, Math.atan2(3.5, 3.7), 0]}
          />

          {/* Sosyal Medya Panosu — arka duvar tam ortası */}
          <SocialBoard position={[0, 5.94, -4.85]} />

          {/* Halı — sehpa ve koltuk altında */}
          <Rug />

          {/* Akademik plak — sağ duvar */}
          <AkademikPlaque />

          {/* Projeler plak — arka duvar, rafın üstü */}
          <ProjelerPlaque />

          {/* Bilimsel projeler plak — arka duvar sağ */}
          <BilimselPlaque />

          {/* Proje rafları — arka duvar sol */}
          <ProjectShelves onSelect={handleCardSelect} />

          {/* Bilimsel proje rafları — arka duvar sağ (simetrik) */}
          <ScientificShelves />

          {/* Projeksiyon perdesi + projektör — sol taraf */}
          <ProjectionScreen
            isLightOn={isLightOn}
            selectedProject={selectedProject}
            onClose={() => setSelectedProject(null)}
            onDemoPlay={() => setShowDemo(true)}
          />

          {/* Toz partikülleri */}
          <DustParticles isLightOn={isLightOn} />
        </Suspense>

        {/* Aurora atmosfer ışıkları */}
        <pointLight position={[-5.5, 4.5, -4]} color="#00e676" intensity={isLightOn ? 0.55 : 0} distance={14} decay={2} />
        <pointLight position={[5.5, 5, -3]}   color="#a855f7" intensity={isLightOn ? 0.45 : 0} distance={12} decay={2} />
        <pointLight position={[0, 5.5, -1]}   color="#0ea5e9" intensity={isLightOn ? 0.35 : 0} distance={13} decay={2} />
        <pointLight position={[3, 4, 1]}       color="#f59e0b" intensity={isLightOn ? 0.3  : 0} distance={8}  decay={2} />

        {/* Lambader titreme ışığı — karta tıklayınca (projektör tarafı) */}
        <pointLight position={[-2.0, 3.0, -0.5]} color="#ffd08a" intensity={flickerInt} distance={12} decay={1.8} />

        {/* Projeksiyon ışık süzmesi — karta tıklayınca */}
        <pointLight position={[-4.05, 2.8, -0.8]} color="#b0d4ff" intensity={beamInt} distance={6} decay={1.8} />

        {/* Kamera animasyonu */}
        <CameraController selectedProject={selectedProject} orbitRef={orbitRef} />

        {/* Kamera kontrolü — kısıtlı */}
        <OrbitControls
          ref={orbitRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={7}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          target={[0, 1.2, -1]}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* HTML İçerik Katmanı */}
      <ContentOverlay isLightOn={isLightOn} />

      {/* Demo Modal */}
      {showDemo && (
        <DemoModal
          projectId={selectedProject?.id ?? 0}
          onClose={() => setShowDemo(false)}
        />
      )}

      {/* Vignette efekti */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}
