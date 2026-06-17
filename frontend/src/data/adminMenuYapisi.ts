import type { AdminModul } from '@/types/admin';

export const adminModulleri: AdminModul[] = [
  { id: 'dashboard', baslik: 'Dashboard', ikon: '📊', kategori: 'Hızlı Erişim', yol: '/gt-admin' },
  { id: 'site-ayarlari', baslik: 'Site Ayarları', ikon: '⚙️', kategori: 'Hızlı Erişim', yol: '/gt-admin/site-ayarlari' },
  { id: 'sayfalar', baslik: 'Sayfalar', ikon: '📄', kategori: 'Hızlı Erişim', yol: '/gt-admin/sayfalar' },
  { id: 'widget-yonetimi', baslik: 'Widget Yönetimi', ikon: '🧩', kategori: 'Hızlı Erişim', yol: '/gt-admin/widgetlar' },
  { id: 'medya', baslik: 'Medya Galerisi', ikon: '🖼️', kategori: 'Hızlı Erişim', yol: '/gt-admin/medya' },
  { id: 'seo', baslik: 'SEO Ayarları', ikon: '🔍', kategori: 'Hızlı Erişim', yol: '/gt-admin/seo' },

  { id: 'header', baslik: 'Header Yönetimi', ikon: '🔝', kategori: 'Site Yönetimi', yol: '/gt-admin/header' },
  { id: 'hero', baslik: 'Hero Yönetimi', ikon: '🏠', kategori: 'Site Yönetimi', yol: '/gt-admin/hero' },
  { id: 'footer', baslik: 'Footer Yönetimi', ikon: '🔻', kategori: 'Site Yönetimi', yol: '/gt-admin/footer' },

  { id: 'blog', baslik: 'Blog / Haberler', ikon: '📰', kategori: 'İçerik Yönetimi', yol: '/gt-admin/blog' },
  { id: 'formlar', baslik: 'Formlar', ikon: '📝', kategori: 'İçerik Yönetimi', yol: '/gt-admin/formlar' },

  { id: 'kullanicilar', baslik: 'Kullanıcılar', ikon: '👥', kategori: 'Müşteri / Ajans', yol: '/gt-admin/kullanicilar' },
  { id: 'roller', baslik: 'Roller ve Yetkiler', ikon: '🔐', kategori: 'Müşteri / Ajans', yol: '/gt-admin/roller' },

  { id: 'ayarlar', baslik: 'Ayarlar', ikon: '🔧', kategori: 'Sistem', yol: '/gt-admin/ayarlar' },
  { id: 'sekme-yonetimi', baslik: 'Sekme Yönetimi', ikon: '🗂️', kategori: 'Sistem', yol: '/gt-admin/sekme-yonetimi' },
  { id: 'kisayol-ayarlari', baslik: 'Kısayol Ayarları', ikon: '⌨️', kategori: 'Sistem', yol: '/gt-admin/kisayol-ayarlari' },
];

/** Footer vb. üzerinden açılan, başlat menüsünde görünmeyen modüller */
export const adminGizliModuller: AdminModul[] = [
  { id: 'loglar', baslik: 'Log Takibi', ikon: '📜', kategori: 'Sistem', yol: '/gt-admin/loglar', menuGizle: true },
  { id: 'veri-yedekleme', baslik: 'Veri Yedekleme', ikon: '💾', kategori: 'Sistem', yol: '/gt-admin/veri-yedekleme', menuGizle: true },
];

export const adminKategoriler = [
  'Hızlı Erişim',
  'Site Yönetimi',
  'İçerik Yönetimi',
  'Müşteri / Ajans',
  'Sistem',
];

export function modulBul(id: string): AdminModul | undefined {
  return adminModulleri.find((m) => m.id === id) ?? adminGizliModuller.find((m) => m.id === id);
}

/** /gt-admin/... yolundan modül bulur (iç linkler için) */
export function modulYolundanBul(pathname: string): AdminModul | undefined {
  const normalized = pathname.replace(/\/+$/, '') || '/gt-admin';
  const tumModuller = [...adminModulleri, ...adminGizliModuller];
  return tumModuller
    .slice()
    .sort((a, b) => b.yol.length - a.yol.length)
    .find((m) => {
      const yol = m.yol.replace(/\/+$/, '') || '/gt-admin';
      return normalized === yol;
    });
}

export function modulAra(terim: string): AdminModul[] {
  const q = terim.toLowerCase().trim();
  if (!q) return adminModulleri;
  return adminModulleri.filter(
    (m) =>
      m.baslik.toLowerCase().includes(q) ||
      m.kategori.toLowerCase().includes(q) ||
      m.id.includes(q)
  );
}
