import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SeoYonlendirmeKontrolProps {
  yonlendirmeler?: { kaynakUrl: string; hedefUrl: string; kod: number }[];
}

/** SEO 301 yönlendirmelerini public sitede uygular */
export function SeoYonlendirmeKontrol({ yonlendirmeler }: SeoYonlendirmeKontrolProps) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!yonlendirmeler?.length) return;

    const path = location.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    const eslesen = yonlendirmeler.find(
      (y) => y.kaynakUrl === path || y.kaynakUrl === location.pathname
    );
    if (!eslesen || eslesen.hedefUrl === path) return;

    navigate(`${eslesen.hedefUrl}${location.search}${location.hash}`, { replace: true });
  }, [location.pathname, location.search, location.hash, navigate, yonlendirmeler]);

  return null;
}
