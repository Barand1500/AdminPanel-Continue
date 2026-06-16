import {
  SOSYAL_PLATFORMLAR,
  SosyalIkonSvg,
  ozelIkonMu,
  sosyalIkonAnahtar,
  sosyalKayittanOgeler,
  type SosyalIkonVaryant,
  type SosyalPlatform,
} from '@/data/sosyalMedyaIkonlari';

export function sosyalMedyaLinkleri(sosyal: Record<string, string>) {
  return sosyalKayittanOgeler(sosyal).map((oge) => [oge.id, oge.url] as [string, string]);
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
    return <img src={ikonDeger} alt="" className={className} />;
  }

  const p = platform as SosyalPlatform;
  if (!SOSYAL_PLATFORMLAR.some((x) => x.id === p) && platform.startsWith('ozel-')) {
    return <span className="text-xs font-bold uppercase">{platform[0]}</span>;
  }

  const varyant = (ikonDeger ?? 'solid') as SosyalIkonVaryant;
  return <SosyalIkonSvg platform={p} varyant={varyant === 'ozel' ? 'solid' : varyant} className={className} />;
}

export function platformIkonDegeri(sosyal: Record<string, string>, platform: string) {
  return sosyal[sosyalIkonAnahtar(platform as SosyalPlatform)] ?? 'solid';
}
