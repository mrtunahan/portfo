/* ───────────────────────────────────────────────────────────
   Sitenin tüm içeriği. Metin değişiklikleri burada yapılır,
   bileşenlerde değil.

   TODO işaretli alanlar gerçek değerleriyle doldurulmalı.
   ─────────────────────────────────────────────────────────── */

export type ProjectStatus = 'live' | 'dev' | 'active' | 'done';
export type ProjectTrack = 'software' | 'research';

export interface Project {
  id: number;
  track: ProjectTrack;
  name: string;
  /** Kart üzerinde görünen kısa isim; uzun başlıklar için. */
  shortName?: string;
  summary: string;
  tech: string[];
  status: ProjectStatus;
  /** Canlı site adresi; yoksa null. */
  url: string | null;
  /** Bağlantı metni olarak gösterilen kısaltılmış adres. */
  displayUrl: string | null;
  repoUrl?: string | null;
  /** DEMO_REGISTRY anahtarı; demo yoksa null. */
  demoKey: string | null;
  /** Araştırma projeleri için destek programı bilgisi. */
  grant?: {
    program: string;
    number: string;
    role: string;
    period: string;
  };
}

export interface TimelineEntry {
  id: number;
  period: string;
  title: string;
  organization: string;
  description: string;
  kind: 'work' | 'research' | 'education';
}

export interface SocialLink {
  label: string;
  value: string;
  href: string;
  /** Lucide ikon adı; bileşende eşlenir. */
  icon: 'github' | 'mail' | 'linkedin';
}

export interface Profile {
  name: string;
  title: string;
  availability: string;
  location: string;
  summary: string;
  bio: string[];
  /** public/ altındaki CV dosyası. Dosya eklenene kadar null bırak. */
  cvUrl: string | null;
  links: SocialLink[];
}

export interface ExpertiseArea {
  area: string;
  items: string[];
}

/* ─── Profil ──────────────────────────────────────────────── */

export const PROFILE: Profile = {
  name: 'A. Tunahan Korkmaz',
  title: 'Yarı akademisyen, yarı geliştirici',
  availability: 'Yeni projelere açık',
  location: 'Çankırı, Türkiye',

  summary:
    'Çankırı Karatekin Üniversitesi çevresinde iki koldan çalışıyorum: ' +
    'üniversite süreçlerini dijitalleştiren full-stack uygulamalar geliştiriyorum ' +
    've TÜBİTAK destekli yapay zekâ projelerinde danışmanlık yapıyorum.',

  bio: [
    'Yazılım tarafında işin büyük kısmı React, Node.js ve MongoDB üçgeninde geçiyor. ' +
      'Üretime çıkmış iki işim var: biri bir üniversitenin belge süreçlerini baştan sona ' +
      'dijitalleştiren bir otomasyon, diğeri bir teknokentin kurumsal sitesi.',
    'Akademik tarafta 2209-A programında üç projeye danışmanlık yaptım; konular doğal afet ' +
      'sonrası sosyal medya analizinden kemik tümörü görüntüleme tanısına uzanıyor. ' +
      'TEYDEB kapsamında yürüyen servis araçları güvenlik projesinde proje personeli olarak ' +
      'görev aldım.',
    'İki tarafın kesiştiği yer ilgimi çekiyor: bir araştırma çıktısının gerçekten ' +
      'kullanılabilir bir ürüne dönüştüğü nokta.',
  ],

  // TODO: public/cv.pdf dosyasını ekleyince '/cv.pdf' yap
  cvUrl: null,

  links: [
    {
      label: 'GitHub',
      value: 'github.com/mrtunahan',
      href: 'https://github.com/mrtunahan',
      icon: 'github',
    },
    {
      // TODO: gerçek e-posta adresiyle değiştir
      label: 'E-posta',
      value: 'adres@example.com',
      href: 'mailto:adres@example.com',
      icon: 'mail',
    },
    {
      // TODO: gerçek LinkedIn kullanıcı adıyla değiştir
      label: 'LinkedIn',
      value: 'linkedin.com/in/kullanici',
      href: 'https://linkedin.com/in/kullanici',
      icon: 'linkedin',
    },
  ],
};

/* ─── Uzmanlık ────────────────────────────────────────────── */

export const EXPERTISE: ExpertiseArea[] = [
  {
    area: 'Arayüz',
    items: ['React', 'Next.js', 'Vite', 'TypeScript', 'Tailwind CSS', 'React Native'],
  },
  {
    area: 'Sunucu',
    items: ['Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Flask', 'REST API'],
  },
  {
    area: 'Araştırma',
    items: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'YOLOv8', 'BERT'],
  },
];

/* ─── Projeler ────────────────────────────────────────────── */

