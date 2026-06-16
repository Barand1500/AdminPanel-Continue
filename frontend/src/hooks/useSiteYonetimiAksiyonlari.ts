import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';

export function useSiteYonetimiAksiyonlari() {
  const { kaydet, kirli } = useSiteAyarlariYonetimi();

  useModulAksiyonlari(
    {
      kaydet,
      onizle: () => window.open('/', '_blank'),
    },
    { kaydet: true, onizle: true }
  );

  return { kirli };
}
