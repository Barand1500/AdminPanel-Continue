import { Link } from 'react-router-dom';
import { anchorLinkMi, hariciLinkMi, metinCevir } from '@/utils/menuYardimci';
import type { FooterLink } from '@/types/footer';

interface FooterNavLinkProps {
  link: FooterLink;
  ikon: string | null;
  className?: string;
  cevir?: (anahtar: string, varsayilan?: string) => string;
}

export function FooterNavLink({
  link,
  ikon,
  className = 'site-footer-link group flex items-start gap-2',
  cevir,
}: FooterNavLinkProps) {
  const harici = hariciLinkMi(link.link);
  const anchor = anchorLinkMi(link.link);
  const yeniSekme = link.yeniSekme;
  const gosterilenAd = cevir ? metinCevir(cevir, link.ad) : link.ad;

  const icerik = (
    <>
      {ikon && <span className="mt-0.5 text-primary opacity-70 group-hover:opacity-100">{ikon}</span>}
      <span>{gosterilenAd}</span>
    </>
  );

  if (yeniSekme || harici || anchor) {
    return (
      <a
        href={link.link}
        className={className}
        {...(yeniSekme ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {icerik}
      </a>
    );
  }

  return (
    <Link to={link.link} className={className}>
      {icerik}
    </Link>
  );
}
