/* ───────────────────────────────────────────────────────────
   Kişisel bilgiler tek yerde.
   TODO: e-posta ve LinkedIn adresini kendi bilgilerinle değiştir.
   Bunlar şu an yer tutucu — siteye koymadan önce doldur.
   ─────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: 'A. Tunahan Korkmaz',
  nameLines: ['A. Tunahan', 'Korkmaz'],

  // Yazılım ve akademi arasında bölünmüş bir profil
  role: 'Yarı akademisyen, yarı geliştirici',

  lead:
    'Çankırı Karatekin Üniversitesi çevresinde iki koldan çalışıyorum: ' +
    'üniversite süreçlerini dijitalleştiren full-stack uygulamalar geliştiriyorum, ' +
    've TÜBİTAK destekli yapay zekâ projelerinde danışmanlık yapıyorum.',

  about: [
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

  links: [
    { label: 'GitHub', value: 'github.com/mrtunahan', href: 'https://github.com/mrtunahan' },
    // TODO: gerçek adresle değiştir
    { label: 'E-posta', value: 'adres@example.com', href: 'mailto:adres@example.com' },
    // TODO: gerçek adresle değiştir
    { label: 'LinkedIn', value: 'linkedin.com/in/kullanici', href: 'https://linkedin.com/in/kullanici' },
  ],

  location: 'Çankırı, Türkiye',
};

/** Gerçek proje verisinden türetilen teknoloji grupları. */
export const STACK = [
  {
    area: 'Arayüz',
    items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'React Native'],
  },
  {
    area: 'Sunucu',
    items: ['Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Flask'],
  },
  {
    area: 'Araştırma',
    items: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'YOLOv8', 'BERT'],
  },
];
