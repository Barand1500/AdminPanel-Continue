import { useMemo, useState } from 'react';
import { AdminAramaKutusu } from '@/components/admin/ortak/AdminFormBilesenleri';
import { GaleriKartAksiyonlar, GaleriOnizlemeKabugu } from '@/components/admin/ortak/GaleriKartAksiyonlar';
import { FOOTER_TIP_TANIMLARI, varsayilanFooterTipEk, type FooterTipi } from '@/data/footerTipleri';
import { varsayilanFooterAyarlari } from '@/types/footer';
import { FooterOnizleme } from './FooterOnizleme';
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

export function FooterTipGaleri({ secili, onSec }: FooterTipGaleriProps) {
  const [arama, setArama] = useState('');
  const [kategori, setKategori] = useState('tumu');
  const [infoTip, setInfoTip] = useState<string | null>(null);
  const [onizlemeTip, setOnizlemeTip] = useState<FooterTipi | null>(null);

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
                    <GaleriKartAksiyonlar
                      ad={tip.ad}
                      aciklama={tip.aciklama}
                      infoAcik={infoTip === tip.id}
                      onInfo={() => setInfoTip((onceki) => (onceki === tip.id ? null : tip.id))}
                      onOnizle={() => setOnizlemeTip(tip.id)}
                    />
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

      <GaleriOnizlemeKabugu
        acik={Boolean(onizlemeTip)}
        baslik="Footer önizleme"
        alt={`${FOOTER_TIP_TANIMLARI.find((t) => t.id === onizlemeTip)?.ad ?? ''} · örnek verilerle tip görünümü`}
        modalSinif="ap-header-oniz-modal ap-footer-oniz-modal"
        onKapat={() => setOnizlemeTip(null)}
      >
        {onizlemeTip && (
          <FooterOnizleme
            siteAdi="Örnek Site"
            footer={{
              ...varsayilanFooterAyarlari(),
              footerTipi: onizlemeTip,
              tipEk: varsayilanFooterTipEk(onizlemeTip),
            }}
            buyuk
            kabuksuz
            demoMod
          />
        )}
      </GaleriOnizlemeKabugu>
    </div>
  );
}
