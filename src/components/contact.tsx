import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/brand-icons';
import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/components/ui/button';
import { PROFILE } from '@/data/portfolioData';
import type { SocialLink } from '@/data/portfolioData';

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

const ICON: Record<SocialLink['icon'], IconComp> = {
  github: GithubIcon,
  mail: Mail as IconComp,
  linkedin: LinkedinIcon,
};

function LinkRow({ link }: { link: SocialLink }) {
  const Icon = ICON[link.icon];
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* pano erişimi reddedildi — kullanıcı metni elle seçebilir */
    }
  };

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-accent/40">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{link.label}</p>
        <a
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="block truncate text-sm hover:text-accent hover:underline"
        >
          {link.value}
        </a>
      </div>

      <Button variant="ghost" size="icon" onClick={copy} aria-label={`${link.label} adresini kopyala`}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
    </li>
  );
}

export function Contact() {
  const mail = PROFILE.links.find((l) => l.icon === 'mail');

  return (
    <section id="iletisim" className="container scroll-mt-24 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid gap-10 lg:grid-cols-12"
      >
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">İletişim</h2>
          <p className="mt-3 max-w-measure text-pretty leading-relaxed text-muted-foreground">
            Proje, danışmanlık veya iş birliği için yazabilirsiniz. En hızlı yanıt
            e-posta üzerinden.
          </p>

          {mail && (
            <Button asChild className="mt-6">
              <a href={mail.href}>
                <Mail aria-hidden="true" />
                E-posta gönder
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          )}
        </div>

        {/* Form yerine doğrudan bağlantılar: statik sitede formun mesajı
            gönderebileceği bir arka uç yok. Çalışmayan bir form, çalışan bir
            bağlantıdan kötüdür. */}
        <ul className="space-y-3 lg:col-span-6 lg:col-start-7">
          {PROFILE.links.map((l) => (
            <LinkRow key={l.label} link={l} />
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
