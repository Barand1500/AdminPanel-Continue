import {
  IconAdjustments, IconBox, IconChevronRight, IconCircleCheck, IconClipboardCopy, IconClipboardList,
  IconClipboardPlus, IconCode, IconCut, IconDatabase, IconDeviceFloppy, IconEye, IconFilePlus,
  IconFileText, IconFolder, IconHome, IconInbox, IconLanguage, IconLayoutDashboard, IconLink,
  IconMapPin, IconMessage, IconMinus, IconMoonStars, IconMouse, IconPhoto, IconPlus, IconPuzzle,
  IconRefresh, IconRobot, IconSearch, IconSelectAll, IconSend, IconSettings, IconShield,
  IconSlideshow, IconSparkles, IconTabClose, IconTool, IconTrash, IconUpload, IconWorld,
  IconBrowserX, IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse, IconLayersSubtract,
} from '@tabler/icons-react';

const IKONLAR = {
  ayarlar: IconSettings, belge: IconFileText, klasor: IconFolder, galeri: IconPhoto,
  giden: IconSend, harita: IconMapPin, hero: IconHome, gelen: IconInbox, kutu: IconBox,
  medya: IconUpload, menu: IconLink, mesaj: IconMessage, panel: IconLayoutDashboard,
  puzzle: IconPuzzle, robot: IconRobot, slider: IconSlideshow, arama: IconSearch,
  araclar: IconTool, ayar: IconAdjustments, guvenlik: IconShield, veri: IconDatabase, web: IconWorld,
  kod: IconCode, fare: IconMouse, dil: IconLanguage,
  kaydet: IconDeviceFloppy, ekle: IconPlus, sil: IconTrash, guncelle: IconRefresh, liste: IconClipboardList,
  kopyala: IconClipboardCopy, kes: IconCut, yapistir: IconClipboardPlus, 'tumunu-sec': IconSelectAll,
  'yeni-belge': IconFilePlus, onizle: IconEye, tema: IconMoonStars, kesif: IconSparkles,
  ayirici: IconMinus, 'sag-ok': IconChevronRight, onay: IconCircleCheck,
  sekmeKapat: IconTabClose, digerSekmeleriKapat: IconLayersSubtract,
  solSekmeleriKapat: IconLayoutSidebarLeftCollapse, sagSekmeleriKapat: IconLayoutSidebarRightCollapse,
  tumSekmeleriKapat: IconBrowserX,
};

export type AdminFlatIkonAdi = keyof typeof IKONLAR;

export function AdminFlatIkon({ ad, boyut = 18, className }: { ad: AdminFlatIkonAdi; boyut?: number; className?: string }) {
  const Ikon = IKONLAR[ad];
  return <Ikon size={boyut} stroke={1.8} className={className} aria-hidden />;
}
