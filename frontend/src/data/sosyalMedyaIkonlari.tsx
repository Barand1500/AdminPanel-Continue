export type SosyalIkonVaryant = 'solid' | 'minimal' | 'brand' | 'ozel';

export interface SosyalPlatformBilgi {
  id: string;
  ad: string;
  renk: string;
  placeholder: string;
  domainler: string[];
  aramaEtiketleri?: string[];
}

export const SOSYAL_PLATFORMLAR: SosyalPlatformBilgi[] = [
  {
    id: 'facebook',
    ad: 'Facebook',
    renk: '#1877F2',
    placeholder: 'https://facebook.com/...',
    domainler: ['facebook.com', 'fb.com'],
    aramaEtiketleri: ['facebook', 'fb', 'meta'],
  },
  {
    id: 'instagram',
    ad: 'Instagram',
    renk: '#E4405F',
    placeholder: 'https://instagram.com/...',
    domainler: ['instagram.com'],
    aramaEtiketleri: ['instagram', 'insta', 'ig'],
  },
  {
    id: 'twitter',
    ad: 'X (Twitter)',
    renk: '#000000',
    placeholder: 'https://x.com/...',
    domainler: ['twitter.com', 'x.com'],
    aramaEtiketleri: ['twitter', 'x', 'tweet'],
  },
  {
    id: 'youtube',
    ad: 'YouTube',
    renk: '#FF0000',
    placeholder: 'https://youtube.com/...',
    domainler: ['youtube.com', 'youtu.be'],
    aramaEtiketleri: ['youtube', 'yt'],
  },
  {
    id: 'linkedin',
    ad: 'LinkedIn',
    renk: '#0A66C2',
    placeholder: 'https://linkedin.com/...',
    domainler: ['linkedin.com'],
    aramaEtiketleri: ['linkedin', 'linked in'],
  },
  {
    id: 'tiktok',
    ad: 'TikTok',
    renk: '#000000',
    placeholder: 'https://tiktok.com/@...',
    domainler: ['tiktok.com'],
    aramaEtiketleri: ['tiktok', 'tik tok', 'tt'],
  },
  {
    id: 'whatsapp',
    ad: 'WhatsApp',
    renk: '#25D366',
    placeholder: 'https://wa.me/...',
    domainler: ['wa.me', 'whatsapp.com'],
    aramaEtiketleri: ['whatsapp', 'wa'],
  },
  {
    id: 'telegram',
    ad: 'Telegram',
    renk: '#26A5E4',
    placeholder: 'https://t.me/...',
    domainler: ['t.me', 'telegram.me'],
    aramaEtiketleri: ['telegram', 'tg'],
  },
  {
    id: 'pinterest',
    ad: 'Pinterest',
    renk: '#E60023',
    placeholder: 'https://pinterest.com/...',
    domainler: ['pinterest.com'],
    aramaEtiketleri: ['pinterest'],
  },
  {
    id: 'github',
    ad: 'GitHub',
    renk: '#181717',
    placeholder: 'https://github.com/...',
    domainler: ['github.com'],
    aramaEtiketleri: ['github', 'gh'],
  },
  {
    id: 'discord',
    ad: 'Discord',
    renk: '#5865F2',
    placeholder: 'https://discord.gg/...',
    domainler: ['discord.com', 'discord.gg'],
    aramaEtiketleri: ['discord'],
  },
  {
    id: 'snapchat',
    ad: 'Snapchat',
    renk: '#FFFC00',
    placeholder: 'https://snapchat.com/...',
    domainler: ['snapchat.com'],
    aramaEtiketleri: ['snapchat', 'snap'],
  },
  {
    id: 'threads',
    ad: 'Threads',
    renk: '#000000',
    placeholder: 'https://threads.net/...',
    domainler: ['threads.net'],
    aramaEtiketleri: ['threads'],
  },
  {
    id: 'spotify',
    ad: 'Spotify',
    renk: '#1DB954',
    placeholder: 'https://open.spotify.com/...',
    domainler: ['spotify.com', 'open.spotify.com'],
    aramaEtiketleri: ['spotify'],
  },
  {
    id: 'medium',
    ad: 'Medium',
    renk: '#000000',
    placeholder: 'https://medium.com/...',
    domainler: ['medium.com'],
    aramaEtiketleri: ['medium'],
  },
  {
    id: 'behance',
    ad: 'Behance',
    renk: '#1769FF',
    placeholder: 'https://behance.net/...',
    domainler: ['behance.net'],
    aramaEtiketleri: ['behance'],
  },
  {
    id: 'dribbble',
    ad: 'Dribbble',
    renk: '#EA4C89',
    placeholder: 'https://dribbble.com/...',
    domainler: ['dribbble.com'],
    aramaEtiketleri: ['dribbble'],
  },
  {
    id: 'vimeo',
    ad: 'Vimeo',
    renk: '#1AB7EA',
    placeholder: 'https://vimeo.com/...',
    domainler: ['vimeo.com'],
    aramaEtiketleri: ['vimeo'],
  },
  {
    id: 'twitch',
    ad: 'Twitch',
    renk: '#9146FF',
    placeholder: 'https://twitch.tv/...',
    domainler: ['twitch.tv'],
    aramaEtiketleri: ['twitch'],
  },
  {
    id: 'reddit',
    ad: 'Reddit',
    renk: '#FF4500',
    placeholder: 'https://reddit.com/...',
    domainler: ['reddit.com'],
    aramaEtiketleri: ['reddit'],
  },
];

