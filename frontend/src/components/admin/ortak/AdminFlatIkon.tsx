import {
  IconAdjustments, IconBox, IconCode, IconDatabase, IconFileText, IconFolder, IconHome, IconInbox,
  IconLayoutDashboard, IconLink, IconMapPin, IconMessage, IconPhoto, IconPuzzle, IconRobot,
  IconSearch, IconSend, IconSettings, IconShield, IconSlideshow, IconTool, IconUpload, IconWorld, IconMouse, IconLanguage,
  IconDeviceFloppy, IconPlus, IconTrash, IconRefresh, IconClipboardList,
} from '@tabler/icons-react';

const IKONLAR = {
  ayarlar: IconSettings, belge: IconFileText, klasor: IconFolder, galeri: IconPhoto,
  giden: IconSend, harita: IconMapPin, hero: IconHome, gelen: IconInbox, kutu: IconBox,
  medya: IconUpload, menu: IconLink, mesaj: IconMessage, panel: IconLayoutDashboard,
  puzzle: IconPuzzle, robot: IconRobot, slider: IconSlideshow, arama: IconSearch,
  araclar: IconTool, ayar: IconAdjustments, guvenlik: IconShield, veri: IconDatabase, web: IconWorld,
  kod: IconCode, fare: IconMouse, dil: IconLanguage,
  kaydet: IconDeviceFloppy, ekle: IconPlus, sil: IconTrash, guncelle: IconRefresh, liste: IconClipboardList,
};

export type AdminFlatIkonAdi = keyof typeof IKONLAR;

export function AdminFlatIkon({ ad, boyut = 18, className }: { ad: AdminFlatIkonAdi; boyut?: number; className?: string }) {
  const Ikon = IKONLAR[ad];
  return <Ikon size={boyut} stroke={1.8} className={className} aria-hidden />;
}
