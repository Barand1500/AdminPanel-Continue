import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

interface IletisimCtaWidgetProps {
  widget: Widget;
}

export function IletisimCtaWidget({ widget }: IletisimCtaWidgetProps) {
  const cfg = configOkuFromWidget(widget);

  return (
    <WidgetKabuk widget={widget}>
      <div className="text-center">
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} font-bold`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mx-auto mt-3 max-w-2xl opacity-90">{widget.aciklama}</p>}
        {widget.butonMetni && widget.butonLink && (
          <Link
            to={widget.butonLink}
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            {widget.butonMetni}
          </Link>
        )}
      </div>
    </WidgetKabuk>
  );
}
