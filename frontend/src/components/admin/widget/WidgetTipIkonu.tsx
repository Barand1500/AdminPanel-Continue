import {
  IconChartBar, IconFileText, IconLayout, IconLayoutGrid, IconMapPin, IconNews,
  IconPhoto, IconSlideshow, IconSparkles,
} from '@tabler/icons-react';
import { tipKategori } from './widgetRegistry';

export function WidgetTipIkonu({ tip, boyut = 20 }: { tip: string; boyut?: number }) {
  const kategori = tipKategori(tip);
  const Ikon = {
    slider: IconSlideshow,
    resim_metin: IconPhoto,
    metin: IconFileText,
    kart: IconLayoutGrid,
    karusel: IconLayoutGrid,
    resimli: IconPhoto,
    istatistik: IconChartBar,
    iletisim: IconMapPin,
    haber: IconNews,
    modern: IconSparkles,
    diger: IconLayout,
  }[kategori] ?? IconLayout;
  return <Ikon size={boyut} stroke={1.8} aria-hidden />;
}
