import type { SiteAyarlari } from '@/types/site';
import type { SistemAyarlariJson } from '@/types/sistemAyarlari';

function sistemCoz(ayarlar: SiteAyarlari | null): SistemAyarlariJson | null {
  const json = (ayarlar as { sistemAyarlariJson?: unknown } | null)?.sistemAyarlariJson;
  if (!json || typeof json !== 'object') return null;
  return json as SistemAyarlariJson;
}

export function BakimEkrani({
  siteAdi,
  ayarlar,
}: {
  siteAdi: string;
  ayarlar: SiteAyarlari | null;
}) {
  const sistem = sistemCoz(ayarlar);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        {sistem?.bakimGorselUrl ? (
          <img
            src={sistem.bakimGorselUrl}
            alt=""
            className="mx-auto mb-6 h-24 object-contain"
          />
        ) : (
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-4xl">
            🔧
          </div>
        )}
        <h1 className="text-xl font-bold text-white">
          {sistem?.bakimBaslik ?? 'Bakım Çalışması'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {sistem?.bakimMesaji ?? 'Site geçici olarak bakımda. Lütfen daha sonra tekrar deneyin.'}
        </p>
        {sistem?.bakimTahminiSure && (
          <p className="mt-4 inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-xs text-orange-300">
            ⏱ {sistem.bakimTahminiSure}
          </p>
        )}
        <p className="mt-8 text-[10px] text-slate-500">{siteAdi}</p>
      </div>
    </div>
  );
}
