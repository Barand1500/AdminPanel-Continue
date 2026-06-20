import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
import { widgetGorunumTipiAl } from '@/utils/widgetGorunumYardimci';
import { WidgetKabuk, baslikSinifi } from './widgetKabuk';
import { configOkuFromWidget } from './widgetHelpers';

function kalanHesapla(bitis: string) {
  const hedef = new Date(bitis).getTime();
  const simdi = Date.now();
  const fark = Math.max(0, hedef - simdi);
  return {
    bitti: fark <= 0,
    gun: Math.floor(fark / 86400000),
    saat: Math.floor((fark % 86400000) / 3600000),
    dakika: Math.floor((fark % 3600000) / 60000),
    saniye: Math.floor((fark % 60000) / 1000),
  };
}

export function GeriSayimWidget({ widget }: { widget: Widget }) {
  const cfg = configOkuFromWidget(widget);
  const bitis = cfg.bitisTarihi ?? '';
  const [kalan, setKalan] = useState(() => (bitis ? kalanHesapla(bitis) : null));
  const gt = widgetGorunumTipiAl(widget);

  useEffect(() => {
    if (!bitis) return;
    const t = window.setInterval(() => setKalan(kalanHesapla(bitis)), 1000);
    return () => window.clearInterval(t);
  }, [bitis]);

  if (!bitis || !kalan) return null;

  const kutular = [
    { etiket: 'Gün', deger: kalan.gun },
    { etiket: 'Saat', deger: kalan.saat },
    { etiket: 'Dakika', deger: kalan.dakika },
    { etiket: 'Saniye', deger: kalan.saniye },
  ];

  const wrapSinif =
    gt === 'banner'
      ? 'geri-sayim-banner -mx-[var(--container-pad,1rem)] rounded-none px-6 py-8 sm:px-12'
      : gt === 'kompakt'
        ? 'geri-sayim-kompakt rounded-2xl px-4 py-6'
        : 'geri-sayim-blok rounded-3xl px-6 py-12 sm:px-12';

  return (
    <WidgetKabuk widget={widget}>
      <div className={`overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-center text-white ${wrapSinif}`}>
        {widget.altBaslik && gt !== 'kompakt' && (
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">{widget.altBaslik}</p>
        )}
        {widget.baslik && (
          <h2 className={`${gt === 'kompakt' ? 'text-xl' : baslikSinifi(cfg)} mt-2 font-bold`}>{widget.baslik}</h2>
        )}
        {widget.aciklama && gt !== 'kompakt' && (
          <p className="mx-auto mt-3 max-w-xl text-blue-100/90">{widget.aciklama}</p>
        )}
        <div className={`flex flex-wrap justify-center ${gt === 'kompakt' ? 'mt-4 gap-2' : 'mt-10 gap-4'}`}>
          {kutular.map((k) => (
            <div key={k.etiket} className={gt === 'kompakt' ? 'geri-sayim-kutu-kompakt' : 'geri-sayim-kutu'}>
              <span className="geri-sayim-rakam">{String(k.deger).padStart(2, '0')}</span>
              {gt !== 'kompakt' && <span className="geri-sayim-etiket">{k.etiket}</span>}
            </div>
          ))}
        </div>
        {widget.butonMetni && widget.butonLink && gt !== 'kompakt' && (
          <Link
            to={widget.butonLink}
            className="mt-10 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-blue-50"
          >
            {widget.butonMetni}
          </Link>
        )}
      </div>
    </WidgetKabuk>
  );
}
