import { useMemo, useState } from 'react';
import * as THREE from 'three';

const SHELF_Y       = 2.05;
const WALL_Z        = -4.9;
const PER_PAGE      = 3;
const CARD_GAP      = 1.45;
const BOARD_LEN     = 4.1;
const BOARD_DROP    = 0.63;
const BRACKET_DROP  = 0.56;

function makeArrowTex(direction) {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d');

  ctx.fillStyle = 'rgba(20,14,8,0.92)';
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245,158,11,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f5c67a';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(direction === 'left' ? '◀' : '▶', S / 2, S / 2 + 4);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ArrowButton({ position, direction, disabled, onClick }) {
  const tex = useMemo(() => makeArrowTex(direction), [direction]);
  const [hovered, setHovered] = useState(false);
  const scale = disabled ? 0.85 : (hovered ? 1.12 : 1);

  return (
    <group position={position}>
      <mesh
        scale={[scale, scale, 1]}
        onPointerOver={(e) => { if (disabled) return; e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { if (disabled) return; e.stopPropagation(); onClick(); }}
      >
        <planeGeometry args={[0.34, 0.34]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={disabled ? 0.05 : (hovered ? 0.45 : 0.22)}
          transparent
          opacity={disabled ? 0.35 : 1}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PageDots({ position, total, current, onSelect }) {
  if (total <= 1) return null;
  const spacing = 0.09;
  const start = -((total - 1) * spacing) / 2;
  return (
    <group position={position}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        return (
          <mesh
            key={i}
            position={[start + i * spacing, 0, 0]}
            onClick={(e) => { e.stopPropagation(); onSelect(i); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={()  => { document.body.style.cursor = 'default'; }}
          >
            <circleGeometry args={[active ? 0.022 : 0.014, 16]} />
            <meshStandardMaterial
              color={active ? '#f5c67a' : '#7a5a2e'}
              emissive={active ? '#f5c67a' : '#000000'}
              emissiveIntensity={active ? 0.6 : 0}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* Shared shelf: identical board / bracket geometry on both sides.
   Renders up to 3 cards per page, with arrow buttons + page dots when items > 3. */
export default function ShelfDeck({ cx, items, renderCard }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const safePage  = Math.min(page, pageCount - 1);
  const start     = safePage * PER_PAGE;
  const visible   = items.slice(start, start + PER_PAGE);

  const xs = [cx - CARD_GAP, cx, cx + CARD_GAP];

  return (
    <group>
      {/* Ahşap raf tahtası */}
      <mesh position={[cx, SHELF_Y - BOARD_DROP, WALL_Z + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[BOARD_LEN, 0.06, 0.22]} />
        <meshStandardMaterial color="#2d1b0e" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Duvar montaj şeridi */}
      <mesh position={[cx, SHELF_Y - BRACKET_DROP, WALL_Z + 0.015]}>
        <boxGeometry args={[BOARD_LEN + 0.04, 0.07, 0.04]} />
        <meshStandardMaterial color="#1a1008" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Metal braketler — sabit 3 slot */}
      {xs.map((x, i) => (
        <group key={i}>
          <mesh position={[x, SHELF_Y - BOARD_DROP, WALL_Z + 0.12]}>
            <boxGeometry args={[0.04, 0.03, 0.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[x, SHELF_Y - 0.78, WALL_Z + 0.02]}>
            <boxGeometry args={[0.03, 0.28, 0.03]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Görünen kartlar */}
      {visible.map((item, i) =>
        renderCard({
          item,
          position: [xs[i], SHELF_Y, WALL_Z + 0.02],
          key: item.id ?? `${start + i}`,
        })
      )}

      {/* Ok butonları — 3'ten fazla kart varsa */}
      {items.length > PER_PAGE && (
        <>
          <ArrowButton
            position={[cx - BOARD_LEN / 2 - 0.18, SHELF_Y, WALL_Z + 0.06]}
            direction="left"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
          <ArrowButton
            position={[cx + BOARD_LEN / 2 + 0.18, SHELF_Y, WALL_Z + 0.06]}
            direction="right"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          />
          <PageDots
            position={[cx, SHELF_Y - BOARD_DROP - 0.16, WALL_Z + 0.12]}
            total={pageCount}
            current={safePage}
            onSelect={setPage}
          />
        </>
      )}
    </group>
  );
}
