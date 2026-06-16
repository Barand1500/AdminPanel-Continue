import { useMemo } from 'react';
import { useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { usePanelDil } from '@/contexts/PanelDilContext';
import type { AksiyonButonu } from '@/types/admin';
import type { AksiyonId } from '@/contexts/AdminAksiyonContext';

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
  'menu-yonetimi': [
    A('kaydet', 'Kaydet', true, true),
    A('ekle', 'Yeni Ekle', false),
    A('sil', 'Sil', false),
    A('onizle', 'Önizle', true),
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

export function useAksiyonCubugu(modulId: string) {
  const { aksiyonDurumlari } = useAdminAksiyon();
  const { t } = usePanelDil();

  return useMemo(() => {
    const temel = modulAksiyonlari[modulId] ?? varsayilanAksiyonlar;
    return temel.map((aksiyon) => {
      const dinamik = aksiyonDurumlari[aksiyon.id as AksiyonId];
      const etiket = t(`aksiyon.${aksiyon.id}`, aksiyon.etiket);
      const guncel = { ...aksiyon, etiket };
      return dinamik !== undefined ? { ...guncel, aktif: dinamik } : guncel;
    });
  }, [modulId, aksiyonDurumlari, t]);
}
