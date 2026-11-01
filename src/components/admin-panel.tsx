import { useState } from 'react';
import { ArrowLeft, LogOut, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useProjects, useTimeline } from '@/data/store';
import { DEMO_OPTIONS } from '@/data/demos';
import type { Project, TimelineEntry } from '@/data/portfolioData';

/* UYARI: bu şifre derlenmiş pakette açıkça görünür. Panelin koruduğu tek şey
   tarayıcının yerel belleği olduğu için kabul edilebilir, ama gerçek bir
   yetkilendirme katmanı değil — kazara düzenlemeyi engeller, o kadar. */
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'portfo:admin-auth';

type FieldType = 'text' | 'lines' | 'select' | 'tags';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  labels?: Record<string, string>;
}

const PROJECT_FIELDS: FieldDef[] = [
  { key: 'name', label: 'İsim', type: 'text' },
  { key: 'shortName', label: 'Kısa isim', type: 'text' },
  { key: 'summary', label: 'Özet', type: 'lines' },
  { key: 'tech', label: 'Teknolojiler (virgülle)', type: 'tags' },
  { key: 'track', label: 'Tür', type: 'select', options: ['software', 'research'] },
  { key: 'status', label: 'Durum', type: 'select', options: ['live', 'dev', 'active', 'done'] },
  { key: 'url', label: 'URL', type: 'text' },
  { key: 'displayUrl', label: 'Görünen URL', type: 'text' },
  {
    key: 'demoKey',
    label: 'Demo',
    type: 'select',
    options: DEMO_OPTIONS.map((o) => o.value),
    labels: Object.fromEntries(DEMO_OPTIONS.map((o) => [o.value, o.label])),
  },
];

const TIMELINE_FIELDS: FieldDef[] = [
  { key: 'period', label: 'Dönem', type: 'text' },
  { key: 'title', label: 'Başlık', type: 'text' },
  { key: 'organization', label: 'Kurum', type: 'text' },
  { key: 'description', label: 'Açıklama', type: 'lines' },
  { key: 'kind', label: 'Tür', type: 'select', options: ['work', 'research', 'education'] },
];

const INPUT =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

type Record_ = Record<string, unknown>;

function nextId(items: { id: number }[]): number {
  return items.reduce((m, p) => Math.max(m, p.id ?? -1), -1) + 1;
}

