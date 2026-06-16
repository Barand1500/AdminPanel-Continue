import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** //gt-admin gibi çoklu slash içeren URL'leri düzeltir */
export function PathNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const normalized = location.pathname.replace(/\/{2,}/g, '/');
    if (normalized !== location.pathname) {
      navigate(`${normalized}${location.search}${location.hash}`, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
}
