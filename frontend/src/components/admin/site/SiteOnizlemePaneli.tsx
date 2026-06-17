import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useSiteAyarlariYonetimi } from '@/contexts/SiteAyarlariContext';
import type { HeaderAyarlari } from '@/types/header';
import { ustMenuOgeleriOlustur } from '@/utils/menuYardimci';
import { SiteFooterOnizleme, SiteHeaderOnizleme } from './SiteOnizlemeBilesenleri';
import { AdminPanelKarti } from '@/components/admin/ortak/AdminBilesenleri';

interface SiteOnizlemePaneliProps {
  tip: 'gorunum' | 'header' | 'footer';
  siteAd?: string;
  headerAyarlari?: HeaderAyarlari | null;
  iletisim?: { telefon?: string | null; email?: string | null };
}

export function SiteOnizlemePaneli({ tip, siteAd, headerAyarlari, iletisim }: SiteOnizlemePaneliProps) {
  const { ayarlar, site, headerAyarlari: ctxHeader } = useSiteAyarlariYonetimi();
  const ad = siteAd ?? site?.ad ?? 'Güzel Teknoloji';
  const header = headerAyarlari ?? ctxHeader;
  const menuOgeleri = ustMenuOgeleriOlustur(header.ustMenu ?? []);

  const onizlemeStili = {
    '--color-primary': ayarlar?.anaRenk ?? '#7c3aed',
    '--color-primary-light': ayarlar?.ikincilRenk ?? '#a78bfa',
    '--color-primary-dark': ayarlar?.anaRenk ?? '#7c3aed',
    '--color-accent': `${ayarlar?.ikincilRenk ?? '#a78bfa'}22`,
    fontFamily: ayarlar?.font ?? 'Inter',
  } as CSSProperties;

  return (
    <AdminPanelKarti
      baslik="Canlı Önizleme"
      altBaslik="Form değişiklikleri anında yansır — Kaydet ile public site güncellenir"
      ustAksiyon={
        <Link
          to="/"
          target="_blank"
          className="text-xs text-blue-400 hover:underline"
        >
          Public siteyi aç →
        </Link>
      }
    >
      <div
        className={`site-public rounded-lg border border-[var(--ap-border)] ${
          tip === 'header' ? 'overflow-hidden' : 'ap-scroll max-h-[70vh] overflow-y-auto overflow-x-hidden'
        }`}
        style={onizlemeStili}
      >
        {(tip === 'header' || tip === 'gorunum') && (
          <SiteHeaderOnizleme
            siteAdi={ad}
            ayarlar={ayarlar}
            headerAyarlari={headerAyarlari}
            iletisim={iletisim}
            menuOgeleri={
              menuOgeleri.length > 0
                ? menuOgeleri
                : [
                    { baslik: 'Ana Sayfa', yol: '/' },
                    { baslik: 'Ürünler', yol: '/urunler' },
                  ]
            }
          />
        )}

        {tip === 'gorunum' && (
          <div className="p-6" style={{ fontFamily: ayarlar?.font ?? 'Inter' }}>
            <div
              className="mb-3 h-2 w-24 rounded"
              style={{ backgroundColor: ayarlar?.anaRenk ?? '#7c3aed' }}
            />
            <p className="text-sm text-slate-600">
              Ana renk: <strong>{ayarlar?.anaRenk}</strong> · İkincil:{' '}
              <strong>{ayarlar?.ikincilRenk}</strong> · Font:{' '}
              <strong>{ayarlar?.font ?? 'Inter'}</strong>
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: ayarlar?.anaRenk ?? '#7c3aed' }}
            >
              Örnek Buton
            </button>
          </div>
        )}

        {(tip === 'footer' || tip === 'gorunum') && (
          <SiteFooterOnizleme siteAdi={ad} ayarlar={ayarlar} />
        )}
      </div>
    </AdminPanelKarti>
  );
}
