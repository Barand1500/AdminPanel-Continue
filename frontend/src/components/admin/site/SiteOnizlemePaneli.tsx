import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import type { HeaderAyarlari } from '@/types/header';
import { SiteFooterOnizleme, SiteHeaderOnizleme } from './SiteOnizlemeBilesenleri';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { siteOnizlemeCssStili } from '@/utils/siteOnizlemeStili';

interface SiteOnizlemePaneliProps {
  tip: 'gorunum' | 'header' | 'footer';
  siteAd?: string;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
}

export function SiteOnizlemePaneli({ tip, siteAd, headerAyarlari, iletisim }: SiteOnizlemePaneliProps) {
  const { ayarlar, site, siteAd: ctxSiteAd, headerAyarlari: ctxHeader } = useSiteAyarlariYonetimi();
  const ad = siteAd ?? ctxSiteAd ?? site?.ad ?? 'Güzel Teknoloji';
  const header = headerAyarlari ?? ctxHeader;
  const onizlemeStili = siteOnizlemeCssStili(ayarlar);

  return (
    <AdminPanelKarti
      baslik="Canlı Önizleme"
      altBaslik="Form değişiklikleri anında yansır — Kaydet ile public site güncellenir"
    >
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
              <strong>{ayarlar?.ikincilRenk}</strong> · Font:{' '}
              <strong>{ayarlar?.font ?? 'Inter'}</strong>
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: ayarlar?.anaRenk ?? '#7c3aed' }}
            >
              Örnek Buton
            </button>
          </div>
        )}

        {(tip === 'footer' || tip === 'gorunum') && (
          <SiteFooterOnizleme siteAdi={ad} ayarlar={ayarlar} />
        )}
      </div>
    </AdminPanelKarti>
  );
}
