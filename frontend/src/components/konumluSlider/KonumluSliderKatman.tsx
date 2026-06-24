import type { KonumluSliderKayit } from '@/types/konumluSlider';
import { KonumluSliderRender } from '@/components/konumluSlider/KonumluSliderRender';
import {
  headerFooterSliderlar,
  konumluSliderlarSayfaFiltre,
} from '@/utils/konumluSliderYerlesim';

type HeaderFooterTip = 'header-ustu' | 'header-alti' | 'footer-ustu' | 'footer-alti';

interface KonumluSliderKatmanProps {
  konumluSliderlar: KonumluSliderKayit[];
  sayfaId: string | null;
  tip: HeaderFooterTip;
  sinif?: string;
}

export function KonumluSliderKatman({
  konumluSliderlar,
  sayfaId,
  tip,
  sinif = '',
}: KonumluSliderKatmanProps) {
  const liste = headerFooterSliderlar(
    konumluSliderlarSayfaFiltre(konumluSliderlar, sayfaId),
    tip
  ).filter((s) => s.aktif);

  if (liste.length === 0) return null;

  return (
    <div className={`ks-katman ks-katman--${tip} ${sinif}`.trim()}>
      {liste.map((s) => (
        <KonumluSliderRender key={s.id} slider={s} />
      ))}
    </div>
  );
}
