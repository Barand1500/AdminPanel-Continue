import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

export function BaslikMetinWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const hizalama = cfg.gorunum?.hizalama ?? 'sol';
  const alignClass = hizalama === 'orta' ? 'text-center' : hizalama === 'sag' ? 'text-right' : 'text-left';
  return (
    <WidgetKabuk widget={widget}>
      <div className={alignClass}>
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: 'var(--widget-baslik-renk)' }}>{widget.baslik}</h2>}
        {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
      </div>
    </WidgetKabuk>
  );
}
