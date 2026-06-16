export type SosyalIkonVaryant = 'solid' | 'minimal' | 'brand' | 'ozel';

export interface SosyalPlatformBilgi {
  id: string;
  ad: string;
  renk: string;
  placeholder: string;
  domainler: string[];
}

export const SOSYAL_PLATFORMLAR: SosyalPlatformBilgi[] = [
  { id: 'facebook', ad: 'Facebook', renk: '#1877F2', placeholder: 'https://facebook.com/...', domainler: ['facebook.com', 'fb.com'] },
  { id: 'instagram', ad: 'Instagram', renk: '#E4405F', placeholder: 'https://instagram.com/...', domainler: ['instagram.com'] },
  { id: 'twitter', ad: 'X (Twitter)', renk: '#000000', placeholder: 'https://x.com/...', domainler: ['twitter.com', 'x.com'] },
  { id: 'youtube', ad: 'YouTube', renk: '#FF0000', placeholder: 'https://youtube.com/...', domainler: ['youtube.com', 'youtu.be'] },
  { id: 'linkedin', ad: 'LinkedIn', renk: '#0A66C2', placeholder: 'https://linkedin.com/...', domainler: ['linkedin.com'] },
  { id: 'tiktok', ad: 'TikTok', renk: '#000000', placeholder: 'https://tiktok.com/...', domainler: ['tiktok.com'] },
  { id: 'whatsapp', ad: 'WhatsApp', renk: '#25D366', placeholder: 'https://wa.me/...', domainler: ['wa.me', 'whatsapp.com'] },
  { id: 'telegram', ad: 'Telegram', renk: '#26A5E4', placeholder: 'https://t.me/...', domainler: ['t.me', 'telegram.me'] },
  { id: 'pinterest', ad: 'Pinterest', renk: '#E60023', placeholder: 'https://pinterest.com/...', domainler: ['pinterest.com'] },
  { id: 'github', ad: 'GitHub', renk: '#181717', placeholder: 'https://github.com/...', domainler: ['github.com'] },
  { id: 'discord', ad: 'Discord', renk: '#5865F2', placeholder: 'https://discord.gg/...', domainler: ['discord.com', 'discord.gg'] },
  { id: 'snapchat', ad: 'Snapchat', renk: '#FFFC00', placeholder: 'https://snapchat.com/...', domainler: ['snapchat.com'] },
  { id: 'threads', ad: 'Threads', renk: '#000000', placeholder: 'https://threads.net/...', domainler: ['threads.net'] },
  { id: 'spotify', ad: 'Spotify', renk: '#1DB954', placeholder: 'https://open.spotify.com/...', domainler: ['spotify.com', 'open.spotify.com'] },
  { id: 'medium', ad: 'Medium', renk: '#000000', placeholder: 'https://medium.com/...', domainler: ['medium.com'] },
  { id: 'behance', ad: 'Behance', renk: '#1769FF', placeholder: 'https://behance.net/...', domainler: ['behance.net'] },
  { id: 'dribbble', ad: 'Dribbble', renk: '#EA4C89', placeholder: 'https://dribbble.com/...', domainler: ['dribbble.com'] },
  { id: 'vimeo', ad: 'Vimeo', renk: '#1AB7EA', placeholder: 'https://vimeo.com/...', domainler: ['vimeo.com'] },
  { id: 'twitch', ad: 'Twitch', renk: '#9146FF', placeholder: 'https://twitch.tv/...', domainler: ['twitch.tv'] },
  { id: 'reddit', ad: 'Reddit', renk: '#FF4500', placeholder: 'https://reddit.com/...', domainler: ['reddit.com'] },
];

export type SosyalPlatform = string;

function GenericIcon({ harf, renk }: { harf: string; renk: string }) {
  return (
    <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill={renk}>
      {harf}
    </text>
  );
}

function platformHarf(id: string) {
  const p = SOSYAL_PLATFORMLAR.find((x) => x.id === id);
  return (p?.ad ?? id).charAt(0).toUpperCase();
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
  const platformRenk = renk ?? SOSYAL_PLATFORMLAR.find((p) => p.id === platform)?.renk ?? '#666';

  if (varyant === 'solid') {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill={platformRenk} />
        <GenericIcon harf={platformHarf(platform)} renk="#fff" />
      </svg>
    );
  }

  if (varyant === 'brand') {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill={platformRenk} />
        <GenericIcon harf={platformHarf(platform)} renk="#fff" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill={platformRenk}>
      <GenericIcon harf={platformHarf(platform)} renk={platformRenk} />
    </svg>
  );
}

export const IKON_VARYANTLARI: { id: SosyalIkonVaryant; ad: string }[] = [
  { id: 'solid', ad: 'Dolu' },
  { id: 'minimal', ad: 'Çizgi' },
  { id: 'brand', ad: 'Marka' },
];

export function sosyalIkonAnahtar(platform: string) {
  return `${platform}_icon`;
}

export function sosyalUrlAnahtar(platform: string) {
  return platform;
}

export function ozelIkonMu(deger: string | undefined): deger is string {
  return !!deger && (deger.startsWith('http') || deger.startsWith('/') || deger.startsWith('data:'));
}

export function platformUrlTanima(url: string): SosyalPlatformBilgi | null {
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

export function sosyalKayittanOgeler(sosyal: Record<string, string>): SosyalMedyaOgesi[] {
  const ogeler: SosyalMedyaOgesi[] = [];
  const islenen = new Set<string>();

  for (const platform of SOSYAL_PLATFORMLAR) {
    const url = sosyal[platform.id]?.trim();
    if (!url) continue;
    islenen.add(platform.id);
    const ikon = sosyal[sosyalIkonAnahtar(platform.id)] ?? 'solid';
    ogeler.push({
      id: platform.id,
      platformId: platform.id,
      ad: platform.ad,
      url,
      ikonVaryant: ozelIkonMu(ikon) ? 'ozel' : (ikon as SosyalIkonVaryant),
      ozelLogoUrl: ozelIkonMu(ikon) ? ikon : undefined,
    });
  }

  for (const [anahtar, deger] of Object.entries(sosyal)) {
    if (anahtar.endsWith('_icon') || islenen.has(anahtar)) continue;
    const url = deger.trim();
    if (!url || !url.startsWith('http')) continue;
    const ikon = sosyal[sosyalIkonAnahtar(anahtar)] ?? '';
    ogeler.push({
      id: anahtar,
      platformId: 'ozel',
      ad: anahtar,
      url,
      ikonVaryant: ozelIkonMu(ikon) ? 'ozel' : 'minimal',
      ozelLogoUrl: ozelIkonMu(ikon) ? ikon : undefined,
    });
  }

  return ogeler;
}

export function sosyalOgelerdenKayit(ogeler: SosyalMedyaOgesi[]): Record<string, string> {
  const kayit: Record<string, string> = {};
  for (const oge of ogeler) {
    if (!oge.url.trim()) continue;
    const pid = oge.platformId === 'ozel' ? oge.id : oge.platformId;
    kayit[pid] = oge.url.trim();
    if (oge.ozelLogoUrl) {
      kayit[sosyalIkonAnahtar(pid)] = oge.ozelLogoUrl;
    } else if (oge.ikonVaryant !== 'ozel') {
      kayit[sosyalIkonAnahtar(pid)] = oge.ikonVaryant;
    }
  }
  return kayit;
}
