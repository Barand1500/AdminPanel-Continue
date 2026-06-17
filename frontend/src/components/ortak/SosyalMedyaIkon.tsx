import {
  SOSYAL_PLATFORMLAR,
  SosyalIkonSvg,
  ozelIkonMu,
  sosyalIkonAnahtar,
  sosyalKayittanOgeler,
  type SosyalIkonVaryant,
  type SosyalMedyaOgesi,
  type SosyalPlatform,
} from '@/data/sosyalMedyaIkonlari';

/** @deprecated SosyalMedyaIkonSatirlari kullanın */
export function sosyalMedyaLinkleri(sosyal: Record<string, string>) {
  return sosyalKayittanOgeler(sosyal)
    .filter((oge) => oge.url.trim().length > 0)
    .map((oge) => {
      const anahtar = oge.platformId === 'ozel' ? oge.id : oge.platformId;
      return [anahtar, oge.url.trim()] as [string, string];
    });
}

export function sosyalMedyaBaglantilari(sosyal: Record<string, string>): SosyalMedyaOgesi[] {
  return sosyalKayittanOgeler(sosyal).filter((oge) => oge.url.trim().length > 0);
}

/** Admin panel önizlemesiyle birebir aynı ikon */
export function SosyalMedyaOgeIkon({
  oge,
  className = 'h-9 w-9',
}: {
  oge: SosyalMedyaOgesi;
  className?: string;
}) {
  if (oge.ozelLogoUrl) {
    return <img src={oge.ozelLogoUrl} alt="" className={`rounded-lg object-contain ${className}`} />;
  }

  const platform = oge.platformId === 'ozel' ? oge.id : oge.platformId;
  if (!SOSYAL_PLATFORMLAR.some((x) => x.id === platform) && platform.startsWith('ozel-')) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] text-xs font-bold ${className}`}
      >
        {oge.ad.charAt(0).toUpperCase()}
      </span>
    );
  }

  const varyant: SosyalIkonVaryant =
    oge.ikonVaryant === 'ozel' ? 'brand' : oge.ikonVaryant;
  return <SosyalIkonSvg platform={platform as SosyalPlatform} varyant={varyant} className={className} />;
}

export function SosyalMedyaIkonSatirlari({
  sosyal,
  className = '',
  ikonSinifi = 'h-9 w-9',
}: {
  sosyal: Record<string, string>;
  className?: string;
  ikonSinifi?: string;
}) {
  const ogeler = sosyalMedyaBaglantilari(sosyal);
  if (ogeler.length === 0) return null;

  return (
    <div className={`site-sosyal-medya-satir ${className}`.trim()}>
      {ogeler.map((oge) => (
        <a
          key={oge.id}
          href={oge.url.trim()}
          target="_blank"
          rel="noreferrer"
          className="site-sosyal-medya-link"
          title={oge.ad}
          aria-label={oge.ad}
        >
          <SosyalMedyaOgeIkon oge={oge} className={ikonSinifi} />
        </a>
      ))}
    </div>
  );
}

export function SosyalMedyaIkonGoster({
  platform,
  ikonDeger,
  className = 'h-5 w-5',
}: {
  platform: string;
  ikonDeger?: string;
  className?: string;
}) {
  if (ozelIkonMu(ikonDeger)) {
    return <img src={ikonDeger} alt="" className={`rounded-lg object-contain ${className}`} />;
  }

  const p = platform as SosyalPlatform;
  if (!SOSYAL_PLATFORMLAR.some((x) => x.id === p) && platform.startsWith('ozel-')) {
    return <span className="text-xs font-bold uppercase">{platform[0]}</span>;
  }

  const varyant = (ikonDeger ?? 'brand') as SosyalIkonVaryant;
  return <SosyalIkonSvg platform={p} varyant={varyant === 'ozel' ? 'brand' : varyant} className={className} />;
}

export function platformIkonDegeri(sosyal: Record<string, string>, platform: string) {
  return sosyal[sosyalIkonAnahtar(platform as SosyalPlatform)] ?? 'brand';
}
