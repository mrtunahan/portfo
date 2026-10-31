import { useState } from 'react';
import { useProjects, useScientificProjects } from '../data/store';
import { DEMO_OPTIONS } from '../data/demos';

/* UYARI: bu şifre istemci tarafında, derlenmiş pakette açıkça görünür.
   Panelin koruduğu tek şey tarayıcıdaki localStorage içeriği olduğu için
   kabul edilebilir; gerçek bir yetkilendirme değil. */
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'portfo:admin-auth';

const DEMO_FIELD = {
  key: 'demoKey',
  label: 'Demo',
  type: 'select',
  options: DEMO_OPTIONS.map((o) => o.value),
  labels: Object.fromEntries(DEMO_OPTIONS.map((o) => [o.value, o.label])),
};

/* Renk alanları kaldırıldı: yeni tasarım tek vurgu rengi kullanıyor,
   proje başına renk artık hiçbir yerde okunmuyor. */
const PROJECT_FIELDS = [
  { key: 'name', label: 'İsim', type: 'text' },
  { key: 'url', label: 'URL', type: 'text' },
  { key: 'displayUrl', label: 'Görünen URL', type: 'text' },
  { key: 'cardDesc', label: 'Kart açıklaması', type: 'lines' },
  { key: 'screenDesc', label: 'Açıklama', type: 'lines' },
  { key: 'tech', label: 'Teknolojiler', type: 'text' },
  { key: 'status', label: 'Durum', type: 'select', options: ['live', 'dev'] },
  DEMO_FIELD,
];

const SCI_FIELDS = [
  { key: 'name', label: 'İsim', type: 'text' },
  { key: 'shortName', label: 'Kısa isim', type: 'text' },
  { key: 'program', label: 'Program', type: 'text' },
  { key: 'no', label: 'Proje no', type: 'text' },
  { key: 'lines', label: 'Kart satırları', type: 'lines' },
  { key: 'screenDesc', label: 'Açıklama', type: 'lines' },
  { key: 'tech', label: 'Teknolojiler', type: 'text' },
  { key: 'subTitle', label: 'Alt başlık', type: 'text' },
  { key: 'role', label: 'Görev', type: 'text' },
  { key: 'year', label: 'Yıl', type: 'text' },
  { key: 'status', label: 'Durum', type: 'select', options: ['active', 'done'] },
];

function nextId(items) {
  return items.reduce((m, p) => Math.max(m, p.id ?? -1), -1) + 1;
}

function blankFromFields(fields, items) {
  const obj = { id: nextId(items) };
  fields.forEach((f) => {
    if (f.type === 'lines') obj[f.key] = [];
    else if (f.type === 'select') obj[f.key] = f.options[0];
    else obj[f.key] = '';
  });
  return obj;
}

const INPUT =
  'w-full border border-rule bg-paper px-3 py-2 text-[0.9rem] text-ink ' +
  'focus:border-accent focus:outline-none';

