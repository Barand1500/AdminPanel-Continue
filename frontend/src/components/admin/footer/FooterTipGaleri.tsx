import { useMemo, useState, type MouseEvent } from 'react';
import { AdminAramaKutusu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { FOOTER_TIP_TANIMLARI, type FooterTipi } from '@/data/footerTipleri';
import { FooterTipWireframe } from './FooterTipWireframe';

const GALERI_KATEGORILER: { id: string; etiket: string; ids: FooterTipi[] | null }[] = [
  { id: 'tumu', etiket: 'Tümü', ids: null },
  { id: 'eticaret', etiket: 'E-ticaret', ids: ['klasik', 'magaza', 'detayli', 'cta-serit', 'split-vitrin'] },
  { id: 'kurumsal', etiket: 'Kurumsal', ids: ['kurumsal', 'newsletter', 'split', 'kartlar', 'masthead', 'cam-panel'] },
  { id: 'minimal', etiket: 'Minimal', ids: ['sade', 'merkezi', 'kompakt', 'sosyal-sahne', 'yuzen'] },
];

interface FooterTipGaleriProps {
  secili: FooterTipi;
  onSec: (tip: FooterTipi) => void;
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

export function FooterTipGaleri({ secili, onSec }: FooterTipGaleriProps) {
  const [arama, setArama] = useState('');
  const [kategori, setKategori] = useState('tumu');
  const [infoTip, setInfoTip] = useState<string | null>(null);

  const tipler = useMemo(() => {
    const kaynak = GALERI_KATEGORILER.find((k) => k.id === kategori)?.ids;
    let liste = FOOTER_TIP_TANIMLARI.filter((t) => !kaynak || kaynak.includes(t.id));
    const q = arama.toLowerCase().trim();
    if (q) {
      liste = liste.filter(
        (t) =>
          t.ad.toLowerCase().includes(q) ||
          t.aciklama.toLowerCase().includes(q) ||
          t.ilham.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [arama, kategori]);

  const seciliTanim = FOOTER_TIP_TANIMLARI.find((t) => t.id === secili);

  return (
    <div className="ap-editor-panel ap-widget-galeri">
      <div className="ap-widget-galeri-ust">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Sitenizin alt bilgisi nasıl görünsün?</h2>
          <p className="ap-muted text-xs">
            Kartlara bakın, beğendiğinizi seçin. Marka, kolon ve bantları bir sonraki adımda ayarlarsınız.
            {seciliTanim ? ` Şu an: ${seciliTanim.ad}.` : ''}
          </p>
        </div>
        <AdminAramaKutusu deger={arama} onChange={setArama} placeholder="Klasik, bülten, koyu..." />
      </div>

      <div className="ap-widget-galeri-govde">
        <div className="ap-form-filtre-piller ap-widget-galeri-piller" role="tablist" aria-label="Footer kategorileri">
          {GALERI_KATEGORILER.map((k) => (
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

        {tipler.length === 0 ? (
          <p className="ap-muted py-10 text-center text-sm">Bu aramada eşleşen footer tipi yok.</p>
        ) : (
          <div className="ap-widget-galeri-grid ap-header-galeri-grid">
            {tipler.map((tip) => {
              const aktif = secili === tip.id;
              return (
                <div
                  key={tip.id}
                  className={`ap-widget-galeri-kart${aktif ? ' ap-widget-galeri-kart--secili' : ''}${
                    infoTip === tip.id ? ' ap-widget-galeri-kart--info' : ''
                  }`}
                  onClick={() => onSec(tip.id)}
                >
                  <div className="ap-header-galeri-oniz">
                    <FooterTipWireframe tip={tip.id} />
                  </div>
                  <span className="ap-widget-galeri-ad-satir">
                    <span className="ap-widget-galeri-ad">{tip.ad}</span>
                    <button
                      type="button"
                      className={`ap-widget-galeri-info${infoTip === tip.id ? ' ap-widget-galeri-info--acik' : ''}`}
                      aria-label={`${tip.ad} nedir?`}
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
                  <span className="ap-widget-galeri-sec">
                    {aktif ? 'Seçili — ayarlara git' : 'Bu tipi seç'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
