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
}

function markaMetni(siteAdi: string, yer: 'header' | 'footer') {
  const ilk = siteAdi.split(' ')[0]?.toLowerCase() ?? siteAdi;
  const geriKalan = siteAdi.split(' ').slice(1).join(' ') || 'Teknoloji';

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
}: SiteMarkaAlaniProps) {
  const boyut = logoBoyutuNormalize(logoBoyutu);
  const icerik = (
    <>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className={logoBoyutSinifi(boyut, yer)}
          aria-hidden
        />
      ) : (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl font-black text-white shadow-md ${
            yer === 'header' ? 'h-10 w-10 text-lg' : 'h-10 w-10 text-lg'
          }`}
          style={{
            background: `linear-gradient(135deg, ${anaRenk}, ${ikincilRenk})`,
          }}
        >
          {siteAdi.charAt(0).toUpperCase()}
        </div>
      )}
      {markaMetni(siteAdi, yer)}
    </>
  );

  return (
    <Link
      to={to}
      className={`flex min-w-0 max-w-full shrink-0 items-center gap-2 overflow-hidden ${className}`}
    >
      {icerik}
    </Link>
  );
}
