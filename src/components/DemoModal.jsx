import { useEffect } from 'react';
import OfflineAsistanDemo from '../animations/OfflineAsistanDemo';
import KaratekinTravelDemo from '../animations/KaratekinTravelDemo';

const DEMO_KEYS = {
  0: 'offline-asistan-demo:t',
  2: 'karatekin-travel-demo:t',
};

export default function DemoModal({ onClose, projectId = 0 }) {
  useEffect(() => {
    try {
      const key = DEMO_KEYS[projectId];
      if (key) localStorage.removeItem(key);
    } catch {}
  }, [projectId]);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9000,
      background:'rgba(0,0,0,0.88)',
      backdropFilter:'blur(6px)',
    }}>
      {projectId === 2 ? <KaratekinTravelDemo /> : <OfflineAsistanDemo />}

      {/* Kapat butonu */}
      <button
        onClick={onClose}
        title="Kapat"
        style={{
          position:'absolute', top:14, right:18, zIndex:9100,
          width:36, height:36, borderRadius:'50%',
          background:'rgba(220,50,50,0.88)',
          color:'#fff', border:'1px solid rgba(255,120,120,0.4)',
          cursor:'pointer', fontSize:18, fontWeight:'bold',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 14px rgba(255,50,50,0.45)',
          lineHeight:1,
        }}
      >
        ✕
      </button>
    </div>
  );
}
