import { useMemo } from 'react';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import type { HeaderAyarlari } from '@/types/header';
import { headerTipiNormalize } from '@/data/headerTipleri';
import { headerTipDemoPaketi } from '@/data/headerTipDemoVerisi';
import { SiteFooterOnizleme, SiteHeaderOnizleme } from './SiteOnizlemeBilesenleri';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { siteOnizlemeCssStili } from '@/utils/siteOnizlemeStili';

interface SiteOnizlemePaneliProps {
  tip: 'gorunum' | 'header' | 'footer';
  siteAd?: string;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
  /** Header yönetiminde tip bazlı sahte örnek verilerle önizleme */
  demoMod?: boolean;
}

export function SiteOnizlemePaneli({
  tip,
  siteAd,
  headerAyarlari,
  iletisim,
  demoMod = false,
}: SiteOnizlemePaneliProps) {
  const { ayarlar, site, siteAd: ctxSiteAd, headerAyarlari: ctxHeader } = useSiteAyarlariYonetimi();
  const ad = siteAd ?? ctxSiteAd ?? site?.ad ?? 'Güzel Teknoloji';
  const header = headerAyarlari ?? ctxHeader;
  const tipId = headerTipiNormalize(header?.headerTipi);
  const demo = headerTipDemoPaketi(tipId);

  const onizlemeStili = useMemo(() => {
    if (!demoMod || tip !== 'header') return siteOnizlemeCssStili(ayarlar);
    return siteOnizlemeCssStili({ ...ayarlar, anaRenk: demo.anaRenk, ikincilRenk: demo.ikincilRenk });
  }, [demoMod, tip, ayarlar, demo.anaRenk, demo.ikincilRenk]);

  return (
    <AdminPanelKarti
      baslik="Canlı Önizleme"
      altBaslik={
        demoMod && tip === 'header'
          ? `Örnek verilerle gösterim — ${demo.ornekNotu}. Kaydedince sitenizin gerçek içeriği görünür.`
          : 'Form değişiklikleri anında yansır — Kaydet ile public site güncellenir'
      }
    >
      {demoMod && tip === 'header' && (
        <div className="ap-onizleme-uyari mb-3">
          Bu önizleme sahte marka ve menü verileri kullanır ({demo.markaMetni}). Gerçek logo, menü ve iletişim bilgileriniz kayıttan sonra sitede görünür.
        </div>
      )}

      <div
        className={`site-public rounded-lg border border-[var(--ap-border)] ${
          tip === 'header' ? 'overflow-hidden' : 'ap-scroll max-h-[70vh] overflow-y-auto overflow-x-hidden'
        }`}
        style={onizlemeStili}
      >
        {(tip === 'header' || tip === 'gorunum') && (
          <SiteHeaderOnizleme
            siteAdi={ad}
            ayarlar={ayarlar}
            headerAyarlari={header}
            iletisim={iletisim}
            demoMod={demoMod}
          />
        )}

        {tip === 'gorunum' && (
          <div className="p-6" style={{ fontFamily: ayarlar?.font ?? 'Inter' }}>
            <div
              className="mb-3 h-2 w-24 rounded"
              style={{ backgroundColor: ayarlar?.anaRenk ?? '#7c3aed' }}
            />
            <p className="text-sm text-slate-600">
              Ana renk: <strong>{ayarlar?.anaRenk}</strong> · İkincil:{' '}
              <strong>{ayarlar?.ikincilRenk}</strong>
            </p>
          </div>
        )}

        {(tip === 'footer' || tip === 'gorunum') && (
          <SiteFooterOnizleme siteAdi={ad} ayarlar={ayarlar} />
        )}
      </div>
    </AdminPanelKarti>
  );
}
