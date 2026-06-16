import { useCallback, useEffect, useState } from 'react';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { usePanelDil } from '@/contexts/PanelDilContext';
import { SistemSekmeCubugu } from '@/components/admin/sistem/SistemSekmeCubugu';
import {
  PanelDilSekme,
  SistemBakimSekme,
  SistemGenelSekme,
} from '@/components/admin/sistem/SistemSekmeleri';
import {
  Sistem404Sekme,
  SistemBilgiPaneli,
  SistemGuvenlikSekme,
} from '@/components/admin/sistem/Sistem404VeGuvenlik';
import {
  AdminModulKabuk,
  AdminPanelKarti,
  BildirimKutusu,
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { sistemAyarlariGetir, sistemAyarlariGuncelle } from '@/features/admin/sistemAyarlariApi';
import { bosSistemForm, sistemdenForm, type SistemAyarlariForm, type SistemSekmeId } from '@/types/sistemAyarlari';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

export function SistemAyarlariSayfasi() {
  const { dilAyarla, cevirileriAyarla } = usePanelDil();
  const [form, setForm] = useState<SistemAyarlariForm>(bosSistemForm);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [siteAdi, setSiteAdi] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [surum, setSurum] = useState('');
  const [sekme, setSekme] = useState<SistemSekmeId>('genel');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const kaydet = useCallback(async () => {
    setKaydediliyor(true);
    setHata('');
    setBasari('');
    try {
      const veri = await sistemAyarlariGuncelle(form);
      setBasari('Sistem ayarları kaydedildi.');
      setSiteAdi(veri.site.ad);
      setSiteSlug(veri.site.slug);
      setSurum(veri.surum);
      const yeniForm = sistemdenForm(veri.site, veri.sistem);
      setForm(yeniForm);
      dilAyarla(yeniForm.panelDili);
      cevirileriAyarla(yeniForm.panelCeviriler);
      siteVerisiGuncellendiYayinla();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, dilAyarla, cevirileriAyarla]);

  useEffect(() => {
    void (async () => {
      try {
        const [veri, sayfaListesi] = await Promise.all([sistemAyarlariGetir(), adminSayfalariGetir()]);
        setSayfalar(sayfaListesi);
        setSiteAdi(veri.site.ad);
        setSiteSlug(veri.site.slug);
        setSurum(veri.surum);
        const yuklenen = sistemdenForm(veri.site, veri.sistem);
        setForm(yuklenen);
        dilAyarla(yuklenen.panelDili);
        cevirileriAyarla(yuklenen.panelCeviriler);
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Ayarlar alınamadı');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, [dilAyarla, cevirileriAyarla]);

  useModulAksiyonlari({ kaydet }, { kaydet: !kaydediliyor });

  if (yukleniyor) return <YukleniyorDurumu mesaj="Sistem ayarları yükleniyor..." />;

  return (
    <AdminModulKabuk baslik="Sistem Ayarları" aciklama={`${siteAdi} — site durumu, bakım, 404 ve panel tercihleri`}>
      {hata && <BildirimKutusu mesaj={hata} tur="hata" />}
      {basari && <BildirimKutusu mesaj={basari} tur="basari" />}
      {kaydediliyor && <BildirimKutusu mesaj="Kaydediliyor..." tur="bilgi" />}

      <div className="ap-sistem-yonetimi">
        <div className="ap-sistem-layout">
          <aside className="ap-sistem-sol">
            <SistemSekmeCubugu aktif={sekme} onDegistir={setSekme} />
            <div className="mt-4">
              <SistemBilgiPaneli siteSlug={siteSlug} surum={surum} siteAdi={siteAdi} form={form} />
            </div>
          </aside>

          <div className="ap-sistem-icerik">
            <AdminPanelKarti
              baslik={SEKME_BASLIK[sekme]}
              altBaslik={SEKME_ALT[sekme]}
            >
              {sekme === 'genel' && <SistemGenelSekme form={form} onChange={setForm} />}
              {sekme === 'bakim' && <SistemBakimSekme form={form} onChange={setForm} siteAdi={siteAdi} />}
              {sekme === 'sayfa404' && <Sistem404Sekme form={form} sayfalar={sayfalar} onChange={setForm} />}
              {sekme === 'dil' && <PanelDilSekme form={form} onChange={setForm} />}
              {sekme === 'guvenlik' && <SistemGuvenlikSekme form={form} onChange={setForm} />}
              {sekme === 'sistem' && (
                <SistemBilgiPaneli siteSlug={siteSlug} surum={surum} siteAdi={siteAdi} form={form} />
              )}
            </AdminPanelKarti>
          </div>
        </div>
      </div>
    </AdminModulKabuk>
  );
}

const SEKME_BASLIK: Record<SistemSekmeId, string> = {
  genel: 'Genel Ayarlar',
  bakim: 'Bakım Modu',
  sayfa404: '404 Sayfası',
  dil: 'Panel Dili & Çeviriler',
  guvenlik: 'Güvenlik & Yedekleme',
  sistem: 'Sistem Bilgisi',
};

const SEKME_ALT: Record<SistemSekmeId, string> = {
  genel: 'Yayın durumu ve domain',
  bakim: 'Bakım ekranı ve görsel',
  sayfa404: 'Menü ve içerik yapılandırması',
  dil: 'JSON çeviri editörü',
  guvenlik: 'Güvenlik başlıkları ve otomatik yedek',
  sistem: 'Teknik özet',
};
