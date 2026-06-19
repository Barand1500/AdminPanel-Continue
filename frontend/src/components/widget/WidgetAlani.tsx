import type { Widget } from '@/types/site';
import { SliderWidget } from './SliderWidget';
import { HizmetKartlariWidget } from './HizmetKartlariWidget';
import { ReferanslarWidget } from './ReferanslarWidget';
import { IletisimCtaWidget } from './IletisimCtaWidget';
import { BaslikMetinWidget } from './BaslikMetinWidget';
import { BaslikMetinGorselWidget } from './BaslikMetinGorselWidget';
import { BlogKaruselWidget } from './BlogKaruselWidget';
import { LinkKartlariWidget } from './LinkKartlariWidget';
import { GorselGridBlokWidget } from './GorselGridBlokWidget';
import { GorselEtiketKartlariWidget } from './GorselEtiketKartlariWidget';
import { EkipKaruselWidget } from './EkipKaruselWidget';
import { SayacBlokWidget } from './SayacBlokWidget';
import { YorumKaruselWidget } from './YorumKaruselWidget';
import { FiyatlandirmaWidget } from './FiyatlandirmaWidget';
import { GaleriWidget } from './GaleriWidget';
import { SssWidget } from './SssWidget';
import { PopupWidget } from './PopupWidget';
import { ZamanCizelgesiWidget } from './ZamanCizelgesiWidget';
import { SurecAdimlariWidget } from './SurecAdimlariWidget';
import { MarkaSeridiWidget } from './MarkaSeridiWidget';
import { KarsilastirmaTablosuWidget } from './KarsilastirmaTablosuWidget';
import { GeriSayimWidget } from './GeriSayimWidget';
import { VideoBannerWidget } from './VideoBannerWidget';
import { OncesiSonrasiWidget } from './OncesiSonrasiWidget';
import { BultenKayitWidget } from './BultenKayitWidget';
import {
  GuncelKonularWidget,
  HaberMagazinWidget,
  HavaDurumuWidget,
  IletisimBlokWidget,
  KategoriHaberListesiWidget,
  KategoriHaberOverlayWidget,
  KoseYazarlariWidget,
  KriptoListesiWidget,
  SirketGirisCikisWidget,
  SekmeliHaberWidget,
  VideoGalerisiWidget,
} from './haber/HaberPortalWidgetleri';
import { configOkuFromWidget, haritaEmbedUrl, widgetSectionClass, widgetSectionStyle } from './widgetHelpers';

interface WidgetRenderProps {
  widget: Widget;
  onizleme?: boolean;
}

