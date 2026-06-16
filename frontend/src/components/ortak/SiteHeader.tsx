import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { SiteAyarlari, MenuOgesi } from '@/types/site';
import { headerAyarlariBirlestir } from '@/types/header';
import type { ParaBirimiKaydi } from '@/types/header';
import { KategoriMenu } from './KategoriMenu';
import { TemaToggle } from './TemaToggle';
import { HeaderIkon } from './HeaderIkon';
import { MenuNavLink } from './MenuNavLink';

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

      <header className="site-header sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            {header.logoUrl ? (
              <img src={header.logoUrl} alt={siteAdi} className="h-10 w-auto" />
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-blue-500 text-lg font-black text-white shadow-md">
                  {siteAdi.charAt(0).toUpperCase()}
                </div>
                <div className="leading-none">
                  <span className="block text-xl font-black tracking-tight text-slate-900">
                    {siteAdi.split(' ')[0]?.toLowerCase() ?? siteAdi}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                    {siteAdi.split(' ').slice(1).join(' ') || 'Teknoloji'}
                  </span>
                </div>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {menuOgeleri.map((oge, i) => (
              <MenuNavLink
                key={`${oge.yol}-${i}`}
                oge={oge}
                className="text-sm font-medium text-slate-700 transition hover:text-primary"
              />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <TemaToggle tema={ikonlar.tema} />
            <Link
              to="/hesabim"
              className="rounded-full p-2 text-slate-600 transition hover:bg-accent hover:text-primary"
              title="Hesabım"
            >
              <HeaderIkon ikon={ikonlar.hesap} grup="hesap" />
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 lg:hidden"
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

        <div className="site-header-alt border-t border-slate-100 bg-white py-3">
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
          <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            {menuOgeleri.map((oge, i) => (
              <MenuNavLink
                key={`${oge.yol}-${i}`}
                oge={oge}
                onClick={() => setMenuAcik(false)}
                className="block border-b border-slate-50 py-3 text-sm font-medium text-slate-700 last:border-0"
              />
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-sm font-medium">
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
