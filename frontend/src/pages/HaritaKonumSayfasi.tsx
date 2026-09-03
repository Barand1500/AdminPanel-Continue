import { useOutletContext, useSearchParams } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import { haritaEmbedUrl, medyaUrl } from '@/components/widget/widgetHelpers';
import { kurumsalHeroConfigOku } from '@/types/kurumsalHero';

export function HaritaKonumSayfasi() {
  const { widgetlar } = useOutletContext<SitePublicData>();
  const [aramaParametreleri] = useSearchParams();
  const adres = aramaParametreleri.get('adres')?.trim() ?? '';
  const haritaUrl = aramaParametreleri.get('haritaUrl')?.trim() ?? adres;
  const lat = aramaParametreleri.get('lat');
  const lng = aramaParametreleri.get('lng');
  const zoomDegeri = Number(aramaParametreleri.get('zoom'));
  const harita = haritaEmbedUrl(haritaUrl, lat, lng, Number.isFinite(zoomDegeri) && zoomDegeri > 0 ? zoomDegeri : 14);
  const kurumsalHero = widgetlar.find((widget) => widget.tip === 'KURUMSAL_HERO' && widget.aktif);
  const heroAyar = kurumsalHero ? kurumsalHeroConfigOku(kurumsalHero.configJson) : null;
  const heroSlayt = heroAyar?.slaytlar.find((slayt) => slayt.aktif && slayt.arkaPlanUrl.trim());
  const heroGorsel = heroSlayt?.arkaPlanUrl ? medyaUrl(heroSlayt.arkaPlanUrl) : '';
  const overlayRenk = heroAyar?.gorunum.overlayRenk ?? '#123b8d';
  const overlayOpaklik = heroAyar?.gorunum.overlayOpaklik ?? 0.76;

  return (
    <div className="harita-konum-sayfa">
      <section className="kurumsal-hero kurumsal-hero--vetahsilat-yarim-kapak harita-konum-hero" style={{ minHeight: 'clamp(21rem, 34vw, 29rem)' }}>
        <div className="kurumsal-hero-sahne">
          {heroGorsel && <img src={heroGorsel} alt="" className="kurumsal-hero-arkaplan" />}
          <div
            className="kurumsal-hero-overlay"
            style={{ background: `linear-gradient(105deg, rgba(15, 23, 42, ${Math.min(0.92, overlayOpaklik + 0.12)}) 0%, ${overlayRenk}cc 58%, ${overlayRenk}99 100%)` }}
            aria-hidden
          />
          <div className="kurumsal-hero-icerik">
            <div className="container-site kurumsal-hero-icerik-grid">
              <div className="kurumsal-hero-metin">
                <p className="harita-konum-hero-etiket">İletişim / Konum</p>
                <h1 className="kurumsal-hero-baslik">Harita Üzerinde Yerimiz</h1>
                {adres && <p className="kurumsal-hero-aciklama">{adres}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="harita-konum-harita-bolum">
        <div className="container-site">
          <div className="harita-konum-harita-kart">
            {harita ? (
              <iframe
                title={adres ? `${adres} haritası` : 'Harita'}
                src={harita}
                className="harita-konum-iframe"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <p className="harita-konum-bos">Bu konum için harita bilgisi henüz girilmemiş.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
