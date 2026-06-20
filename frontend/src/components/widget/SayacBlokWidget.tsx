import type { Widget } from '@/types/site';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';
import { sayacDegerGoster } from '@/utils/sayacYardimci';

export function SayacBlokWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const sayaclar = cfg.sayaclar ?? [];
  const adet = Math.min(Math.max(sayaclar.length, 1), 4);

  if (sayaclar.length === 0) return null;

  return (
    <WidgetKabuk widget={widget}>
      {(widget.baslik || widget.altBaslik) && (
        <div className="mb-8 text-center sm:mb-10">
          {widget.altBaslik && (
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{widget.altBaslik}</p>
          )}
          {widget.baslik && (
            <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold text-slate-900`}>{widget.baslik}</h2>
          )}
        </div>
      )}
      <div className="sayac-blok-serit">
        <ul className={`sayac-blok-liste sayac-blok-liste-${adet}`}>
          {sayaclar.map((s) => (
            <li key={s.id} className="sayac-blok-hucre">
              <div className="sayac-blok-kart">
                {s.ikon?.trim() ? (
                  <span className="sayac-blok-ikon" aria-hidden>
                    {s.ikon}
                  </span>
                ) : null}
                <p className="sayac-blok-deger">
                  {sayacDegerGoster(s.deger)}
                  {s.sonEk}
                </p>
                {s.etiket?.trim() ? <p className="sayac-blok-etiket">{s.etiket}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </WidgetKabuk>
  );
}
