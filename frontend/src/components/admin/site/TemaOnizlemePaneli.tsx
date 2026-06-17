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
      <p className="ap-muted mb-2 text-center text-[10px] font-semibold uppercase tracking-wide">{baslik}</p>
      <div
        className="overflow-hidden rounded-lg border"
        style={{
          borderColor: palet.border,
          background: palet.surface,
          fontFamily: font ? `"${font}", sans-serif` : undefined,
        }}
      >
        <div className="px-2 py-1 text-[9px] text-white" style={{ background: palet.primary }}>
          {siteAd}
        </div>
        <div
          className="flex items-center justify-between border-b px-2 py-1.5"
          style={{ background: palet.surfaceElevated, borderColor: palet.border }}
        >
          <span className="text-[9px] font-bold" style={{ color: palet.text }}>
            {siteAd.split(' ')[0]}
          </span>
          <span className="text-[8px]" style={{ color: palet.textMuted }}>
            Menü
          </span>
        </div>
        <div className="space-y-1.5 p-2">
          <div
            className="rounded border p-1.5"
            style={{
              background: palet.surfaceElevated,
              borderColor: palet.border,
              color: palet.text,
            }}
          >
            <p className="text-[9px] font-semibold">Başlık örneği</p>
            <p className="text-[8px]" style={{ color: palet.textMuted }}>
              Açıklama metni
            </p>
          </div>
          <span
            className="inline-block rounded px-2 py-0.5 text-[8px] font-semibold text-white"
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
