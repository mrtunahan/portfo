import { useEffect } from 'react';
import { DEMO_REGISTRY } from '../data/demos';

export default function DemoModal({ onClose, demoKey }) {
  const entry = demoKey ? DEMO_REGISTRY[demoKey] : null;
  const Demo  = entry?.component;

  useEffect(() => {
    if (!entry?.timerKey) return;
    try { localStorage.removeItem(entry.timerKey); } catch { /* ignore */ }
  }, [entry]);

  if (!Demo) {
    return (
      <div style={{
        position:'fixed', inset:0, zIndex:9000,
        background:'rgba(0,0,0,0.88)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'#caa46a', fontSize:18,
      }}>
        Bu proje için demo tanımlı değil.
        <button onClick={onClose} style={{ marginLeft: 16, padding: '6px 14px', borderRadius: 6, background: '#3a2a18', color: '#f5c67a', border: '1px solid #5b4221', cursor: 'pointer' }}>
          Kapat
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9000,
      background:'rgba(0,0,0,0.88)',
      backdropFilter:'blur(6px)',
    }}>
      <Demo />

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
