import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SiteAyarlari } from '@/types/site';
import type { MenuOgesi } from '@/types/site';
import { KategoriMenu } from '../KategoriMenu';
import { TemaToggle } from '../TemaToggle';
import { HeaderIkon } from '../HeaderIkon';
import { MenuNavLink } from '../MenuNavLink';
import { MenuDropdown } from '../MenuDropdown';
import { SiteMarkaAlani } from '../SiteMarkaAlani';
import { HeaderDilSecici } from '../HeaderDilSecici';
import { SosyalMedyaIkonSatirlari } from '../SosyalMedyaIkon';
import type { HeaderVeri } from './useHeaderVeri';
import { aramaSinifi, kurDegeri, varsayilanMenuStil } from './useHeaderVeri';
import type { LogoBoyutu } from '@/types/logo';

function MenuOgeGoster({
  oge,
  linkClassName,
  style,
  onClick,
  mobil,
}: {
  oge: MenuOgesi;
  linkClassName: string;
  style?: React.CSSProperties;
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
  return <MenuNavLink oge={oge} className={linkClassName} style={style} onClick={onClick} />;
}

export function UstBant({
  veri,
  ayarlar,
  sloganGoster = true,
  className = '',
}: {
  veri: HeaderVeri;
  ayarlar?: SiteAyarlari | null;
  sloganGoster?: boolean;
  className?: string;
}) {
  const { header, ustBant, kurlar } = veri;
  return (
    <div className={`site-header-ust-bant bg-primary text-white ${className}`}>
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
        {sloganGoster ? (
          <p className="max-w-xl opacity-95">{header.slogan}</p>
        ) : (
          <span className="opacity-90">{veri.tipEk.destekMetni || header.slogan}</span>
        )}
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
            kurlar.map((kur, i) => (
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

export function MarkaAlani({
  veri,
  className = '',
  gorunum,
}: {
  veri: HeaderVeri;
  className?: string;
  gorunum?: 'tam' | 'sadece-logo' | 'sadece-metin';
}) {
  return (
    <SiteMarkaAlani
      siteAdi={veri.markaMetni}
      logoUrl={veri.logoUrl}
      logoBoyutu={veri.header.logoBoyutu}
      yer="header"
      anaRenk={veri.anaRenk}
      ikincilRenk={veri.ikincilRenk}
      gorunum={gorunum}
      className={className}
    />
  );
}

export function IkinciMarka({
  url,
  metin,
  boyut,
  anaRenk,
  ikincilRenk,
}: {
  url?: string | null;
  metin?: string | null;
  boyut?: LogoBoyutu;
  anaRenk: string;
  ikincilRenk: string;
}) {
  if (!url && !metin?.trim()) return null;
  return (
    <SiteMarkaAlani
      siteAdi={metin ?? ''}
      logoUrl={url}
      logoBoyutu={boyut}
      yer="header"
      anaRenk={anaRenk}
      ikincilRenk={ikincilRenk}
      className="site-header-ikinci-marka max-w-[120px] opacity-80"
    />
  );
}

export function AramaAlani({
  veri,
  className = '',
  genis = false,
}: {
  veri: HeaderVeri;
  className?: string;
  genis?: boolean;
}) {
  const { arama, tipEk } = veri;
  if (!tipEk.aramaGoster && tipEk.aramaModu === 'ikon') {
    return (
      <button
        type="button"
        className={`site-header-arama-ikon rounded-full p-2 transition hover:bg-accent hover:text-primary ${className}`}
        style={{ color: 'var(--color-text-muted)' }}
        aria-label="Ara"
      >
        <HeaderIkon ikon={arama.ikon} grup="arama" className="h-5 w-5" />
      </button>
    );
  }
  if (!tipEk.aramaGoster) return null;

  return (
    <div className={`relative ${genis ? 'flex-1' : 'min-w-0 flex-1'} ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
        <HeaderIkon ikon={arama.ikon} grup="arama" className="h-5 w-5" />
      </span>
      <input type="search" placeholder={arama.placeholder} className={aramaSinifi(arama.stil)} />
    </div>
  );
}

export function IkonGrubu({
  veri,
  hamburger = true,
  className = '',
}: {
  veri: HeaderVeri;
  hamburger?: boolean;
  className?: string;
}) {
  const { header, ikonlar, cevir } = veri;
  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {header.dilDestegi?.aktif && <HeaderDilSecici ayar={header.dilDestegi} />}
      <TemaToggle tema={ikonlar.tema} />
      <Link
        to="/hesabim"
        className="rounded-full p-2 transition hover:bg-accent hover:text-primary"
        style={{ color: 'var(--color-text-muted)' }}
        title={cevir('site.hesabim', 'Hesabım')}
      >
        <HeaderIkon ikon={ikonlar.hesap} grup="hesap" />
      </Link>
      {hamburger && (
        <button
          type="button"
          className="site-header-hamburger rounded-lg p-2 lg:hidden"
          style={{ color: 'var(--color-text-muted)' }}
          onClick={() => veri.setMenuAcik((a) => !a)}
          aria-label="Menü"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={veri.menuAcik ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function DesktopMenu({
  veri,
  ogeler,
  className = '',
  mega = false,
}: {
  veri: HeaderVeri;
  ogeler?: MenuOgesi[];
  className?: string;
  mega?: boolean;
}) {
  const menu = ogeler ?? veri.cevrilmisMenu;
  const stil = varsayilanMenuStil;
  return (
    <nav
      className={`site-header-nav hidden items-center gap-5 lg:flex ${mega ? 'site-header-nav--mega' : ''} ${className}`}
    >
      {menu.map((oge, i) => (
        <MenuOgeGoster
          key={`${oge.yol}-${i}`}
          oge={oge}
          linkClassName={stil.linkClassName}
          style={stil.style}
        />
      ))}
    </nav>
  );
}

export function KategoriAramaSatiri({
  veri,
  mega = false,
  className = '',
}: {
  veri: HeaderVeri;
  mega?: boolean;
  className?: string;
}) {
  const { kategoriMenuGoster, cevrilmisKategoriler, kategoriBaslikMetni, kategori } = veri;
  return (
    <div
      className={`site-header-alt border-t py-3 ${mega ? 'site-header-alt--mega' : ''} ${className}`}
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
    >
      <div className="container-site flex gap-3">
        {kategoriMenuGoster && (
          <KategoriMenu
            baslikMetni={kategoriBaslikMetni}
            acilisModu={kategori.acilisModu}
            kategoriler={cevrilmisKategoriler}
            mega={mega}
            kolonSayisi={veri.tipEk.megaMenuKolon}
          />
        )}
        <AramaAlani veri={veri} genis />
      </div>
    </div>
  );
}

export function MobilMenuPanel({ veri }: { veri: HeaderVeri }) {
  if (!veri.menuAcik) return null;
  return (
    <nav
      className="site-header-mobil border-t px-4 py-3 lg:hidden"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
    >
      {veri.cevrilmisMenu.map((oge, i) => (
        <div key={`${oge.yol}-${i}`}>
          <MenuOgeGoster
            oge={oge}
            onClick={() => veri.setMenuAcik(false)}
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
        <TemaToggle tema={veri.ikonlar.tema} />
        <Link to="/hesabim" onClick={() => veri.setMenuAcik(false)} className="text-primary">
          {veri.cevir('site.hesabim', 'Hesabım')}
        </Link>
      </div>
    </nav>
  );
}

export function HeaderGovde({
  veri,
  children,
  className = '',
  yukseklik,
}: {
  veri: HeaderVeri;
  children: ReactNode;
  className?: string;
  yukseklik?: number;
}) {
  const scrollStil = veri.tipEk.scrollSonrasiStil ?? 'beyaz';
  return (
    <header
      className={`site-header sticky top-0 z-40 border-b shadow-sm ${className}`}
      data-scroll-stil={scrollStil}
      style={yukseklik ? { ['--header-yukseklik' as string]: `${yukseklik}px` } : undefined}
    >
      {children}
    </header>
  );
}

export function CtaLink({
  metin,
  link,
  anaRenk,
  className = '',
}: {
  metin?: string;
  link?: string;
  anaRenk: string;
  className?: string;
}) {
  if (!metin?.trim()) return null;
  const hedef = link?.trim() || '#';
  const dis = hedef.startsWith('http');
  const sinif = `site-header-cta rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 ${className}`;
  if (dis) {
    return (
      <a href={hedef} target="_blank" rel="noreferrer" className={sinif} style={{ backgroundColor: anaRenk }}>
        {metin}
      </a>
    );
  }
  return (
    <Link to={hedef} className={sinif} style={{ backgroundColor: anaRenk }}>
      {metin}
    </Link>
  );
}

export { MenuOgeGoster };
