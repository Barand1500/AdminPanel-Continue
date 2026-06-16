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
import { HesapProfilSayfasi, HesapSifreSayfasi, HesapBosSayfa } from '@/pages/hesap/HesapAltSayfalar';
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
          {
            path: '/hesabim/serbest-odeme',
            element: <HesapBosSayfa baslik="Serbest Ödeme" aciklama="Serbest ödeme özelliği yakında aktif olacak." />,
          },
          {
            path: '/hesabim/adresler',
            element: <HesapBosSayfa baslik="Adreslerim" aciklama="Kayıtlı adresleriniz burada listelenecek." />,
          },
          {
            path: '/hesabim/fatura',
            element: <HesapBosSayfa baslik="Fatura Bilgilerim" aciklama="Fatura bilgilerinizi buradan yönetebileceksiniz." />,
          },
          {
            path: '/hesabim/siparisler',
            element: <HesapBosSayfa baslik="Siparişlerim" aciklama="Sipariş geçmişiniz burada görünecek." />,
          },
          {
            path: '/hesabim/kayitli-sepetler',
            element: <HesapBosSayfa baslik="Kayıtlı Sepetlerim" aciklama="Kayıtlı sepetleriniz burada listelenecek." />,
          },
          {
            path: '/hesabim/iade-degisim',
            element: <HesapBosSayfa baslik="İade/Değişim Talepleri" aciklama="İade ve değişim talepleriniz burada takip edilecek." />,
          },
          { path: '/favoriler', element: <FavorilerSayfasi /> },
          { path: '/sepet', element: <SepetSayfasi /> },
          { path: '*', element: <PublicCatchAll />, handle: { is404: true } },
        ],
      },
    ],
  },
]);
