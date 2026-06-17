import { useMemo } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import { menuOgeleriOlustur } from '@/data/bosSiteVerisi';
import type { Sayfa } from '@/types/site';
import type { MenuOgesi } from '@/types/site';
import { idString } from '@/utils/idKarsilastir';

interface SayfaMenuOnizlemeProps {
  sayfalar: AdminSayfa[];
  vurguluSayfaId?: string | null;
  vurguluUstId?: string | null;
}

function adminSayfalariMeniye(sayfalar: AdminSayfa[], sadeceYayinda: boolean): Sayfa[] {
  const kaynak = sadeceYayinda
    ? sayfalar.filter((s) => s.yayinda && s.menudeGoster !== false)
    : sayfalar.filter((s) => s.menudeGoster !== false);

  return kaynak.map((s) => ({
    id: s.id,
    baslik: s.baslik,
    slug: s.slug,
    icerik: s.icerik,
    menudeGoster: s.menudeGoster,
    sira: s.sira,
    acilisModu: s.acilisModu,
    ustSayfaId: s.ustSayfaId,
  }));
}

export function SayfaMenuOnizleme({ sayfalar, vurguluSayfaId, vurguluUstId }: SayfaMenuOnizlemeProps) {
  const menu = useMemo(
    () => menuOgeleriOlustur(adminSayfalariMeniye(sayfalar, true)) as MenuOgesi[],
    [sayfalar]
  );

  const vurguluUst = vurguluUstId ?? vurguluSayfaId;

  return (
    <div className="ap-sayfa-menu-onizleme">
      <p className="ap-muted mb-3 text-xs">
        Yayında ve menüde gösterilen sayfalar — canlı sitede böyle görünür
      </p>
      <nav className="ap-sayfa-menu-onizleme-nav" aria-label="Menü önizleme">
        {menu.length === 0 ? (
          <p className="ap-muted text-sm">Henüz menüde görünecek yayınlanmış sayfa yok.</p>
        ) : (
          menu.map((oge, i) => {
            const altVar = oge.altOgeler && oge.altOgeler.length > 0;
            const ustVurgulu =
              vurguluUst &&
              sayfalar.some(
                (s) =>
                  !s.ustSayfaId &&
                  idString(s.id) === idString(vurguluUst) &&
                  s.baslik === oge.baslik
              );

            return (
              <div
                key={`${oge.yol}-${i}`}
                className={`ap-sayfa-menu-onizleme-oge ${ustVurgulu ? 'ap-sayfa-menu-onizleme-oge-aktif' : ''}`}
              >
                <span className="ap-sayfa-menu-onizleme-baslik">
                  {oge.baslik}
                  {altVar && (
                    <svg viewBox="0 0 20 20" className="ap-sayfa-menu-onizleme-ok" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                {altVar && (
                  <div className="ap-sayfa-menu-onizleme-dropdown">
                    {oge.altOgeler!.map((alt) => {
                      const altSayfa = sayfalar.find(
                        (s) => s.baslik === alt.baslik && s.ustSayfaId
                      );
                      const altVurgulu =
                        vurguluSayfaId && altSayfa && idString(altSayfa.id) === idString(vurguluSayfaId);

                      return (
                        <span
                          key={alt.yol}
                          className={`ap-sayfa-menu-onizleme-alt ${altVurgulu ? 'ap-sayfa-menu-onizleme-alt-aktif' : ''}`}
                        >
                          {alt.baslik}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
}
