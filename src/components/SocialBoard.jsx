import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Canvas fallback ikon çizicileri ─── */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}
function mkGithub() {
  const s=512, cv=document.createElement('canvas'); cv.width=cv.height=s;
  const c=cv.getContext('2d');
  rr(c,0,0,s,s,80); c.fillStyle='#161b22'; c.fill();
  const cx=s/2, cy=s*0.44, r=s*0.28;
  c.fillStyle='#ffffff';
  [[cx-r*0.68,cy-r*0.52,cx-r*0.48,cy-r*1.05,cx-r*0.04,cy-r*0.78],
   [cx+r*0.68,cy-r*0.52,cx+r*0.48,cy-r*1.05,cx+r*0.04,cy-r*0.78]
  ].forEach(([x1,y1,x2,y2,x3,y3])=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.lineTo(x3,y3);c.closePath();c.fill();});
  c.beginPath(); c.arc(cx,cy,r,0,Math.PI*2); c.fill();
  c.beginPath(); c.arc(cx,cy+r*1.12,r*0.5,-Math.PI,0); c.fill();
  c.fillStyle='#161b22';
  c.beginPath(); c.arc(cx-r*0.28,cy-r*0.06,r*0.1,0,Math.PI*2); c.fill();
  c.beginPath(); c.arc(cx+r*0.28,cy-r*0.06,r*0.1,0,Math.PI*2); c.fill();
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}
function mkInstagram() {
  const s=512, cv=document.createElement('canvas'); cv.width=cv.height=s;
  const c=cv.getContext('2d');
  const g=c.createLinearGradient(s,s,0,0);
  g.addColorStop(0,'#ffd600'); g.addColorStop(0.18,'#ff6d00');
  g.addColorStop(0.44,'#e91e63'); g.addColorStop(0.7,'#9c27b0'); g.addColorStop(1,'#5c35cc');
  rr(c,0,0,s,s,90); c.fillStyle=g; c.fill();
  const shine=c.createRadialGradient(s*0.28,s*0.22,0,s*0.32,s*0.28,s*0.6);
  shine.addColorStop(0,'rgba(255,255,255,0.28)'); shine.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=shine; c.fillRect(0,0,s,s);
  const pad=s*0.15;
  c.strokeStyle='#fff'; c.lineWidth=s*0.07;
  c.shadowColor='rgba(255,255,255,0.5)'; c.shadowBlur=14;
  rr(c,pad,pad,s-pad*2,s-pad*2,s*0.22); c.stroke();
  c.beginPath(); c.arc(s/2,s/2,s*0.195,0,Math.PI*2); c.stroke();
  c.shadowBlur=0; c.fillStyle='#fff';
  c.beginPath(); c.arc(s*0.73,s*0.27,s*0.055,0,Math.PI*2); c.fill();
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}
function mkLinkedIn() {
  const s=512, cv=document.createElement('canvas'); cv.width=cv.height=s;
  const c=cv.getContext('2d');
  rr(c,0,0,s,s,80); c.fillStyle='#0a66c2'; c.fill();
  const shine=c.createRadialGradient(s*0.28,s*0.22,0,s*0.34,s*0.28,s*0.7);
  shine.addColorStop(0,'rgba(255,255,255,0.28)'); shine.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=shine; c.fillRect(0,0,s,s);
  c.fillStyle='#ffffff'; c.shadowColor='rgba(255,255,255,0.6)'; c.shadowBlur=18;
  c.font=`bold ${s*0.54}px Arial`; c.textAlign='center'; c.textBaseline='middle';
  c.fillText('in',s/2,s*0.48); c.shadowBlur=0;
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}
function mkMail() {
  const s=512, cv=document.createElement('canvas'); cv.width=cv.height=s;
  const c=cv.getContext('2d');
  const bg=c.createLinearGradient(s/2,0,s/2,s);
  bg.addColorStop(0,'#5ac8fa'); bg.addColorStop(1,'#2673db');
  rr(c,0,0,s,s,88); c.fillStyle=bg; c.fill();
  const shine=c.createRadialGradient(s*0.28,s*0.22,0,s*0.32,s*0.28,s*0.62);
  shine.addColorStop(0,'rgba(255,255,255,0.3)'); shine.addColorStop(1,'rgba(255,255,255,0)');
  c.fillStyle=shine; c.fillRect(0,0,s,s);
  c.strokeStyle='rgba(255,255,255,0.98)'; c.lineWidth=s*0.062;
  c.lineJoin='round'; c.lineCap='round';
  c.shadowColor='rgba(255,255,255,0.5)'; c.shadowBlur=14;
  const ex=s*0.12,ey=s*0.26,ew=s*0.76,eh=s*0.48;
  c.beginPath(); c.rect(ex,ey,ew,eh); c.stroke();
  c.beginPath(); c.moveTo(ex,ey); c.lineTo(ex+ew/2,ey+eh*0.52); c.lineTo(ex+ew,ey); c.stroke();
  c.beginPath(); c.moveTo(ex,ey+eh); c.lineTo(ex+ew*0.42,ey+eh*0.5); c.stroke();
  c.beginPath(); c.moveTo(ex+ew,ey+eh); c.lineTo(ex+ew*0.58,ey+eh*0.5); c.stroke();
  c.shadowBlur=0;
  const t=new THREE.CanvasTexture(cv); t.colorSpace=THREE.SRGBColorSpace; return t;
}

