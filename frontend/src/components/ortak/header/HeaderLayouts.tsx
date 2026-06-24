import type { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import type { SiteAyarlari } from '@/types/site';
import { headerMarkaKapSinifi, logoBoyutuNormalize } from '@/types/logo';
import { kullaniciAlaniGoster } from '@/types/header';
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
  KompaktPillMenu,
  SadeMinimalIkonlar,
} from './HeaderOrtakParcalar';
import { HeaderIkon } from '../HeaderIkon';
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
      <div className="container-site border-b border-[var(--color-border)]/60 py-2">
        <div className="flex items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="hidden lg:block" />
          <MarkaAlani veri={veri} className="max-w-[160px] lg:justify-self-center" />
          <div className="ml-auto flex shrink-0 justify-end lg:ml-0">
            <SadeMinimalIkonlar veri={veri} />
            <IkonGrubu
              veri={veri}
              menuAcik={menuAcik}
              onMenuToggle={() => setMenuAcik((v) => !v)}
              sadeceHamburger
            />
          </div>
        </div>
      </div>
      <div className="container-site hidden py-2 lg:block">
        <DesktopMenu
          menu={veri.cevrilmisMenu}
          className="justify-center gap-7 text-xs tracking-wide"
          linkClassName="site-menu-nav-link text-xs font-normal opacity-80 transition hover:opacity-100"
        />
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
  );
}

export function HeaderKompakt({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  const yukseklik = veri.tipEk.kompaktYukseklik ?? 40;
  return (
    <HeaderGovde veri={veri} className="site-header-varyant-kompakt">
      <div
        className="container-site flex items-center gap-3 px-2"
        style={{ minHeight: `${yukseklik}px` }}
      >
        <MarkaAlani veri={veri} className="max-w-[88px] shrink-0 scale-90 origin-left" />
        <KompaktPillMenu menu={veri.cevrilmisMenu} />
        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <AramaAlani veri={veri} />
          {kullaniciAlaniGoster(veri.tipEk) && (
            <Link
              to="/hesabim"
              className="rounded p-1.5 opacity-90 transition hover:opacity-100"
              aria-label="Hesabım"
            >
              <HeaderIkon ikon={veri.header.ikonlar!.hesap} grup="hesap" className="h-4 w-4" />
            </Link>
          )}
          <IkonGrubu
            veri={veri}
            menuAcik={menuAcik}
            onMenuToggle={() => setMenuAcik((v) => !v)}
            sadeceHamburger
          />
        </div>
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
        <div className="container-site flex min-h-16 items-center justify-between gap-3 py-2">
          <DesktopMenu menu={veri.menuSol} className="order-2 flex-1 justify-end lg:order-1" />
          <MarkaAlani
            veri={veri}
            className={`order-1 shrink-0 lg:order-2 lg:mx-4 lg:justify-center ${headerMarkaKapSinifi(logoBoyutuNormalize(veri.header.logoBoyutu))}`}
          />
          <DesktopMenu menu={veri.menuSag} className="order-3 flex-1 lg:order-3" />
          <div className="order-4 ml-auto shrink-0 lg:ml-0">
            <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
          </div>
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
    <div className="site-header-hero-shell">
      <header
        className={`site-header site-header-seffaf-hero site-header-varyant-seffaf-hero ${veri.tipSinifi} absolute inset-x-0 top-0 z-50 border-0 bg-transparent shadow-none`}
      >
        <div className="container-site flex h-14 items-center justify-between gap-4">
          <MarkaAlani veri={veri} className="max-w-[140px] site-header-hero-marka" />
          <DesktopMenu
            menu={veri.cevrilmisMenu}
            className="site-header-hero-nav gap-6"
            linkClassName="site-menu-nav-link text-sm font-medium text-white/90 transition hover:text-white"
          />
          <div className="flex items-center gap-2">
            <CtaLink veri={veri} className="site-header-hero-cta" />
            <IkonGrubu
              veri={veri}
              menuAcik={menuAcik}
              onMenuToggle={() => setMenuAcik((v) => !v)}
              sadeceHamburger
            />
          </div>
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </header>

      <div className="site-header-hero-stage">
        <div className="site-header-hero-bg" aria-hidden />
        <div className="container-site site-header-hero-icerik">
          <p className="site-header-hero-etiket">Tamamen elektrikli</p>
          <h2 className="site-header-hero-baslik">Model S</h2>
          <p className="site-header-hero-alt">Geleceği bugünden sürün</p>
          <div className="site-header-hero-butonlar">
            <span className="site-header-hero-btn site-header-hero-btn--birincil">Özel Sipariş</span>
            <span className="site-header-hero-btn site-header-hero-btn--ikincil">Mevcut Envanter</span>
          </div>
        </div>
      </div>
    </div>
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
