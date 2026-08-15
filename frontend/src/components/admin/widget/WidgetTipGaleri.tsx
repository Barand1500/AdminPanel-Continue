import { useMemo, useState, type MouseEvent } from 'react';
import { AdminAramaKutusu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { WidgetGaleriOnizleme } from './WidgetGaleriOnizleme';
import {
  WIDGET_TIPLERI,
  widgetTipleriKategoriyeGore,
  type WidgetTipKategoriId,
  type WidgetTipMeta,
} from './widgetRegistry';

const GALERI_KATEGORILER: { id: string; etiket: string; kaynak: WidgetTipKategoriId[] | null }[] = [
  { id: 'tumu', etiket: 'Tümü', kaynak: null },
  { id: 'banner', etiket: 'Banner', kaynak: ['slider'] },
  { id: 'metin', etiket: 'Metin', kaynak: ['metin', 'resim_metin'] },
  { id: 'kartlar', etiket: 'Kartlar', kaynak: ['kart'] },
  { id: 'karusel', etiket: 'Karusel', kaynak: ['karusel'] },
  { id: 'galeri', etiket: 'Galeri', kaynak: ['resimli'] },
  { id: 'iletisim', etiket: 'İletişim', kaynak: ['iletisim'] },
  { id: 'haber', etiket: 'Haber', kaynak: ['haber'] },
  { id: 'diger', etiket: 'Diğer', kaynak: ['diger', 'istatistik', 'modern'] },
];

const ONERILEN_SIRALAMA = [
  'SLIDER',
  'KURUMSAL_HERO',
  'SITE_HAKKINDA',
  'HIZMET_KARTLARI',
  'BASLIK_METIN_GORSEL',
  'BASLIK_METIN',
  'GALERI',
  'GORSEL_ETIKET_KARTLARI',
  'SSS',
  'EKIP_KARUSEL',
  'YORUM_KARTLARI',
  'SAYAC_BLOK',
  'FIYATLANDIRMA',
  'ILETISIM_FORMU',
  'HARITA',
  'BLOG_KARUSEL',
  'MARKA_SERIDI',
];

interface WidgetTipGaleriProps {
  tipFiltre?: string;
  onSec: (tip: string) => void;
}

function InfoIkon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.2V16.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function tipSirala(tipler: WidgetTipMeta[]) {
  return [...tipler].sort((a, b) => {
    const ia = ONERILEN_SIRALAMA.indexOf(a.id);
    const ib = ONERILEN_SIRALAMA.indexOf(b.id);
    if (ia === -1 && ib === -1) return a.etiket.localeCompare(b.etiket, 'tr');
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function WidgetTipGaleri({ tipFiltre, onSec }: WidgetTipGaleriProps) {
  const [arama, setArama] = useState('');
  const [kategori, setKategori] = useState('tumu');
  const [infoTip, setInfoTip] = useState<string | null>(null);

  const kategorili = useMemo(() => widgetTipleriKategoriyeGore(tipFiltre), [tipFiltre]);

  const tipler = useMemo(() => {
    const kaynak = GALERI_KATEGORILER.find((k) => k.id === kategori)?.kaynak;
    let liste: WidgetTipMeta[];
    if (!kaynak) {
      liste = WIDGET_TIPLERI.filter((t) => !tipFiltre || t.id === tipFiltre);
    } else {
      liste = kategorili
        .filter((g) => kaynak.includes(g.kategori.id))
        .flatMap((g) => g.tipler);
    }
    const q = arama.toLowerCase().trim();
    if (q) {
      liste = liste.filter(
        (t) =>
          t.etiket.toLowerCase().includes(q) ||
          t.aciklama.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return tipSirala(liste).filter((t) => t.id !== 'BLOK_OLUSTURUCU');
  }, [arama, kategori, kategorili, tipFiltre]);

  const gorunenKategoriler = tipFiltre
    ? GALERI_KATEGORILER.filter((k) => k.id === 'tumu')
    : GALERI_KATEGORILER;

  return (
    <div className="ap-editor-panel ap-widget-galeri">
      <div className="ap-widget-galeri-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Nasıl bir blok eklemek istiyorsunuz?</h2>
          <p className="ap-muted text-xs">Kartlara bakın, beğendiğinizi seçin. İçeriği bir sonraki adımda doldurursunuz.</p>
        </div>
        <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Slider, hizmet, galeri..." />
      </div>

      <div className="ap-widget-galeri-govde">
        <div className="ap-form-filtre-piller ap-widget-galeri-piller" role="tablist" aria-label="Widget kategorileri">
          {gorunenKategoriler.map((k) => (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={kategori === k.id}
              className={`ap-form-filtre-pil${kategori === k.id ? ' ap-form-filtre-pil--aktif' : ''}`}
              onClick={() => setKategori(k.id)}
            >
              {k.etiket}
            </button>
          ))}
        </div>

        {(!tipFiltre || tipFiltre === 'BLOK_OLUSTURUCU') && (
          <p className="ap-widget-galeri-ozel">
            Aradığınızı burada bulamadınız mı? Kendiniz oluşturun:{' '}
            <button type="button" className="ap-widget-galeri-ozel-ad" onClick={() => onSec('BLOK_OLUSTURUCU')}>
              Özel Grid Widget
            </button>
          </p>
        )}

        {tipler.length === 0 ? (
          <p className="ap-muted py-10 text-center text-sm">Bu aramada eşleşen widget yok.</p>
        ) : (
          <div className="ap-widget-galeri-grid">
            {tipler.map((tip) => (
              <div
                key={tip.id}
                className={`ap-widget-galeri-kart${infoTip === tip.id ? ' ap-widget-galeri-kart--info' : ''}`}
                onClick={() => onSec(tip.id)}
              >
                <WidgetGaleriOnizleme tip={tip.id} etiket={tip.etiket} />
                <span className="ap-widget-galeri-ad-satir">
                  <span className="ap-widget-galeri-ad">
                    <span aria-hidden>{tip.ikon}</span>
                    {tip.etiket}
                  </span>
                  <button
                    type="button"
                    className={`ap-widget-galeri-info${infoTip === tip.id ? ' ap-widget-galeri-info--acik' : ''}`}
                    aria-label={`${tip.etiket} nedir?`}
                    aria-expanded={infoTip === tip.id}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setInfoTip((onceki) => (onceki === tip.id ? null : tip.id));
                    }}
                  >
                    <InfoIkon />
                    <span className="ap-widget-galeri-info-kutu" role="tooltip">
                      {tip.aciklama}
                    </span>
                  </button>
                </span>
                <span className="ap-widget-galeri-sec">Bu tipi seç</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
