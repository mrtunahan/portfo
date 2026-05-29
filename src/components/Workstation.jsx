import { useMemo } from 'react';
import * as THREE from 'three';

/* ─── Monitör ekran texture'ı (VS Code Dark+ görünümü) ─── */
function makeScreenTex() {
  const W = 512, H = 288;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Arka plan
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, W, H);

  // Başlık çubuğu
  ctx.fillStyle = '#161b22';
  ctx.fillRect(0, 0, W, 24);

  // Aktif sekme
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 24, 148, 22);
  ctx.fillStyle = '#8b949e';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('portfolio.jsx', 8, 39);

  // Inactive sekme
  ctx.fillStyle = '#161b22';
  ctx.fillRect(148, 24, 110, 22);
  ctx.fillStyle = '#555e6a';
  ctx.fillText('App.jsx', 156, 39);

  // Pencere kontrolleri
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(W - 16 - i * 18, 12, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Satır numaraları alanı
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 46, 30, H - 46);
  ctx.fillStyle = '#21262d';
  ctx.fillRect(30, 46, 1, H - 46);

  // Kod satırları
  const lines = [
    [1,  '#ff7b72', 'const Portfolio = () => {'],
    [2,  '#8b949e', '  // 3D Portfolio Scene'],
    [3,  '#79c0ff', '  const [ready, set] = useState(false)'],
    [4,  '#a5f3fc', '  const sceneRef = useRef()'],
    [5,  '#8b949e', ''],
    [6,  '#a5f3fc', '  useEffect(() => {'],
    [7,  '#ffa657', '    loadAssets({'],
    [8,  '#7ee787', '      textures: true,'],
    [9,  '#7ee787', '      models: true,'],
    [10, '#ffa657', '    }).then(() => set(true))'],
    [11, '#a5f3fc', '  }, [])'],
    [12, '#8b949e', ''],
    [13, '#79c0ff', '  return ready ? ('],
    [14, '#ff7b72', '    <Canvas shadows fov={52}>'],
    [15, '#7ee787', '      <Scene ref={sceneRef} />'],
    [16, '#79c0ff', '      <OrbitControls />'],
    [17, '#ff7b72', '    </Canvas>'],
    [18, '#79c0ff', '  ) : <Loader />'],
    [19, '#ff7b72', '}'],
  ];

  lines.forEach(([lineNum, col, text]) => {
    const y = 46 + (lineNum - 1) * 12;
    ctx.fillStyle = '#3d444d';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(String(lineNum), 26, y + 9);
    if (text) {
      ctx.fillStyle = col;
      ctx.textAlign = 'left';
      ctx.font = '10px monospace';
      ctx.fillText(text, 36, y + 9);
    }
  });

  // Aktif satır vurgusu
  ctx.fillStyle = 'rgba(100, 160, 255, 0.13)';
  ctx.fillRect(30, 46 + 9 * 12, W - 30, 12);

  // Cursor
  ctx.fillStyle = 'rgba(210, 230, 255, 0.8)';
  ctx.fillRect(36 + 26 * 6, 46 + 9 * 12 + 2, 1, 9);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}

