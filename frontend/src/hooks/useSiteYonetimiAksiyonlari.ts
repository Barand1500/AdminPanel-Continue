import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';

export function useSiteYonetimiAksiyonlari(onizle?: () => void) {
  const { kaydet, kirli } = useSiteAyarlariYonetimi();

  useModulAksiyonlari(
    {
      kaydet,
      onizle: onizle ?? (() => window.open('/', '_blank')),
    },
    { kaydet: true, onizle: true }
  );

  return { kirli };
}
