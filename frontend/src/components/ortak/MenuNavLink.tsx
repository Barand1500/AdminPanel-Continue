import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { MenuOgesi } from '@/types/site';
import { anchorLinkMi, hariciLinkMi } from '@/utils/menuYardimci';

interface MenuNavLinkProps {
  oge: MenuOgesi;
  className: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function MenuNavLink({ oge, className, style, onClick }: MenuNavLinkProps) {
  const yeniSekme = oge.yeniSekme ?? false;
  const harici = hariciLinkMi(oge.yol);
  const anchor = anchorLinkMi(oge.yol);

  if (yeniSekme || harici || anchor) {
    return (
      <a
        href={oge.yol}
        className={className}
        style={style}
        onClick={onClick}
        {...(yeniSekme ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {oge.baslik}
      </a>
    );
  }

  return (
    <Link to={oge.yol} className={className} style={style} onClick={onClick}>
      {oge.baslik}
    </Link>
  );
}
