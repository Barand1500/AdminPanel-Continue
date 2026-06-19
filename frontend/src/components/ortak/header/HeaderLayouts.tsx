import type { Dispatch, SetStateAction } from 'react';
import type { SiteAyarlari } from '@/types/site';
import type { HeaderVeri } from './useHeaderVeri';
import {
  UstBant,
  MarkaAlani,
  IkinciMarka,
  AramaAlani,
  IkonGrubu,
  DesktopMenu,
  KategoriAramaSatiri,
  MobilMenuPanel,
  HeaderGovde,
  CtaLink,
} from './HeaderOrtakParcalar';
import { KategoriMenu } from '../KategoriMenu';

interface HeaderLayoutProps {
  veri: HeaderVeri;
  ayarlar?: SiteAyarlari | null;
  menuAcik: boolean;
  setMenuAcik: Dispatch<SetStateAction<boolean>>;
}

export function HeaderKlasik({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde
        veri={veri}
        altSatir={<KategoriAramaSatiri veri={veri} />}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-[min(100%,280px)] sm:max-w-xs" />
          <DesktopMenu menu={veri.cevrilmisMenu} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderSade({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <HeaderGovde veri={veri} className="site-header-varyant-sade">
      <div className="container-site flex h-14 items-center justify-between gap-4">
        <MarkaAlani veri={veri} className="max-w-[220px]" />
        <DesktopMenu menu={veri.cevrilmisMenu} className="gap-4" />
        <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
  );
}

export function HeaderKompakt({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  const yukseklik = veri.tipEk.kompaktYukseklik ?? 48;
  return (
    <HeaderGovde veri={veri} className="site-header-varyant-kompakt">
      <div className="container-site flex items-center justify-between gap-4" style={{ minHeight: `${yukseklik}px` }}>
        <MarkaAlani veri={veri} className="max-w-[200px]" />
        <DesktopMenu menu={veri.cevrilmisMenu} className="gap-3" />
        <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
  );
}

export function HeaderMerkezLogo({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className="site-header-varyant-merkez-logo">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <DesktopMenu menu={veri.menuSol} className="flex-1 justify-end" />
          <MarkaAlani veri={veri} className="mx-4 max-w-[220px] justify-center" />
          <DesktopMenu menu={veri.menuSag} className="flex-1" />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderAramaOdakli({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className="site-header-varyant-arama-odakli">
        <div className="container-site py-3">
          <div className="flex items-center gap-4">
            <MarkaAlani veri={veri} className="max-w-[230px]" />
            <AramaAlani veri={veri} className="flex-1" />
            <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
          </div>
          <div className="mt-3 hidden border-t pt-3 lg:block" style={{ borderColor: 'var(--color-border)' }}>
            <DesktopMenu menu={veri.cevrilmisMenu} className="justify-center" />
          </div>
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderModern({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <HeaderGovde veri={veri} className="site-header-varyant-modern">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <MarkaAlani veri={veri} className="max-w-[240px]" />
        <DesktopMenu menu={veri.cevrilmisMenu} className="gap-6" />
        <div className="flex items-center gap-2">
          <CtaLink veri={veri} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
  );
}

export function HeaderKurumsal({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde
        veri={veri}
        className="site-header-varyant-kurumsal"
        altSatir={
          veri.tipEk.destekMetni ? (
            <div className="border-t py-2 text-center text-xs font-semibold" style={{ borderColor: 'var(--color-border)' }}>
              {veri.tipEk.destekMetni}
            </div>
          ) : undefined
        }
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-[250px]" />
          <DesktopMenu menu={veri.cevrilmisMenu} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderMegaMenu({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde
        veri={veri}
        className="site-header-varyant-mega-menu"
        altSatir={<KategoriAramaSatiri veri={veri} />}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-[250px]" />
          <DesktopMenu menu={veri.cevrilmisMenu} />
          <IkinciMarka veri={veri} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderSeffafHero({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <HeaderGovde veri={veri} className="site-header-varyant-seffaf-hero">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <MarkaAlani veri={veri} className="max-w-[250px]" />
        <DesktopMenu menu={veri.cevrilmisMenu} />
        <div className="flex items-center gap-2">
          <CtaLink veri={veri} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
  );
}

export function HeaderSplit({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <>
      <UstBant veri={veri} ayarlar={ayarlar} />
      <HeaderGovde veri={veri} className="site-header-varyant-split">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <MarkaAlani veri={veri} className="max-w-[220px]" />
            {veri.kategoriMenuGoster && (
              <KategoriMenu
                baslikMetni={veri.kategoriBaslikMetni}
                acilisModu={veri.header.kategori?.acilisModu}
                kategoriler={veri.cevrilmisKategoriler}
                mega={veri.varsayilanMenuStil.mega}
                kolonSayisi={veri.varsayilanMenuStil.kolonSayisi}
              />
            )}
          </div>
          <div className="hidden min-w-[300px] flex-1 lg:block">
            <AramaAlani veri={veri} />
          </div>
          <DesktopMenu menu={veri.cevrilmisMenu} />
          <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </HeaderGovde>
    </>
  );
}

export function HeaderLayoutSec(props: HeaderLayoutProps) {
  switch (props.veri.headerTipi) {
    case 'sade':
      return <HeaderSade {...props} />;
    case 'kompakt':
      return <HeaderKompakt {...props} />;
    case 'merkez-logo':
      return <HeaderMerkezLogo {...props} />;
    case 'arama-odakli':
      return <HeaderAramaOdakli {...props} />;
    case 'modern':
      return <HeaderModern {...props} />;
    case 'kurumsal':
      return <HeaderKurumsal {...props} />;
    case 'mega-menu':
      return <HeaderMegaMenu {...props} />;
    case 'seffaf-hero':
      return <HeaderSeffafHero {...props} />;
    case 'split':
      return <HeaderSplit {...props} />;
    case 'klasik':
    default:
      return <HeaderKlasik {...props} />;
  }
}
