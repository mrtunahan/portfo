import { useState } from 'react';

const skills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 95 },
  { name: 'Three.js', level: 75 },
  { name: 'Node.js', level: 85 },
  { name: 'TypeScript', level: 80 },
  { name: 'CSS / Tailwind', level: 90 },
];

const projects = [
  {
    title: '3D Portfolio',
    desc: 'React Three Fiber ile loş odadan aydınlanan interaktif portfolyo sitesi.',
    tech: ['React', 'Three.js', 'R3F'],
    link: '#',
  },
  {
    title: 'E-Commerce App',
    desc: 'Full-stack e-ticaret uygulaması, ödeme entegrasyonu ve admin paneli.',
    tech: ['Next.js', 'Stripe', 'MongoDB'],
    link: '#',
  },
  {
    title: 'Chat Application',
    desc: 'Gerçek zamanlı mesajlaşma uygulaması, WebSocket desteği.',
    tech: ['React', 'Socket.io', 'Express'],
    link: '#',
  },
];

export default function ContentOverlay({ isLightOn }) {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-[1500ms] ease-out ${
        isLightOn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ─── İsim & Başlık — Sol Üst ─── */}
      <div className={`absolute top-8 left-8 pointer-events-auto opacity-0 ${isLightOn ? 'animate-fade-up stagger-1' : ''}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-shadow-glow">
          Tunahan
        </h1>
        <p className="mt-2 text-amber-400/80 text-sm md:text-base font-medium tracking-widest uppercase">
          Full-Stack Developer
        </p>
        <div className="mt-3 h-[2px] w-16 bg-gradient-to-r from-amber-500/80 to-transparent" />
      </div>

      {/* ─── Yetenekler Paneli — Sol Alt ─── */}
      <div
        className={`absolute bottom-8 left-8 pointer-events-auto transition-all duration-500 ease-out
          ${activeSection === 'Yetenekler' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="glass rounded-2xl p-6 w-[320px] md:w-[360px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-glow-pulse" />
            Yetenekler
          </h2>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>{skill.name}</span>
                  <span className="text-amber-400/70">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out"
                    style={{
                      width: activeSection === 'Yetenekler' ? `${skill.level}%` : '0%',
                      transitionDelay: '200ms',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Projeler Paneli — Orta Alt ─── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto transition-all duration-500 ease-out
          ${activeSection === 'Projeler' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="flex gap-4">
          {projects.map((project, i) => (
            <a
              key={project.title}
              href={project.link}
              className="glass glass-hover rounded-2xl p-5 w-[240px] md:w-[260px] transition-all duration-300 group block"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h3 className="text-white font-semibold mb-2 group-hover:text-amber-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-white/50 text-xs leading-relaxed mb-3">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-400/70 border border-amber-500/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ─── İletişim Paneli — Sağ Alt ─── */}
      <div
        className={`absolute bottom-8 right-8 pointer-events-auto transition-all duration-500 ease-out
          ${activeSection === 'İletişim' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <div className="glass rounded-2xl p-6 w-[300px]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-glow-pulse" />
            İletişim
          </h2>
          <div className="space-y-3">
            {[
              { icon: '✉', label: 'E-posta', value: 'tunahan@example.com', href: 'mailto:tunahan@example.com' },
              { icon: '🔗', label: 'GitHub', value: 'github.com/tunahan', href: 'https://github.com/tunahan' },
              { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/tunahan', href: 'https://linkedin.com/in/tunahan' },
            ].map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="text-lg">{contact.icon}</span>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">{contact.label}</p>
                  <p className="text-white/70 text-sm group-hover:text-amber-400 transition-colors">
                    {contact.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Alt bilgi — "Scroll yok" ipucu ─── */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 ${isLightOn && !activeSection ? 'animate-fade-up stagger-6' : ''}`}>
        <p className="text-white/20 text-[11px] tracking-wider uppercase pointer-events-auto">
          Menüden bir bölüm seçin
        </p>
      </div>
    </div>
  );
}
