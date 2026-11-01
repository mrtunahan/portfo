# Proje: A. Tunahan Korkmaz — Kişisel Portföy

Yarı akademisyen, yarı geliştirici bir profilin kişisel portföy sitesi.
Çankırı Karatekin Üniversitesi çevresinde yürütülen full-stack projeler ve
TÜBİTAK destekli yapay zekâ araştırmaları sergileniyor.

## Teknoloji Yığını

- **Derleme:** Vite 8 + React 19 + TypeScript
- **Stil:** Tailwind CSS v3, shadcn/ui deseni (Radix primitifleri + CVA)
- **Animasyon:** Framer Motion
- **İkonlar:** Lucide React
- **Font:** Inter Variable, `@fontsource-variable/inter` ile projeye gömülü

### Neden Next.js değil

Site `/var/www/dolcefarniente` altından statik dosya olarak sunuluyor.
Next.js App Router ayrı bir Node süreci ya da ek dışa aktarma adımı
gerektirirdi. Vite'ın `dist/` çıktısı mevcut dağıtım akışına doğrudan oturuyor.

### Harici istek yok

Fontlar npm üzerinden gömülü; Google Fonts'a ya da başka bir CDN'e çalışma
anında istek atılmıyor. Yeni bir bağımlılık eklerken bunu koru.

## Tasarım Prensipleri

- **Palet:** Zinc nötrleri, tek vurgu rengi. Açık ve koyu tema desteklenir.
- **Tema:** CSS değişkenleri `src/index.css` içindeki `:root` ve `.dark`
  bloklarında. Bileşenlerde doğrudan hex yazma, token kullan.
- **Dil:** Minimalist, temiz ızgara, zarif kenarlıklar. Abartılı gradyan yok.
- **Mikro etkileşim:** Hover'da hafif yükselme, yumuşak geçişler.
- **Hareket:** `prefers-reduced-motion` her animasyonda karşılanır.

## Dizin Yapısı

```
src/
  data/portfolioData.ts   Tüm içerik, tipli. Metin burada değişir.
  data/store.ts           localStorage üzerinden düzenleme katmanı
  lib/utils.ts            cn() yardımcısı
  components/ui/          shadcn deseni temel bileşenler
  components/             Bölümler ve kabuk
  animations/             Proje demoları (.jsx, three.js içermez)
```

## İçerik Kuralı

**Sahte veri kullanma.** Projeler, TÜBİTAK proje numaraları ve zaman tüneli
kayıtları gerçek. Bir alanın gerçek değeri elde yoksa `TODO` ile işaretle ve
kullanıcıya sor; uydurma.

Şu an `TODO` olanlar: e-posta adresi, LinkedIn kullanıcı adı, `public/cv.pdf`.

## Komutlar

```bash
npm run dev        # geliştirme sunucusu
npm run build      # tsc + vite build -> dist/
npm run lint       # eslint
```

## Dağıtım

```bash
cd /var/www/dolcefarniente && git pull && npm ci && npm run build
```

Tek sayfalık uygulama olduğu için web sunucusu bulunamayan yolları
`index.html`'e yönlendirmeli (nginx: `try_files $uri $uri/ /index.html;`).

## Yönetim Paneli

`#admin` adresinden erişilir, içerik düzenlemesini tarayıcının
localStorage'ında tutar. Şifre istemci kodunda olduğu için gerçek bir
yetkilendirme katmanı değil; sadece kazara düzenlemeyi engeller.
