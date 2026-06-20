import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';
import {
  WIDGET_GORUNUM_TEMA_RENKLERI,
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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {tanimlar.map((t) => {
          const aktif = secili === t.id;
          const temaRenk = WIDGET_GORUNUM_TEMA_RENKLERI[t.tema];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => tipSec(t.id)}
              className={`rounded-xl border p-3 text-left transition ${
                aktif
                  ? 'ring-2 ring-offset-1 ring-offset-[var(--ap-surface)]'
                  : 'border-[var(--ap-border)] hover:bg-[var(--ap-hover)]'
              }`}
              style={{
                borderColor: aktif ? temaRenk.accent : undefined,
                background: aktif ? `${temaRenk.accent}12` : undefined,
                boxShadow: aktif ? `inset 0 0 0 1px ${temaRenk.accent}40` : undefined,
              }}
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
              <span
                className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: temaRenk.surface, color: temaRenk.accent, border: `1px solid ${temaRenk.accent}40` }}
              >
                {t.tema.charAt(0).toUpperCase() + t.tema.slice(1)} tema
              </span>
              {t.ilham && <p className="mt-1 text-[10px] opacity-70">{t.ilham}</p>}
            </button>
          );
        })}
      </div>
    </AdminPanelKarti>
  );
}
