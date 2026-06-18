import { useMemo } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { UstMenuOgesi } from '@/types/header';
import type { MenuOgesi } from '@/types/site';
import {
  AdminAnahtarDugme,
  AdminBosDurum,
  AdminDurumEtiketi,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import { ustMenuOgeleriOlustur, pendingSayfaMi } from '@/utils/menuYardimci';
import { sayfaYolunuBul } from '@/data/bosSiteVerisi';

interface MenuOnizlemeProps {
  sayfalar: AdminSayfa[];
  ustMenu?: UstMenuOgesi[];
  siteAdi?: string;
}

export function MenuOnizlemePanel({ sayfalar, ustMenu = [], siteAdi = 'Site Adı' }: MenuOnizlemeProps) {
  const menuOgeleri = useMemo((): MenuOgesi[] => {
    if (ustMenu.length > 0) return ustMenuOgeleriOlustur(ustMenu);
    return [...sayfalar]
      .filter((s) => s.menudeGoster && s.yayinda)
      .sort((a, b) => a.sira - b.sira)
      .map((s) => ({ baslik: s.baslik, yol: sayfaYolunuBul(s.slug) }));
  }, [sayfalar, ustMenu]);

  const ustMenuAktif = ustMenu.length > 0;

  return (
    <div className="ap-menu-onizleme">
      <p className="ap-muted mb-3 text-xs font-medium uppercase tracking-wide">Canlı Önizleme</p>
      <div className="ap-menu-onizleme-bar">
        <span className="ap-menu-onizleme-logo">{siteAdi}</span>
        {menuOgeleri.length === 0 ? (
          <span className="ap-muted text-xs italic">Menü boş — link ekleyin veya sayfa menüsünü kullanın</span>
        ) : (
          menuOgeleri.map((oge, i) => (
            <span key={`${oge.yol}-${i}`} className="ap-menu-onizleme-oge">
              {oge.baslik}
              {oge.yeniSekme && (
                <span className="ap-muted ml-0.5 text-[9px]" title="Yeni sekme">
                  ↗
                </span>
              )}
            </span>
          ))
        )}
      </div>
      <p className="ap-muted mt-3 text-xs">
        {ustMenuAktif ? (
          <>
            <strong className="ap-heading">Üst menü</strong> listesi kullanılıyor ({ustMenu.length} link).
          </>
        ) : (
          <>
            Üst menü boş — <strong className="ap-heading">yayında</strong> ve{' '}
            <strong className="ap-heading">menüde göster</strong> işaretli sayfalar görünür.
          </>
        )}
      </p>
    </div>
  );
}

interface MenuDuzenlemePanelProps {
  sayfalar: AdminSayfa[];
  ustMenu?: UstMenuOgesi[];
  kirli: boolean;
  onToggleMenu: (id: string) => void;
  onYukari: (id: string) => void;
  onAsagi: (id: string) => void;
}

export function MenuDuzenlemePanel({
  sayfalar,
  ustMenu = [],
  kirli,
  onToggleMenu,
  onYukari,
  onAsagi,
}: MenuDuzenlemePanelProps) {
  const ustMenuSayfaIdleri = useMemo(
    () => new Set(ustMenu.map((o) => o.sayfaId).filter(Boolean)),
    [ustMenu]
  );

  const sirali = useMemo(
    () => [...sayfalar].sort((a, b) => a.sira - b.sira),
    [sayfalar]
  );

  if (sirali.length === 0) {
    return (
      <AdminBosDurum
        ikon="📋"
        baslik="Menü için sayfa yok"
        aciklama="Önce Sayfalar modülünden sayfa oluşturun"
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex min-h-[2.75rem] items-center justify-between">
        <div>
          <h2 className="ap-heading text-sm font-semibold">Sayfa Menü Öğeleri</h2>
          <p className="ap-muted text-xs">
            Üst menüden eklenen dahili linkler otomatik sayfa olarak bağlanır
          </p>
        </div>
        {kirli && <AdminDurumEtiketi tur="taslak">Kaydedilmedi</AdminDurumEtiketi>}
      </div>

      <div className="ap-scroll max-h-[480px] overflow-y-auto pr-1">
        {sirali.map((s, index) => (
          <div
            key={s.id}
            className={`ap-menu-satir ${!s.menudeGoster ? 'ap-menu-satir-gizli' : ''}`}
          >
            <div className="ap-menu-sira">
              <button
                type="button"
                className="ap-menu-sira-btn"
                disabled={index === 0}
                onClick={() => onYukari(s.id)}
                aria-label="Yukarı"
              >
                ▲
              </button>
              <button
                type="button"
                className="ap-menu-sira-btn"
                disabled={index === sirali.length - 1}
                onClick={() => onAsagi(s.id)}
                aria-label="Aşağı"
              >
                ▼
              </button>
            </div>

            <span className="ap-menu-sira-no">{index + 1}</span>

            <div className="min-w-0 flex-1">
              <p className="ap-heading truncate text-sm font-medium">
                {s.ikon && <span className="mr-1">{s.ikon}</span>}
                {s.baslik}
              </p>
              <p className="ap-muted text-xs">/{s.slug}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {ustMenuSayfaIdleri.has(s.id) && (
                  <AdminDurumEtiketi tur="menu">Üst menü</AdminDurumEtiketi>
                )}
                {pendingSayfaMi(s.id) && (
                  <AdminDurumEtiketi tur="taslak">Yeni sayfa</AdminDurumEtiketi>
                )}
                {s.yayinda ? (
                  <AdminDurumEtiketi tur="yayinda">Yayında</AdminDurumEtiketi>
                ) : (
                  <AdminDurumEtiketi tur="taslak">Taslak</AdminDurumEtiketi>
                )}
                {!s.yayinda && s.menudeGoster && (
                  <AdminDurumEtiketi tur="pasif">Menüde ama taslak</AdminDurumEtiketi>
                )}
              </div>
            </div>

            <AdminAnahtarDugme
              etiket="Menüde"
              acik={s.menudeGoster}
              onDegistir={() => onToggleMenu(s.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function menuIstatistikleri(sayfalar: AdminSayfa[]) {
  return {
    toplam: sayfalar.length,
    menude: sayfalar.filter((s) => s.menudeGoster).length,
    gizli: sayfalar.filter((s) => !s.menudeGoster).length,
    yayindaMenude: sayfalar.filter((s) => s.menudeGoster && s.yayinda).length,
  };
}
