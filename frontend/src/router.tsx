import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { PathNormalizer } from '@/components/ortak/PathNormalizer';
import { SiteLayout } from '@/components/ortak/SiteLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PublicCatchAll } from '@/components/ortak/PublicCatchAll';
import { AnaSayfa } from '@/pages/AnaSayfa';
import { HakkimizdaSayfasi } from '@/pages/HakkimizdaSayfasi';
import { UrunlerSayfasi } from '@/pages/UrunlerSayfasi';
import { IletisimSayfasi } from '@/pages/IletisimSayfasi';
import { HesapGirisFormu } from '@/pages/hesap/HesapGirisFormu';
import { HesapPanelSayfasi } from '@/pages/hesap/HesapPanelSayfasi';
import { HesapProfilSayfasi, HesapSifreSayfasi } from '@/pages/hesap/HesapAltSayfalar';
import { FavorilerSayfasi } from '@/pages/FavorilerSayfasi';
import { SepetSayfasi } from '@/pages/SepetSayfasi';
import { BlogSayfasi } from '@/pages/BlogSayfasi';
import { BlogDetaySayfasi } from '@/pages/BlogDetaySayfasi';

function RouterShell() {
  return (
    <>
      <PathNormalizer />
      <Outlet />
    </>
  );
}

export const siteRouter = createBrowserRouter([
  {
    element: <RouterShell />,
    children: [
      {
        path: '/gt-admin/giris',
        element: <Navigate to="/gt-admin" replace />,
      },
      {
        path: '/gt-admin/*',
        element: <AdminLayout />,
      },
      {
        element: <SiteLayout />,
        children: [
          { path: '/', element: <AnaSayfa /> },
          { path: '/hakkimizda', element: <HakkimizdaSayfasi /> },
          { path: '/urunler', element: <UrunlerSayfasi /> },
          { path: '/urunler-hizmetler', element: <UrunlerSayfasi /> },
          { path: '/iletisim', element: <IletisimSayfasi /> },
          { path: '/blog', element: <BlogSayfasi /> },
          { path: '/blog/:slug', element: <BlogDetaySayfasi /> },
          { path: '/hesabim', element: <HesapGirisFormu /> },
          { path: '/hesabim/panel', element: <HesapPanelSayfasi /> },
          { path: '/hesabim/profil', element: <HesapProfilSayfasi /> },
          { path: '/hesabim/sifre', element: <HesapSifreSayfasi /> },
          { path: '/favoriler', element: <FavorilerSayfasi /> },
          { path: '/sepet', element: <SepetSayfasi /> },
          { path: '*', element: <PublicCatchAll />, handle: { is404: true } },
        ],
      },
    ],
  },
]);
