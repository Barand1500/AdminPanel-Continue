import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import type { HeaderVeri } from './useHeaderVeri';
import { aramaSinifi, kurDegeri } from './useHeaderVeri';
import { KategoriMenu } from '../KategoriMenu';
import { TemaToggle } from '../TemaToggle';
import { HeaderIkon } from '../HeaderIkon';
import { MenuNavLink } from '../MenuNavLink';
import { MenuDropdown } from '../MenuDropdown';
import { SiteMarkaAlani } from '../SiteMarkaAlani';
import { HeaderDilSecici } from '../HeaderDilSecici';
import { SosyalMedyaIkonSatirlari } from '../SosyalMedyaIkon';

export function MenuOgeGoster({
  oge,
  linkClassName,
  style,
  onClick,
  mobil,
}: {
  oge: MenuOgesi;
  linkClassName: string;
  style?: CSSProperties;
  onClick?: () => void;
  mobil?: boolean;
}) {
  if (oge.altOgeler && oge.altOgeler.length > 0) {
    return (
      <MenuDropdown
        oge={oge}
        className={mobil ? 'site-menu-dropdown-mobil' : ''}
        linkClassName={`flex items-center gap-1 ${linkClassName}`}
        style={style}
        onClick={onClick}
      />
    );
  }
  return (
    <MenuNavLink
      oge={oge}
      className={linkClassName}
      style={style}
      onClick={onClick}
    />
  );
}

