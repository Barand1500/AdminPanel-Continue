import { Link } from 'react-router-dom';
import {
  logoBoyutSinifi,
  logoBoyutuNormalize,
  type LogoBoyutu,
} from '@/types/logo';

interface SiteMarkaAlaniProps {
  siteAdi: string;
  logoUrl?: string | null;
  logoBoyutu?: LogoBoyutu | string | null;
  yer: 'header' | 'footer';
  anaRenk?: string;
  ikincilRenk?: string;
  to?: string;
  className?: string;
  /** tam: logo + metin (varsayılan), sadece-logo: yalnızca logo, sadece-metin: yalnızca yazı */
  gorunum?: 'tam' | 'sadece-logo' | 'sadece-metin';
}

function markaMetni(siteAdi: string, yer: 'header' | 'footer') {
  const metin = siteAdi.trim();
  if (!metin) return null;

  const parcalar = metin.split(/\s+/).filter(Boolean);
  const geriKalan = parcalar.slice(1).join(' ');

  if (!geriKalan) {
    return (
      <div className="min-w-0 leading-none">
        <span
          className={`block truncate font-black tracking-tight ${yer === 'header' ? 'text-xl' : 'text-lg'}`}
          style={{ color: 'var(--color-text)' }}
        >
          {metin}
        </span>
      </div>
    );
  }

  const ilk = parcalar[0];

  if (yer === 'header') {
    return (
      <div className="min-w-0 leading-none">
        <span
          className="block truncate text-xl font-black tracking-tight"
          style={{ color: 'var(--color-text)' }}
        >
          {ilk}
        </span>
        <span className="block truncate text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {geriKalan}
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-0 leading-none">
      <span className="block truncate text-lg font-black" style={{ color: 'var(--color-text)' }}>
        {ilk}
      </span>
      <span className="block truncate text-[8px] font-bold uppercase tracking-[0.2em] text-primary">
        {geriKalan}
      </span>
    </div>
  );
}

export function SiteMarkaAlani({
  siteAdi,
  logoUrl,
  logoBoyutu,
  yer,
  anaRenk = '#7c3aed',
  ikincilRenk = '#a78bfa',
  to = '/',
  className = '',
  gorunum = 'tam',
}: SiteMarkaAlaniProps) {
  const boyut = logoBoyutuNormalize(logoBoyutu);
  const metin = siteAdi.trim();
  const logoGoster = gorunum !== 'sadece-metin';
  const metinGoster = gorunum !== 'sadece-logo';

  const icerik = (
    <>
      {logoGoster &&
        (logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className={logoBoyutSinifi(boyut, yer)}
            aria-hidden
          />
        ) : metin ? (
          <div
            className={`flex shrink-0 items-center justify-center rounded-xl font-black text-white shadow-md ${
              yer === 'header' ? 'h-10 w-10 text-lg' : 'h-10 w-10 text-lg'
            }`}
            style={{
              background: `linear-gradient(135deg, ${anaRenk}, ${ikincilRenk})`,
            }}
          >
            {metin.charAt(0).toUpperCase()}
          </div>
        ) : null)}
      {metinGoster && markaMetni(siteAdi, yer)}
    </>
  );

  if (!logoGoster && !metinGoster) return null;
  if (logoGoster && !metinGoster && !logoUrl && !metin) return null;
  if (!logoGoster && metinGoster && !metin) return null;

  return (
    <Link
      to={to}
      className={`flex min-w-0 max-w-full shrink-0 items-center gap-2 overflow-hidden ${className}`}
    >
      {icerik}
    </Link>
  );
}
