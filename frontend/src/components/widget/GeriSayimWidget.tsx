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

  const arkaPlanSinif: Record<string, string> = {
    'koyu-buyuk': 'geri-sayim-blok bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark text-white',
    'kompakt-serit': 'geri-sayim-kompakt bg-slate-100 text-slate-900 border border-slate-200',
    'tam-banner': 'geri-sayim-banner bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white',
    'mor-gradient': 'geri-sayim-blok bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-700 text-white',
    'okyanus-sade': 'geri-sayim-blok bg-gradient-to-br from-sky-50 to-blue-100 text-blue-950 border border-blue-200',
    'yesil-kampanya': 'geri-sayim-banner bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
  };

  const kompakt = gt === 'kompakt-serit';
  const banner = gt === 'tam-banner' || gt === 'yesil-kampanya';
  const acikTema = gt === 'okyanus-sade' || kompakt;

  return (
    <WidgetKabuk widget={widget}>
      <div
        className={`overflow-hidden text-center ${
          banner ? '-mx-[var(--container-pad,1rem)] rounded-none px-6 py-8 sm:px-12' : kompakt ? 'rounded-2xl px-4 py-6' : 'rounded-3xl px-6 py-12 sm:px-12'
        } ${arkaPlanSinif[gt] ?? arkaPlanSinif['koyu-buyuk']}`}
      >
        {widget.altBaslik && !kompakt && (
          <p className={`text-sm font-semibold uppercase tracking-widest ${acikTema ? 'text-blue-600' : 'text-blue-200'}`}>
            {widget.altBaslik}
          </p>
        )}
        {widget.baslik && (
          <h2 className={`${kompakt ? 'text-xl' : baslikSinifi(cfg)} mt-2 font-bold`}>{widget.baslik}</h2>
        )}
        {widget.aciklama && !kompakt && (
          <p className={`mx-auto mt-3 max-w-xl ${acikTema ? 'text-slate-600' : 'text-blue-100/90'}`}>{widget.aciklama}</p>
        )}
        <div className={`flex flex-wrap justify-center ${kompakt ? 'mt-4 gap-2' : 'mt-10 gap-4'}`}>
          {kutular.map((k) => (
            <div key={k.etiket} className={kompakt ? 'geri-sayim-kutu-kompakt' : acikTema ? 'geri-sayim-kutu-acik' : 'geri-sayim-kutu'}>
              <span className="geri-sayim-rakam">{String(k.deger).padStart(2, '0')}</span>
              {!kompakt && <span className="geri-sayim-etiket">{k.etiket}</span>}
            </div>
          ))}
        </div>
        {widget.butonMetni && widget.butonLink && !kompakt && (
          <Link
            to={widget.butonLink}
            className={`mt-10 inline-flex rounded-xl px-8 py-3 text-sm font-bold shadow-lg transition ${
              acikTema
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-slate-900 hover:bg-blue-50'
            }`}
          >
            {widget.butonMetni}
          </Link>
        )}
      </div>
    </WidgetKabuk>
  );
}
