import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import { headerAyarlariBirlestir, headerMarkaMetni } from '@/types/header';
import type { ParaBirimiKaydi } from '@/types/header';
import { headerLogoUrl } from '@/types/logo';
import { KategoriMenu } from './KategoriMenu';
import { TemaToggle } from './TemaToggle';
import { HeaderIkon } from './HeaderIkon';
import { MenuNavLink } from './MenuNavLink';
import { MenuDropdown } from './MenuDropdown';
import { SiteMarkaAlani } from './SiteMarkaAlani';

interface SiteHeaderProps {
  siteAdi: string;
  ayarlar?: SiteAyarlari | null;
  menuOgeleri: MenuOgesi[];
}

function kurDegeri(k: ParaBirimiKaydi): string {
  if (k.kod === 'TRY') return '1,0000';
  const deger = k.guncelKur ?? k.manuelKur;
  if (deger == null) return '—';
  return deger.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function aramaSinifi(stil: 'yuvarlak' | 'kare' | 'minimal') {
  if (stil === 'kare') return 'input-search input-search-kare';
  if (stil === 'minimal') return 'input-search input-search-minimal';
  return 'input-search';
}

export function SiteHeader({ siteAdi, ayarlar, menuOgeleri }: SiteHeaderProps) {
  const [menuAcik, setMenuAcik] = useState(false);
  const header = headerAyarlariBirlestir(ayarlar);
  const ustBant = header.ustBant!;
  const ikonlar = header.ikonlar!;
  const kategori = header.kategori!;
  const arama = header.arama!;
  const kurlar = (header.kurlar ?? []).filter((k) => k.kod !== 'TRY').sort((a, b) => a.sira - b.sira);
  const anaRenk = ayarlar?.anaRenk ?? '#7c3aed';
  const ikincilRenk = ayarlar?.ikincilRenk ?? '#a78bfa';
  const logoUrl = headerLogoUrl(ayarlar);
  const markaMetni = headerMarkaMetni(header, siteAdi);

  return (
    <>
      <div className="bg-primary text-white">
        <div className="container-site flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-sm">
          <p className="max-w-xl opacity-95">{header.slogan}</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
            {ayarlar?.telefon && (
              <a href={`tel:${ayarlar.telefon.replace(/\s/g, '')}`} className="opacity-90 hover:opacity-100">
                📞 {ayarlar.telefon}
              </a>
            )}
            {ayarlar?.email && (
              <a href={`mailto:${ayarlar.email}`} className="opacity-90 hover:opacity-100">
                ✉️ {ayarlar.email}
              </a>
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

      <header className="site-header sticky top-0 z-40 border-b shadow-sm">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <SiteMarkaAlani
            siteAdi={markaMetni}
            logoUrl={logoUrl}
            logoBoyutu={header.logoBoyutu}
            yer="header"
            anaRenk={anaRenk}
            ikincilRenk={ikincilRenk}
            className="max-w-[min(100%,280px)] sm:max-w-xs"
          />

          <nav className="hidden items-center gap-5 lg:flex">
            {menuOgeleri.map((oge, i) =>
              oge.altOgeler && oge.altOgeler.length > 0 ? (
                <MenuDropdown
                  key={`${oge.yol}-${i}`}
                  oge={oge}
                  className=""
                  linkClassName="flex items-center gap-1 text-sm font-medium transition hover:text-primary"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              ) : (
                <MenuNavLink
                  key={`${oge.yol}-${i}`}
                  oge={oge}
                  className="text-sm font-medium transition hover:text-primary"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              )
            )}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <TemaToggle tema={ikonlar.tema} />
            <Link
              to="/hesabim"
              className="rounded-full p-2 transition hover:bg-accent hover:text-primary"
              style={{ color: 'var(--color-text-muted)' }}
              title="Hesabım"
            >
              <HeaderIkon ikon={ikonlar.hesap} grup="hesap" />
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 lg:hidden"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={() => setMenuAcik((a) => !a)}
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
          </div>
        </div>

        <div className="site-header-alt border-t py-3" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}>
          <div className="container-site flex gap-3">
            <KategoriMenu
              baslikMetni={kategori.baslikMetni}
              acilisModu={kategori.acilisModu}
            />
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <HeaderIkon ikon={arama.ikon} grup="arama" className="h-5 w-5" />
              </span>
              <input
                type="search"
                placeholder={arama.placeholder}
                className={aramaSinifi(arama.stil)}
              />
            </div>
          </div>
        </div>

        {menuAcik && (
          <nav
            className="border-t px-4 py-3 lg:hidden"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-elevated)' }}
          >
            {menuOgeleri.map((oge, i) => (
              <div key={`${oge.yol}-${i}`}>
                <MenuNavLink
                  oge={oge}
                  onClick={() => setMenuAcik(false)}
                  className="block border-b py-3 text-sm font-medium last:border-0"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                />
                {oge.altOgeler?.map((alt) => (
                  <MenuNavLink
                    key={alt.yol}
                    oge={alt}
                    onClick={() => setMenuAcik(false)}
                    className="block border-b py-2.5 pl-4 text-sm last:border-0"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                  />
                ))}
              </div>
            ))}
            <div
              className="mt-2 flex flex-wrap items-center gap-3 border-t pt-3 text-sm font-medium"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <TemaToggle tema={ikonlar.tema} />
              <Link to="/hesabim" onClick={() => setMenuAcik(false)} className="text-primary">
                Hesabım
              </Link>
              <Link to="/favoriler" onClick={() => setMenuAcik(false)} className="text-primary">
                Favoriler
              </Link>
              <Link to="/sepet" onClick={() => setMenuAcik(false)} className="text-primary">
                Sepetim
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
