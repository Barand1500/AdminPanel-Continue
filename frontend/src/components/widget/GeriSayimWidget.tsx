import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Widget } from '@/types/site';
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

  return (
    <WidgetKabuk widget={widget}>
      <div className="geri-sayim-blok overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary-dark px-6 py-12 text-center text-white sm:px-12">
        {widget.altBaslik && <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">{widget.altBaslik}</p>}
        {widget.baslik && <h2 className={`${baslikSinifi(cfg)} mt-2 font-bold`}>{widget.baslik}</h2>}
        {widget.aciklama && <p className="mx-auto mt-3 max-w-xl text-blue-100/90">{widget.aciklama}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {kutular.map((k) => (
            <div key={k.etiket} className="geri-sayim-kutu">
              <span className="geri-sayim-rakam">{String(k.deger).padStart(2, '0')}</span>
              <span className="geri-sayim-etiket">{k.etiket}</span>
            </div>
          ))}
        </div>
        {widget.butonMetni && widget.butonLink && (
          <Link to={widget.butonLink} className="mt-10 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-blue-50">
            {widget.butonMetni}
          </Link>
        )}
      </div>
    </WidgetKabuk>
  );
}
