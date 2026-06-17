import { useEffect, useMemo, useState } from 'react';
import {
  tipKategori,
  WIDGET_TIPLERI,
  widgetTipleriKategoriyeGore,
  type WidgetTipKategoriId,
} from './widgetRegistry';

interface WidgetTipSeciciProps {
  seciliTip: string;
  onSec: (tip: string) => void;
}

export function WidgetTipSecici({ seciliTip, onSec }: WidgetTipSeciciProps) {
  const kategoriliTipler = useMemo(() => widgetTipleriKategoriyeGore(), []);
  const [aktifKategori, setAktifKategori] = useState<WidgetTipKategoriId>(() => tipKategori(seciliTip));

  useEffect(() => {
    setAktifKategori(tipKategori(seciliTip));
  }, [seciliTip]);

  const aktifGrup = kategoriliTipler.find((g) => g.kategori.id === aktifKategori) ?? kategoriliTipler[0];
  const seciliMeta = WIDGET_TIPLERI.find((t) => t.id === seciliTip);

  return (
    <div className="ap-widget-tip-secici">
      <div className="ap-widget-kategori-sekmeler" role="tablist" aria-label="Widget kategorileri">
        {kategoriliTipler.map(({ kategori }) => {
          const seciliKategoride = tipKategori(seciliTip) === kategori.id;
          return (
            <button
              key={kategori.id}
              type="button"
              role="tab"
              aria-selected={aktifKategori === kategori.id}
              className={`ap-widget-kategori-sekme ${aktifKategori === kategori.id ? 'ap-widget-kategori-sekme-aktif' : ''}`}
              onClick={() => setAktifKategori(kategori.id)}
            >
              <span>{kategori.etiket}</span>
              {seciliKategoride && <span className="ap-widget-kategori-sekme-nokta" aria-hidden />}
            </button>
          );
        })}
      </div>

      {seciliMeta && (
        <div className="ap-widget-secili-ozet">
          <span className="ap-widget-secili-ikon" aria-hidden>
            {seciliMeta.ikon}
          </span>
          <div className="min-w-0">
            <p className="ap-widget-secili-ad">Seçili: {seciliMeta.etiket}</p>
            <p className="ap-widget-secili-aciklama">{seciliMeta.aciklama}</p>
          </div>
        </div>
      )}

      {aktifGrup && (
        <>
          <p className="ap-widget-kategori-aciklama-ust">{aktifGrup.kategori.aciklama}</p>
          <div className="ap-widget-tip-grid">
            {aktifGrup.tipler.map((tip) => (
              <button
                key={tip.id}
                type="button"
                onClick={() => onSec(tip.id)}
                className={`ap-widget-tip-kart ${seciliTip === tip.id ? 'ap-widget-tip-kart-secili' : ''}`}
              >
                <span className="ap-widget-tip-ikon">{tip.ikon}</span>
                <span className="ap-widget-tip-ad">{tip.etiket}</span>
                <span className="ap-widget-tip-aciklama">{tip.aciklama}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
