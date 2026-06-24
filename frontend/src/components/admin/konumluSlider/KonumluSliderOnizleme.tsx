import type { Widget } from '@/types/site';
import type { KonumluSliderBolge, KonumluSliderKonumTipi } from '@/types/konumluSlider';
import { tipEtiketi } from '@/components/admin/widget/widgetRegistry';
import { yerlesimBolgeEtiketi } from '@/utils/widgetYerlesim';
import {
  sayfaOnizlemeOgeleri,
  secimNoktalariUyumlu,
  widgetBolgeSirasi,
  yanKonumMu,
  type KonumSecimNoktasi,
} from '@/utils/konumluSliderYerlesim';
import { bolgeEtiketi } from '@/components/admin/konumluSlider/KonumluSliderAyarlarPaneli';
import type { WidgetYerlesimBolge } from '@/types/widget';

interface KonumluSliderOnizlemeProps {
  widgetlar: Widget[];
  anaSayfaMi: boolean;
  secimler: KonumSecimNoktasi[];
  onSecimDegisti: (secimler: KonumSecimNoktasi[]) => void;
  hata?: string;
}

function noktaOlustur(
  tip: KonumluSliderKonumTipi,
  bolge: KonumluSliderBolge,
  widget: Widget | null,
  widgetlar: Widget[]
): KonumSecimNoktasi {
  return {
    tip,
    bolge,
    widgetId: widget?.id ?? null,
    widgetAd: widget ? widget.ad || tipEtiketi(widget.tip) : undefined,
    widgetSira: widget
      ? widgetBolgeSirasi(widgetlar, widget.id, bolge)
      : -1,
  };
}

function bolgeBaslik(bolge: KonumluSliderBolge | WidgetYerlesimBolge) {
  if (bolge === 'header' || bolge === 'footer') return bolgeEtiketi(bolge);
  return yerlesimBolgeEtiketi(bolge as WidgetYerlesimBolge);
}

