import type { FooterMagazaBadge } from '@/data/footerMagazaBadgeleri';
import { MagazaBadgeSvg } from '@/data/footerMagazaBadgeleri';

export function FooterMagazaBadgeGoster({
  badge,
  className = 'footer-magaza-badge-img',
}: {
  badge: FooterMagazaBadge;
  className?: string;
}) {
  if (badge.stil === 'ozel' && badge.ozelGorselUrl) {
    return <img src={badge.ozelGorselUrl} alt="" className={className} />;
  }
  return <MagazaBadgeSvg tip={badge.tip} stil={badge.stil} className={className} />;
}

export function aktifMagazaBadgeleri(magazalar?: FooterMagazaBadge[]) {
  return (magazalar ?? []).filter((m) => m.aktif && m.url.trim().length > 0);
}
