import { useState } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { Kategori } from '@/data/kategoriler';
import { useHeaderVeri } from './header/useHeaderVeri';
import { HeaderLayoutSec } from './header/HeaderLayouts';
import { useKurumsalHeroOverlay } from '@/contexts/KurumsalHeroOverlayContext';

interface SiteHeaderProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  menuOgeleri: MenuOgesi[];
  kategoriler?: Kategori[];
}

export function SiteHeader({ siteAdi, ayarlar, menuOgeleri, kategoriler }: SiteHeaderProps) {
  const [menuAcik, setMenuAcik] = useState(false);
  const veri = useHeaderVeri({ ayarlar, menuOgeleri, kategoriler, siteAdi });
  const overlay = useKurumsalHeroOverlay();

  return (
    <HeaderLayoutSec
      veri={veri}
      ayarlar={ayarlar}
      menuAcik={menuAcik}
      setMenuAcik={setMenuAcik}
      heroOverlay={overlay.active}
      ustBantGoster={overlay.active ? overlay.ustBantGoster : true}
    />
  );
}