/* ─── Döner koltuk ─── */
function SwingChair() {
  return (
    <group>
      {/* 5-yıldız taban */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        const lx = Math.cos(a) * 0.30;
        const lz = Math.sin(a) * 0.30;
        return (
          <group key={i}>
            <mesh position={[lx * 0.5, 0.038, lz * 0.5]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.60, 0.020, 0.040]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.22} />
            </mesh>
            {/* Tekerlek */}
            <mesh position={[lx, 0.038, lz]} rotation={[Math.PI / 2, 0, a + Math.PI / 2]}>
              <cylinderGeometry args={[0.026, 0.026, 0.044, 8]} />
              <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Merkez direk */}
      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.020, 0.026, 0.54, 10]} />
        <meshStandardMaterial color="#222222" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Direk-koltuk adaptör */}
      <mesh position={[0, 0.57, 0]}>
        <cylinderGeometry args={[0.052, 0.028, 0.052, 10]} />
        <meshStandardMaterial color="#181818" metalness={0.72} roughness={0.28} />
      </mesh>

      {/* Oturak tabanı */}
      <mesh position={[0, 0.608, 0]} castShadow>
        <boxGeometry args={[0.46, 0.068, 0.46]} />
        <meshStandardMaterial color="#16162c" roughness={0.72} metalness={0.10} />
      </mesh>

      {/* Oturak minderi */}
      <mesh position={[0, 0.648, 0]}>
        <boxGeometry args={[0.42, 0.040, 0.43]} />
        <meshStandardMaterial color="#11112a" roughness={0.84} metalness={0.04} />
      </mesh>

      {/* Arkalık taşıyıcı */}
      <mesh position={[0, 0.78, 0.20]}>
        <boxGeometry args={[0.046, 0.26, 0.046]} />
        <meshStandardMaterial color="#181818" metalness={0.68} roughness={0.28} />
      </mesh>

      {/* Arkalık */}
      <mesh position={[0, 0.98, 0.22]} castShadow>
        <boxGeometry args={[0.44, 0.46, 0.060]} />
        <meshStandardMaterial color="#16162c" roughness={0.72} metalness={0.10} />
      </mesh>

      {/* Arkalık minderi */}
      <mesh position={[0, 0.98, 0.252]}>
        <boxGeometry args={[0.40, 0.42, 0.024]} />
        <meshStandardMaterial color="#11112a" roughness={0.84} metalness={0.04} />
      </mesh>

      {/* Sol kol dayama */}
      <mesh position={[-0.265, 0.71, 0.06]}>
        <boxGeometry args={[0.036, 0.10, 0.28]} />
        <meshStandardMaterial color="#181818" metalness={0.68} roughness={0.28} />
      </mesh>
      <mesh position={[-0.265, 0.772, 0.06]}>
        <boxGeometry args={[0.056, 0.020, 0.26]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.84} metalness={0.07} />
      </mesh>

      {/* Sağ kol dayama */}
      <mesh position={[0.265, 0.71, 0.06]}>
        <boxGeometry args={[0.036, 0.10, 0.28]} />
        <meshStandardMaterial color="#181818" metalness={0.68} roughness={0.28} />
      </mesh>
      <mesh position={[0.265, 0.772, 0.06]}>
        <boxGeometry args={[0.056, 0.020, 0.26]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.84} metalness={0.07} />
      </mesh>
    </group>
  );
}

