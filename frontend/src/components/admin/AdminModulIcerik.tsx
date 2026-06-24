import { HeaderYonetimiFormu } from './site/HeaderYonetimiFormu';
import { HeroYonetimiFormu } from './site/HeroYonetimiFormu';
import { FooterYonetimiFormu } from './site/FooterYonetimiFormu';
import { WidgetYonetimiSayfasi } from '@/pages/admin/WidgetYonetimiSayfasi';
import { SliderYonetimiSayfasi } from '@/pages/admin/SliderYonetimiSayfasi';
import { SiteAyarlariSayfasi } from '@/pages/admin/SiteAyarlariSayfasi';
import { SayfaYonetimiSayfasi } from '@/pages/admin/SayfaYonetimiSayfasi';
import { MedyaGalerisiSayfasi } from '@/pages/admin/MedyaGalerisiSayfasi';
import { SeoYonetimiSayfasi } from '@/pages/admin/SeoYonetimiSayfasi';
import { DashboardSayfasi } from '@/pages/admin/DashboardSayfasi';
import { BlogYonetimiSayfasi } from '@/pages/admin/BlogYonetimiSayfasi';
import { FormYonetimiSayfasi } from '@/pages/admin/FormYonetimiSayfasi';
import { LoglarSayfasi } from '@/pages/admin/LoglarSayfasi';
import { VeriYedeklemeSayfasi } from '@/pages/admin/VeriYedeklemeSayfasi';
import { SistemAyarlariSayfasi } from '@/pages/admin/SistemAyarlariSayfasi';
import { KullanicilarSayfasi } from '@/pages/admin/KullanicilarSayfasi';
import { RollerSayfasi } from '@/pages/admin/RollerSayfasi';
import { SekmeYonetimiSayfasi } from '@/pages/admin/SekmeYonetimiSayfasi';
import { KategoriYonetimiSayfasi } from '@/pages/admin/KategoriYonetimiSayfasi';
import { KisayolAyarlariSayfasi } from '@/pages/admin/KisayolAyarlariSayfasi';
import { ModulKabuk } from '@/contexts/ModulKabukContext';

interface AdminModulIcerikProps {
  modulId: string;
  onModulAc: (modulId: string) => void;
}

export function AdminModulIcerik({ modulId, onModulAc }: AdminModulIcerikProps) {
  return (
    <ModulKabuk modulId={modulId}>
      <AdminModulGovde modulId={modulId} onModulAc={onModulAc} />
    </ModulKabuk>
  );
}

function AdminModulGovde({ modulId, onModulAc }: AdminModulIcerikProps) {
  switch (modulId) {
    case 'dashboard':
      return <DashboardSayfasi onModulAc={onModulAc} />;
    case 'header':
      return <HeaderYonetimiFormu />;
    case 'kategoriler':
      return <KategoriYonetimiSayfasi />;
    case 'hero':
      return <HeroYonetimiFormu />;
    case 'footer':
      return <FooterYonetimiFormu />;
    case 'widget-yonetimi':
      return <WidgetYonetimiSayfasi />;
    case 'slider-yonetimi':
      return <SliderYonetimiSayfasi />;
    case 'site-ayarlari':
      return <SiteAyarlariSayfasi />;
    case 'sayfalar':
      return <SayfaYonetimiSayfasi />;
    case 'medya':
      return <MedyaGalerisiSayfasi />;
    case 'seo':
      return <SeoYonetimiSayfasi />;
    case 'blog':
      return <BlogYonetimiSayfasi />;
    case 'formlar':
      return <FormYonetimiSayfasi />;
    case 'loglar':
      return <LoglarSayfasi />;
    case 'veri-yedekleme':
      return <VeriYedeklemeSayfasi />;
    case 'ayarlar':
      return <SistemAyarlariSayfasi />;
    case 'kullanicilar':
      return <KullanicilarSayfasi />;
    case 'roller':
      return <RollerSayfasi />;
    case 'sekme-yonetimi':
      return <SekmeYonetimiSayfasi />;
    case 'kisayol-ayarlari':
      return <KisayolAyarlariSayfasi />;
    default:
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl">🚧</p>
          <h1 className="ap-heading mt-4 text-xl font-bold">{modulId}</h1>
          <p className="ap-muted mt-2 text-sm">Bu modül henüz tanımlanmadı.</p>
        </div>
      );
  }
}
