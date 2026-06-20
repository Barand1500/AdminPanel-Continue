import type { Widget } from '@/types/site';
import type { WidgetConfig, WidgetMarkaLogosu } from '@/types/widget';
import { widgetTamEkranMi } from '@/types/widget';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, medyaUrl } from './widgetHelpers';

const HIZ_SINIF: Record<string, string> = {
  yavas: 'marka-seridi-iz-yavas',
  normal: 'marka-seridi-iz-normal',
  hizli: 'marka-seridi-iz-hizli',
};

function BaslikAlani({ widget, cfg, tamEkran }: { widget: Widget; cfg: WidgetConfig; tamEkran: boolean }) {
  if (!widget.baslik && !widget.altBaslik) return null;
  return (
    <div className={`mb-10 text-center${tamEkran ? ' container-site' : ''}`}>
      {widget.altBaslik && (
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{widget.altBaslik}</p>
      )}
      {widget.baslik && (
        <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>
      )}
    </div>
  );
}

function LogoKayan({ widget, cfg, markalar }: { widget: Widget; cfg: WidgetConfig; markalar: WidgetMarkaLogosu[] }) {
  const hiz = HIZ_SINIF[cfg.markaHizi ?? 'normal'] ?? HIZ_SINIF.normal;
  const tamEkran = widgetTamEkranMi(cfg);
  const serit = [...markalar, ...markalar];

  return (
    <>
      <BaslikAlani widget={widget} cfg={cfg} tamEkran={tamEkran} />
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
            const icerik = m.gorselUrl ? (
              <img src={medyaUrl(m.gorselUrl)} alt={m.ad} className="marka-seridi-logo" loading="lazy" />
            ) : (
              <span className="marka-seridi-metin">{m.ad}</span>
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
    </>
  );
}

function EgikMetinSeridi({ widget, cfg, markalar }: { widget: Widget; cfg: WidgetConfig; markalar: WidgetMarkaLogosu[] }) {
  const hiz = HIZ_SINIF[cfg.markaHizi ?? 'normal'] ?? HIZ_SINIF.normal;
  const serit = [...markalar, ...markalar, ...markalar];
  const vurgu = widget.arkaPlanRenk || '#f97316';

  return (
    <div className="marka-seridi-egik-wrap overflow-hidden py-4">
      <div className="marka-seridi-egik-band" style={{ backgroundColor: vurgu }}>
        <div className={`marka-seridi-egik-iz ${hiz}`}>
          {serit.map((m, i) => (
            <span key={`${m.id}-${i}`} className="marka-seridi-egik-oge">
              <span className="marka-seridi-egik-metin">{m.ad}</span>
              <span className="marka-seridi-egik-ayirici" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function IstatistikKapsul({ widget, cfg, markalar }: { widget: Widget; cfg: WidgetConfig; markalar: WidgetMarkaLogosu[] }) {
  return (
    <div className="marka-seridi-istatistik-wrap py-6">
      <div className="marka-seridi-istatistik-satir">
        {widget.baslik && (
          <div className="marka-seridi-istatistik-baslik-alan">
            {widget.altBaslik && (
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{widget.altBaslik}</p>
            )}
            <h2 className={`${baslikSinifi(cfg)} font-bold text-slate-900`}>{widget.baslik}</h2>
          </div>
        )}
        <div className="marka-seridi-istatistik-kapsul">
          {markalar.map((m) => (
            <div key={m.id} className="marka-seridi-istatistik-oge">
              <div className="marka-seridi-istatistik-deger-satir">
                <span className="marka-seridi-istatistik-deger">
                  {m.deger ?? m.ad}
                  {m.sonEk && <span className="marka-seridi-istatistik-ek">{m.sonEk}</span>}
                </span>
                {m.trend && <span className="marka-seridi-istatistik-trend">{m.trend}</span>}
              </div>
              <span className="marka-seridi-istatistik-etiket">{m.gorselUrl ? m.ad : m.ad}</span>
              {m.durumEtiketi && (
                <span className="marka-seridi-istatistik-durum">{m.durumEtiketi}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NeonGeceSeridi({ markalar }: { markalar: WidgetMarkaLogosu[] }) {
  const hiz = HIZ_SINIF.normal;
  const serit = [...markalar, ...markalar, ...markalar];
  return (
    <div className="marka-seridi-neon overflow-hidden py-5">
      <div className={`marka-seridi-neon-iz ${hiz}`}>
        {serit.map((m, i) => (
          <span key={`${m.id}-${i}`} className="marka-seridi-neon-oge">
            {m.ad}
            <span className="marka-seridi-neon-nokta">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DalgaMorSeridi({ markalar }: { markalar: WidgetMarkaLogosu[] }) {
  const hiz = HIZ_SINIF.normal;
  const serit = [...markalar, ...markalar];
  return (
    <div className="marka-seridi-dalga overflow-hidden py-6">
      <div className={`marka-seridi-dalga-iz ${hiz}`}>
        {serit.map((m, i) => (
          <span key={`${m.id}-${i}`} className="marka-seridi-dalga-oge">
            {m.ad}
            <span aria-hidden>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CiftSerit({ markalar }: { markalar: WidgetMarkaLogosu[] }) {
  const hiz = HIZ_SINIF.normal;
  const serit = [...markalar, ...markalar];
  return (
    <div className="marka-seridi-cift space-y-3 py-4">
      <div className={`marka-seridi-cift-iz marka-seridi-cift-ileri ${hiz}`}>
        {serit.map((m, i) => (
          <span key={`a-${m.id}-${i}`} className="marka-seridi-cift-oge">{m.ad}</span>
        ))}
      </div>
      <div className={`marka-seridi-cift-iz marka-seridi-cift-geri ${hiz}`}>
        {serit.map((m, i) => (
          <span key={`b-${m.id}-${i}`} className="marka-seridi-cift-oge marka-seridi-cift-oge-alt">{m.ad}</span>
        ))}
      </div>
    </div>
  );
}

export function MarkaSeridiWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const markalar = cfg.markalar ?? [];
  if (markalar.length === 0) return null;

  const gt = widgetGorunumTipiAl(widget);

  return (
    <WidgetKabuk widget={widget}>
      {gt === 'egik-metin-seridi' && <EgikMetinSeridi widget={widget} cfg={cfg} markalar={markalar} />}
      {gt === 'istatistik-kapsul' && <IstatistikKapsul widget={widget} cfg={cfg} markalar={markalar} />}
      {gt === 'neon-gece' && <NeonGeceSeridi markalar={markalar} />}
      {gt === 'dalga-mor' && <DalgaMorSeridi markalar={markalar} />}
      {gt === 'cift-serit' && <CiftSerit markalar={markalar} />}
      {gt === 'logo-kayan' && <LogoKayan widget={widget} cfg={cfg} markalar={markalar} />}
    </WidgetKabuk>
  );
}