/* PNG varsa PNG kullan, yoksa canvas fallback */
function useIconTexture(path, fallbackFn) {
  const [tex] = useState(() => fallbackFn());
  useEffect(() => {
    new THREE.TextureLoader().load(
      path,
      (loaded) => { loaded.colorSpace = THREE.SRGBColorSpace; Object.assign(tex, loaded); tex.needsUpdate = true; },
      undefined,
      () => { /* dosya yok, canvas fallback kalır */ }
    );
  }, [path, tex, fallbackFn]);
  return tex;
}

function Nail({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.01]}>
        <cylinderGeometry args={[0.004, 0.003, 0.022, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.009, 8, 8]} />
        <meshStandardMaterial color="#ddd" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

/* ─── Ana bileşen ─── */
export default function SocialBoard({ position = [0, 0, 0] }) {
  const gTex = useIconTexture('/icons/github.png',    mkGithub);
  const iTex = useIconTexture('/icons/instagram.png', mkInstagram);
  const lTex = useIconTexture('/icons/linkedin.png',  mkLinkedIn);
  const eTex = useIconTexture('/icons/mail.png',      mkMail);

  const plaqueTex = useMemo(() => {
    const PW = 1024, PH = 256;
    const c = document.createElement('canvas');
    c.width = PW; c.height = PH;
    const ctx = c.getContext('2d');
    const bg = ctx.createLinearGradient(0, 0, PW, PH);
    bg.addColorStop(0, '#1a1005');
    bg.addColorStop(1, '#110c04');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, PW, PH);
    ctx.strokeStyle = 'rgba(245,158,11,0.55)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(36, 28); ctx.lineTo(PW - 36, 28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(36, PH - 28); ctx.lineTo(PW - 36, PH - 28); ctx.stroke();
    // Glow katmanı
    ctx.shadowColor = '#f5c67a';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffe0a0';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '12px';
    ctx.fillText('İLETİŞİM', PW / 2, PH / 2 + 34);
    // Keskin ana metin üstüne
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f5c67a';
    ctx.fillText('İLETİŞİM', PW / 2, PH / 2 + 34);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 16;
    return t;
  }, []);

  const swingRef = useRef();
  useFrame(({ clock }) => {
    if (swingRef.current)
      swingRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.38) * 0.028;
  });

  const sz = 0.27;
  const sp = 0.38;
  const ROPE_LEN  = 2.1;
  const boardW    = sp * 3 + sz * 2.1;          // ~1.707
  const boardH    = sz * 1.75;                   // ~0.473
  const boardTop  = -ROPE_LEN;                   // y of board top
  const boardCY   = boardTop - boardH / 2 - 0.01;
  const PW3       = boardW - 0.04;               // plaka genişliği ~1.667
  const PH3       = 0.22;
  const plaqueCY  = boardTop + PH3 / 2 + 0.025;  // pano üstü
  const ropeSpan  = 0.52;                        // ceiling hook x offset
  const hookX     = boardW / 2 - 0.08;           // where rope meets board top

  const socials = [
    { tex: gTex, x: -sp*1.5, href: 'https://github.com/mrtunahan' },
    { tex: iTex, x: -sp*0.5, href: 'https://www.instagram.com/tunahan_korkmaz_tk/' },
    { tex: lTex, x:  sp*0.5, href: 'https://www.linkedin.com/in/tunahank94/' },
    { tex: eTex, x:  sp*1.5, href: 'mailto:ahmettunahankorkmaz@karatekin.edu.tr' },
  ];

  const leftRopeGeo = useMemo(() => {
    const A = new THREE.Vector3(-ropeSpan, 0, 0.02);
    const B = new THREE.Vector3(-hookX, boardTop, 0.02);
    const M = new THREE.Vector3((A.x+B.x)/2, (A.y+B.y)/2 - 0.05, 0.02);
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([A,M,B]), 24, 0.0045, 5, false);
  }, []);

  const rightRopeGeo = useMemo(() => {
    const A = new THREE.Vector3(ropeSpan, 0, 0.02);
    const B = new THREE.Vector3(hookX, boardTop, 0.02);
    const M = new THREE.Vector3((A.x+B.x)/2, (A.y+B.y)/2 - 0.05, 0.02);
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([A,M,B]), 24, 0.0045, 5, false);
  }, []);

  return (
    <group position={position}>
      {/* Tavan kancaları (static) */}
      {[-ropeSpan, ropeSpan].map((x, i) => (
        <mesh key={i} position={[x, -0.024, 0]} rotation={[0,0,0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.048, 8]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.88} roughness={0.12} />
        </mesh>
      ))}

      {/* Sallanma grubu — pivot tavan */}
      <group ref={swingRef}>
        {/* İp sol */}
        <mesh geometry={leftRopeGeo}>
          <meshStandardMaterial color="#8b6914" roughness={0.78} metalness={0.08} />
        </mesh>
        {/* İp sağ */}
        <mesh geometry={rightRopeGeo}>
          <meshStandardMaterial color="#8b6914" roughness={0.78} metalness={0.08} />
        </mesh>

        {/* İletişim plakası — pano üstü */}
        <group position={[0, plaqueCY, 0]}>
          <mesh>
            <boxGeometry args={[PW3, PH3, 0.025]} />
            <meshStandardMaterial color="#2a1a08" roughness={0.72} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0, 0.014]}>
            <planeGeometry args={[PW3 - 0.05, PH3 - 0.04]} />
            <meshStandardMaterial
              map={plaqueTex}
              emissiveMap={plaqueTex}
              emissive="#ffffff"
              emissiveIntensity={0.22}
              roughness={0.82}
              toneMapped={false}
            />
          </mesh>
          {[
            [0,  PH3 / 2,  0.016, PW3, 0.014, 0.014],
            [0, -PH3 / 2,  0.016, PW3, 0.014, 0.014],
            [ PW3 / 2, 0,  0.016, 0.014, PH3, 0.014],
            [-PW3 / 2, 0,  0.016, 0.014, PH3, 0.014],
          ].map(([x, y, z, w, h, d], i) => (
            <mesh key={i} position={[x, y, z]}>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color="#c9922a" roughness={0.3} metalness={0.6} />
            </mesh>
          ))}
        </group>

        {/* Pano */}
        <group position={[0, boardCY, 0]}>
          {/* Ahşap arka */}
          <mesh position={[0, 0, -0.014]}>
            <planeGeometry args={[boardW + 0.08, boardH + 0.1]} />
            <meshStandardMaterial color="#1c1108" roughness={0.95} metalness={0.02} />
          </mesh>

          {/* Çerçeve */}
          {[
            [0, boardH/2+0.01, -0.008, boardW+0.08, 0.018, 0.01],
            [0, -(boardH/2+0.01), -0.008, boardW+0.08, 0.018, 0.01],
            [-(boardW/2+0.015), 0, -0.008, 0.018, boardH+0.12, 0.01],
            [boardW/2+0.015, 0, -0.008, 0.018, boardH+0.12, 0.01],
          ].map(([x,y,z,w,h,d], i) => (
            <mesh key={i} position={[x,y,z]}>
              <boxGeometry args={[w,h,d]} />
              <meshStandardMaterial color="#5c3d1a" roughness={0.6} metalness={0.1} />
            </mesh>
          ))}

          {/* Pano üstü çivi noktaları */}
          <Nail position={[-hookX, boardH/2, 0]} />
          <Nail position={[ hookX, boardH/2, 0]} />

          {/* İkon kartları — çerçevesiz */}
          {socials.map(({ tex, x, href }) => (
            <mesh
              key={href}
              position={[x, 0, 0]}
              onClick={(e) => { e.stopPropagation(); window.open(href, '_blank'); }}
              onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
              onPointerOut={()  => { document.body.style.cursor = 'auto'; }}
            >
              <planeGeometry args={[sz, sz]} />
              <meshStandardMaterial
                map={tex} emissiveMap={tex} emissive="#ffffff"
                emissiveIntensity={0.45} roughness={0.2} metalness={0}
                transparent alphaTest={0.05}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
