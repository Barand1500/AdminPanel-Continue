import { useMemo, useState } from 'react';
import type { AdminSayfa } from '@/features/admin/sayfaApi';
import type { UstMenuOgesi } from '@/types/header';
import {
  AdminBosDurum,
  AdminDurumEtiketi,
} from '@/components/admin/ortak/AdminFormBilesenleri';
import {
  UstMenuEkleModal,
  yeniUstMenuOgesi,
  type UstMenuFormDegeri,
} from './UstMenuEkleModal';
import { sayfaMenudenUstMenuAktar } from '@/utils/menuYardimci';

interface UstMenuPanelProps {
  ustMenu: UstMenuOgesi[];
  sayfalar: AdminSayfa[];
  kirli: boolean;
  onChange: (menu: UstMenuOgesi[]) => void;
  onSil?: (silinen: UstMenuOgesi, yeniMenu: UstMenuOgesi[]) => void;
}

export function UstMenuPanel({ ustMenu, sayfalar, kirli, onChange, onSil }: UstMenuPanelProps) {
  const [modalAcik, setModalAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<UstMenuOgesi | null>(null);

  const sirali = useMemo(
    () => [...ustMenu].sort((a, b) => a.sira - b.sira),
    [ustMenu]
  );

  const siraGuncelle = (liste: UstMenuOgesi[]) =>
    liste.map((o, i) => ({ ...o, sira: i }));

  const yukari = (id: string) => {
    const liste = [...sirali];
    const index = liste.findIndex((o) => o.id === id);
    if (index <= 0) return;
    [liste[index - 1], liste[index]] = [liste[index], liste[index - 1]];
    onChange(siraGuncelle(liste));
  };

  const asagi = (id: string) => {
    const liste = [...sirali];
    const index = liste.findIndex((o) => o.id === id);
    if (index < 0 || index >= liste.length - 1) return;
    [liste[index], liste[index + 1]] = [liste[index + 1], liste[index]];
    onChange(siraGuncelle(liste));
  };

  const sil = (id: string) => {
    const silinen = sirali.find((o) => o.id === id);
    const yeniMenu = siraGuncelle(sirali.filter((o) => o.id !== id));
    if (silinen && onSil) {
      onSil(silinen, yeniMenu);
    } else {
      onChange(yeniMenu);
    }
  };

  const kaydetModal = (deger: UstMenuFormDegeri) => {
    if (duzenlenen) {
      onChange(
        siraGuncelle(
          sirali.map((o) =>
            o.id === duzenlenen.id
              ? { ...o, ad: deger.ad, link: deger.link, yeniSekme: deger.yeniSekme, sayfaId: deger.sayfaId }
              : o
          )
        )
      );
    } else {
      onChange(siraGuncelle([...sirali, yeniUstMenuOgesi(deger, sirali.length)]));
    }
    setDuzenlenen(null);
  };

  const iceAktar = () => {
    const aktarilan = sayfaMenudenUstMenuAktar(sayfalar);
    if (aktarilan.length === 0) return;
    onChange(aktarilan);
  };

  const modalAc = (oge?: UstMenuOgesi) => {
    setDuzenlenen(oge ?? null);
    setModalAcik(true);
  };

  return (
    <>
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="ap-heading text-sm font-semibold">Üst Menü</h2>
            <p className="ap-muted text-xs">
              Header&apos;daki navigasyon linkleri — ekle, çıkar, sırala
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {kirli && <AdminDurumEtiketi tur="taslak">Kaydedilmedi</AdminDurumEtiketi>}
            {sirali.length === 0 && sayfalar.some((s) => s.menudeGoster && s.yayinda) && (
              <button
                type="button"
                onClick={iceAktar}
                className="rounded-lg border border-[var(--ap-border)] px-3 py-1.5 text-xs font-medium transition hover:bg-[var(--ap-hover)]"
              >
                Sayfa menüsünü aktar
              </button>
            )}
            <button
              type="button"
              onClick={() => modalAc()}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              + Ekle
            </button>
          </div>
        </div>

        {sirali.length === 0 ? (
          <AdminBosDurum
            ikon="🔗"
            baslik="Üst menü boş"
            aciklama="Link ekleyin veya mevcut sayfa menüsünü aktarın. Boşken sayfa menüsü kullanılır."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--ap-border)] text-xs uppercase tracking-wide text-[var(--ap-muted)]">
                  <th className="pb-2 pr-3 font-medium">Sıra</th>
                  <th className="pb-2 pr-3 font-medium">Adı / Link</th>
                  <th className="pb-2 pr-3 font-medium">Yeni Sekme</th>
                  <th className="pb-2 text-right font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {sirali.map((oge, index) => (
                  <tr key={oge.id} className="border-b border-[var(--ap-border)] last:border-0">
                    <td className="py-3 pr-3 align-top">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="ap-menu-sira-btn"
                          disabled={index === 0}
                          onClick={() => yukari(oge.id)}
                          aria-label="Yukarı"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="ap-menu-sira-btn"
                          disabled={index === sirali.length - 1}
                          onClick={() => asagi(oge.id)}
                          aria-label="Aşağı"
                        >
                          ▼
                        </button>
                        <span className="ap-muted ml-1 text-xs">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <p className="ap-heading font-medium">{oge.ad}</p>
                      <p className="ap-muted truncate text-xs">{oge.link}</p>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <AdminDurumEtiketi tur={oge.yeniSekme ? 'aktif' : 'pasif'}>
                        {oge.yeniSekme ? 'Evet' : 'Hayır'}
                      </AdminDurumEtiketi>
                    </td>
                    <td className="py-3 text-right align-top">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => modalAc(oge)}
                          className="rounded-lg border border-[var(--ap-border)] px-2 py-1 text-xs transition hover:bg-[var(--ap-hover)]"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => sil(oge.id)}
                          className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UstMenuEkleModal
        acik={modalAcik}
        onKapat={() => {
          setModalAcik(false);
          setDuzenlenen(null);
        }}
        onKaydet={kaydetModal}
        sayfalar={sayfalar}
        duzenlenen={duzenlenen}
      />
    </>
  );
}
