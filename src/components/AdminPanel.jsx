import { useState } from 'react';
import { useProjects, useScientificProjects } from '../data/store';
import { DEMO_OPTIONS } from '../data/demos';

const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY    = 'portfo:admin-auth';

const PROJECT_FIELDS = [
  { key: 'name',        label: 'İsim',              type: 'text' },
  { key: 'url',         label: 'URL',               type: 'text' },
  { key: 'displayUrl',  label: 'Görünen URL',       type: 'text' },
  { key: 'cardDesc',    label: 'Kart açıklaması',   type: 'lines' },
  { key: 'screenDesc',  label: 'Ekran açıklaması',  type: 'lines' },
  { key: 'tech',        label: 'Teknolojiler',      type: 'text' },
  { key: 'color',       label: 'Ana renk',          type: 'color' },
  { key: 'bgColor',     label: 'Arka plan',         type: 'color' },
  { key: 'status',      label: 'Durum',             type: 'select', options: ['live', 'dev'] },
  { key: 'demoKey',     label: 'Demo',              type: 'select', options: DEMO_OPTIONS.map(o => o.value), labels: Object.fromEntries(DEMO_OPTIONS.map(o => [o.value, o.label])) },
];

const SCI_FIELDS = [
  { key: 'name',         label: 'İsim',              type: 'text' },
  { key: 'shortName',    label: 'Kısa isim',         type: 'text' },
  { key: 'program',      label: 'Program',           type: 'text' },
  { key: 'no',           label: 'Proje no',          type: 'text' },
  { key: 'lines',        label: 'Kart satırları',    type: 'lines' },
  { key: 'screenDesc',   label: 'Ekran açıklaması',  type: 'lines' },
  { key: 'tech',         label: 'Teknolojiler',      type: 'text' },
  { key: 'subTitle',     label: 'Alt başlık',        type: 'text' },
  { key: 'displayLabel', label: 'Görünen etiket',    type: 'text' },
  { key: 'role',         label: 'Görev',             type: 'text' },
  { key: 'year',         label: 'Yıl',               type: 'text' },
  { key: 'status',       label: 'Durum',             type: 'select', options: ['active', 'done'] },
  { key: 'color',        label: 'Ana renk',          type: 'color' },
  { key: 'bgColor',      label: 'Arka plan',         type: 'color' },
  { key: 'demoKey',      label: 'Demo',              type: 'select', options: DEMO_OPTIONS.map(o => o.value), labels: Object.fromEntries(DEMO_OPTIONS.map(o => [o.value, o.label])) },
];

function nextId(items) {
  return items.reduce((m, p) => Math.max(m, p.id ?? -1), -1) + 1;
}

function blankFromFields(fields, items) {
  const obj = { id: nextId(items) };
  fields.forEach((f) => {
    if (f.type === 'lines') obj[f.key] = [];
    else if (f.type === 'select') obj[f.key] = f.options[0];
    else if (f.type === 'color') obj[f.key] = '#888888';
    else obj[f.key] = '';
  });
  return obj;
}