export const PROJECTS: Project[] = [
  {
    id: 0,
    track: 'software',
    name: 'Offline Asistan',
    summary:
      'Çankırı Karatekin Üniversitesi’nin Erasmus, staj, sınav programı ve muafiyet ' +
      'belge süreçlerini uçtan uca dijitalleştiren full-stack otomasyon.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Socket.IO'],
    status: 'live',
    url: 'https://offlineasistan.com.tr/',
    displayUrl: 'offlineasistan.com.tr',
    demoKey: 'offline-asistan',
  },
  {
    id: 1,
    track: 'software',
    name: 'Çakü Teknokent',
    summary:
      'Çankırı Karatekin Üniversitesi Teknokent’in kurumsal web sitesi. ' +
      'Modern React teknolojisiyle geliştirildi.',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
    status: 'live',
    url: 'https://cakuteknokent.com.tr/',
    displayUrl: 'cakuteknokent.com.tr',
    demoKey: null,
  },
  {
    id: 2,
    track: 'software',
    name: 'KaratekinTravel',
    summary:
      'Uzaktaki köyleri yakınlaştırmayı hedefleyen seyahat planlama mobil uygulaması. ' +
      'Geliştirme aşamasında.',
    tech: ['React Native', 'Expo'],
    status: 'dev',
    url: null,
    displayUrl: null,
    demoKey: 'karatekin-travel',
  },
  {
    id: 10,
    track: 'research',
    name: 'Doğal Afet Sonrası Sosyal Medya Duygu Sınıflandırması',
    shortName: 'Duygu Sınıflandırması',
    summary:
      'Doğal afet sonrasında paylaşılan sosyal medya içeriklerini duygu durumuna göre ' +
      'sınıflandıran doğal dil işleme sistemi.',
    tech: ['Python', 'TensorFlow', 'NLP', 'BERT'],
    status: 'active',
    url: null,
    displayUrl: null,
    demoKey: null,
    grant: {
      program: '2209-A',
      number: '1919B012471683',
      role: 'Akademik Danışman',
      period: '2024/1',
    },
  },
  {
    id: 11,
    track: 'research',
    name: 'Görüntülemeden Otomatik Kemik Tümörü Tanısı',
    shortName: 'Kemik Tümörü Tanısı',
    summary:
      'MR ve BT görüntülerinden kemik tümörlerini otomatik olarak tespit eden ' +
      'derin öğrenme tabanlı tanı destek sistemi.',
    tech: ['Python', 'PyTorch', 'CNN', 'OpenCV'],
    status: 'active',
    url: null,
    displayUrl: null,
    demoKey: null,
    grant: {
      program: '2209-A',
      number: '1919B012471715',
      role: 'Akademik Danışman',
      period: '2024/1',
    },
  },
  {
    id: 12,
    track: 'research',
    name: 'Bitki Yapraklarından Hastalık Tespiti',
    shortName: 'Bitki Hastalık Tespiti',
    summary:
      'Bitki yapraklarının görüntülerinden hastalık tespiti yapan görüntü işleme sistemi.',
    tech: ['Python', 'YOLOv8', 'OpenCV', 'Flask'],
    status: 'active',
    url: null,
    displayUrl: null,
    demoKey: null,
    grant: {
      program: '2209-A',
      number: '1919B012471699',
      role: 'Akademik Danışman',
      period: '2024/1',
    },
  },
  {
    id: 13,
    track: 'research',
    name: 'Servis Araçları Güvenlik Sistemi',
    shortName: 'Servis Araç Güvenliği',
    summary:
      'Yapay zekâ ve görüntü işleme ile servis araçlarında güvenliği izleyen sistem.',
    tech: ['Python', 'TensorFlow', 'OpenCV', 'ROS'],
    status: 'done',
    url: null,
    displayUrl: null,
    demoKey: null,
    grant: {
      program: 'TEYDEB',
      number: '3220807',
      role: 'Proje Personeli',
      period: '2023–2025',
    },
  },
];

/* ─── Zaman tüneli ────────────────────────────────────────── */

/* TODO: Eğitim ve iş geçmişi kayıtları eksik. Aşağıdakiler yalnızca
   proje verisinden türetilen, tarihi kesin olarak bilinen kayıtlar. */

export const TIMELINE: TimelineEntry[] = [
  {
    id: 1,
    period: '2024 —',
    title: 'Akademik Danışman · 2209-A',
    organization: 'TÜBİTAK Üniversite Öğrencileri Araştırma Projeleri',
    description:
      'Üç ayrı lisans araştırma projesine danışmanlık: sosyal medya duygu ' +
      'sınıflandırması, kemik tümörü görüntüleme tanısı ve bitki hastalık tespiti.',
    kind: 'research',
  },
  {
    id: 2,
    period: '2023 – 2025',
    title: 'Proje Personeli · TEYDEB 3220807',
    organization: 'TÜBİTAK Sanayi Ar-Ge Projeleri Destekleme Programı',
    description:
      'Yapay zekâ ve görüntü işleme ile servis araçları güvenlik sistemi ' +
      'geliştirme projesinde görev aldı.',
    kind: 'research',
  },
  {
    id: 3,
    period: '2023 —',
    title: 'Full-Stack Geliştirici',
    organization: 'Çankırı Karatekin Üniversitesi çevresi',
    description:
      'Üniversite belge süreçleri otomasyonu ve teknokent kurumsal sitesi dahil ' +
      'üretime çıkmış web ve mobil projeler.',
    kind: 'work',
  },
];

/* ─── Gezinme ─────────────────────────────────────────────── */

export interface NavSection {
  id: string;
  label: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'hakkimda', label: 'Hakkımda' },
  { id: 'projeler', label: 'Projeler' },
  { id: 'gecmis', label: 'Geçmiş' },
  { id: 'iletisim', label: 'İletişim' },
];

/* ─── Yardımcılar ─────────────────────────────────────────── */

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Yayında',
  dev: 'Geliştirmede',
  active: 'Yürüyor',
  done: 'Tamamlandı',
};

export const TRACK_LABEL: Record<ProjectTrack, string> = {
  software: 'Yazılım',
  research: 'Araştırma',
};

export const displayName = (p: Project): string => p.shortName ?? p.name;