export type SosyalPlatform = string;

const SIRA_ANAHTAR = '__sira__';

/** Platform SVG path (24x24 viewBox) */
const PLATFORM_GLYPH: Record<string, string> = {
  facebook:
    'M14 8h-2.5c-.8 0-1.5.7-1.5 1.5V11H8v3h2V22h3v-8h2.6l.4-3H11V9.2c0-.7.6-1.2 1.3-1.2H14V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4.1V11H6v3h2v8h3v-8h3v-3z',
  instagram:
    'M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0-2.4c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.4.4 1.1.5 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.5 2.3-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.4.2-1.1.4-2.3.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.4-.4-1.1-.5-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.9.5-2.3.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .4-.2 1.1-.4 2.3-.5 1.2-.1 1.6-.1 4.8-.1zM12 5a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm7.4-.9a1.6 1.6 0 1 0-1.6 1.6 1.6 1.6 0 0 0 1.6-1.6z',
  twitter:
    'M18.9 5.5h2.7l-5.9 6.7 7 9.3h-5.4l-4.3-5.6-4.9 5.6H5.4l6.3-7.2L5 5.5h5.5l3.9 5.1 4.5-5.1zm-1 14.8h1.5L7.6 7.1H6l11.9 13.2z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 9.2 2 12 2 12s0 2.8.4 4.8a2.5 2.5 0 0 0 1.8 1.8C6.2 19 12 19 12 19s5.8 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-2 .4-4.8.4-4.8s0-2.8-.4-4.8zM10 15.5V8.5l5.2 3.5L10 15.5z',
  linkedin:
    'M6.5 9.3H3.6V20h2.9V9.3zM5 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM9.3 9.3H12v1.4h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V20h-3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H9.3V9.3z',
  tiktok:
    'M16.5 3.5c.8 1.6 2.2 2.8 3.9 3.2v3.1c-1.4 0-2.8-.4-4-1.2v6.8a5.4 5.4 0 1 1-4.7-5.4v3.2a2.2 2.2 0 1 0 1.6 2.1V3.5h3.2z',
  whatsapp:
    'M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.3L2 22l4.9-1.3A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.2 14.2c-.3.8-1.5 1.5-2.1 1.6-.5.1-1.2.2-2-.4-1.5-.8-2.5-1.9-3.4-3.1-.9-1.2-1.6-2.5-1.7-2.9-.1-.4-.2-.8 0-1.1.1-.3.3-.5.4-.7.1-.2.2-.4.2-.6 0-.2 0-.4-.1-.6-.1-.2-.6-1.5-.9-2.1-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.4 0 1.4 1 2.8 1.1 3 .1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.2-.3-.3-.6-.5z',
  telegram:
    'M21.5 4.5 3.8 11.3c-1 .4-1 1 .2 1.3l4.6 1.4 1.8 5.5c.2.7.6.9 1 .9s.6-.2.9-.7l2.6-2.5 5.4 4c1 .6 1.7.3 2-1l3.2-15.2c.4-1.5-.6-2.2-1.6-1.7zM9.2 13.8l9.7-6.1c.5-.3.9-.1.5.2l-8.3 7.6-.3 3.5-1.6-5.2z',
  github:
    'M12 2a10 10 0 0 0-3.2 19.4c.5.1.7-.2.7-.5v-1.8c-3 .7-3.6-1.4-3.6-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.7.8 2.1.5.1-1 .4-1.7.8-2.1-2.4-.3-4.9-1.2-4.9-5.4a4.2 4.2 0 0 1 1.1-2.9 3.9 3.9 0 0 1 .1-2.9s.9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.9a4.2 4.2 0 0 1 1.1 2.9c0 4.2-2.5 5.1-4.9 5.4.4.3.8 1 .8 2.1v3.1c0 .3.2.6.7.5A10 10 0 0 0 12 2z',
  pinterest:
    'M12 2a10 10 0 0 0-3.5 19.4c0-.9 0-2-.1-2.8l1.2-5.2s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.3 1 .6 1.8 1.6 1.8 1.9 0 3.4-2 3.4-4.9 0-2.6-1.9-4.4-4.6-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.4a.3.3 0 0 1 0 .3l-.3 1.2c0 .1-.1.2-.3.1-1.6-.7-2.6-3-2.6-4.8 0-3.9 2.8-7.5 8.1-7.5 4.3 0 7.6 3.1 7.6 7.2 0 4.3-2.7 7.7-6.5 7.7-1.3 0-2.5-.7-2.9-1.5l-.8 3c-.3 1.1-1.1 2.5-1.6 3.4A10 10 0 1 0 12 2z',
};