export function KonumluSliderOnizleme({
  widgetlar,
  anaSayfaMi,
  secimler,
  onSecimDegisti,
  hata,
}: KonumluSliderOnizlemeProps) {
  const ogeler = sayfaOnizlemeOgeleri(widgetlar, anaSayfaMi);

  function tikla(nokta: KonumSecimNoktasi) {
    const mevcutIdx = secimler.findIndex(
      (s) =>
        s.tip === nokta.tip &&
        s.bolge === nokta.bolge &&
        s.widgetId === nokta.widgetId
    );

    if (mevcutIdx >= 0) {
      onSecimDegisti(secimler.filter((_, i) => i !== mevcutIdx));
      return;
    }

    if (!secimNoktalariUyumlu(secimler, nokta)) return;

    if (yanKonumMu(nokta.tip)) {
      onSecimDegisti([...secimler, nokta]);
      return;
    }

    onSecimDegisti([nokta]);
  }

  function seciliMi(tip: KonumluSliderKonumTipi, bolge: KonumluSliderBolge, widgetId: string | null) {
    return secimler.some(
      (s) => s.tip === tip && s.bolge === bolge && s.widgetId === widgetId
    );
  }

  function zoneSinif(aktif: boolean, taraf?: 'sol' | 'sag' | 'ust' | 'alt') {
    const parcalar = ['ks-oniz-zone'];
    if (aktif) parcalar.push('ks-oniz-zone--secili');
    if (taraf) parcalar.push(`ks-oniz-zone--${taraf}`);
    return parcalar.join(' ');
  }

  let sonBolge: string | null = null;

  return (
    <div className="ks-onizleme">
      <div className="ks-onizleme-baslik">
        <h3 className="text-sm font-semibold text-[var(--ap-text)]">Yerleşim önizlemesi</h3>
        <p className="text-xs text-[var(--ap-muted)]">
          Hedef bölgeyi tıklayın. Yan yerleşimde bitişik widgetları seçebilirsiniz; üst/alt için tek widget.
        </p>
      </div>

      {hata && <p className="ks-onizleme-hata">{hata}</p>}

      <div className="ks-onizleme-tuval">
        {ogeler.map((oge) => {
          const bolgeAyirici =
            oge.tip === 'widget' && oge.bolge !== sonBolge ? (
              (() => {
                sonBolge = oge.bolge;
                return (
                  <div key={`bolge-${oge.bolge}`} className="ks-oniz-bolge-etiket">
                    {bolgeBaslik(oge.bolge)}
                  </div>
                );
              })()
            ) : null;

          if (oge.tip === 'header') {
            return (
              <div key={oge.id} className="ks-oniz-blok ks-oniz-blok--header">
                <span className="ks-oniz-blok-etiket">Header</span>
                <div className="ks-oniz-header-zonlar">
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('header-ustu', 'header', null), 'ust')}
                    onClick={() => tikla(noktaOlustur('header-ustu', 'header', null, widgetlar))}
                  >
                    Üstüne slider
                  </button>
                  <div className="ks-oniz-header-govde">Site menüsü</div>
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('header-alti', 'header', null), 'alt')}
                    onClick={() => tikla(noktaOlustur('header-alti', 'header', null, widgetlar))}
                  >
                    Altına slider
                  </button>
                </div>
              </div>
            );
          }

          if (oge.tip === 'footer') {
            return (
              <div key={oge.id} className="ks-oniz-blok ks-oniz-blok--footer">
                <span className="ks-oniz-blok-etiket">Footer</span>
                <div className="ks-oniz-footer-zonlar">
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('footer-ustu', 'footer', null), 'ust')}
                    onClick={() => tikla(noktaOlustur('footer-ustu', 'footer', null, widgetlar))}
                  >
                    Üstüne slider
                  </button>
                  <div className="ks-oniz-footer-govde">Site alt bilgi</div>
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('footer-alti', 'footer', null), 'alt')}
                    onClick={() => tikla(noktaOlustur('footer-alti', 'footer', null, widgetlar))}
                  >
                    Altına slider
                  </button>
                </div>
              </div>
            );
          }

          const w = oge.widget!;
          const ad = w.ad?.trim() || tipEtiketi(w.tip);
          const bolge = oge.bolge;

          return (
            <div key={oge.id}>
              {bolgeAyirici}
              <div className="ks-oniz-widget-satir">
                <button
                  type="button"
                  className={zoneSinif(seciliMi('widget-sol', bolge, w.id), 'sol')}
                  onClick={() => tikla(noktaOlustur('widget-sol', bolge, w, widgetlar))}
                  title="Sol"
                >
                  Sol
                </button>

                <div className="ks-oniz-widget-orta">
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('widget-ustu', bolge, w.id), 'ust')}
                    onClick={() => tikla(noktaOlustur('widget-ustu', bolge, w, widgetlar))}
                  >
                    Üst
                  </button>
                  <div className="ks-oniz-widget-govde">
                    <span className="ks-oniz-widget-ad">{ad}</span>
                    <span className="ks-oniz-widget-tip">{tipEtiketi(w.tip)}</span>
                  </div>
                  <button
                    type="button"
                    className={zoneSinif(seciliMi('widget-alti', bolge, w.id), 'alt')}
                    onClick={() => tikla(noktaOlustur('widget-alti', bolge, w, widgetlar))}
                  >
                    Alt
                  </button>
                </div>

                <button
                  type="button"
                  className={zoneSinif(seciliMi('widget-sag', bolge, w.id), 'sag')}
                  onClick={() => tikla(noktaOlustur('widget-sag', bolge, w, widgetlar))}
                  title="Sağ"
                >
                  Sağ
                </button>
              </div>
            </div>
          );
        })}

        {ogeler.filter((o) => o.tip === 'widget').length === 0 && (
          <p className="ks-onizleme-bos">Bu sayfada henüz widget yok. Önce widget ekleyin.</p>
        )}
      </div>

      {secimler.length > 0 && (
        <div className="ks-oniz-secim-ozet">
          <span className="text-xs font-medium text-[var(--ap-muted)]">Seçim:</span>
          <div className="flex flex-wrap gap-2">
            {secimler.map((s, i) => (
              <span key={`${s.tip}-${s.widgetId}-${i}`} className="ks-oniz-secim-rozet">
                {s.widgetAd ? `${s.widgetAd} · ` : ''}
                {s.tip.replace('widget-', '').replace('header-', 'header ').replace('footer-', 'footer ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
