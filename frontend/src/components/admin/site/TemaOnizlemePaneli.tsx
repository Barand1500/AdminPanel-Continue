import type { SiteTemaPaleti } from '@/types/temaAyarlari';
import { aktifPaletiHesapla } from '@/utils/temaRenkleri';
import type { GeceSablonId } from '@/types/temaAyarlari';

interface TemaOnizlemePaneliProps {
  siteAd: string;
  anaRenk: string;
  ikincilRenk: string;
  geceSablon: GeceSablonId;
  font?: string;
}

function MiniOnizleme({
  baslik,
  palet,
  siteAd,
  font,
}: {
  baslik: string;
  palet: SiteTemaPaleti;
  siteAd: string;
  font?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="ap-muted mb-2 text-center text-xs font-semibold uppercase tracking-wide">{baslik}</p>
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: palet.border,
          background: palet.surface,
          fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}
      >
        <div className="px-3 py-1.5 text-xs text-white" style={{ background: palet.primary }}>
          {siteAd}
        </div>
        <div
          className="flex items-center justify-between border-b px-3 py-2"
          style={{ background: palet.surfaceElevated, borderColor: palet.border }}
        >
          <span className="text-xs font-bold" style={{ color: palet.text }}>
            {siteAd.split(' ')[0]}
          </span>
          <span className="text-[11px]" style={{ color: palet.textMuted }}>
            Menü
          </span>
        </div>
        <div className="space-y-2 p-3">
          <div
            className="rounded-lg border p-2.5"
            style={{
              background: palet.surfaceElevated,
              borderColor: palet.border,
              color: palet.text,
            }}
          >
            <p className="text-xs font-semibold">Başlık örneği</p>
            <p className="mt-0.5 text-[11px]" style={{ color: palet.textMuted }}>
              Açıklama metni
            </p>
          </div>
          <span
            className="inline-block rounded-md px-3 py-1 text-[11px] font-semibold text-white"
            style={{ background: palet.primary }}
          >
            Buton
          </span>
        </div>
      </div>
    </div>
  );
}

export function TemaOnizlemePaneli({
  siteAd,
  anaRenk,
  ikincilRenk,
  geceSablon,
  font,
}: TemaOnizlemePaneliProps) {
  const gunduzPalet = aktifPaletiHesapla('acik', anaRenk, ikincilRenk, geceSablon);
  const gecePalet = aktifPaletiHesapla('koyu', anaRenk, ikincilRenk, geceSablon);

  return (
    <div className="flex gap-3">
      <MiniOnizleme baslik="Gündüz" palet={gunduzPalet} siteAd={siteAd} font={font} />
      <MiniOnizleme baslik="Gece" palet={gecePalet} siteAd={siteAd} font={font} />
    </div>
  );
}
