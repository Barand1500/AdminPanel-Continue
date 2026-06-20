import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import {
  widgetGorunumTipTanimiBul,
  widgetGorunumTipleriBul,
} from '@/data/widgetGorunumTipleri';
import { configGuncelle, configOku } from '@/types/widget';
import type { WidgetGorunumPanelProps } from '../panels/types';
import { WidgetGorunumTipWireframe } from './WidgetGorunumTipWireframe';

export function WidgetGorunumTipSecici({ form, onChange }: WidgetGorunumPanelProps) {
  const widgetTip = form.tip;
  const tanimlar = widgetGorunumTipleriBul(widgetTip);
  const cfg = configOku(form);
  const secili = cfg.gorunum?.gorunumTipi ?? tanimlar[0]?.id ?? 'klasik';
  const seciliTanim = widgetGorunumTipTanimiBul(widgetTip, secili);

  function tipSec(gorunumTipi: string) {
    onChange(
      configGuncelle(form, (c) => ({
        ...c,
        gorunum: { ...c.gorunum, gorunumTipi },
      }))
    );
  }

  return (
    <AdminPanelKarti
      baslik="Widget Görünüm Tipi"
      altBaslik={
        seciliTanim
          ? `${seciliTanim.ad} — ${seciliTanim.aciklama}`
          : 'Bu widget için layout stilini seçin'
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {tanimlar.map((t) => {
          const aktif = secili === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => tipSec(t.id)}
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
                <WidgetGorunumTipWireframe widgetTip={widgetTip} gorunumTipi={t.id} />
              </div>
              <p className="ap-heading text-sm font-semibold">{t.ad}</p>
              <p className="ap-muted mt-0.5 line-clamp-2 text-xs">{t.aciklama}</p>
              {t.ilham && <p className="mt-1 text-[10px] text-[var(--ap-accent)]">{t.ilham}</p>}
            </button>
          );
        })}
      </div>
    </AdminPanelKarti>
  );
}