export function WidgetRender({ widget, onizleme }: WidgetRenderProps) {
  if (!widget.aktif && !onizleme) return null;

  const inner = (() => {
    switch (widget.tip) {
      case 'SLIDER':
      case 'HERO_BANNER':
        return <SliderWidget widget={widget} />;
      case 'BASLIK_METIN':
        return <BaslikMetinWidget widget={widget} />;
      case 'BASLIK_METIN_GORSEL':
        return <BaslikMetinGorselWidget widget={widget} />;
      case 'BLOG_KARUSEL':
        return <BlogKaruselWidget widget={widget} />;
      case 'LINK_KARTLARI':
        return <LinkKartlariWidget widget={widget} />;
      case 'GORSEL_GRID_BLOK':
        return <GorselGridBlokWidget widget={widget} />;
      case 'GORSEL_ETIKET_KARTLARI':
        return <GorselEtiketKartlariWidget widget={widget} />;
      case 'EKIP_KARUSEL':
        return <EkipKaruselWidget widget={widget} />;
      case 'SAYAC_BLOK':
        return <SayacBlokWidget widget={widget} />;
      case 'YORUM_KARUSEL':
        return <YorumKaruselWidget widget={widget} />;
      case 'FIYATLANDIRMA':
        return <FiyatlandirmaWidget widget={widget} />;
      case 'GALERI':
        return <GaleriWidget widget={widget} />;
      case 'SSS':
        return <SssWidget widget={widget} />;
      case 'HIZMET_KARTLARI':
        return <HizmetKartlariWidget widget={widget} />;
      case 'REFERANSLAR':
        return <ReferanslarWidget widget={widget} />;
      case 'ILETISIM_FORMU':
        return <IletisimCtaWidget widget={widget} />;
      case 'POPUP':
        return <PopupWidget widget={widget} onizleme={onizleme} />;
      case 'ZAMAN_CIZELGESI':
        return <ZamanCizelgesiWidget widget={widget} />;
      case 'SUREC_ADIMLARI':
        return <SurecAdimlariWidget widget={widget} />;
      case 'MARKA_SERIDI':
        return <MarkaSeridiWidget widget={widget} />;
      case 'KARSILASTIRMA_TABLOSU':
        return <KarsilastirmaTablosuWidget widget={widget} />;
      case 'GERI_SAYIM':
        return <GeriSayimWidget widget={widget} />;
      case 'VIDEO_BANNER':
        return <VideoBannerWidget widget={widget} />;
      case 'ONCESI_SONRASI':
        return <OncesiSonrasiWidget widget={widget} />;
      case 'BULTEN_KAYIT':
        return <BultenKayitWidget widget={widget} />;
      case 'KOSE_YAZARLARI':
        return <KoseYazarlariWidget widget={widget} />;
      case 'ILETISIM_BLOK':
        return <IletisimBlokWidget widget={widget} />;
      case 'KATEGORI_HABER_LISTESI':
        return <KategoriHaberListesiWidget widget={widget} />;
      case 'KATEGORI_HABER_OVERLAY':
        return <KategoriHaberOverlayWidget widget={widget} />;
      case 'VIDEO_GALERISI':
        return <VideoGalerisiWidget widget={widget} />;
      case 'SEKMELI_HABER':
        return <SekmeliHaberWidget widget={widget} />;
      case 'HAVA_DURUMU':
        return <HavaDurumuWidget widget={widget} />;
      case 'KRIPTO_LISTESI':
        return <KriptoListesiWidget widget={widget} />;
      case 'GUNCEL_KONULAR':
        return <GuncelKonularWidget widget={widget} />;
      case 'SIRKET_GIRIS_CIKIS':
        return <SirketGirisCikisWidget widget={widget} />;
      case 'HABER_MAGAZIN':
        return <HaberMagazinWidget widget={widget} />;
      case 'HARITA': {
        const cfg = configOkuFromWidget(widget);
        const src = haritaEmbedUrl(cfg.haritaUrl, cfg.haritaLat, cfg.haritaLng, cfg.haritaZoom ?? 14);
        if (!src) return null;
        return (
          <section className={widgetSectionClass(widget, 'py-8')} style={widgetSectionStyle(widget)}>
            <div className="container-site">
              <iframe title="Harita" src={src} className="h-80 w-full rounded-xl border-0" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>
        );
      }
      case 'KATEGORI': {
        const cfg = configOkuFromWidget(widget);
        const kategoriler = cfg.kategoriler ?? [];
        return (
          <section className={widgetSectionClass(widget, 'py-12')} style={widgetSectionStyle(widget)}>
            <div className="container-site">
              {widget.baslik && <h2 className="section-title mb-6">{widget.baslik}</h2>}
              <div className="flex flex-wrap gap-3">
                {kategoriler.map((k) => (
                  <a key={k.id} href={k.link || '#'} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary">
                    {k.ikon} {k.metin}
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      }
      default:
        return null;
    }
  })();

  return inner;
}

interface WidgetAlaniProps {
  widgetlar: Widget[];
}

export function WidgetAlani({ widgetlar }: WidgetAlaniProps) {
  const sirali = [...widgetlar].sort((a, b) => a.sira - b.sira);

  return (
    <>
      {sirali.map((widget) => (
        <WidgetRender key={widget.id} widget={widget} />
      ))}
    </>
  );
}
