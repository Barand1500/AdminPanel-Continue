import type { CSSProperties, Dispatch, SetStateAction } from 'react';
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
import { HeaderDilSecici } from '../HeaderDilSecici';
import { SosyalMedyaIkonSatirlari } from '../SosyalMedyaIkon';

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
          <div className="flex items-center gap-2">
            <CtaLink veri={veri} className="hidden sm:inline-flex" />
            <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
          </div>
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

export function HeaderOverlayKurumsal({
  veri,
  ayarlar,
  menuAcik,
  setMenuAcik,
  ustBantGoster = true,
}: HeaderLayoutProps & { ustBantGoster?: boolean }) {
  const telefon = ayarlar?.telefon?.trim();
  const email = ayarlar?.email?.trim();
  const ust = veri.header.ustBant;
  const ctaMetin = veri.tipEk.ctaMetni?.trim() || 'Katalog';
  const ctaLink = veri.tipEk.ctaLink?.trim() || '/iletisim';
  const konumSinifi = veri.tipEk.sabit !== false ? 'fixed' : 'absolute';

  return (
    <div className={`site-header-overlay-shell ${konumSinifi} inset-x-0 top-0 z-50`}>
      {ustBantGoster && (
        <div className="site-header-overlay-ust">
          <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {ust?.telefonGoster !== false && telefon && (
                <a href={`tel:${telefon.replace(/\s/g, '')}`} className="site-header-overlay-iletisim">
                  <span aria-hidden>📞</span>
                  <span>{telefon}</span>
                </a>
              )}
              {ust?.emailGoster !== false && email && (
                <a href={`mailto:${email}`} className="site-header-overlay-iletisim">
                  <span aria-hidden>✉️</span>
                  <span>{email}</span>
                </a>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {ust?.sosyalGoster !== false && ayarlar?.sosyalMedyaJson && (
                <SosyalMedyaIkonSatirlari
                  sosyal={ayarlar.sosyalMedyaJson}
                  className="site-header-overlay-sosyal"
                  ikonSinifi="h-3.5 w-3.5"
                />
              )}
              {veri.header.dilDestegi?.aktif && (
                <HeaderDilSecici ayar={veri.header.dilDestegi} className="site-header-overlay-dil" satir />
              )}
            </div>
          </div>
        </div>
      )}

      <header
        className={`site-header site-header-overlay-nav site-header-varyant-overlay ${veri.tipSinifi} border-0 bg-transparent shadow-none`}
      >
        <div className="container-site flex min-h-[4rem] items-center justify-between gap-4 py-2 sm:min-h-[4.5rem]">
          <MarkaAlani veri={veri} className="site-header-overlay-marka max-w-[220px] shrink-0" />
          <DesktopMenu
            menu={veri.cevrilmisMenu}
            className="site-header-overlay-nav-menu hidden flex-1 justify-center gap-1 lg:flex xl:gap-2"
            linkClassName="site-header-overlay-link site-menu-nav-link"
          />
          <div className="flex shrink-0 items-center gap-2">
            <Link to={ctaLink} className="site-header-overlay-cta hidden sm:inline-flex">
              <span aria-hidden>🖥️</span>
              <span>{ctaMetin}</span>
            </Link>
            <AramaAlani veri={veri} className="site-header-overlay-arama" />
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
    </div>
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

function KatalogPdfIkon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 14h7M8.5 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function HeaderImzaKurumsal({ veri, ayarlar, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  const telefon = ayarlar?.telefon?.trim();
  const email = ayarlar?.email?.trim();
  const ust = veri.header.ustBant;
  const ctaMetin = veri.tipEk.ctaMetni?.trim() || 'Katalog';
  const ctaLink = veri.tipEk.ctaLink?.trim() || '/katalog';
  const sabit = veri.tipEk.sabit !== false;
  const sabitSinifi = sabit ? 'fixed inset-x-0 top-0 z-40' : 'relative z-40';
  const renkler = {
    '--imza-ana': veri.tipEk.arkaPlanRengi || '#0b2a77',
    '--imza-ust': veri.tipEk.ustBantRengi || '#08245f',
    '--imza-metin': veri.tipEk.metinRengi || '#ffffff',
    '--imza-btn': veri.tipEk.butonRengi || '#eef4ff',
  } as CSSProperties;

  return (
    <>
      {sabit && <div className={`site-header-imza-bosluk ${ust ? 'h-[6.4rem]' : 'h-[4.5rem]'}`} aria-hidden />}
      <div className={`site-header-imza-shell ${sabitSinifi}`} style={renkler}>
      <div className="site-header-imza-ust">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {ust?.telefonGoster !== false && telefon && (
              <a href={`tel:${telefon.replace(/\s/g, '')}`} className="site-header-imza-iletisim">
                <span aria-hidden>📞</span>
                <span>{telefon}</span>
              </a>
            )}
            {ust?.emailGoster !== false && email && (
              <a href={`mailto:${email}`} className="site-header-imza-iletisim">
                <span aria-hidden>✉️</span>
                <span>{email}</span>
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {ust?.sosyalGoster !== false && ayarlar?.sosyalMedyaJson && (
              <SosyalMedyaIkonSatirlari
                sosyal={ayarlar.sosyalMedyaJson}
                className="site-header-imza-sosyal"
                ikonSinifi="h-3.5 w-3.5"
              />
            )}
            {veri.header.dilDestegi?.aktif && (
              <HeaderDilSecici ayar={veri.header.dilDestegi} className="site-header-imza-dil" satir />
            )}
          </div>
        </div>
      </div>

      <header className={`site-header site-header-imza-kurumsal site-header-varyant-imza-kurumsal ${veri.tipSinifi} border-0 shadow-none`}>
        <div className="container-site flex min-h-[4.5rem] items-center justify-between gap-4 py-2">
          <MarkaAlani veri={veri} className="site-header-imza-marka max-w-[220px] shrink-0" />
          <DesktopMenu
            menu={veri.cevrilmisMenu}
            className="site-header-imza-nav flex-1 justify-end gap-1 xl:gap-2"
            linkClassName="site-header-imza-link site-menu-nav-link"
          />
          <div className="flex shrink-0 items-center gap-2">
            <Link to={ctaLink} className="site-header-imza-katalog hidden sm:inline-flex">
              <KatalogPdfIkon />
              <span>{ctaMetin}</span>
            </Link>
            <AramaAlani veri={veri} className="site-header-imza-arama" />
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
      </div>
    </>
  );
}

export function HeaderYuzenHap({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  return (
    <div className="site-header-yuzen-shell">
      <header className={`site-header site-header-yuzen-hap site-header-varyant-yuzen-hap ${veri.tipSinifi} border-0 bg-transparent shadow-none`}>
        <div className="container-site">
          <div className="site-header-yuzen-hap-bar">
            <MarkaAlani veri={veri} className="max-w-[140px] shrink-0" />
            <DesktopMenu
              menu={veri.cevrilmisMenu}
              className="flex-1 justify-center gap-6"
              linkClassName="site-menu-nav-link text-[13px] font-semibold tracking-tight opacity-80 transition hover:opacity-100"
            />
            <div className="flex shrink-0 items-center gap-1">
              <AramaAlani veri={veri} />
              <CtaLink veri={veri} className="site-header-yuzen-cta hidden sm:inline-flex" />
              <IkonGrubu
                veri={veri}
                menuAcik={menuAcik}
                onMenuToggle={() => setMenuAcik((v) => !v)}
                sadeceHamburger
              />
            </div>
          </div>
        </div>
        <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
      </header>
    </div>
  );
}

export function HeaderMasthead({ veri, menuAcik, setMenuAcik }: HeaderLayoutProps) {
  const ustMetin = veri.tipEk.destekMetni?.trim() || veri.header.slogan?.trim() || '';

  return (
    <HeaderGovde veri={veri} className="site-header-varyant-masthead">
      <div className="container-site py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <p className="site-header-masthead-ust hidden min-w-0 truncate sm:block">{ustMetin}</p>
          <p className="site-header-masthead-ust sm:hidden" aria-hidden />
          <MarkaAlani veri={veri} className="site-header-masthead-marka justify-self-center" />
          <div className="flex justify-end">
            <IkonGrubu veri={veri} menuAcik={menuAcik} onMenuToggle={() => setMenuAcik((v) => !v)} />
          </div>
        </div>
        <div className="site-header-masthead-cizgi" />
        <DesktopMenu
          menu={veri.cevrilmisMenu}
          className="justify-center gap-7 pt-3"
          linkClassName="site-header-masthead-link site-menu-nav-link"
        />
      </div>
      <MobilMenuPanel veri={veri} menuAcik={menuAcik} onMenuKapat={() => setMenuAcik(false)} />
    </HeaderGovde>
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
    case 'imza-kurumsal':
      return <HeaderImzaKurumsal {...props} />;
    case 'yuzen-hap':
      return <HeaderYuzenHap {...props} />;
    case 'masthead':
      return <HeaderMasthead {...props} />;
    case 'klasik':
    default:
      return <HeaderKlasik {...props} />;
  }
}
