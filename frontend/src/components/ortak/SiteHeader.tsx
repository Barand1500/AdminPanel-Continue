import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { Kategori } from '@/data/kategoriler';
import { useHeaderVeri } from './header/useHeaderVeri';
import { HeaderLayoutSec } from './header/HeaderLayouts';

interface SiteHeaderProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  menuOgeleri: MenuOgesi[];
  kategoriler?: Kategori[];
}

export function SiteHeader({ siteAdi: _siteAdi, ayarlar, menuOgeleri, kategoriler }: SiteHeaderProps) {
  const veri = useHeaderVeri(ayarlar, menuOgeleri, kategoriler);

  return (
    <HeaderLayoutSec
      tip={veri.tip}
      veri={veri}
      ayarlar={ayarlar}
      menuOgeleri={menuOgeleri}
      kategoriler={kategoriler}
    />
  );
}