function blank(fields: FieldDef[], items: { id: number }[]): Record_ {
  const obj: Record_ = { id: nextId(items) };
  fields.forEach((f) => {
    if (f.type === 'tags') obj[f.key] = [];
    else if (f.type === 'select') obj[f.key] = f.options?.[0] ?? '';
    else obj[f.key] = '';
  });
  return obj;
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === 'tags') {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <input
        type="text"
        className={INPUT}
        value={list.join(', ')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
    );
  }

  if (field.type === 'lines') {
    return (
      <textarea
        className={cn(INPUT, 'min-h-[88px] resize-y')}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        className={INPUT}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        {field.options?.map((o) => (
          <option key={o || '__null'} value={o}>
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
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Editor({
  item,
  fields,
  onSave,
  onCancel,
  onDelete,
}: {
  item: Record_;
  fields: FieldDef[];
  onSave: (v: Record_) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<Record_>(item);

  return (
    <div className="rounded-lg border border-accent/40 bg-card p-5">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.key}
            className={cn('flex flex-col gap-1.5', f.type === 'lines' && 'md:col-span-2')}
          >
            <span className="text-xs text-muted-foreground">{f.label}</span>
            <Field
              field={f}
              value={draft[f.key]}
              onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
            />
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 aria-hidden="true" />
            Sil
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button size="sm" onClick={() => onSave(draft)}>
          Kaydet
        </Button>
      </div>
    </div>
  );
}

function Section<T extends { id: number }>({
  title,
  items,
  save,
  reset,
  fields,
  labelOf,
  subOf,
}: {
  title: string;
  items: T[];
  save: (next: T[]) => void;
  reset: () => void;
  fields: FieldDef[];
  labelOf: (i: T) => string;
  subOf: (i: T) => string;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const saveItem = (next: Record_) => {
    if (creating) {
      save([...items, next as unknown as T]);
      setCreating(false);
    } else {
      save(items.map((p) => (p.id === next.id ? (next as unknown as T) : p)));
      setEditingId(null);
    }
  };

  const remove = (id: number) => {
    if (!confirm('Bu kaydı silmek istiyor musun?')) return;
    save(items.filter((p) => p.id !== id));
    setEditingId(null);
  };

  return (
    <section className="mb-14">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="text-lg font-medium tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
          >
            <Plus aria-hidden="true" />
            Yeni ekle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Tüm değişiklikler silinip varsayılana dönülsün mü?')) reset();
            }}
          >
            <RotateCcw aria-hidden="true" />
            Varsayılana dön
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {creating && (
          <Editor
            item={blank(fields, items)}
            fields={fields}
            onSave={saveItem}
            onCancel={() => setCreating(false)}
          />
        )}

        {items.map((item) =>
          editingId === item.id ? (
            <Editor
              key={item.id}
              item={item as unknown as Record_}
              fields={fields}
              onSave={saveItem}
              onCancel={() => setEditingId(null)}
              onDelete={() => remove(item.id)}
            />
          ) : (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{labelOf(item)}</p>
                <p className="truncate text-xs text-muted-foreground">{subOf(item)}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingId(item.id);
                  setCreating(false);
                }}
              >
                Düzenle
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)} aria-label="Sil">
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ),
        )}

        {items.length === 0 && !creating && (
          <p className="py-6 text-sm text-muted-foreground">
            Henüz kayıt yok. Yeni ekle ile başla.
          </p>
        )}
      </div>
    </section>
  );
}

function Login({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
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
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Yönetim</h1>

        <label className="mt-6 flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Şifre</span>
          <input
            id="admin-password"
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

        {error && <p className="mt-2 text-sm text-accent">{error}</p>}

        <Button type="submit" className="mt-5 w-full">
          Gir
        </Button>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Bu panel yalnızca bu tarayıcının yerel belleğini düzenler; değişiklikler
          başka cihazlarda görünmez. Şifre istemci kodunda tutulduğu için gerçek bir
          güvenlik katmanı değil.
        </p>
      </form>
    </div>
  );
}

export function AdminPanel() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [projects, saveProjects, resetProjects] = useProjects();
  const [timeline, saveTimeline, resetTimeline] = useTimeline();

  if (!authed) return <Login onAuth={() => setAuthed(true)} />;

  return (
    <div className="container min-h-screen py-10">
      <header className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <h1 className="text-lg font-semibold tracking-tight">Portfolyo yönetimi</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <a
              href="#"
              onClick={() => {
                window.location.hash = '';
                window.location.reload();
              }}
            >
              <ArrowLeft aria-hidden="true" />
              Siteye dön
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              try {
                sessionStorage.removeItem(SESSION_KEY);
              } catch {
                /* yoksay */
              }
              setAuthed(false);
            }}
          >
            <LogOut aria-hidden="true" />
            Çıkış
          </Button>
        </div>
      </header>

      <Section<Project>
        title="Projeler"
        items={projects}
        save={saveProjects}
        reset={resetProjects}
        fields={PROJECT_FIELDS}
        labelOf={(p) => p.shortName || p.name || '(isimsiz)'}
        subOf={(p) => `${p.track} · ${p.status}`}
      />

      <Section<TimelineEntry>
        title="Zaman tüneli"
        items={timeline}
        save={saveTimeline}
        reset={resetTimeline}
        fields={TIMELINE_FIELDS}
        labelOf={(t) => t.title || '(isimsiz)'}
        subOf={(t) => `${t.period} · ${t.organization}`}
      />
    </div>
  );
}
