import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { SistemKesifButonu } from '@/components/admin/kesif/SistemKesifButonu';
import { AdminSiteOnizleLink } from '@/components/admin/AdminHeader';
import { YukleniyorDurumu } from '@/components/admin/ortak/AdminBilesenleri';
import { AdminDurumEtiketi } from '@/components/admin/ortak/AdminFormBilesenleri';
import { DashboardHizliErisim } from '@/components/admin/dashboard/DashboardHizliErisim';
import { dashboardOzetGetir, type DashboardOzet } from '@/features/admin/dashboardApi';
import { hizliErisimModulleri } from '@/utils/dashboardTercihleri';

interface DashboardSayfasiProps {
  onModulAc: (modulId: string) => void;
}

type Hareket = {
  id: string;
  baslik: string;
  etiket: string;
  tur: 'yayinda' | 'taslak' | 'aktif' | 'bilgi';
  tarih: string;
  modul: string;
};

function tarihKisa(iso: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function bugununTarihi() {
  return new Intl.DateTimeFormat('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
}

function selamlama() {
  const saat = new Date().getHours();
  if (saat < 12) return 'Günaydın';
  if (saat < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

function hareketleriBirlesir(ozet: DashboardOzet): Hareket[] {
  const bloglar: Hareket[] = ozet.sonBloglar.map((b) => ({
    id: `blog-${b.id}`,
    baslik: b.baslik,
    etiket: b.yayinda ? 'Blog' : 'Taslak',
    tur: b.yayinda ? 'yayinda' : 'taslak',
    tarih: b.olusturma,
    modul: 'blog',
  }));
  const formlar: Hareket[] = ozet.sonGonderimler.map((g) => ({
    id: `form-${g.id}`,
    baslik: g.formAd,
    etiket: g.okundu ? 'Form' : 'Yeni',
    tur: g.okundu ? 'bilgi' : 'aktif',
    tarih: g.olusturma,
    modul: 'formlar',
  }));
  return [...bloglar, ...formlar]
    .sort((a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime())
    .slice(0, 8);
}

export function DashboardSayfasi({ onModulAc }: DashboardSayfasiProps) {
  const { kullanici } = useAuth();
  const [ozet, setOzet] = useState<DashboardOzet | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  const hizliModuller = useMemo(
    () => hizliErisimModulleri(kullanici?.tercihler?.dashboardHizliErisim),
    [kullanici?.tercihler?.dashboardHizliErisim]
  );

  useModulAksiyonlari({ onizle: () => window.open('/', '_blank') }, { onizle: true });

  useEffect(() => {
    void (async () => {
      try {
        const veri = await dashboardOzetGetir();
        setOzet(veri);
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Dashboard yüklenemedi');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  if (yukleniyor) {
    return <YukleniyorDurumu mesaj="Dashboard yükleniyor..." />;
  }

  if (!ozet) {
    return <p className="ap-home-hata">{hata || 'Dashboard verisi alınamadı.'}</p>;
  }

  const ad = kullanici?.ad?.split(' ')[0];
  const s = ozet.istatistikler;
  const hareketler = hareketleriBirlesir(ozet);
  const bekleyen = s.okunmamisGonderim;

  const kartlar = [
    {
      etiket: 'Sayfalar',
      deger: s.yayindaSayfa,
      alt: `${s.sayfaSayisi} toplam`,
      modul: 'sayfalar',
    },
    {
      etiket: 'Blog',
      deger: s.yayindaBlog,
      alt: `${s.blogSayisi} toplam`,
      modul: 'blog',
    },
    {
      etiket: 'Form gönderimi',
      deger: s.gonderimSayisi,
      alt: bekleyen > 0 ? `${bekleyen} bekleyen` : `${s.formSayisi} form`,
      modul: 'formlar',
      vurgu: bekleyen > 0,
    },
    {
      etiket: 'Widget',
      deger: s.widgetSayisi,
      alt: 'Aktif bileşenler',
      modul: 'widget-yonetimi',
    },
    {
      etiket: 'Medya',
      deger: s.medyaSayisi,
      alt: 'Yüklenen dosya',
      modul: 'medya',
    },
  ];

  return (
    <div className="ap-home">
      <header className="ap-home-ust">
        <div>
          <h1 className="ap-home-baslik">
            {selamlama()}
            {ad ? `, ${ad}` : ''}
          </h1>
          <p className="ap-home-tarih">{bugununTarihi()}</p>
        </div>
        <div className="ap-home-ust-sag">
          <SistemKesifButonu />
          <AdminSiteOnizleLink />
        </div>
      </header>

      {hata && <p className="ap-home-hata">{hata}</p>}

      {bekleyen > 0 && (
        <button type="button" className="ap-home-uyari" onClick={() => onModulAc('formlar')}>
          <span className="ap-home-uyari-sayi">{bekleyen}</span>
          <span>
            okunmamış form gönderimi var. Gönderimler sekmesinden yanıtlayın.
          </span>
        </button>
      )}

      <section className="ap-home-kpi" data-ap-kesif="dash-kpi">
        {kartlar.map((k) => (
          <button
            key={k.etiket}
            type="button"
            className={`ap-home-kart${k.vurgu ? ' ap-home-kart--vurgu' : ''}`}
            onClick={() => onModulAc(k.modul)}
          >
            <span className="ap-home-kart-etiket">{k.etiket}</span>
            <span className="ap-home-kart-deger">{k.deger.toLocaleString('tr-TR')}</span>
            <span className="ap-home-kart-alt">{k.alt}</span>
          </button>
        ))}
      </section>

      <div className="ap-home-govde">
        <section className="ap-home-panel">
          <div className="ap-home-panel-baslik">
            <h2>Son hareket</h2>
            <span className="ap-muted text-xs">{hareketler.length} kayıt</span>
          </div>
          {hareketler.length === 0 ? (
            <p className="ap-home-bos">Henüz blog yazısı veya form gönderimi yok.</p>
          ) : (
            <ul className="ap-home-liste">
              {hareketler.map((h) => (
                <li key={h.id}>
                  <button type="button" className="ap-home-satir" onClick={() => onModulAc(h.modul)}>
                    <span className="ap-home-satir-govde">
                      <span className="ap-home-satir-baslik">{h.baslik}</span>
                      <span className="ap-home-satir-meta">{tarihKisa(h.tarih)}</span>
                    </span>
                    <AdminDurumEtiketi tur={h.tur}>{h.etiket}</AdminDurumEtiketi>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <DashboardHizliErisim moduller={hizliModuller} onModulAc={onModulAc} />
      </div>
    </div>
  );
}