function Field({ field, value, onChange }) {
  const baseStyle = {
    width: '100%',
    padding: '6px 8px',
    background: '#0d0904',
    color: '#f5e6c4',
    border: '1px solid #5b4221',
    borderRadius: 4,
    fontSize: 13,
  };

  if (field.type === 'lines') {
    return (
      <textarea
        style={{ ...baseStyle, minHeight: 60, fontFamily: 'inherit' }}
        value={(value || []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        placeholder="Her satır ayrı bir bölüm"
      />
    );
  }
  if (field.type === 'select') {
    return (
      <select
        style={baseStyle}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        {field.options.map((o) => (
          <option key={o ?? '__null'} value={o ?? ''}>{field.labels?.[o] ?? o}</option>
        ))}
      </select>
    );
  }
  if (field.type === 'color') {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} style={{ width: 40, height: 32, border: 0, background: 'transparent' }} />
        <input type="text" style={baseStyle} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  return <input type="text" style={baseStyle} value={value || ''} onChange={(e) => onChange(e.target.value)} />;
}

function ItemEditor({ item, fields, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState(item);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div style={{ background: '#15100a', border: '1px solid #5b4221', borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {fields.map((f) => (
          <label key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: f.type === 'lines' ? 'span 2' : 'span 1' }}>
            <span style={{ fontSize: 11, color: '#caa46a', textTransform: 'uppercase', letterSpacing: 1 }}>{f.label}</span>
            <Field field={f} value={draft[f.key]} onChange={(v) => set(f.key, v)} />
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
        {onDelete && (
          <button onClick={onDelete} style={{ background: '#5a1f1f', color: '#ffd0d0', border: '1px solid #884545', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>
            Sil
          </button>
        )}
        <button onClick={onCancel} style={{ background: '#2a2018', color: '#f5e6c4', border: '1px solid #5b4221', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>
          İptal
        </button>
        <button onClick={() => onSave(draft)} style={{ background: '#4a6c2a', color: '#fff', border: '1px solid #6fa040', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

function ItemRow({ label, color, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#1a130a', border: '1px solid #3a2b18', borderRadius: 6, marginBottom: 6 }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, background: color || '#444' }} />
      <div style={{ flex: 1, color: '#f5e6c4' }}>{label}</div>
      <button onClick={onEdit} style={{ background: '#2c3e5a', color: '#cfe2ff', border: '1px solid #4d6ea0', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Düzenle</button>
      <button onClick={onDelete} style={{ background: '#5a1f1f', color: '#ffd0d0', border: '1px solid #884545', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Sil</button>
    </div>
  );
}

function Section({ title, items, save, reset, fields, labelOf }) {
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating]   = useState(false);

  const saveItem = (next) => {
    if (creating) {
      save([...items, next]);
      setCreating(false);
    } else {
      save(items.map((p) => (p.id === next.id ? next : p)));
      setEditingId(null);
    }
  };
  const deleteItem = (id) => {
    if (!confirm('Bu kartı silmek istiyor musun?')) return;
    save(items.filter((p) => p.id !== id));
    setEditingId(null);
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h2 style={{ color: '#f5c67a', fontSize: 18, margin: 0, flex: 1 }}>{title}</h2>
        <button onClick={() => { setCreating(true); setEditingId(null); }}
          style={{ background: '#4a6c2a', color: '#fff', border: '1px solid #6fa040', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>
          + Yeni Ekle
        </button>
        <button onClick={() => { if (confirm('Tüm değişiklikleri silip varsayılana dönülsün mü?')) reset(); }}
          style={{ background: '#3a2a18', color: '#caa46a', border: '1px solid #5b4221', padding: '6px 14px', borderRadius: 4, cursor: 'pointer' }}>
          Varsayılana Dön
        </button>
      </div>

      {creating && (
        <ItemEditor
          item={blankFromFields(fields, items)}
          fields={fields}
          onSave={saveItem}
          onCancel={() => setCreating(false)}
        />
      )}

      {items.map((item) =>
        editingId === item.id ? (
          <ItemEditor
            key={item.id}
            item={item}
            fields={fields}
            onSave={saveItem}
            onCancel={() => setEditingId(null)}
            onDelete={() => deleteItem(item.id)}
          />
        ) : (
          <ItemRow
            key={item.id}
            label={labelOf(item)}
            color={item.color}
            onEdit={() => { setEditingId(item.id); setCreating(false); }}
            onDelete={() => deleteItem(item.id)}
          />
        )
      )}

      {items.length === 0 && !creating && (
        <div style={{ color: '#7a6645', padding: 14, fontStyle: 'italic' }}>Henüz kart yok.</div>
      )}
    </section>
  );
}

function Login({ onAuth }) {
  const [pw, setPw]       = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
      onAuth();
    } else {
      setError('Şifre yanlış');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0604' }}>
      <form onSubmit={submit} style={{ background: '#15100a', border: '1px solid #5b4221', borderRadius: 8, padding: 32, minWidth: 320 }}>
        <h1 style={{ color: '#f5c67a', margin: 0, marginBottom: 18, fontSize: 22 }}>Admin Girişi</h1>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(''); }}
          placeholder="Şifre"
          style={{ width: '100%', padding: '10px 12px', background: '#0d0904', color: '#f5e6c4', border: '1px solid #5b4221', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: '#ff9090', fontSize: 12, marginTop: 8 }}>{error}</div>}
        <button type="submit" style={{ marginTop: 14, width: '100%', background: '#4a6c2a', color: '#fff', border: '1px solid #6fa040', padding: '10px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
          Giriş
        </button>
        <div style={{ color: '#7a6645', fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>
          Bu panel yerel (localStorage) tabanlıdır — değişiklikler yalnızca bu tarayıcıda görünür.
          Şifre <code>src/components/AdminPanel.jsx</code> içinde değiştirilebilir.
        </div>
      </form>
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
  });
  const [projects, saveProjects, resetProjects]    = useProjects();
  const [sciProjs, saveSciProjs, resetSciProjs]    = useScientificProjects();

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0604', padding: '24px 32px', color: '#f5e6c4', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, paddingBottom: 14, borderBottom: '1px solid #3a2b18' }}>
        <h1 style={{ color: '#f5c67a', margin: 0, fontSize: 26, flex: 1 }}>Portfolyo Yönetim Paneli</h1>
        <a href="#" onClick={() => { window.location.hash = ''; window.location.reload(); }}
          style={{ background: '#2c3e5a', color: '#cfe2ff', border: '1px solid #4d6ea0', padding: '8px 16px', borderRadius: 4, textDecoration: 'none', fontSize: 13 }}>
          ← Portfolyoya Dön
        </a>
        <button onClick={() => { try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } setAuthed(false); }}
          style={{ background: '#3a2a18', color: '#caa46a', border: '1px solid #5b4221', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>
          Çıkış
        </button>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Section
          title="Projeler"
          items={projects}
          save={saveProjects}
          reset={resetProjects}
          fields={PROJECT_FIELDS}
          labelOf={(p) => p.name || '(isimsiz)'}
        />
        <Section
          title="Bilimsel Projeler"
          items={sciProjs}
          save={saveSciProjs}
          reset={resetSciProjs}
          fields={SCI_FIELDS}
          labelOf={(p) => p.shortName || '(isimsiz)'}
        />

        <div style={{ color: '#7a6645', fontSize: 12, marginTop: 24, lineHeight: 1.6 }}>
          Değişiklikler tarayıcının localStorage'ına kaydedilir. Portfolyo sayfasını yeniden yüklediğinde yeni içerikler görünür.
        </div>
      </div>
    </div>
  );
}
