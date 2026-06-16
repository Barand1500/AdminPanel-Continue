import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import type { SitePublicData } from '@/types/site';
import type { SistemAyarlariJson, Sayfa404Ayarlari } from '@/types/sistemAyarlari';
import { varsayilanSayfa404 } from '@/types/sistemAyarlari';

function sistemAyarlariCoz(ayarlar: SitePublicData['site']['ayarlar']): SistemAyarlariJson | null {
  const json = (ayarlar as { sistemAyarlariJson?: unknown } | null)?.sistemAyarlariJson;
  if (!json || typeof json !== 'object') return null;
  return json as SistemAyarlariJson;
}

function sayfa404Coz(sistem: SistemAyarlariJson | null): Sayfa404Ayarlari {
  return { ...varsayilanSayfa404, ...sistem?.sayfa404 };
}

export function SayfaBulunamadi() {
  const veri = useOutletContext<SitePublicData>();
  const { site, sayfalar } = veri;
  const sistem = sistemAyarlariCoz(site.ayarlar);
  const s404 = sayfa404Coz(sistem);
  const oneriSayfa = s404.oneriSayfaId ? sayfalar.find((s) => s.id === s404.oneriSayfaId) : null;

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center">
          {s404.gorselUrl ? (
            <img src={s404.gorselUrl} alt="" className="mx-auto mb-6 h-32 object-contain" />
          ) : (
            <p className="text-7xl font-black text-slate-200">404</p>
          )}
          <h1 className="mt-2 text-2xl font-bold text-slate-800">{s404.baslik}</h1>
          <p className="mt-3 text-slate-500">{s404.mesaj}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {s404.anaSayfaButonu && (
              <Link
                to="/"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Ana Sayfaya Dön
              </Link>
            )}
            {oneriSayfa && (
              <Link
                to={`/${oneriSayfa.slug}`}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {oneriSayfa.baslik}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