export function UstBant({ veri, ayarlar }: { veri: HeaderVeri; ayarlar?: SiteAyarlari | null }) {
  const ustBant = veri.header.ustBant!;

  if (!ustBant) return null;

  return (
    <div className="bg-primary text-white">
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
        <p className="max-w-xl opacity-95">{veri.header.slogan}</p>
        <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
          {ustBant.telefonGoster && ayarlar?.telefon && (
            <a href={`tel:${ayarlar.telefon.replace(/\s/g, '')}`} className="opacity-90 hover:opacity-100">
              📞 {ayarlar.telefon}
            </a>
          )}
          {ustBant.emailGoster && ayarlar?.email && (
            <a href={`mailto:${ayarlar.email}`} className="opacity-90 hover:opacity-100">
              ✉️ {ayarlar.email}
            </a>
          )}
          {ustBant.sosyalGoster && ayarlar?.sosyalMedyaJson && (
            <SosyalMedyaIkonSatirlari sosyal={ayarlar.sosyalMedyaJson} ikonSinifi="h-5 w-5" />
          )}
          {ustBant.kurlarGoster &&
            veri.kurlar.map((kur, i) => (
              <span key={kur.id} className="whitespace-nowrap">
                {i > 0 && <span className="mr-3 opacity-40">·</span>}
                <span className="opacity-70">{kur.sembol}</span>{' '}
                <span className="font-semibold">{kurDegeri(kur)}</span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export function MarkaAlani({ veri, className = '' }: { veri: HeaderVeri; className?: string }) {
  return (
    <SiteMarkaAlani
      siteAdi={veri.markaMetni}
      logoUrl={veri.logoUrl}
      logoBoyutu={veri.header.logoBoyutu}
      yer="header"
      anaRenk={veri.anaRenk}
      ikincilRenk={veri.ikincilRenk}
      className={className}
    />
  );
}

export function IkinciMarka({ veri }: { veri: HeaderVeri }) {
  const metin = veri.tipEk.ikinciMarkaMetni?.trim();
  const logo = veri.tipEk.ikinciLogoUrl;

  if (!metin && !logo) return null;

  return (
    <SiteMarkaAlani
      siteAdi={metin ?? ''}
      logoUrl={logo}
      logoBoyutu="kucuk"
      yer="header"
      anaRenk={veri.anaRenk}
      ikincilRenk={veri.ikincilRenk}
      gorunum={logo ? 'tam' : 'sadece-metin'}
      className="hidden max-w-[220px] xl:flex"
    />
  );
}

export function AramaAlani({ veri, className = '' }: { veri: HeaderVeri; className?: string }) {
  if (veri.tipEk.aramaGoster === false) return null;

  const arama = veri.header.arama!;
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
        <HeaderIkon ikon={arama.ikon} grup="arama" className="h-5 w-5" />
      </span>
      <input type="search" placeholder={arama.placeholder} className={aramaSinifi(arama.stil)} />
    </div>
  );
}

export function IkonGrubu({
  veri,
  onMenuToggle,
  menuAcik,
}: {
  veri: HeaderVeri;
  onMenuToggle?: () => void;
  menuAcik?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {veri.header.dilDestegi?.aktif && <HeaderDilSecici ayar={veri.header.dilDestegi} />}
      <TemaToggle tema={veri.header.ikonlar?.tema} />
      <Link
        to="/hesabim"
        className="rounded-full p-2 transition hover:bg-accent hover:text-primary"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <HeaderIkon ikon={veri.header.ikonlar!.hesap} grup="hesap" />
      </Link>
      {onMenuToggle && (
        <button
          type="button"
          className="rounded-lg p-2 lg:hidden"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={onMenuToggle}
          aria-label="Menü"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuAcik ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function DesktopMenu({
  menu,
  className = '',
}: {
  menu: MenuOgesi[];
  className?: string;
}) {
  return (
    <nav className={`site-header-nav hidden items-center gap-5 lg:flex ${className}`}>
      {menu.map((oge, i) => (
        <MenuOgeGoster
          key={`${oge.yol}-${i}`}
          oge={oge}
          linkClassName="site-menu-nav-link text-sm font-medium transition hover:text-primary"
          style={{ color: 'var(--color-text-muted)' }}
        />
      ))}
    </nav>
  );
}

export function KategoriAramaSatiri({ veri }: { veri: HeaderVeri }) {
  return (
    <div
      className="site-header-alt border-t py-3"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
    >
      <div className="container-site flex gap-3">
        {veri.kategoriMenuGoster && (
          <KategoriMenu
            baslikMetni={veri.kategoriBaslikMetni}
            acilisModu={veri.header.kategori?.acilisModu}
            kategoriler={veri.cevrilmisKategoriler}
            mega={veri.varsayilanMenuStil.mega}
            kolonSayisi={veri.varsayilanMenuStil.kolonSayisi}
          />
        )}
        <AramaAlani veri={veri} className="flex-1" />
      </div>
    </div>
  );
}

export function MobilMenuPanel({
  veri,
  menuAcik,
  onMenuKapat,
}: {
  veri: HeaderVeri;
  menuAcik: boolean;
  onMenuKapat: () => void;
}) {
  if (!menuAcik) return null;

  return (
    <nav
      className="border-t px-4 py-3 lg:hidden"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
    >
      {veri.cevrilmisMenu.map((oge, i) => (
        <div key={`${oge.yol}-${i}`}>
          <MenuOgeGoster
            oge={oge}
            onClick={onMenuKapat}
            linkClassName="block border-b py-3 text-sm font-medium last:border-0"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            mobil
          />
        </div>
      ))}
      <div
        className="mt-2 flex flex-wrap items-center gap-3 border-t pt-3 text-sm font-medium"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <TemaToggle tema={veri.header.ikonlar?.tema} />
        <Link to="/hesabim" onClick={onMenuKapat} className="text-primary">
          Hesabım
        </Link>
      </div>
    </nav>
  );
}

export function CtaLink({ veri, className = '' }: { veri: HeaderVeri; className?: string }) {
  const metin = veri.tipEk.ctaMetni?.trim();
  const link = veri.tipEk.ctaLink?.trim();
  if (!metin || !link) return null;

  return (
    <Link to={link} className={`btn-primary rounded-full px-4 py-2 text-xs sm:text-sm ${className}`}>
      {metin}
    </Link>
  );
}

export function HeaderGovde({
  veri,
  className = '',
  altSatir,
  children,
}: {
  veri: HeaderVeri;
  className?: string;
  altSatir?: ReactNode;
  children: ReactNode;
}) {
  return (
    <header className={`site-header sticky top-0 z-40 border-b shadow-sm ${veri.tipSinifi} ${className}`}>
      {children}
      {altSatir}
    </header>
  );
}
