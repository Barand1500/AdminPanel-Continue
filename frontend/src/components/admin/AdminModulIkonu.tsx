import {
  IconApps,
  IconArticle,
  IconBrowser,
  IconDeviceDesktop,
  IconFileText,
  IconFolder,
  IconKeyboard,
  IconLayout,
  IconLayoutDashboard,
  IconLink,
  IconLock,
  IconPhoto,
  IconPuzzle,
  IconSearch,
  IconSettings,
  IconSlideshow,
  IconUsers,
} from '@tabler/icons-react';

const MODUL_IKONLARI = {
  dashboard: IconLayoutDashboard,
  'site-ayarlari': IconSettings,
  sayfalar: IconFileText,
  'widget-yonetimi': IconPuzzle,
  'slider-yonetimi': IconSlideshow,
  medya: IconPhoto,
  seo: IconSearch,
  header: IconLink,
  kategoriler: IconFolder,
  hero: IconLayout,
  footer: IconDeviceDesktop,
  blog: IconArticle,
  formlar: IconFileText,
  kullanicilar: IconUsers,
  roller: IconLock,
  ayarlar: IconSettings,
  'sekme-yonetimi': IconBrowser,
  'kisayol-ayarlari': IconKeyboard,
  yapilacaklar: IconArticle,
} as const;

interface AdminModulIkonuProps {
  modulId: string;
  boyut?: number;
  className?: string;
}

/** Başlat menüsü ve üst sekmeler için tekil, emoji içermeyen modül ikonu. */
export function AdminModulIkonu({ modulId, boyut = 18, className }: AdminModulIkonuProps) {
  const Ikon = MODUL_IKONLARI[modulId as keyof typeof MODUL_IKONLARI] ?? IconApps;
  return <Ikon size={boyut} stroke={1.8} className={className} aria-hidden="true" />;
}
