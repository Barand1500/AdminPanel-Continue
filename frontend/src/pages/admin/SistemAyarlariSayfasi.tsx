import { useCallback, useEffect, useState } from 'react';
import { useModulAksiyonlari } from '@/hooks/useModulAksiyonlari';
import { useAdminAksiyon } from '@/contexts/AdminAksiyonContext';
import { useAdminSayfaBildirimi } from '@/hooks/useAdminSayfaBildirimi';
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
  YukleniyorDurumu,
} from '@/components/admin/ortak/AdminBilesenleri';
import { adminSayfalariGetir, type AdminSayfa } from '@/features/admin/sayfaApi';
import { sistemAyarlariGetir, sistemAyarlariGuncelle } from '@/features/admin/sistemAyarlariApi';
import { bosSistemForm, sistemdenForm, type SistemAyarlariForm, type SistemSekmeId } from '@/types/sistemAyarlari';
import { SagTikPaneliYonetimSekme } from '@/components/admin/sistem/SagTikPaneliYonetimSekme';
import { sagTikAyarlariYayinla } from '@/utils/sagTikPanelYardimci';
import { siteVerisiGuncellendiYayinla } from '@/utils/siteVerisiOlaylari';

export function SistemAyarlariSayfasi() {
  const { dilAyarla, cevirileriAyarla } = usePanelDil();
  const { basariBildir, hataBildir } = useAdminSayfaBildirimi();
  const { aksiyonGeriBildirimiGoster } = useAdminAksiyon();
  const [form, setForm] = useState<SistemAyarlariForm>(bosSistemForm);
  const [sayfalar, setSayfalar] = useState<AdminSayfa[]>([]);
  const [siteAdi, setSiteAdi] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [surum, setSurum] = useState('');
  const [sekme, setSekme] = useState<SistemSekmeId>('genel');
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const kaydet = useCallback(async () => {
    setKaydediliyor(true);
    try {
      const veri = await sistemAyarlariGuncelle(form);
      basariBildir('Sistem ayarları kaydedildi.');
      setSiteAdi(veri.site.ad);
      setSiteSlug(veri.site.slug);
      setSurum(veri.surum);
      const yeniForm = sistemdenForm(veri.site, veri.sistem);
      setForm(yeniForm);
      dilAyarla(yeniForm.panelDili);
      cevirileriAyarla(yeniForm.panelCeviriler);
      siteVerisiGuncellendiYayinla();
      sagTikAyarlariYayinla();
    } catch (err) {
      hataBildir(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, dilAyarla, cevirileriAyarla, basariBildir, hataBildir]);

  const siteAktifToggle = useCallback(
    async (aktif: boolean) => {
      const onceki = form;
      const guncel = { ...form, siteAktif: aktif };
      setForm(guncel);

      setKaydediliyor(true);
      try {
        const veri = await sistemAyarlariGuncelle(guncel);
        basariBildir(aktif ? 'Site yayına alındı.' : 'Site kapatıldı. Ziyaretçiler erişemez.');
        aksiyonGeriBildirimiGoster('kaydet');
        setSiteAdi(veri.site.ad);
        setSiteSlug(veri.site.slug);
        setSurum(veri.surum);
        const yeniForm = sistemdenForm(veri.site, veri.sistem);
        setForm(yeniForm);
        dilAyarla(yeniForm.panelDili);
        cevirileriAyarla(yeniForm.panelCeviriler);
        siteVerisiGuncellendiYayinla();
        sagTikAyarlariYayinla();
      } catch (err) {
        setForm(onceki);
        hataBildir(err instanceof Error ? err.message : 'Site durumu güncellenemedi');
      } finally {
        setKaydediliyor(false);
      }
    },
    [form, dilAyarla, cevirileriAyarla, basariBildir, hataBildir, aksiyonGeriBildirimiGoster]
  );

  const bakimModuToggle = useCallback(async () => {
    const yeniBakim = !form.bakimModu;
    const guncel = { ...form, bakimModu: yeniBakim };
    setForm(guncel);
    if (yeniBakim) setSekme('bakim');

    setKaydediliyor(true);
    try {
      const veri = await sistemAyarlariGuncelle(guncel);
      basariBildir(yeniBakim ? 'Bakım modu açıldı.' : 'Bakım modu kapatıldı.');
      aksiyonGeriBildirimiGoster('kaydet');
      setSiteAdi(veri.site.ad);
      setSiteSlug(veri.site.slug);
      setSurum(veri.surum);
      const yeniForm = sistemdenForm(veri.site, veri.sistem);
      setForm(yeniForm);
      dilAyarla(yeniForm.panelDili);
      cevirileriAyarla(yeniForm.panelCeviriler);
      siteVerisiGuncellendiYayinla();
      sagTikAyarlariYayinla();
    } catch (err) {
      setForm(form);
      hataBildir(err instanceof Error ? err.message : 'Bakım modu güncellenemedi');
    } finally {
      setKaydediliyor(false);
    }
  }, [form, dilAyarla, cevirileriAyarla, basariBildir, hataBildir, aksiyonGeriBildirimiGoster]);

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
        hataBildir(err instanceof Error ? err.message : 'Ayarlar alınamadı');
      } finally {
        setYukleniyor(false);
      }
    })();
  }, [dilAyarla, cevirileriAyarla, hataBildir]);

  useModulAksiyonlari({ kaydet }, { kaydet: !kaydediliyor });

  if (yukleniyor) return <YukleniyorDurumu mesaj="Sistem ayarları yükleniyor..." />;

  return (
    <AdminModulKabuk baslik="Sistem Ayarları" aciklama={`${siteAdi} — site durumu, bakım, 404 ve panel tercihleri`}>

      <div className="ap-sistem-yonetimi">
        <div className="ap-sistem-layout">
          <aside className="ap-sistem-sol">
            <SistemSekmeCubugu aktif={sekme} onDegistir={setSekme} />
            <div className="mt-4">
              <SistemBilgiPaneli
                siteSlug={siteSlug}
                surum={surum}
                siteAdi={siteAdi}
                form={form}
                onBakimToggle={bakimModuToggle}
                bakimIslemYukleniyor={kaydediliyor}
              />
            </div>
          </aside>

          <div className="ap-sistem-icerik">
            <AdminPanelKarti
              baslik={SEKME_BASLIK[sekme]}
              altBaslik={SEKME_ALT[sekme]}
            >
              {sekme === 'genel' && (
                <SistemGenelSekme
                  form={form}
                  onChange={setForm}
                  onSiteAktifDegis={siteAktifToggle}
                  siteAktifIslemde={kaydediliyor}
                />
              )}
              {sekme === 'bakim' && <SistemBakimSekme form={form} onChange={setForm} siteAdi={siteAdi} />}
              {sekme === 'sayfa404' && <Sistem404Sekme form={form} sayfalar={sayfalar} onChange={setForm} />}
              {sekme === 'dil' && <PanelDilSekme form={form} onChange={setForm} />}
              {sekme === 'guvenlik' && <SistemGuvenlikSekme form={form} onChange={setForm} />}
              {sekme === 'sagTik' && <SagTikPaneliYonetimSekme form={form} onChange={setForm} />}
            </AdminPanelKarti>          </div>
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
  sagTik: 'Sağ Tık Paneli',
};

const SEKME_ALT: Record<SistemSekmeId, string> = {
  genel: 'Yayın durumu ve domain',
  bakim: 'Bakım ekranı ve görsel',
  sayfa404: 'Menü ve içerik yapılandırması',
  dil: 'JSON çeviri editörü',
  guvenlik: 'Güvenlik başlıkları ve otomatik yedek',
  sagTik: 'Admin panel sağ tık menüsü öğeleri ve modül listesi',
};