function Field({ field, value, onChange }) {
  if (field.type === 'lines') {
    return (
      <textarea
        className={`${INPUT} min-h-[72px] font-sans`}
        value={(value || []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        placeholder="Her satır ayrı bir bölüm"
      />
    );
  }
  if (field.type === 'select') {
    return (
      <select
        className={INPUT}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        {field.options.map((o) => (
          <option key={o ?? '__null'} value={o ?? ''}>
            {field.labels?.[o] ?? o}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type="text"
      className={INPUT}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function ItemEditor({ item, fields, onSave, onCancel, onDelete }) {
  const [draft, setDraft] = useState(item);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="border border-ink p-5 mb-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.key}
            className={`flex flex-col gap-1.5 ${f.type === 'lines' ? 'md:col-span-2' : ''}`}
          >
            <span className="t-meta">{f.label}</span>
            <Field field={f} value={draft[f.key]} onChange={(v) => set(f.key, v)} />
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3">
        {onDelete && (
          <button type="button" className="btn btn--ghost" onClick={onDelete}>
            Sil
          </button>
        )}
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Vazgeç
        </button>
        <button type="button" className="btn" onClick={() => onSave(draft)}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

function ItemRow({ label, status, onEdit, onDelete }) {
  return (
    <div className="rule-b flex items-center gap-5 py-4">
      <span className="t-row flex-1" style={{ fontSize: '1.15rem' }}>
        {label}
      </span>
      <span className="t-meta hidden sm:block">{status}</span>
      <button type="button" className="t-meta link" onClick={onEdit}>
        Düzenle
      </button>
      <button type="button" className="t-meta link" onClick={onDelete}>
        Sil
      </button>
    </div>
  );
}

function Section({ title, items, save, reset, fields, labelOf }) {
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);

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
    if (!confirm('Bu kaydı silmek istiyor musun?')) return;
    save(items.filter((p) => p.id !== id));
    setEditingId(null);
  };

  return (
    <section className="mb-20">
      <div className="rule-b flex flex-wrap items-baseline gap-5 pb-4">
        <h2 className="t-section flex-1" style={{ fontSize: 'clamp(1.5rem,3vw,2.25rem)' }}>
          {title}
        </h2>
        <button
          type="button"
          className="t-meta link"
          onClick={() => {
            setCreating(true);
            setEditingId(null);
          }}
        >
          Yeni ekle
        </button>
        <button
          type="button"
          className="t-meta link"
          onClick={() => {
            if (confirm('Tüm değişiklikleri silip varsayılana dönülsün mü?')) reset();
          }}
        >
          Varsayılana dön
        </button>
      </div>

      <div className="mt-4">
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
              status={item.status}
              onEdit={() => {
                setEditingId(item.id);
                setCreating(false);
              }}
              onDelete={() => deleteItem(item.id)}
            />
          ),
        )}

        {items.length === 0 && !creating && (
          <p className="t-body py-6">Henüz kayıt yok. Yeni ekle ile başla.</p>
        )}
      </div>
    </section>
  );
}

function Login({ onAuth }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* yoksay */
      }
      onAuth();
    } else {
      setError('Şifre eşleşmedi. Tekrar dene.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="t-section mb-8" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
          Yönetim
        </h1>

        <label className="flex flex-col gap-2">
          <span className="t-meta">Şifre</span>
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError('');
            }}
            className={INPUT}
          />
        </label>

        {error && (
          <p className="t-meta mt-2" style={{ color: 'var(--accent)' }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn mt-5 w-full">
          Gir
        </button>

        <p className="t-body mt-8" style={{ fontSize: '0.85rem' }}>
          Bu panel yalnızca bu tarayıcının yerel belleğini düzenler; değişiklikler
          başka cihazlarda görünmez. Şifre istemci kodunda tutulduğu için gerçek bir
          güvenlik katmanı değil.
        </p>
      </form>
    </div>
  );
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [projects, saveProjects, resetProjects] = useProjects();
  const [sciProjs, saveSciProjs, resetSciProjs] = useScientificProjects();

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div className="shell min-h-screen py-10">
      <header className="rule-b mb-16 flex flex-wrap items-baseline gap-6 pb-5">
        <h1 className="flex-1" style={{ fontVariationSettings: "'wdth' 108, 'wght' 700", fontSize: '1.35rem' }}>
          Portfolyo yönetimi
        </h1>
        <a
          className="t-meta link"
          href="#"
          onClick={() => {
            window.location.hash = '';
            window.location.reload();
          }}
        >
          Siteye dön
        </a>
        <button
          type="button"
          className="t-meta link"
          onClick={() => {
            try {
              sessionStorage.removeItem(SESSION_KEY);
            } catch {
              /* yoksay */
            }
            setAuthed(false);
          }}
        >
          Çıkış
        </button>
      </header>

      <Section
        title="Yazılım projeleri"
        items={projects}
        save={saveProjects}
        reset={resetProjects}
        fields={PROJECT_FIELDS}
        labelOf={(p) => p.name || '(isimsiz)'}
      />

      <Section
        title="Araştırma projeleri"
        items={sciProjs}
        save={saveSciProjs}
        reset={resetSciProjs}
        fields={SCI_FIELDS}
        labelOf={(p) => p.shortName || p.name || '(isimsiz)'}
      />
    </div>
  );
}
