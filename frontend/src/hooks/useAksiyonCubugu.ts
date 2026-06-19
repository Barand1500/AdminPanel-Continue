import { useMemo } from 'react';
import { useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { usePanelDil } from '@/contexts/PanelDilContext';
import type { AksiyonButonu } from '@/types/admin';
import type { AksiyonId } from '@/contexts/AdminAksiyonContext';
import { useYetkiler } from '@/hooks/useYetkiler';
import type { YetkiKodu } from '@/features/admin/rolApi';

const A = (id: AksiyonButonu['id'], etiket: string, aktif: boolean, birincil?: boolean): AksiyonButonu => ({
  id,
  etiket,
  aktif,
  ...(birincil ? { birincil: true } : {}),
});

const modulAksiyonlari: Record<string, AksiyonButonu[]> = {
  dashboard: [
    A('kaydet', 'Kaydet', false),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true, true),
    A('yayinla', 'Yayınla', false),
  ],
  sayfalar: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', true),
    A('altEkle', 'Yeni Alt Ekle', false),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', true),
  ],
  blog: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', true),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', true),
  ],
  formlar: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', true),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', true),
  ],
  medya: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  'site-ayarlari': [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', false),
  ],
  'widget-yonetimi': [
    A('kaydet', 'Kaydet', true),
    A('hizliKaydet', 'Hızlı Kaydet', true),
    A('ekle', 'Yeni Ekle', true, true),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', true),
  ],
  seo: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  header: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', false),
  ],
  hero: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', false),
  ],
  footer: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true),
    A('yayinla', 'Yayınla', false),
  ],
  ayarlar: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  kullanicilar: [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', true),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  roller: [
    A('kaydet', 'Kaydet', true),
    A('ekle', 'Yeni Ekle', true),
    A('sil', 'Sil', true),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  'sekme-yonetimi': [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
  'kisayol-ayarlari': [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', false),
    A('yayinla', 'Yayınla', false),
  ],
};

const varsayilanAksiyonlar: AksiyonButonu[] = [
  A('kaydet', 'Kaydet', true),
  A('ekle', 'Yeni Ekle', false),
  A('sil', 'Sil', false),
  A('onizle', 'Önizle', true),
  A('yayinla', 'Yayınla', false),
];

const MODUL_AKSIYON_YETKI: Partial<Record<string, Partial<Record<AksiyonId, YetkiKodu>>>> = {
  kullanicilar: {
    kaydet: 'kullanici_yonetimi',
    ekle: 'kullanici_yonetimi',
    sil: 'kullanici_yonetimi',
  },
};

const AKSIYON_YETKI: Partial<Record<AksiyonId, YetkiKodu>> = {
  kaydet: 'duzenleme',
  hizliKaydet: 'duzenleme',
  guncelle: 'duzenleme',
  ekle: 'ekleme',
  altEkle: 'ekleme',
  sil: 'silme',
  onizle: 'goruntuleme',
  yayinla: 'duzenleme',
};

export function useAksiyonCubugu(modulId: string) {
  const { aksiyonDurumlari } = useAdminAksiyon();
  const { t } = usePanelDil();
  const { yetkiler } = useYetkiler();

  return useMemo(() => {
    const temel = modulAksiyonlari[modulId] ?? varsayilanAksiyonlar;
    const modulYetki = MODUL_AKSIYON_YETKI[modulId] ?? {};
    const yetkiVar = (kod: YetkiKodu) => yetkiler.includes(kod);

    return temel.map((aksiyon) => {
      const dinamik = aksiyonDurumlari[aksiyon.id as AksiyonId];
      const etiket = t(`aksiyon.${aksiyon.id}`, aksiyon.etiket);
      const guncel = { ...aksiyon, etiket };

      const yetkiKodu = modulYetki[aksiyon.id as AksiyonId] ?? AKSIYON_YETKI[aksiyon.id as AksiyonId];
      const yetkiUygun = !yetkiKodu || yetkiVar(yetkiKodu);
      const temelAktif = dinamik !== undefined ? dinamik : aksiyon.aktif;

      return { ...guncel, aktif: temelAktif && yetkiUygun };
    });
  }, [modulId, aksiyonDurumlari, t, yetkiler]);
}
