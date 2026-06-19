import { FOOTER_TIP_TANIMLARI, type FooterTipi } from '@/data/footerTipleri';
import { FooterTipWireframe } from './FooterTipWireframe';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface FooterTipIcerikProps {
  secili: FooterTipi;
  onSec: (tip: FooterTipi) => void;
}

/** Footer Tipi sekmesi — yalnızca tip kartları (önizleme altta Canlı Önizleme'de) */
export function FooterTipIcerik({ secili, onSec }: FooterTipIcerikProps) {
  const seciliTanim = FOOTER_TIP_TANIMLARI.find((t) => t.id === secili);

  return (
    <AdminPanelKarti
      baslik="Footer Tipi Seçin"
      altBaslik={
        seciliTanim
          ? `${seciliTanim.ad} — ${seciliTanim.aciklama}`
          : 'Sitenizin alt bant düzenini belirleyin'
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {FOOTER_TIP_TANIMLARI.map((tip) => {
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
                <FooterTipWireframe tip={tip.id} />
              </div>
              <p className="ap-heading text-sm font-semibold">{tip.ad}</p>
              <p className="ap-muted mt-0.5 line-clamp-2 text-xs">{tip.aciklama}</p>
              <p className="mt-1 text-[10px] text-[var(--ap-accent)]">{tip.ilham}</p>
            </button>
          );
        })}
      </div>
    </AdminPanelKarti>
  );
}
