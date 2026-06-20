import type { Widget } from '@/types/site';
import { widgetTamEkranMi } from '@/types/widget';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

const HIZ_SINIF: Record<string, string> = {
  yavas: 'marka-seridi-iz-yavas',
  normal: 'marka-seridi-iz-normal',
  hizli: 'marka-seridi-iz-hizli',
};

export function MarkaSeridiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const markalar = cfg.markalar ?? [];
  if (markalar.length === 0) return null;

  const hiz = HIZ_SINIF[cfg.markaHizi ?? 'normal'] ?? HIZ_SINIF.normal;
  const tamEkran = widgetTamEkranMi(cfg);
  const serit = [...markalar, ...markalar];

  const baslikAlani =
    widget.baslik || widget.altBaslik ? (
      <div className={`mb-10 text-center${tamEkran ? ' container-site' : ''}`}>
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-widest text-primary">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>}
      </div>
    ) : null;

  return (
    <WidgetKabuk widget={widget}>
      {baslikAlani}
      <div
        className={`marka-seridi-kapsul relative overflow-hidden py-8 ${
          tamEkran
            ? 'marka-seridi-kapsul-tam border-y border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50'
            : 'rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50'
        }`}
      >
        <div className="marka-seridi-soluk marka-seridi-soluk-sol" aria-hidden />
        <div className="marka-seridi-soluk marka-seridi-soluk-sag" aria-hidden />
        <div className={`marka-seridi-iz ${hiz}`}>
          {serit.map((m, i) => {
            const icerik = (
              <>
                {m.gorselUrl ? (
                  <img src={medyaUrl(m.gorselUrl)} alt={m.ad} className="marka-seridi-logo" loading="lazy" />
                ) : (
                  <span className="marka-seridi-metin">{m.ad}</span>
                )}
              </>
            );
            return m.link ? (
              <a key={`${m.id}-${i}`} href={m.link} className="marka-seridi-oge" target="_blank" rel="noopener noreferrer">
                {icerik}
              </a>
            ) : (
              <div key={`${m.id}-${i}`} className="marka-seridi-oge">
                {icerik}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetKabuk>
  );
}
