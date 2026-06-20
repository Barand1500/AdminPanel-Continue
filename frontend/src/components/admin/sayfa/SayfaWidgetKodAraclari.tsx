import { tipEtiketi, tipIkon } from '@/components/admin/widget/widgetRegistry';
import type { AdminWidget } from '@/types/admin';
import { idString } from '@/utils/idKarsilastir';
import {
  sayfaGomuluWidgetIdleri,
  sayfaWidgetStilBloguBul,
  sayfaWidgetStilBloguGuncelle,
  sayfaWidgetYerlestir,
} from '@/utils/sayfaWidgetKodu';

interface SayfaWidgetKodAraclariProps {
  widgetlar: AdminWidget[];
  icerik: string;
  onIcerikDegistir: (html: string) => void;
  onImlecKonumla?: (baslangic: number, bitis?: number) => void;
}

export function SayfaWidgetKodAraclari({
  widgetlar,
  icerik,
  onIcerikDegistir,
  onImlecKonumla,
}: SayfaWidgetKodAraclariProps) {
  if (widgetlar.length === 0) {
    return (
      <p className="ap-muted rounded-lg border border-dashed border-[var(--ap-border)] px-3 py-2 text-xs">
        Bu sayfaya bağlı widget yok. Widget Yönetimi&apos;nden sayfayı seçerek widget ekleyin.
      </p>
    );
  }

  const gomuluIdler = sayfaGomuluWidgetIdleri(icerik);

  return (
    <div className="ap-sayfa-widget-kod-panel">
      <p className="ap-muted mb-2 text-xs">
        Sayfadaki widget&apos;ları HTML içine yerleştirip CSS ile konumlandırın. Yerleştirilen widget
        üst/alt bölgede tekrar gösterilmez.
      </p>
      <div className="ap-sayfa-widget-kod-liste">
        {widgetlar.map((widget) => {
          const id = idString(widget.id);
          const ad = widget.ad || widget.baslik || tipEtiketi(widget.tip);
          const yerlestirildi = gomuluIdler.has(id);
          const stilVar = sayfaWidgetStilBloguBul(icerik, id) >= 0;

          return (
            <div key={id} className="ap-sayfa-widget-kod-kart">
              <div className="ap-sayfa-widget-kod-baslik">
                <span className="text-lg leading-none">{tipIkon(widget.tip)}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--ap-text)]">{ad}</p>
                  <p className="ap-muted truncate text-[10px]">{tipEtiketi(widget.tip)} · #{id}</p>
                </div>
                {yerlestirildi ? (
                  <span className="ap-sayfa-widget-kod-etiket ap-sayfa-widget-kod-etiket-yesil">HTML&apos;de</span>
                ) : (
                  <span className="ap-sayfa-widget-kod-etiket">Üst/alt bölge</span>
                )}
              </div>
              <div className="ap-sayfa-widget-kod-tuslar">
                <button
                  type="button"
                  className="ap-sayfa-widget-kod-tus"
                  onClick={() => onIcerikDegistir(sayfaWidgetYerlestir(icerik, id))}
                >
                  {yerlestirildi ? 'Yerleştirildi' : 'Sayfaya yerleştir'}
                </button>
                <button
                  type="button"
                  className={`ap-sayfa-widget-kod-tus ${stilVar ? 'ap-sayfa-widget-kod-tus-vurgu' : ''}`}
                  onClick={() => {
                    const guncel = sayfaWidgetStilBloguGuncelle(icerik, id, ad);
                    onIcerikDegistir(guncel);
                    const konum = sayfaWidgetStilBloguBul(guncel, id);
                    if (konum >= 0 && onImlecKonumla) {
                      const styleBas = guncel.indexOf('<style', konum);
                      const styleSon = guncel.indexOf('</style>', konum) + 8;
                      onImlecKonumla(styleBas > 0 ? styleBas : konum, styleSon > konum ? styleSon : undefined);
                    }
                  }}
                >
                  {stilVar ? 'CSS düzenle' : 'CSS ekle'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
