import { Navigate } from 'react-router-dom';
import { DinamikSayfaSayfasi } from '@/pages/DinamikSayfaSayfasi';

/** Public site catch-all — admin path'lerini 404'e düşürmez, dinamik sayfa dener */
export function PublicCatchAll() {
  const adminPath = window.location.pathname.replace(/\/{2,}/g, '/');

  if (adminPath === '/gt-admin' || adminPath.startsWith('/gt-admin/')) {
    return <Navigate to="/gt-admin" replace />;
  }

  return <DinamikSayfaSayfasi />;
}
