import type { ReactNode } from 'react';
import type { Widget } from '@/types/site';
import type { WidgetConfig } from '@/types/widget';
import { widgetTamEkranMi } from '@/types/widget';
import { configOkuFromWidget, widgetSectionClass, widgetSectionStyle } from './widgetHelpers';

export { configOkuFromWidget, widgetSectionClass, widgetSectionStyle, medyaUrl } from './widgetHelpers';

export function WidgetKabuk({ widget, children }: { widget: Widget; children: ReactNode }) {
  const cfg = configOkuFromWidget(widget);
  const id = cfg.ek?.bolumId;
  const sinif = cfg.ek?.ozelSinif;
  const tamEkran = widgetTamEkranMi(cfg);
  return (
    <section
      id={id || undefined}
      className={`${widgetSectionClass(widget, sinif)}${tamEkran ? ' widget-bolum-tam-ekran' : ''}`}
      style={widgetSectionStyle(widget)}
    >
      {tamEkran ? <div className="widget-icerik-tam-ekran w-full">{children}</div> : <div className="container-site">{children}</div>}
    </section>
  );
}

export function baslikSinifi(cfg: WidgetConfig) {
  const map = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl' };
  return map[cfg.gorunum?.baslikBoyutu ?? 'lg'];
}
