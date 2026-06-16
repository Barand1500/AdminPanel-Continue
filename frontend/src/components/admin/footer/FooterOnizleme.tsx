import type { CSSProperties } from 'react';
import type { SiteAyarlari } from '@/types/site';
import type { FooterAyarlari } from '@/types/footer';
import { SiteFooter } from '@/components/ortak/SiteFooter';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface FooterOnizlemeProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  footer: FooterAyarlari;
}

export function FooterOnizleme({ siteAdi, ayarlar, footer }: FooterOnizlemeProps) {
  const onizlemeAyarlar: SiteAyarlari = {
    ...(ayarlar ?? {}),
    footerAyarlariJson: footer,
  };

  const onizlemeStili = {
    '--color-primary': ayarlar?.anaRenk ?? '#7c3aed',
    '--color-primary-light': ayarlar?.ikincilRenk ?? '#a78bfa',
    '--color-primary-dark': ayarlar?.anaRenk ?? '#7c3aed',
    '--color-accent': `${ayarlar?.ikincilRenk ?? '#a78bfa'}22`,
    fontFamily: ayarlar?.font ?? 'Inter',
  } as CSSProperties;

  return (
    <div className="xl:sticky xl:top-4">
      <AdminPanelKarti baslik="Önizleme" altBaslik="Footer düzeni ve içerik canlı yansır">
        <div
          className="site-public ap-scroll max-h-[75vh] overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--ap-border)]"
          style={onizlemeStili}
        >
          <SiteFooter siteAdi={siteAdi} ayarlar={onizlemeAyarlar} />
        </div>
      </AdminPanelKarti>
    </div>
  );
}