/* ─── Bilgisayar kasası ─── */
function ComputerCase({ position }) {
  return (
    <group position={position}>
      {/* Ana gövde */}
      <mesh castShadow>
        <boxGeometry args={[0.185, 0.44, 0.42]} />
        <meshStandardMaterial color="#0c0c12" roughness={0.40} metalness={0.55} />
      </mesh>

      {/* Ön panel yüzey */}
      <mesh position={[0.095, 0, 0]}>
        <boxGeometry args={[0.003, 0.44, 0.42]} />
        <meshStandardMaterial color="#18182a" roughness={0.30} metalness={0.65} />
      </mesh>

      {/* Power butonu */}
      <mesh position={[0.097, 0.14, 0.16]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.007, 12]} />
        <meshStandardMaterial
          color="#2255cc"
          emissive="#2255cc"
          emissiveIntensity={0.75}
          roughness={0.28}
          metalness={0.30}
          toneMapped={false}
        />
      </mesh>

      {/* USB portları */}
      {[0.06, -0.01].map((dz, i) => (
        <mesh key={i} position={[0.096, 0.07, dz]}>
          <boxGeometry args={[0.005, 0.013, 0.020]} />
          <meshStandardMaterial color="#0a0a1a" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* Ön fan ızgarası */}
      {[-0.10, -0.05, 0, 0.05, 0.10].map((dz, i) => (
        <mesh key={i} position={[0.094, -0.07, dz]}>
          <boxGeometry args={[0.004, 0.16, 0.007]} />
          <meshStandardMaterial color="#1c1c2c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Üst fan ızgarası */}
      {[-0.07, -0.03, 0.01, 0.05].map((dx, i) => (
        <mesh key={i} position={[dx, 0.224, -0.05]}>
          <boxGeometry args={[0.007, 0.005, 0.30]} />
          <meshStandardMaterial color="#1c1c2c" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* RGB LED şerit (ön kenar) */}
      <mesh position={[0.092, 0.04, -0.21]}>
        <boxGeometry args={[0.007, 0.30, 0.005]} />
        <meshStandardMaterial
          color="#0044ff"
          emissive="#0044ff"
          emissiveIntensity={0.92}
          roughness={0.20}
          toneMapped={false}
        />
      </mesh>

      {/* Tempered cam panel (sol yan) */}
      <mesh position={[-0.093, 0, 0]}>
        <boxGeometry args={[0.003, 0.42, 0.40]} />
        <meshStandardMaterial
          color="#aaccff"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

/* ─── Monitör ─── */
function Monitor({ position, screenTex }) {
  return (
    <group position={position}>
      {/* Stand tabanı */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.30, 0.016, 0.24]} />
        <meshStandardMaterial color="#0d0d16" roughness={0.38} metalness={0.74} />
      </mesh>

      {/* Stand kolu */}
      <mesh position={[0, 0.21, 0.04]}>
        <boxGeometry args={[0.030, 0.40, 0.034]} />
        <meshStandardMaterial color="#0d0d16" roughness={0.38} metalness={0.66} />
      </mesh>

      {/* Ekran grubu (hafif öne eğik) */}
      <group position={[0, 0.53, 0.01]} rotation={[-0.08, 0, 0]}>
        {/* Çerçeve */}
        <mesh castShadow>
          <boxGeometry args={[0.78, 0.48, 0.034]} />
          <meshStandardMaterial color="#0b0b14" roughness={0.36} metalness={0.67} />
        </mesh>

        {/* Ekran paneli */}
        <mesh position={[0, 0.006, 0.020]}>
          <planeGeometry args={[0.72, 0.42]} />
          <meshStandardMaterial
            map={screenTex}
            emissiveMap={screenTex}
            emissive="#ffffff"
            emissiveIntensity={0.96}
            roughness={0.04}
            metalness={0}
            toneMapped={false}
          />
        </mesh>

        {/* Alt orta logo noktası */}
        <mesh position={[0, -0.215, 0.019]}>
          <circleGeometry args={[0.010, 10]} />
          <meshStandardMaterial color="#2a2a40" roughness={0.28} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Klavye ─── */
function Keyboard({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.013, 0.158]} />
        <meshStandardMaterial color="#0b0b17" roughness={0.52} metalness={0.42} />
      </mesh>
      {[0, 1, 2, 3].map((row) =>
        Array.from({ length: 11 }, (_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.20 + col * 0.038 + row * 0.006, 0.011, -0.052 + row * 0.038]}
          >
            <boxGeometry args={[0.030, 0.007, 0.030]} />
            <meshStandardMaterial color="#191929" roughness={0.65} metalness={0.20} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ─── Fare ─── */
function Mouse({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.060, 0.024, 0.110]} />
        <meshStandardMaterial color="#0b0b17" roughness={0.52} metalness={0.42} />
      </mesh>
      {/* Sol/sağ tuş ayıraç çizgisi */}
      <mesh position={[0, 0.013, -0.018]}>
        <boxGeometry args={[0.002, 0.004, 0.062]} />
        <meshStandardMaterial color="#1e1e2e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Scroll tekerleği */}
      <mesh position={[0, 0.016, -0.014]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.017, 8]} />
        <meshStandardMaterial color="#282838" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Ana bileşen ─── */
// Yerleşim: sağ duvar (x=6), kitaplığın solunda (daha derin z).
// Grup rotasyonu [0, -Math.PI/2, 0] → local +z yönü dünya -x (odaya doğru), local +x yönü dünya +z (duvar boyunca).
export default function Workstation({ position = [0, 0, 0] }) {
  const screenTex = useMemo(() => makeScreenTex(), []);

  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>

      {/* ═══════════════ MASA ═══════════════ */}
      <group>
        {/* Yüzey */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.58, 0.040, 0.84]} />
          <meshStandardMaterial color="#251204" roughness={0.50} metalness={0.08} />
        </mesh>

        {/* Ön kenar trim (odaya bakan taraf) */}
        <mesh position={[0, 0.73, 0.42]}>
          <boxGeometry args={[1.58, 0.040, 0.007]} />
          <meshStandardMaterial color="#1a0c02" roughness={0.48} metalness={0.16} />
        </mesh>

        {/* Arka panel (duvara yaslanır) */}
        <mesh position={[0, 0.38, -0.42]}>
          <boxGeometry args={[1.58, 0.78, 0.024]} />
          <meshStandardMaterial color="#190b03" roughness={0.70} metalness={0.05} />
        </mesh>

        {/* Alt raf */}
        <mesh position={[0, 0.13, -0.10]}>
          <boxGeometry args={[1.50, 0.024, 0.62]} />
          <meshStandardMaterial color="#251204" roughness={0.55} metalness={0.08} />
        </mesh>

        {/* Bacaklar — 4 köşe */}
        {[[-0.73, -0.36], [-0.73, 0.36], [0.73, -0.36], [0.73, 0.36]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.375, z]} castShadow>
            <boxGeometry args={[0.046, 0.76, 0.046]} />
            <meshStandardMaterial color="#190b03" roughness={0.62} metalness={0.18} />
          </mesh>
        ))}

        {/* Altlık bağlantı çubuğu (sol-sağ, arka kısım) */}
        <mesh position={[0, 0.10, -0.32]}>
          <boxGeometry args={[1.40, 0.022, 0.028]} />
          <meshStandardMaterial color="#190b03" roughness={0.62} metalness={0.18} />
        </mesh>
      </group>

      {/* ═══════════════ MONİTÖR ═══════════════ */}
      {/* local [0.08, 0.77, -0.26]: masa üstü, duvara yakın taraf */}
      <Monitor position={[0.08, 0.77, -0.26]} screenTex={screenTex} />

      {/* ═══════════════ KLAVYe ═══════════════ */}
      <Keyboard position={[0, 0.773, 0.14]} />

      {/* ═══════════════ FARE ═══════════════ */}
      <Mouse position={[0.32, 0.773, 0.22]} />

      {/* ═══════════════ KASA ═══════════════ */}
      {/* Alt rafta, duvara yakın köşe */}
      <ComputerCase position={[0.56, 0.38, -0.34]} />

      {/* ═══════════════ DÖNER KOLTUK ═══════════════ */}
      {/* local z=+0.80 → odaya doğru; hafif sola açılı */}
      <group position={[0.06, 0, 0.80]} rotation={[0, 0.15, 0]}>
        <SwingChair />
      </group>

      {/* ═══════════════ DUVAR LAMBASI ═══════════════ */}
      {/* Duvara monteli — monitörün üstü, lokal -z tarafı (sağ duvar) */}
      <group position={[0.08, 0, -0.41]}>
        {/* Montaj plakası */}
        <mesh position={[0, 2.14, 0]}>
          <boxGeometry args={[0.15, 0.06, 0.025]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.75} />
        </mesh>

        {/* Kol */}
        <mesh position={[0, 2.07, 0.14]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.022, 0.022, 0.28]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.75} />
        </mesh>

        {/* Kol-gövde bağlantısı */}
        <mesh position={[0, 1.97, 0.24]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.4} metalness={0.72} />
        </mesh>

        {/* Saplı lamba gövdesi */}
        <mesh position={[0, 1.88, 0.22]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.08, 10]} />
          <meshStandardMaterial color="#141414" roughness={0.35} metalness={0.8} />
        </mesh>

        {/* Ampul (parlak) */}
        <mesh position={[0, 1.82, 0.24]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshStandardMaterial
            color="#fffbe8"
            emissive="#fffbe8"
            emissiveIntensity={1.8}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Şapka (açık konik — dışı koyu, içi açık) */}
        <mesh position={[0, 1.78, 0.24]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.17, 0.14, 20, 1, true]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.4}
            metalness={0.6}
            side={2}
          />
        </mesh>
        {/* Şapka iç yüzey (hafif emissive) */}
        <mesh position={[0, 1.78, 0.24]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.165, 0.13, 20, 1, true]} />
          <meshStandardMaterial
            color="#fff8e1"
            emissive="#fff8e1"
            emissiveIntensity={0.25}
            roughness={0.8}
            side={2}
            toneMapped={false}
          />
        </mesh>

        {/* Şapka alt kenar halkası */}
        <mesh position={[0, 1.71, 0.24]}>
          <torusGeometry args={[0.17, 0.005, 8, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Monitör mavi ekran yansıması */}
      <pointLight
        position={[-0.10, 1.40, 0.04]}
        color="#4a8aff"
        intensity={0.30}
        distance={2.8}
        decay={2}
      />
      {/* Kasa RGB LED parıltısı */}
      <pointLight
        position={[0.54, 0.60, -0.34]}
        color="#0044ff"
        intensity={0.07}
        distance={0.9}
        decay={2}
      />
      {/* Duvar lambası — beyaz, yalnızca masa alanını aydınlatır */}
      <pointLight
        position={[0.08, 1.74, -0.17]}
        color="#ffffff"
        intensity={2.4}
        distance={2.4}
        decay={2.2}
      />
    </group>
  );
}
