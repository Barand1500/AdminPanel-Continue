import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget, gorselSinifi, medyaUrl } from './widgetHelpers';

export function BaslikMetinGorselWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const duzen = cfg.gorunum?.icerikDuzeni ?? 'sol';
  const gorsel = widget.gorselUrl ? (
    <img src={medyaUrl(widget.gorselUrl)} alt="" className={gorselSinifi(cfg)} />
  ) : null;
  const metin = (
    <div>
      {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`} style={{ color: 'var(--widget-baslik-renk)' }}>{widget.baslik}</h2>}
      {cfg.metin && <p className="mt-4 whitespace-pre-line text-slate-600">{cfg.metin}</p>}
    </div>
  );
  const flexClass =
    duzen === 'ust' ? 'flex flex-col gap-6' :
    duzen === 'alt' ? 'flex flex-col-reverse gap-6' :
    duzen === 'sag' ? 'flex flex-col gap-6 md:flex-row-reverse md:items-center' :
    'flex flex-col gap-6 md:flex-row md:items-center';

  return (
    <WidgetKabuk widget={widget}>
      <div className={flexClass}>
        {gorsel && <div className="min-w-0 flex-1">{gorsel}</div>}
        <div className="min-w-0 flex-1">{metin}</div>
      </div>
    </WidgetKabuk>
  );
}
