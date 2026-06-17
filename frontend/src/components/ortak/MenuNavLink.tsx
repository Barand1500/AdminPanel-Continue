import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { MenuOgesi, SayfaAcilisModu } from '@/types/site';
import { anchorLinkMi, hariciLinkMi, linktenSlugCikar } from '@/utils/menuYardimci';
import { useSayfaModal } from '@/contexts/SayfaModalContext';

interface MenuNavLinkProps {
  oge: MenuOgesi;
  className: string;
  style?: CSSProperties;
  onClick?: () => void;
}

function acilisModuCoz(oge: MenuOgesi): SayfaAcilisModu {
  if (oge.acilisModu) return oge.acilisModu;
  if (oge.yeniSekme) return 'yeni_sekme';
  return 'normal';
}

export function MenuNavLink({ oge, className, style, onClick }: MenuNavLinkProps) {
  const { modalAc } = useSayfaModal();
  const mod = acilisModuCoz(oge);
  const harici = hariciLinkMi(oge.yol);
  const anchor = anchorLinkMi(oge.yol);

  if (mod === 'modal' && !harici && !anchor) {
    const slug = linktenSlugCikar(oge.yol);
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => {
          onClick?.();
          if (slug) modalAc(slug);
        }}
      >
        {oge.baslik}
      </button>
    );
  }

  if (mod === 'yeni_sekme' || harici || anchor) {
    return (
      <a
        href={oge.yol}
        className={className}
        style={style}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
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
