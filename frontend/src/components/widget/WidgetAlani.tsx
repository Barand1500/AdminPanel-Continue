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
import { GaleriWidget } from './GaleriWidget';
import { SssWidget } from './SssWidget';
import { PopupWidget } from './PopupWidget';
import { configOkuFromWidget, widgetSectionClass, widgetSectionStyle } from './widgetHelpers';

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
      case 'HARITA': {
        const cfg = configOkuFromWidget(widget);
        const src = cfg.haritaUrl || (cfg.haritaLat && cfg.haritaLng
          ? `https://maps.google.com/maps?q=${cfg.haritaLat},${cfg.haritaLng}&z=${cfg.haritaZoom ?? 14}&output=embed`
          : '');
        if (!src) return null;
        return (
          <section className={widgetSectionClass(widget, 'py-8')} style={widgetSectionStyle(widget)}>
            <div className="container-site">
              <iframe title="Harita" src={src} className="h-80 w-full rounded-xl border-0" loading="lazy" />
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
