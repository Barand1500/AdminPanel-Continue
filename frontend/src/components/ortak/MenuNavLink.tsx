import { Link } from 'react-router-dom';
<<<<<<< Updated upstream
import type { CSSProperties } from 'react';
import type { MenuOgesi } from '@/types/site';
=======
import type { MenuOgesi, SayfaAcilisModu } from '@/types/site';
>>>>>>> Stashed changes
import { anchorLinkMi, hariciLinkMi } from '@/utils/menuYardimci';
import { useSayfaModal } from '@/contexts/SayfaModalContext';
import { linktenSlugCikar } from '@/utils/menuYardimci';

interface MenuNavLinkProps {
  oge: MenuOgesi;
  className: string;
  style?: CSSProperties;
  onClick?: () => void;
}

<<<<<<< Updated upstream
export function MenuNavLink({ oge, className, style, onClick }: MenuNavLinkProps) {
  const yeniSekme = oge.yeniSekme ?? false;
=======
function acilisModuCoz(oge: MenuOgesi): SayfaAcilisModu {
  if (oge.acilisModu) return oge.acilisModu;
  if (oge.yeniSekme) return 'yeni_sekme';
  return 'normal';
}

export function MenuNavLink({ oge, className, onClick }: MenuNavLinkProps) {
  const { modalAc } = useSayfaModal();
  const mod = acilisModuCoz(oge);
>>>>>>> Stashed changes
  const harici = hariciLinkMi(oge.yol);
  const anchor = anchorLinkMi(oge.yol);

  if (mod === 'modal' && !harici && !anchor) {
    const slug = linktenSlugCikar(oge.yol);
    return (
      <button
        type="button"
        className={className}
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