function platformHarf(id: string) {
  const p = SOSYAL_PLATFORMLAR.find((x) => x.id === id);
  return (p?.ad ?? id).charAt(0).toUpperCase();
}

function GlyphIcerik({ platform, renk }: { platform: string; renk: string }) {
  const path = PLATFORM_GLYPH[platform];
  if (path) {
    return <path d={path} fill={renk} />;
  }
  return (
    <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill={renk}>
      {platformHarf(platform)}
    </text>
  );
}

export function SosyalIkonSvg({
  platform,
  varyant,
  className = 'h-5 w-5',
  renk,
}: {
  platform: string;
  varyant: SosyalIkonVaryant;
  className?: string;
  renk?: string;
}) {
  const platformRenk = renk ?? SOSYAL_PLATFORMLAR.find((p) => p.id === platform)?.renk ?? '#64748b';

  if (varyant === 'solid') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="12" fill={platformRenk} />
        <g transform="translate(12 12) scale(0.5) translate(-12 -12)">
          <GlyphIcerik platform={platform} renk="#ffffff" />
        </g>
      </svg>
    );
  }

  if (varyant === 'brand') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="6" fill={platformRenk} />
        <g transform="translate(12 12) scale(0.5) translate(-12 -12)">
          <GlyphIcerik platform={platform} renk="#ffffff" />
        </g>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <GlyphIcerik platform={platform} renk={platformRenk} />
    </svg>
  );
}

export const IKON_VARYANTLARI: { id: SosyalIkonVaryant; ad: string }[] = [
  { id: 'brand', ad: 'Marka' },
  { id: 'solid', ad: 'Dolu' },
  { id: 'minimal', ad: 'Çizgi' },
];

/** İkon paketleri — admin panelde seçim etiketleri */
export const IKON_PAKETLERI = [
  { id: 'brand' as const, ad: 'Marka renkli', aciklama: 'Platform marka renkleri' },
  { id: 'solid' as const, ad: 'Dolu yuvarlak', aciklama: 'Renkli daire içinde beyaz ikon' },
  { id: 'minimal' as const, ad: 'Çizgi', aciklama: 'Sade kontur ikon' },
];

export function sosyalIkonAnahtar(platform: string) {
  return `${platform}_icon`;
}

export function sosyalAdAnahtar(platform: string) {
  return `${platform}_ad`;
}

export function ozelIkonMu(deger: string | undefined): deger is string {
  return !!deger && (deger.startsWith('http') || deger.startsWith('/') || deger.startsWith('data:'));
}

function metaAnahtarMi(anahtar: string) {
  return anahtar === SIRA_ANAHTAR || anahtar.endsWith('_icon') || anahtar.endsWith('_ad');
}

export function varsayilanPlatformUrl(platform: SosyalPlatformBilgi): string {
  const sablonlar: Record<string, string> = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    twitter: 'https://x.com/',
    youtube: 'https://www.youtube.com/@',
    linkedin: 'https://www.linkedin.com/company/',
    tiktok: 'https://www.tiktok.com/@',
    whatsapp: 'https://wa.me/',
    telegram: 'https://t.me/',
    github: 'https://github.com/',
    discord: 'https://discord.gg/',
  };
  return sablonlar[platform.id] ?? `https://${platform.domainler[0]}/`;
}

