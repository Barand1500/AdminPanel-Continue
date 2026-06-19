import { HEADER_TIP_TANIMLARI, type HeaderTipi } from '@/data/headerTipleri';
import { HeaderTipWireframe } from './HeaderTipWireframe';
import { SiteHeaderOnizleme } from '@/components/admin/site/SiteOnizlemeBilesenleri';
import type { HeaderAyarlari } from '@/types/header';
import type { SiteAyarlari } from '@/types/site';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import { siteOnizlemeCssStili } from '@/utils/siteOnizlemeStili';

interface HeaderTipIcerikProps {
  secili: HeaderTipi;
  onSec: (tip: HeaderTipi) => void;
  siteAd: string;
  ayarlar?: SiteAyarlari | null;
  headerAyarlari: HeaderAyarlari;
  iletisim?: { telefon?: string | null; email?: string | null };
}

/** Header Tipi sekmesinin içeriği: kart grid + altında canlı önizleme */
export function HeaderTipIcerik({
  secili,
  onSec,
  siteAd,
  ayarlar,
  headerAyarlari,
  iletisim,
}: HeaderTipIcerikProps) {
  const seciliTanim = HEADER_TIP_TANIMLARI.find((t) => t.id === secili);

  return (
    <AdminPanelKarti
      baslik="Header Tipi Seçin"
      altBaslik={seciliTanim ? `${seciliTanim.ad} — ${seciliTanim.aciklama}` : 'Sitenizin üst bant düzenini belirleyin'}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {HEADER_TIP_TANIMLARI.map((tip) => {
          const aktif = secili === tip.id;
          return (
            <button
              key={tip.id}
              type="button"
              onClick={() => onSec(tip.id)}
              className={`rounded-xl border p-3 text-left transition ${
                aktif
                  ? 'border-[var(--ap-accent)] bg-[var(--ap-accent)]/10 ring-2 ring-[var(--ap-accent)]/40'
                  : 'border-[var(--ap-border)] hover:border-[var(--ap-accent)]/50 hover:bg-[var(--ap-hover)]'
              }`}
            >
              <div
                className={`mb-2 overflow-hidden rounded-lg border bg-[var(--ap-surface-elevated)] ${
                  aktif ? 'border-[var(--ap-accent)]/30' : 'border-[var(--ap-border)]'
                }`}
              >
                <HeaderTipWireframe tip={tip.id} />
              </div>
              <p className="ap-heading text-sm font-semibold">{tip.ad}</p>
              <p className="ap-muted mt-0.5 line-clamp-2 text-xs">{tip.aciklama}</p>
              <p className="mt-1 text-[10px] text-[var(--ap-accent)]">{tip.ilham}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[var(--ap-border)] pt-5">
        <p className="ap-heading mb-2 text-sm font-semibold">Önizleme</p>
        <div
          className="site-public overflow-hidden rounded-lg border border-[var(--ap-border)]"
          style={siteOnizlemeCssStili(ayarlar)}
        >
          <SiteHeaderOnizleme
            siteAdi={siteAd}
            ayarlar={ayarlar}
            headerAyarlari={headerAyarlari}
            iletisim={iletisim}
          />
        </div>
      </div>
    </AdminPanelKarti>
  );
}