export function platformAra(metin: string, haricPlatformIdleri: string[]): SosyalPlatformBilgi[] {
  const q = metin.trim().toLowerCase();
  if (!q) return [];

  return SOSYAL_PLATFORMLAR.filter((p) => {
    if (haricPlatformIdleri.includes(p.id)) return false;
    if (p.id.includes(q) || p.ad.toLowerCase().includes(q)) return true;
    return (p.aramaEtiketleri ?? []).some((etiket) => etiket.includes(q) || q.includes(etiket));
  });
}

export function platformUrlTanima(url: string): SosyalPlatformBilgi | null {
  if (!url.trim()) return null;
  try {
    const host = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
    return SOSYAL_PLATFORMLAR.find((p) => p.domainler.some((d) => host === d || host.endsWith(`.${d}`))) ?? null;
  } catch {
    return null;
  }
}

export interface SosyalMedyaOgesi {
  id: string;
  platformId: string;
  ad: string;
  url: string;
  ikonVaryant: SosyalIkonVaryant;
  ozelLogoUrl?: string;
}

function ogeKayittanOlustur(pid: string, sosyal: Record<string, string>): SosyalMedyaOgesi | null {
  const platform = SOSYAL_PLATFORMLAR.find((p) => p.id === pid);
  const url = sosyal[pid] ?? '';
  const ikonHam = sosyal[sosyalIkonAnahtar(pid)] ?? 'brand';

  if (platform) {
    return {
      id: pid,
      platformId: pid,
      ad: platform.ad,
      url,
      ikonVaryant: ozelIkonMu(ikonHam) ? 'ozel' : (ikonHam as SosyalIkonVaryant),
      ozelLogoUrl: ozelIkonMu(ikonHam) ? ikonHam : undefined,
    };
  }

  if (pid.startsWith('ozel-') || sosyal[sosyalAdAnahtar(pid)]) {
    const ikon = sosyal[sosyalIkonAnahtar(pid)] ?? 'minimal';
    return {
      id: pid,
      platformId: 'ozel',
      ad: sosyal[sosyalAdAnahtar(pid)] ?? 'Özel Platform',
      url,
      ikonVaryant: ozelIkonMu(ikon) ? 'ozel' : (ikon as SosyalIkonVaryant),
      ozelLogoUrl: ozelIkonMu(ikon) ? ikon : undefined,
    };
  }

  return null;
}

export function sosyalKayittanOgeler(sosyal: Record<string, string>): SosyalMedyaOgesi[] {
  if (sosyal[SIRA_ANAHTAR]) {
    return sosyal[SIRA_ANAHTAR].split(',')
      .map((pid) => pid.trim())
      .filter(Boolean)
      .map((pid) => ogeKayittanOlustur(pid, sosyal))
      .filter((oge): oge is SosyalMedyaOgesi => oge !== null);
  }

  const ogeler: SosyalMedyaOgesi[] = [];
  const islenen = new Set<string>();

  for (const platform of SOSYAL_PLATFORMLAR) {
    const url = sosyal[platform.id]?.trim();
    if (!url) continue;
    islenen.add(platform.id);
    const oge = ogeKayittanOlustur(platform.id, sosyal);
    if (oge) ogeler.push(oge);
  }

  for (const [anahtar, deger] of Object.entries(sosyal)) {
    if (metaAnahtarMi(anahtar) || islenen.has(anahtar)) continue;
    const url = deger.trim();
    if (!url.startsWith('http')) continue;
    const oge = ogeKayittanOlustur(anahtar, sosyal);
    if (oge) {
      ogeler.push(oge);
      islenen.add(anahtar);
    }
  }

  return ogeler;
}

export function sosyalOgelerdenKayit(ogeler: SosyalMedyaOgesi[]): Record<string, string> {
  const kayit: Record<string, string> = {};
  const sira: string[] = [];

  for (const oge of ogeler) {
    const pid = oge.platformId === 'ozel' ? oge.id : oge.platformId;
    sira.push(pid);
    kayit[pid] = oge.url;
    if (oge.platformId === 'ozel') {
      kayit[sosyalAdAnahtar(pid)] = oge.ad;
    }
    if (oge.ozelLogoUrl) {
      kayit[sosyalIkonAnahtar(pid)] = oge.ozelLogoUrl;
    } else if (oge.ikonVaryant !== 'ozel') {
      kayit[sosyalIkonAnahtar(pid)] = oge.ikonVaryant;
    }
  }

  if (sira.length > 0) {
    kayit[SIRA_ANAHTAR] = sira.join(',');
  }

  return kayit;
}
